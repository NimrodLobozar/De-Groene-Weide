import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { KipIcoon } from '../components/Illustraties'
import { Foto } from '../components/Foto'

const TERREIN_FOTOS = ['kippen', 'speelweide', 'zwembad', 'kantine', 'winkel', 'sanitair']

export function Terrein() {
  const { t, link } = useTaal()
  const [filter, setFilter] = useState<'alles' | string>('alles')

  const filters = t.terrein.filters
  const zichtbaar =
    filter === 'alles'
      ? t.terrein.plekken
      : t.terrein.plekken.filter((p) => p.filter === filter)

  return (
    <>
      <section className="paginakop paginakop--gras">
        <div className="container paginakop__binnen">
          <nav className="broodkruimel" aria-label="Kruimelpad">
            <Link to={link('home')}>{t.nav.home}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{t.nav.terrein}</span>
          </nav>
          <h1>{t.terrein.titel}</h1>
          <p className="lead">{t.terrein.intro}</p>
          <p className="paginakop__tip">
            <span aria-hidden="true">💡</span> {t.terrein.tip}
          </p>
        </div>
      </section>

      <section className="sectie">
        <div className="container">
          <div className="filterrij" role="group" aria-label={t.terrein.filterLabel}>
            {(Object.keys(filters) as Array<keyof typeof filters>).map((sleutel) => (
              <button
                key={sleutel}
                type="button"
                className="chip"
                aria-pressed={filter === sleutel}
                onClick={() => setFilter(sleutel === 'alles' ? 'alles' : sleutel)}
              >
                {filters[sleutel]}
              </button>
            ))}
          </div>

          <div className="kaartenrij kaartenrij--3 terreinkaarten">
            {zichtbaar.map((plek, index) => (
              <article key={plek.titel} className="kaart activiteit">
                <div className="fotowrapper activiteit__foto activiteit__foto--hoog">
                  <Foto
                    sleutel={TERREIN_FOTOS[index] ?? 'kippen'}
                    label={plek.foto}
                    className="fotowrapper__vlak"
                  />
                  <span className="label activiteit__label">{plek.label}</span>
                </div>
                <div className="kaart__body">
                  <h3 className="kaart__titel">{plek.titel}</h3>
                  <p className="kaart__tekst">{plek.tekst}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectie sectie--stro">
        <div className="container toegankelijkheidsblok">
          <div>
            <h2>{t.terrein.rolstoel.titel}</h2>
            <p className="lead">{t.terrein.rolstoel.tekst}</p>
          </div>
          <Link className="knop knop--secundair" to={link('toegankelijkheid')}>
            {t.terrein.rolstoel.link}
          </Link>
        </div>
      </section>

      <section className="sectie">
        <div className="container">
          <div className="adviesbalk adviesbalk--cta">
            <div className="adviesbalk__kip" aria-hidden="true">
              <KipIcoon />
            </div>
            <div className="adviesbalk__tekst">
              <h3 className="adviesbalk__titel">{t.terrein.cta.titel}</h3>
              <p>{t.terrein.cta.tekst}</p>
            </div>
            <Link className="knop adviesbalk__knop" to={link('reserveren')}>
              {t.knoppen.boek}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
