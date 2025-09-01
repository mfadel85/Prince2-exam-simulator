import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { StoredAttempt } from '@/hooks/useReviewHistory';

let supabase: SupabaseClient | null = null;

function getClient() {
  if (typeof window === 'undefined') return null;
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !anon) {
    console.warn('Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }
  supabase = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return supabase;
}

async function ensureAnonSession() {
  const client = getClient();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  if (session?.user) return session.user;
  const { data, error } = await client.auth.signInAnonymously();
  if (error) { console.warn('Supabase anon sign-in failed', error); return null; }
  return data.user ?? null;
}

export async function saveAttemptRemote(attempt: StoredAttempt) {
  const client = getClient();
  if (!client) return { ok: false, reason: 'no-window' };
  const user = await ensureAnonSession();
  if (!user) return { ok: false, reason: 'no-user' };
  try {
    const payload = {
      user_id: user.id,
      date: attempt.date,
      items: attempt.items.map(i => ({ id: i.id, q: i.q, selected: i.selected, correct: i.correct, category: i.category, isCorrect: i.isCorrect })),
      category_stats: attempt.categoryStats || {},
    };
    const { error, data } = await client.from('attempts').insert(payload).select('id').single();
    if (error) {
      console.warn('Remote save failed', error);
      return { ok: false, reason: error.code };
    }
    return { ok: true, id: data.id };
  } catch (e: any) {
    console.warn('Remote save failed', e);
    return { ok: false, reason: 'error' };
  }
}

export async function listAttemptsRemote(max = 20): Promise<StoredAttempt[]> {
  const client = getClient();
  if (!client) return [];
  const user = await ensureAnonSession();
  if (!user) return [];
  const { data, error } = await client.from('attempts')
    .select('date, items, category_stats')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(max);
  if (error || !data) return [];
  return data.map(row => ({
    date: row.date,
    items: (row.items || []).map((it: any) => ({ ...it, explanation: null, options: undefined, selectedText: null, correctText: null })),
    categoryStats: row.category_stats || {}
  }));
}
