import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { useApp } from '../store/App'
import { SEIZOEN, iso, nachten, uitIso } from '../data/camping'
import { Plekkenkaart } from '../components/Plekkenkaart'
import { Icoon } from '../components/Icoon'
import {
  datumKort,
  datumLang,
  maandDagen,
  maandLabel,
  prijsExact,
  weekdagIndex,
  weekdagKort,
} from '../lib/datum'
import { api, ApiFout, bewaarToken, leesToken } from '../lib/api'
import { WENSEN, scorePlek, vervuldeWensen } from '../lib/match'

const SOORT_ICOON = { tent: 'stekker', camper: 'tractor', safaritent: 'bed' } as const

/* -------------------------------------------------------------------------- */
/* Hulpstukken                                                                */
/* -------------------------------------------------------------------------- */

function Stappenbalk({ stap }: { stap: number }) {
  const { t, link } = useTaal()
  return (
    <ol className="stappen">
      {t.reserveren.stappen.map((naam, index) => {
        const nr = index + 1
        const klaar = nr < stap
        const nu = nr === stap
        const inhoud = (
          <>
            <span className="stappen__bol" aria-hidden="true">
              {klaar ? <Icoon naam="vink" maat={11} /> : nr}
            </span>
            {naam}
          </>
        )
        return (
          <li key={naam}>
            {klaar ? (
              <Link
                to={`${link('reserveren')}/stap-${nr}`}
                className="stappen__item stappen__item--klaar"
              >
                {inhoud}
              </Link>
            ) : (
              <span className="stappen__item" aria-current={nu ? 'step' : undefined}>
                {inhoud}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function SelectiePaneel({ children }: { children?: ReactNode }) {
  const { t, taal } = useTaal()
  const { concept, prijsVan } = useApp()
  const aantal = nachten(concept.aankomst, concept.vertrek)
  const totaal = prijsVan(concept)

  return (
    <div className="paneelkaart paneelkaart--plakkerig">
      <h2 className="paneelkaart__kop">{t.reserveren.stap5.selectie}</h2>
      <dl className="selectielijst">
        <div>
          <dt>{t.reserveren.stap1.aankomst}</dt>
          <dd>{datumKort(concept.aankomst, taal)}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap1.vertrek}</dt>
          <dd>{datumKort(concept.vertrek, taal)}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap2.personen}</dt>
          <dd>
            {concept.volwassenen + concept.kinderen}{' '}
            <span className="tekst-zacht">
              ({concept.volwassenen} + {concept.kinderen})
            </span>
          </dd>
        </div>
        <div>
          <dt>{t.reserveren.stap5.plek}</dt>
          <dd>{concept.plek ?? '—'}</dd>
        </div>
      </dl>

      {aantal > 0 ? (
        <p className="selectielijst__nachten">
          {aantal} {aantal === 1 ? t.reserveren.stap1.nacht : t.reserveren.stap1.nachten}
        </p>
      ) : null}

      {totaal > 0 ? (
        <p className="paneelkaart__prijs">{prijsExact(totaal, taal)}</p>
      ) : (
        <p className="paneelkaart__prijs paneelkaart__prijs--leeg">—</p>
      )}

      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Stap 1 — datum                                                             */
/* -------------------------------------------------------------------------- */

function Kalender() {
  const { t, taal } = useTaal()
  const { concept, zetConcept, vrijePlekken } = useApp()
  const weekdagen = weekdagKort(taal)

  const maanden = useMemo(() => {
    const uit: Array<{ jaar: number; maand: number; dagen: string[] }> = []
    const m = new Date(SEIZOEN.start.getFullYear(), SEIZOEN.start.getMonth(), 1)
    while (m <= SEIZOEN.eind) {
      const dagen = maandDagen(m.getFullYear(), m.getMonth())
      uit.push({
        jaar: m.getFullYear(),
        maand: m.getMonth(),
        dagen,
      })
      m.setMonth(m.getMonth() + 1)
    }
    return uit
  }, [])

  function kiesDag(dag: string) {
    if (!concept.aankomst || concept.vertrek || dag <= concept.aankomst) {
      zetConcept({ aankomst: dag, vertrek: '' })
      return
    }
    zetConcept({ vertrek: dag })
  }

  const binnen = (dag: string) => {
    if (!concept.aankomst) return false
    if (!concept.vertrek) return dag === concept.aankomst
    return dag >= concept.aankomst && dag < concept.vertrek
  }

  return (
    <div className="kalender">
      {maanden.map(({ jaar, maand, dagen }) => {
        const eerste = dagen[0]
        const leegVoor = weekdagIndex(eerste)
        return (
          <section key={`${jaar}-${maand}`} className="maand">
            <h3 className="maand__kop">{maandLabel(jaar, maand, taal)}</h3>
            <div className="maand__weekdagen" aria-hidden="true">
              {weekdagen.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="maand__dagen">
              {Array.from({ length: leegVoor }, (_, i) => (
                <span key={`leeg-${i}`} className="maand__leeg" />
              ))}
              {dagen.map((dag) => {
                const buitenSeizoen = dag < iso(SEIZOEN.start) || dag > iso(SEIZOEN.eind)
                const volgende = new Date(`${dag}T00:00:00Z`)
                volgende.setUTCDate(volgende.getUTCDate() + 1)
                const vrij = vrijePlekken(dag, volgende.toISOString().slice(0, 10)).length
                const vol = vrij === 0 || buitenSeizoen
                const gekozen = binnen(dag)
                return (
                  <button
                    key={dag}
                    type="button"
                    className={`dag${gekozen ? ' dag--gekozen' : ''}${vol ? ' dag--vol' : ''}`}
                    disabled={vol}
                    aria-pressed={gekozen}
                    aria-label={datumLang(dag, taal) + (vol ? ` — ${t.reserveren.stap1.volgeboekt}` : '')}
                    onClick={() => kiesDag(dag)}
                  >
                    {uitIso(dag).getDate()}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Stap 4 — plek kiezen                                                       */
/* -------------------------------------------------------------------------- */

function PlekPaneel({ plekId, onVolgende }: { plekId: string; onVolgende: () => void }) {
  const { t, taal } = useTaal()
  const { concept, prijsVan, plek } = useApp()
  const p = plek(plekId)
  const aantal = nachten(concept.aankomst, concept.vertrek)
  const totaal = prijsVan({ ...concept, plek: plekId })
  if (!p) return null

  return (
    <div className="paneelkaart paneelkaart--plakkerig">
      <div className="paneelkaart__koprij">
        <h2 className="paneelkaart__kop">{p.id}</h2>
        <span className="label">{t.reserveren.stap2.soorten[p.soort]}</span>
      </div>
      <div className="fotovak paneelkaart__foto fotovak--gras">
        <span>
          {t.plattegrond.plekDetails.foto} {p.id}
        </span>
      </div>
      <dl className="eigenschappen">
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.stroom}</dt>
          <dd>{p.stroom ? 'Ja' : 'Nee'}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.ondergrond}</dt>
          <dd>{p.ondergrond}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.vlak}</dt>
          <dd>{p.vlak}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.water}</dt>
          <dd>{p.water ? 'Ja' : 'Nee'}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.rustig}</dt>
          <dd>{p.rustig ? 'Ja' : 'Nee'}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.maxPersonen}</dt>
          <dd>{p.maxPersonen}</dd>
        </div>
        <div>
          <dt>{t.reserveren.stap4.voorzieningenTitels.afstand}</dt>
          <dd>{p.afstandSanitair} m</dd>
        </div>
      </dl>

      <p className="paneelkaart__nacht">
        {aantal} {aantal === 1 ? t.reserveren.stap1.nacht : t.reserveren.stap1.nachten}
      </p>
      <p className="paneelkaart__prijs">{prijsExact(totaal, taal)}</p>
      <p className="paneelkaart__hint">{t.reserveren.stap4.houdVast}</p>

      <button type="button" className="knop knop--breed" onClick={onVolgende}>
        {t.reserveren.stap4.reserveer}
      </button>
      <p className="paneelkaart__klein">
        {t.reserveren.stap4.geenAccount} <a href="#account">{t.reserveren.stap4.alAccount}</a>
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hoofdcomponent                                                             */
/* -------------------------------------------------------------------------- */

export function Reserveer() {
  const { t, taal, link } = useTaal()
  const {
    concept,
    zetConcept,
    zetGegevens,
    prijsVan,
    plek,
    plekken,
    vrijePlekken: vrijePlekkenUitStore,
    ververs,
  } = useApp()
  const locatie = useLocation()
  const navigate = useNavigate()
  const [lijstWeergave, setLijstWeergave] = useState(false)
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)

  const pad = locatie.pathname
  const mijnMatch = /mijn-reservering\/([^/]+)/.exec(pad)
  const stap7Match = /stap-7\/([^/]+)/.exec(pad)
  const stapMatch = /stap-([1-7])/.exec(pad)
  const stap = stapMatch ? Number(stapMatch[1]) : 1

  const naarStap = (n: number) => navigate(`${link('reserveren')}/stap-${n}`)

  const vrijeIds = useMemo(
    () => vrijePlekkenUitStore(concept.aankomst, concept.vertrek),
    [vrijePlekkenUitStore, concept.aankomst, concept.vertrek],
  )

  /* ------- uitzondering: mijn reservering ------- */
  if (mijnMatch) {
    return <MijnReservering nummer={decodeURIComponent(mijnMatch[1])} />
  }

  /* ------- stap 7: bevestiging ------- */
  if (stap7Match) {
    return <Bevestiging nummer={decodeURIComponent(stap7Match[1])} />
  }

  /* ------- bewaken dat je niet zonder gegevens verder kunt ------- */
  if (stap <= 6 && stap >= 2 && (!concept.aankomst || !concept.vertrek)) {
    return <Navigate to={`${link('reserveren')}/stap-1`} replace />
  }
  if (stap <= 6 && stap >= 5 && !concept.plek) {
    return <Navigate to={`${link('reserveren')}/stap-4`} replace />
  }
  if (stap === 6 && !concept.gegevens.naam.trim()) {
    return <Navigate to={`${link('reserveren')}/stap-5`} replace />
  }

  const soortPlekken = plekken.filter(
    (p) => vrijeIds.includes(p.id) && (!concept.soort || p.soort === concept.soort),
  )
  const tips = [...soortPlekken]
    .map((p) => ({
      plek: p,
      score: scorePlek(p, concept.wensen, concept.volwassenen + concept.kinderen),
    }))
    .sort((a, b) => b.score - a.score || a.plek.id.localeCompare(b.plek.id))
    .slice(0, 3)

  const prijsTotaal = prijsVan(concept)

  async function reserveerNu() {
    if (!concept.plek) {
      setFout('Kies eerst een plek.')
      return
    }
    if (!vrijeIds.includes(concept.plek)) {
      setFout(t.reserveren.netBezet.tekst)
      return
    }

    setBezig(true)
    setFout('')
    try {
      const uitkomst = await api.maakReservering({
        aankomst: concept.aankomst,
        vertrek: concept.vertrek,
        volwassenen: concept.volwassenen,
        kinderen: concept.kinderen,
        plek: concept.plek,
        wensen: concept.wensen,
        taal,
        akkoord: concept.gegevens.akkoord,
        gegevens: {
          naam: concept.gegevens.naam,
          email: concept.gegevens.email,
          telefoon: concept.gegevens.telefoon,
          adres: concept.gegevens.adres,
          postcode: concept.gegevens.postcode,
          plaats: concept.gegevens.plaats,
          land: concept.gegevens.land,
          opmerking: concept.gegevens.opmerking,
        },
      })

      bewaarToken(uitkomst.nummer, uitkomst.token)
      await ververs()
      navigate(`${link('reserveren')}/stap-7/${uitkomst.nummer}`)
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Reserveren lukte niet. Probeer het opnieuw.')
    } finally {
      setBezig(false)
    }
  }

  const titel = [
    t.reserveren.stap1.titel,
    t.reserveren.stap2.titel,
    t.reserveren.stap3.titel,
    t.reserveren.stap4.titel,
    t.reserveren.stap5.titel,
    t.reserveren.stap6.titel,
  ][stap - 1]

  return (
    <section className="sectie sectie--krap reserveer">
      <div className="container">
        <p className="reserveer__kruimel">
          <Link to={link('home')}>{t.nav.home}</Link> › {t.nav.reserveren} ·{' '}
          {t.reserveren.stapVan.replace('{stap}', String(stap))}
        </p>

        <Stappenbalk stap={stap} />

        <h1 className="reserveer__titel">{titel}</h1>

        <div className="reserveer__raster">
          <div className="reserveer__hoofd">
            {/* ---------------- stap 1 ---------------- */}
            {stap === 1 ? (
              <>
                <p className="lead">{t.reserveren.stap1.intro}</p>
                <p className="reserveer__datumregel">
                  {t.reserveren.stap1.aankomst}:{' '}
                  <strong>{datumKort(concept.aankomst, taal)}</strong> · {t.reserveren.stap1.vertrek}:{' '}
                  <strong>{datumKort(concept.vertrek, taal)}</strong>
                </p>
                <Kalender />
                <div className="reserveer__acties">
                  <button
                    type="button"
                    className="knop"
                    disabled={!concept.aankomst || !concept.vertrek}
                    onClick={() => naarStap(2)}
                  >
                    {t.reserveren.stap1.volgend}
                  </button>
                </div>
              </>
            ) : null}

            {/* ---------------- stap 2 ---------------- */}
            {stap === 2 ? (
              <>
                <p className="lead">{t.reserveren.intro}</p>

                <div className="stapblok">
                  <h2 className="stapblok__kop">{t.reserveren.stap2.personen}</h2>
                  <div className="tellers">
                    <div className="teller">
                      <div>
                        <p className="teller__naam">{t.reserveren.stap2.volwassenen}</p>
                        <p className="teller__hint">{t.reserveren.stap2.volwassenenHint}</p>
                      </div>
                      <div className="teller__bediening">
                        <button
                          type="button"
                          aria-label="minder"
                          onClick={() =>
                            zetConcept({ volwassenen: Math.max(1, concept.volwassenen - 1) })
                          }
                        >
                          −
                        </button>
                        <span aria-live="polite">{concept.volwassenen}</span>
                        <button
                          type="button"
                          aria-label="meer"
                          onClick={() => zetConcept({ volwassenen: concept.volwassenen + 1 })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="teller">
                      <div>
                        <p className="teller__naam">{t.reserveren.stap2.kinderen}</p>
                        <p className="teller__hint">{t.reserveren.stap2.kinderenHint}</p>
                      </div>
                      <div className="teller__bediening">
                        <button
                          type="button"
                          aria-label="minder"
                          onClick={() =>
                            zetConcept({ kinderen: Math.max(0, concept.kinderen - 1) })
                          }
                        >
                          −
                        </button>
                        <span aria-live="polite">{concept.kinderen}</span>
                        <button
                          type="button"
                          aria-label="meer"
                          onClick={() => zetConcept({ kinderen: concept.kinderen + 1 })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stapblok">
                  <h2 className="stapblok__kop">{t.reserveren.stap2.slapen}</h2>
                  <div className="soortkeuze">
                    {(['tent', 'camper', 'safaritent'] as const).map((soort) => (
                      <button
                        key={soort}
                        type="button"
                        className={`soortkaart${concept.soort === soort ? ' is-gekozen' : ''}`}
                        aria-pressed={concept.soort === soort}
                        onClick={() => zetConcept({ soort, plek: null })}
                      >
                        <Icoon naam={SOORT_ICOON[soort]} maat={26} />
                        <span className="soortkaart__naam">
                          {t.reserveren.stap2.soorten[soort]}
                        </span>
                        <span className="soortkaart__uitleg">
                          {t.reserveren.stap2.soortUitleg[soort]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="stapblok">
                  <h2 className="stapblok__kop">{t.reserveren.stap2.wens}</h2>
                  <div className="filterrij filterrij--krap">
                    {WENSEN.map((wens) => (
                      <button
                        key={wens}
                        type="button"
                        className="chip"
                        aria-pressed={concept.wensen.includes(wens)}
                        onClick={() =>
                          zetConcept({
                            wensen: concept.wensen.includes(wens)
                              ? concept.wensen.filter((w) => w !== wens)
                              : [...concept.wensen, wens],
                          })
                        }
                      >
                        {t.reserveren.stap2.wensen[wens]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reserveer__acties">
                  <button
                    type="button"
                    className="knop"
                    disabled={!concept.aankomst || !concept.vertrek}
                    onClick={() => naarStap(3)}
                  >
                    {t.reserveren.stap2.volgend}
                  </button>
                </div>
              </>
            ) : null}

            {/* ---------------- stap 3 ---------------- */}
            {stap === 3 ? (
              <>
                <p className="lead">{t.reserveren.stap3.intro}</p>

                {tips.length === 0 ? (
                  <div className="mededeling mededeling--oranje">
                    <Icoon naam="waarschuwing" maat={20} />
                    <p>{t.reserveren.netBezet.tekst}</p>
                  </div>
                ) : (
                  <div className="tips">
                    {tips.map((tip, index) => (
                      <article key={tip.plek.id} className="tipkaart">
                        <div className="tipkaart__kop">
                          <span className="tipkaart__badge">
                            {t.reserveren.stap3.tip} {index + 1}
                          </span>
                          <span className="tipkaart__match">
                            {t.reserveren.stap3.match} {tip.score}%
                          </span>
                        </div>
                        <h2 className="tipkaart__titel">
                          {tip.plek.id}{' '}
                          <span className="tekst-zacht">
                            · {t.reserveren.stap2.soorten[tip.plek.soort]}
                          </span>
                        </h2>
                        <div className="fotovak tipkaart__foto fotovak--gras">
                          <span>{t.plattegrond.plekDetails.foto} {tip.plek.id}</span>
                        </div>
                        <ul className="tipkaart__wensen">
                          {vervuldeWensen(tip.plek, concept.wensen).map((wens) => (
                            <li key={wens}>
                              <Icoon naam="vink" maat={14} />
                              {t.reserveren.stap3.tips[wens as keyof typeof t.reserveren.stap3.tips]}
                            </li>
                          ))}
                          {vervuldeWensen(tip.plek, concept.wensen).length === 0 ? (
                            <li>
                              <Icoon naam="vink" maat={14} />
                              {tip.plek.afstandSanitair} m {t.reserveren.stap4.voorzieningenTitels.afstand.toLowerCase()}
                            </li>
                          ) : null}
                        </ul>
                        <div className="tipkaart__voet">
                          <span className="tipkaart__prijs">
                            € {tip.plek.prijs} / {t.reserveren.stap1.nacht}
                          </span>
                          <button
                            type="button"
                            className="knop knop--klein"
                            onClick={() => {
                              zetConcept({ plek: tip.plek.id })
                              naarStap(4)
                            }}
                          >
                            {t.reserveren.stap3.kies}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <div className="reserveer__acties reserveer__acties--verdeeld">
                  <button
                    type="button"
                    className="knop knop--secundair"
                    onClick={() => naarStap(2)}
                  >
                    {t.reserveren.stap3.opnieuw}
                  </button>
                  <button
                    type="button"
                    className="knop knop--secundair"
                    onClick={() => naarStap(4)}
                  >
                    {t.reserveren.stap3.bekijkAlles}
                  </button>
                </div>
              </>
            ) : null}

            {/* ---------------- stap 4 ---------------- */}
            {stap === 4 ? (
              <>
                <div className="kaartbalk">
                  <div className="tabbladen" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={!lijstWeergave}
                      onClick={() => setLijstWeergave(false)}
                      className="tab"
                    >
                      {t.reserveren.stap4.kaart}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={lijstWeergave}
                      onClick={() => setLijstWeergave(true)}
                      className="tab"
                    >
                      {t.reserveren.stap4.lijst}
                    </button>
                  </div>
                  <div className="kaartbalk__samenvatting">
                    <span>{datumKort(concept.aankomst, taal)}</span>
                    <span aria-hidden="true">→</span>
                    <span>{datumKort(concept.vertrek, taal)}</span>
                    <span className="tekst-zacht">
                      · {concept.volwassenen + concept.kinderen} pers.
                    </span>
                  </div>
                </div>

                {lijstWeergave ? (
                  <div className="tabelvak">
                    <table className="tabel tabel--compact">
                      <thead>
                        <tr>
                          <th scope="col">{t.reserveren.stap4.kaart}</th>
                          <th scope="col">{t.reserveren.stap4.voorzieningenTitels.stroom}</th>
                          <th scope="col">{t.reserveren.stap4.voorzieningenTitels.ondergrond}</th>
                          <th scope="col">{t.reserveren.stap4.voorzieningenTitels.afstand}</th>
                          <th scope="col">{t.reserveren.stap1.nacht}</th>
                          <th scope="col" />
                        </tr>
                      </thead>
                      <tbody>
                        {soortPlekken.map((p) => (
                          <tr key={p.id} className={concept.plek === p.id ? 'is-gekozen' : ''}>
                            <th scope="row">{p.id}</th>
                            <td>{p.stroom ? 'Ja' : 'Nee'}</td>
                            <td>{p.ondergrond}</td>
                            <td>{p.afstandSanitair} m</td>
                            <td>€ {p.prijs}</td>
                            <td>
                              <button
                                type="button"
                                className="knop knop--klein knop--secundair"
                                onClick={() => zetConcept({ plek: p.id })}
                              >
                                {t.reserveren.stap3.kies}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Plekkenkaart
                    van={concept.aankomst}
                    tot={concept.vertrek}
                    gekozen={concept.plek}
                    tip={tips[0]?.plek.id ?? null}
                    onKies={(p) => zetConcept({ plek: p.id })}
                  />
                )}
              </>
            ) : null}

            {/* ---------------- stap 5 ---------------- */}
            {stap === 5 ? (
              <>
                <p className="lead">{t.reserveren.stap5.intro}</p>
                <div className="formulier-raster stapblok">
                  <div className="formulier-raster--2 formulier-raster">
                    <div className="veld">
                      <label htmlFor="naam">{t.reserveren.stap5.naam}</label>
                      <input
                        id="naam"
                        autoComplete="name"
                        value={concept.gegevens.naam}
                        onChange={(e) => zetGegevens({ naam: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="email">{t.reserveren.stap5.email}</label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={concept.gegevens.email}
                        onChange={(e) => zetGegevens({ email: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="telefoon">{t.reserveren.stap5.telefoon}</label>
                      <input
                        id="telefoon"
                        type="tel"
                        autoComplete="tel"
                        value={concept.gegevens.telefoon}
                        onChange={(e) => zetGegevens({ telefoon: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="adres">{t.reserveren.stap5.adres}</label>
                      <input
                        id="adres"
                        autoComplete="street-address"
                        value={concept.gegevens.adres}
                        onChange={(e) => zetGegevens({ adres: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="postcode">{t.reserveren.stap5.postcode}</label>
                      <input
                        id="postcode"
                        autoComplete="postal-code"
                        value={concept.gegevens.postcode}
                        onChange={(e) => zetGegevens({ postcode: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="plaats">{t.reserveren.stap5.plaats}</label>
                      <input
                        id="plaats"
                        autoComplete="address-level2"
                        value={concept.gegevens.plaats}
                        onChange={(e) => zetGegevens({ plaats: e.target.value })}
                      />
                    </div>
                    <div className="veld">
                      <label htmlFor="land">{t.reserveren.stap5.land}</label>
                      <select
                        id="land"
                        value={concept.gegevens.land}
                        onChange={(e) => zetGegevens({ land: e.target.value })}
                      >
                        <option>Nederland</option>
                        <option>België</option>
                        <option>Duitsland</option>
                        <option>Frankrijk</option>
                        <option>Luxemburg</option>
                      </select>
                    </div>
                  </div>

                  <div className="veld">
                    <label htmlFor="opmerking">{t.reserveren.stap5.opmerking}</label>
                    <textarea
                      id="opmerking"
                      value={concept.gegevens.opmerking}
                      onChange={(e) => zetGegevens({ opmerking: e.target.value })}
                    />
                    <span className="veld__hint">{t.reserveren.stap5.opmerkingHint}</span>
                  </div>

                  <label className="checkveld">
                    <input
                      type="checkbox"
                      checked={concept.gegevens.akkoord}
                      onChange={(e) => zetGegevens({ akkoord: e.target.checked })}
                    />
                    <span>{t.reserveren.stap5.akkoord}</span>
                  </label>

                  {fout ? <p className="fouttekst">{fout}</p> : null}

                  <div className="reserveer__acties">
                    <button
                      type="button"
                      className="knop"
                      onClick={() => {
                        if (!concept.gegevens.naam.trim() || !concept.gegevens.email.includes('@')) {
                          setFout(t.reserveren.stap5.verplicht)
                          return
                        }
                        if (!concept.gegevens.akkoord) {
                          setFout(t.reserveren.stap5.verplichtAkkoord)
                          return
                        }
                        setFout('')
                        naarStap(6)
                      }}
                    >
                      {t.reserveren.stap5.volgende}
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {/* ---------------- stap 6 ---------------- */}
            {stap === 6 ? (
              <>
                <p className="lead">{t.reserveren.stap6.intro}</p>

                <div className="controlekaart">
                  <dl className="controlelijst">
                    <div>
                      <dt>{t.reserveren.stap6.wie}</dt>
                      <dd>
                        {concept.gegevens.naam}
                        <span className="tekst-zacht"> · {concept.gegevens.email}</span>
                      </dd>
                      <Link to={`${link('reserveren')}/stap-5`}>{t.reserveren.stap6.wijzig}</Link>
                    </div>
                    <div>
                      <dt>{t.reserveren.stap6.wanneer}</dt>
                      <dd>
                        {datumLang(concept.aankomst, taal)} → {datumLang(concept.vertrek, taal)}
                      </dd>
                      <Link to={`${link('reserveren')}/stap-1`}>{t.reserveren.stap6.wijzig}</Link>
                    </div>
                    <div>
                      <dt>{t.reserveren.stap6.waar}</dt>
                      <dd>
                        {concept.plek}{' '}
                        <span className="tekst-zacht">
                          · {concept.soort ? t.reserveren.stap2.soorten[concept.soort] : ''}
                        </span>
                      </dd>
                      <Link to={`${link('reserveren')}/stap-4`}>{t.reserveren.stap6.wijzig}</Link>
                    </div>
                    <div>
                      <dt>{t.reserveren.stap6.wat}</dt>
                      <dd>
                        {concept.volwassenen} {t.reserveren.stap2.volwassenen.toLowerCase()},{' '}
                        {concept.kinderen} {t.reserveren.stap2.kinderen.toLowerCase()}
                      </dd>
                      <Link to={`${link('reserveren')}/stap-2`}>{t.reserveren.stap6.wijzig}</Link>
                    </div>
                  </dl>

                  <div className="betaalblok">
                    <div>
                      <p className="betaalblok__titel">{t.reserveren.stap6.betalen}</p>
                      <p className="kaart__tekst">{t.reserveren.stap6.betalenUitleg}</p>
                    </div>
                    <p className="betaalblok__prijs">{prijsExact(prijsTotaal, taal)}</p>
                  </div>

                  {fout ? <p className="fouttekst">{fout}</p> : null}

                  <div className="reserveer__acties">
                    <button
                      type="button"
                      className="knop"
                      onClick={() => void reserveerNu()}
                      disabled={bezig}
                    >
                      {bezig ? 'Bezig…' : t.reserveren.stap6.reserveer}
                    </button>
                    <p className="paneelkaart__klein">{t.reserveren.stap6.voorwaardenKort}</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <aside className="reserveer__zij">
            {stap === 4 && concept.plek ? (
              <PlekPaneel plekId={concept.plek} onVolgende={() => naarStap(5)} />
            ) : (
              <SelectiePaneel />
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Bevestiging en "mijn reservering"                                          */
/* -------------------------------------------------------------------------- */

interface PubliekeReservering {
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
}

/** Haalt één reservering op met het token dat bij die boeking hoort. */
function usePubliekeReservering(nummer: string) {
  const [data, setData] = useState<PubliekeReservering | null>(null)
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(true)

  useEffect(() => {
    let levend = true
    const token = leesToken(nummer)
    if (!token) {
      setFout('geen-token')
      setBezig(false)
      return
    }
    api
      .reservering(nummer, token)
      .then((r) => {
        if (levend) setData(r as PubliekeReservering)
      })
      .catch((e) => {
        if (levend) setFout(e instanceof ApiFout ? e.message : 'Ophalen lukte niet.')
      })
      .finally(() => {
        if (levend) setBezig(false)
      })
    return () => {
      levend = false
    }
  }, [nummer])

  return { data, fout, bezig, setData }
}

function Bevestiging({ nummer }: { nummer: string }) {
  const { t, taal, link } = useTaal()
  const { resetConcept } = useApp()
  const { data, fout, bezig } = usePubliekeReservering(nummer)

  // Pas opruimen als de bevestiging echt in beeld staat.
  useEffect(() => {
    resetConcept()
  }, [resetConcept])

  if (bezig) {
    return (
      <section className="sectie">
        <div className="container container--smal">
          <p className="lead">Even je reservering ophalen…</p>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="sectie">
        <div className="container container--smal">
          <h1>{t.reserveren.mijnereservering.geen}</h1>
          <p className="lead">{fout === 'geen-token' ? '' : fout}</p>
          <Link className="knop" to={link('reserveren')}>
            {t.nav.reserveren}
          </Link>
        </div>
      </section>
    )
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:De Groene Weide – plek ${data.pitch}`,
    `DTSTART;VALUE=DATE:${data.van.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${data.tot.replace(/-/g, '')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n')

  return (
    <section className="sectie bevestiging">
      <div className="container container--smal">
        <div className="bevestiging__vink" aria-hidden="true">
          <Icoon naam="vink" maat={34} />
        </div>
        <h1>{t.reserveren.stap7.titel.replace('{plek}', data.pitch)}</h1>
        <p className="lead">{t.reserveren.stap7.intro}</p>

        <div className="bevestiging__kaart">
          <dl className="controlelijst">
            <div>
              <dt>{t.reserveren.stap7.nummer}</dt>
              <dd>
                <strong>{data.nummer}</strong>
              </dd>
            </div>
            <div>
              <dt>{t.reserveren.stap1.aankomst}</dt>
              <dd>{datumLang(data.van, taal)}</dd>
            </div>
            <div>
              <dt>{t.reserveren.stap1.vertrek}</dt>
              <dd>{datumLang(data.tot, taal)}</dd>
            </div>
            <div>
              <dt>{t.reserveren.stap6.totaal}</dt>
              <dd>{prijsExact(data.bedrag, taal)}</dd>
            </div>
          </dl>
        </div>

        <h2 className="sectiekop">{t.reserveren.stap7.nu}</h2>
        <div className="bevestiging__knopjes">
          <a
            className="knop"
            href="https://www.google.com/maps/search/?api=1&query=Groene+Weide+1+Weideveen"
            target="_blank"
            rel="noreferrer"
          >
            {t.reserveren.stap7.planRoute}
          </a>
          <a
            className="knop knop--secundair"
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`}
            download="de-groene-weide.ics"
          >
            {t.reserveren.stap7.ical}
          </a>
          <Link
            className="knop knop--secundair"
            to={`${link('reserveren')}/mijn-reservering/${data.nummer}`}
          >
            {t.reserveren.stap7.naarMijn}
          </Link>
        </div>

        <div className="mededeling mededeling--eigel">
          <Icoon naam="kip" maat={22} />
          <div>
            <p className="mededeling__titel">{t.reserveren.stap7.handig}</p>
            <ul className="lijstje">
              {t.reserveren.stap7.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function MijnReservering({ nummer }: { nummer: string }) {
  const { t, taal, link } = useTaal()
  const { data, fout, bezig, setData } = usePubliekeReservering(nummer)
  const [foutAnnuleren, setFoutAnnuleren] = useState('')
  const [bezigAnnuleren, setBezigAnnuleren] = useState(false)

  if (bezig) {
    return (
      <section className="sectie">
        <div className="container container--smal">
          <p className="lead">Even je reservering ophalen…</p>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="sectie">
        <div className="container container--smal">
          <h1>{t.reserveren.mijnereservering.geen}</h1>
          <p className="lead">{fout === 'geen-token' ? '' : fout}</p>
          <Link className="knop" to={link('reserveren')}>
            {t.nav.reserveren}
          </Link>
        </div>
      </section>
    )
  }

  const aantal = nachten(data.van, data.tot)
  const vandaag = iso(new Date())
  const isAankomstdag = vandaag === data.van
  const geannuleerd = data.status === 'geannuleerd'

  async function annuleren() {
    setBezigAnnuleren(true)
    setFoutAnnuleren('')
    try {
      await api.annuleer(data!.nummer, leesToken(data!.nummer))
      setData({ ...data!, status: 'geannuleerd' })
    } catch (e) {
      setFoutAnnuleren(e instanceof ApiFout ? e.message : 'Annuleren lukte niet.')
    } finally {
      setBezigAnnuleren(false)
    }
  }

  return (
    <section className="sectie">
      <div className="container container--smal">
        {isAankomstdag && !geannuleerd ? (
          <div className="mededeling">
            <Icoon naam="zon" maat={22} />
            <div>
              <p className="mededeling__titel">{t.reserveren.aankomstdag.titel}</p>
              <p>{t.reserveren.aankomstdag.tekst}</p>
            </div>
          </div>
        ) : null}

        {geannuleerd ? (
          <div className="mededeling mededeling--oranje">
            <Icoon naam="waarschuwing" maat={22} />
            <p>Deze reservering is geannuleerd. Je hoeft niets te betalen.</p>
          </div>
        ) : null}

        <h1>{t.reserveren.mijnereservering.titel.replace('{nachten}', String(Math.max(0, aantal)))}</h1>
        <p className="lead">{t.reserveren.mijnereservering.intro}</p>

        <div className="bevestiging__kaart">
          <dl className="controlelijst">
            <div>
              <dt>{t.reserveren.stap7.nummer}</dt>
              <dd>
                <strong>{data.nummer}</strong>
              </dd>
            </div>
            <div>
              <dt>{t.reserveren.mijnereservering.plek}</dt>
              <dd>
                {data.pitch} · {data.volwassenen + data.kinderen} pers.
              </dd>
            </div>
            <div>
              <dt>{t.reserveren.mijnereservering.aankomst}</dt>
              <dd>{datumLang(data.van, taal)}</dd>
            </div>
            <div>
              <dt>{t.reserveren.mijnereservering.vertrek}</dt>
              <dd>{datumLang(data.tot, taal)}</dd>
            </div>
            <div>
              <dt>{t.reserveren.stap6.totaal}</dt>
              <dd>{prijsExact(data.bedrag, taal)}</dd>
            </div>
          </dl>
        </div>

        <div className="mededeling">
          <Icoon naam="klok" maat={22} />
          <p>{t.reserveren.mijnereservering.aankomstInfo}</p>
        </div>

        <div className="bevestiging__knopjes">
          <a
            className="knop"
            href="https://www.google.com/maps/search/?api=1&query=Groene+Weide+1+Weideveen"
            target="_blank"
            rel="noreferrer"
          >
            {t.reserveren.mijnereservering.route}
          </a>
          <Link className="knop knop--secundair" to={`${link('reserveren')}/stap-1`}>
            {t.reserveren.mijnereservering.wijzigen}
          </Link>
          <button
            type="button"
            className="knop knop--secundair"
            disabled={geannuleerd || bezigAnnuleren}
            onClick={() => void annuleren()}
          >
            {bezigAnnuleren ? 'Bezig…' : t.reserveren.mijnereservering.annuleren}
          </button>
        </div>

        {foutAnnuleren ? <p className="fouttekst">{foutAnnuleren}</p> : null}

        <h2 className="sectiekop">{t.reserveren.mijnereservering.watMee}</h2>
        <ul className="lijstje lijstje--kolommen">
          {t.reserveren.mijnereservering.mee.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
