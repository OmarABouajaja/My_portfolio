import { useState } from "react";
import { Download, FileText, Moon, Sun } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { SITE } from "@/config/siteConfig";

type Project = {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
};

export const DynamicResumePro = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { data: projects = [] } = useQuery({
    queryKey: ["resume_projects"],
    queryFn: () => safeFetchAll<Project>("projects"),
  });

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const isDark = theme === "dark";

      // Theme Colors
      const bgColor = isDark ? [10, 10, 12] : [255, 255, 255];
      const textColor = isDark ? [220, 220, 220] : [30, 30, 30];
      const accentColor = isDark ? [34, 211, 238] : [14, 165, 233]; // Cyan
      const mutedColor = isDark ? [150, 150, 150] : [100, 100, 100];

      // Background
      if (isDark) {
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(0, 0, 210, 297, "F");
      }

      let yPos = 20;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(SITE.ownerName.toUpperCase(), 14, yPos);
      
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(SITE.resumeTitle, 14, yPos);
      
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(SITE.resumeContact, 14, yPos);

      // Line Separator
      yPos += 8;
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(0.5);
      doc.line(14, yPos, 196, yPos);

      // Summary
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("PROFESSIONAL SUMMARY", 14, yPos);

      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      const summary = SITE.resumeSummary;
      const splitSummary = doc.splitTextToSize(summary, 180);
      doc.text(splitSummary, 14, yPos);
      yPos += splitSummary.length * 5 + 5;

      // Skills
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("CORE COMPETENCIES", 14, yPos);

      yPos += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text("Frontend:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(SITE.skills.frontend, 40, yPos);

      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Backend:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(SITE.skills.backend, 40, yPos);

      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Hardware:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(SITE.skills.hardware, 40, yPos);

      // Projects (Dynamically from LocalStorage)
      yPos += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("SELECTED PROJECTS", 14, yPos);

      yPos += 10;
      if (projects.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
        doc.text("No projects found in database. Add some via the Projects Manager.", 14, yPos);
      } else {
        projects.slice(0, 4).forEach((proj) => { // limit to 4 projects to fit on page
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(`• ${proj.title_en || "Untitled Project"}`, 14, yPos);

          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.text(`[${proj.category || "General"}]`, 180, yPos, { align: "right" });

          yPos += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
          const desc = doc.splitTextToSize(proj.description_en || "No description available.", 175);
          doc.text(desc, 20, yPos);

          yPos += desc.length * 5 + 6;
        });
      }

      // Save
      doc.save(`Omar_Abouajaja_Resume_${theme.toUpperCase()}.pdf`);
      toast.success("Resume Generated Successfully");

    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-primary tracking-widest uppercase">Dynamic Resume Pro</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Instantly compiles your active CMS data into a professional PDF.
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex bg-background-elevated p-1 rounded-lg border border-border w-fit">
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${
              theme === "dark" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="w-4 h-4" /> Cyber Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${
              theme === "light" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="w-4 h-4" /> Printable Light
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Preview */}
        <div className="glass-panel p-6 rounded-xl border border-border space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" /> Data Injection Preview
          </h3>
          
          <div className="space-y-3">
            <div className="bg-background-elevated p-3 rounded-lg border border-border/50">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Active Projects ({projects.length})</div>
              {projects.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {projects.slice(0, 3).map(p => (
                    <li key={p.id} className="truncate text-foreground/80">• {p.title_en}</li>
                  ))}
                  {projects.length > 3 && <li className="text-muted-foreground italic">+{projects.length - 3} more...</li>}
                </ul>
              ) : (
                <div className="text-sm text-destructive">No projects in database.</div>
              )}
            </div>

            <div className="bg-background-elevated p-3 rounded-lg border border-border/50">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Profile Data</div>
              <ul className="text-sm space-y-1 text-foreground/80">
                <li>• Name: {SITE.ownerName}</li>
                <li>• Role: {SITE.resumeTitle}</li>
                <li>• Core Competencies Matrix</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="glass-panel p-6 rounded-xl border border-border flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group">
          <div className={`absolute -inset-10 bg-gradient-to-r blur-3xl opacity-10 group-hover:opacity-20 transition duration-500 ${theme === "dark" ? "from-primary to-secondary" : "from-foreground to-foreground"}`} />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Ready to Compile</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Your resume will be generated dynamically using the {theme === "dark" ? "Cyber Dark" : "Printable Light"} aesthetic protocol.
            </p>
          </div>

          <button
            onClick={generatePDF}
            className={`relative z-10 w-full max-w-[200px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
              theme === "dark" 
                ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:shadow-glow-primary" 
                : "bg-foreground text-background hover:bg-foreground/90 hover:scale-105"
            }`}
          >
            <Download className="w-5 h-5" /> Compile PDF
          </button>
        </div>
      </div>
    </div>
  );
};
