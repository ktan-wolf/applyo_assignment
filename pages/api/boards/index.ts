// pages/api/boards/index.ts
import { boards } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'

export default function handler(req, res) {
  const userId = getUserFromReq(req)
  if (!userId) return res.status(401).end('Not authenticated')

  if (req.method === 'GET') {
    // Return all boards for this user
    const userBoards = boards.filter(b => b.ownerId === userId)
    return res.status(200).json(userBoards)
  }

  if (req.method === 'POST') {
    // Create new board
    const { title, tasks } = req.body || {}

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newBoard = {
      id: Date.now().toString(),
      title,
      tasks: tasks || [],
      ownerId: userId
    }

    boards.push(newBoard)
    return res.status(201).json(newBoard)
  }

  return res.status(405).end('Method Not Allowed')
}
