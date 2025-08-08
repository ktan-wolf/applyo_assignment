// lib/data.ts
// In-memory data store (will reset on server restart)

// Initial empty arrays
const users: any[] = []
const boards: any[] = []

// Dummy saveData function (no-op here because no file writes)
function saveData(data: { users: any[]; boards: any[] }) {
  // No file system, so do nothing
}

export { users, boards, saveData }
