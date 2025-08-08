// @ts-nocheck
import { users, boards, saveData } from '../../../lib/data'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) return res.status(400).end('Missing fields')
  const exists = users.find(u => u.email === email)
  if (exists) return res.status(400).end('User already exists')
  const hash = await bcrypt.hash(password, 8)
  const user = { id: Date.now().toString(), name, email, passwordHash: hash }
  users.push(user)
  saveData({ users, boards })
  return res.status(201).json({ id: user.id, email: user.email })
}
