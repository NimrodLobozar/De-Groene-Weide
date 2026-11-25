import type { Plek } from '../data/camping'

/** Wensen die een gast in stap 2 kan aanvinken. */
export const WENSEN = ['stroom', 'rustig', 'sanitair', 'schaduw', 'speelweide'] as const
export type Wens = (typeof WENSEN)[number]

/**
 * Hoe beter een plek bij de wensen past, hoe hoger de score.
 * De kip is simpel: elke vervulde wens telt, en een vlakke plek is altijd fijn.
 * De afstand tot sanitair en het aantal personen maken het verschil tussen de tips.
 */
export function scorePlek(plek: Plek, wensen: string[], personen = 2): number {
  const gewicht: Record<string, number> = {
    stroom: 14,
    rustig: 14,
    sanitair: 14,
    schaduw: 9,
    speelweide: 9,
  }

  let score = 46

  for (const wens of wensen) {
    if (vervult(plek, wens)) score += gewicht[wens] ?? 8
    else score -= 6
  }

  if (plek.vlak === 'vlak') score += 6
  if (plek.vlak === 'hellend') score -= 5
  score -= Math.min(14, Math.round(plek.afstandSanitair / 18))
  if (plek.maxPersonen < personen) score -= 25
  if (plek.ondergrond === 'gras') score += 2

  return Math.max(35, Math.min(98, score))
}

function vervult(plek: Plek, wens: string): boolean {
  if (wens === 'stroom') return plek.stroom
  if (wens === 'rustig') return plek.rustig
  if (wens === 'sanitair') return plek.afstandSanitair <= 90
  if (wens === 'schaduw') return plek.schaduw
  if (wens === 'speelweide') {
    const nr = Number(plek.id.replace(/\D/g, ''))
    return plek.weide === 'A' && nr >= 8 && nr <= 18
  }
  return false
}

/** Welke wensen deze plek vervult (voor de "waarom deze"-chips). */
export function vervuldeWensen(plek: Plek, wensen: string[]): string[] {
  return wensen.filter((wens) => vervult(plek, wens))
}
