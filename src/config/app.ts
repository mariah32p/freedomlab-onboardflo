// App configuration
export const APP_CONFIG = {
  // Set to false for demo mode (no Supabase required)
  // Set to true for production mode (requires Supabase connection)
  ENABLE_REAL_AUTH: false,
  
  // Demo user data for mock mode
  DEMO_USER: {
    id: 'demo-user-123',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
  }
};