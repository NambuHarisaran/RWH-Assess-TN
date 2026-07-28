import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { signIn, firebaseEnabled } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try { await signIn(email, password); nav('/admin') }
    catch (e2) { setErr(e2.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '20px auto' }}>
      <h2>Admin Login</h2>
      <p className="sub">
        {firebaseEnabled ? 'Sign in with your Firebase admin account.' : 'Local mode — demo passcode below.'}
      </p>
      <form onSubmit={submit}>
        {firebaseEnabled && (
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <div className="field">
          <label>{firebaseEnabled ? 'Password' : 'Passcode'}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={firebaseEnabled ? '' : 'admin123'} required />
        </div>
        {err && <div className="info-line" style={{ color: 'var(--amber)' }}>{err}</div>}
        <button className="btn block mt" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
      {!firebaseEnabled && <p className="muted mt" style={{ fontSize: 13 }}>Demo passcode: <b>admin123</b></p>}
    </div>
  )
}
