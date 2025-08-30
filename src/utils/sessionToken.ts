// Generate a unique 8-character session token
export function generateSessionToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate session token format
export function isValidSessionToken(token: string): boolean {
  return /^[a-z0-9]{8}$/.test(token);
}