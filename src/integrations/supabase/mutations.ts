import { supabase } from "./client";
import { hasSupabase, isDemoMode } from "./safeFetch";
import { toast } from "sonner";

type Result<T> = { data: T | null; error: string | null };
type DeleteResult = { success: boolean; error: string | null };

const isOffline = () => !hasSupabase || isDemoMode();
const modeTag = () => isOffline() ? " (Mock Mode)" : "";
const now = () => new Date().toISOString();

function mockRow<T extends Record<string, unknown>>(overrides: Partial<T>): T {
  return { id: crypto.randomUUID(), created_at: now(), updated_at: now(), ...overrides } as unknown as T;
}

export async function dbInsert<T extends Record<string, unknown>>(
  table: string, row: Partial<T>
): Promise<Result<T>> {
  if (isOffline()) return { data: mockRow<T>(row), error: null };
  try {
    const { data, error } = await supabase.from(table).insert(row as any).select().single();
    return error ? { data: null, error: error.message } : { data: data as T, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Insert failed" };
  }
}

export async function dbUpdate<T extends Record<string, unknown>>(
  table: string, id: string, updates: Partial<T>
): Promise<Result<T>> {
  if (isOffline()) return { data: { id, updated_at: now(), ...updates } as unknown as T, error: null };
  try {
    const { data, error } = await supabase
      .from(table)
      .update({ ...updates, updated_at: now() } as any)
      .eq("id", id).select().single();
    return error ? { data: null, error: error.message } : { data: data as T, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Update failed" };
  }
}

export async function dbDelete(table: string, id: string): Promise<DeleteResult> {
  if (isOffline()) return { success: true, error: null };
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    return error ? { success: false, error: error.message } : { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message || "Delete failed" };
  }
}

export async function dbUpsert<T extends Record<string, unknown>>(
  table: string, data: Partial<T>, conflictKey = "id"
): Promise<Result<T>> {
  if (isOffline()) return { data: { updated_at: now(), ...data } as unknown as T, error: null };
  try {
    const { data: result, error } = await supabase
      .from(table)
      .upsert({ ...data, updated_at: now() } as any, { onConflict: conflictKey })
      .select().single();
    return error ? { data: null, error: error.message } : { data: result as T, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Upsert failed" };
  }
}

export async function dbBulkUpdate<T extends Record<string, unknown>>(
  table: string, filter: Record<string, unknown>, updates: Partial<T>
): Promise<DeleteResult> {
  if (isOffline()) return { success: true, error: null };
  try {
    let q = supabase.from(table).update(updates as any);
    for (const [k, v] of Object.entries(filter)) q = q.eq(k, v as any);
    const { error } = await q;
    return error ? { success: false, error: error.message } : { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message || "Bulk update failed" };
  }
}

export async function mutateWithToast<T extends Record<string, unknown>>(
  op: () => Promise<Result<T>>, successMsg: string, errorMsg = "Operation failed"
): Promise<T | null> {
  const result = await op();
  if (result.error) { toast.error(`${errorMsg}: ${result.error}`); return null; }
  toast.success(`${successMsg}${modeTag()}`);
  return result.data;
}
