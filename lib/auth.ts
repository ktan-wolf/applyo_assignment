// @ts-nocheck
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'
import { users } from './data'

const SECRET = process.env.JWT_SECRET;

export function getUserFromReq(req) {
  const cookie = req.headers.cookie
  if (!cookie) return null
  try {
    const { task_token } = parse(cookie || '') || {}
    if (!task_token) return null
    const payload = jwt.verify(task_token, SECRET)
    const userExists = users.find(u => u.id === payload.userId)
    if (!userExists) return null // user no longer exists
    return payload.userId
  } catch (e) {
    return null
  }
}
