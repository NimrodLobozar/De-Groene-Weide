/** Evenementen, voorzieningen, foto's en beheerders. */
import { nl } from '../src/i18n/nl'
import { en } from '../src/i18n/en'
import { de } from '../src/i18n/de'
import { VOORZIENINGEN } from '../src/data/camping'
import type { EventRij, FaciliteitRij, MediaRij } from './types'
import { fout, tekst } from './util'
import { hashWachtwoord } from './auth'

let cmsKlaar: Promise<void> | null = null

/** Eenmalig de agenda en de voorzieningen vullen met wat er in het prototype stond. */
export async function zorgVoorCms(env: Env): Promise<void> {
  if (!cmsKlaar) {
    cmsKlaar = (async () => {
      const nu = new Date().toISOString()

      const events = await env.DB.prepare('SELECT COUNT(*) AS n FROM events').first<{ n: number }>()
      if ((events?.n ?? 0) === 0) {
        await env.DB.batch(
          nl.evenementen.list.map((ev, i) =>
            env.DB.prepare(
              `INSERT INTO events (dag, tijd, titel_nl, titel_en, titel_de, locatie, leeftijd, soort, actief, aangemaakt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            ).bind(
              ev.dag,
              ev.tijd,
              ev.titel,
              en.evenementen.list[i]?.titel ?? ev.titel,
              de.evenementen.list[i]?.titel ?? ev.titel,
              ev.locatie,
              ev.leeftijd,
              ev.soort,
              nu,
            ),
          ),
        )
      }

      const facil = await env.DB.prepare('SELECT COUNT(*) AS n FROM facilities').first<{ n: number }>()
      if ((facil?.n ?? 0) === 0) {
        await env.DB.batch(
          VOORZIENINGEN.map((v, index) => {
            const info = nl.plattegrond.voorzieningen[v.id as keyof typeof nl.plattegrond.voorzieningen]
            return env.DB.prepare(
              `INSERT INTO facilities (id, soort, naam, kort, x, y, breed, hoog, open, volgorde, aangemaakt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
            ).bind(
              v.id,
              v.soort,
              info?.naam ?? v.id,
              info?.kort ?? v.id,
              v.x,
              v.y,
              v.breed,
              v.hoog,
              index,
              nu,
            )
          }),
        )
      }
    })()
  }
  return cmsKlaar
}

/* -------------------------------------------------------------------------- */
/* Evenementen                                                                */
/* -------------------------------------------------------------------------- */

const SOORTEN_EVENT = ['dieren', 'spelen', 'water', 'eten']

export async function lijstEvents(env: Env): Promise<EventRij[]> {
  await zorgVoorCms(env)
  const { results } = await env.DB.prepare(
    'SELECT * FROM events ORDER BY dag ASC, tijd ASC, id ASC',
  ).all<EventRij>()
  return results ?? []
}

export interface EventInvoer {
  dag: number
  tijd: string
  titelNl: string
  titelEn?: string
  titelDe?: string
  locatie?: string
  leeftijd?: string
  soort: string
  actief?: boolean
}

function controleerEvent(i: EventInvoer) {
  const dag = Math.round(Number(i.dag))
  if (!Number.isFinite(dag) || dag < 0 || dag > 6) throw fout(400, 'Kies een dag van de week.')
  if (!/^\d{2}:\d{2}$/.test(i.tijd ?? '')) throw fout(400, 'Gebruik een tijd als 09:30.')
  const titelNl = tekst(i.titelNl, 120)
  if (!titelNl) throw fout(400, 'Geef het evenement een titel.')
  if (!SOORTEN_EVENT.includes(i.soort)) throw fout(400, 'Onbekend soort evenement.')
  return {
    dag,
    tijd: i.tijd,
    titelNl,
    titelEn: tekst(i.titelEn, 120) || titelNl,
    titelDe: tekst(i.titelDe, 120) || titelNl,
    locatie: tekst(i.locatie, 80),
    leeftijd: tekst(i.leeftijd, 40),
    soort: i.soort,
    actief: i.actief === false ? 0 : 1,
  }
}

export async function maakEvent(env: Env, invoer: EventInvoer): Promise<EventRij> {
  const e = controleerEvent(invoer)
  const rij = await env.DB.prepare(
    `INSERT INTO events (dag, tijd, titel_nl, titel_en, titel_de, locatie, leeftijd, soort, actief, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      e.dag,
      e.tijd,
      e.titelNl,
      e.titelEn,
      e.titelDe,
      e.locatie,
      e.leeftijd,
      e.soort,
      e.actief,
      new Date().toISOString(),
    )
    .run()

  const id = Number(rij.meta?.last_row_id ?? 0)
  const nieuw = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<EventRij>()
  if (!nieuw) throw fout(500, 'Evenement opslaan mislukte.')
  return nieuw
}

export async function wijzigEvent(
  env: Env,
  id: number,
  invoer: Partial<EventInvoer>,
): Promise<void> {
  const huidig = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<EventRij>()
  if (!huidig) throw fout(404, 'Evenement niet gevonden.')

  const samen: EventInvoer = {
    dag: invoer.dag ?? huidig.dag,
    tijd: invoer.tijd ?? huidig.tijd,
    titelNl: invoer.titelNl ?? huidig.titel_nl,
    titelEn: invoer.titelEn ?? huidig.titel_en,
    titelDe: invoer.titelDe ?? huidig.titel_de,
    locatie: invoer.locatie ?? huidig.locatie,
    leeftijd: invoer.leeftijd ?? huidig.leeftijd,
    soort: invoer.soort ?? huidig.soort,
    actief: invoer.actief ?? huidig.actief === 1,
  }
  const e = controleerEvent(samen)

  await env.DB.prepare(
    `UPDATE events SET dag = ?, tijd = ?, titel_nl = ?, titel_en = ?, titel_de = ?,
       locatie = ?, leeftijd = ?, soort = ?, actief = ? WHERE id = ?`,
  )
    .bind(e.dag, e.tijd, e.titelNl, e.titelEn, e.titelDe, e.locatie, e.leeftijd, e.soort, e.actief, id)
    .run()
}

export async function verwijderEvent(env: Env, id: number): Promise<void> {
  await env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run()
}

/* -------------------------------------------------------------------------- */
/* Voorzieningen                                                              */
/* -------------------------------------------------------------------------- */

const SOORTEN_FACILITEIT = ['dieren', 'water', 'spelen', 'eten', 'sanitair', 'receptie']

export async function lijstFaciliteiten(env: Env): Promise<FaciliteitRij[]> {
  await zorgVoorCms(env)
  const { results } = await env.DB.prepare(
    'SELECT * FROM facilities ORDER BY volgorde, id',
  ).all<FaciliteitRij>()
  return results ?? []
}

export interface FaciliteitInvoer {
  id: string
  soort: string
  naam: string
  kort?: string
  x?: number
  y?: number
  open?: boolean
}

export async function maakFaciliteit(env: Env, invoer: FaciliteitInvoer): Promise<FaciliteitRij> {
  const id = tekst(invoer.id, 40).toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!id) throw fout(400, 'Gebruik een korte naam zonder spaties, bijvoorbeeld speeltuin.')
  if (!SOORTEN_FACILITEIT.includes(invoer.soort)) throw fout(400, 'Onbekend soort voorziening.')
  const naam = tekst(invoer.naam, 80)
  if (!naam) throw fout(400, 'Geef de voorziening een naam.')

  const bestaand = await env.DB.prepare('SELECT id FROM facilities WHERE id = ?').bind(id).first()
  if (bestaand) throw fout(409, 'Deze voorziening bestaat al.')

  const volgorde =
    (await env.DB.prepare('SELECT COALESCE(MAX(volgorde), 0) + 1 AS n FROM facilities').first<{ n: number }>())
      ?.n ?? 99

  await env.DB.prepare(
    `INSERT INTO facilities (id, soort, naam, kort, x, y, breed, hoog, open, volgorde, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)`,
  )
    .bind(
      id,
      invoer.soort,
      naam,
      tekst(invoer.kort, 24) || naam,
      Math.min(6, Math.max(1, Math.round(Number(invoer.x) || 3))),
      Math.min(3, Math.max(1, Math.round(Number(invoer.y) || 2))),
      invoer.open === false ? 0 : 1,
      volgorde,
      new Date().toISOString(),
    )
    .run()

  const rij = await env.DB.prepare('SELECT * FROM facilities WHERE id = ?').bind(id).first<FaciliteitRij>()
  if (!rij) throw fout(500, 'Voorziening opslaan mislukte.')
  return rij
}

export async function wijzigFaciliteit(
  env: Env,
  id: string,
  invoer: { naam?: string; kort?: string; open?: boolean; x?: number; y?: number },
): Promise<void> {
  const velden: string[] = []
  const waarden: (string | number)[] = []
  if (invoer.naam !== undefined) {
    const naam = tekst(invoer.naam, 80)
    if (!naam) throw fout(400, 'Geef de voorziening een naam.')
    velden.push('naam = ?')
    waarden.push(naam)
  }
  if (invoer.kort !== undefined) {
    velden.push('kort = ?')
    waarden.push(tekst(invoer.kort, 24))
  }
  if (invoer.open !== undefined) {
    velden.push('open = ?')
    waarden.push(invoer.open ? 1 : 0)
  }
  if (invoer.x !== undefined) {
    velden.push('x = ?')
    waarden.push(Math.min(6, Math.max(1, Math.round(Number(invoer.x)))))
  }
  if (invoer.y !== undefined) {
    velden.push('y = ?')
    waarden.push(Math.min(3, Math.max(1, Math.round(Number(invoer.y)))))
  }
  if (!velden.length) throw fout(400, 'Niets om te wijzigen.')

  await env.DB.prepare(`UPDATE facilities SET ${velden.join(', ')} WHERE id = ?`)
    .bind(...waarden, id)
    .run()
}

export async function verwijderFaciliteit(env: Env, id: string): Promise<void> {
  await env.DB.prepare('DELETE FROM facilities WHERE id = ?').bind(id).run()
}

/* -------------------------------------------------------------------------- */
/* Foto's (Cloudflare KV)                                                     */
/* -------------------------------------------------------------------------- */

const SLEUTELS = [
  'hero',
  'kippen',
  'speelweide',
  'zwembad',
  'kantine',
  'sanitair',
  'winkel',
  'safaritent',
  // De plekken op de plattegrond
  'woonhuis',
  'kampeerveld',
  'camperveld',
  'parkeerplaats',
  'ingang',
]
const MAX_BYTES = 2 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export function mediasleutels(): string[] {
  return SLEUTELS
}

export async function lijstMedia(env: Env): Promise<MediaRij[]> {
  const { results } = await env.DB.prepare('SELECT * FROM media ORDER BY sleutel').all<MediaRij>()
  return results ?? []
}

export async function bewaarMedia(env: Env, sleutel: string, bestand: File): Promise<MediaRij> {
  if (!SLEUTELS.includes(sleutel)) throw fout(400, 'Onbekende fotoplek.')
  if (!TYPES.includes(bestand.type)) throw fout(400, 'Alleen jpg, png, webp, gif of avif.')
  if (bestand.size > MAX_BYTES) throw fout(413, 'De foto is groter dan 2 MB.')

  const bytes = new Uint8Array(await bestand.arrayBuffer())
  const opslagSleutel = `foto:${sleutel}`

  await env.MEDIA.put(opslagSleutel, bytes, {
    metadata: { type: bestand.type, naam: bestand.name },
  })

  await env.DB.prepare(
    `INSERT INTO media (sleutel, bestandsnaam, type, grootte, opslag_sleutel, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (sleutel) DO UPDATE SET bestandsnaam = excluded.bestandsnaam,
       type = excluded.type, grootte = excluded.grootte, aangemaakt = excluded.aangemaakt`,
  )
    .bind(sleutel, bestand.name.slice(0, 120), bestand.type, bestand.size, opslagSleutel, new Date().toISOString())
    .run()

  const rij = await env.DB.prepare('SELECT * FROM media WHERE sleutel = ?')
    .bind(sleutel)
    .first<MediaRij>()
  if (!rij) throw fout(500, 'Foto opslaan mislukte.')
  return rij
}

export async function haalMedia(
  env: Env,
  sleutel: string,
): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  const object = await env.MEDIA.get(`foto:${sleutel}`, 'arrayBuffer')
  if (!object) return null
  const rij = await env.DB.prepare('SELECT type FROM media WHERE sleutel = ?')
    .bind(sleutel)
    .first<{ type: string }>()
  return { bytes: object, type: rij?.type ?? 'image/jpeg' }
}

export async function verwijderMedia(env: Env, sleutel: string): Promise<void> {
  await env.MEDIA.delete(`foto:${sleutel}`)
  await env.DB.prepare('DELETE FROM media WHERE sleutel = ?').bind(sleutel).run()
}

/* -------------------------------------------------------------------------- */
/* Beheerders                                                                 */
/* -------------------------------------------------------------------------- */

export interface BeheerderRij {
  email: string
  naam: string
  rol: string
  aangemaakt: string
}

const ROLLEN = ['eigenaar', 'receptie', 'terrein', 'schoonmaak']

export async function lijstBeheerders(env: Env): Promise<BeheerderRij[]> {
  const { results } = await env.DB.prepare(
    'SELECT email, naam, rol, aangemaakt FROM admins ORDER BY aangemaakt',
  ).all<BeheerderRij>()
  return results ?? []
}

export async function maakBeheerder(
  env: Env,
  invoer: { email: string; naam: string; rol: string; wachtwoord: string },
): Promise<BeheerderRij> {
  const email = tekst(invoer.email, 160).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw fout(400, 'Vul een geldig e-mailadres in.')
  const naam = tekst(invoer.naam, 80)
  if (!naam) throw fout(400, 'Vul een naam in.')
  if (!ROLLEN.includes(invoer.rol)) throw fout(400, 'Onbekende rol.')
  if (typeof invoer.wachtwoord !== 'string' || invoer.wachtwoord.length < 5) {
    throw fout(400, 'Kies een wachtwoord van minstens 5 tekens.')
  }

  const bestaand = await env.DB.prepare('SELECT email FROM admins WHERE email = ?').bind(email).first()
  if (bestaand) throw fout(409, 'Deze beheerder bestaat al.')

  const salt = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const hash = await hashWachtwoord(invoer.wachtwoord, salt, 100_000)

  await env.DB.prepare(
    `INSERT INTO admins (email, naam, rol, salt, hash, iteraties, aangemaakt)
     VALUES (?, ?, ?, ?, ?, 100000, ?)`,
  )
    .bind(email, naam, invoer.rol, salt, hash, new Date().toISOString())
    .run()

  return { email, naam, rol: invoer.rol, aangemaakt: new Date().toISOString() }
}

export async function verwijderBeheerder(env: Env, email: string, door: string): Promise<void> {
  if (email.toLowerCase() === door.toLowerCase()) {
    throw fout(400, 'Je kunt jezelf niet verwijderen.')
  }
  const aantal = await env.DB.prepare('SELECT COUNT(*) AS n FROM admins').first<{ n: number }>()
  if ((aantal?.n ?? 0) <= 1) throw fout(400, 'Er moet minimaal één beheerder blijven.')

  await env.DB.prepare('DELETE FROM sessions WHERE email = ?').bind(email).run()
  await env.DB.prepare('DELETE FROM admins WHERE email = ?').bind(email).run()
}

export async function wijzigBeheerder(
  env: Env,
  email: string,
  invoer: { naam?: string; rol?: string; wachtwoord?: string },
): Promise<void> {
  const velden: string[] = []
  const waarden: (string | number)[] = []

  if (invoer.naam !== undefined) {
    const naam = tekst(invoer.naam, 80)
    if (!naam) throw fout(400, 'Vul een naam in.')
    velden.push('naam = ?')
    waarden.push(naam)
  }
  if (invoer.rol !== undefined) {
    if (!ROLLEN.includes(invoer.rol)) throw fout(400, 'Onbekende rol.')
    velden.push('rol = ?')
    waarden.push(invoer.rol)
  }
  if (invoer.wachtwoord !== undefined) {
    if (invoer.wachtwoord.length < 5) throw fout(400, 'Kies een wachtwoord van minstens 5 tekens.')
    const salt = [...crypto.getRandomValues(new Uint8Array(16))]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    const hash = await hashWachtwoord(invoer.wachtwoord, salt, 100_000)
    velden.push('salt = ?', 'hash = ?', 'iteraties = ?')
    waarden.push(salt, hash, 100_000)
  }
  if (!velden.length) throw fout(400, 'Niets om te wijzigen.')

  await env.DB.prepare(`UPDATE admins SET ${velden.join(', ')} WHERE email = ?`)
    .bind(...waarden, email)
    .run()
}
