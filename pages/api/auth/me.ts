import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

const SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_IN_PROD'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.token
    if (!token) {
      return res.status(401).json({ loggedIn: false })
    }

    jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({ loggedIn: true })
  } catch {
    return res.status(401).json({ loggedIn: false })
  }
}
