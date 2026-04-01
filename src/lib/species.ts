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

// ── Saltwater / Offshore species ──────────────────────────────────────────────
// Includes all standard Species fields plus offshore-specific technical data
// (Tasks 1 + 2 combined per product spec).

export interface SaltwaterSpecies extends Species {
  worldRecord: string
  depthRange: string           // typical fishing depth range
  bestSeasonFL: string         // best months / season in Florida
  preferredTempF: string       // water temperature range
  trollingSpeedKts: string | null  // null for species not typically trolled
  riggingMethods: string[]     // 3–5 common rigs / presentations
  feedingTime: string          // most active time of day
}

export const SALTWATER_SPECIES: SaltwaterSpecies[] = [
  {
    id: 'mahi-mahi',
    commonName: 'Mahi-Mahi (Dolphinfish)',
    scientificName: 'Coryphaena hippurus',
    description:
      'One of the most colorful and acrobatic sport fish in the ocean. Mahi grow incredibly fast — a fish caught at 20 lbs may be less than 2 years old. Named for the Hawaiian word for "strong," they are renowned for spectacular aerial displays when hooked.',
    averageSize: '5–20 lbs; bull mahi over 40 lbs are trophy class',
    floridaRecord: '81 lbs — Key West area (IGFA world record: 87 lbs)',
    worldRecord: '87 lbs — Papagallo Gulf, Costa Rica, 1976',
    habitat: 'Open ocean, pelagic; strongly associated with floating sargassum weed lines, debris, and color changes. Range from near-surface to 280 ft but most fishing occurs in the top 100 ft.',
    depthRange: 'Surface to 100 ft (most active in top 40 ft)',
    bestSeasonFL: 'April–September (peak May–July off southeast Florida)',
    preferredTempF: '72–88°F; most active above 75°F',
    trollingSpeedKts: '7–10 knots',
    riggingMethods: [
      'Rigged ballyhoo under a skirted lure (most common offshore Florida setup)',
      'Dead bait pitch — pitch a whole cigar minnow or squid to fish near a weed line',
      'Live bait on a flat-line or kite — goggle-eyes and pilchards work well',
      'Casting to schoolies — 1–3 oz bucktail jig or soft plastic swimbait',
      'Pitch casting: when fish are lit up at the surface, cast directly into the school with a popper or jig',
    ],
    feedingTime: 'Most active during daylight hours — peak feeding around sunrise and early morning. Active throughout the day near weed lines.',
    tips: [
      'Keep one fish in the water while fighting — mahi are schooling fish and will hold nearby if something stays in.',
      'Slow down and circle back immediately when you get a strike — the whole school is behind that fish.',
      'Kite fishing for mahi produces spectacular surface strikes; effective when fish are finicky on trolled baits.',
      'Match lure color to the baitfish in the area — greens and yellows near sargassum, pink/white in open blue water.',
    ],
    iNaturalistQuery: 'Coryphaena hippurus',
  },
  {
    id: 'wahoo',
    commonName: 'Wahoo',
    scientificName: 'Acanthocybium solandri',
    description:
      'The fastest fish routinely targeted by Florida offshore anglers, with bursts exceeding 60 mph. Wahoo have a narrow, torpedo-shaped body and iridescent blue-green tiger stripes that fade quickly after death. A single wahoo can provide outstanding table fare — the firm, white flesh is considered among the best eating fish in the ocean.',
    averageSize: '20–50 lbs; fish over 80 lbs are common off south Florida in winter',
    floridaRecord: '139 lbs 8 oz — Key West area (2005)',
    worldRecord: '184 lbs — Cabo San Lucas, Mexico, 2005',
    habitat: 'Open ocean, highly migratory pelagic species. Favors sharp temperature breaks, deep blue-water edges, and the vicinity of underwater structures that push baitfish to the surface.',
    depthRange: 'Surface to 600 ft; most actively caught in the top 300 ft',
    bestSeasonFL: 'November–March (peak December–February when cold fronts push fish south)',
    preferredTempF: '70–86°F; optimal around 74–82°F',
    trollingSpeedKts: '12–18 knots (high-speed trolling is the signature technique)',
    riggingMethods: [
      'High-speed skirt lure trolled at 14–18 knots — "Smoker"-style lures designed for wahoo',
      'Rigged ballyhoo with a weighted chin rig or sea witch combo trolled at 8–12 knots',
      'Wire-lipped diving plug trolled at 6–9 knots along color changes',
      'Slow-trolled live bait (blue runner, bonito strip) at 3–5 knots on a deep-diving planer',
      'Jigging: vertical butterfly jigging near sharp temperature breaks at 200–400 ft',
    ],
    feedingTime: 'Dawn and dusk are peak feeding windows; active throughout the day in cooler water conditions.',
    tips: [
      'Use single-strand wire or heavy titanium trace — wahoo will cut through anything else with their razor teeth.',
      'Start trolling before sunrise — the first 30 minutes of daylight are often the most productive for wahoo.',
      'Target the 100-fathom curve (600 ft) off Florida\'s southeast coast; this edge is the wahoo highway.',
      'High-speed lures need to track straight — test each lure boatside before setting out.',
    ],
    iNaturalistQuery: 'Acanthocybium solandri',
  },
  {
    id: 'king-mackerel',
    commonName: 'King Mackerel',
    scientificName: 'Scomberomorus cavalla',
    description:
      'The premier nearshore-to-offshore gamefish on both coasts of Florida. "Smoker kings" over 30 lbs are a celebrated target. Fast, powerful, and highly migratory, kingfish make long screaming runs on light tackle that test both angler and equipment. Sometimes called "kingfish" locally.',
    averageSize: '5–20 lbs; smoker kings 30–80+ lbs',
    floridaRecord: '90 lbs — Key West, 1976',
    worldRecord: '93 lbs — San Juan, Puerto Rico, 1999',
    habitat: 'Nearshore to offshore; commonly found around baitfish concentrations, reef edges, wrecks, buoy lines, and along the Gulf Stream edge. Moves inshore in winter off southeast Florida.',
    depthRange: '20–300 ft (most productive 40–150 ft)',
    bestSeasonFL: 'October–April on Atlantic; May–September on Gulf coast (migratory)',
    preferredTempF: '68–85°F; optimal 72–80°F',
    trollingSpeedKts: '5–8 knots',
    riggingMethods: [
      'Slow-trolled live bait (blue runner, goggle-eye, pilchard) on a two-hook stinger rig',
      'Spoon trolling — large hammered spoons on a planer board at 4–6 knots',
      'Rigged ballyhoo on a feathered jig at medium speed',
      'Drifting live blue runners or pogies under a float near buoy lines',
      'Jigging: large casting jigs near bait schools from a drifting boat',
    ],
    feedingTime: 'Most active in early morning and late afternoon; will feed throughout the day when bait schools are present.',
    tips: [
      'Always use a wire or heavy titanium leader — kingfish will bite through any mono or fluorocarbon.',
      'The "tower technique" on live bait rigs: run a large live bait near the surface on a float for surface strikes from big kings.',
      'When schoolies are present, throw the big bait back — the largest kings usually hang below the school.',
      'Watch for birds working bait schools — kingfish activity below often pushes bait to the surface.',
    ],
    iNaturalistQuery: 'Scomberomorus cavalla',
  },
  {
    id: 'sailfish',
    commonName: 'Sailfish',
    scientificName: 'Istiophorus platypterus',
    description:
      'The quintessential Florida offshore trophy. Southeast Florida from Stuart to Miami is widely regarded as the sailfish capital of the world, with fleets of light-tackle charter boats deploying kite fishing rigs that produce hundreds of releases per day in peak season. A sail raised full at the surface, then crashing a bait, is one of the most dramatic moments in all of offshore fishing.',
    averageSize: '40–80 lbs; Atlantic sailfish commonly reach 100+ lbs',
    floridaRecord: '116 lbs — Palm Beach (1956) (IGFA Atlantic world record: 141 lbs 1 oz)',
    worldRecord: '141 lbs 1 oz — Luanda, Angola, 1994',
    habitat: 'Pelagic; prefers warm, clear blue water near the Gulf Stream. Concentrates where baitfish school near temperature breaks and current edges. Comes within a few miles of shore off southeast Florida in winter.',
    depthRange: 'Surface to 200 ft; kite fishing targets the top 3 ft of water',
    bestSeasonFL: 'November–March on Southeast Florida (peak December–February); Gulf coast in spring',
    preferredTempF: '72–82°F',
    trollingSpeedKts: '5–8 knots (slow trolling) or kite fishing (drifting)',
    riggingMethods: [
      'Kite fishing — live baits (goggle-eyes, pilchards) suspended at the surface on a kite spread',
      'Slow-trolled rigged ballyhoo in a spread; pitch baits when a "lit up" fish is raised',
      'Pitch bait casting — when a sail is behind a teaser, pitch a live bait or rigged ballyhoo to it',
      'Dead bait slow-troll spread — combination of rigged ballyhoo at various depths with teasers',
      'Jigging and casting: busting fish on the surface can be taken on large poppers or pitch jigs',
    ],
    feedingTime: 'Dawn through mid-morning is the classic prime window; active throughout the day when conditions are right.',
    tips: [
      'Light-tackle sportfishing norm — 20-lb class rods make the fight spectacular; sailfish are often released.',
      'Kite fishing is definitively the most productive technique in southeast Florida; the bait on the surface drives them crazy.',
      'When a sail crashes a bait, drop back immediately and let the fish run 3–5 seconds before setting the hook hard.',
      'Multiple sails behind the boat at once (a "grand slam" with multiple species) is achievable in peak season.',
    ],
    iNaturalistQuery: 'Istiophorus platypterus',
  },
  {
    id: 'blue-marlin',
    commonName: 'Blue Marlin',
    scientificName: 'Makaira nigricans',
    description:
      'The ultimate offshore trophy and the largest billfish in the Atlantic. Blue marlin are powerful, nearly indestructible fighters that make searing long-distance runs and head-shaking aerial leaps. All Atlantic blue marlin must be released under current NOAA regulations. The mere sight of a blue marlin bill cutting the wake behind a teaser is enough to make experienced offshore anglers shake.',
    averageSize: '150–400 lbs; giant females (cows) regularly exceed 800 lbs',
    floridaRecord: 'Catch-and-release only (no harvest record maintained)',
    worldRecord: '1,402 lbs 2 oz — Vitória, Brazil, 1992',
    habitat: 'Deep oceanic water beyond the continental shelf; prefers water over 400 ft deep near the Gulf Stream. Follows temperature breaks and bait concentrations far offshore.',
    depthRange: 'Surface to 600 ft; trolling targets top 50 ft',
    bestSeasonFL: 'June–October in the Gulf of Mexico; year-round possibility off Atlantic coast',
    preferredTempF: '75–85°F',
    trollingSpeedKts: '7–9 knots',
    riggingMethods: [
      'Large offshore lure spread — daisy chains, large skirted lures (9–14 inches) in the pattern',
      'Rigged whole bait (bonito, mullet, mackerel) on a 12/0–14/0 circle hook',
      'Live bait deployed deep on a flat line — large live bonito or mackerel',
      'Pitch bait when a blue raises on a teaser — switch immediately to a pitch bait for the bite',
      'Ballyhoo/lure combo: large rigged ballyhoo under a big skirted lure',
    ],
    feedingTime: 'Most active mid-morning through early afternoon in warmer months.',
    tips: [
      'Blue marlin are catch-and-release only in federal Atlantic waters — always plan to release.',
      'Circle hooks dramatically improve post-release survival — use them on all natural bait presentations.',
      'The hookset on a blue marlin is not a strike — reel down tight and let the fish load before lifting.',
      'International Game Fish Association (IGFA) 80 lb class is the standard for targeting giants; 130 lb class for true trophy fish.',
    ],
    iNaturalistQuery: 'Makaira nigricans',
  },
  {
    id: 'red-grouper',
    commonName: 'Red Grouper',
    scientificName: 'Epinephelus morio',
    description:
      'The most commercially important reef fish in the Gulf of Mexico and one of the most popular recreational targets. Red grouper are ambush predators that live in dens and holes on hard-bottom structure. The flesh is mild, white, and highly prized for eating — "grouper sandwiches" are a Florida institution.',
    averageSize: '2–10 lbs; fish over 15 lbs are trophy class',
    floridaRecord: '42 lbs 4 oz — Clearwater, 2001',
    worldRecord: '42 lbs 4 oz — same (IGFA world record)',
    habitat: 'Hard-bottom structure, rocky ledges, artificial reefs, and rubble piles in 40–150 feet of water. Creates and maintains "potholes" in sand and mud bottom by fanning with their tails.',
    depthRange: '40–150 ft (most productive 60–100 ft on Gulf)',
    bestSeasonFL: 'May–December (Gulf season); year-round Atlantic with varying regulations',
    preferredTempF: '66–78°F',
    trollingSpeedKts: null,
    riggingMethods: [
      'Knocker rig with a 3–6 oz egg sinker sliding to the hook — the standard Florida grouper rig',
      'Chicken rig (dropper loop) — two-hook bottom rig for targeting multiple grouper',
      'Vertical jigging: heavy butterfly jigs (4–8 oz) worked above structure',
      'Free-lined live bait drifted through the water column near structure',
      'Dead bait on the bottom — whole grunts, squirrel fish, or cut blue runner',
    ],
    feedingTime: 'Actively feeds at dawn and dusk; will bite throughout the day when hungry. Activity increases with tidal movement.',
    tips: [
      'Get the bait to the bottom quickly and work just above the structure — grouper rarely chase far off the bottom.',
      'When you feel the tap-tap of a grouper picking up the bait, wait a beat then reel up hard — don\'t set the hook with slack in the line.',
      'Heavy fluorocarbon leader (80–100 lb) is standard — grouper live in structure that will abrade mono.',
      'Electric reels are common for fishing very deep structure — 200+ ft drops quickly deplete even experienced anglers.',
    ],
    iNaturalistQuery: 'Epinephelus morio',
  },
  {
    id: 'red-snapper',
    commonName: 'Red Snapper',
    scientificName: 'Lutjanus campechanus',
    description:
      'One of the most sought-after and tightly managed reef fish in the Gulf of Mexico. True red snapper have bright red coloring, a distinct pointed snout, and large eyes. The Gulf red snapper population has rebounded significantly since strict federal management was implemented, and today\'s fish are larger on average than they were 30 years ago.',
    averageSize: '2–10 lbs; fish over 20 lbs are common on offshore structure',
    floridaRecord: '46 lbs 8 oz — Gulf of Mexico off Destin, 1996',
    worldRecord: '50 lbs 4 oz — Gulf of Mexico, 1996',
    habitat: 'Natural hard-bottom ledges, artificial reefs, oil platforms, wrecks, and rocky outcroppings in 40–400+ ft of water. Juveniles inhabit shallower structure; large adults found deeper.',
    depthRange: '40–400 ft (most recreational fishing 40–150 ft)',
    bestSeasonFL: 'Gulf season announced annually (typically June–August); Atlantic has extended seasons',
    preferredTempF: '68–78°F',
    trollingSpeedKts: null,
    riggingMethods: [
      'Knocker rig — 3–8 oz egg sinker directly on the hook (fast to reach bottom, minimal hang-ups)',
      'Carolina rig — 12–18 inch leader between weight and hook for a more natural presentation',
      'Sabiki rig for catching fresh bait (cigar minnows, grunts) to use as live bait for big snapper',
      'Vertical jigging: blade jigs and butterfly jigs worked through the water column',
      'Dropper loop rig with two hooks — standard when targeting multiple fish per drop',
    ],
    feedingTime: 'Most active at dawn and dusk, and during tidal changes. Larger fish often hold mid-water column at night and drop to bottom at daylight.',
    tips: [
      'Fish bait size up for big snapper — a whole cigar minnow or grunt will screen out the smaller fish.',
      'Chum slick (frozen chum block or fresh chum from a bag) dragged near the bottom concentrates fish dramatically.',
      'Snapper will stack in the water column above structure — look for fish on the fishfinder before dropping bait.',
      'Strong currents pull bait away from structure quickly; use heavier weights than you think you need.',
    ],
    iNaturalistQuery: 'Lutjanus campechanus',
  },
  {
    id: 'cobia',
    commonName: 'Cobia',
    scientificName: 'Rachycentron canadum',
    description:
      'A hard-fighting, fast-growing migratory species that is one of Florida\'s most exciting sight-fishing targets. Cobia frequently swim near the surface, often associating with rays, sharks, buoys, and structure — making them visible to anglers with a good vantage point. They are notoriously aggressive and will attack almost any bait put in front of them.',
    averageSize: '10–40 lbs; fish over 60 lbs are caught regularly',
    floridaRecord: '130 lbs 1 oz — Destin, 1997',
    worldRecord: '135 lbs 9 oz — Shark Bay, Australia, 1985',
    habitat: 'Migratory; follows the coasts of Florida seasonally. Found near the surface around buoys, crab trap floats, offshore structure, wrecks, and swimming near cownose and southern stingrays.',
    depthRange: 'Surface to 60 ft (mostly shallow, near-surface fishing)',
    bestSeasonFL: 'January–April (Atlantic, migrating north); April–June (Gulf coast migration)',
    preferredTempF: '68–80°F',
    trollingSpeedKts: '4–6 knots (slow-trolled live eel or whole bait)',
    riggingMethods: [
      'Free-lined live eel — the single most effective cobia bait in Florida',
      'Live pinfish or blue crab presented under a float near buoy lines',
      'Pitch casting: 1–2 oz jig head with a large soft plastic swimbait sight-cast to cruising fish',
      'Slow-trolled live blue runner or small Spanish mackerel on a 9/0 circle hook',
      'Bucktail jig worked near the surface when fish are visible; 3–5 oz in current',
    ],
    feedingTime: 'Active throughout the day; sight fishing along cobia migration routes most productive mid-morning through afternoon when sun is high and visibility is good.',
    tips: [
      'Post on a bow lookout — or use a tower — to spot fish swimming near the surface before they see the boat.',
      'When you spot a cobia, cut the engine and cast past the fish, then work the lure or bait in front of it.',
      'Cobia are not easily spooked but will turn off a bait that looks unnatural — match the bait to their speed.',
      'If one cobia strikes and misses, keep the bait in the water — multiple fish often travel together and the second fish usually bites.',
    ],
    iNaturalistQuery: 'Rachycentron canadum',
  },
  {
    id: 'greater-amberjack',
    commonName: 'Greater Amberjack',
    scientificName: 'Seriola dumerili',
    description:
      'Called "reef donkeys" by Florida anglers for good reason — when a large amberjack decides to dive for the bottom, very little stops it. AJs are the most powerful fish on Florida offshore structure and routinely destroy tackle and straighten hooks from fish caught on light gear. The fight is all strength; there are no acrobatics, just raw power heading straight down.',
    averageSize: '10–40 lbs; fish over 80 lbs are caught on deep structure',
    floridaRecord: '142 lbs 1 oz — Challenger Bank area, 1990',
    worldRecord: '155 lbs 10 oz — Canary Islands, Spain, 1977',
    habitat: 'Offshore hard-bottom structure, wrecks, oil rigs, buoys, and reef edges in 60–200+ ft of water. Juveniles often associated with sargassum weed and floating debris.',
    depthRange: '60–200 ft (most fishing 80–150 ft)',
    bestSeasonFL: 'April–January (Gulf recreational season excludes February–March)',
    preferredTempF: '68–82°F',
    trollingSpeedKts: '5–7 knots (slow-trolled live bait)',
    riggingMethods: [
      'Live bait near the surface — large live blue runner or goggle-eye is the top AJ bait',
      'Vertical jigging: heavy jigs (6–12 oz) worked aggressively through the water column',
      'Popping and casting near the surface when fish are schooling or chasing bait',
      'Slow-trolling live bait along the bottom third of the water column on structure',
      'Dead bait on a knocker rig at depth for less active fish in current',
    ],
    feedingTime: 'Most aggressive at dawn and at tidal changes; active throughout the day around structure.',
    tips: [
      'Set your drag tight before you drop — an amberjack that gets back into structure is nearly impossible to stop.',
      'Heavy spinning tackle (60–80 lb braid) or conventional reels with a wide-range drag are standard.',
      'Fast jigging triggers aggressive reaction strikes — work jigs at full speed without pauses for best results.',
      'AJs school around structure; once you catch one, hold position and drop back immediately.',
    ],
    iNaturalistQuery: 'Seriola dumerili',
  },
  {
    id: 'tarpon',
    commonName: 'Tarpon',
    scientificName: 'Megalops atlanticus',
    description:
      'The "Silver King" — one of the most respected sport fish in the world and Florida\'s most iconic big-game species. Tarpon are prehistoric fish that have existed largely unchanged for 100 million years. They can breathe air, survive in brackish water, and grow to over 200 lbs. Their spectacular leaps, chrome-silver flanks, and raw power when hooked create unforgettable experiences.',
    averageSize: '20–100 lbs; giant fish over 150 lbs are common in Florida',
    floridaRecord: '243 lbs — Key West area (pending IGFA review)',
    worldRecord: '286 lbs 9 oz — Lake Maracaibo, Venezuela, 1956',
    habitat: 'Inshore and nearshore; found in bays, estuaries, passes, and along the coast. Migrates seasonally along both coasts. Boca Grande Pass is the most famous tarpon destination on earth.',
    depthRange: 'Surface to 30 ft; most sight fishing in 4–15 ft of water',
    bestSeasonFL: 'April–July (peak May–June in Charlotte Harbor, Tampa Bay, and Boca Grande)',
    preferredTempF: '74–88°F; most active when water exceeds 75°F',
    trollingSpeedKts: null,
    riggingMethods: [
      'Live crab (blue crab or pass crabs) — the premier bait for Boca Grande and Charlotte Harbor fish',
      'Live pinfish or mullet under a float in passes and cuts on incoming tide',
      'Large live threadfin herring or scaled sardine (pilchard) free-lined in open water',
      'Jig fishing: slow-rolled swimbaits and large swimshads in 3–5 oz sizes',
      'Fly fishing: large streamer patterns (EP Tarpon Toad, Black Death) on 12–14 wt fly rods',
    ],
    feedingTime: 'Feeds heavily at night and around tidal changes in passes; morning and evening are prime during daytime fishing. Spring migration fish often feed all day.',
    tips: [
      'The "tarpon bow" — bowing the rod toward the fish when it jumps — is critical to preventing a thrown hook.',
      'Circle hooks greatly improve release survival; offset hooks are banned in some tarpon tournaments.',
      'Present the bait in the current so it drifts naturally toward a rolling or daisy-chained fish.',
      'Use proper revival technique after the fight — hold the fish upright in the water facing the current until it swims away strongly.',
    ],
    iNaturalistQuery: 'Megalops atlanticus',
  },
]

export function searchSaltwaterSpecies(query: string): SaltwaterSpecies[] {
  const q = query.toLowerCase().trim()
  if (!q) return SALTWATER_SPECIES
  return SALTWATER_SPECIES.filter(s =>
    s.commonName.toLowerCase().includes(q) ||
    s.scientificName.toLowerCase().includes(q) ||
    s.habitat.toLowerCase().includes(q)
  )
}
