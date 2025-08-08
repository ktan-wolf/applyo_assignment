// @ts-nocheck
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

export default function BoardPage() {
  const router = useRouter()
  const { id } = router.query
  const [board, setBoard] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => { if (id) fetchBoard() }, [id])

  async function fetchBoard() {
    const res = await fetch(`/api/boards/${id}`)
    if (res.status === 401) { router.push('/login'); return }
    if (res.status === 404) { alert('Board not found'); router.push('/'); return }
    const data = await res.json()
    setBoard(data)
  }

  async function addTask() {
    if (!title) return alert('Enter title')
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, dueDate })
    })
    if (res.status === 201) { setTitle(''); setDesc(''); setDueDate(''); fetchBoard() }
    else { alert(await res.text()) }
  }

  async function toggleTask(tid) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: tid })
    })
    if (res.ok) fetchBoard()
  }

  async function deleteTask(tid) {
    if (!confirm('Delete task?')) return
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: tid })
    })
    if (res.ok) fetchBoard()
  }

  async function editTask(task) {
    const newTitle = prompt("Edit task title:", task.title)
    if (newTitle === null) return
    const newDesc = prompt("Edit task description:", task.description)
    if (newDesc === null) return
    const newDueDate = prompt("Edit task due date (YYYY-MM-DD):", task.dueDate || '')

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        title: newTitle,
        description: newDesc,
        dueDate: newDueDate || null
      })
    })
    if (res.ok) fetchBoard()
    else alert(await res.text())
  }

  async function renameBoard() {
    const newTitle = prompt("Enter new board name:", board.title)
    if (!newTitle) return
    const res = await fetch(`/api/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    })
    if (res.ok) fetchBoard()
    else alert(await res.text())
  }

  return (
    <Layout>
      {!board ? <p className="muted">Loading...</p> :
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{board.title}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn" onClick={renameBoard}>Rename Board</button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await fetch(`/api/boards/${id}`, { method: 'DELETE' })
                  router.push('/')
                }}
              >
                Delete Board
              </button>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <h4>Tasks</h4>
            {board.tasks.length === 0 && <p className='muted'>No tasks yet.</p>}
            {board.tasks.map(t => (
              <div key={t.id} className="task">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{t.title}</strong>
                    <div className='muted' style={{ fontSize: 13 }}>{t.description}</div>
                    <div className='muted' style={{ fontSize: 12 }}>
                      Created: {new Date(t.createdAt).toLocaleDateString()}
                      {t.dueDate && <> | Due: {new Date(t.dueDate).toLocaleDateString()}</>}
                    </div>
                  </div>
                  <div>
                    <label style={{ marginRight: 8 }}>
                      <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} /> Completed
                    </label>
                    <button className="btn" onClick={() => editTask(t)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteTask(t.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <h4>Add Task</h4>
            <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
            <div style={{ marginTop: 8 }}>
              <textarea
                placeholder="description (optional)"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Due Date: </label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={addTask}>Add</button>
            </div>
          </div>
        </>
      }
    </Layout>
  )
}
