import { useState } from "react";
import { Server, Activity, Cpu, Box, Plus, RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { WebSerialTerminal } from "@/components/admin/WebSerialTerminal";
import { toast } from "sonner";

type HardwareItem = { id: number; name: string; count: number; category: "mcu" | "sensor" | "actuator" | "other" };
type IoTNode = { id: number; name: string; status: "online" | "offline"; ip: string; lastPing: string; type: string };

export const IoTFleetManager = () => {
  const [nodes, setNodes] = useLocalStorage<IoTNode[]>("bo3_iot_nodes", [
    { id: 1, name: "Smart Home Core", status: "online", ip: "192.168.1.100", lastPing: "Just now", type: "Raspberry Pi 4" },
    { id: 2, name: "Weather Station (Balcony)", status: "online", ip: "192.168.1.105", lastPing: "2m ago", type: "ESP32" },
    { id: 3, name: "Plant Monitor", status: "offline", ip: "192.168.1.110", lastPing: "4hrs ago", type: "ESP8266" },
  ]);

  const [inventory, setInventory] = useLocalStorage<HardwareItem[]>("bo3_hw_inventory", [
    { id: 1, name: "ESP32 WROOM", count: 4, category: "mcu" },
    { id: 2, name: "BME280 Temp Sensor", count: 2, category: "sensor" },
    { id: 3, name: "MG996R Servo", count: 5, category: "actuator" },
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemCount, setNewItemCount] = useState(1);
  const [newItemCategory, setNewItemCategory] = useState<HardwareItem["category"]>("sensor");

  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeIp, setNewNodeIp] = useState("");
  const [newNodeType, setNewNodeType] = useState("");

  const addNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim() || !newNodeIp.trim()) return;
    setNodes([...nodes, { 
      id: Date.now(), 
      name: newNodeName, 
      status: "online", 
      ip: newNodeIp, 
      lastPing: "Just now", 
      type: newNodeType || "Generic ESP" 
    }]);
    setNewNodeName("");
    setNewNodeIp("");
    setNewNodeType("");
  };

  const removeNode = (id: number) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const toggleNodeStatus = (id: number) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, status: n.status === "online" ? "offline" : "online" } : n));
  };

  const pingNetwork = async () => {
    toast.info("Pinging local network...");
    const updatedNodes = await Promise.all(nodes.map(async (node) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      try {
        // We use mode: no-cors because we just want to know if the port is open/reachable
        await fetch(`http://${node.ip}`, { mode: 'no-cors', signal: controller.signal });
        clearTimeout(timeoutId);
        return { ...node, status: "online" as const, lastPing: "Just now" };
      } catch (error) {
        clearTimeout(timeoutId);
        return { ...node, status: "offline" as const, lastPing: "Failed" };
      }
    }));
    setNodes(updatedNodes);
    toast.success("Network scan complete");
  };

  const addInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setInventory([...inventory, { id: Date.now(), name: newItemName, count: newItemCount, category: newItemCategory }]);
    setNewItemName("");
    setNewItemCount(1);
  };

  const removeInventory = (id: number) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const onlineNodes = nodes.filter(n => n.status === "online").length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-primary/20 flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg text-primary">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Nodes</div>
            <div className="text-2xl font-bold font-display">{onlineNodes} / {nodes.length}</div>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-secondary/20 flex items-center gap-4">
          <div className="p-3 bg-secondary/20 rounded-lg text-secondary">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Components in Lab</div>
            <div className="text-2xl font-bold font-display">{inventory.reduce((acc, curr) => acc + curr.count, 0)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Fleet Status */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> Live Fleet Status
            </h3>
            <button 
              onClick={pingNetwork}
              className="flex items-center gap-2 text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition"
            >
              <RefreshCw className="w-3 h-3" /> Ping Network
            </button>
          </div>

          {/* Add New Node Form */}
          <form onSubmit={addNode} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Node Name (e.g. Balcony Cam)" 
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              className="flex-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
            <input 
              type="text" 
              placeholder="IP Address" 
              value={newNodeIp}
              onChange={(e) => setNewNodeIp(e.target.value)}
              className="w-32 bg-background-elevated border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
            <input 
              type="text" 
              placeholder="Hardware" 
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              className="w-24 bg-background-elevated border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
            <button type="submit" className="bg-primary/20 text-primary p-2 rounded-lg hover:bg-primary/30 transition">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {nodes.length === 0 ? (
               <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-lg">No active nodes registered.</div>
            ) : nodes.map(node => (
              <div key={node.id} className="p-4 rounded-lg border border-border bg-background-elevated/50 flex justify-between items-center group hover:border-primary/30 transition">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleNodeStatus(node.id)}
                    title="Toggle Status"
                    className={`w-3 h-3 rounded-full cursor-pointer hover:ring-2 ring-offset-2 ring-offset-background ${node.status === 'online' ? 'bg-success ring-success' : 'bg-destructive ring-destructive'}`} 
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">{node.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Cpu className="w-3 h-3" /> {node.type} | {node.ip}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className={`text-xs font-medium uppercase tracking-wider ${node.status === 'online' ? 'text-success' : 'text-destructive'}`}>
                      {node.status}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Ping: {node.lastPing}</div>
                  </div>
                  <button 
                    onClick={() => removeNode(node.id)} 
                    className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Inventory */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-secondary" /> Lab Inventory
          </h3>
          
          <form onSubmit={addInventory} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Component Name..." 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary/50"
            />
            <input 
              type="number" 
              min="1"
              value={newItemCount}
              onChange={(e) => setNewItemCount(parseInt(e.target.value))}
              className="w-16 bg-background-elevated border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-secondary/50 text-center"
            />
            <select 
              value={newItemCategory} 
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="bg-background-elevated border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-secondary/50"
            >
              <option value="mcu">MCU</option>
              <option value="sensor">Sensor</option>
              <option value="actuator">Actuator</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="bg-secondary/20 text-secondary p-2 rounded-lg hover:bg-secondary/30 transition">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {inventory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background-elevated/30">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-muted text-muted-foreground`}>
                    {item.category}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm">x{item.count}</span>
                  <button onClick={() => removeInventory(item.id)} className="text-muted-foreground hover:text-destructive text-xs">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Debugging Terminal (Polyvalent Real Feature) */}
        <div className="lg:col-span-2 mt-4">
          <WebSerialTerminal />
        </div>
      </div>
    </div>
  );
};
