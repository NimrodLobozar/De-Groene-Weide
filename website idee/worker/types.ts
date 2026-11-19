/** Rijen zoals ze in D1 staan. */

export interface ReserveringRij {
  nummer: string
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
  bedrag: number
  status: string
  hond: number
  token: string
  taal: string
  aangemaakt: string
}

export interface PlekRij {
  id: string
  soort: string
  weide: string
  stroom: number
  ondergrond: string
  vlak: string
  water: number
  rustig: number
  schaduw: number
  max_personen: number
  afstand_sanitair: number
  prijs: number
  status: string
  hond: number
  volgorde: number
}

/** Zoals de site een plek gebruikt. */
export interface PlekApi {
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

export interface EventRij {
  id: number
  dag: number
  tijd: string
  titel_nl: string
  titel_en: string
  titel_de: string
  locatie: string
  leeftijd: string
  soort: string
  actief: number
  aangemaakt: string
}

export interface FaciliteitRij {
  id: string
  soort: string
  naam: string
  kort: string
  x: number
  y: number
  breed: number
  hoog: number
  open: number
  volgorde: number
  aangemaakt: string
}

export interface MediaRij {
  sleutel: string
  bestandsnaam: string
  type: string
  grootte: number
  r2_sleutel: string
  aangemaakt: string
}

export interface BerichtRij {
  id: number
  naam: string
  email: string
  onderwerp: string
  bericht: string
  gelezen: number
  aangemaakt: string
}

export interface OutboxRij {
  id: number
  aan: string
  van: string
  onderwerp: string
  tekst: string
  html: string
  soort: string
  status: string
  fout: string | null
  pogingen: number
  aangemaakt: string
}

export type Taal = 'nl' | 'en' | 'de'

/** Een tekst die de eigenaar zelf aanpaste; leeg = terug naar de tekst uit de code. */
export interface TekstRij {
  sleutel: string
  nl: string
  en: string
  de: string
  vertaald: string
  bijgewerkt: string
}

/** Een melding bovenaan de site. */
export interface MeldingRij {
  id: number
  nl: string
  en: string
  de: string
  soort: string
  actief: number
  van: string
  tot: string
  volgorde: number
  aangemaakt: string
  bijgewerkt: string
}

