import { useState } from "react";
import jsPDF from "jspdf";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { dbInsert } from "@/integrations/supabase/mutations";
import { useSiteMetadata } from "@/hooks/useSiteMetadata";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export const InvoiceGenerator = () => {
  const metaState = useSiteMetadata();
  const meta = metaState.status === "online" ? metaState.data : null;

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Full-Stack Development (Hours)", quantity: 40, rate: 50 },
  ]);
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("Thank you for your business.");
  const [taxRate, setTaxRate] = useState(0);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const generatePDF = async () => {
    if (!clientName) {
      toast.error("Please enter a client name");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(34, 211, 238); // Primary cyan
      doc.text("INVOICE", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Invoice #: INV-${Math.floor(Math.random() * 10000)}`, 14, 35);
      
      // From
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("From:", 14, 50);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Abouajaja Omar", 14, 55);
      doc.text("Robotics & Full-Stack Engineer", 14, 60);
      doc.text(meta?.contact_email || "contact@example.com", 14, 65);
      
      // To
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Bill To:", 120, 50);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(clientName, 120, 55);
      if (clientEmail) doc.text(clientEmail, 120, 60);
      if (clientAddress) {
        const splitAddress = doc.splitTextToSize(clientAddress, 70);
        doc.text(splitAddress, 120, 65);
      }
      
      // Table Header
      doc.setFillColor(245, 245, 245);
      doc.rect(14, 85, 182, 10, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Description", 16, 92);
      doc.text("Qty", 120, 92);
      doc.text("Rate", 140, 92);
      doc.text("Amount", 170, 92);
      
      // Table Content
      let y = 105;
      items.forEach((item) => {
        doc.text(item.description, 16, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`${item.rate} ${currency}`, 140, y);
        doc.text(`${(item.quantity * item.rate).toFixed(2)} ${currency}`, 170, y);
        y += 10;
      });
      
      // Line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 10;
      
      // Totals
      doc.text("Subtotal:", 140, y);
      doc.text(`${subtotal.toFixed(2)} ${currency}`, 170, y);
      y += 8;
      if (taxRate > 0) {
        doc.text(`Tax (${taxRate}%):`, 140, y);
        doc.text(`${tax.toFixed(2)} ${currency}`, 170, y);
        y += 8;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(34, 211, 238);
      doc.text("Total:", 140, y);
      doc.text(`${total.toFixed(2)} ${currency}`, 170, y);
      
      // Notes
      if (notes) {
        y += 20;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Notes:", 14, y);
        doc.setTextColor(100, 100, 100);
        const splitNotes = doc.splitTextToSize(notes, 182);
        doc.text(splitNotes, 14, y + 6);
      }
      
      doc.save(`Invoice_${clientName.replace(/\s+/g, "_")}.pdf`);
      
      // Persist invoice record to DB
      await dbInsert("invoices", {
        invoice_number: `INV-${Date.now().toString(36).toUpperCase()}`,
        client_name: clientName,
        client_email: clientEmail || null,
        amount: total,
        currency,
        status: "sent",
        items: items.map(i => ({ description: i.description, quantity: i.quantity, rate: i.rate })),
        notes: notes || null,
        tax_rate: taxRate,
      });

      toast.success("Invoice generated & saved");
    } catch (e: any) {
      toast.error("Failed to generate PDF");
      console.error(e);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Client Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="billing@acme.com"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Client Address</label>
            <textarea
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="terminal-text text-xs uppercase tracking-widest">Line Items</h4>
            <button onClick={addItem} className="inline-flex items-center gap-1 rounded-md text-xs text-primary hover:text-primary/80">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
                <div className="flex-1 space-y-1 min-w-[200px]">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="w-20 space-y-1">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="mb-1 p-2 text-muted-foreground hover:text-destructive transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Notes / Terms</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-xl border border-border/50 bg-background-elevated/30 p-6">
        <h4 className="terminal-text text-xs uppercase tracking-widest">Summary</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TND">TND (DT)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tax Rate (%)</span>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm text-right outline-none"
            />
          </div>
          
          <div className="pt-4 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-mono">{subtotal.toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="font-mono">{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-lg font-semibold text-primary pt-2">
              <span>Total</span>
              <span className="font-mono">{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-cyber px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated mt-6"
        >
          <Download className="h-4 w-4" />
          Generate PDF
        </button>
      </div>
    </div>
  );
};
