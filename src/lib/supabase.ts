import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.startsWith('https://');

if (!hasValidCredentials) {
  console.warn('=== SUPABASE NOT CONFIGURED ===');
  console.warn('The app is running in mock mode because Supabase credentials are missing or invalid.');
  console.warn('To connect to Supabase:');
  console.warn('1. Update your .env file with actual Supabase values');
  console.warn('2. Restart the development server');
  console.warn('Current VITE_SUPABASE_URL:', supabaseUrl);
  console.warn('Current VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : '[MISSING]');
}

// Create a mock Supabase client for development when credentials are missing
const createMockSupabaseClient = () => {
  const mockResponse = { data: [], error: null };
  const mockAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
    updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  };

  return {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          order: () => mockResponse,
          maybeSingle: () => mockResponse,
          single: () => mockResponse 
        }),
        order: () => mockResponse,
        maybeSingle: () => mockResponse,
        single: () => mockResponse
      }),
      insert: () => ({ select: () => ({ single: () => mockResponse }) }),
      update: () => ({ eq: () => mockResponse }),
      delete: () => ({ eq: () => mockResponse }),
      upsert: () => mockResponse
    }),
    auth: mockAuth,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Storage not available in mock mode' } }),
        remove: () => Promise.resolve({ error: null }),
        createSignedUrl: () => Promise.resolve({ data: null, error: { message: 'Storage not available in mock mode' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: () => Promise.resolve({ data: [], error: null })
      })
    },
    removeChannel: () => {},
    channel: () => ({
      on: () => ({ subscribe: () => {} })
    })
  };
};

// Export either real or mock Supabase client
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockSupabaseClient() as any;