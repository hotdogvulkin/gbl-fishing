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
