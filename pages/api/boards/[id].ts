// pages/api/boards/[id].ts
import { boards } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'

export default function handler(req, res) {
  const { id: boardId } = req.query // renamed to avoid conflict

  const userId = getUserFromReq(req)
  if (!userId) return res.status(401).end('Not authenticated')

  if (req.method === 'GET') {
    const board = boards.find(b => b.id === boardId && b.ownerId === userId)
    if (!board) return res.status(404).end('Board not found')
    return res.status(200).json(board)
  }

  if (req.method === 'PUT') {
    const { title, tasks } = req.body || {}
    const board = boards.find(b => b.id === boardId && b.ownerId === userId)
    if (!board) return res.status(404).end('Board not found')

    if (title) board.title = title
    if (tasks) board.tasks = tasks

    return res.status(200).json(board)
  }

  if (req.method === 'DELETE') {
    const index = boards.findIndex(b => b.id === boardId && b.ownerId === userId)
    if (index === -1) return res.status(404).end('Board not found')

    boards.splice(index, 1)
    return res.status(204).end()
  }

  return res.status(405).end('Method not allowed')
}
