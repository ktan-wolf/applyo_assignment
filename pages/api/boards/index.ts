// @ts-nocheck
import { boards, users, saveData } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'

export default function handler(req, res) {
  const userId = getUserFromReq(req)
  if (!userId) return res.status(401).end('Not authenticated')
  
  if (req.method === 'GET') {
    const my = boards.filter(b => b.ownerId === userId)
    return res.status(200).json(my)
  } 
  
  if (req.method === 'POST') {
    const { title } = req.body || {}
    if (!title) return res.status(400).end('Missing title')
    const b = { id: Date.now().toString(), ownerId: userId, title, tasks: [] }
    boards.push(b)
    saveData({ users, boards })
    return res.status(201).json(b)
  }
  
  return res.status(405).end('Method not allowed')
}
