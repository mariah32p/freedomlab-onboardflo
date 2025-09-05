import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('Current VITE_SUPABASE_URL:', supabaseUrl);
  console.error('Current VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : '[MISSING]');
  console.error('Please update your .env file with actual Supabase values and restart the dev server.');
  throw new Error('Missing Supabase environment variables. Please check your .env file and restart the development server.');
}

// Validate URL format
if (supabaseUrl !== 'your_supabase_url') {
  try {
    new URL(supabaseUrl);
  } catch {
    console.error('Invalid VITE_SUPABASE_URL format:', supabaseUrl);
    throw new Error('Invalid VITE_SUPABASE_URL format. Please check your .env file.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});