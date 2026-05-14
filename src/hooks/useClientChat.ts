import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase, isDemoMode, safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbBulkUpdate } from "@/integrations/supabase/mutations";

export interface ChatMessage {
  id: string;
  client_token_id?: string;
  sender: "client" | "omar";
  text: string;
  read: boolean;
  created_at: string;
  timestamp?: number; // local-only for offline mode
}

const SEED: ChatMessage[] = [
  { id: "m1", sender: "omar", text: "Welcome to your Client Portal. Your project dashboard is live — feel free to review milestones and drop any questions here.", read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "m2", sender: "client", text: "Thanks Omar! The IoT dashboard progress looks great. Quick question — can we add a dark/light toggle for the end-user UI?", read: true, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "m3", sender: "omar", text: "Absolutely. I'll scope that into the Dashboard UI Polish milestone. ETA: end of this sprint.", read: true, created_at: new Date(Date.now() - 900000).toISOString() },
];

const isOffline = () => !hasSupabase || isDemoMode();
const getSessionTokenId = () => sessionStorage.getItem("nexus_client_token_id") || "ct-1";

/**
 * useClientChat — bidirectional chat between client portal and admin.
 *
 * @param role - "client" (client portal) or "omar" (admin side)
 * @param overrideTokenId - optional: admin side passes the selected client's token ID
 *                          to switch channels. Clients use their session token.
 */
export function useClientChat(role: "client" | "omar", overrideTokenId?: string | null) {
  const tokenId = overrideTokenId ?? getSessionTokenId();
  const lsKey = `bo3_client_chat_${tokenId}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const channelRef = useRef<any>(null);

  // --- Load ---
  useEffect(() => {
    let live = true;
    setMessages([]); // reset on channel switch

    (async () => {
      if (isOffline()) {
        const saved = localStorage.getItem(lsKey);
        if (saved) {
          try { setMessages(JSON.parse(saved)); return; } catch { /* corrupt */ }
        }
        // Show seed only for the first/default channel
        if (tokenId === "ct-1") setMessages(SEED);
        return;
      }
      const rows = await safeFetchAll<ChatMessage>("chat_messages", {
        order: "created_at", ascending: true, filter: { client_token_id: tokenId },
      });
      if (live) setMessages(rows.length ? rows : tokenId === "ct-1" ? SEED : []);
    })();

    return () => { live = false; };
  }, [tokenId, lsKey]);

  // --- Realtime / localStorage sync ---
  useEffect(() => {
    // Tear down any previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (isOffline()) {
      const onStorage = (e: StorageEvent) => {
        if (e.key === lsKey && e.newValue) {
          try { setMessages(JSON.parse(e.newValue)); } catch { /* ignore */ }
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }

    const ch = supabase
      .channel(`chat-${tokenId}-${role}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `client_token_id=eq.${tokenId}` },
        ({ new: row }) => {
          const msg = row as ChatMessage;
          setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
        })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_messages", filter: `client_token_id=eq.${tokenId}` },
        ({ new: row }) => {
          const msg = row as ChatMessage;
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...msg } : m));
        })
      .subscribe();

    channelRef.current = ch;
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [tokenId, role, lsKey]);

  // --- Send ---
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const optimistic: ChatMessage = {
      id: `m${Date.now()}`,
      client_token_id: tokenId,
      sender: role,
      text: trimmed,
      read: false,
      created_at: new Date().toISOString(),
      timestamp: Date.now(),
    };

    if (isOffline()) {
      setMessages(prev => {
        const next = [...prev, optimistic];
        localStorage.setItem(lsKey, JSON.stringify(next));
        return next;
      });
      return;
    }

    // Optimistic insert, rollback on failure
    setMessages(prev => [...prev, optimistic]);

    const { error } = await dbInsert("chat_messages", {
      client_token_id: tokenId, sender: role, text: trimmed, read: false,
    });

    if (error) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
  }, [role, tokenId, lsKey]);

  // --- Mark read ---
  const markAllAsRead = useCallback(async () => {
    setMessages(prev => {
      const hasUnread = prev.some(m => m.sender !== role && !m.read);
      if (!hasUnread) return prev;

      const next = prev.map(m => m.sender !== role ? { ...m, read: true } : m);

      if (isOffline()) {
        localStorage.setItem(lsKey, JSON.stringify(next));
      } else {
        dbBulkUpdate("chat_messages",
          { client_token_id: tokenId, sender: role === "client" ? "omar" : "client", read: false },
          { read: true }
        );
      }
      return next;
    });
  }, [role, tokenId, lsKey]);

  return { messages, sendMessage, markAllAsRead };
}
