/** Dun laagje om de API van de Worker heen. */

export class ApiFout extends Error {
  status: number
  soort: 'validatie' | 'autorisatie' | 'server' | 'netwerk' | 'timeout' | 'onbekend'
  constructor(
    bericht: string,
    status: number,
    soort: 'validatie' | 'autorisatie' | 'server' | 'netwerk' | 'timeout' | 'onbekend' = 'onbekend',
  ) {
    super(bericht)
    this.status = status
    this.soort = soort
  }
}

async function verzoek<T>(pad: string, opties: RequestInit = {}): Promise<T> {
  const heeftBody = opties.body !== undefined
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)
  let res: Response
  try {
    res = await fetch(`/api/${pad.replace(/^\//, '')}`, {
      ...opties,
      credentials: 'same-origin',
      signal: controller.signal,
      headers: {
        ...(heeftBody && !(opties.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(opties.headers ?? {}),
      },
    })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiFout('Het verzoek duurde te lang. Probeer het opnieuw.', 408, 'timeout')
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ApiFout(
        'Je bent offline. Controleer je internetverbinding en probeer het opnieuw.',
        0,
        'netwerk',
      )
    }
    throw new ApiFout('De server is tijdelijk niet bereikbaar.', 0, 'netwerk')
  } finally {
    window.clearTimeout(timeout)
  }

  const ruw = await res.text()
  let data: unknown = null
  try {
    data = ruw ? JSON.parse(ruw) : null
  } catch {
    data = null
  }

  if (!res.ok) {
    const bericht = (data as { fout?: string } | null)?.fout ?? `Er ging iets mis (${res.status}).`
    const soort =
      res.status === 400 || res.status === 422
        ? 'validatie'
        : res.status === 401 || res.status === 403
          ? 'autorisatie'
          : res.status === 429
            ? 'server'
            : res.status >= 500
              ? 'server'
              : 'onbekend'
    throw new ApiFout(bericht, res.status, soort)
  }
  return data as T
}

const post = <T>(pad: string, body?: unknown) =>
  verzoek<T>(pad, { method: 'POST', body: body === undefined ? '{}' : JSON.stringify(body) })
const patch = <T>(pad: string, body: unknown) =>
  verzoek<T>(pad, { method: 'PATCH', body: JSON.stringify(body) })
const verwijder = <T>(pad: string) => verzoek<T>(pad, { method: 'DELETE' })

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ApiPlek {
  id: string
  soort: 'tent' | 'camper' | 'safaritent'
  weide: 'A' | 'B' | 'C' | 'S'
  stroom: boolean
  ondergrond: 'gras' | 'halfverhard' | 'verhard' | 'hout'
  vlak: 'vlak' | 'licht hellend' | 'hellend'
  water: boolean
  rustig: boolean
  schaduw: boolean
  maxPersonen: number
  afstandSanitair: number
  prijs: number
  status: 'open' | 'dicht' | 'onderhoud'
  hond: boolean
}

export interface ApiMelding {
  id: number
  soort: 'mededeling' | 'waarschuwing' | 'dringend'
  nl: string
  en: string
  de: string
  van: string
  tot: string
}

export interface ApiConfig {
  aankondiging: string
  aankondigingAan: boolean
  plekmatchAan: boolean
  seizoen: { van: string; tot: string }
  meldingen: ApiMelding[]
}

/** Eén tekst uit het beheer: de Nederlandse bron met de vertalingen. */
export interface ApiTekst {
  sleutel: string
  nl: string
  en: string
  de: string
  /** De tekst zoals hij in de code staat; leeg als er niets is aangepast. */
  standaard: string
  /** De Engelse en Duitse tekst uit de code, voor als er niets is aangepast. */
  standaardEn: string
  standaardDe: string
  vertaald: string
  bijgewerkt: string
}

export interface ApiMeldingBeheer {
  id: number
  nl: string
  en: string
  de: string
  soort: 'mededeling' | 'waarschuwing' | 'dringend'
  actief: number
  van: string
  tot: string
  volgorde: number
  aangemaakt: string
  bijgewerkt: string
}

export interface ApiEvent {
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

export interface ApiFaciliteit {
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

export interface ApiMedia {
  sleutel: string
  bestandsnaam: string
  type: string
  grootte: number
  opslag_sleutel: string
  aangemaakt: string
}

export interface ApiTeamlid {
  email: string
  naam: string
  rol: string
  aangemaakt: string
}

export interface ApiReservering {
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
  status: 'bevestigd' | 'betaald' | 'geannuleerd' | 'nieuw'
  hond: number
  taal: string
  aangemaakt: string
}

export interface ApiBeheerder {
  email: string
  naam: string
  rol: string
}

export interface ApiBericht {
  id: number
  naam: string
  email: string
  onderwerp: string
  bericht: string
  gelezen: number
  aangemaakt: string
}

export interface ApiMail {
  id: number
  aan: string
  van: string
  onderwerp: string
  soort: string
  status: 'verzonden' | 'fout' | 'wacht'
  via: string | null
  fout: string | null
  pogingen: number
  aangemaakt: string
}

export interface ApiMailStatus {
  transport: 'resend' | 'cloudflare'
  boekingen: string
  receptie: string
  notificatie: string
}

export interface ApiStats {
  dag: string
  aankomst: number
  vertrek: number
  bezet: number
  plekken: number
  bezetting: number
}

export interface ApiDataOverzicht {
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

export interface ReserveringInvoer {
  aankomst: string
  vertrek: string
  volwassenen: number
  kinderen: number
  plek: string
  wensen: string[]
  taal: string
  akkoord?: boolean
  gegevens: {
    naam: string
    email: string
    telefoon: string
    adres: string
    postcode: string
    plaats: string
    land: string
    opmerking: string
  }
}

/* -------------------------------------------------------------------------- */
/* Openbaar                                                                   */
/* -------------------------------------------------------------------------- */

export const api = {
  config: () => verzoek<ApiConfig>('config'),

  teksten: () => verzoek<{ teksten: Record<string, { nl: string; en: string; de: string }> }>('texts'),

  plekken: () => verzoek<{ plekken: ApiPlek[] }>('pitches'),

  events: () => verzoek<{ events: ApiEvent[] }>('events'),

  voorzieningen: () => verzoek<{ voorzieningen: ApiFaciliteit[] }>('facilities'),

  foto: () => verzoek<{ foto: Record<string, string> }>('media'),

  beschikbaarheid: (van: string, tot: string) =>
    verzoek<{ bezet: Record<string, string[]> }>(
      `availability?van=${encodeURIComponent(van)}&tot=${encodeURIComponent(tot)}`,
    ),

  maakReservering: (invoer: ReserveringInvoer) =>
    post<{
      nummer: string
      token: string
      bedrag: number
      plek: string
      van: string
      tot: string
    }>('reservations', invoer),

  reservering: (nummer: string, token: string) =>
    verzoek<{
      nummer: string
      pitch: string
      van: string
      tot: string
      volwassenen: number
      kinderen: number
      naam: string
      email: string
      bedrag: number
      status: string
      taal: string
    }>(`reservations/${encodeURIComponent(nummer)}?token=${encodeURIComponent(token)}`),

  annuleer: (nummer: string, token: string) =>
    post<{ ok: boolean }>(`reservations/${encodeURIComponent(nummer)}/annuleer`, { token }),

  contact: (invoer: { naam: string; email: string; onderwerp: string; bericht: string }) =>
    post<{ ok: boolean }>('contact', invoer),

  nieuwsbrief: (email: string, taal: string) => post<{ ok: boolean }>('nieuwsbrief', { email, taal }),

  /* --- beheer --- */
  adminLogin: (email: string, wachtwoord: string) =>
    post<{ admin: ApiBeheerder }>('admin/login', { email, wachtwoord }),

  adminLogout: () => post<{ ok: boolean }>('admin/logout'),

  adminIk: () => verzoek<{ admin: ApiBeheerder | null }>('admin/ik'),

  adminReserveringen: (q = '', status = '') =>
    verzoek<{ reserveringen: ApiReservering[] }>(
      `admin/reservations?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`,
    ),

  adminMaakReservering: (invoer: ReserveringInvoer) =>
    post<{ reservering: ApiReservering }>('admin/reservations', invoer),

  adminWijzigReservering: (nummer: string, status: string) =>
    patch<{ ok: boolean }>(`admin/reservations/${encodeURIComponent(nummer)}`, { status }),

  adminVerwijderReservering: (nummer: string) =>
    verwijder<{ ok: boolean }>(`admin/reservations/${encodeURIComponent(nummer)}`),

  adminStats: () => verzoek<ApiStats>('admin/stats'),

  adminPlekken: () => verzoek<{ plekken: ApiPlek[] }>('admin/pitches'),

  adminMaakPlek: (invoer: Omit<ApiPlek, 'status'> & { status?: string }) =>
    post<{ plek: ApiPlek }>('admin/pitches', invoer),

  adminWijzigPlek: (id: string, wijziging: Partial<Pick<ApiPlek, 'status' | 'prijs' | 'maxPersonen'>>) =>
    patch<{ ok: boolean }>(`admin/pitches/${encodeURIComponent(id)}`, wijziging),

  adminVerwijderPlek: (id: string) => verwijder<{ ok: boolean }>(`admin/pitches/${encodeURIComponent(id)}`),

  adminEvents: () => verzoek<{ events: ApiEvent[] }>('admin/events'),

  adminMaakEvent: (invoer: {
    dag: number
    tijd: string
    titelNl: string
    titelEn?: string
    titelDe?: string
    locatie?: string
    leeftijd?: string
    soort: string
  }) => post<{ event: ApiEvent }>('admin/events', invoer),

  adminWijzigEvent: (id: number, wijziging: Record<string, unknown>) =>
    patch<{ ok: boolean }>(`admin/events/${id}`, wijziging),

  adminVerwijderEvent: (id: number) => verwijder<{ ok: boolean }>(`admin/events/${id}`),

  adminVoorzieningen: () => verzoek<{ voorzieningen: ApiFaciliteit[] }>('admin/facilities'),

  adminMaakVoorziening: (invoer: {
    id: string
    soort: string
    naam: string
    kort?: string
    x?: number
    y?: number
  }) => post<{ voorziening: ApiFaciliteit }>('admin/facilities', invoer),

  adminVerwijderVoorziening: (id: string) =>
    verwijder<{ ok: boolean }>(`admin/facilities/${encodeURIComponent(id)}`),

  adminMedia: () => verzoek<{ foto: ApiMedia[] }>('admin/media'),

  adminUploadMedia: (sleutel: string, bestand: File) => {
    const form = new FormData()
    form.append('foto', bestand)
    return verzoek<{ foto: ApiMedia }>(`admin/media/${encodeURIComponent(sleutel)}`, {
      method: 'POST',
      body: form,
    })
  },

  adminVerwijderMedia: (sleutel: string) =>
    verwijder<{ ok: boolean }>(`admin/media/${encodeURIComponent(sleutel)}`),

  adminTeam: () => verzoek<{ team: ApiTeamlid[] }>('admin/team'),

  adminMaakTeamlid: (invoer: { email: string; naam: string; rol: string; wachtwoord: string }) =>
    post<{ beheerder: ApiTeamlid }>('admin/team', invoer),

  adminVerwijderTeamlid: (email: string) =>
    verwijder<{ ok: boolean }>(`admin/team/${encodeURIComponent(email)}`),

  adminBerichten: () => verzoek<{ berichten: ApiBericht[] }>('admin/messages'),

  adminMarkeerBericht: (id: number, gelezen: boolean) =>
    patch<{ ok: boolean }>(`admin/messages/${id}`, { gelezen }),

  adminVerwijderBericht: (id: number) => verwijder<{ ok: boolean }>(`admin/messages/${id}`),

  adminOutbox: () => verzoek<{ mails: ApiMail[] }>('admin/outbox'),

  adminOpnieuw: (id: number) => post<{ ok: boolean }>(`admin/outbox/${id}/opnieuw`),

  adminMailStatus: () => verzoek<ApiMailStatus>('admin/mail/status'),

  adminMailTest: (aan: string) =>
    post<{ ok: boolean; aan: string; via: string; fout: string | null }>('admin/mail/test', { aan }),

  adminInstellingen: () => verzoek<{ instellingen: Record<string, string> }>('admin/settings'),
  adminZetInstellingen: (wijziging: Record<string, string>) =>
    patch<{ instellingen: Record<string, string> }>('admin/settings', wijziging),

  adminTeksten: () => verzoek<{ teksten: ApiTekst[]; vertalen: boolean }>('admin/texts'),

  adminZetTekst: (sleutel: string, nl: string) =>
    patch<{ tekst: ApiTekst }>(`admin/texts/${encodeURIComponent(sleutel)}`, { nl }),

  adminWisTekst: (sleutel: string) =>
    verwijder<{ ok: boolean }>(`admin/texts/${encodeURIComponent(sleutel)}`),

  adminVertaalTeksten: () =>
    post<{ vertaald: number; mislukt: number; openstaand: number; beschikbaar: boolean }>(
      'admin/texts/vertalen',
    ),

  adminMeldingen: () => verzoek<{ meldingen: ApiMeldingBeheer[] }>('admin/notices'),

  adminMaakMelding: (invoer: {
    nl: string
    soort: string
    actief?: boolean
    van?: string
    tot?: string
  }) => post<{ melding: ApiMeldingBeheer }>('admin/notices', invoer),

  adminWijzigMelding: (
    id: number,
    wijziging: Partial<{
      nl: string
      soort: string
      actief: boolean
      van: string
      tot: string
      volgorde: number
      vertaal: boolean
    }>,
  ) => patch<{ melding: ApiMeldingBeheer }>(`admin/notices/${id}`, wijziging),

  adminVerwijderMelding: (id: number) => verwijder<{ ok: boolean }>(`admin/notices/${id}`),

  adminData: () => verzoek<ApiDataOverzicht>('admin/data'),

  adminWisData: (wat: string, bevestig: string) =>
    post<{ ok: boolean; verwijderd: number }>('admin/data/verwijder', { wat, bevestig }),

  adminWisGast: (email: string, bevestig: string) =>
    post<{ ok: boolean; reserveringen: number; berichten: number; aanmeldingen: number }>(
      'admin/data/gast',
      { email, bevestig },
    ),
}

/* -------------------------------------------------------------------------- */
/* Token van een reservering lokaal bewaren (voor "mijn reservering")         */
/* -------------------------------------------------------------------------- */

const TOKEN_SLEUTEL = 'gw:token:'

export function bewaarToken(nummer: string, token: string) {
  try {
    localStorage.setItem(TOKEN_SLEUTEL + nummer, token)
  } catch {
    /* opslag geblokkeerd */
  }
}

export function leesToken(nummer: string): string {
  try {
    return localStorage.getItem(TOKEN_SLEUTEL + nummer) ?? ''
  } catch {
    return ''
  }
}
