// @ts-nocheck
import { users } from '../../../lib/data';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).end('Missing fields');

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).end('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).end('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.setHeader(
    'Set-Cookie',
    serialize('task_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
  );

  return res.status(200).json({ message: 'ok' });
}
