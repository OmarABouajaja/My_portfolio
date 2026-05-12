import { Edit2, Trash2, Box, Cpu, Monitor, Code2, Headphones } from "lucide-react";
import type { HardwareNode } from "./EquipmentForm";

interface EquipmentListProps {
  nodesRegistry: HardwareNode[];
  onEdit: (node: HardwareNode) => void;
  onDelete: (id: string) => void;
}

const resolveCategoryIcon = (category: string) => {
  switch (category) {
    case "hardware": return <Monitor className="h-3 w-3" />;
    case "software": return <Code2 className="h-3 w-3" />;
    case "iot": return <Cpu className="h-3 w-3" />;
    case "audio": return <Headphones className="h-3 w-3" />;
    default: return <Box className="h-3 w-3" />;
  }
};

export const EquipmentList = ({ nodesRegistry, onEdit, onDelete }: EquipmentListProps) => {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground whitespace-nowrap">
            <tr>
              <th className="px-4 py-3 font-medium w-16">Visual</th>
              <th className="px-4 py-3 font-medium">Designation</th>
              <th className="px-4 py-3 font-medium">Class</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {nodesRegistry.map((node) => (
              <tr key={node.id} className="hover:bg-background-elevated/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded bg-background-elevated overflow-hidden border border-border/50 flex items-center justify-center">
                    {node.image_url ? (
                      <img src={node.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Box className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                  {node.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background-elevated w-fit px-2 py-1 rounded-md">
                    {resolveCategoryIcon(node.category)}
                    <span className="capitalize">{node.category}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(node)}
                      className="rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      aria-label="Reconfigure node"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(node.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label="Purge node"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {nodesRegistry.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hardware nodes registered in the matrix.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
