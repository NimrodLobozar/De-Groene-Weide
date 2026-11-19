import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { BOEK_SOORT, ZONES, type ProgrammaItem, type ZoneId } from '../../data/plattegrond'
import { useTaal } from '../../i18n/context'
import { Icoon } from '../Icoon'
import { useApp } from '../../store/App'
import {
  aanmeldingSleutel,
  beginVanDag,
  bezetDoorAnderen,
  itemsVoor,
  naarIso,
  telDagenOp,
  tijdStatus,
  zoneHeeftProgramma,
  zelfdeDag,
  type Aanmeldingen,
  type Schema,
} from '../../lib/plattegrond'
import { ErfTekening } from './Kaart'

const MAX_PERSONEN = 6

interface Props {
  zone: ZoneId
  schema: Schema
  dagIndex: number
  onDag: (index: number) => void
  aanmeldingen: Aanmeldingen
  naam: string
  onNaam: (naam: string) => void
  onAanmelden: (item: ProgrammaItem, iso: string, naam: string, personen: number) => void
  onAfmelden: (item: ProgrammaItem, iso: string) => void
  ref?: Ref<HTMLElement>
}

export function PlattegrondPaneel({
  ref,
  zone,
  schema,
  dagIndex,
  onDag,
  aanmeldingen,
  naam,
  onNaam,
  onAanmelden,
  onAfmelden,
}: Props) {
  const { t, taal, link } = useTaal()
  const { foto, zetConcept } = useApp()
  const { plattegrond } = t

  const meta = ZONES[zone]
  const boek = meta.boek
  const tekst = plattegrond.zones[zone]
  const dag = schema.dagen[dagIndex] ?? null
  const iso = dag ? naarIso(dag) : ''
  const vandaag = beginVanDag(new Date())

  /* De foto uit het beheer; zonder foto zoomt het paneel in op de kaart zelf. */
  const versie = foto[meta.foto]
  const [mislukt, setMislukt] = useState<Record<string, boolean>>({})
  const toonFoto = Boolean(versie) && !mislukt[meta.foto]
  const fotoBron = versie ? `/api/media/${encodeURIComponent(meta.foto)}?v=${encodeURIComponent(versie)}` : ''

  /* Welk aanmeldformulier er openstaat. */
  const [open, setOpen] = useState<string | null>(null)
  const [invoerNaam, setInvoerNaam] = useState(naam)
  const [fout, setFout] = useState('')
  const [focusDoel, setFocusDoel] = useState<string | null>(null)
  const lijst = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    setOpen(null)
    setFout('')
  }, [zone, dagIndex])

  useEffect(() => {
    setInvoerNaam(naam)
  }, [naam])

  useEffect(() => {
    if (!focusDoel) return
    const knop = lijst.current?.querySelector<HTMLElement>(`[data-focus="${focusDoel}"]`)
    if (knop) knop.focus()
    setFocusDoel(null)
  }, [focusDoel, aanmeldingen])

  const heeftProgramma = zoneHeeftProgramma(zone)
  const items = itemsVoor(zone, dag)

  function dagLabel(d: Date): string {
    if (zelfdeDag(d, vandaag)) return plattegrond.programma.vandaag
    if (zelfdeDag(d, telDagenOp(vandaag, 1))) return plattegrond.programma.morgen
    const label = new Intl.DateTimeFormat(taal, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(d)
    return label.charAt(0).toUpperCase() + label.slice(1)
  }

  function leegZin(d: Date): string {
    if (zelfdeDag(d, vandaag)) return plattegrond.programma.leegVandaag
    if (zelfdeDag(d, telDagenOp(vandaag, 1))) return plattegrond.programma.leegMorgen
    const lang = new Intl.DateTimeFormat(taal, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(d)
    return plattegrond.programma.leegOp.replace('{datum}', lang)
  }

  function programmaTekst(item: ProgrammaItem) {
    const alle = plattegrond.programma.activiteit as Record<string, { titel: string; detail: string }>
    return alle[item.id] ?? { titel: item.id, detail: '' }
  }

  function rij(item: ProgrammaItem) {
    const activiteit = programmaTekst(item)
    const sleutel = aanmeldingSleutel(item.id, iso)
    const mijn = aanmeldingen[sleutel]
    const status = dag ? tijdStatus(item, dag) : 'open'
    const vrij = Math.max(0, item.spots - bezetDoorAnderen(item, iso) - (mijn?.personen ?? 0))
    const veldId = `prog-${item.id}-${iso}`.replace(/[^a-z0-9-]/gi, '-')

    function verstuur(event: FormEvent) {
      event.preventDefault()
      const schoon = invoerNaam.trim()
      if (schoon.length < 2) {
        setFout(plattegrond.programma.foutNaam)
        return
      }
      const select = (event.target as HTMLFormElement).querySelector('select')
      const personen = Number(select?.value ?? 1) || 1
      onAanmelden(item, iso, schoon, personen)
      onNaam(schoon)
      setOpen(null)
      setFout('')
      setFocusDoel(`${sleutel}|af`)
    }

    function sluit() {
      setOpen(null)
      setFout('')
      setFocusDoel(`${sleutel}|aan`)
    }

    function escape(event: KeyboardEvent<HTMLFormElement>) {
      if (event.key === 'Escape') {
        event.preventDefault()
        sluit()
      }
    }

    const vrijTekst =
      vrij === 1
        ? plattegrond.programma.vrij.replace('{aantal}', '1')
        : plattegrond.programma.vrijMeer.replace('{aantal}', String(vrij))

    return (
      <li key={sleutel} className="prog">
        <div className="prog-time">
          <strong>{item.start}</strong>
          <span>{plattegrond.programma.tot.replace('{tijd}', item.end)}</span>
        </div>
        <div className="prog-body">
          <strong className="prog-title">{activiteit.titel}</strong>
          {activiteit.detail ? <span className="prog-detail">{activiteit.detail}</span> : null}

          {mijn ? (
            <>
              <p className="prog-mine">
                <Icoon naam="vink" maat={14} />
                {mijn.personen === 1
                  ? plattegrond.programma.jeStaatErOp.replace('{aantal}', '1')
                  : plattegrond.programma.jeStaatErOpMeer.replace('{aantal}', String(mijn.personen))}
              </p>
              {status === 'open' ? (
                <button
                  type="button"
                  className="prog-link"
                  data-focus={`${sleutel}|af`}
                  onClick={() => onAfmelden(item, iso)}
                >
                  {plattegrond.programma.afmelden}
                </button>
              ) : null}
            </>
          ) : status !== 'open' ? (
            <span className="prog-spots is-closed">
              {status === 'bezig' ? plattegrond.programma.bezig : plattegrond.programma.afgelopen}
            </span>
          ) : vrij === 0 ? (
            <span className="prog-spots is-full">{plattegrond.programma.vol}</span>
          ) : open === sleutel ? (
            <>
              <span className="prog-spots">{vrijTekst}</span>
              <form className="prog-form" noValidate onSubmit={verstuur} onKeyDown={escape}>
                <div className="prog-form-row">
                  <div className="prog-field">
                    <label htmlFor={`${veldId}-naam`}>{plattegrond.programma.naam}</label>
                    <input
                      id={`${veldId}-naam`}
                      name="naam"
                      type="text"
                      autoComplete="name"
                      value={invoerNaam}
                      aria-invalid={fout ? true : undefined}
                      aria-describedby={fout ? `${veldId}-fout` : undefined}
                      onChange={(e) => setInvoerNaam(e.target.value)}
                    />
                  </div>
                  <div className="prog-field">
                    <label htmlFor={`${veldId}-personen`}>{plattegrond.programma.personen}</label>
                    <select id={`${veldId}-personen`} name="personen" defaultValue="1">
                      {Array.from({ length: Math.min(MAX_PERSONEN, vrij) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {fout ? (
                  <p className="prog-error" id={`${veldId}-fout`} role="alert">
                    {fout}
                  </p>
                ) : null}
                <div className="prog-form-actions">
                  <button className="prog-btn" type="submit">
                    {plattegrond.programma.bevestig}
                  </button>
                  <button className="prog-link" type="button" onClick={sluit}>
                    {plattegrond.programma.annuleer}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <span className="prog-spots">{vrijTekst}</span>
              <button
                type="button"
                className="prog-btn"
                data-focus={`${sleutel}|aan`}
                aria-label={plattegrond.programma.aanmeldenVoor.replace('{titel}', activiteit.titel)}
                onClick={() => {
                  setOpen(sleutel)
                  setFout('')
                  setInvoerNaam(naam)
                }}
              >
                {plattegrond.programma.aanmelden}
              </button>
            </>
          )}
        </div>
      </li>
    )
  }

  return (
    <aside className="map-panel" ref={ref} aria-label={plattegrond.kaart.paneelLabel}>
      <figure className="map-photo">
        <div className="map-photo-art" style={{ display: toonFoto ? 'none' : undefined }}>
          <ErfTekening zone={zone} />
        </div>
        {toonFoto ? (
          <img
            className="map-photo-img"
            src={fotoBron}
            alt={plattegrond.fotoAlt.replace('{plek}', tekst.titel)}
            onError={() => setMislukt((huidig) => ({ ...huidig, [meta.foto]: true }))}
          />
        ) : null}
      </figure>

      <p className="map-panel-tag">{tekst.tag}</p>
      <h2 className="map-panel-titel">{tekst.titel}</h2>
      <p className="map-panel-tekst">{tekst.tekst}</p>

      {heeftProgramma ? (
        <div className="map-program">
          <h3 className="map-panel-sub">{plattegrond.programma.kop}</h3>
          {schema.voorbeeld && schema.dagen[0] ? (
            <p className="map-program-note">
              {plattegrond.programma.dicht.replace(
                '{datum}',
                new Intl.DateTimeFormat(taal, { day: 'numeric', month: 'long' }).format(schema.dagen[0]),
              )}
            </p>
          ) : null}
          <div className="map-days" role="group" aria-label={plattegrond.programma.dagKies}>
            {schema.dagen.map((d, index) => (
              <button
                key={d.toISOString()}
                type="button"
                className="map-day"
                aria-pressed={index === dagIndex}
                onClick={() => onDag(index)}
              >
                {dagLabel(d)}
              </button>
            ))}
          </div>
          <ul className="map-program-list" ref={lijst}>
            {items.length && dag ? (
              items.map((item) => rij(item))
            ) : (
              <li className="prog-empty">{dag ? leegZin(dag) : ''}</li>
            )}
          </ul>
          <p className="map-program-demo">{plattegrond.programma.demo}</p>
        </div>
      ) : null}

      {tekst.doen.length ? (
        <>
          <h3 className="map-panel-sub">{plattegrond.doenKop}</h3>
          <ul className="map-acts">
            {tekst.doen.map((regel, index) => (
              <li key={regel.titel}>
                <span className="map-act-icon">
                  <Icoon naam={meta.iconen[index] ?? 'vink'} maat={19} />
                </span>
                <span className="map-act-body">
                  <strong>{regel.titel}</strong>
                  {regel.detail ? <span className="map-act-detail">{regel.detail}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {tekst.feiten.length ? (
        <>
          <h3 className="map-panel-sub">{plattegrond.feitenKop}</h3>
          <ul className="check-list">
            {tekst.feiten.map((feit) => (
              <li key={feit}>
                <Icoon naam="vink" maat={16} />
                {feit}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {boek ? (
        <Link
          className="knop knop--eigel map-cta"
          to={link('reserveren')}
          data-select-type={boek}
          onClick={() => zetConcept({ soort: BOEK_SOORT[boek] })}
        >
          {plattegrond.cta[boek]}
        </Link>
      ) : null}
    </aside>
  )
}
