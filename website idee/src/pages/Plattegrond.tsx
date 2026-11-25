import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import {
  START_ZONE,
  ZONE_IDS,
  type ProgrammaItem,
  type ZoneId,
} from '../data/plattegrond'
import { PlattegrondKaart } from '../components/plattegrond/Kaart'
import { PlattegrondPaneel } from '../components/plattegrond/Paneel'
import {
  aanmeldingSleutel,
  bewaarAanmeldingen,
  bewaarNaam,
  itemsVoor,
  leesAanmeldingen,
  leesNaam,
  maakSchema,
  type Aanmeldingen,
} from '../lib/plattegrond'

export function Plattegrond() {
  const { t, link } = useTaal()
  const { plattegrond } = t

  const [zone, setZone] = useState<ZoneId>(START_ZONE)
  const [dagIndex, setDagIndex] = useState(0)
  const [aanmeldingen, setAanmeldingen] = useState<Aanmeldingen>(() => leesAanmeldingen())
  const [naam, setNaam] = useState(() => leesNaam())
  const [melding, setMelding] = useState('')
  const paneel = useRef<HTMLElement | null>(null)

  const schema = useMemo(() => maakSchema(), [])
  const dag = schema.dagen[dagIndex] ?? null

  /** Het aantal activiteiten per plek op de gekozen dag: de gele bolletjes. */
  const aantallen = useMemo(() => {
    const uit = {} as Record<ZoneId, number>
    for (const id of ZONE_IDS) uit[id] = itemsVoor(id, dag).length
    return uit
  }, [dag])

  function activiteitTitel(item: ProgrammaItem): string {
    const alle = plattegrond.programma.activiteit as Record<string, { titel: string }>
    return alle[item.id]?.titel ?? item.id
  }

  function meld(tekst: string) {
    // Eerst leegmaken: zo leest een schermlezer ook een herhaalde melding opnieuw voor.
    setMelding('')
    window.setTimeout(() => setMelding(tekst), 60)
  }

  function kiesZone(id: ZoneId) {
    setZone(id)
    if (window.innerWidth > 1080) return
    // Op een smal scherm staat het paneel onder de kaart: breng het in beeld.
    window.requestAnimationFrame(() => {
      const el = paneel.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top > window.innerHeight - 80 || r.bottom < 0) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  function aanmelden(item: ProgrammaItem, iso: string, hoe: string, personen: number) {
    const sleutel = aanmeldingSleutel(item.id, iso)
    const nieuw = { ...aanmeldingen, [sleutel]: { naam: hoe, personen } }
    setAanmeldingen(nieuw)
    bewaarAanmeldingen(nieuw)
    bewaarNaam(hoe)
    setNaam(hoe)
    meld(
      (personen === 1 ? plattegrond.programma.aangemeld : plattegrond.programma.aangemeldMeer)
        .replace('{titel}', activiteitTitel(item))
        .replace('{aantal}', String(personen)),
    )
  }

  function afmelden(item: ProgrammaItem, iso: string) {
    const sleutel = aanmeldingSleutel(item.id, iso)
    const nieuw = { ...aanmeldingen }
    delete nieuw[sleutel]
    setAanmeldingen(nieuw)
    bewaarAanmeldingen(nieuw)
    meld(plattegrond.programma.afgemeld.replace('{titel}', activiteitTitel(item)))
  }

  return (
    <>
      <section className="paginakop paginakop--gras">
        <div className="container paginakop__binnen">
          <nav className="broodkruimel" aria-label="Kruimelpad">
            <Link to={link('home')}>{t.nav.home}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{t.nav.plattegrond}</span>
          </nav>
          <h1>{plattegrond.titel}</h1>
          <p className="lead">{plattegrond.intro}</p>
        </div>
      </section>

      <section className="sectie plattegrond-sectie" id="plattegrond">
        <div className="container">
          <div className="map-layout">
            <PlattegrondKaart zone={zone} onKies={kiesZone} aantallen={aantallen} />
            <PlattegrondPaneel
              ref={paneel}
              zone={zone}
              schema={schema}
              dagIndex={dagIndex}
              onDag={setDagIndex}
              aanmeldingen={aanmeldingen}
              naam={naam}
              onNaam={setNaam}
              onAanmelden={aanmelden}
              onAfmelden={afmelden}
            />
          </div>
        </div>
      </section>

      <p className="sr-only" aria-live="polite">
        {melding}
      </p>
    </>
  )
}
