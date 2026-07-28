// Data access layer: assessments + admin settings.
// Uses Firestore when configured, else localStorage. Same API either way.

import { firebaseEnabled, db } from './firebase.js'
import {
  collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'

const LS_KEY = 'rwh_assessments'
const LS_SETTINGS = 'rwh_settings'

export async function saveAssessment(record) {
  const payload = { ...record, createdAt: new Date().toISOString() }
  if (firebaseEnabled) {
    const ref = await addDoc(collection(db, 'assessments'), {
      ...record, createdAt: serverTimestamp(),
    })
    return ref.id
  }
  const list = readLS(LS_KEY)
  const id = 'local_' + Date.now()
  list.unshift({ id, ...payload })
  writeLS(LS_KEY, list)
  return id
}

export async function listAssessments() {
  if (firebaseEnabled) {
    const q = query(collection(db, 'assessments'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return readLS(LS_KEY)
}

// Admin-editable overrides (rainfall/cost/rules). Merged over defaults by caller.
export async function getSettings() {
  if (firebaseEnabled) {
    const ref = doc(db, 'settings', 'global')
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : {}
  }
  const raw = localStorage.getItem(LS_SETTINGS)
  return raw ? JSON.parse(raw) : {}
}

export async function saveSettings(settings) {
  if (firebaseEnabled) {
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true })
    return
  }
  localStorage.setItem(LS_SETTINGS, JSON.stringify(settings))
}

function readLS(k) {
  try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] }
}
function writeLS(k, v) { localStorage.setItem(k, JSON.stringify(v)) }
