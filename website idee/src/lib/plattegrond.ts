/**
 * De rekenregels achter de plattegrond: welke dagen telt het programma,
 * wanneer is een activiteit begonnen, en welke aanmeldingen er zijn.
 *
 * Alles is puur (geen React), zodat de pagina, de kaart en het paneel
 * dezelfde antwoorden krijgen.
 */

import { SEIZOEN } from '../data/camping'
import { PROGRAMMA, type ProgrammaItem, type Weekdag, type ZoneId } from '../data/plattegrond'

const WEEKDAYS: Weekdag[] = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']

/** Zo veel dagen staat er in het paneel: vandaag, morgen en overmorgen. */
export const DAGEN_GETOOND = 3

/** Juli en augustus (0 = januari). */
const ZOMER = { van: 6, tot: 7 }

export function beginVanDag(d: Date): Date {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  return r
}

export function telDagenOp(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function zelfdeDag(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

function twee(n: number): string {
  return String(n).padStart(2, '0')
}

export function naarIso(d: Date): string {
  return `${d.getFullYear()}-${twee(d.getMonth() + 1)}-${twee(d.getDate())}`
}

/** Maand-dag als "04-01", zodat we seizoensgrenzen kunnen vergelijken. */
function maandDag(d: Date): string {
  return `${twee(d.getMonth() + 1)}-${twee(d.getDate())}`
}

const SEIZOEN_VAN = maandDag(SEIZOEN.start)
const SEIZOEN_TOT = maandDag(SEIZOEN.eind)

export function inSeizoen(d: Date): boolean {
  const sleutel = maandDag(d)
  return sleutel >= SEIZOEN_VAN && sleutel <= SEIZOEN_TOT
}

function inZomer(d: Date): boolean {
  return d.getMonth() >= ZOMER.van && d.getMonth() <= ZOMER.tot
}

export function minuten(hhmm: string): number {
  const [uur, minuut] = hhmm.split(':').map(Number)
  return (uur || 0) * 60 + (minuut || 0)
}

/** De dagen die de dagkiezer toont. Buiten het seizoen als voorbeeld vanaf 1 juli. */
export interface Schema {
  dagen: Date[]
  /** True als de camping dicht is en we het programma als voorbeeld tonen. */
  voorbeeld: boolean
}

export function maakSchema(nu: Date = new Date()): Schema {
  const vandaag = beginVanDag(nu)
  let basis = vandaag
  let voorbeeld = false

  if (!inSeizoen(basis)) {
    voorbeeld = true
    // November en december: het seizoen van volgend jaar. Daarvoor: 1 juli dit jaar.
    basis = new Date(basis.getMonth() >= 10 ? basis.getFullYear() + 1 : basis.getFullYear(), 6, 1)
  }

  const dagen: Date[] = []
  for (let i = 0; i < DAGEN_GETOOND; i += 1) {
    const d = telDagenOp(basis, i)
    if (inSeizoen(d)) dagen.push(d)
  }
  return { dagen, voorbeeld }
}

function looptOp(item: ProgrammaItem, dag: Date): boolean {
  if (item.summerOnly && !inZomer(dag)) return false
  if (item.days === 'dagelijks') return true
  return item.days.includes(WEEKDAYS[dag.getDay()])
}

/** De activiteiten van deze plek op deze dag, op tijd gesorteerd. */
export function itemsVoor(zone: ZoneId, dag: Date | null): ProgrammaItem[] {
  if (!dag) return []
  return PROGRAMMA.filter((item) => item.zone === zone && looptOp(item, dag)).sort(
    (a, b) => minuten(a.start) - minuten(b.start),
  )
}

export function zoneHeeftProgramma(zone: ZoneId): boolean {
  return PROGRAMMA.some((item) => item.zone === zone)
}

export type TijdStatus = 'open' | 'bezig' | 'afgelopen'

/** Is de activiteit vandaag al begonnen of voorbij? */
export function tijdStatus(item: ProgrammaItem, dag: Date, nu: Date = new Date()): TijdStatus {
  if (!zelfdeDag(dag, beginVanDag(nu))) return 'open'
  const m = nu.getHours() * 60 + nu.getMinutes()
  if (m >= minuten(item.end)) return 'afgelopen'
  if (m >= minuten(item.start)) return 'bezig'
  return 'open'
}

/**
 * Demo: het aantal aanmeldingen van andere gasten, steeds hetzelfde per
 * activiteit en dag. Met een server haal je dit daar op.
 */
export function bezetDoorAnderen(item: ProgrammaItem, iso: string): number {
  const tekst = item.id + iso
  let h = 0
  for (let i = 0; i < tekst.length; i += 1) h = (h * 31 + tekst.charCodeAt(i)) >>> 0
  return Math.min(item.spots, Math.round(item.spots * (0.35 + (h % 76) / 100)))
}

/* -------------------------------------------------------------------------- */
/* Aanmeldingen in de browser                                                 */
/* -------------------------------------------------------------------------- */

export interface Aanmelding {
  naam: string
  personen: number
}

export type Aanmeldingen = Record<string, Aanmelding>

const SLEUTEL_AANMELDINGEN = 'gw:plattegrond-aanmeldingen'
const SLEUTEL_NAAM = 'gw:plattegrond-naam'

/** Sleutel waaronder een aanmelding bewaard wordt: activiteit + datum. */
export function aanmeldingSleutel(id: string, iso: string): string {
  return `${id}|${iso}`
}

export function leesAanmeldingen(): Aanmeldingen {
  try {
    const ruw = localStorage.getItem(SLEUTEL_AANMELDINGEN)
    return ruw ? (JSON.parse(ruw) as Aanmeldingen) : {}
  } catch {
    return {}
  }
}

export function bewaarAanmeldingen(aanmeldingen: Aanmeldingen) {
  try {
    localStorage.setItem(SLEUTEL_AANMELDINGEN, JSON.stringify(aanmeldingen))
  } catch {
    /* Privévenster of opslag vol: dan alleen in het geheugen. */
  }
}

export function leesNaam(): string {
  try {
    return localStorage.getItem(SLEUTEL_NAAM) ?? ''
  } catch {
    return ''
  }
}

export function bewaarNaam(naam: string) {
  try {
    localStorage.setItem(SLEUTEL_NAAM, naam)
  } catch {
    /* opslag geblokkeerd */
  }
}
