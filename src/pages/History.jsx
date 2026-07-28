import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAssessments } from '../lib/store.js'
import { firebaseEnabled } from '../lib/firebase.js'

export default function History() {
  const [rows, setRows] = useState(null)

  useEffect(() => { listAssessments().then(setRows).catch(() => setRows([])) }, [])

  return (
    <div className="card">
      <h2>Assessment History</h2>
      <p className="sub">
        {firebaseEnabled ? 'Stored in Firestore.' : 'Stored locally in this browser.'} Most recent first.
      </p>

      {rows === null && <div className="info-line">Loading…</div>}
      {rows && rows.length === 0 && (
        <div className="center" style={{ padding: 30 }}>
          <p className="muted">No assessments yet.</p>
          <Link to="/assess" className="btn mt">Start an Assessment</Link>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Property</th><th>Location</th>
                <th>Roof</th><th>Harvest (L/yr)</th><th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{fmtDate(r.createdAt)}</td>
                  <td>{r.propertyName || r.ownerName || '—'}</td>
                  <td>{[r.village, r.taluk, r.district].filter(Boolean).join(', ')}</td>
                  <td>{r.roofType}</td>
                  <td>{Number(r.harvestedLitres || 0).toLocaleString('en-IN')}</td>
                  <td>{Number(r.totalCost || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function fmtDate(v) {
  if (!v) return '—'
  const d = v.seconds ? new Date(v.seconds * 1000) : new Date(v)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
