// @ts-nocheck
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import DarkModeToggle from '../components/DarkModeToggle' // ✅ Added

export default function Home() {
  const router = useRouter()
  const [boards, setBoards] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBoards() }, [])

  async function fetchBoards() {
    const res = await fetch('/api/boards')
    if (res.status === 401) { router.push('/login'); return }
    const data = await res.json()
    setBoards(data)
    setLoading(false)
  }

  async function createBoard() {
    if (!title) return alert('Enter board name')
    const res = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    if (res.status === 201) {
      setTitle('')
      fetchBoards()
    } else {
      const txt = await res.text(); alert(txt)
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Your Boards</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DarkModeToggle /> {/* ✅ Added here */}
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New board name" />
          <button className="btn btn-primary" onClick={createBoard} style={{ marginLeft: 8 }}>Create</button>
        </div>
      </div>

      {loading ? <p className='muted'>Loading...</p> :
        <>
          {boards.length === 0 && <p className='muted'>No boards yet. Create one above.</p>}
          <div className="boards">
            {boards.map(b => (
              <div key={b.id} className="board">
                <h4>{b.title}</h4>
                <p className="muted">Tasks: {b.tasks?.length || 0}</p>
                <div style={{ marginTop: 8 }}>
                  <button className="btn" onClick={() => router.push(`/boards/${b.id}`)}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    </Layout>
  )
}
