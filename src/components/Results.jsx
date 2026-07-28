import { useState } from 'react'
import { generatePDF } from '../lib/pdf.js'

export default function Results({ form, result, onSave, onRestart }) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const input = {
    ownerName: form.ownerName, propertyName: form.propertyName,
    district: form.district, taluk: form.taluk, village: form.village,
    roofType: form.roofType, soilType: form.soilType, rainfall: Number(form.rainfall),
  }

  async function handleSave() {
    setSaving(true)
    try { await onSave(); setSaved(true) }
    catch (e) { alert('Save failed: ' + e.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="result-hero">
        <div className="lbl">Harvestable Rainwater</div>
        <div className="big">{result.harvestedLitres.toLocaleString('en-IN')}</div>
        <div className="unit">litres per year</div>
      </div>

      <div className="stat-grid">
        <Stat k="Annual Rainfall" v={`${input.rainfall}`} u="mm" />
        <Stat k="Roof Area" v={`${result.roofAreaM2}`} u="m²" />
        <Stat k="Storage Tank" v={result.storageTankL.toLocaleString('en-IN')} u="litres" />
        <Stat k="Recharge Pits" v={result.numRechargePits || '—'} u={result.numRechargePits ? 'pits' : ''} />
        <Stat k="Est. Annual Savings" v={`₹${result.annualSavings.toLocaleString('en-IN')}`} />
        <Stat k="Payback" v={result.paybackYears || '—'} u={result.paybackYears ? 'years' : ''} />
      </div>

      <div className="card">
        <h2>Recommended System</h2>
        <p className="sub">{result.soilLabel}</p>
        <ul className="reco-list">
          <Reco k="Storage tank" v={`${result.storageTankL.toLocaleString('en-IN')} litres`} />
          <Reco k="Recharge structure" v={result.rechargeStructure} />
          <Reco k="Recharge pit size" v={result.rechargePitDim} />
          {result.numRechargePits > 0 && <Reco k="Number of pits" v={`${result.numRechargePits}`} />}
          <Reco k="Filter unit" v={result.filterType} />
          <Reco k="Down-pipe diameter" v={`${result.pipeDiaMm} mm`} />
        </ul>
      </div>

      <div className="card">
        <h2>Estimated Installation Cost</h2>
        <p className="sub">Indicative TN market rates — verify locally before purchase.</p>
        <table className="cost-table">
          <tbody>
            {result.cost.items.map((i) => (
              <tr key={i.item}><td>{i.item}</td><td>₹{i.cost.toLocaleString('en-IN')}</td></tr>
            ))}
            <tr className="total"><td>Total Estimated Cost</td><td>₹{result.cost.total.toLocaleString('en-IN')}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="btn-row mt">
        <button className="btn" onClick={() => generatePDF({ input, result })}>📄 Download PDF Report</button>
        <button className="btn green" onClick={handleSave} disabled={saving || saved}>
          {saving ? <><span className="spinner" /> Saving…</> : saved ? '✓ Saved' : '💾 Save Assessment'}
        </button>
        <button className="btn ghost" onClick={onRestart}>↺ New Assessment</button>
      </div>
      {saved && <div className="info-line" style={{ color: 'var(--green)' }}>✓ Assessment saved. View it under History.</div>}
    </>
  )
}

function Stat({ k, v, u }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v">{v} {u && <small>{u}</small>}</div>
    </div>
  )
}

function Reco({ k, v }) {
  return (
    <li>
      <span className="ic">✓</span>
      <span className="rk">{k}</span>
      <span>{v}</span>
    </li>
  )
}
