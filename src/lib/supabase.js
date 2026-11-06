import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback gracefully if environment variables are missing during setup phase
export const isDatabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isDatabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
