/**
 * Gegevensbeheer: opruimen en het recht op vergetelheid.
 * Alleen bereikbaar voor een ingelogde beheerder.
 */
import { fout, isEmail, tekst } from './util'

export const DATA_ONDERDELEN = [
  'reserveringen',
  'mails',
  'berichten',
  'aanmeldingen',
  'sessies',
  'fotos',
] as const

export type DataOnderdeel = (typeof DATA_ONDERDELEN)[number]

const TABEL: Record<DataOnderdeel, string> = {
  reserveringen: 'reservations',
  mails: 'outbox',
  berichten: 'messages',
  aanmeldingen: 'subscribers',
  sessies: 'sessions',
  fotos: 'media',
}

export interface DataOverzicht {
  reserveringen: number
  mails: number
  berichten: number
  aanmeldingen: number
  sessies: number
  fotos: number
  plekken: number
  events: number
  voorzieningen: number
  beheerders: number
}

async function tel(env: Env, tabel: string): Promise<number> {
  const rij = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${tabel}`).first<{ n: number }>()
  return rij?.n ?? 0
}

export async function dataOverzicht(env: Env): Promise<DataOverzicht> {
  return {
    reserveringen: await tel(env, 'reservations'),
    mails: await tel(env, 'outbox'),
    berichten: await tel(env, 'messages'),
    aanmeldingen: await tel(env, 'subscribers'),
    sessies: await tel(env, 'sessions'),
    fotos: await tel(env, 'media'),
    plekken: await tel(env, 'pitches'),
    events: await tel(env, 'events'),
    voorzieningen: await tel(env, 'facilities'),
    beheerders: await tel(env, 'admins'),
  }
}

/** Wist één onderdeel, of alles wat met gasten te maken heeft. */
export async function wisData(
  env: Env,
  wat: DataOnderdeel | 'alles',
): Promise<{ verwijderd: number }> {
  if (wat === 'alles') {
    let totaal = 0
    for (const onderdeel of DATA_ONDERDELEN) {
      totaal += (await wisData(env, onderdeel)).verwijderd
    }
    return { verwijderd: totaal }
  }

  if (!DATA_ONDERDELEN.includes(wat)) throw fout(400, 'Onbekend onderdeel.')

  if (wat === 'fotos') {
    const { results } = await env.DB.prepare('SELECT sleutel FROM media').all<{ sleutel: string }>()
    for (const rij of results ?? []) {
      await env.MEDIA.delete(`foto:${rij.sleutel}`)
    }
  }

  const voor = await tel(env, TABEL[wat])
  await env.DB.prepare(`DELETE FROM ${TABEL[wat]}`).run()
  const na = await tel(env, TABEL[wat])
  return { verwijderd: Math.max(0, voor - na) }
}

/**
 * Wist alle gegevens die bij één e-mailadres horen: reserveringen, berichten en de
 * nieuwsbriefaanmelding. Dit is het "recht op vergetelheid" uit de AVG.
 */
export async function wisGast(
  env: Env,
  ruwEmail: string,
): Promise<{ reserveringen: number; berichten: number; aanmeldingen: number }> {
  const email = tekst(ruwEmail, 160).toLowerCase()
  if (!isEmail(email)) throw fout(400, 'Vul een geldig e-mailadres in.')

  const telVoor = async (tabel: string) =>
    (
      await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${tabel} WHERE lower(email) = ?`)
        .bind(email)
        .first<{ n: number }>()
    )?.n ?? 0

  const reserveringen = await telVoor('reservations')
  const berichten = await telVoor('messages')
  const aanmeldingen = await telVoor('subscribers')

  await env.DB.prepare('DELETE FROM reservations WHERE lower(email) = ?').bind(email).run()
  await env.DB.prepare('DELETE FROM messages WHERE lower(email) = ?').bind(email).run()
  await env.DB.prepare('DELETE FROM subscribers WHERE lower(email) = ?').bind(email).run()

  return { reserveringen, berichten, aanmeldingen }
}
