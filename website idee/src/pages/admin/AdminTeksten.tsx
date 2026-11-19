/**
 * Beheer van de teksten: alle teksten van de site, de meldingen bovenaan en de
 * grap van de dag. Alles wordt in het Nederlands ingevuld; het Engels en Duits
 * komen van Lara Translate (zie worker/vertaler.ts).
 */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../../i18n/context'
import { api, ApiFout, type ApiMeldingBeheer, type ApiTekst } from '../../lib/api'
import { Kop, Veld, useMelding } from './bouwstenen'

const GRAP_SLEUTEL = 'home.hero.grap'
/** Zoveel teksten staan er standaard in de lijst; de rest op verzoek. */
const ZICHTBAAR = 25

function vandaagIso(): string {
  return new Date().toISOString().slice(0, 10)
}

type Soort = ApiMeldingBeheer['soort']

/* -------------------------------------------------------------------------- */
/* Alle teksten                                                               */
/* -------------------------------------------------------------------------- */

export function Teksten() {
  const { t } = useTaal()
  const ui = t.admin.teksten
  const { fout, goed, setFout, setGoed } = useMelding()

  const [rijen, setRijen] = useState<ApiTekst[]>([])
  const [kanVertalen, setKanVertalen] = useState(false)
  const [laden, setLaden] = useState(true)
  const [zoek, setZoek] = useState('')
  const [groep, setGroep] = useState('')
  const [aantal, setAantal] = useState(ZICHTBAAR)
  const [bewerkt, setBewerkt] = useState<Record<string, string>>({})
  const [bezig, setBezig] = useState('')
  const [bulkBezig, setBulkBezig] = useState(false)

  useEffect(() => {
    let levend = true
    api
      .adminTeksten()
      .then((r) => {
        if (!levend) return
        setRijen(r.teksten)
        setKanVertalen(r.vertalen)
      })
      .catch((e) => {
        if (levend) setFout(e instanceof ApiFout ? e.message : 'De teksten konden niet geladen worden.')
      })
      .finally(() => {
        if (levend) setLaden(false)
      })
    return () => {
      levend = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const groepen = useMemo(
    () => [...new Set(rijen.map((rij) => rij.sleutel.split('.')[0]))].sort(),
    [rijen],
  )

  const gezocht = zoek.trim().toLowerCase()
  const gefilterd = useMemo(
    () =>
      rijen.filter((rij) => {
        if (groep && rij.sleutel.split('.')[0] !== groep) return false
        if (!gezocht) return true
        return (
          rij.sleutel.toLowerCase().includes(gezocht) ||
          rij.nl.toLowerCase().includes(gezocht) ||
          rij.en.toLowerCase().includes(gezocht) ||
          rij.de.toLowerCase().includes(gezocht)
        )
      }),
    [rijen, groep, gezocht],
  )

  const aangepast = rijen.filter((rij) => rij.bijgewerkt !== '').length
  const ontbreekt = rijen.filter((rij) => rij.bijgewerkt !== '' && (!rij.en || !rij.de)).length

  const bewaar = async (rij: ApiTekst) => {
    const waarde = (bewerkt[rij.sleutel] ?? rij.nl).trim()
    setBezig(rij.sleutel)
    setGoed('')
    setFout('')
    try {
      const { tekst } = await api.adminZetTekst(rij.sleutel, waarde)
      setRijen((huidig) => huidig.map((r) => (r.sleutel === rij.sleutel ? { ...r, ...tekst } : r)))
      setBewerkt((huidig) => {
        const kopie = { ...huidig }
        delete kopie[rij.sleutel]
        return kopie
      })
      setGoed(tekst.en && tekst.de ? ui.bewaard : ui.bewaardZonder)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Opslaan mislukte.')
    } finally {
      setBezig('')
    }
  }

  const herstel = async (rij: ApiTekst) => {
    setBezig(rij.sleutel)
    setGoed('')
    setFout('')
    try {
      await api.adminWisTekst(rij.sleutel)
      setRijen((huidig) =>
        huidig.map((r) =>
          r.sleutel === rij.sleutel
            ? { ...r, nl: r.standaard, en: '', de: '', vertaald: '', bijgewerkt: '' }
            : r,
        ),
      )
      setBewerkt((huidig) => {
        const kopie = { ...huidig }
        delete kopie[rij.sleutel]
        return kopie
      })
      setGoed(ui.hersteld)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Terugzetten mislukte.')
    } finally {
      setBezig('')
    }
  }

  const vertaalAlles = async () => {
    setBulkBezig(true)
    setGoed('')
    setFout('')
    try {
      const uitkomst = await api.adminVertaalTeksten()
      const { teksten, vertalen } = await api.adminTeksten()
      setRijen(teksten)
      setKanVertalen(vertalen)
      setGoed(
        `${ui.vertaalKlaar.replace('{aantal}', String(uitkomst.vertaald))} ${ui.vertaalOpen.replace(
          '{aantal}',
          String(uitkomst.openstaand),
        )}`,
      )
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Vertalen mislukte.')
    } finally {
      setBulkBezig(false)
    }
  }

  if (laden) return <p className="kaart__tekst">Even laden…</p>

  return (
    <>
      <Kop
        titel={ui.titel}
        intro={ui.intro}
        actie={
          ontbreekt > 0 && kanVertalen ? (
            <button type="button" className="knop knop--klein" disabled={bulkBezig} onClick={() => void vertaalAlles()}>
              {ui.vertaalAlles}
            </button>
          ) : undefined
        }
      />

      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}
      {!kanVertalen ? <p className="kaart__tekst">{ui.geenVertaler}</p> : null}

      <div className="beheer__filters teksten__filters">
        <Veld label={ui.zoeken} breed>
          <input
            type="search"
            value={zoek}
            onChange={(e) => {
              setZoek(e.target.value)
              setAantal(ZICHTBAAR)
            }}
            placeholder={ui.zoeken}
          />
        </Veld>
        <Veld label={ui.onderdeel}>
          <select
            value={groep}
            onChange={(e) => {
              setGroep(e.target.value)
              setAantal(ZICHTBAAR)
            }}
          >
            <option value="">{ui.alles}</option>
            {groepen.map((naam) => (
              <option key={naam} value={naam}>
                {naam}
              </option>
            ))}
          </select>
        </Veld>
      </div>

      <p className="kaart__tekst teksten__telling">
        {ui.aantal.replace('{aantal}', String(gefilterd.length))} · {aangepast} {ui.aangepast.toLowerCase()}
        {ontbreekt > 0 ? ` · ${ontbreekt} ${ui.mist.toLowerCase()}` : ''}
        {' · '}
        {ui.leeg}
      </p>
      {kanVertalen && ontbreekt > 0 ? <p className="kaart__tekst">{ui.vertaalUitleg}</p> : null}

      {gefilterd.length === 0 ? (
        <p className="kaart__tekst">{ui.geen}</p>
      ) : (
        <div className="teksten__lijst">
          {gefilterd.slice(0, aantal).map((rij) => {
            const waarde = bewerkt[rij.sleutel] ?? rij.nl
            const isBezig = bezig === rij.sleutel
            // Zonder aanpassing toont de site de vertaling uit de code.
            const engels = rij.bijgewerkt ? rij.en : rij.standaardEn
            const duits = rij.bijgewerkt ? rij.de : rij.standaardDe
            return (
              <article key={rij.sleutel} className="beheerpaneel tekstrij">
                <header className="tekstrij__kop">
                  <code className="tekstrij__sleutel">{rij.sleutel}</code>
                  {rij.bijgewerkt ? <span className="label label--eigel">{ui.aangepast}</span> : null}
                  {rij.bijgewerkt && (!rij.en || !rij.de) ? (
                    <span className="label label--oranje">{ui.mist}</span>
                  ) : null}
                </header>

                <textarea
                  className="tekstrij__veld"
                  rows={Math.min(6, Math.max(2, Math.ceil(waarde.length / 70)))}
                  value={waarde}
                  onChange={(e) => setBewerkt((huidig) => ({ ...huidig, [rij.sleutel]: e.target.value }))}
                />

                <div className="tekstrij__talen">
                  <p>
                    <strong>EN</strong> {engels || <em>{ui.mist}</em>}
                  </p>
                  <p>
                    <strong>DE</strong> {duits || <em>{ui.mist}</em>}
                  </p>
                </div>

                <div className="beheer__pijlen">
                  <button
                    type="button"
                    className="knop knop--klein"
                    disabled={isBezig}
                    onClick={() => void bewaar(rij)}
                  >
                    {ui.opslaan}
                  </button>
                  {rij.bijgewerkt ? (
                    <button
                      type="button"
                      className="knop knop--klein knop--secundair"
                      disabled={isBezig}
                      onClick={() => void herstel(rij)}
                    >
                      {ui.herstel}
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {gefilterd.length > aantal ? (
        <button type="button" className="knop knop--secundair" onClick={() => setAantal((n) => n + ZICHTBAAR)}>
          {ui.meer}
        </button>
      ) : null}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Meldingen bovenaan de site                                                 */
/* -------------------------------------------------------------------------- */

interface MeldingForm {
  nl: string
  soort: Soort
  van: string
  tot: string
  actief: boolean
}

const LEEG_MELDING: MeldingForm = { nl: '', soort: 'mededeling', van: '', tot: '', actief: true }

function meldingStand(melding: ApiMeldingBeheer): 'uit' | 'loopt' | 'gepland' | 'verlopen' {
  if (!melding.actief) return 'uit'
  const dag = vandaagIso()
  if (melding.van && melding.van > dag) return 'gepland'
  if (melding.tot && melding.tot < dag) return 'verlopen'
  return 'loopt'
}

function labelKleur(stand: 'uit' | 'loopt' | 'gepland' | 'verlopen'): string {
  if (stand === 'loopt') return 'label--eigel'
  if (stand === 'gepland') return 'label--oranje'
  return 'label--grijs'
}

export function Meldingen() {
  const { t } = useTaal()
  const ui = t.admin.meldingen
  const { fout, goed, setFout, setGoed } = useMelding()

  const [lijst, setLijst] = useState<ApiMeldingBeheer[]>([])
  const [laden, setLaden] = useState(true)
  const [form, setForm] = useState<MeldingForm>(LEEG_MELDING)
  const [bewerkId, setBewerkId] = useState<number | null>(null)
  const [bezig, setBezig] = useState(false)

  useEffect(() => {
    let levend = true
    api
      .adminMeldingen()
      .then((r) => {
        if (levend) setLijst(r.meldingen)
      })
      .catch((e) => {
        if (levend) setFout(e instanceof ApiFout ? e.message : 'De meldingen konden niet geladen worden.')
      })
      .finally(() => {
        if (levend) setLaden(false)
      })
    return () => {
      levend = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bewaar = async () => {
    if (!form.nl.trim()) {
      setFout(ui.tekst)
      return
    }
    setBezig(true)
    setGoed('')
    setFout('')
    try {
      const { melding } =
        bewerkId === null
          ? await api.adminMaakMelding({
              nl: form.nl,
              soort: form.soort,
              actief: form.actief,
              van: form.van,
              tot: form.tot,
            })
          : await api.adminWijzigMelding(bewerkId, {
              nl: form.nl,
              soort: form.soort,
              actief: form.actief,
              van: form.van,
              tot: form.tot,
            })

      setLijst((huidig) =>
        huidig.some((m) => m.id === melding.id)
          ? huidig.map((m) => (m.id === melding.id ? melding : m))
          : [...huidig, melding],
      )
      setGoed(melding.en && melding.de ? ui.bewaard : ui.bewaardZonder)
      setForm(LEEG_MELDING)
      setBewerkId(null)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Opslaan mislukte.')
    } finally {
      setBezig(false)
    }
  }

  const wijzigVeld = (wijziging: Partial<MeldingForm>) => setForm((huidig) => ({ ...huidig, ...wijziging }))

  const beginBewerken = (melding: ApiMeldingBeheer) => {
    setBewerkId(melding.id)
    setForm({
      nl: melding.nl,
      soort: melding.soort,
      van: melding.van,
      tot: melding.tot,
      actief: melding.actief === 1,
    })
    setGoed('')
    setFout('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const vertaalMelding = async (melding: ApiMeldingBeheer) => {
    setFout('')
    setGoed('')
    try {
      const { melding: bijgewerkt } = await api.adminWijzigMelding(melding.id, { vertaal: true })
      setLijst((huidig) => huidig.map((m) => (m.id === bijgewerkt.id ? bijgewerkt : m)))
      setGoed(bijgewerkt.en && bijgewerkt.de ? ui.bewaard : ui.bewaardZonder)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Vertalen mislukte.')
    }
  }

  const zetActief = async (melding: ApiMeldingBeheer, actief: boolean) => {
    setFout('')
    try {
      const { melding: bijgewerkt } = await api.adminWijzigMelding(melding.id, { actief })
      setLijst((huidig) => huidig.map((m) => (m.id === bijgewerkt.id ? bijgewerkt : m)))
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Wijzigen mislukte.')
    }
  }

  const verwijder = async (melding: ApiMeldingBeheer) => {
    if (!window.confirm(ui.verwijderBevestig)) return
    setFout('')
    try {
      await api.adminVerwijderMelding(melding.id)
      setLijst((huidig) => huidig.filter((m) => m.id !== melding.id))
      if (bewerkId === melding.id) {
        setBewerkId(null)
        setForm(LEEG_MELDING)
      }
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Verwijderen mislukte.')
    }
  }

  if (laden) return <p className="kaart__tekst">Even laden…</p>

  return (
    <>
      <Kop titel={ui.titel} intro={ui.intro} />

      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}

      <form
        className="beheerpaneel formulier"
        onSubmit={(e) => {
          e.preventDefault()
          void bewaar()
        }}
      >
        <h2 className="beheerpaneel__kop">{bewerkId === null ? ui.nieuw : ui.wijzigen}</h2>
        <div className="formulier__velden">
          <Veld label={ui.tekst} breed>
            <textarea
              rows={3}
              value={form.nl}
              onChange={(e) => wijzigVeld({ nl: e.target.value })}
              placeholder="Het zwembad is vandaag gesloten wegens onderhoud."
            />
          </Veld>
          <Veld label={ui.soort}>
            <select value={form.soort} onChange={(e) => wijzigVeld({ soort: e.target.value as Soort })}>
              {(Object.keys(ui.soorten) as Soort[]).map((soort) => (
                <option key={soort} value={soort}>
                  {ui.soorten[soort]}
                </option>
              ))}
            </select>
          </Veld>
          <Veld label={ui.vanaf}>
            <input type="date" value={form.van} onChange={(e) => wijzigVeld({ van: e.target.value })} />
          </Veld>
          <Veld label={ui.tot}>
            <input type="date" value={form.tot} onChange={(e) => wijzigVeld({ tot: e.target.value })} />
          </Veld>
          <label className="checkveld">
            <input
              type="checkbox"
              checked={form.actief}
              onChange={(e) => wijzigVeld({ actief: e.target.checked })}
            />
            <span>{ui.actief}</span>
          </label>
        </div>

        <div className="meldingvoorbeeld">
          <span className="meldingvoorbeeld__label">{ui.voorbeeld}</span>
          <div className={`aankondiging aankondiging--${form.soort}`}>
            <div className="aankondiging__binnen">
              <span>{form.nl.trim() || '…'}</span>
            </div>
          </div>
        </div>

        <div className="beheer__pijlen">
          <button type="submit" className="knop knop--klein" disabled={bezig}>
            {bewerkId === null ? ui.plaatsen : ui.bewaren}
          </button>
          {bewerkId !== null ? (
            <button
              type="button"
              className="knop knop--klein knop--secundair"
              onClick={() => {
                setBewerkId(null)
                setForm(LEEG_MELDING)
              }}
            >
              {ui.annuleer}
            </button>
          ) : null}
        </div>
      </form>

      {lijst.length === 0 ? (
        <p className="kaart__tekst">{ui.geen}</p>
      ) : (
        <div className="meldingen__lijst">
          {lijst.map((melding) => {
            const stand = meldingStand(melding)
            return (
              <article key={melding.id} className="beheerpaneel meldingrij">
                <header className="meldingrij__kop">
                  <span className={`label ${labelKleur(stand)}`}>{ui[stand]}</span>
                  <span className="label">{ui.soorten[melding.soort]}</span>
                  <span className="tekst-zacht meldingrij__datums">
                    {melding.van || '—'} → {melding.tot || '—'}
                  </span>
                </header>
                <p className="meldingrij__tekst">{melding.nl}</p>
                <p className="meldingrij__taal">
                  <strong>EN</strong> {melding.en || <em>{t.admin.teksten.mist}</em>}
                </p>
                <p className="meldingrij__taal">
                  <strong>DE</strong> {melding.de || <em>{t.admin.teksten.mist}</em>}
                </p>
                <div className="beheer__pijlen">
                  <button type="button" className="knop knop--klein" onClick={() => beginBewerken(melding)}>
                    {ui.wijzigen}
                  </button>
                  {!melding.en || !melding.de ? (
                    <button
                      type="button"
                      className="knop knop--klein knop--secundair"
                      onClick={() => void vertaalMelding(melding)}
                    >
                      {ui.vertaal}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void zetActief(melding, melding.actief !== 1)}
                  >
                    {melding.actief === 1 ? ui.uitzetten : ui.aanzetten}
                  </button>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void verwijder(melding)}
                  >
                    {ui.verwijderen}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <p className="kaart__tekst">{ui.anoniem}</p>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Grap van de dag                                                            */
/* -------------------------------------------------------------------------- */

export function Grap() {
  const { t, link } = useTaal()
  const ui = t.admin.grap
  const { fout, goed, setFout, setGoed } = useMelding()

  const [rij, setRij] = useState<ApiTekst | null>(null)
  const [tekst, setTekst] = useState('')
  const [laden, setLaden] = useState(true)
  const [bezig, setBezig] = useState(false)

  useEffect(() => {
    let levend = true
    api
      .adminTeksten()
      .then((r) => {
        if (!levend) return
        const gevonden = r.teksten.find((item) => item.sleutel === GRAP_SLEUTEL) ?? null
        setRij(gevonden)
        setTekst(gevonden?.nl ?? '')
      })
      .catch((e) => {
        if (levend) setFout(e instanceof ApiFout ? e.message : 'De grap kon niet geladen worden.')
      })
      .finally(() => {
        if (levend) setLaden(false)
      })
    return () => {
      levend = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bewaar = async () => {
    setBezig(true)
    setGoed('')
    setFout('')
    try {
      const { tekst: bijgewerkt } = await api.adminZetTekst(GRAP_SLEUTEL, tekst.trim())
      setRij((huidig) => (huidig ? { ...huidig, ...bijgewerkt } : bijgewerkt))
      setGoed(bijgewerkt.en && bijgewerkt.de ? ui.bewaard : ui.bewaardZonder)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Opslaan mislukte.')
    } finally {
      setBezig(false)
    }
  }

  const herstel = async () => {
    setBezig(true)
    setGoed('')
    setFout('')
    try {
      await api.adminWisTekst(GRAP_SLEUTEL)
      const standaard = rij?.standaard ?? ''
      setRij((huidig) => (huidig ? { ...huidig, nl: standaard, en: '', de: '', bijgewerkt: '' } : huidig))
      setTekst(standaard)
      setGoed(ui.herstel)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Terugzetten mislukte.')
    } finally {
      setBezig(false)
    }
  }

  if (laden) return <p className="kaart__tekst">Even laden…</p>

  return (
    <>
      <Kop
        titel={ui.titel}
        intro={ui.intro}
        actie={
          <Link className="knop knop--klein knop--secundair" to={link('home')}>
            {t.nav.home}
          </Link>
        }
      />

      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}

      <div className="beheerpaneel formulier">
        <div className="formulier__velden">
          <div className="veld veld--breed">
            <span className="veld__label">{ui.voorbeeld}</span>
            <div className="grapvoorbeeld">
              <div className="grapkaartje grapkaartje--voorbeeld">
                <span className="grapkaartje__label">{t.home.hero.grapLabel}</span>
                <p className="grapkaartje__tekst">{tekst.trim() || '…'}</p>
              </div>
            </div>
          </div>

          <Veld label={t.home.hero.grapLabel} breed>
            <textarea rows={3} value={tekst} onChange={(e) => setTekst(e.target.value)} />
          </Veld>

          {rij && (rij.bijgewerkt || rij.en || rij.de) ? (
            <>
              <Veld label="EN" breed>
                <p className="tekstrij__vertaling">{rij.en || t.admin.teksten.mist}</p>
              </Veld>
              <Veld label="DE" breed>
                <p className="tekstrij__vertaling">{rij.de || t.admin.teksten.mist}</p>
              </Veld>
            </>
          ) : null}

          <Veld label={ui.ideeen} breed>
            <div className="grapideeen">
              {ui.ideeenLijst.map((idee) => (
                <button key={idee} type="button" className="chip" onClick={() => setTekst(idee)}>
                  {idee}
                </button>
              ))}
            </div>
          </Veld>
        </div>

        <p className="kaart__tekst">{ui.leeg}</p>

        <div className="beheer__pijlen">
          <button type="button" className="knop knop--klein" disabled={bezig} onClick={() => void bewaar()}>
            {ui.opslaan}
          </button>
          {rij?.bijgewerkt ? (
            <button
              type="button"
              className="knop knop--klein knop--secundair"
              disabled={bezig}
              onClick={() => void herstel()}
            >
              {ui.herstel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
