import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";
import { Plus, Type, Image as ImageIcon, Calculator, Trash2, Maximize, Folders, GripHorizontal, Columns } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

type NodeType = "text" | "image" | "calc";

interface BoardNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  content: string; // Text, URL, or Math expression
}

interface BoardColumn {
  id: string;
  name: string;
}

interface Board {
  id: string;
  name: string;
  nodes: BoardNode[];
  columns?: BoardColumn[];
}

const BoardNodeCard = ({ node, containerRef, updateNode, deleteNode, updateNodePos }: any) => {
  const dragControls = useDragControls();

  const renderNodeContent = () => {
    if (node.type === "text") {
      return (
        <textarea 
          value={node.content}
          onChange={(e) => updateNode(node.id, e.target.value)}
          placeholder="Enter notes..."
          className="w-full h-full min-h-[100px] bg-transparent resize-none outline-none text-sm font-mono text-foreground p-2"
        />
      );
    }
    
    if (node.type === "image") {
      return (
        <div className="flex flex-col h-full gap-2 p-2">
          {!node.content.startsWith("http") && !node.content.startsWith("data:image") ? (
            <input 
              type="text" 
              value={node.content}
              onChange={(e) => updateNode(node.id, e.target.value)}
              placeholder="Paste Image URL..."
              className="w-full bg-background-elevated border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary"
            />
          ) : (
            <div className="relative group flex-1">
              <img src={node.content} alt="Board Node" className="w-full h-full object-cover rounded-md" draggable={false} />
              <button 
                onClick={() => updateNode(node.id, "")}
                className="absolute top-2 right-2 bg-black/50 p-1 rounded hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (node.type === "calc") {
      let result: string | number = "Error";
      try {
        result = Function(`'use strict'; return (${node.content || '0'})`)();
      } catch (e) {
        result = "Invalid";
      }

      return (
        <div className="p-3 h-full flex flex-col gap-2">
          <input 
            type="text" 
            value={node.content}
            onChange={(e) => updateNode(node.id, e.target.value)}
            className="w-full bg-background-elevated border border-border rounded px-2 py-1 text-sm font-mono outline-none focus:border-warning"
          />
          <div className="flex-1 flex items-center justify-end text-2xl font-display font-bold text-warning truncate">
            = {typeof result === 'number' ? result.toLocaleString() : result}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={containerRef}
      initial={{ x: node.x, y: node.y, scale: 0.9, opacity: 0 }}
      animate={{ x: node.x, y: node.y, scale: 1, opacity: 1 }}
      onDragEnd={(_, info) => {
        updateNodePos(node.id, node.x + info.offset.x, node.y + info.offset.y);
      }}
      className={`absolute w-64 ${node.type === 'image' ? 'min-h-[200px]' : 'min-h-[150px]'} glass-panel border rounded-xl overflow-hidden shadow-xl flex flex-col group
        ${node.type === 'text' ? 'border-primary/30' : node.type === 'image' ? 'border-accent/30' : 'border-warning/30'}`}
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className={`h-8 flex items-center justify-between px-3 border-b cursor-grab active:cursor-grabbing
        ${node.type === 'text' ? 'bg-primary/10 border-primary/20' : node.type === 'image' ? 'bg-accent/10 border-accent/20' : 'bg-warning/10 border-warning/20'}`}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <GripHorizontal className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{node.type}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition z-10"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden pointer-events-auto">
        {renderNodeContent()}
      </div>
    </motion.div>
  );
};

export const NexusBoard = () => {
  const [boards, setBoards] = useLocalStorage<Board[]>("bo3_nexus_boards", [
    { id: "default", name: "Master Architecture", nodes: [], columns: [{id: "col1", name: "Backlog"}, {id: "col2", name: "In Progress"}, {id: "col3", name: "Done"}] }
  ]);
  const [activeBoardId, setActiveBoardId] = useState<string>("default");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  const updateBoardNodes = (newNodes: BoardNode[]) => {
    setBoards(boards.map(b => b.id === activeBoardId ? { ...b, nodes: newNodes } : b));
  };

  const addNode = (type: NodeType) => {
    const newNode: BoardNode = {
      id: Date.now().toString(),
      type,
      x: window.innerWidth / 2 - 150, // Centerish
      y: window.innerHeight / 2 - 100,
      content: type === "calc" ? "100 * 2.5" : ""
    };
    updateBoardNodes([...activeBoard.nodes, newNode]);
  };

  const updateNode = (id: string, content: string) => {
    const newNodes = activeBoard.nodes.map(n => n.id === id ? { ...n, content } : n);
    updateBoardNodes(newNodes);
  };

  const updateNodePos = (id: string, x: number, y: number) => {
    const newNodes = activeBoard.nodes.map(n => n.id === id ? { ...n, x, y } : n);
    updateBoardNodes(newNodes);
  };

  const deleteNode = (id: string) => {
    updateBoardNodes(activeBoard.nodes.filter(n => n.id !== id));
  };

  const addBoard = () => {
    const name = prompt("Enter Board Name:");
    if (!name) return;
    const newBoard = { id: Date.now().toString(), name, nodes: [], columns: [] };
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  const addColumn = () => {
    const name = prompt("Enter Column Name:");
    if (!name) return;
    const newColumns = [...(activeBoard.columns || []), { id: Date.now().toString(), name }];
    setBoards(boards.map(b => b.id === activeBoardId ? { ...b, columns: newColumns } : b));
  };

  const removeColumn = (id: string) => {
    const newColumns = (activeBoard.columns || []).filter(c => c.id !== id);
    setBoards(boards.map(b => b.id === activeBoardId ? { ...b, columns: newColumns } : b));
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#0a0a0c]">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Visual Columns Background */}
      {activeBoard.columns && activeBoard.columns.length > 0 && (
        <div className="absolute inset-0 flex mt-20 px-8 gap-6 pointer-events-none z-0">
          {activeBoard.columns.map(col => (
            <div key={col.id} className="flex-1 border-x border-border/20 bg-background/5 h-full relative">
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-border/20 flex items-center justify-between px-4 pointer-events-auto">
                <span className="text-sm font-bold uppercase tracking-widest text-primary/80">{col.name}</span>
                <button onClick={() => removeColumn(col.id)} className="text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100 transition">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between gap-4">
        
        {/* Board Switcher */}
        <div className="flex items-center gap-2 bg-background-elevated/80 backdrop-blur-md border border-border p-1.5 rounded-lg">
          <Folders className="w-5 h-5 text-muted-foreground ml-2" />
          <select 
            value={activeBoardId}
            onChange={(e) => setActiveBoardId(e.target.value)}
            className="bg-transparent text-sm font-bold uppercase tracking-widest outline-none pr-4"
          >
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <button onClick={addBoard} className="p-1 hover:bg-primary/20 hover:text-primary rounded text-muted-foreground transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Node Tools */}
        <div className="flex items-center gap-2 bg-background-elevated/80 backdrop-blur-md border border-border p-1.5 rounded-lg">
          <button onClick={() => addNode("text")} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-primary/20 hover:text-primary rounded text-muted-foreground transition text-xs font-bold uppercase">
            <Type className="w-4 h-4" /> Text
          </button>
          <button onClick={() => addNode("image")} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-accent/20 hover:text-accent rounded text-muted-foreground transition text-xs font-bold uppercase">
            <ImageIcon className="w-4 h-4" /> Image
          </button>
          <button onClick={() => addNode("calc")} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-warning/20 hover:text-warning rounded text-muted-foreground transition text-xs font-bold uppercase">
            <Calculator className="w-4 h-4" /> Math
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button onClick={addColumn} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted/20 hover:text-foreground rounded text-muted-foreground transition text-xs font-bold uppercase">
            <Columns className="w-4 h-4" /> Add Col
          </button>
        </div>
      </div>

      {/* Infinite Canvas Area */}
      <div className="flex-1 w-full h-full relative" ref={containerRef}>
        {activeBoard.nodes.map(node => (
          <BoardNodeCard 
            key={node.id} 
            node={node} 
            containerRef={containerRef} 
            updateNode={updateNode} 
            deleteNode={deleteNode} 
            updateNodePos={updateNodePos} 
          />
        ))}
      </div>

    </div>
  );
};
