// Auth context. Firebase Auth when configured; else a local admin passcode.
import { createContext, useContext, useEffect, useState } from 'react'
import { firebaseEnabled, auth } from '../lib/firebase.js'
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut,
} from 'firebase/auth'

const AuthContext = createContext(null)
const LOCAL_PASSCODE = 'admin123' // demo passcode for local mode
const LS_ADMIN = 'rwh_admin'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!firebaseEnabled)

  useEffect(() => {
    if (!firebaseEnabled) {
      setUser(localStorage.getItem(LS_ADMIN) === '1' ? { local: true, email: 'admin (local)' } : null)
      return
    }
    return onAuthStateChanged(auth, (u) => { setUser(u); setReady(true) })
  }, [])

  async function signIn(email, password) {
    if (!firebaseEnabled) {
      if (password === LOCAL_PASSCODE) {
        localStorage.setItem(LS_ADMIN, '1')
        setUser({ local: true, email: 'admin (local)' })
        return
      }
      throw new Error('Invalid passcode (demo passcode: admin123)')
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    if (!firebaseEnabled) { localStorage.removeItem(LS_ADMIN); setUser(null); return }
    await fbSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut, firebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
