// @ts-nocheck
import { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState('')
  const router=useRouter()
  async function submit(e){
    e.preventDefault()
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    if(res.status===200){ router.push('/') } else {
      const txt = await res.text(); alert(txt)
    }
  }
  return (
    <Layout>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" type="submit">Login</button>
        </div>
      </form>
      <p className="muted" style={{marginTop:12}}>No account? <a href="/register">Register</a></p>
    </Layout>
  )
}
