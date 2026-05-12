import { DataNexus3D } from "./DataNexus3D";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTelemetry } from "@/hooks/useTelemetry";

type Transaction = { id: number; title: string; amount: number; type: "income" | "expense"; date: string };

export const DataNexusTab = () => {
  const [transactions] = useLocalStorage<Transaction[]>("bo3_finance_tx", []);
  const { logs } = useTelemetry();

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Hyper-Dimensional Data Hub</h2>
        <p className="text-sm text-muted-foreground">3D topography of system state, combining telemetry and financial metrics.</p>
      </div>
      <div className="flex-1 min-h-[500px]">
        <DataNexus3D transactions={transactions} logs={logs} />
      </div>
    </div>
  );
};
