import { createClient } from '@supabase/supabase-js'

// Ganti nilai di bawah ini dengan URL & ANON KEY dari project Supabase Anda nantinya
const supabaseUrl = 'https://YOUR_SUPABASE_PROJECT_URL.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)