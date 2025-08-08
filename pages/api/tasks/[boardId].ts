import type { NextApiRequest, NextApiResponse } from 'next'
import { boards, users, saveData } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = getUserFromReq(req)
    if (!userId) return res.status(401).json({ error: 'Not authenticated' })

    const { boardId } = req.query
    const board = boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    if (board.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' })

    switch (req.method) {
      case 'POST': {
        const { title, description, dueDate } = req.body as {
          title?: string
          description?: string
          dueDate?: string | null
        }

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

      case 'PUT': {
        const { taskId } = req.body as { taskId?: string }
        const task = board.tasks.find(x => x.id === taskId)
        if (!task) return res.status(404).json({ error: 'Task not found' })

        task.completed = !task.completed
        saveData({ users, boards })
        return res.status(200).json(task)
      }

      case 'PATCH': {
        const { taskId, title, description, dueDate } = req.body as {
          taskId?: string
          title?: string
          description?: string
          dueDate?: string | null
        }
        const task = board.tasks.find(x => x.id === taskId)
        if (!task) return res.status(404).json({ error: 'Task not found' })

        if (title !== undefined) task.title = title
        if (description !== undefined) task.description = description
        if (dueDate !== undefined) task.dueDate = dueDate

        saveData({ users, boards })
        return res.status(200).json(task)
      }

      case 'DELETE': {
        const { taskId } = req.body as { taskId?: string }
        const idx = board.tasks.findIndex(x => x.id === taskId)
        if (idx === -1) return res.status(404).json({ error: 'Task not found' })

        board.tasks.splice(idx, 1)
        saveData({ users, boards })
        return res.status(200).json({ message: 'Deleted successfully' })
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
