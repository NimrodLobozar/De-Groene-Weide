/**
 * Alle cijfermatige en technische gegevens van het erf.
 * Teksten staan in de woordenboeken (src/i18n), hier staan alleen de feiten.
 */

export type Soort = 'tent' | 'camper' | 'safaritent'
export type Ondergrond = 'gras' | 'halfverhard' | 'verhard' | 'hout'
export type Vlakheid = 'vlak' | 'licht hellend' | 'hellend'
export type PlekStatus = 'open' | 'dicht' | 'onderhoud'

export interface Plek {
  id: string
  soort: Soort
  /** Weide A (T1–T24), Weide B (T25–T48), camperplaatsen C, safaritenten S */
  weide: 'A' | 'B' | 'C' | 'S'
  stroom: boolean
  ondergrond: Ondergrond
  vlak: Vlakheid
  water: boolean
  rustig: boolean
  schaduw: boolean
  maxPersonen: number
  /** afstand tot sanitair in meters */
  afstandSanitair: number
  /** prijs per nacht, laagseizoen */
  prijs: number
  status: PlekStatus
  /** plekken met een hond toegestaan */
  hond: boolean
}

export const PRIJZEN = {
  tent: { laag: 21, hoog: 27, minNachten: 1 },
  camper: { laag: 26, hoog: 33, minNachten: 1 },
  safaritent: { laag: 75, hoog: 95, minNachten: 2 },
  toeristenbelasting: 1.5,
  schoonmaakSafaritent: 25,
  extraPersoon: 5,
} as const

/** Seizoen: 1 april t/m 31 oktober. Buiten het seizoen pakken we het komende seizoen. */
function seizoenVanNu(vanaf: Date = new Date()) {
  const jaar = vanaf.getMonth() > 9 ? vanaf.getFullYear() + 1 : vanaf.getFullYear()
  return {
    jaar,
    // In UTC opbouwen: de Worker en de browser moeten hetzelfde seizoen zien.
    start: new Date(Date.UTC(jaar, 3, 1)),
    eind: new Date(Date.UTC(jaar, 9, 31)),
  }
}

export const SEIZOEN = seizoenVanNu()

export function iso(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const dag = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dag}`
}

export function uitIso(s: string): Date {
  const [j, m, d] = s.split('-').map(Number)
  return new Date(j, m - 1, d)
}

export function nachten(a: string, b: string): number {
  const ms = uitIso(b).getTime() - uitIso(a).getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

export function dagenTussen(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** De dag die als "vandaag" geldt in de demo: vandaag, of de eerste dag van het seizoen. */
export function demoVandaag(): Date {
  const nu = new Date()
  nu.setHours(0, 0, 0, 0)
  if (nu < SEIZOEN.start) return new Date(SEIZOEN.start)
  if (nu > SEIZOEN.eind) return new Date(SEIZOEN.eind)
  return nu
}

/* -------------------------------------------------------------------------- */
/* Plekken                                                                    */
/* -------------------------------------------------------------------------- */

const sanitairAfstand = [40, 60, 90, 120, 160, 200, 240]

function maakPlek(nr: number, weide: 'A' | 'B' | 'C' | 'S'): Plek {
  if (weide === 'C') {
    return {
      id: `C${nr}`,
      soort: 'camper',
      weide: 'C',
      stroom: true,
      ondergrond: 'verhard',
      vlak: 'vlak',
      water: true,
      rustig: nr <= 4,
      schaduw: false,
      maxPersonen: 4,
      afstandSanitair: sanitairAfstand[nr % 5],
      prijs: PRIJZEN.camper.laag,
      status: 'open',
      hond: nr >= 9,
    }
  }
  if (weide === 'S') {
    return {
      id: `S${nr}`,
      soort: 'safaritent',
      weide: 'S',
      stroom: true,
      ondergrond: 'hout',
      vlak: 'vlak',
      water: false,
      rustig: true,
      schaduw: true,
      maxPersonen: 5,
      afstandSanitair: sanitairAfstand[nr % 4],
      prijs: PRIJZEN.safaritent.laag,
      status: 'open',
      hond: false,
    }
  }
  const id = `T${nr}`
  return {
    id,
    soort: 'tent',
    weide,
    stroom: nr % 2 === 0 || nr > 36,
    ondergrond: nr % 6 === 0 ? 'halfverhard' : 'gras',
    vlak: nr % 7 === 0 ? 'licht hellend' : 'vlak',
    water: nr % 5 === 0,
    rustig: nr <= 6 || (nr >= 35 && nr <= 40),
    schaduw: nr % 3 === 0,
    maxPersonen: nr % 4 === 0 ? 6 : 4,
    afstandSanitair: sanitairAfstand[nr % sanitairAfstand.length],
    prijs: PRIJZEN.tent.laag,
    status: 'open',
    hond: nr >= 41,
  }
}

export const PLEKKEN: Plek[] = [
  ...Array.from({ length: 24 }, (_, i) => maakPlek(i + 1, 'A')),
  ...Array.from({ length: 24 }, (_, i) => maakPlek(i + 25, 'B')),
  ...Array.from({ length: 12 }, (_, i) => maakPlek(i + 1, 'C')),
  ...Array.from({ length: 8 }, (_, i) => maakPlek(i + 1, 'S')),
]

export function plek(id: string): Plek | undefined {
  return PLEKKEN.find((p) => p.id === id)
}

/** Welk prijsniveau geldt op deze dag? Juli en augustus zijn hoogseizoen. */
export function isHoogseizoen(dag: string): boolean {
  const m = uitIso(dag).getMonth()
  return m === 6 || m === 7
}

export function prijsVoor(p: Plek, dag: string): number {
  const tabel = PRIJZEN[p.soort]
  return isHoogseizoen(dag) ? tabel.hoog : tabel.laag
}

/* -------------------------------------------------------------------------- */
/* Reserveringen                                                              */
/* -------------------------------------------------------------------------- */

export type Betaalstatus = 'bevestigd' | 'betaald' | 'geannuleerd' | 'nieuw'

export interface Reservering {
  nummer: string
  plek: string
  van: string
  tot: string
  volwassenen: number
  kinderen: number
  naam: string
  email: string
  telefoon: string
  plaats: string
  land: string
  opmerking: string
  bedrag: number
  status: Betaalstatus
  aangemaakt: string
  hond: boolean
}

const gasten = [
  ['Sanne de Vries', 'sanne@example.nl', 'Utrecht', 'Nederland'],
  ['Tom Bakker', 'tom.bakker@example.nl', 'Groningen', 'Nederland'],
  ['Julia Meijer', 'julia@example.nl', 'Antwerpen', 'België'],
  ['Lukas Weber', 'lukas.weber@example.de', 'Münster', 'Duitsland'],
  ['Emma Jansen', 'emma.j@example.nl', 'Zwolle', 'Nederland'],
  ['Daan Smit', 'daan.smit@example.nl', 'Leiden', 'Nederland'],
  ['Noor van Dijk', 'noor@example.nl', 'Breda', 'Nederland'],
  ['Finn Mulder', 'finn@example.nl', 'Enschede', 'Nederland'],
  ['Anna Schneider', 'anna.s@example.de', 'Köln', 'Duitsland'],
  ['Bram Visser', 'bram.visser@example.nl', 'Haarlem', 'Nederland'],
  ['Sophie Laurent', 'sophie@example.fr', 'Lille', 'Frankrijk'],
  ['Mees de Boer', 'mees@example.nl', 'Amersfoort', 'Nederland'],
]

const plekKandidaten = ['T14', 'T7', 'T22', 'T31', 'T2', 'C4', 'S3', 'T40', 'T18', 'C9', 'S1', 'T26']

/** Vaste, realistische demo-reserveringen binnen het seizoen. */
function seedReserveringen(): Reservering[] {
  const basis = new Date(SEIZOEN.start)
  const uit: Reservering[] = []
  for (let i = 0; i < 42; i += 1) {
    const start = new Date(basis)
    start.setDate(basis.getDate() + ((i * 5) % 200))
    const lengte = 2 + (i % 5)
    const eind = new Date(start)
    eind.setDate(start.getDate() + lengte)
    const gast = gasten[i % gasten.length]
    const plekId = plekKandidaten[i % plekKandidaten.length]
    const p = plek(plekId)
    const volwassenen = 1 + (i % 2)
    const kinderen = i % 3
    const bedrag =
      (p ? prijsVoor(p, iso(start)) : 25) * lengte +
      (volwassenen + kinderen) * PRIJZEN.toeristenbelasting * lengte
    uit.push({
      nummer: `GW-${2600 + i}`,
      plek: plekId,
      van: iso(start),
      tot: iso(eind),
      volwassenen,
      kinderen,
      naam: gast[0],
      email: gast[1],
      telefoon: '06 12 34 56 78',
      plaats: gast[2],
      land: gast[3],
      opmerking: '',
      bedrag: Math.round(bedrag),
      status: i % 11 === 0 ? 'geannuleerd' : i % 3 === 0 ? 'betaald' : 'bevestigd',
      aangemaakt: iso(new Date(start.getTime() - 14 * 86_400_000)),
      hond: i % 9 === 0,
    })
  }
  return uit
}

export const DEMO_RESERVERINGEN = seedReserveringen()

/* -------------------------------------------------------------------------- */
/* Voorzieningen op de plattegrond                                            */
/* -------------------------------------------------------------------------- */

export type VoorzieningSoort = 'dieren' | 'water' | 'spelen' | 'eten' | 'sanitair' | 'receptie'

export interface Voorziening {
  id: string
  soort: VoorzieningSoort
  /** plaats in het raster van de plattegrond */
  x: number
  y: number
  breed: number
  hoog: number
  open: boolean
}

export const VOORZIENINGEN_SUOORTEN: VoorzieningSoort[] = [
  'dieren',
  'water',
  'spelen',
  'eten',
  'sanitair',
  'receptie',
]

export const VOORZIENINGEN: Voorziening[] = [
  { id: 'kippenwei', soort: 'dieren', x: 1, y: 1, breed: 1, hoog: 1, open: true },
  { id: 'melkstal', soort: 'eten', x: 2, y: 1, breed: 1, hoog: 1, open: true },
  { id: 'sanitair', soort: 'sanitair', x: 3, y: 1, breed: 1, hoog: 1, open: true },
  { id: 'zwembad', soort: 'water', x: 4, y: 1, breed: 1, hoog: 1, open: true },
  { id: 'receptie', soort: 'receptie', x: 5, y: 1, breed: 1, hoog: 1, open: true },
  { id: 'speelweide', soort: 'spelen', x: 2, y: 2, breed: 2, hoog: 1, open: true },
]

/* -------------------------------------------------------------------------- */
/* Seizoensgrenzen voor de kalender                                           */
/* -------------------------------------------------------------------------- */

/** Alle dagen van het komende seizoen. */
export function seizoensdagen(): string[] {
  const dagen: string[] = []
  const d = new Date(SEIZOEN.start)
  while (d <= SEIZOEN.eind) {
    dagen.push(iso(d))
    d.setDate(d.getDate() + 1)
  }
  return dagen
}
