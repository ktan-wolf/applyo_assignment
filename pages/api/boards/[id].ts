// @ts-nocheck
import { boards } from '../../../lib/data'
import { getUserFromReq } from '../../../lib/auth'
export default function handler(req,res){
  const { id } = req.query

  // Prevent accidental hit when /api/boards (no id) is routed here
  if (!id || id === '' || id === 'undefined' || id === 'null') {
    return res.status(404).end('Not Found')
  }
  const userId = getUserFromReq(req)
  if(!userId) return res.status(401).end('Not authenticated')
  const { id } = req.query
  const idx = boards.findIndex(b=>b.id===id)
  if(idx===-1) return res.status(404).end('Board not found')
  const board = boards[idx]
  if(board.ownerId!==userId) return res.status(403).end('Forbidden')
  if(req.method==='GET') return res.status(200).json(board)
  if(req.method==='DELETE'){ boards.splice(idx,1); return res.status(200).end('deleted') }
  if(req.method==='PUT'){
    const { title } = req.body || {}
    if(!title) return res.status(400).end('Missing title')
    board.title = title
    return res.status(200).json(board)
  }
  return res.status(405).end('Method not allowed')
}
