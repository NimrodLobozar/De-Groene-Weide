/**
 * Eigen teksten bovenop de teksten uit de code.
 *
 * De site begint met `src/i18n` (NL/EN/DE). Wat de eigenaar in het beheer
 * aanpast, komt uit de database als `sleutel → { nl, en, de }`. Hier leggen we
 * die twee over elkaar: één keer per taal, zodat elk component gewoon `t.…`
 * blijft gebruiken en er niets aan de pagina's zelf hoeft te veranderen.
 */
import type { Dict, Lang } from '../i18n'

export interface TekstWaarden {
  nl: string
  en: string
  de: string
}

/** Alle overschrijvingen, op sleutelpad (`home.hero.grap`). */
export type TekstOverschrijvingen = Record<string, TekstWaarden>

/** Velden die geen zichtbare tekst zijn en dus nooit overschreven worden. */
const GEEN_TEKST = new Set(['code', 'taalnaam', 'taalKort'])

/**
 * Zet één waarde op een sleutelpad. Onbekende sleutels (van een oudere versie
 * van de site) worden overgeslagen; alleen bestaande tekstvelden veranderen.
 */
function zetPad(doel: unknown, pad: string, waarde: string): void {
  const delen = pad.split('.')
  let huidig = doel as Record<string, unknown>
  for (let i = 0; i < delen.length - 1; i += 1) {
    const volgende = huidig[delen[i]]
    if (!volgende || typeof volgende !== 'object') return
    huidig = volgende as Record<string, unknown>
  }
  const laatste = delen[delen.length - 1]
  if (!(laatste in huidig) || typeof huidig[laatste] !== 'string') return
  huidig[laatste] = waarde
}

/** De tekst in één taal, met Nederlands als terugval als de vertaling mist. */
export function tekstInTaal(waarden: TekstWaarden | undefined, taal: Lang): string {
  if (!waarden) return ''
  return waarden[taal] || waarden.nl || ''
}

/** Eén woordenboek met de eigen teksten erin verwerkt. */
export function metOverschrijvingen(
  basis: Dict,
  overschrijvingen: TekstOverschrijvingen,
  taal: Lang,
): Dict {
  const sleutels = Object.keys(overschrijvingen)
  if (!sleutels.length) return basis

  const kopie = structuredClone(basis) as Dict
  for (const sleutel of sleutels) {
    const waarde = tekstInTaal(overschrijvingen[sleutel], taal)
    if (waarde) zetPad(kopie, sleutel, waarde)
  }
  return kopie
}

/** Dezelfde verwerking voor alle drie de talen in één keer. */
export function metOverschrijvingenAlle(
  basis: Record<Lang, Dict>,
  overschrijvingen: TekstOverschrijvingen,
): Record<Lang, Dict> {
  return {
    nl: metOverschrijvingen(basis.nl, overschrijvingen, 'nl'),
    en: metOverschrijvingen(basis.en, overschrijvingen, 'en'),
    de: metOverschrijvingen(basis.de, overschrijvingen, 'de'),
  }
}

/** Alle tekstsleutels van een woordenboek, in de volgorde van het bestand. */
export function tekstSleutels(woordenboek: Dict): string[] {
  const uit: string[] = []
  const loop = (waarde: unknown, pad: string) => {
    for (const [sleutel, inhoud] of Object.entries(waarde as Record<string, unknown>)) {
      const vol = pad ? `${pad}.${sleutel}` : sleutel
      if (typeof inhoud === 'string') {
        if (!GEEN_TEKST.has(vol)) uit.push(vol)
      } else if (inhoud && typeof inhoud === 'object') {
        loop(inhoud, vol)
      }
    }
  }
  loop(woordenboek, '')
  return uit
}
