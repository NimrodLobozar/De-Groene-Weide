/** Kleine hulpjes die overal in de Worker terugkomen. */

export interface ApiFout extends Error {
  status: number
}

export function fout(status: number, bericht: string): ApiFout {
  const e = new Error(bericht) as ApiFout
  e.status = status
  return e
}

export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

export async function leesJson<T>(request: Request): Promise<T> {
  const type = request.headers.get('Content-Type') ?? ''
  if (!type.includes('application/json')) {
    throw fout(415, 'Verwacht een JSON-body.')
  }
  try {
    return (await request.json()) as T
  } catch {
    throw fout(400, 'Ongeldige JSON.')
  }
}

/** Vandaag als YYYY-MM-DD, in de tijdzone van de camping. */
export function vandaag(): string {
  const nu = new Date()
  const nl = new Date(nu.getTime() + 60 * 60 * 1000) // zomertijd
  return nl.toISOString().slice(0, 10)
}

/**
 * Het kampeerseizoen (1 april t/m 31 oktober). Buiten het seizoen pakken we het
 * komende seizoen. Bewust pas bij het eerste verzoek berekend: op het moment dat
 * de module wordt geladen is de klok in de Workers-runtime nog niet gezet.
 */
export function seizoen(): { jaar: number; van: string; tot: string } {
  const nu = new Date()
  const jaar = nu.getUTCMonth() > 9 ? nu.getUTCFullYear() + 1 : nu.getUTCFullYear()
  return { jaar, van: `${jaar}-04-01`, tot: `${jaar}-10-31` }
}

export function isDatum(waarde: unknown): waarde is string {
  return typeof waarde === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(waarde)
}

export function dagenTussen(van: string, tot: string): string[] {
  const uit: string[] = []
  const d = new Date(`${van}T00:00:00Z`)
  const eind = new Date(`${tot}T00:00:00Z`)
  while (d < eind) {
    uit.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return uit
}

export function isEmail(waarde: unknown): waarde is string {
  return typeof waarde === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(waarde.trim())
}

export function tekst(waarde: unknown, max: number): string {
  return String(waarde ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, max)
}

export function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Vergelijk twee strings zonder dat de looptijd iets verraadt. */
export function veiligGelijk(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let verschil = 0
  for (let i = 0; i < a.length; i += 1) verschil |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return verschil === 0
}
