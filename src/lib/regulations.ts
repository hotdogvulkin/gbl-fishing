export interface Regulation {
  species: string
  emoji: string
  minSizeIn: number | null   // inches; null = no statewide minimum
  dailyBag: number | string  // number or descriptive string
  season: string
  notes: string[]
  source: string             // regulatory citation / body
}

// Florida Fish & Wildlife Conservation Commission (FWC) freshwater regulations.
// Always verify at myfwc.com before fishing — these reflect general statewide rules
// and some waters have special management regulations that override these defaults.
export const REGULATIONS: Regulation[] = [
  {
    species: 'Largemouth Bass',
    emoji: '🐟',
    minSizeIn: 14,
    dailyBag: 5,
    season: 'Year-round',
    notes: [
      'No more than 1 fish per day may exceed 22 inches in most waters.',
      'Some lakes have special trophy bass regulations — check the FWC special regulations booklet for your specific water body.',
      'Black bass hybrids (shoal bass, Suwannee bass) are included in the 5-fish aggregate.',
      'Catch-and-release is always encouraged for large spawning females.',
    ],
    source: 'FWC — statewide largemouth bass rule',
  },
  {
    species: 'Black Crappie',
    emoji: '🐠',
    minSizeIn: null,
    dailyBag: 25,
    season: 'Year-round',
    notes: [
      'No statewide size limit — though some designated waters have a 9–10 inch minimum.',
      'Often called "speck" or "specks" locally in Florida.',
      'White crappie share the same 25-fish daily bag in waters where both occur.',
    ],
    source: 'FWC — sunfish and crappie rule',
  },
  {
    species: 'Bluegill',
    emoji: '🐡',
    minSizeIn: null,
    dailyBag: 50,
    season: 'Year-round',
    notes: [
      '50-fish daily bag is a combined limit shared with all other sunfish species (redear, warmouth, flier, etc.).',
      'No statewide size limit.',
      'Spawning beds are accessible year-round — fish congregate in shallow water May through August.',
    ],
    source: 'FWC — sunfish and crappie rule',
  },
  {
    species: 'Redear Sunfish',
    emoji: '🐡',
    minSizeIn: null,
    dailyBag: 50,
    season: 'Year-round',
    notes: [
      'Counted in the 50-fish combined sunfish daily bag along with bluegill and other sunfish.',
      'Also called "shellcracker" due to their diet of snails and small mussels.',
      'No statewide size limit.',
      'Tend to run larger than bluegill — 1+ lb fish are common in well-managed waters.',
    ],
    source: 'FWC — sunfish and crappie rule',
  },
  {
    species: 'Channel Catfish',
    emoji: '🐟',
    minSizeIn: null,
    dailyBag: 'No statewide limit',
    season: 'Year-round',
    notes: [
      'No statewide size or bag limit — but some water bodies have local restrictions.',
      'Blue catfish (where present) have the same open regulation.',
      'Flathead catfish have the same open regulation in most Florida waters.',
      'Check local regulations before fishing designated trophy catfish lakes.',
    ],
    source: 'FWC — catfish rule',
  },
  {
    species: 'Chain Pickerel',
    emoji: '🐟',
    minSizeIn: null,
    dailyBag: 'No statewide limit',
    season: 'Year-round',
    notes: [
      'No statewide size or bag limit.',
      'Often caught incidentally while bass fishing with fast-moving lures.',
      'Sharp teeth — handle with care and use a firm grip on the jaw or a net.',
      'Most abundant in weedy, tannic blackwater lakes and rivers in north and central Florida.',
    ],
    source: 'FWC — other freshwater species rule',
  },
  {
    species: 'Florida Gar',
    emoji: '🐍',
    minSizeIn: null,
    dailyBag: 'No statewide limit',
    season: 'Year-round',
    notes: [
      'No statewide size or bag limit.',
      'Longnose gar (found in some Florida waters) has the same open regulation.',
      'Gar eggs are highly toxic to humans and most warm-blooded animals — do not consume.',
      'Can breathe air directly — often seen rolling at the surface in low-oxygen water.',
    ],
    source: 'FWC — other freshwater species rule',
  },
  {
    species: 'Bowfin',
    emoji: '🐟',
    minSizeIn: null,
    dailyBag: 'No statewide limit',
    season: 'Year-round',
    notes: [
      'No statewide size or bag limit.',
      'Also called "mudfish" or "grinnel" locally.',
      'Considered a nuisance by some anglers but an effective predator that fights hard.',
      'Males guard nests and fry aggressively in spring — can be territorial near structure.',
    ],
    source: 'FWC — other freshwater species rule',
  },
]

export function searchRegulations(query: string): Regulation[] {
  const q = query.toLowerCase().trim()
  if (!q) return REGULATIONS
  return REGULATIONS.filter(r =>
    r.species.toLowerCase().includes(q) ||
    r.notes.some(n => n.toLowerCase().includes(q))
  )
}

// ── Saltwater / Offshore regulations ─────────────────────────────────────────
// Federal NOAA rules applicable to Florida offshore recreational fishing.
// Some species are state-managed (FWC) — jurisdiction noted per entry.
// Verify at fisheries.noaa.gov/southeast and myfwc.com before fishing;
// seasons and quotas are reviewed annually and may change.

export interface SaltwaterRegulation {
  species: string
  emoji: string
  minSizeIn: number | null       // inches; measurement type clarified in notes
  dailyBag: number | string
  season: string
  jurisdiction: 'Federal' | 'State (FWC)' | 'Federal / State'
  notes: string[]
  source: string
}

export const SALTWATER_REGULATIONS: SaltwaterRegulation[] = [
  {
    species: 'Mahi-Mahi (Dolphinfish)',
    emoji: '🐠',
    minSizeIn: 20,
    dailyBag: 10,
    season: 'Year-round',
    jurisdiction: 'Federal',
    notes: [
      '20-inch minimum is measured as fork length.',
      '10 fish per person per day recreational bag limit; no vessel limit applies.',
      'HMS Angling permit required if fish will be sold; permit-free for personal recreational harvest.',
      'May not be harvested with powerheads, bangsticks, or explosive devices.',
      'Weed lines and floating debris are key structure — most fish caught within 20 miles of shore.',
    ],
    source: 'NOAA Fisheries — Highly Migratory Species Division',
  },
  {
    species: 'Wahoo',
    emoji: '🐡',
    minSizeIn: null,
    dailyBag: 'No federal limit',
    season: 'Year-round',
    jurisdiction: 'Federal',
    notes: [
      'No federal minimum size limit and no federal bag limit for recreational anglers.',
      'No Florida state bag limit in state waters.',
      'One of the fastest fish in the ocean; commonly caught trolling at 12–18 knots.',
      'Most abundant off Florida November–February when fish follow cold fronts south.',
      'Single/double rigged ballyhoo with a skirt at speed is the standard Florida approach.',
    ],
    source: 'NOAA Fisheries — HMS Division (no specific federal management plan)',
  },
  {
    species: 'King Mackerel',
    emoji: '🐟',
    minSizeIn: 24,
    dailyBag: 3,
    season: 'Year-round (Gulf); Atlantic season check NOAA',
    jurisdiction: 'Federal',
    notes: [
      '24-inch fork length minimum for recreational anglers.',
      '3 fish per person per day recreational bag limit (Gulf and South Atlantic combined zones).',
      'Atlantic zone may have in-season closures when the annual quota is met — check NOAA for real-time status.',
      'Wire leader required — King Mackerel have razor-sharp teeth that cut monofilament on contact.',
      'Most productive on live bait near bait schools, buoy lines, and nearshore to mid-range structure.',
    ],
    source: 'NOAA Fisheries — SERO; Gulf of Mexico and South Atlantic FMPs',
  },
  {
    species: 'Spanish Mackerel',
    emoji: '🔪',
    minSizeIn: 12,
    dailyBag: 15,
    season: 'Year-round',
    jurisdiction: 'Federal',
    notes: [
      '12-inch fork length minimum.',
      '15 fish per person per day recreational bag limit.',
      'Part of the South Atlantic and Gulf of Mexico Spanish Mackerel FMP.',
      'Light wire leader or heavy fluorocarbon recommended — teeth will cut standard mono.',
      'Fast-swimming schooling fish; commonly caught near inlets, passes, and nearshore structure.',
    ],
    source: 'NOAA Fisheries — SERO; Spanish Mackerel FMP',
  },
  {
    species: 'Sailfish (Atlantic)',
    emoji: '⛵',
    minSizeIn: 63,
    dailyBag: 2,
    season: 'Year-round',
    jurisdiction: 'Federal',
    notes: [
      '63-inch minimum measured lower jaw to fork (LJFL).',
      '2 fish per person per day; most anglers practice voluntary catch-and-release.',
      'HMS Angling permit required to retain; cannot be sold under any circumstances.',
      'Must be reported if harvested — check HMS mandatory reporting requirements.',
      'Southeast Florida (Palm Beach to Miami) is the sailfish capital of the world; peak November–March.',
    ],
    source: 'NOAA Fisheries — HMS Division; Atlantic Billfish FMP',
  },
  {
    species: 'Blue / White Marlin',
    emoji: '🦈',
    minSizeIn: null,
    dailyBag: 0,
    season: 'PROHIBITED — catch and release only',
    jurisdiction: 'Federal',
    notes: [
      'Blue marlin and white marlin are PROHIBITED SPECIES — no retention allowed recreationally.',
      'Catch and release only; must be released immediately, without removing from water if possible.',
      'Striped marlin follow the same prohibition in Atlantic waters.',
      'In the event of unintentional mortality, contact NOAA Fisheries immediately — do not retain.',
      'HMS Angling permit must be onboard when targeting billfish.',
    ],
    source: 'NOAA Fisheries — HMS Division; prohibited species designation',
  },
  {
    species: 'Red Grouper',
    emoji: '🔴',
    minSizeIn: 20,
    dailyBag: 3,
    season: 'Gulf: closed Jan–Apr; open May–Dec. Atlantic: year-round',
    jurisdiction: 'Federal',
    notes: [
      '20-inch total length minimum.',
      '3 fish per person per day aggregate limit shared across all shallow-water grouper species.',
      'Gulf seasonal closure January 1–April 30 each year; Atlantic regulations differ — verify.',
      'Most productive on hard-bottom structure in 40–120 feet; responds well to live grunts and pinfish.',
      'Aggregate bag limit includes gag, black, scamp, red, and other shallow-water grouper.',
    ],
    source: 'NOAA Fisheries — SERO; Gulf of Mexico Grouper-Tilefish FMP',
  },
  {
    species: 'Gag Grouper',
    emoji: '🔵',
    minSizeIn: 24,
    dailyBag: 3,
    season: 'Gulf: closed Jan–Jun; open Jul–Dec. Atlantic: year-round',
    jurisdiction: 'Federal',
    notes: [
      '24-inch total length minimum.',
      'Counted in the 3-fish aggregate shallow-water grouper bag limit.',
      'Gulf recreational season July 1–December 31 only; Atlantic sector open year-round.',
      'Larger and more aggressive than red grouper — frequently found at the same structure.',
      'Artificial reefs and ledges in 40–80 feet are prime spots; live pinfish and whole sardines are top baits.',
    ],
    source: 'NOAA Fisheries — SERO; Gulf of Mexico Grouper-Tilefish FMP',
  },
  {
    species: 'Black Grouper',
    emoji: '⬛',
    minSizeIn: 24,
    dailyBag: 3,
    season: 'Atlantic: year-round (with aggregate limit)',
    jurisdiction: 'Federal',
    notes: [
      '24-inch total length minimum.',
      'Counted in the 3-fish shallow-water grouper aggregate bag limit.',
      'More common in deeper water (60–100 ft) on the Atlantic side than Gulf.',
      'Often found mixed with gag grouper on hard-bottom offshore structure.',
      'Large individuals may exceed 40 lbs — heavy gear (50–80 lb class) recommended on deep structure.',
    ],
    source: 'NOAA Fisheries — SERO; South Atlantic Snapper-Grouper FMP',
  },
  {
    species: 'Red Snapper',
    emoji: '🎯',
    minSizeIn: 16,
    dailyBag: 2,
    season: 'Gulf: announced annually (typically summer); Atlantic: extended season',
    jurisdiction: 'Federal',
    notes: [
      '16-inch total length minimum.',
      '2 fish per person per day in the Gulf; separate Atlantic allocation applies.',
      'Gulf recreational season dates are set annually by NOAA — check current year dates before planning.',
      'Atlantic red snapper season has expanded significantly in recent years; verify current federal season.',
      'Most Gulf fish caught in 40–150 feet on hard-bottom, natural ledges, and artificial reefs.',
    ],
    source: 'NOAA Fisheries — SERO; Gulf of Mexico Red Snapper FMP',
  },
  {
    species: 'Greater Amberjack',
    emoji: '🟡',
    minSizeIn: 34,
    dailyBag: 1,
    season: 'Gulf: closed Feb–Mar; rest open. Atlantic: varies',
    jurisdiction: 'Federal',
    notes: [
      '34-inch fork length minimum (Gulf); 28-inch fork length (Atlantic).',
      '1 fish per person per day bag limit.',
      'Gulf seasonal closure February 1–March 31; Atlantic sector may have separate closures.',
      'One of the hardest-fighting reef fish — commonly caught on ledges and wrecks in 60–120 feet.',
      'Live baits (blue runners, goggle-eyes) most effective; heavy gear required (80–130 lb class).',
    ],
    source: 'NOAA Fisheries — SERO; Gulf of Mexico Amberjack FMP',
  },
  {
    species: 'Cobia',
    emoji: '🎣',
    minSizeIn: 33,
    dailyBag: 2,
    season: 'Year-round',
    jurisdiction: 'Federal / State',
    notes: [
      '33-inch fork length minimum.',
      'Gulf: 2 fish per vessel per day recreational; Atlantic: 2 per person per day.',
      'Atlantic coast migration peaks January–April; Gulf coast peaks April–June.',
      'Often spotted free-swimming near crab trap floats, buoys, and swimming rays — sight fishing is effective.',
      'Live pinfish, eel, large bucktail jigs, and soft-plastic swimbaits all produce strikes.',
    ],
    source: 'NOAA Fisheries — SERO; Gulf and South Atlantic Cobia FMPs',
  },
  {
    species: 'Tarpon',
    emoji: '🏆',
    minSizeIn: null,
    dailyBag: 0,
    season: 'Year-round (C&R); tag required to harvest',
    jurisdiction: 'State (FWC)',
    notes: [
      'Tarpon may not be harvested without a $50 Florida tarpon tag (1 tag = 1 fish per person per year).',
      'Effectively catch-and-release only for most anglers — the tag is mainly for world-record documentation.',
      'Do not remove fish from water — prolonged air exposure is harmful; use proper revival technique.',
      'Charlotte Harbor, Boca Grande Pass, and Tampa Bay are world-famous tarpon fisheries; peak April–June.',
      'No minimum size limit — all tarpon must be released unless a tag is being used.',
    ],
    source: 'Florida FWC — Tarpon regulations; FWC Rule 68B-32',
  },
  {
    species: 'Snook',
    emoji: '🌊',
    minSizeIn: 28,
    dailyBag: 1,
    season: 'Multiple annual closures (see notes)',
    jurisdiction: 'State (FWC)',
    notes: [
      '28-inch total length minimum (both Atlantic and Gulf coasts of Florida).',
      '1 fish per person per day bag limit.',
      'Gulf coast: Closed December 1–January 31 and May 1–August 31.',
      'Atlantic coast (including Lake Okeechobee / Kissimmee River): Closed December 15–January 31 and May 1–August 31.',
      'Snook license endorsement required in addition to a Florida saltwater fishing license.',
      'No harvest allowed from bridges, piers, or within Charlotte Harbor Aquatic Preserve.',
    ],
    source: 'Florida FWC — Snook regulations; FWC Rule 68B-32.001',
  },
]

export function searchSaltwaterRegulations(query: string): SaltwaterRegulation[] {
  const q = query.toLowerCase().trim()
  if (!q) return SALTWATER_REGULATIONS
  return SALTWATER_REGULATIONS.filter(r =>
    r.species.toLowerCase().includes(q) ||
    r.notes.some(n => n.toLowerCase().includes(q))
  )
}
