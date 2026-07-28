// Auth context. Firebase Auth when configured; else a local admin passcode.
import { createContext, useContext, useEffect, useState } from 'react'
import { firebaseEnabled, auth } from '../lib/firebase.js'
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut,
  GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth'

const AuthContext = createContext(null)
const LOCAL_PASSCODE = 'admin123' // demo passcode for local mode
const LS_ADMIN = 'rwh_admin'

// Allowlisted admin emails. Only these accounts may access /admin.
// Any other authenticated Firebase user is signed in but treated as non-admin.
const ADMIN_EMAILS = [
  'nambuharisaran123@gmail.com',
  'growwithsujith@gmail.com',
]
const isAdminEmail = (email) => !!email && ADMIN_EMAILS.includes(email.toLowerCase())

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

  async function signInWithGoogle() {
    if (!firebaseEnabled) throw new Error('Google sign-in needs Firebase configured.')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    await signInWithPopup(auth, provider)
  }

  async function signOut() {
    if (!firebaseEnabled) { localStorage.removeItem(LS_ADMIN); setUser(null); return }
    await fbSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{
      user, ready, signIn, signInWithGoogle, signOut, firebaseEnabled,
      isAdmin: user ? (user.local || isAdminEmail(user.email)) : false,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
