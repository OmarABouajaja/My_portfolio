import { supabase } from "./client";
export const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const isDemoMode = () =>
  sessionStorage.getItem("nexus_demo_mode") === "true";

interface FetchOpts {
  order?: string;
  ascending?: boolean;
  filter?: Record<string, unknown>;
}

export async function safeFetchAll<T = unknown>(
  table: string,
  opts?: FetchOpts
): Promise<T[]> {
  if (!hasSupabase) return [];

  try {
    let q = supabase.from(table as any).select("*");
    if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? true });
    if (opts?.filter) {
      for (const [k, v] of Object.entries(opts.filter)) q = q.eq(k, v);
    }
    const { data, error } = await q;
    if (error) {
      console.error(`[safeFetchAll] Error fetching ${table}:`, error);
      return [];
    }
    return (data || []) as T[];
  } catch (err) {
    console.error(`[safeFetchAll] Exception fetching ${table}:`, err);
    return [];
  }
}

export async function safeFetchOne<T = unknown>(
  table: string,
  opts?: { order?: string; ascending?: boolean }
): Promise<T | null> {
  if (!hasSupabase) return null;

  try {
    let q = supabase.from(table as any).select("*");
    if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
    const { data, error } = await q.limit(1).maybeSingle();
    if (error) {
      console.error(`[safeFetchOne] Error fetching ${table}:`, error);
      return null;
    }
    return (data || null) as T | null;
  } catch (err) {
    console.error(`[safeFetchOne] Exception fetching ${table}:`, err);
    return null;
  }
}
