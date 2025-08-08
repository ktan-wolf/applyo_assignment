import type { NextApiRequest, NextApiResponse } from 'next'
import { boards, users, saveData } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = getUserFromReq(req)
    if (!userId) return res.status(401).json({ error: 'Not authenticated' })

    const { boardId } = req.query
    if (typeof boardId !== 'string') {
      return res.status(400).json({ error: 'Invalid boardId' })
    }

    const board = boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    if (board.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' })

    if (req.method === 'POST') {
      // Create new task
      const { title, description, dueDate } = req.body
      if (!title) return res.status(400).json({ error: 'Missing title' })

      const task = {
        id: Date.now().toString(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || null,
      }

      board.tasks.push(task)
      saveData({ users, boards })
      return res.status(201).json(task)
    }

    else if (req.method === 'PATCH') {
      // Update task fields (title, description, dueDate)
      const { taskId, title, description, dueDate } = req.body
      if (!taskId) return res.status(400).json({ error: 'Missing taskId' })

      const task = board.tasks.find(t => t.id === taskId)
      if (!task) return res.status(404).json({ error: 'Task not found' })

      if (title !== undefined) task.title = title
      if (description !== undefined) task.description = description
      if (dueDate !== undefined) task.dueDate = dueDate

      saveData({ users, boards })
      return res.status(200).json(task)
    }

    else if (req.method === 'PUT') {
      // Toggle completed status
      const { taskId } = req.body
      if (!taskId) return res.status(400).json({ error: 'Missing taskId' })

      const task = board.tasks.find(t => t.id === taskId)
      if (!task) return res.status(404).json({ error: 'Task not found' })

      task.completed = !task.completed

      saveData({ users, boards })
      return res.status(200).json(task)
    }

    else if (req.method === 'DELETE') {
      // Delete a task
      const { taskId } = req.body
      if (!taskId) return res.status(400).json({ error: 'Missing taskId' })

      const index = board.tasks.findIndex(t => t.id === taskId)
      if (index === -1) return res.status(404).json({ error: 'Task not found' })

      board.tasks.splice(index, 1)

      saveData({ users, boards })
      return res.status(200).json({ message: 'Task deleted' })
    }

    else {
      // Unsupported method
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
