export interface KnotData {
  name: string
  tagline: string
  steps: string[]
  tips: string[]
}

export const KNOTS: Record<string, KnotData> = {
  'palomar-knot': {
    name: 'Palomar Knot',
    tagline: 'One of the strongest terminal knots available — retains nearly 100% of line strength. Excellent for braided line, fluorocarbon, and monofilament up to 50 lb. The doubled line through the eye gives it an edge over single-thread knots in heavy cover.',
    steps: [
      'Double 6–8 inches of line to form a loop, then pass the loop through the hook eye.',
      'Tie a loose overhand knot with the doubled line. The hook should hang freely below the knot — don\'t tighten yet.',
      'Open the loop at the bottom and pass it completely over the hook (hook passes through the loop).',
      'With the loop now sitting above the hook eye, moisten the knot.',
      'Pull both the tag end and standing line together firmly to draw the knot tight against the eye.',
      'Trim the tag end to about ¼ inch.',
    ],
    tips: [
      'Always moisten before tightening — dry knots generate heat and weaken line.',
      'Make sure the loop passes fully over the entire hook, not just the point. This is the most common mistake.',
      'Works best with hooks and lures that have a large enough eye for the doubled line to pass through easily.',
      'For braid, add an extra half-hitch before the final tighten for added security.',
    ],
  },

  'improved-clinch-knot': {
    name: 'Improved Clinch Knot',
    tagline: 'The most widely used terminal knot in fishing — simple, reliable, and fast to tie. Best suited for monofilament and fluorocarbon up to 20 lb. The extra tuck (the "improved" part) locks the wraps and significantly increases strength over the basic clinch.',
    steps: [
      'Thread 6 inches of line through the hook eye.',
      'Wrap the tag end around the standing line 5 times for lighter line (up to 10 lb), or 4 times for heavier line (12–20 lb).',
      'Pass the tag end back through the small loop that formed just above the hook eye.',
      'Pass the tag end through the large loop you just created between your wraps and the eye — this is the "improved" tuck.',
      'Moisten the knot thoroughly.',
      'Pull the standing line and tag end simultaneously to slide the coils tight against the hook eye.',
      'Trim the tag end close.',
    ],
    tips: [
      'Fewer wraps on heavier line — too many coils on thick line creates a bulky knot that won\'t seat properly.',
      'The final tuck (step 4) is what separates this from a basic clinch — don\'t skip it.',
      'If the coils spiral or bunch, start over — an uneven knot loses up to 40% of its rated strength.',
      'Not ideal for braided line — use a Palomar or Uni knot for braid instead.',
    ],
  },

  'uni-knot': {
    name: 'Uni Knot',
    tagline: 'A highly versatile knot that works for hooks, lures, swivels, and even joining two lines (double uni). Strong across all line types including braid. Many experienced anglers use it as their one go-to knot because it ties consistently and is easy to check visually.',
    steps: [
      'Pass 6–8 inches of line through the hook eye, then double it back parallel to the standing line.',
      'Form a loop by folding the tag end back toward the hook eye, laying it over the doubled section.',
      'Wrap the tag end through the loop and around the doubled section 4–6 times, working away from the hook. Use 4 wraps for heavier line, 6 for lighter.',
      'Moisten the coils.',
      'Pull the tag end firmly to draw the wraps together into tight, even coils.',
      'Slide the knot toward the hook eye by pulling the standing line — stop when it seats against the eye.',
      'Trim the tag end close.',
    ],
    tips: [
      'Pull the tag end first (step 5) before sliding the knot — tightening coils and seating against the eye are two separate actions.',
      'Check that your coils are even before the final tighten. Crossed wraps are a sign of a weak knot.',
      'For a loop connection (to give lures free action), stop sliding before the knot reaches the eye.',
      'Works well with braid — use 6 wraps and an extra half-hitch for maximum security.',
    ],
  },

  'florida-loop-knot': {
    name: 'Florida Loop Knot',
    tagline: 'Also called the Non-Slip Mono Loop. Creates a fixed loop at the hook eye so the lure swings freely instead of being pinned — dramatically increases action on jerkbaits, topwater plugs, and soft plastics. Preferred by many inshore guides when natural lure movement is critical.',
    steps: [
      'Tie a loose overhand knot about 10 inches from the tag end. Leave it open — don\'t tighten it.',
      'Pass the tag end through the hook eye.',
      'Run the tag end back through the overhand knot, entering from the same side it originally exited (the hook side).',
      'Wrap the tag end around the standing line 3–4 times for heavy line (20 lb+), 5–6 times for lighter line.',
      'Pass the tag end back through the overhand knot again, entering from the same side it did in step 3.',
      'Moisten the entire knot.',
      'Pull the tag end and standing line slowly to close the knot — pause just before it fully seats to adjust the loop to your desired size (typically ¼ to ½ inch).',
      'Finish tightening firmly. Trim the tag end close.',
    ],
    tips: [
      'The number of wraps determines strength — use fewer wraps on heavier line so the knot seats cleanly.',
      'Set your loop size before the final tighten (step 7). Once fully tight the loop size is fixed.',
      'This knot is worth the extra steps for swimbaits and jerkbaits — the free-swinging action is noticeably better.',
      'Double-check that the tag end enters the overhand knot from the correct side in both steps 3 and 5 — it must go through the same side both times.',
    ],
  },

  'snell-knot': {
    name: 'Snell Knot',
    tagline: 'Ties the line directly to the hook shank instead of the eye, aligning the pull perfectly with the hook point. This geometry increases hook-set efficiency and is the preferred rig for circle hooks, drop-shot, and live bait fishing. Stronger than eye-tied knots under direct pressure.',
    steps: [
      'Pass 6 inches of line through the hook eye from the point side (so the line exits toward the hook point).',
      'Bring the tag end back toward the hook shank and form a loop, holding it flat against the shank with your thumb and forefinger.',
      'Wrap the tag end tightly around both the hook shank and the loop, working toward the hook eye. Make 7–10 tight wraps.',
      'Pass the tag end through the loop at the eye end — pull it through toward the hook point.',
      'Hold the hook firmly and moisten the wraps.',
      'Pull the standing line and tag end simultaneously, drawing the wraps tight and snug against the eye.',
      'Trim the tag end close.',
    ],
    tips: [
      'Keep the wraps tight and evenly spaced as you go — loose wraps create a weak spot.',
      'Make sure the line exits toward the hook point (step 1) so the final pull angle is correct for hook sets.',
      'More wraps (8–10) for lighter line; fewer (6–7) for heavier line over 20 lb.',
      'The snell is particularly effective with octopus and circle hooks — the in-line pull angle is what makes circle hooks work properly.',
    ],
  },
}

// Order matters — more specific knot names are checked before generic ones so edge cases
// like "Uni Loop Knot" resolve to Uni rather than Florida Loop. Do not reorder.
const KEYWORD_MAP: Array<{ keywords: string[]; key: string }> = [
  { keywords: ['palomar'],                          key: 'palomar-knot' },
  { keywords: ['clinch'],                           key: 'improved-clinch-knot' },
  { keywords: ['uni'],                              key: 'uni-knot' },
  { keywords: ['loop', 'florida', 'non-slip', 'nonslip'], key: 'florida-loop-knot' },
  { keywords: ['snell'],                            key: 'snell-knot' },
]

export function findKnot(nameOrSlug: string): KnotData | null {
  const normalized = nameOrSlug.toLowerCase()

  // Exact slug match first (fast path for well-formed slugs)
  if (KNOTS[normalized]) return KNOTS[normalized]

  // Keyword fallback — handles "Palomar Knot", "palomar-knot", variant capitalization, etc.
  for (const { keywords, key } of KEYWORD_MAP) {
    if (keywords.some(kw => normalized.includes(kw))) return KNOTS[key]
  }

  return null
}

// Convert a knot name (possibly with a reason appended) to a URL slug
// e.g. "Palomar Knot — great for heavy cover" → "palomar-knot"
export function knotNameToSlug(bestKnot: string): string {
  const name = bestKnot.split(/\s*[—–-]\s*/)[0].trim()
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
