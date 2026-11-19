/**
 * Eigen teksten en meldingen.
 *
 * De site leest zijn teksten uit src/i18n. Wat de eigenaar in het beheer
 * aanpast, staat in de tabel `texts`: de Nederlandse bron plus de Engelse en
 * Duitse vertaling die de Worker via Lara heeft gemaakt. `notices` bevat de
 * meldingen bovenaan de site (zoals "het zwembad is dicht").
 */
import { nl } from '../src/i18n/nl'
import { en } from '../src/i18n/en'
import { de } from '../src/i18n/de'
import { vertaal, vertalenMogelijk } from './vertaler'
import { fout, isDatum, tekst, vandaag } from './util'
import type { MeldingRij, TekstRij } from './types'

/** Velden die geen zichtbare tekst zijn. */
const OVERGESLAGEN = new Set(['code', 'taalnaam', 'taalKort'])
const MAX_TEKST = 4000
/** Hoeveel teksten één keer "alles vertalen" mag doen (Lara heeft een tegoed). */
export const MAX_VERTALEN = 20

export const MELDING_SOORTEN = ['mededeling', 'waarschuwing', 'dringend'] as const
export type MeldingSoort = (typeof MELDING_SOORTEN)[number]

/* -------------------------------------------------------------------------- */
/* De teksten uit de code                                                     */
/* -------------------------------------------------------------------------- */

let kaarten: { nl: Map<string, string>; en: Map<string, string>; de: Map<string, string> } | null =
  null

/** Alle tekstsleutels met de tekst zoals hij in de code staat, per taal. */
function tekstKaarten() {
  if (!kaarten) {
    const vlak = (woordenboek: unknown) => {
      const uit = new Map<string, string>()
      const loop = (waarde: unknown, pad: string) => {
        for (const [sleutel, inhoud] of Object.entries(waarde as Record<string, unknown>)) {
          const vol = pad ? `${pad}.${sleutel}` : sleutel
          if (typeof inhoud === 'string') {
            if (!OVERGESLAGEN.has(vol)) uit.set(vol, inhoud)
          } else if (inhoud && typeof inhoud === 'object') {
            loop(inhoud, vol)
          }
        }
      }
      loop(woordenboek, '')
      return uit
    }
    kaarten = { nl: vlak(nl), en: vlak(en), de: vlak(de) }
  }
  return kaarten
}

/** Alle tekstsleutels met de Nederlandse tekst zoals hij in de code staat. */
export function standaardTeksten(): Map<string, string> {
  return tekstKaarten().nl
}

export function isBekendeTekst(sleutel: string): boolean {
  return tekstKaarten().nl.has(sleutel)
}

/* -------------------------------------------------------------------------- */
/* Eigen teksten                                                              */
/* -------------------------------------------------------------------------- */

export interface EigenTekst {
  nl: string
  en: string
  de: string
}

/** Alleen de aangepaste teksten, als sleutel → waarden. */
export async function eigenTeksten(env: Env): Promise<Record<string, EigenTekst>> {
  try {
    const { results } = await env.DB.prepare('SELECT sleutel, nl, en, de FROM texts').all<
      Pick<TekstRij, 'sleutel' | 'nl' | 'en' | 'de'>
    >()

    const uit: Record<string, EigenTekst> = {}
    for (const rij of results ?? []) {
      // Een sleutel die niet meer in de code staat doet niets.
      if (!isBekendeTekst(rij.sleutel)) continue
      uit[rij.sleutel] = { nl: rij.nl, en: rij.en, de: rij.de }
    }
    return uit
  } catch (e) {
    // Nog geen tabel (of even geen database): de site gebruikt dan gewoon de
    // teksten uit de code.
    console.error('teksten lezen mislukte', String(e))
    return {}
  }
}

/** Voor het beheer: alle teksten, met wat er aangepast is. */
export async function beheerTeksten(
  env: Env,
): Promise<
  Array<TekstRij & { standaard: string; standaardEn: string; standaardDe: string }>
> {
  const { results } = await env.DB.prepare('SELECT * FROM texts ORDER BY sleutel').all<TekstRij>()
  const perSleutel = new Map((results ?? []).map((rij) => [rij.sleutel, rij]))
  const { nl: kaartNl, en: kaartEn, de: kaartDe } = tekstKaarten()

  const uit: Array<TekstRij & { standaard: string; standaardEn: string; standaardDe: string }> = []
  for (const [sleutel, waarde] of kaartNl) {
    const rij = perSleutel.get(sleutel)
    uit.push({
      sleutel,
      standaard: waarde,
      standaardEn: kaartEn.get(sleutel) ?? '',
      standaardDe: kaartDe.get(sleutel) ?? '',
      nl: rij?.nl ?? waarde,
      en: rij?.en ?? '',
      de: rij?.de ?? '',
      vertaald: rij?.vertaald ?? '',
      bijgewerkt: rij?.bijgewerkt ?? '',
    })
    perSleutel.delete(sleutel)
  }

  // Rijen van een oudere versie van de site: laten staan, zodat ze op te ruimen zijn.
  for (const rij of perSleutel.values()) {
    uit.push({ ...rij, standaard: '', standaardEn: '', standaardDe: '' })
  }
  return uit
}

async function bewaarTekst(
  env: Env,
  sleutel: string,
  waarde: string,
  vertaling: Pick<EigenTekst, 'en' | 'de'>,
): Promise<TekstRij> {
  const nu = new Date().toISOString()
  await env.DB.prepare(
    `INSERT INTO texts (sleutel, nl, en, de, vertaald, bijgewerkt) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (sleutel) DO UPDATE SET nl = excluded.nl, en = excluded.en, de = excluded.de,
       vertaald = excluded.vertaald, bijgewerkt = excluded.bijgewerkt`,
  )
    .bind(sleutel, waarde, vertaling.en, vertaling.de, vertaling.en ? nu : '', nu)
    .run()

  return {
    sleutel,
    nl: waarde,
    en: vertaling.en,
    de: vertaling.de,
    vertaald: vertaling.en ? nu : '',
    bijgewerkt: nu,
  }
}

/**
 * Sla een tekst op. De Nederlandse tekst is de bron; Engels en Duits komen van
 * Lara. Lukt vertalen niet, dan wordt alleen het Nederlands bewaard.
 */
export async function zetTekst(env: Env, sleutel: string, nlWaarde: unknown): Promise<TekstRij> {
  if (!isBekendeTekst(sleutel)) throw fout(404, 'Deze tekst bestaat niet (meer) op de site.')
  const waarde = tekst(nlWaarde, MAX_TEKST)
  if (!waarde) {
    await wisTekst(env, sleutel)
    return { sleutel, nl: '', en: '', de: '', vertaald: '', bijgewerkt: '' }
  }

  const vertaling = (await vertaal(env, [waarde]))?.[0] ?? { en: '', de: '' }
  return bewaarTekst(env, sleutel, waarde, vertaling)
}

/** Terug naar de tekst uit de code. */
export async function wisTekst(env: Env, sleutel: string): Promise<void> {
  await env.DB.prepare('DELETE FROM texts WHERE sleutel = ?').bind(sleutel).run()
}

/**
 * Vertaal de teksten waar nog geen vertaling bij staat. Beperkt tot een klein
 * aantal per keer, zodat het tegoed van Lara niet in één klik op is.
 */
export async function vertaalOntbrekend(
  env: Env,
): Promise<{ vertaald: number; mislukt: number; openstaand: number; beschikbaar: boolean }> {
  if (!vertalenMogelijk(env)) {
    throw fout(503, 'Er zijn nog geen Lara-sleutels ingesteld, dus vertalen kan nog niet.')
  }

  const { results } = await env.DB.prepare(
    `SELECT sleutel, nl, en, de FROM texts WHERE nl <> '' AND (en = '' OR de = '') ORDER BY sleutel LIMIT ?`,
  )
    .bind(MAX_VERTALEN)
    .all<Pick<TekstRij, 'sleutel' | 'nl' | 'en' | 'de'>>()

  const rijen = results ?? []
  if (!rijen.length) return { vertaald: 0, mislukt: 0, openstaand: 0, beschikbaar: true }

  const vertalingen = await vertaal(env, rijen.map((rij) => rij.nl))
  if (!vertalingen) throw fout(502, 'De vertaaldienst is nu niet bereikbaar. Probeer het later opnieuw.')

  let vertaald = 0
  for (let i = 0; i < rijen.length; i += 1) {
    const rij = rijen[i]
    const vertaling = vertalingen[i]
    if (!vertaling.en || !vertaling.de) continue
    await bewaarTekst(env, rij.sleutel, rij.nl, vertaling)
    vertaald += 1
  }

  const open = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM texts WHERE nl <> '' AND (en = '' OR de = '')`,
  ).first<{ n: number }>()

  return { vertaald, mislukt: rijen.length - vertaald, openstaand: open?.n ?? 0, beschikbaar: true }
}

/* -------------------------------------------------------------------------- */
/* Meldingen bovenaan de site                                                 */
/* -------------------------------------------------------------------------- */

export async function lijstMeldingen(env: Env): Promise<MeldingRij[]> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM notices ORDER BY volgorde, id',
    ).all<MeldingRij>()
    return results ?? []
  } catch (e) {
    console.error('meldingen lezen mislukte', String(e))
    return []
  }
}

/** Loopt de melding vandaag? Lege datums betekenen "altijd". */
function meldingLoopt(melding: MeldingRij, dag: string): boolean {
  if (!melding.actief) return false
  if (melding.van && melding.van > dag) return false
  if (melding.tot && melding.tot < dag) return false
  return true
}

/** Wat de site bovenaan toont: alleen de meldingen die nu lopen. */
export async function actieveMeldingen(env: Env): Promise<Array<Omit<MeldingRij, 'actief' | 'volgorde' | 'aangemaakt' | 'bijgewerkt'>>> {
  const dag = vandaag()
  return (await lijstMeldingen(env))
    .filter((melding) => meldingLoopt(melding, dag))
    .map((melding) => ({
      id: melding.id,
      soort: melding.soort,
      nl: melding.nl,
      en: melding.en,
      de: melding.de,
      van: melding.van,
      tot: melding.tot,
    }))
}

export interface MeldingInvoer {
  nl?: string
  soort?: string
  actief?: boolean
  van?: string
  tot?: string
  volgorde?: number
  /** Zet dit op true om de vertaling opnieuw te laten maken. */
  vertaal?: boolean
}

function controleerMelding(invoer: MeldingInvoer, huidig?: MeldingRij) {
  const nlTekst = invoer.nl !== undefined ? tekst(invoer.nl, 300) : (huidig?.nl ?? '')
  if (!nlTekst) throw fout(400, 'Vul een tekst voor de melding in.')

  const soort = invoer.soort !== undefined ? invoer.soort : (huidig?.soort ?? 'mededeling')
  if (!(MELDING_SOORTEN as readonly string[]).includes(soort)) {
    throw fout(400, 'Onbekend soort melding.')
  }

  const van = invoer.van !== undefined ? tekst(invoer.van, 10) : (huidig?.van ?? '')
  const tot = invoer.tot !== undefined ? tekst(invoer.tot, 10) : (huidig?.tot ?? '')
  if (van && !isDatum(van)) throw fout(400, 'Gebruik een datum als 2026-07-01 bij "vanaf".')
  if (tot && !isDatum(tot)) throw fout(400, 'Gebruik een datum als 2026-07-01 bij "tot en met".')
  if (van && tot && tot < van) throw fout(400, '"Tot en met" moet na "vanaf" liggen.')

  return {
    nl: nlTekst,
    soort,
    van,
    tot,
    actief: invoer.actief !== undefined ? (invoer.actief ? 1 : 0) : (huidig?.actief ?? 1),
    volgorde:
      invoer.volgorde !== undefined
        ? Math.max(0, Math.round(Number(invoer.volgorde) || 0))
        : (huidig?.volgorde ?? 0),
  }
}

async function meldingRij(env: Env, id: number): Promise<MeldingRij> {
  const rij = await env.DB.prepare('SELECT * FROM notices WHERE id = ?').bind(id).first<MeldingRij>()
  if (!rij) throw fout(404, 'Melding niet gevonden.')
  return rij
}

export async function maakMelding(env: Env, invoer: MeldingInvoer): Promise<MeldingRij> {
  const melding = controleerMelding(invoer)
  const nu = new Date().toISOString()
  const vertaling = (await vertaal(env, [melding.nl]))?.[0] ?? { en: '', de: '' }

  const uitkomst = await env.DB.prepare(
    `INSERT INTO notices (nl, en, de, soort, actief, van, tot, volgorde, aangemaakt, bijgewerkt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      melding.nl,
      vertaling.en,
      vertaling.de,
      melding.soort,
      melding.actief,
      melding.van,
      melding.tot,
      melding.volgorde,
      nu,
      nu,
    )
    .run()

  return meldingRij(env, Number(uitkomst.meta?.last_row_id ?? 0))
}

export async function wijzigMelding(
  env: Env,
  id: number,
  invoer: MeldingInvoer,
): Promise<MeldingRij> {
  const huidig = await meldingRij(env, id)
  const melding = controleerMelding(invoer, huidig)

  // Alleen opnieuw vertalen als de Nederlandse tekst echt veranderd is.
  const vertaling =
    melding.nl === huidig.nl && !invoer.vertaal
      ? { en: huidig.en, de: huidig.de }
      : ((await vertaal(env, [melding.nl]))?.[0] ?? { en: '', de: '' })

  await env.DB.prepare(
    `UPDATE notices SET nl = ?, en = ?, de = ?, soort = ?, actief = ?, van = ?, tot = ?,
       volgorde = ?, bijgewerkt = ? WHERE id = ?`,
  )
    .bind(
      melding.nl,
      vertaling.en,
      vertaling.de,
      melding.soort,
      melding.actief,
      melding.van,
      melding.tot,
      melding.volgorde,
      new Date().toISOString(),
      id,
    )
    .run()

  return meldingRij(env, id)
}

export async function verwijderMelding(env: Env, id: number): Promise<void> {
  await env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run()
}
