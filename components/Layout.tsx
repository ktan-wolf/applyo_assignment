// @ts-nocheck
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="container">
      <header>
        <h2>TaskBoards</h2>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/" className="btn btn-home" style={{ marginRight: 12 }}>Home</Link>
          <Link href="/login" className="btn btn-login" style={{ marginRight: 12 }}>Login</Link>
          <Link href="/register" className="btn btn-register" style={{ marginRight: 12 }}>Register</Link>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ padding: '6px 10px', fontSize: '14px' }}
          >
            Logout
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}
