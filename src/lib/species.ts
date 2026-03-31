export interface Species {
  id: string
  commonName: string
  scientificName: string
  description: string
  averageSize: string
  floridaRecord: string
  habitat: string
  tips: string[]
  iNaturalistQuery: string  // query string for iNaturalist taxa API photo lookup
}

export const SPECIES: Species[] = [
  {
    id: 'largemouth-bass',
    commonName: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    description:
      'Florida\'s premier gamefish and a true giant of North American freshwater. The Florida subspecies (M. s. floridanus) grows substantially larger than the northern form, producing the bulk of world-record caliber fish caught each year.',
    averageSize: '1–4 lbs, 12–18 inches; trophy class over 8 lbs',
    floridaRecord: '17 lbs 4 oz — Big Fish Lake, 1986',
    habitat:
      'Prefers vegetated shallows, submerged timber, dock pilings, and any hard cover near deeper water. Holds in hydrilla mats, lily pads, and grass lines across Florida\'s lakes and rivers.',
    tips: [
      'Fish heavy cover with a Texas-rigged worm or flipping jig — Florida bass rarely leave the grass.',
      'Early morning and late evening produce on topwater (Zara Spook, popper) when bass are feeding aggressively.',
      'Slow down in summer midday heat — drop-shot a finesse worm in 10–18 feet of water near the thermocline.',
      'Spawn activity peaks when water hits 62–68°F — males bed first and guard nests near 2–4 feet depth.',
    ],
    iNaturalistQuery: 'Micropterus salmoides',
  },
  {
    id: 'black-crappie',
    commonName: 'Black Crappie',
    scientificName: 'Pomoxis nigromaculatus',
    description:
      'The most sought-after panfish in Florida, known locally as "specks." Highly regarded for their firm, white fillets and willingness to bite. Travel in schools, so finding one usually means finding many.',
    averageSize: '0.5–1.5 lbs, 9–12 inches',
    floridaRecord: '3 lbs 13 oz — Lake Talquin, 1992',
    habitat:
      'Prefers clear water with submerged timber, brush piles, and moderate vegetation. Schools suspend at mid-depths near structure. Found statewide in natural lakes, reservoirs, and backwaters.',
    tips: [
      'Small tubes, curly-tail grubs, and 1/32–1/16 oz jigs under a slip float are the standard Florida approach.',
      'Fish vertically over brush piles — crappie stack tight to structure in 6–15 feet of water.',
      'Pre-spawn (January–March) is peak season in Florida; fish move shallow and are aggressive.',
      'Live minnows on a crappie rig outperform artificials on tough days.',
    ],
    iNaturalistQuery: 'Pomoxis nigromaculatus',
  },
  {
    id: 'bluegill',
    commonName: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    description:
      'Florida\'s most abundant sport fish and perfect for family fishing. Prolific spawners that maintain high populations in even heavily pressured waters. Outstanding table fare and a great target for ultralight tackle.',
    averageSize: '0.25–1 lb, 6–10 inches; over 1.5 lbs is exceptional',
    floridaRecord: '2 lbs 15 oz — Crystal Lake (Polk County), 2019',
    habitat:
      'Found in virtually every Florida freshwater body. Favors shallow weedy areas, dock edges, and submerged grass beds. Spawns in large colonies on sandy or hard-bottom flats in 1–4 feet.',
    tips: [
      'Small crickets under a bobber are devastatingly effective — keep hooks small (size 8–10).',
      'Spawning beds (May–August) concentrate fish in shallow water for easy catching.',
      'Light spinning gear or cane poles are ideal — ultralight setups with 4 lb line maximize fun.',
      'Look for dark patches on sandy lake bottoms indicating active spawn beds.',
    ],
    iNaturalistQuery: 'Lepomis macrochirus',
  },
  {
    id: 'redear-sunfish',
    commonName: 'Redear Sunfish',
    scientificName: 'Lepomis microlophus',
    description:
      'Called "shellcracker" throughout Florida for their diet of snails and small mussels, which they crush with hard plates in their throats. Often grow larger than bluegill and are a prized table fish.',
    averageSize: '0.5–1.5 lbs, 8–12 inches',
    floridaRecord: '4 lbs 7 oz — Merritt\'s Mill Pond, 2015',
    habitat:
      'Prefers deeper, clearer water than bluegill. Often found over hard sandy or shell-bottom areas in 4–12 feet. Spawns in shallower water alongside bluegill in late spring.',
    tips: [
      'Earthworms fished slow on the bottom are the most reliable shellcracker bait.',
      'Look for them in spring near hard-bottom areas — they spawn later than largemouth, typically April–May.',
      'Crickets and small live grass shrimp also produce well.',
      'Fish deeper than bluegill habitat — shellcrackers prefer firmer bottom with minimal vegetation.',
    ],
    iNaturalistQuery: 'Lepomis microlophus',
  },
  {
    id: 'channel-catfish',
    commonName: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    description:
      'The most widely distributed catfish in Florida and an excellent food fish. Adaptable to a wide range of conditions and found in everything from clear springs to murky canals. Night fishing from shore is the classic approach.',
    averageSize: '1–5 lbs, 12–20 inches',
    floridaRecord: '44 lbs 14 oz — Apalachicola River, 1994',
    habitat:
      'Prefers rivers, canals, and lake bottoms with sandy or muddy substrate. Seeks deep holes and undercut banks during the day. Moves to shallower areas at night to feed actively.',
    tips: [
      'Cut bream, chicken liver, and commercial stink baits are top producers.',
      'Fish on the bottom with a slip sinker rig — give the fish time to run before setting the hook.',
      'Night fishing from shore near channel edges or river bends is highly productive.',
      'Fresh-cut bait outperforms frozen almost every time.',
    ],
    iNaturalistQuery: 'Ictalurus punctatus',
  },
  {
    id: 'chain-pickerel',
    commonName: 'Chain Pickerel',
    scientificName: 'Esox niger',
    description:
      'An aggressive ambush predator with striking chain-link markings along its sides. Often called "jack" in Florida. Pound-for-pound one of the most aggressive fish in Florida freshwater, making them exciting to catch on light tackle.',
    averageSize: '0.75–2.5 lbs, 14–22 inches',
    floridaRecord: '6 lbs 4 oz — Lake Talquin, 1971',
    habitat:
      'Strongly associated with dense vegetation — hydrilla, lily pads, and emergent grass along lake edges. Favors darker, tannic blackwater systems in north and central Florida.',
    tips: [
      'Fast-moving spinnerbaits, shallow crankbaits, and swimbaits draw explosive strikes.',
      'Fish tight to vegetation edges — pickerel ambush from cover and won\'t chase far.',
      'Wire leader or heavy fluorocarbon recommended due to sharp teeth.',
      'Most active in cooler water temperatures (50–65°F) — winter is peak season.',
    ],
    iNaturalistQuery: 'Esox niger',
  },
  {
    id: 'florida-gar',
    commonName: 'Florida Gar',
    scientificName: 'Lepisosteus platyrhincus',
    description:
      'A prehistoric survivor largely unchanged for 100 million years. Native only to Florida and Georgia, the Florida Gar is covered in diamond-shaped ganoid scales nearly impervious to predators. Often seen rolling at the surface to gulp air.',
    averageSize: '2–5 lbs, 24–36 inches',
    floridaRecord: '9 lbs 6 oz — Boca Raton area canal, 1981',
    habitat:
      'Abundant in slow-moving shallow water, weedy lakes, rivers, and canals statewide. Can tolerate low oxygen levels and very warm water that exclude most other species.',
    tips: [
      'Traditional rope lure technique: fray monofilament into a fuzzy ball — gar teeth tangle in it.',
      'Small live baitfish near vegetation edges work well.',
      'Extremely hard, bony mouths make hook setting difficult — very long runs before hook-up advised.',
      'Gar eggs are highly toxic — never eat them.',
    ],
    iNaturalistQuery: 'Lepisosteus platyrhincus',
  },
  {
    id: 'bowfin',
    commonName: 'Bowfin',
    scientificName: 'Amia calva',
    description:
      'Another living fossil, the bowfin is the sole surviving member of an ancient fish lineage. Known as "mudfish" or "grinnel" in Florida. Notoriously strong fighters that will test any tackle. Males aggressively guard nests and fry.',
    averageSize: '2–6 lbs, 18–28 inches',
    floridaRecord: '15 lbs 9 oz — Wekiva River, 1986',
    habitat:
      'Tolerates extremely low-oxygen environments due to a primitive lung that allows direct air breathing. Found in swampy backwaters, weed-choked lakes, slow rivers, and drainage canals statewide.',
    tips: [
      'Live baitfish, large plastic worms, and spinnerbaits all produce strikes.',
      'Wire leader strongly recommended — bowfin have a mouth full of sharp teeth.',
      'Watch for nests in shallow grassy areas in spring — males will strike anything near their fry.',
      'Don\'t underestimate them — a 5 lb bowfin fights harder than most bass twice that size.',
    ],
    iNaturalistQuery: 'Amia calva',
  },
  {
    id: 'peacock-bass',
    commonName: 'Peacock Bass',
    scientificName: 'Cichla ocellaris',
    description:
      'An introduced South American cichlid established in Miami-Dade County canals since the 1960s. Arguably the most visually striking freshwater fish in Florida, with vivid gold and green coloration. A bucket-list species for many Florida anglers.',
    averageSize: '1–4 lbs, 12–20 inches',
    floridaRecord: '9 lbs 8 oz — Miami-Dade canal, 2005',
    habitat:
      'Restricted to warm, frost-free areas of southeast Florida (Miami-Dade, Broward). Cannot survive water below 60°F. Dense in urban canal systems and Everglades Water Conservation Areas.',
    tips: [
      'Highly aggressive visual hunters — bright topwater lures, soft plastic swimbaits, and spinners all work.',
      'Fish the warmest sections of canals near boat ramps and concrete structures.',
      'Mid-morning to early afternoon is peak activity when water temperatures are highest.',
      'Schools actively hunt small baitfish along canal edges — watch for surface disturbances.',
    ],
    iNaturalistQuery: 'Cichla ocellaris',
  },
  {
    id: 'sunshine-bass',
    commonName: 'Sunshine Bass',
    scientificName: 'Morone chrysops × saxatilis',
    description:
      'A hybrid cross between white bass and striped bass produced by hatcheries and stocked in numerous Florida lakes and reservoirs. Grows faster than either parent species and is a hard-fighting open-water predator.',
    averageSize: '1–5 lbs, 14–22 inches',
    floridaRecord: '16 lbs 4 oz — Apalachicola River area, 2012',
    habitat:
      'Open water and creek mouths in reservoirs. Follows threadfin and gizzard shad schools as primary forage. Most abundant in large reservoirs such as Lake Seminole, Talquin, Kissimmee chain, and Lake Tohopekaliga.',
    tips: [
      'Follow diving birds — birds working a shad school usually have sunshine bass below.',
      'White bucktail jigs, lipless crankbaits, and umbrella rigs are standard.',
      'Early morning schooling activity on the surface provides fast action with light tackle.',
      'Fish deep structure (humps, drop-offs) mid-day when fish suspend below the thermocline.',
    ],
    iNaturalistQuery: 'Morone chrysops saxatilis hybrid',
  },
  {
    id: 'warmouth',
    commonName: 'Warmouth',
    scientificName: 'Lepomis gulosus',
    description:
      'A chunky, bass-like sunfish with a large mouth capable of eating surprisingly large prey. Less common than bluegill but a willing biter and an underrated panfish. Brown-olive coloration with streaks radiating from the eye.',
    averageSize: '0.25–0.75 lbs, 6–9 inches',
    floridaRecord: '2 lbs 7 oz — Yellow River, 1985',
    habitat:
      'Heavily vegetated, dark-stained lakes, swamps, and sluggish rivers. Tolerates low oxygen and tannin-stained water. Found throughout the state but most abundant in north and central Florida.',
    tips: [
      'Small soft plastics, spinners, and live crickets all produce well.',
      'Target dense emergent vegetation and woody debris in slow-moving water.',
      'Often overlooked by anglers focused on bass — can be caught in large numbers in the right habitat.',
      'Will take slightly larger baits than bluegill due to their proportionally bigger mouths.',
    ],
    iNaturalistQuery: 'Lepomis gulosus',
  },
]

export function searchSpecies(query: string): Species[] {
  const q = query.toLowerCase().trim()
  if (!q) return SPECIES
  return SPECIES.filter(s =>
    s.commonName.toLowerCase().includes(q) ||
    s.scientificName.toLowerCase().includes(q) ||
    s.habitat.toLowerCase().includes(q)
  )
}
