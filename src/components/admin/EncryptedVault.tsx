import { useState, useEffect } from "react";
import { Lock, Unlock, Key, Plus, Trash2, Copy, CheckCircle2, ShieldAlert } from "lucide-react";
import { encryptVaultData, decryptVaultData } from "@/utils/crypto";
import { toast } from "sonner";

type VaultItem = { id: string; service: string; apiKey: string };

export const EncryptedVault = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // New Item State
  const [newService, setNewService] = useState("");
  const [newKey, setNewKey] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check if vault has data
  const hasVaultData = !!window.localStorage.getItem("bo3_vault_cipher");

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsProcessing(true);

    try {
      if (hasVaultData) {
        const cipher = window.localStorage.getItem("bo3_vault_cipher")!;
        const iv = window.localStorage.getItem("bo3_vault_iv")!;
        const salt = window.localStorage.getItem("bo3_vault_salt")!;
        
        const decryptedItems = await decryptVaultData(cipher, iv, salt, password);
        setItems(decryptedItems);
      }
      setIsLocked(false);
      toast.success("Vault Unlocked");
    } catch (error) {
      toast.error("Incorrect Master Password or Corrupted Vault");
    } finally {
      setIsProcessing(false);
    }
  };

  const syncToStorage = async (newItems: VaultItem[]) => {
    try {
      const { cipherBase64, ivBase64, saltBase64 } = await encryptVaultData(newItems, password);
      window.localStorage.setItem("bo3_vault_cipher", cipherBase64);
      window.localStorage.setItem("bo3_vault_iv", ivBase64);
      window.localStorage.setItem("bo3_vault_salt", saltBase64);
    } catch (e) {
      toast.error("Failed to encrypt and save vault.");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService || !newKey) return;

    const newItem: VaultItem = { id: Date.now().toString(), service: newService, apiKey: newKey };
    const newItems = [...items, newItem];
    setItems(newItems);
    await syncToStorage(newItems);

    setNewService("");
    setNewKey("");
    toast.success("Key Encrypted and Saved");
  };

  const handleRemoveItem = async (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    await syncToStorage(newItems);
    toast.success("Key Removed");
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleLock = () => {
    setItems([]);
    setPassword("");
    setIsLocked(true);
    toast.success("Vault Locked");
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full w-full">
        <div className="glass-panel p-8 rounded-2xl border border-destructive/20 max-w-md w-full text-center space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50" />
          
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          
          <div>
            <h2 className="text-xl font-display font-bold text-destructive tracking-widest uppercase">Encrypted Vault</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {hasVaultData 
                ? "Enter your Master Password to decrypt your API keys." 
                : "Initialize your vault by creating a Master Password. Do not forget it."}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Master Password..."
                className="w-full bg-background-elevated border border-destructive/30 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-destructive/80 focus:shadow-glow-destructive transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/50 font-bold py-3 rounded-lg transition-all tracking-widest uppercase text-xs"
            >
              {isProcessing ? "Decrypting..." : hasVaultData ? "Unlock Vault" : "Initialize Vault"}
            </button>
          </form>

          <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground/60 justify-center">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Zero-Knowledge AES-GCM Encryption</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-success/5 border border-success/20 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Unlock className="w-5 h-5 text-success" />
          <div>
            <h3 className="text-sm font-bold text-success uppercase tracking-widest">Vault Unlocked</h3>
            <p className="text-xs text-muted-foreground">Keys are decrypted in RAM only.</p>
          </div>
        </div>
        <button onClick={handleLock} className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md text-xs font-bold uppercase tracking-widest transition">
          Lock Vault
        </button>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border">
        <h3 className="text-sm font-semibold mb-4 text-primary">Store New Key</h3>
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Service (e.g. OpenAI, AWS)" 
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="sm:w-1/3 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            required
          />
          <input 
            type="password" 
            placeholder="sk-..." 
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/50"
            required
          />
          <button type="submit" className="bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Save
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 opacity-50">Vault is empty.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 glass-panel border border-border rounded-lg group hover:border-primary/30 transition">
              <div>
                <h4 className="font-bold text-sm">{item.service}</h4>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  •••••••••••••••••••••••• {item.apiKey.slice(-4)}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => copyToClipboard(item.id, item.apiKey)}
                  className="p-2 bg-background-elevated hover:bg-primary/20 text-muted-foreground hover:text-primary rounded-md transition"
                >
                  {copiedId === item.id ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 bg-background-elevated hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
