// lib/data.ts

// In-memory storage — persists only during the lifetime of the server instance
// On Vercel, this resets when the function restarts or redeploys.
export const users: any[] = [];
export const boards: any[] = [];

// Helper to reset data (optional, for testing)
export function resetData() {
  users.length = 0;
  boards.length = 0;
}
