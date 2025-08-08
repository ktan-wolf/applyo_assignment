// pages/api/tasks/[boardId].ts
// @ts-nocheck
import { boards } from '../../../lib/data'

export default function handler(req, res) {
  const { boardId } = req.query

  // Find the board by ID
  const board = boards.find(b => b.id === boardId)
  if (!board) {
    return res.status(404).json({ error: 'Board not found' })
  }

  if (req.method === 'GET') {
    // Return all tasks for this board
    return res.status(200).json(board.tasks || [])
  }

  if (req.method === 'POST') {
    const { title, description } = req.body || {}
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      status: 'todo',
    }

    if (!board.tasks) board.tasks = []
    board.tasks.push(newTask)

    return res.status(201).json(newTask)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
