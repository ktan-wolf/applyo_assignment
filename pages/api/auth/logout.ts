// @ts-nocheck
import { serialize } from 'cookie'
export default function handler(req,res){
  res.setHeader('Set-Cookie', serialize('task_token', '', { httpOnly:true, path:'/', maxAge:0 }))
  res.status(200).json({ message:'logged out' })
}
