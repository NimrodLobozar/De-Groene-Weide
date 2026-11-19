import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { useApp } from '../store/App'
import { Icoon, type IcoonNaam } from '../components/Icoon'
import { FilmSectie } from '../components/animaties/FilmSectie'

const SOORT_ICOON: Record<string, IcoonNaam> = {
  dieren: 'kip',
  spelen: 'tractor',
  water: 'water',
  eten: 'eten',
}

export function Evenementen() {
  const { t, link, taal } = useTaal()
  const { events } = useApp()
  const [filter, setFilter] = useState<string>('alles')

  const titelVan = (nl: string, en: string, de: string) =>
    taal === 'en' ? en || nl : taal === 'de' ? de || nl : nl

  const lijst = useMemo(
    () =>
      events
        .filter((e) => e.actief === 1)
        .filter((e) => filter === 'alles' || e.soort === filter),
    [events, filter],
  )

  return (
    <>
      <section className="paginakop">
        <div className="container paginakop__binnen">
          <nav className="broodkruimel" aria-label="Kruimelpad">
            <Link to={link('home')}>{t.nav.home}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{t.nav.evenementen}</span>
          </nav>
          <h1>{t.evenementen.titel}</h1>
          <p className="lead">{t.evenementen.intro}</p>
        </div>
      </section>

      <FilmSectie />

      <section className="sectie sectie--krap">
        <div className="container">
          <div className="filterrij" role="group" aria-label={t.evenementen.filterLabel}>
            {(Object.keys(t.evenementen.filters) as Array<keyof typeof t.evenementen.filters>).map(
              (sleutel) => (
                <button
                  key={sleutel}
                  type="button"
                  className="chip"
                  aria-pressed={filter === sleutel}
                  onClick={() => setFilter(sleutel)}
                >
                  {t.evenementen.filters[sleutel]}
                </button>
              ),
            )}
          </div>

          <div className="agenda">
            {t.evenementen.dagen.map((dag, index) => {
              const dieDag = lijst.filter((e) => e.dag === index)
              return (
                <div key={dag} className="agenda__dag">
                  <div className="agenda__kop">
                    <h2>{dag}</h2>
                    <span className="agenda__aantal">{dieDag.length ? `${dieDag.length}×` : '—'}</span>
                  </div>
                  {dieDag.length ? (
                    <ul className="agenda__lijst">
                      {dieDag.map((ev) => (
                        <li key={ev.id} className="agendarij">
                          <span className="agendarij__tijd">{ev.tijd}</span>
                          <span className={`agendarij__icoon agendarij__icoon--${ev.soort}`}>
                            <Icoon naam={SOORT_ICOON[ev.soort] ?? 'ster'} maat={18} />
                          </span>
                          <span className="agendarij__titel">
                            {titelVan(ev.titel_nl, ev.titel_en, ev.titel_de)}
                          </span>
                          <span className="agendarij__meta">
                            {[ev.locatie, ev.leeftijd].filter(Boolean).join(' · ')}
                          </span>
                          <span className="label label--grijs">
                            {t.evenementen.soorten[ev.soort as keyof typeof t.evenementen.soorten] ??
                              ev.soort}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="agenda__leeg">{t.evenementen.niets}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sectie">
        <div className="container">
          <div className="adviesbalk adviesbalk--cta">
            <div className="adviesbalk__kip" aria-hidden="true">
              <Icoon naam="mail" maat={26} />
            </div>
            <div className="adviesbalk__tekst">
              <h3 className="adviesbalk__titel">{t.evenementen.cta.titel}</h3>
              <p>{t.evenementen.cta.tekst}</p>
            </div>
            <Link className="knop adviesbalk__knop" to={link('nieuwsbrief')}>
              {t.evenementen.cta.knop}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
