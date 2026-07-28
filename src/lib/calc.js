// Core rainwater-harvesting engine: potential, recommendations, cost.
// All inputs in SI; UI converts sq.ft -> m2 before calling.

import { getRoof, getSoil } from '../data/tamilnadu.js'

export const SQFT_TO_M2 = 0.092903
// Municipal water tariff proxy for savings (Rs per 1000 L). Tunable by admin.
export const WATER_RATE_PER_KL = 30

// Harvested litres = area(m2) x rainfall(mm) x runoff.
// 1 mm over 1 m2 = 1 litre, so no extra unit factor needed.
export function harvestedLitres({ roofAreaM2, rainfallMm, roofType }) {
  const runoff = getRoof(roofType).runoff
  return Math.round(roofAreaM2 * rainfallMm * runoff)
}

// Recommend storage tank + recharge structures based on yield, soil, roof.
export function recommend({ roofAreaM2, rainfallMm, roofType, soilType, hasBorewell, hasOpenWell }) {
  const litres = harvestedLitres({ roofAreaM2, rainfallMm, roofType })
  const soil = getSoil(soilType)

  // First-flush + practical storage: size to ~5% of annual yield, clamped 1000..20000 L.
  const rawStorage = litres * 0.05
  const storageTankL = clampRound(rawStorage, 1000, 20000, 500)

  // Recharge feasibility from soil. Black/clay -> favour storage, minimal recharge.
  const rechargeFeasible = soil.infiltration >= 0.5
  const dailyPeakIntensity = 60 // mm/day design storm proxy for TN NE monsoon
  const peakDayLitres = roofAreaM2 * dailyPeakIntensity * getRoof(roofType).runoff

  // One standard recharge pit ~1m x 1m x 3m handles ~ this many L/day of a storm event.
  const pitCapacityL = 1500 * soil.infiltration
  let numRechargePits = rechargeFeasible ? Math.max(1, Math.ceil(peakDayLitres / pitCapacityL / 4)) : 0
  numRechargePits = Math.min(numRechargePits, 6)

  // Pipe diameter from roof area (drainage rule of thumb).
  let pipeDiaMm = 90
  if (roofAreaM2 > 100) pipeDiaMm = 110
  if (roofAreaM2 > 200) pipeDiaMm = 160

  // Filter unit sizing.
  const filterType = roofAreaM2 > 150 ? 'Large PVC/sand-gravel filter (500 mm dia)' : 'Standard first-flush + sand-gravel filter (300 mm dia)'

  const rechargeStructure = rechargeFeasible
    ? (hasBorewell
        ? 'Recharge pit connected to borewell recharge well (with filter chamber)'
        : (hasOpenWell
            ? 'Recharge pit directed to open well recharge'
            : 'Percolation recharge pits (1m × 1m × 3m each) with filter media'))
    : 'Soil has low infiltration — prioritise storage tank; percolation trench optional'

  const rechargePitDim = rechargeFeasible ? '1.0 m × 1.0 m × 3.0 m (L×W×D), filled with 40mm & 20mm gravel + coarse sand' : 'Not recommended (poor soil infiltration)'

  return {
    harvestedLitres: litres,
    storageTankL,
    numRechargePits,
    rechargePitDim,
    rechargeStructure,
    rechargeFeasible,
    pipeDiaMm,
    filterType,
    soilLabel: soil.label,
  }
}

// Rough itemised cost (INR). Tunable by admin. TN market rates ~2024.
export function estimateCost(rec, mult = 1) {
  const items = []
  // Storage tank ~ Rs 6/L installed (PVC/Sintex) blended.
  const tank = Math.round(rec.storageTankL * 6)
  items.push({ item: `Storage tank (${rec.storageTankL.toLocaleString()} L)`, cost: tank })

  // Piping lump based on pipe dia.
  const piping = rec.pipeDiaMm >= 160 ? 9000 : rec.pipeDiaMm >= 110 ? 6000 : 4000
  items.push({ item: `Rainwater down-pipes (${rec.pipeDiaMm} mm)`, cost: piping })

  // Filter unit.
  const filter = rec.filterType.startsWith('Large') ? 12000 : 6500
  items.push({ item: 'Filter unit', cost: filter })

  if (rec.rechargeFeasible && rec.numRechargePits > 0) {
    const perPit = 8000 // excavation + gravel + PVC chamber per pit
    const excavation = rec.numRechargePits * perPit
    items.push({ item: `Recharge pits × ${rec.numRechargePits} (excavation + media)`, cost: excavation })
  }

  // Labour + fittings ~ 20% of material.
  const material = items.reduce((s, i) => s + i.cost, 0)
  const labour = Math.round(material * 0.2)
  items.push({ item: 'Labour & fittings', cost: labour })

  const scaled = items.map((i) => ({ ...i, cost: Math.round(i.cost * mult) }))
  const total = scaled.reduce((s, i) => s + i.cost, 0)
  return { items: scaled, total }
}

// Annual savings = harvested litres actually usable (~70%) valued at water rate.
export function annualSavings(litres, rate = WATER_RATE_PER_KL) {
  const usableKL = (litres * 0.7) / 1000
  return Math.round(usableKL * rate)
}

function clampRound(v, min, max, step) {
  const clamped = Math.max(min, Math.min(max, v))
  return Math.round(clamped / step) * step
}

// One-shot: build the full assessment result object from raw form values.
export function assess(input) {
  const roofAreaM2 = input.roofUnit === 'sqft' ? input.roofArea * SQFT_TO_M2 : input.roofArea
  const rec = recommend({
    roofAreaM2,
    rainfallMm: input.rainfall,
    roofType: input.roofType,
    soilType: input.soilType,
    hasBorewell: input.hasBorewell,
    hasOpenWell: input.hasOpenWell,
  })
  const cost = estimateCost(rec, input.costMultiplier || 1)
  const savings = annualSavings(rec.harvestedLitres, input.waterRate || WATER_RATE_PER_KL)
  return {
    ...rec,
    roofAreaM2: Math.round(roofAreaM2 * 100) / 100,
    cost,
    annualSavings: savings,
    paybackYears: cost.total > 0 ? Math.round((cost.total / Math.max(savings, 1)) * 10) / 10 : 0,
  }
}
