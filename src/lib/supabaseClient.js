import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Aplikasi tetap bisa berjalan dalam "mode demo lokal" walau Supabase belum
// dikonfigurasi (misalnya saat development awal sebelum .env diisi).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diatur. ' +
    'Aplikasi berjalan dalam mode demo lokal (skor tidak akan tersimpan permanen).'
  )
}
