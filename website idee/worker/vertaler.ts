/**
 * Vertalen via Lara Translate.
 *
 * De eigenaar vult alles in het Nederlands in; deze module maakt daar Engels en
 * Duits van. De Worker praat rechtstreeks met de REST-API (de Node-SDK past niet
 * in een Worker): eerst een token via /v2/auth met een HMAC-handtekening,
 * daarna /v2/translate met dat token.
 *
 * De sleutels staan als geheim in Cloudflare (LARA_ID en LARA_SECRET) en nooit
 * in de repo. Ontbreekt er een sleutel of is de dienst even niet bereikbaar, dan
 * geeft `vertaal()` null terug: het Nederlands wordt gewoon bewaard en het
 * beheer kan de vertaling later opnieuw proberen.
 *
 * Elke tekst gaat in een eigen verzoek. De Lara-documentatie zegt namelijk dat
 * een reeks teksten bedoeld is voor teksten die bij elkaar horen; losse
 * websiteonderdelen in één verzoek kunnen elkaar van context laten verwisselen.
 */
import { fout } from './util'

const BASIS = 'https://api.laratranslate.com'
const TIMEOUT_MS = 15_000
/** Lara doet per seconde een beperkt aantal tekens; zo blijven we daaronder. */
const GELIJKTIJDIG = 4

const TAALCODE = { en: 'en-US', de: 'de-DE', nl: 'nl-NL' } as const

export interface Vertaling {
  en: string
  de: string
}

/** Kan er vertaald worden? Zonder sleutels slaan we het vertalen over. */
export function vertalenMogelijk(env: Env): boolean {
  return Boolean(env.LARA_ID && env.LARA_SECRET)
}

function base64(bytes: ArrayBuffer | Uint8Array): string {
  const rij = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let tekst = ''
  for (const byte of rij) tekst += String.fromCharCode(byte)
  return btoa(tekst)
}

/**
 * De vingerafdruk van de request-body voor de handtekening.
 * De officiële clients verschillen hier (MD5 of het eerste stuk SHA-256); de
 * browser-versie van de SDK gebruikt het eerste stuk SHA-256 en dat werkt, dus
 * we hoeven geen MD5 na te bouwen.
 */
async function inhoudsVingerafdruk(body: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))
  return base64(digest.slice(0, 16))
}

async function hmac(geheim: string, tekst: string): Promise<string> {
  const sleutel = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(geheim),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return base64(await crypto.subtle.sign('HMAC', sleutel, new TextEncoder().encode(tekst)))
}

/** Het token uit de JWT halen, zodat we het niet onnodig vernieuwen. */
function verlooptOp(token: string): number {
  try {
    const deel = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const opgevuld = deel + '='.repeat((4 - (deel.length % 4)) % 4)
    const payload = JSON.parse(atob(opgevuld)) as { exp?: number }
    return typeof payload.exp === 'number' ? payload.exp * 1000 : 0
  } catch {
    return 0
  }
}

let tokenCache: { id: string; token: string; verloopt: number } | null = null

async function authToken(env: Env, opnieuw = false): Promise<string> {
  const id = env.LARA_ID
  const geheim = env.LARA_SECRET
  if (!id || !geheim) throw fout(503, 'Er zijn geen Lara-sleutels ingesteld.')

  if (!opnieuw && tokenCache && tokenCache.id === id && tokenCache.verloopt > Date.now() + 30_000) {
    return tokenCache.token
  }

  const body = JSON.stringify({ id })
  const datum = new Date().toUTCString()
  const vingerafdruk = await inhoudsVingerafdruk(body)
  const uitdaging = `POST\n/v2/auth\n${vingerafdruk}\napplication/json\n${datum}`

  const antwoord = await fetch(`${BASIS}/v2/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Lara-Date': datum,
      'Content-MD5': vingerafdruk,
      Authorization: `Lara:${await hmac(geheim, uitdaging)}`,
      'X-Lara-SDK-Name': 'de-groene-weide',
    },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  const tekst = await antwoord.text()
  if (!antwoord.ok) {
    tokenCache = null
    throw fout(502, `Inloggen bij Lara mislukte (${antwoord.status}). ${tekst.slice(0, 160)}`.trim())
  }

  const data = JSON.parse(tekst) as { token?: string }
  if (!data.token) throw fout(502, 'Lara gaf geen token terug.')

  tokenCache = { id, token: data.token, verloopt: verlooptOp(data.token) || Date.now() + 8 * 60_000 }
  return data.token
}

/** Het laatste JSON-object uit het antwoord: één regel, of NDJSON bij streaming. */
function leesVertaling(tekst: string): string {
  const kandidaten = tekst
    .trim()
    .split('\n')
    .filter((regel) => regel.trim() !== '')
  const regels = kandidaten.length > 1 ? [tekst, ...kandidaten] : kandidaten

  for (const regel of regels.reverse()) {
    try {
      const json = JSON.parse(regel) as { data?: { translation?: unknown }; translation?: unknown }
      const translation = json.data?.translation ?? json.translation
      if (typeof translation === 'string') return translation
      if (Array.isArray(translation) && typeof translation[0] === 'string') return translation[0]
    } catch {
      // geen JSON; volgende regel proberen
    }
  }
  throw fout(502, 'Lara gaf geen vertaling terug.')
}

async function vertaalVerzoek(env: Env, tekst: string, target: 'en' | 'de'): Promise<string> {
  const doen = async (token: string) =>
    fetch(`${BASIS}/v2/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lara-Date': new Date().toUTCString(),
        'X-Lara-SDK-Name': 'de-groene-weide',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        q: tekst,
        source: TAALCODE.nl,
        target: TAALCODE[target],
        content_type: 'text/plain',
        style: 'fluid',
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

  let antwoord = await doen(await authToken(env))
  if (antwoord.status === 401) antwoord = await doen(await authToken(env, true))
  if (antwoord.status === 429) {
    // Even rustig aan doen en één keer opnieuw proberen.
    const wacht = Number(antwoord.headers.get('Retry-After') ?? '1') * 1000
    await new Promise((klaar) => setTimeout(klaar, Math.min(5_000, Math.max(250, wacht))))
    antwoord = await doen(await authToken(env))
  }

  const tekstUit = await antwoord.text()
  if (!antwoord.ok) {
    throw fout(502, `Lara kon niet vertalen (${antwoord.status}). ${tekstUit.slice(0, 160)}`.trim())
  }
  return leesVertaling(tekstUit)
}

/** Tekst met {placeholders} mag niet stukvertaald worden. */
function placeholders(tekst: string): string[] {
  return (tekst.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort()
}

function zelfdePlaceholders(bron: string, vertaling: string): boolean {
  const a = placeholders(bron)
  const b = placeholders(vertaling)
  return a.length === b.length && a.every((p, i) => p === b[i])
}

async function vertaalRichting(env: Env, teksten: string[], target: 'en' | 'de'): Promise<string[]> {
  const uit: string[] = new Array(teksten.length).fill('')
  let volgende = 0

  const werk = async () => {
    while (volgende < teksten.length) {
      const index = volgende
      volgende += 1
      const bron = teksten[index]
      const waarde = await vertaalVerzoek(env, bron, target)
      uit[index] = zelfdePlaceholders(bron, waarde) ? waarde : bron
    }
  }

  await Promise.all(Array.from({ length: Math.min(GELIJKTIJDIG, teksten.length) }, werk))
  return uit
}

/**
 * Vertaal een reeks Nederlandse teksten naar Engels en Duits.
 * Geeft null terug als vertalen niet kan (geen sleutels, storing, te weinig
 * tegoed): de aanroeper bewaart dan alleen het Nederlands.
 */
export async function vertaal(env: Env, teksten: string[]): Promise<Vertaling[] | null> {
  if (!vertalenMogelijk(env) || teksten.length === 0) return null
  try {
    const engels = await vertaalRichting(env, teksten, 'en')
    const duits = await vertaalRichting(env, teksten, 'de')
    return teksten.map((_, i) => ({ en: engels[i] ?? '', de: duits[i] ?? '' }))
  } catch (e) {
    console.error('vertalen mislukte', String(e))
    return null
  }
}
