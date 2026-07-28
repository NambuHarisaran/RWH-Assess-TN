// Tamil Nadu district reference data.
// rainfall = long-period annual average (mm), soil = dominant soil group.
// Values are representative averages for MVP estimation; admin can override via Firestore.
// Sources: IMD normals + TN State Land Use Board generalised soil map.

export const DISTRICTS = [
  { name: 'Ariyalur', rainfall: 1050, soil: 'Black', taluks: ['Ariyalur', 'Sendurai', 'Udayarpalayam', 'Andimadam'] },
  { name: 'Chengalpattu', rainfall: 1250, soil: 'Red', taluks: ['Chengalpattu', 'Tambaram', 'Tirukalukundram', 'Madurantakam', 'Cheyyur', 'Pallavaram'] },
  { name: 'Chennai', rainfall: 1400, soil: 'Sandy', taluks: ['Egmore', 'Mylapore', 'Perambur', 'Ambattur', 'Sholinganallur', 'Guindy'] },
  { name: 'Coimbatore', rainfall: 700, soil: 'Red', taluks: ['Coimbatore North', 'Coimbatore South', 'Mettupalayam', 'Pollachi', 'Sulur', 'Valparai', 'Annur'] },
  { name: 'Cuddalore', rainfall: 1300, soil: 'Alluvial', taluks: ['Cuddalore', 'Chidambaram', 'Panruti', 'Virudhachalam', 'Kurinjipadi', 'Tittakudi'] },
  { name: 'Dharmapuri', rainfall: 900, soil: 'Red', taluks: ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Karimangalam', 'Pappireddipatti'] },
  { name: 'Dindigul', rainfall: 850, soil: 'Red', taluks: ['Dindigul', 'Palani', 'Kodaikanal', 'Oddanchatram', 'Vedasandur', 'Natham', 'Nilakottai'] },
  { name: 'Erode', rainfall: 750, soil: 'Red', taluks: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Sathyamangalam', 'Perundurai', 'Anthiyur', 'Kodumudi'] },
  { name: 'Kallakurichi', rainfall: 1000, soil: 'Red', taluks: ['Kallakurichi', 'Sankarapuram', 'Chinnasalem', 'Ulundurpet', 'Tirukoilur'] },
  { name: 'Kancheepuram', rainfall: 1150, soil: 'Red', taluks: ['Kancheepuram', 'Uthiramerur', 'Walajabad', 'Sriperumbudur', 'Kundrathur'] },
  { name: 'Kanniyakumari', rainfall: 1450, soil: 'Laterite', taluks: ['Nagercoil', 'Kalkulam', 'Vilavancode', 'Agasteeswaram', 'Thovalai', 'Killiyoor'] },
  { name: 'Karur', rainfall: 700, soil: 'Black', taluks: ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Kadavur', 'Manmangalam'] },
  { name: 'Krishnagiri', rainfall: 830, soil: 'Red', taluks: ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Pochampalli', 'Uthangarai', 'Bargur'] },
  { name: 'Madurai', rainfall: 850, soil: 'Black', taluks: ['Madurai North', 'Madurai South', 'Melur', 'Vadipatti', 'Usilampatti', 'Peraiyur', 'Thirumangalam'] },
  { name: 'Mayiladuthurai', rainfall: 1250, soil: 'Alluvial', taluks: ['Mayiladuthurai', 'Sirkali', 'Tharangambadi', 'Kuthalam'] },
  { name: 'Nagapattinam', rainfall: 1300, soil: 'Alluvial', taluks: ['Nagapattinam', 'Kilvelur', 'Vedaranyam', 'Thirukkuvalai'] },
  { name: 'Namakkal', rainfall: 800, soil: 'Red', taluks: ['Namakkal', 'Rasipuram', 'Tiruchengode', 'Kolli Hills', 'Paramathi Velur', 'Sendamangalam'] },
  { name: 'Nilgiris', rainfall: 1900, soil: 'Laterite', taluks: ['Udhagamandalam', 'Coonoor', 'Kotagiri', 'Gudalur', 'Kundah', 'Pandalur'] },
  { name: 'Perambalur', rainfall: 950, soil: 'Black', taluks: ['Perambalur', 'Kunnam', 'Veppanthattai', 'Alathur'] },
  { name: 'Pudukkottai', rainfall: 900, soil: 'Red', taluks: ['Pudukkottai', 'Aranthangi', 'Alangudi', 'Illuppur', 'Gandarvakottai', 'Karambakudi', 'Thirumayam'] },
  { name: 'Ramanathapuram', rainfall: 830, soil: 'Sandy', taluks: ['Ramanathapuram', 'Paramakudi', 'Rameswaram', 'Mudukulathur', 'Tiruvadanai', 'Kamuthi', 'Kadaladi'] },
  { name: 'Ranipet', rainfall: 1000, soil: 'Red', taluks: ['Ranipet', 'Arcot', 'Walajah', 'Arakkonam', 'Nemili', 'Sholinghur'] },
  { name: 'Salem', rainfall: 900, soil: 'Red', taluks: ['Salem', 'Attur', 'Mettur', 'Omalur', 'Sankagiri', 'Yercaud', 'Edappadi', 'Gangavalli'] },
  { name: 'Sivaganga', rainfall: 900, soil: 'Red', taluks: ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tirupathur', 'Ilayangudi'] },
  { name: 'Tenkasi', rainfall: 950, soil: 'Red', taluks: ['Tenkasi', 'Sankarankovil', 'Shencottai', 'Kadayanallur', 'Alangulam', 'Sivagiri', 'Veerakeralampudur'] },
  { name: 'Thanjavur', rainfall: 1000, soil: 'Alluvial', taluks: ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Papanasam', 'Orathanadu', 'Thiruvaiyaru', 'Peravurani'] },
  { name: 'Theni', rainfall: 800, soil: 'Red', taluks: ['Theni', 'Periyakulam', 'Bodinayakanur', 'Uthamapalayam', 'Andipatti'] },
  { name: 'Thoothukudi', rainfall: 700, soil: 'Black', taluks: ['Thoothukudi', 'Tiruchendur', 'Kovilpatti', 'Ottapidaram', 'Srivaikuntam', 'Vilathikulam', 'Sathankulam'] },
  { name: 'Tiruchirappalli', rainfall: 850, soil: 'Alluvial', taluks: ['Tiruchirappalli West', 'Tiruchirappalli East', 'Srirangam', 'Lalgudi', 'Manapparai', 'Musiri', 'Thuraiyur', 'Thottiyam'] },
  { name: 'Tirunelveli', rainfall: 800, soil: 'Red', taluks: ['Tirunelveli', 'Palayamkottai', 'Ambasamudram', 'Nanguneri', 'Radhapuram', 'Cheranmahadevi', 'Manur'] },
  { name: 'Tirupathur', rainfall: 900, soil: 'Red', taluks: ['Tirupathur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Jolarpet'] },
  { name: 'Tiruppur', rainfall: 700, soil: 'Red', taluks: ['Tiruppur North', 'Tiruppur South', 'Avinashi', 'Palladam', 'Udumalpet', 'Dharapuram', 'Kangeyam', 'Madathukulam'] },
  { name: 'Tiruvallur', rainfall: 1150, soil: 'Red', taluks: ['Tiruvallur', 'Ponneri', 'Gummidipoondi', 'Tiruttani', 'Poonamallee', 'Avadi', 'Uthukottai'] },
  { name: 'Tiruvannamalai', rainfall: 1050, soil: 'Red', taluks: ['Tiruvannamalai', 'Arni', 'Cheyyar', 'Polur', 'Vandavasi', 'Chengam', 'Kilpennathur', 'Kalasapakkam'] },
  { name: 'Tiruvarur', rainfall: 1150, soil: 'Alluvial', taluks: ['Tiruvarur', 'Mannargudi', 'Nannilam', 'Thiruthuraipoondi', 'Needamangalam', 'Kudavasal', 'Valangaiman'] },
  { name: 'Vellore', rainfall: 1000, soil: 'Red', taluks: ['Vellore', 'Katpadi', 'Gudiyatham', 'Anaicut', 'Pernambut', 'K.V.Kuppam'] },
  { name: 'Viluppuram', rainfall: 1100, soil: 'Red', taluks: ['Viluppuram', 'Tindivanam', 'Gingee', 'Vanur', 'Vikravandi', 'Marakkanam', 'Kandachipuram'] },
  { name: 'Virudhunagar', rainfall: 800, soil: 'Black', taluks: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Srivilliputhur', 'Aruppukkottai', 'Sattur', 'Tiruchuli', 'Kariapatti'] },
]

// Soil groups -> recharge feasibility multiplier (higher = better infiltration).
export const SOIL_TYPES = [
  { name: 'Red', infiltration: 0.85, label: 'Red loam (good recharge)' },
  { name: 'Sandy', infiltration: 1.0, label: 'Sandy (excellent recharge)' },
  { name: 'Alluvial', infiltration: 0.9, label: 'Alluvial (good recharge)' },
  { name: 'Laterite', infiltration: 0.8, label: 'Laterite (moderate recharge)' },
  { name: 'Black', infiltration: 0.45, label: 'Black cotton (poor recharge — favour storage)' },
  { name: 'Clay', infiltration: 0.35, label: 'Clay (poor recharge — favour storage)' },
]

export const ROOF_TYPES = [
  { name: 'RCC Concrete', runoff: 0.85 },
  { name: 'Tiled', runoff: 0.75 },
  { name: 'Metal Sheet', runoff: 0.90 },
  { name: 'Others', runoff: 0.70 },
]

// Approx district centroids [lat, lng] for offline GPS nearest-match.
export const CENTROIDS = {
  Ariyalur: [11.14, 79.08], Chengalpattu: [12.69, 79.98], Chennai: [13.08, 80.27],
  Coimbatore: [11.02, 76.96], Cuddalore: [11.75, 79.75], Dharmapuri: [12.13, 78.16],
  Dindigul: [10.36, 77.98], Erode: [11.34, 77.72], Kallakurichi: [11.74, 78.96],
  Kancheepuram: [12.84, 79.70], Kanniyakumari: [8.19, 77.41], Karur: [10.96, 78.08],
  Krishnagiri: [12.52, 78.21], Madurai: [9.93, 78.12], Mayiladuthurai: [11.10, 79.65],
  Nagapattinam: [10.77, 79.84], Namakkal: [11.22, 78.17], Nilgiris: [11.41, 76.70],
  Perambalur: [11.23, 78.88], Pudukkottai: [10.38, 78.82], Ramanathapuram: [9.37, 78.83],
  Ranipet: [12.94, 79.33], Salem: [11.66, 78.15], Sivaganga: [9.85, 78.48],
  Tenkasi: [8.96, 77.31], Thanjavur: [10.79, 79.14], Theni: [10.01, 77.48],
  Thoothukudi: [8.76, 78.13], Tiruchirappalli: [10.79, 78.70], Tirunelveli: [8.71, 77.76],
  Tirupathur: [12.50, 78.57], Tiruppur: [11.11, 77.34], Tiruvallur: [13.14, 79.91],
  Tiruvannamalai: [12.23, 79.07], Tiruvarur: [10.77, 79.63], Vellore: [12.92, 79.13],
  Viluppuram: [11.94, 79.49], Virudhunagar: [9.58, 77.96],
}

export function nearestDistrict(lat, lng) {
  let best = null, bestD = Infinity
  for (const [name, [dlat, dlng]] of Object.entries(CENTROIDS)) {
    const dist = (lat - dlat) ** 2 + (lng - dlng) ** 2
    if (dist < bestD) { bestD = dist; best = name }
  }
  return best
}

export function getDistrict(name) {
  return DISTRICTS.find((d) => d.name === name)
}

export function getSoil(name) {
  return SOIL_TYPES.find((s) => s.name === name) || SOIL_TYPES[0]
}

export function getRoof(name) {
  return ROOF_TYPES.find((r) => r.name === name) || ROOF_TYPES[0]
}
