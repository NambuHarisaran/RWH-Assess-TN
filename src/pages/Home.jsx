import { Link } from 'react-router-dom'
import { firebaseEnabled } from '../lib/firebase.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="badge light" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>Tamil Nadu · Phase 1 MVP</span>
        <h1 style={{ marginTop: 12 }}>Estimate your rainwater harvesting potential</h1>
        <p>
          Enter your location and building details to calculate how much rainwater you can harvest each year,
          get structure recommendations, cost estimates, and a downloadable PDF report.
        </p>
        <Link to="/assess" className="btn light">Start Assessment →</Link>
      </section>

      {!firebaseEnabled && (
        <div className="notice">
          Running in <b>local mode</b> — assessments save to this browser. Add Firebase keys in <code>.env</code> to enable cloud storage &amp; admin login.
        </div>
      )}

      <div className="features">
        <Feature ic="📍" t="Location-aware" d="38 TN districts with rainfall normals and dominant soil type. GPS auto-detect supported." />
        <Feature ic="🧮" t="Instant calculation" d="Harvestable litres from roof area × rainfall × runoff coefficient by roof type." />
        <Feature ic="🏗️" t="Recommendations" d="Storage tank size, recharge pits, filter unit and pipe diameter tuned to soil & yield." />
        <Feature ic="💰" t="Cost estimate" d="Itemised installation cost — tank, pipes, filter, excavation, labour." />
        <Feature ic="📄" t="PDF report" d="Professional downloadable report with full assessment summary and costs." />
        <Feature ic="💾" t="Saved history" d="Every assessment stored for future reference and admin review." />
      </div>

      <div className="card mt">
        <h2>How it works</h2>
        <p className="sub">Three quick steps</p>
        <ol style={{ paddingLeft: 20, color: 'var(--slate)', lineHeight: 2 }}>
          <li><b>Location</b> — pick district / taluk / village or use GPS. Rainfall &amp; soil auto-fill.</li>
          <li><b>Building &amp; site</b> — roof area, roof type, soil, existing water sources.</li>
          <li><b>Results</b> — potential, recommendations, cost, and PDF download.</li>
        </ol>
      </div>
    </>
  )
}

function Feature({ ic, t, d }) {
  return (
    <div className="feature">
      <div className="fic">{ic}</div>
      <h3>{t}</h3>
      <p>{d}</p>
    </div>
  )
}
