import { useEffect, useState } from 'react'
import { DISTRICTS, SOIL_TYPES, ROOF_TYPES, getDistrict, nearestDistrict } from '../data/tamilnadu.js'
import { assess } from '../lib/calc.js'
import { getSettings, saveAssessment } from '../lib/store.js'
import Results from '../components/Results.jsx'

const STEPS = ['Location', 'Building', 'Site', 'Results']

const initial = {
  district: '', taluk: '', village: '',
  ownerName: '', propertyName: '',
  roofArea: '', roofUnit: 'm2', roofType: 'RCC Concrete',
  soilType: '', hasBorewell: false, hasOpenWell: false, hasTank: false,
  rainfall: 0, lat: null, lng: null,
}

export default function Assess() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial)
  const [result, setResult] = useState(null)
  const [settings, setSettings] = useState({})
  const [gpsMsg, setGpsMsg] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => { getSettings().then(setSettings) }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Rainfall for a district, honouring admin overrides.
  function rainfallFor(districtName) {
    const override = settings.rainfallOverrides?.[districtName]
    return override ?? getDistrict(districtName)?.rainfall ?? 0
  }

  function pickDistrict(name) {
    const d = getDistrict(name)
    setForm((f) => ({
      ...f, district: name, taluk: '', rainfall: rainfallFor(name),
      soilType: f.soilType || d?.soil || '',
    }))
  }

  function useGPS() {
    if (!navigator.geolocation) { setGpsMsg('Geolocation not supported on this device.'); return }
    setGpsMsg('Locating…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const name = nearestDistrict(latitude, longitude)
        setForm((f) => ({ ...f, lat: latitude, lng: longitude }))
        pickDistrict(name)
        setGpsMsg(`Detected nearest district: ${name} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`)
      },
      (err) => setGpsMsg('Could not get location: ' + err.message),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  function validateStep() {
    const e = {}
    if (step === 0 && !form.district) e.district = 'Select a district'
    if (step === 1) {
      if (!form.roofArea || Number(form.roofArea) <= 0) e.roofArea = 'Enter a valid roof area'
      if (!form.roofType) e.roofType = 'Select roof type'
    }
    if (step === 2 && !form.soilType) e.soilType = 'Select soil type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (!validateStep()) return
    if (step === 2) return runCalc()
    setStep((s) => s + 1)
  }

  function runCalc() {
    const res = assess({
      roofArea: Number(form.roofArea),
      roofUnit: form.roofUnit,
      roofType: form.roofType,
      soilType: form.soilType,
      rainfall: Number(form.rainfall),
      hasBorewell: form.hasBorewell,
      hasOpenWell: form.hasOpenWell,
      waterRate: settings.waterRate,
      costMultiplier: settings.costMultiplier,
    })
    setResult(res)
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onSave() {
    const record = {
      ownerName: form.ownerName, propertyName: form.propertyName,
      district: form.district, taluk: form.taluk, village: form.village,
      roofType: form.roofType, soilType: form.soilType, rainfall: Number(form.rainfall),
      roofAreaM2: result.roofAreaM2, harvestedLitres: result.harvestedLitres,
      storageTankL: result.storageTankL, totalCost: result.cost.total,
      annualSavings: result.annualSavings,
    }
    return saveAssessment(record)
  }

  function restart() { setForm(initial); setResult(null); setStep(0); setGpsMsg('') }

  const district = getDistrict(form.district)

  return (
    <>
      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <div className="bar" />
            <div className="lbl">{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="card">
          <h2>Where is the property?</h2>
          <p className="sub">Select your location in Tamil Nadu, or use GPS to detect it.</p>

          <div className="btn-row" style={{ marginBottom: 18 }}>
            <button className="btn ghost" onClick={useGPS}>📍 Use my GPS location</button>
          </div>
          {gpsMsg && <div className="info-line">ℹ️ {gpsMsg}</div>}

          <div className="field">
            <label>District *</label>
            <select value={form.district} onChange={(e) => pickDistrict(e.target.value)}>
              <option value="">— Select district —</option>
              {DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
            {errors.district && <div className="info-line" style={{ color: 'var(--amber)' }}>{errors.district}</div>}
          </div>

          <div className="grid2">
            <div className="field">
              <label>Taluk <span className="hint">(optional)</span></label>
              <select value={form.taluk} onChange={(e) => set('taluk', e.target.value)} disabled={!district}>
                <option value="">— Select taluk —</option>
                {district?.taluks.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Village / Area <span className="hint">(optional)</span></label>
              <input value={form.village} onChange={(e) => set('village', e.target.value)} placeholder="e.g. Anna Nagar" />
            </div>
          </div>

          {district && (
            <div className="notice" style={{ background: 'var(--teal-light)', border: '1px solid var(--teal)', color: 'var(--teal-dark)' }}>
              📊 Auto-retrieved for <b>{district.name}</b>: Annual rainfall <b>{form.rainfall} mm</b> · Dominant soil <b>{district.soil}</b>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <h2>Building details</h2>
          <p className="sub">Property info is optional. Roof details drive the calculation.</p>

          <div className="grid2">
            <div className="field">
              <label>Owner Name <span className="hint">(optional)</span></label>
              <input value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
            </div>
            <div className="field">
              <label>Property Name <span className="hint">(optional)</span></label>
              <input value={form.propertyName} onChange={(e) => set('propertyName', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Roof Area *</label>
            <div className="inline-unit">
              <input type="number" min="1" value={form.roofArea} onChange={(e) => set('roofArea', e.target.value)} placeholder="e.g. 120" />
              <select value={form.roofUnit} onChange={(e) => set('roofUnit', e.target.value)}>
                <option value="m2">m²</option>
                <option value="sqft">sq.ft</option>
              </select>
            </div>
            {errors.roofArea && <div className="info-line" style={{ color: 'var(--amber)' }}>{errors.roofArea}</div>}
          </div>

          <div className="field">
            <label>Roof Type *</label>
            <div className="radio-group">
              {ROOF_TYPES.map((r) => (
                <button key={r.name} type="button"
                  className={`radio-chip ${form.roofType === r.name ? 'active' : ''}`}
                  onClick={() => set('roofType', r.name)}>
                  {r.name} <span className="muted">({r.runoff})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>Site details</h2>
          <p className="sub">Soil type affects recharge feasibility. Existing sources refine recommendations.</p>

          <div className="field">
            <label>Soil Type *</label>
            <select value={form.soilType} onChange={(e) => set('soilType', e.target.value)}>
              <option value="">— Select soil type —</option>
              {SOIL_TYPES.map((s) => <option key={s.name} value={s.name}>{s.label}</option>)}
            </select>
            {errors.soilType && <div className="info-line" style={{ color: 'var(--amber)' }}>{errors.soilType}</div>}
            {district && <div className="info-line">ℹ️ District dominant soil: <b style={{ marginLeft: 4 }}>{district.soil}</b></div>}
          </div>

          <div className="mt">
            <Toggle label="Existing Borewell" v={form.hasBorewell} on={() => set('hasBorewell', !form.hasBorewell)} />
            <Toggle label="Existing Open Well" v={form.hasOpenWell} on={() => set('hasOpenWell', !form.hasOpenWell)} />
            <Toggle label="Existing Storage Tank" v={form.hasTank} on={() => set('hasTank', !form.hasTank)} />
          </div>
        </div>
      )}

      {step === 3 && result && (
        <Results form={form} result={result} onSave={onSave} onRestart={restart} />
      )}

      {step < 3 && (
        <div className="btn-row mt" style={{ justifyContent: 'space-between' }}>
          <button className="btn ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>← Back</button>
          <button className="btn" onClick={next}>{step === 2 ? 'Calculate Results →' : 'Next →'}</button>
        </div>
      )}
    </>
  )
}

function Toggle({ label, v, on }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button type="button" className={`radio-chip ${v ? 'active' : ''}`} onClick={on}>
        {v ? '✓ Yes' : 'No'}
      </button>
    </div>
  )
}
