import { useState, useEffect, useCallback } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { EquipmentForm } from "./EquipmentForm";
import { EquipmentList } from "./EquipmentList";
import type { HardwareNode } from "./EquipmentForm";

export const EquipmentManager = () => {
  const [nodesRegistry, setNodesRegistry] = useState<HardwareNode[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [draftNode, setDraftNode] = useState<Partial<HardwareNode> | null>(null);

  const fetchNodes = useCallback(async () => {
    setIsInitializing(true);
    try {
      const data = await safeFetchAll<HardwareNode>("equipment", { order: "display_order", ascending: true });
      setNodesRegistry(data);
    } catch (error) {
      toast.error("Failed to synchronize hardware matrix from the core database.");
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const purgeNode = async (id: string) => {
    if (!window.confirm("Permanently purge this hardware node from the matrix?")) return;

    const { success, error } = await dbDelete("equipment", id);
    if (error) return toast.error(`Purge failed: ${error}`);
    
    if (success) {
      setNodesRegistry((prev) => prev.filter(n => n.id !== id));
      toast.success("Node successfully purged.");
    }
  };

  const commitNode = async () => {
    if (!draftNode?.name?.trim()) return toast.error("Hardware designation is required.");

    const payload = {
      ...draftNode,
      category: draftNode.category || "hardware",
      display_order: draftNode.display_order ?? nodesRegistry.length,
    };

    if (draftNode.id) {
      const success = await mutateWithToast<HardwareNode>(
        () => dbUpdate<HardwareNode>("equipment", draftNode.id!, payload),
        "Node configuration updated."
      );
      if (success) await fetchNodes();
    } else {
      const newNode = await mutateWithToast<HardwareNode>(
        () => dbInsert<HardwareNode>("equipment", payload),
        "New node deployed to matrix."
      );
      if (newNode) setNodesRegistry((prev) => [...prev, newNode]);
    }

    setDraftNode(null);
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary h-6 w-6" />
      </div>
    );
  }

  if (draftNode) {
    return (
      <EquipmentForm
        draftNode={draftNode}
        onChange={setDraftNode}
        onSave={commitNode}
        onCancel={() => setDraftNode(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Equipment Matrix</h3>
        <button 
          onClick={() => setDraftNode({ category: "hardware" })}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Register Node
        </button>
      </div>

      <EquipmentList
        nodesRegistry={nodesRegistry}
        onEdit={setDraftNode}
        onDelete={purgeNode}
      />
    </div>
  );
};
