import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DISTRICTS, getDistrict } from '../data/tamilnadu.js'
import { getSettings, saveSettings, listAssessments } from '../lib/store.js'
import { WATER_RATE_PER_KL } from '../lib/calc.js'

export default function Admin() {
  const { user, isAdmin, ready, signOut } = useAuth()
  const nav = useNavigate()
  const [settings, setSettings] = useState(null)
  const [rows, setRows] = useState([])
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (ready && !user) nav('/login')
  }, [ready, user])

  useEffect(() => {
    if (!user || !isAdmin) return
    getSettings().then((s) => setSettings({
      waterRate: s.waterRate ?? WATER_RATE_PER_KL,
      costMultiplier: s.costMultiplier ?? 1,
      rainfallOverrides: s.rainfallOverrides ?? {},
    }))
    listAssessments().then(setRows).catch(() => setRows([]))
  }, [user, isAdmin])

  // Signed in but not an allowlisted admin.
  if (user && !isAdmin) {
    return (
      <div className="card">
        <h2>Access denied</h2>
        <p className="sub">{user.email} is not an authorised admin account.</p>
        <button className="btn ghost" onClick={() => { signOut(); nav('/') }}>Sign out</button>
      </div>
    )
  }

  if (!user || !settings) return <div className="card"><div className="info-line">Loading…</div></div>

  function setOverride(district, val) {
    setSettings((s) => {
      const ov = { ...s.rainfallOverrides }
      if (val === '' || val == null) delete ov[district]
      else ov[district] = Number(val)
      return { ...s, rainfallOverrides: ov }
    })
  }

  async function save() {
    await saveSettings(settings)
    setSavedMsg('✓ Settings saved.')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Admin Dashboard</h2>
            <p className="sub" style={{ marginBottom: 0 }}>Signed in as {user.email}</p>
          </div>
          <button className="btn ghost" onClick={() => { signOut(); nav('/') }}>Sign Out</button>
        </div>
      </div>

      <div className="card">
        <h2>Global Cost Settings</h2>
        <p className="sub">Applied to all future assessments.</p>
        <div className="grid2">
          <div className="field">
            <label>Water tariff (₹ per 1000 L) <span className="hint">for savings calc</span></label>
            <input type="number" value={settings.waterRate}
              onChange={(e) => setSettings((s) => ({ ...s, waterRate: Number(e.target.value) }))} />
          </div>
          <div className="field">
            <label>Cost multiplier <span className="hint">1.0 = base rates</span></label>
            <input type="number" step="0.05" value={settings.costMultiplier}
              onChange={(e) => setSettings((s) => ({ ...s, costMultiplier: Number(e.target.value) }))} />
          </div>
        </div>
        <button className="btn" onClick={save}>Save Settings</button>
        {savedMsg && <span className="info-line" style={{ color: 'var(--green)', display: 'inline-flex', marginLeft: 12 }}>{savedMsg}</span>}
      </div>

      <div className="card">
        <h2>Rainfall Database</h2>
        <p className="sub">Override district annual rainfall (mm). Blank = use default normal.</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>District</th><th>Default (mm)</th><th>Override (mm)</th></tr></thead>
            <tbody>
              {DISTRICTS.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td className="muted">{d.rainfall}</td>
                  <td>
                    <input type="number" style={{ maxWidth: 130 }}
                      value={settings.rainfallOverrides[d.name] ?? ''}
                      placeholder={String(d.rainfall)}
                      onChange={(e) => setOverride(d.name, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn mt" onClick={save}>Save Rainfall Overrides</button>
      </div>

      <div className="card">
        <h2>Assessment History ({rows.length})</h2>
        <p className="sub">All saved assessments.</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Property</th><th>Location</th><th>Harvest (L/yr)</th><th>Cost (₹)</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="4" className="muted">No assessments yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.propertyName || r.ownerName || '—'}</td>
                  <td>{[r.taluk, r.district].filter(Boolean).join(', ')}</td>
                  <td>{Number(r.harvestedLitres || 0).toLocaleString('en-IN')}</td>
                  <td>{Number(r.totalCost || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
