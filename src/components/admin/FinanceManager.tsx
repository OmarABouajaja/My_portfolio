import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, CreditCard, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { safeFetchAll, safeFetchOne } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbDelete, dbUpsert } from "@/integrations/supabase/mutations";
import { toast } from "sonner";

type Transaction = { id: string; title: string; amount: number; type: "income" | "expense"; date: string };
type FinanceSettings = { id: string; monthly_goal: number; currency: string };

export const FinanceManager = () => {
  const [monthlyGoal, setMonthlyGoal] = useState(5000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [newType, setNewType] = useState<"income" | "expense">("income");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [txData, settings] = await Promise.all([
      safeFetchAll<Transaction>("transactions", { order: "date", ascending: false }),
      safeFetchOne<FinanceSettings>("finance_settings"),
    ]);
    setTransactions(txData);
    if (settings) setMonthlyGoal(settings.monthly_goal);
    setLoading(false);
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    const row = {
      title: newTitle,
      amount: parseFloat(newAmount),
      type: newType,
      date: new Date().toISOString().split('T')[0],
    };

    const { data, error } = await dbInsert<Transaction>("transactions", row);
    if (error) {
      toast.error(`Failed to save: ${error}`);
      return;
    }
    if (data) {
      setTransactions([data, ...transactions]);
      toast.success("Transaction recorded");
    }
    setNewTitle("");
    setNewAmount("");
  };

  const removeTransaction = async (id: string) => {
    const { success, error } = await dbDelete("transactions", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleGoalChange = async (value: number) => {
    setMonthlyGoal(value);
    await dbUpsert("finance_settings", { id: "default", monthly_goal: value });
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const progressPercent = Math.min((totalIncome / monthlyGoal) * 100, 100);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin text-primary h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-success/20">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Income</div>
          <div className="text-3xl font-display font-bold text-success">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-destructive/20">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Expenses</div>
          <div className="text-3xl font-display font-bold text-destructive">${totalExpense.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-16 h-16" /></div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Net Profit</div>
          <div className="text-3xl font-display font-bold text-primary">${netProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Goal Tracker */}
      <div className="glass-panel rounded-xl p-6 border border-border">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-warning" /> Monthly Revenue Goal</h3>
            <p className="text-sm text-muted-foreground">Progress towards your target.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">${totalIncome.toLocaleString()}</span>
            <span className="text-muted-foreground"> / ${monthlyGoal.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-4 bg-background-elevated rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-gradient-to-r from-warning/80 to-warning rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
        <div className="mt-4 flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">Adjust Goal:</span>
          <input 
            type="number" 
            value={monthlyGoal} 
            onChange={(e) => handleGoalChange(Number(e.target.value))} 
            className="bg-background-elevated border border-border rounded px-2 py-1 text-sm w-24 focus:outline-none focus:border-warning/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Transaction */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Log Transaction</h3>
          <form onSubmit={addTransaction} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Type</label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setNewType('income')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${newType === 'income' ? 'bg-success/20 text-success border border-success/30' : 'bg-background-elevated text-muted-foreground border border-border'}`}>Income</button>
                <button type="button" onClick={() => setNewType('expense')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${newType === 'expense' ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-background-elevated text-muted-foreground border border-border'}`}>Expense</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Title / Description</label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="w-full mt-1 bg-background-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50" placeholder="e.g. Server Costs" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Amount ($)</label>
              <input type="number" step="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required className="w-full mt-1 bg-background-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50" placeholder="0.00" />
            </div>
            <button type="submit" className="w-full bg-primary/20 text-primary font-medium py-2 rounded-md hover:bg-primary/30 transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Save Record
            </button>
          </form>
        </div>

        {/* Ledger */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Ledger</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {transactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No transactions logged yet.</div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-elevated/50 group hover:border-primary/30 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{tx.title}</div>
                      <div className="text-xs text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-success' : 'text-foreground'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                    <button onClick={() => removeTransaction(tx.id)} className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition">Del</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
