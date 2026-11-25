/** Inloggen, sessies en wachtwoordhashes (PBKDF2-SHA256 via WebCrypto). */
import { fout, hex, veiligGelijk } from './util'

export const COOKIE = 'gw_sess'
const SESSIE_DAGEN = 7
const ITERATIES = 100_000
const LOGIN_VENSTER_MS = 15 * 60 * 1000
const LOGIN_MAXIMUM = 5

export interface Beheerder {
  email: string
  naam: string
  rol: string
}

function loginSleutel(request: Request, email: string): string {
  const ip = (request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For') ??
    'onbekend')
    .split(',')[0]
    .trim()
  return `${ip}:${email.trim().toLowerCase()}`
}

export async function hashWachtwoord(
  wachtwoord: string,
  salt: string,
  iteraties = ITERATIES,
): Promise<string> {
  const sleutel = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(wachtwoord),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: iteraties,
      hash: 'SHA-256',
    },
    sleutel,
    256,
  )
  return hex(bits)
}

export function leesCookie(request: Request, naam: string): string | null {
  const header = request.headers.get('Cookie')
  if (!header) return null
  for (const deel of header.split(';')) {
    const [k, ...rest] = deel.trim().split('=')
    if (k === naam) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function cookieWaarde(token: string, maxAgeSeconden: number): string {
  return [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconden}`,
  ].join('; ')
}

export function wisCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

export async function controleerLoginLimiet(
  request: Request,
  env: Env,
  email: string,
): Promise<void> {
  const sleutel = loginSleutel(request, email)
  const rij = await env.DB.prepare(
    'SELECT aantal, venster_start, geblokkeerd_tot FROM login_attempts WHERE sleutel = ?',
  )
    .bind(sleutel)
    .first<{ aantal: number; venster_start: string; geblokkeerd_tot: string }>()

  if (!rij) return
  const nu = Date.now()
  if (rij.geblokkeerd_tot && Date.parse(rij.geblokkeerd_tot) > nu) {
    throw fout(429, 'Te veel mislukte pogingen. Probeer het later opnieuw.')
  }
  if (nu - Date.parse(rij.venster_start) >= LOGIN_VENSTER_MS) {
    await env.DB.prepare('DELETE FROM login_attempts WHERE sleutel = ?').bind(sleutel).run()
  }
}

export async function registreerMislukteLogin(
  request: Request,
  env: Env,
  email: string,
): Promise<void> {
  const sleutel = loginSleutel(request, email)
  const nu = Date.now()
  const rij = await env.DB.prepare(
    'SELECT aantal, venster_start FROM login_attempts WHERE sleutel = ?',
  )
    .bind(sleutel)
    .first<{ aantal: number; venster_start: string }>()

  if (!rij || nu - Date.parse(rij.venster_start) >= LOGIN_VENSTER_MS) {
    await env.DB.prepare(
      `INSERT INTO login_attempts (sleutel, aantal, venster_start, geblokkeerd_tot)
       VALUES (?, 1, ?, '')
       ON CONFLICT(sleutel) DO UPDATE SET
         aantal = 1, venster_start = excluded.venster_start, geblokkeerd_tot = ''`,
    )
      .bind(sleutel, new Date(nu).toISOString())
      .run()
    return
  }

  const aantal = rij.aantal + 1
  const geblokkeerdTot =
    aantal >= LOGIN_MAXIMUM ? new Date(nu + LOGIN_VENSTER_MS).toISOString() : ''
  await env.DB.prepare(
    'UPDATE login_attempts SET aantal = ?, geblokkeerd_tot = ? WHERE sleutel = ?',
  )
    .bind(aantal, geblokkeerdTot, sleutel)
    .run()
}

export async function wisMislukteLogins(
  request: Request,
  env: Env,
  email: string,
): Promise<void> {
  await env.DB.prepare('DELETE FROM login_attempts WHERE sleutel = ?')
    .bind(loginSleutel(request, email))
    .run()
}

export async function login(
  env: Env,
  email: string,
  wachtwoord: string,
): Promise<{ admin: Beheerder; token: string; maxAge: number }> {
  const rij = await env.DB.prepare(
    'SELECT email, naam, rol, salt, hash, iteraties FROM admins WHERE lower(email) = lower(?)',
  )
    .bind(email)
    .first<{ email: string; naam: string; rol: string; salt: string; hash: string; iteraties: number }>()

  if (!rij) throw fout(401, 'Onbekend e-mailadres of wachtwoord.')

  const berekend = await hashWachtwoord(wachtwoord, rij.salt, rij.iteraties)
  if (!veiligGelijk(berekend, rij.hash)) {
    throw fout(401, 'Onbekend e-mailadres of wachtwoord.')
  }

  const token = hex(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer)
  const maxAge = SESSIE_DAGEN * 24 * 60 * 60
  const verloopt = new Date(Date.now() + maxAge * 1000).toISOString()

  await env.DB.prepare(
    'INSERT INTO sessions (token, email, verloopt, aangemaakt) VALUES (?, ?, ?, ?)',
  )
    .bind(token, rij.email, verloopt, new Date().toISOString())
    .run()

  // oude sessies opruimen
  await env.DB.prepare('DELETE FROM sessions WHERE verloopt < ?')
    .bind(new Date().toISOString())
    .run()

  return { admin: { email: rij.email, naam: rij.naam, rol: rij.rol }, token, maxAge }
}

export async function sessie(request: Request, env: Env): Promise<Beheerder | null> {
  const token = leesCookie(request, COOKIE)
  if (!token) return null

  const rij = await env.DB.prepare(
    `SELECT a.email, a.naam, a.rol
       FROM sessions s JOIN admins a ON a.email = s.email
      WHERE s.token = ? AND s.verloopt > ?`,
  )
    .bind(token, new Date().toISOString())
    .first<Beheerder>()

  return rij ?? null
}

export async function uitloggen(request: Request, env: Env): Promise<void> {
  const token = leesCookie(request, COOKIE)
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run()
  }
}
