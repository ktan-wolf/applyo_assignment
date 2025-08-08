// pages/api/tasks.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { boards, users, saveData } from '../../../lib/data';
import { getUserFromReq } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = getUserFromReq(req);
    if (!userId) return res.status(401).end('Not authenticated');

    const { boardId } = req.body || {};
    if (!boardId) return res.status(400).end('Missing boardId');

    const board = boards.find(b => b.id === boardId);
    if (!board) return res.status(404).end('Board not found');
    if (board.ownerId !== userId) return res.status(403).end('Forbidden');

    if (req.method === 'POST') {
      const { title, description, dueDate } = req.body || {};
      if (!title) return res.status(400).end('Missing title');

      const t = {
        id: Date.now().toString(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || null
      };
      board.tasks.push(t);
      saveData({ users, boards });
      return res.status(201).json(t);
    }

    if (req.method === 'PUT') {
      const { taskId } = req.body || {};
      const t = board.tasks.find(x => x.id === taskId);
      if (!t) return res.status(404).end('Task not found');
      t.completed = !t.completed;
      saveData({ users, boards });
      return res.status(200).json(t);
    }

    if (req.method === 'PATCH') {
      const { taskId, title, description, dueDate } = req.body || {};
      const t = board.tasks.find(x => x.id === taskId);
      if (!t) return res.status(404).end('Task not found');
      if (title !== undefined) t.title = title;
      if (description !== undefined) t.description = description;
      if (dueDate !== undefined) t.dueDate = dueDate;
      saveData({ users, boards });
      return res.status(200).json(t);
    }

    if (req.method === 'DELETE') {
      const { taskId } = req.body || {};
      const idx = board.tasks.findIndex(x => x.id === taskId);
      if (idx === -1) return res.status(404).end('Task not found');
      board.tasks.splice(idx, 1);
      saveData({ users, boards });
      return res.status(200).end('deleted');
    }

    return res.status(405).end('Method not allowed');
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).end('Internal Server Error');
  }
}
