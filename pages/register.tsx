// @ts-nocheck
import { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
export default function Register(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [name,setName]=useState('')
  const router=useRouter()
  async function submit(e){
    e.preventDefault()
    const res = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})})
    if(res.status===201){ router.push('/login') } else {
      const txt = await res.text(); alert(txt)
    }
  }
  return (
    <Layout>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div><input placeholder="name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div style={{marginTop:8}}><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" type="submit">Create account</button>
        </div>
      </form>
      <p className="muted" style={{marginTop:12}}>Already have an account? <a href="/login">Login</a></p>
    </Layout>
  )
}
