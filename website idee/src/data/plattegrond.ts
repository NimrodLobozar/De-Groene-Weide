/**
 * De plattegrond van het erf: welke plekken er zijn, welke foto en welk
 * reserveersoort erbij hoort, en het programma met de aanmeldingen.
 *
 * De tekening zelf (coördinaten, kleuren) staat in `components/plattegrond/Kaart.tsx`,
 * de teksten in de woordenboeken (`src/i18n`), en dit bestand houdt alleen de feiten bij.
 */

import type { IcoonNaam } from '../components/Icoon'
import type { Soort } from './camping'

/* -------------------------------------------------------------------------- */
/* Plekken op de kaart                                                        */
/* -------------------------------------------------------------------------- */

export const ZONE_IDS = [
  'woonhuis',
  'kampeerveld',
  'camperveld',
  'achterste',
  'melkstal',
  'sanitair',
  'zwembad',
  'speelweide',
  'parkeerplaats',
  'ingang',
] as const

export type ZoneId = (typeof ZONE_IDS)[number]

/** Het soort plek dat bij de reserveerknop van een zone hoort. */
export type BoekSoort = 'kampeerplek' | 'camperplek' | 'safaritent'

/** Waar de reserveerknop de boeking mee voorinvult. */
export const BOEK_SOORT: Record<BoekSoort, Soort> = {
  kampeerplek: 'tent',
  camperplek: 'camper',
  safaritent: 'safaritent',
}

export interface Zone {
  id: ZoneId
  /** Sleutel van de foto in het beheer (zie `worker/cms.ts`). Ontbreekt de foto, dan zoomt het paneel in op de kaart. */
  foto: string
  /** Toont de reserveerknop voor dit soort plek. */
  boek?: BoekSoort
  /** Eén icoon per regel uit "Wat kun je hier doen", in dezelfde volgorde als de tekst. */
  iconen: IcoonNaam[]
}

export const ZONES: Record<ZoneId, Zone> = {
  woonhuis: { id: 'woonhuis', foto: 'woonhuis', iconen: ['schuur', 'brood', 'pin'] },
  kampeerveld: {
    id: 'kampeerveld',
    foto: 'kampeerveld',
    boek: 'kampeerplek',
    iconen: ['zon', 'ster', 'schommel'],
  },
  camperveld: {
    id: 'camperveld',
    foto: 'camperveld',
    boek: 'camperplek',
    iconen: ['pin', 'douche', 'basket'],
  },
  achterste: {
    id: 'achterste',
    foto: 'safaritent',
    boek: 'safaritent',
    iconen: ['ster', 'zon', 'maan'],
  },
  melkstal: { id: 'melkstal', foto: 'kantine', iconen: ['kopje', 'basket', 'schuur'] },
  sanitair: { id: 'sanitair', foto: 'sanitair', iconen: ['douche', 'was'] },
  zwembad: { id: 'zwembad', foto: 'zwembad', iconen: ['zwembad', 'zon'] },
  speelweide: { id: 'speelweide', foto: 'speelweide', iconen: ['schommel', 'mensen', 'zon'] },
  parkeerplaats: { id: 'parkeerplaats', foto: 'parkeerplaats', iconen: [] },
  ingang: { id: 'ingang', foto: 'ingang', iconen: [] },
}

/** Hiermee opent de kaart: de receptie, want daar begint een verblijf. */
export const START_ZONE: ZoneId = 'woonhuis'

/* -------------------------------------------------------------------------- */
/* Programma                                                                  */
/* -------------------------------------------------------------------------- */

export type Weekdag = 'ma' | 'di' | 'wo' | 'do' | 'vr' | 'za' | 'zo'

export interface ProgrammaItem {
  id: string
  zone: ZoneId
  /** "dagelijks", of de dagen waarop de activiteit valt. */
  days: 'dagelijks' | Weekdag[]
  /** Begin- en eindtijd als "10:00". */
  start: string
  end: string
  /** Maximaal aantal deelnemers. */
  spots: number
  /** Alleen in juli en augustus. */
  summerOnly?: boolean
}

/**
 * Voorbeeldprogramma. De titels en uitleg staan in het woordenboek onder
 * `plattegrond.programma.activiteit.<id>`.
 */
export const PROGRAMMA: ProgrammaItem[] = [
  {
    id: 'erfwandeling',
    zone: 'woonhuis',
    days: ['ma', 'wo', 'vr', 'za'],
    start: '10:00',
    end: '11:00',
    spots: 15,
  },
  {
    id: 'fietstocht',
    zone: 'woonhuis',
    days: ['di', 'do'],
    start: '14:00',
    end: '16:30',
    spots: 12,
  },
  {
    id: 'speurtocht',
    zone: 'speelweide',
    days: ['zo'],
    start: '10:30',
    end: '12:00',
    spots: 25,
    summerOnly: true,
  },
  {
    id: 'animatie',
    zone: 'speelweide',
    days: 'dagelijks',
    start: '13:00',
    end: '15:00',
    spots: 30,
    summerOnly: true,
  },
  {
    id: 'watergym',
    zone: 'zwembad',
    days: ['di', 'do'],
    start: '11:00',
    end: '11:45',
    spots: 12,
    summerOnly: true,
  },
  {
    id: 'proeverij',
    zone: 'melkstal',
    days: ['za'],
    start: '16:00',
    end: '17:00',
    spots: 20,
  },
  {
    id: 'boerenquiz',
    zone: 'melkstal',
    days: ['wo'],
    start: '20:00',
    end: '21:30',
    spots: 40,
  },
  {
    id: 'sterren',
    zone: 'achterste',
    days: ['vr', 'za'],
    start: '22:00',
    end: '23:00',
    spots: 20,
  },
]
