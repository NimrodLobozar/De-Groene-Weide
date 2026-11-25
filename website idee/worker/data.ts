/** Alle databasewerk rond plekken, beschikbaarheid, prijzen en reserveringen. */
import { PLEKKEN, PRIJZEN, isHoogseizoen } from '../src/data/camping'
import type { PlekApi, PlekRij, ReserveringRij } from './types'
import { dagenTussen, fout } from './util'

let plekkenKlaar: Promise<void> | null = null

/** Zet de 68 standaardplekken één keer in de database. */
export async function zorgVoorPlekken(env: Env): Promise<void> {
  if (!plekkenKlaar) {
    plekkenKlaar = (async () => {
      const rij = await env.DB.prepare('SELECT COUNT(*) AS n FROM pitches').first<{ n: number }>()
      if ((rij?.n ?? 0) > 0) return
      const nu = new Date().toISOString()
      await env.DB.batch(
        PLEKKEN.map((p, index) =>
          env.DB.prepare(
            `INSERT OR IGNORE INTO pitches
              (id, soort, weide, stroom, ondergrond, vlak, water, rustig, schaduw,
               max_personen, afstand_sanitair, prijs, status, hond, volgorde, aangemaakt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            p.id,
            p.soort,
            p.weide,
            p.stroom ? 1 : 0,
            p.ondergrond,
            p.vlak,
            p.water ? 1 : 0,
            p.rustig ? 1 : 0,
            p.schaduw ? 1 : 0,
            p.maxPersonen,
            p.afstandSanitair,
            p.prijs,
            p.status,
            p.hond ? 1 : 0,
            index,
            nu,
          ),
        ),
      )
    })()
  }
  return plekkenKlaar
}

function naarApi(rij: PlekRij): PlekApi {
  return {
    id: rij.id,
    soort: rij.soort,
    weide: rij.weide,
    stroom: rij.stroom === 1,
    ondergrond: rij.ondergrond,
    vlak: rij.vlak,
    water: rij.water === 1,
    rustig: rij.rustig === 1,
    schaduw: rij.schaduw === 1,
    maxPersonen: rij.max_personen,
    afstandSanitair: rij.afstand_sanitair,
    prijs: rij.prijs,
    status: rij.status,
    hond: rij.hond === 1,
  }
}

export async function allePlekken(env: Env): Promise<PlekApi[]> {
  await zorgVoorPlekken(env)
  const { results } = await env.DB.prepare('SELECT * FROM pitches ORDER BY volgorde, id').all<PlekRij>()
  return (results ?? []).map(naarApi)
}

export async function haalPlek(env: Env, id: string): Promise<PlekRij | null> {
  await zorgVoorPlekken(env)
  return env.DB.prepare('SELECT * FROM pitches WHERE id = ?').bind(id).first<PlekRij>()
}

/* -------------------------------------------------------------------------- */
/* Plekken beheren                                                            */
/* -------------------------------------------------------------------------- */

export interface PlekInvoer {
  id: string
  soort: string
  weide: string
  stroom: boolean
  ondergrond: string
  vlak: string
  water: boolean
  rustig: boolean
  schaduw: boolean
  maxPersonen: number
  afstandSanitair: number
  prijs: number
  status: string
  hond: boolean
}

const SOORTEN = ['tent', 'camper', 'safaritent']
const ONDERGRONDEN = ['gras', 'halfverhard', 'verhard', 'hout']
const VLAKHEDEN = ['vlak', 'licht hellend', 'hellend']
const STATUSSEN_PLEK = ['open', 'dicht', 'onderhoud']

export function controleerPlek(invoer: PlekInvoer): PlekInvoer {
  const id = String(invoer.id ?? '').toUpperCase().trim()
  if (!/^[A-Z]{1,2}\d{1,3}$/.test(id)) throw fout(400, 'Gebruik een naam als T49, C13 of S9.')
  if (!SOORTEN.includes(invoer.soort)) throw fout(400, 'Onbekend soort plek.')
  if (!ONDERGRONDEN.includes(invoer.ondergrond)) throw fout(400, 'Onbekende ondergrond.')
  if (!VLAKHEDEN.includes(invoer.vlak)) throw fout(400, 'Onbekende vlakheid.')
  if (!STATUSSEN_PLEK.includes(invoer.status)) throw fout(400, 'Onbekende status.')
  const weide = String(invoer.weide ?? id.charAt(0)).toUpperCase()
  const maxPersonen = Math.round(Number(invoer.maxPersonen))
  const afstand = Math.round(Number(invoer.afstandSanitair))
  const prijs = Math.round(Number(invoer.prijs))
  if (!Number.isFinite(maxPersonen) || maxPersonen < 1 || maxPersonen > 12) {
    throw fout(400, 'Maximaal aantal personen moet tussen 1 en 12 liggen.')
  }
  if (!Number.isFinite(afstand) || afstand < 0 || afstand > 2000) throw fout(400, 'Onbekende afstand.')
  if (!Number.isFinite(prijs) || prijs < 0 || prijs > 1000) throw fout(400, 'Onbekende prijs.')
  return {
    id,
    soort: invoer.soort,
    weide,
    stroom: !!invoer.stroom,
    ondergrond: invoer.ondergrond,
    vlak: invoer.vlak,
    water: !!invoer.water,
    rustig: !!invoer.rustig,
    schaduw: !!invoer.schaduw,
    maxPersonen,
    afstandSanitair: afstand,
    prijs,
    status: invoer.status,
    hond: !!invoer.hond,
  }
}

export async function maakPlek(env: Env, ruw: PlekInvoer): Promise<PlekApi> {
  const p = controleerPlek(ruw)
  const bestaand = await env.DB.prepare('SELECT id FROM pitches WHERE id = ?').bind(p.id).first()
  if (bestaand) throw fout(409, `Plek ${p.id} bestaat al.`)

  const volgorde =
    (
      await env.DB.prepare('SELECT COALESCE(MAX(volgorde), 0) + 1 AS n FROM pitches').first<{
        n: number
      }>()
    )?.n ?? 999

  await env.DB.prepare(
    `INSERT INTO pitches
      (id, soort, weide, stroom, ondergrond, vlak, water, rustig, schaduw,
       max_personen, afstand_sanitair, prijs, status, hond, volgorde, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      p.id,
      p.soort,
      p.weide,
      p.stroom ? 1 : 0,
      p.ondergrond,
      p.vlak,
      p.water ? 1 : 0,
      p.rustig ? 1 : 0,
      p.schaduw ? 1 : 0,
      p.maxPersonen,
      p.afstandSanitair,
      p.prijs,
      p.status,
      p.hond ? 1 : 0,
      volgorde,
      new Date().toISOString(),
    )
    .run()

  const rij = await haalPlek(env, p.id)
  return naarApi(rij!)
}

export async function wijzigPlekRij(
  env: Env,
  id: string,
  wijziging: { status?: string; prijs?: number; maxPersonen?: number },
): Promise<void> {
  const velden: string[] = []
  const waarden: (string | number)[] = []

  if (wijziging.status !== undefined) {
    if (!STATUSSEN_PLEK.includes(wijziging.status)) throw fout(400, 'Onbekende status.')
    velden.push('status = ?')
    waarden.push(wijziging.status)
  }
  if (wijziging.prijs !== undefined) {
    const prijs = Math.round(Number(wijziging.prijs))
    if (!Number.isFinite(prijs) || prijs < 0 || prijs > 1000) throw fout(400, 'Onbekende prijs.')
    velden.push('prijs = ?')
    waarden.push(prijs)
  }
  if (wijziging.maxPersonen !== undefined) {
    const max = Math.round(Number(wijziging.maxPersonen))
    if (!Number.isFinite(max) || max < 1 || max > 12) throw fout(400, 'Onbekend aantal personen.')
    velden.push('max_personen = ?')
    waarden.push(max)
  }
  if (!velden.length) throw fout(400, 'Niets om te wijzigen.')

  await env.DB.prepare(`UPDATE pitches SET ${velden.join(', ')} WHERE id = ?`)
    .bind(...waarden, id)
    .run()
}

export async function verwijderPlek(env: Env, id: string): Promise<void> {
  const gebruikt = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM reservations WHERE pitch = ? AND status <> 'geannuleerd' AND tot >= date('now')",
  )
    .bind(id)
    .first<{ n: number }>()
  if ((gebruikt?.n ?? 0) > 0) {
    throw fout(409, `Plek ${id} heeft nog lopende reserveringen. Zet hem op 'dicht' in plaats van verwijderen.`)
  }
  await env.DB.prepare('DELETE FROM pitches WHERE id = ?').bind(id).run()
}

/* -------------------------------------------------------------------------- */
/* Beschikbaarheid                                                            */
/* -------------------------------------------------------------------------- */

export async function beschikbaarheid(
  env: Env,
  van: string,
  tot: string,
): Promise<Record<string, string[]>> {
  const { results } = await env.DB.prepare(
    `SELECT pitch, van, tot FROM reservations
      WHERE status <> 'geannuleerd' AND van < ? AND tot > ?`,
  )
    .bind(tot, van)
    .all<{ pitch: string; van: string; tot: string }>()

  const bezet: Record<string, string[]> = {}
  for (const r of results ?? []) {
    for (const dag of dagenTussen(r.van, r.tot)) {
      if (dag < van || dag >= tot) continue
      ;(bezet[dag] ??= []).push(r.pitch)
    }
  }
  return bezet
}

export function isVrij(bezet: Record<string, string[]>, pitch: string, van: string, tot: string): boolean {
  for (const dag of dagenTussen(van, tot)) {
    if (bezet[dag]?.includes(pitch)) return false
  }
  return true
}

export function nachtenTussen(van: string, tot: string): number {
  return Math.max(
    0,
    Math.round(
      (new Date(`${tot}T00:00:00Z`).getTime() - new Date(`${van}T00:00:00Z`).getTime()) / 86_400_000,
    ),
  )
}

/** De prijs wordt altijd hier berekend, nooit in de browser. */
export function berekenBedrag(
  plek: { soort: string; prijs: number },
  van: string,
  tot: string,
  personen: number,
): { bedrag: number; nachten: number } {
  const soort = plek.soort as 'tent' | 'camper' | 'safaritent'
  const tabel = PRIJZEN[soort] ?? PRIJZEN.tent
  const nachten = nachtenTussen(van, tot)
  const laag = plek.prijs
  const delta = tabel.hoog - tabel.laag

  let som = 0
  for (const dag of dagenTussen(van, tot)) {
    som += isHoogseizoen(dag) ? laag + delta : laag
  }

  som += personen * PRIJZEN.toeristenbelasting * nachten
  if (plek.soort === 'safaritent') som += PRIJZEN.schoonmaakSafaritent
  if (personen > 2) som += (personen - 2) * PRIJZEN.extraPersoon * nachten

  return { bedrag: Math.round(som), nachten }
}

/* -------------------------------------------------------------------------- */
/* Reserveringen                                                              */
/* -------------------------------------------------------------------------- */

export interface NieuweReservering {
  pitch: string
  van: string
  tot: string
  volwassenen: number
  kinderen: number
  naam: string
  email: string
  telefoon: string
  adres: string
  postcode: string
  plaats: string
  land: string
  opmerking: string
  wensen: string
  taal: string
}

export async function volgendNummer(env: Env): Promise<string> {
  const rij = await env.DB.prepare(
    `SELECT MAX(CAST(substr(nummer, 4) AS INTEGER)) AS hoogste FROM reservations`,
  ).first<{ hoogste: number | null }>()
  const volgende = Math.max(2700, Number(rij?.hoogste ?? 2700)) + 1
  return `GW-${volgende}`
}

export async function maakReservering(
  env: Env,
  invoer: NieuweReservering,
): Promise<ReserveringRij> {
  const plekRij = await haalPlek(env, invoer.pitch)
  if (!plekRij) throw fout(400, 'Deze plek bestaat niet.')
  if (plekRij.status !== 'open') throw fout(409, 'Deze plek is niet boekbaar.')

  const bezet = await beschikbaarheid(env, invoer.van, invoer.tot)
  if (!isVrij(bezet, invoer.pitch, invoer.van, invoer.tot)) {
    throw fout(409, 'Deze plek is net bezet geraakt.')
  }

  const personen = invoer.volwassenen + invoer.kinderen
  if (personen > plekRij.max_personen) {
    throw fout(400, `Deze plek is voor maximaal ${plekRij.max_personen} personen.`)
  }
  if (personen < 1) throw fout(400, 'Er moet minimaal één persoon mee.')

  const { bedrag } = berekenBedrag(plekRij, invoer.van, invoer.tot, personen)
  const nummer = await volgendNummer(env)
  const token = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  await env.DB.prepare(
    `INSERT INTO reservations
      (nummer, pitch, van, tot, volwassenen, kinderen, naam, email, telefoon, adres, postcode,
       plaats, land, opmerking, wensen, bedrag, status, hond, token, taal, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'bevestigd', 0, ?, ?, ?)`,
  )
    .bind(
      nummer,
      invoer.pitch,
      invoer.van,
      invoer.tot,
      invoer.volwassenen,
      invoer.kinderen,
      invoer.naam,
      invoer.email,
      invoer.telefoon,
      invoer.adres,
      invoer.postcode,
      invoer.plaats,
      invoer.land,
      invoer.opmerking,
      invoer.wensen,
      bedrag,
      token,
      invoer.taal,
      new Date().toISOString(),
    )
    .run()

  const rij = await haalReservering(env, nummer)
  if (!rij) throw fout(500, 'Reservering opslaan mislukte.')
  return rij
}

export async function haalReservering(env: Env, nummer: string): Promise<ReserveringRij | null> {
  return env.DB.prepare('SELECT * FROM reservations WHERE nummer = ?')
    .bind(nummer)
    .first<ReserveringRij>()
}

export async function lijstReserveringen(
  env: Env,
  zoek = '',
  status = '',
): Promise<ReserveringRij[]> {
  const voorwaarden: string[] = []
  const waarden: string[] = []

  if (zoek) {
    voorwaarden.push('(lower(naam) LIKE ? OR lower(nummer) LIKE ? OR lower(email) LIKE ?)')
    const q = `%${zoek.toLowerCase()}%`
    waarden.push(q, q, q)
  }
  if (status) {
    voorwaarden.push('status = ?')
    waarden.push(status)
  }

  const where = voorwaarden.length ? `WHERE ${voorwaarden.join(' AND ')}` : ''
  const { results } = await env.DB.prepare(
    `SELECT * FROM reservations ${where} ORDER BY van ASC, nummer ASC LIMIT 500`,
  )
    .bind(...waarden)
    .all<ReserveringRij>()

  return results ?? []
}

export async function verwijderReservering(env: Env, nummer: string): Promise<void> {
  await env.DB.prepare('DELETE FROM reservations WHERE nummer = ?').bind(nummer).run()
}

export async function statistieken(env: Env, dag: string) {
  const aankomst = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM reservations WHERE van = ? AND status <> 'geannuleerd'",
  )
    .bind(dag)
    .first<{ n: number }>()

  const vertrek = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM reservations WHERE tot = ? AND status <> 'geannuleerd'",
  )
    .bind(dag)
    .first<{ n: number }>()

  const bezet = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM reservations WHERE status <> 'geannuleerd' AND van <= ? AND tot > ?",
  )
    .bind(dag, dag)
    .first<{ n: number }>()

  const plekken = await env.DB.prepare('SELECT COUNT(*) AS n FROM pitches').first<{ n: number }>()

  return {
    dag,
    aankomst: aankomst?.n ?? 0,
    vertrek: vertrek?.n ?? 0,
    bezet: bezet?.n ?? 0,
    plekken: plekken?.n ?? 0,
    bezetting: plekken?.n ? Math.round(((bezet?.n ?? 0) / plekken.n) * 100) : 0,
  }
}

export async function instellingen(env: Env): Promise<Record<string, string>> {
  const { results } = await env.DB.prepare('SELECT sleutel, waarde FROM settings').all<{
    sleutel: string
    waarde: string
  }>()
  const uit: Record<string, string> = {}
  for (const r of results ?? []) uit[r.sleutel] = r.waarde
  return uit
}

export async function zetInstelling(env: Env, sleutel: string, waarde: string): Promise<void> {
  await env.DB.prepare(
    'INSERT INTO settings (sleutel, waarde) VALUES (?, ?) ON CONFLICT (sleutel) DO UPDATE SET waarde = excluded.waarde',
  )
    .bind(sleutel, waarde)
    .run()
}
