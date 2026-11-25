import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { PLEKKEN, PRIJZEN, SEIZOEN, iso, nachten, type Plek, type Soort } from '../data/camping'
import { WOORDENBOEKEN, type Dict, type Lang } from '../i18n'
import { metOverschrijvingenAlle, type TekstOverschrijvingen } from '../lib/teksten'
import { api, type ApiConfig, type ApiEvent, type ApiFaciliteit } from '../lib/api'

export interface Gegevens {
  naam: string
  email: string
  telefoon: string
  adres: string
  postcode: string
  plaats: string
  land: string
  opmerking: string
  akkoord: boolean
}

export interface Concept {
  aankomst: string
  vertrek: string
  volwassenen: number
  kinderen: number
  soort: Soort | null
  wensen: string[]
  plek: string | null
  gegevens: Gegevens
}

export const LEEG_CONCEPT: Concept = {
  aankomst: '',
  vertrek: '',
  volwassenen: 2,
  kinderen: 0,
  soort: 'tent',
  wensen: [],
  plek: null,
  gegevens: {
    naam: '',
    email: '',
    telefoon: '',
    adres: '',
    postcode: '',
    plaats: '',
    land: 'Nederland',
    opmerking: '',
    akkoord: false,
  },
}

const SLEUTEL_CONCEPT = 'gw:concept'
const SLEUTEL_COOKIE = 'gw:cookie'
const SLEUTEL_RUST = 'gw:rust'
const SLEUTEL_MELDINGEN = 'gw:meldingen-weg'

function lees<T>(sleutel: string, terugval: T): T {
  try {
    const ruw = localStorage.getItem(sleutel)
    return ruw ? (JSON.parse(ruw) as T) : terugval
  } catch {
    return terugval
  }
}

function schrijf(sleutel: string, waarde: unknown) {
  try {
    localStorage.setItem(sleutel, JSON.stringify(waarde))
  } catch {
    /* opslag vol of geblokkeerd */
  }
}

function hoogseizoenPrijs(laag: number, soort: Soort): number {
  const tabel = PRIJZEN[soort]
  return laag + (tabel.hoog - tabel.laag)
}

interface AppWaarde {
  concept: Concept
  zetConcept: (wijziging: Partial<Concept>) => void
  zetGegevens: (wijziging: Partial<Gegevens>) => void
  resetConcept: () => void
  prijsVan: (concept: Concept) => number

  cookie: 'ja' | 'nee' | null
  zetCookie: (waarde: 'ja' | 'nee') => void
  rust: boolean
  zetRust: (waarde: boolean) => void
  /** Id's van meldingen die de bezoeker al heeft weggeklikt. */
  meldingenWeg: number[]
  sluitMelding: (id: number) => void

  config: ApiConfig | null
  /** De teksten zoals de eigenaar ze in het beheer heeft aangepast. */
  teksten: TekstOverschrijvingen
  /** De woordenboeken van de site, met die aanpassingen erin verwerkt. */
  woordenboeken: Record<Lang, Dict>
  plekken: Plek[]
  plek: (id: string) => Plek | undefined
  events: ApiEvent[]
  voorzieningen: ApiFaciliteit[]
  /** Per fotoplek de versie; leeg als er nog geen foto staat. */
  foto: Record<string, string>
  bezet: Record<string, string[]>
  isBezet: (plekId: string, dag: string) => boolean
  vrijePlekken: (van: string, tot: string) => string[]
  geladen: boolean
  fout: string
  ververs: () => Promise<void>
}

const AppContext = createContext<AppWaarde | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [concept, setConceptState] = useState<Concept>(() => lees(SLEUTEL_CONCEPT, LEEG_CONCEPT))
  const [cookie, setCookieState] = useState<'ja' | 'nee' | null>(() =>
    lees<'ja' | 'nee' | null>(SLEUTEL_COOKIE, null),
  )
  const [rust, setRustState] = useState<boolean>(() => lees<boolean>(SLEUTEL_RUST, false))
  const [meldingenWeg, setMeldingenWeg] = useState<number[]>(() =>
    lees<number[]>(SLEUTEL_MELDINGEN, []),
  )

  const [config, setConfig] = useState<ApiConfig | null>(null)
  const [teksten, setTeksten] = useState<TekstOverschrijvingen>({})
  const [plekken, setPlekken] = useState<Plek[]>(PLEKKEN)
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [voorzieningen, setVoorzieningen] = useState<ApiFaciliteit[]>([])
  const [foto, setFoto] = useState<Record<string, string>>({})
  const [bezet, setBezet] = useState<Record<string, string[]>>({})
  const [geladen, setGeladen] = useState(false)
  const [fout, setFout] = useState('')
  const bezig = useRef(false)

  useEffect(() => {
    document.documentElement.dataset.rust = rust ? 'aan' : 'uit'
  }, [rust])

  const ververs = useCallback(async () => {
    if (bezig.current) return
    bezig.current = true
    try {
      const van = iso(SEIZOEN.start)
      const eind = new Date(SEIZOEN.eind)
      eind.setDate(eind.getDate() + 1)
      const tot = iso(eind)

      const [cfg, tekstenLijst, plekLijst, beschikbaar, eventLijst, faciliteiten, fotoLijst] =
        await Promise.all([
          api.config(),
          // De eigen teksten zijn een extraatje: valt dat weg, dan gebruikt de
          // site gewoon de teksten uit de code.
          api.teksten().catch(() => ({ teksten: {} })),
          api.plekken(),
          api.beschikbaarheid(van, tot),
          api.events(),
          api.voorzieningen(),
          api.foto(),
        ])

      setConfig(cfg)
      setTeksten(tekstenLijst.teksten)
      setPlekken(
        plekLijst.plekken.map((p) => ({
          ...p,
          soort: p.soort as Soort,
          weide: p.weide as Plek['weide'],
          ondergrond: p.ondergrond as Plek['ondergrond'],
          vlak: p.vlak as Plek['vlak'],
          status: p.status as Plek['status'],
        })),
      )
      setBezet(beschikbaar.bezet)
      setEvents(eventLijst.events)
      setVoorzieningen(faciliteiten.voorzieningen)
      setFoto(fotoLijst.foto)
      setFout('')
    } catch (e) {
      setFout(e instanceof Error ? e.message : 'Kon de gegevens niet laden.')
    } finally {
      bezig.current = false
      setGeladen(true)
    }
  }, [])

  useEffect(() => {
    void ververs()
  }, [ververs])

  const plek = useCallback((id: string) => plekken.find((p) => p.id === id), [plekken])

  const isBezet = useCallback(
    (plekId: string, dag: string) => (bezet[dag] ?? []).includes(plekId),
    [bezet],
  )

  const vrijePlekken = useCallback(
    (van: string, tot: string) => {
      if (!van || !tot || tot <= van) {
        return plekken.filter((p) => p.status === 'open').map((p) => p.id)
      }
      return plekken
        .filter((p) => {
          if (p.status !== 'open') return false
          const d = new Date(`${van}T00:00:00Z`)
          const eind = new Date(`${tot}T00:00:00Z`)
          while (d < eind) {
            if (isBezet(p.id, d.toISOString().slice(0, 10))) return false
            d.setUTCDate(d.getUTCDate() + 1)
          }
          return true
        })
        .map((p) => p.id)
    },
    [plekken, isBezet],
  )

  const prijsVan = useCallback(
    (c: Concept) => {
      if (!c.plek || !c.aankomst || !c.vertrek) return 0
      const p = plek(c.plek)
      if (!p) return 0
      const aantal = nachten(c.aankomst, c.vertrek)
      if (aantal <= 0) return 0

      let som = 0
      const d = new Date(`${c.aankomst}T00:00:00Z`)
      for (let i = 0; i < aantal; i += 1) {
        const maand = d.getUTCMonth()
        const hoog = maand === 6 || maand === 7
        som += hoog ? hoogseizoenPrijs(p.prijs, p.soort) : p.prijs
        d.setUTCDate(d.getUTCDate() + 1)
      }

      const personen = c.volwassenen + c.kinderen
      som += personen * PRIJZEN.toeristenbelasting * aantal
      if (p.soort === 'safaritent') som += PRIJZEN.schoonmaakSafaritent
      if (personen > 2) som += (personen - 2) * PRIJZEN.extraPersoon * aantal
      return Math.round(som)
    },
    [plek],
  )

  const zetConcept = useCallback((wijziging: Partial<Concept>) => {
    setConceptState((huidig) => {
      const nieuw = { ...huidig, ...wijziging }
      schrijf(SLEUTEL_CONCEPT, nieuw)
      return nieuw
    })
  }, [])

  const zetGegevens = useCallback((wijziging: Partial<Gegevens>) => {
    setConceptState((huidig) => {
      const nieuw = { ...huidig, gegevens: { ...huidig.gegevens, ...wijziging } }
      schrijf(SLEUTEL_CONCEPT, nieuw)
      return nieuw
    })
  }, [])

  const resetConcept = useCallback(() => {
    setConceptState(LEEG_CONCEPT)
    schrijf(SLEUTEL_CONCEPT, LEEG_CONCEPT)
  }, [])

  const zetCookie = useCallback((waarde: 'ja' | 'nee') => {
    setCookieState(waarde)
    schrijf(SLEUTEL_COOKIE, waarde)
  }, [])

  const zetRust = useCallback((waarde: boolean) => {
    setRustState(waarde)
    schrijf(SLEUTEL_RUST, waarde)
  }, [])

  const sluitMelding = useCallback((id: number) => {
    setMeldingenWeg((huidig) => {
      if (huidig.includes(id)) return huidig
      const nieuw = [...huidig, id]
      schrijf(SLEUTEL_MELDINGEN, nieuw)
      return nieuw
    })
  }, [])

  const woordenboeken = useMemo(
    () => metOverschrijvingenAlle(WOORDENBOEKEN, teksten),
    [teksten],
  )

  const waarde = useMemo<AppWaarde>(
    () => ({
      concept,
      zetConcept,
      zetGegevens,
      resetConcept,
      prijsVan,
      cookie,
      zetCookie,
      rust,
      zetRust,
      meldingenWeg,
      sluitMelding,
      config,
      teksten,
      woordenboeken,
      plekken,
      plek,
      events,
      voorzieningen,
      foto,
      bezet,
      isBezet,
      vrijePlekken,
      geladen,
      fout,
      ververs,
    }),
    [
      concept,
      zetConcept,
      zetGegevens,
      resetConcept,
      prijsVan,
      cookie,
      zetCookie,
      rust,
      zetRust,
      meldingenWeg,
      sluitMelding,
      config,
      teksten,
      woordenboeken,
      plekken,
      plek,
      events,
      voorzieningen,
      foto,
      bezet,
      isBezet,
      vrijePlekken,
      geladen,
      fout,
      ververs,
    ],
  )

  return <AppContext.Provider value={waarde}>{children}</AppContext.Provider>
}

export function useApp(): AppWaarde {
  const waarde = useContext(AppContext)
  if (!waarde) throw new Error('useApp moet binnen een AppProvider staan')
  return waarde
}
