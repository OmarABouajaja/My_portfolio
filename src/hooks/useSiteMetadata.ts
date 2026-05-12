import { useEffect, useState } from "react";
import { safeFetchOne, safeFetchAll } from "@/integrations/supabase/safeFetch";

export type SiteMetadata = {
  active_projects_count: number;
  last_build: string;
  system_status: string;
  hiring_status: boolean;
  primary_theme_color: string;
  contact_email: string | null;
  resume_url: string | null;
  enable_projects?: boolean;
  enable_timeline?: boolean;
  enable_tech_stack?: boolean;
  enable_testimonials?: boolean;
  enable_blog?: boolean;
  enable_contact?: boolean;
  updated_at: string;
};

export type FetchState =
  | { status: "loading" }
  | { status: "online"; data: SiteMetadata; projectCount: number }
  | { status: "offline"; error: string; data?: SiteMetadata; projectCount: number };

export function useSiteMetadata() {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meta, projects] = await Promise.all([
          safeFetchOne<SiteMetadata>("site_metadata", { order: "updated_at" }),
          safeFetchAll("projects"),
        ]);
        if (cancelled) return;
        if (meta) {
          setState({ status: "online", data: meta, projectCount: projects.length });
        } else {
          setState({
            status: "offline",
            error: "no metadata row",
            projectCount: projects.length,
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setState({
            status: "offline",
            error: e?.message ?? "fetch failed",
            projectCount: 0,
          });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}
