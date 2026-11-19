import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { KipIcoon } from '../components/Illustraties'
import { Foto } from '../components/Foto'

export function OverOns() {
  const { t, link } = useTaal()

  return (
    <>
      <section className="paginakop paginakop--gras">
        <div className="container paginakop__binnen">
          <nav className="broodkruimel" aria-label="Kruimelpad">
            <Link to={link('home')}>{t.nav.home}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{t.nav.overOns}</span>
          </nav>
          <h1>{t.overOns.titel}</h1>
          <p className="lead">{t.overOns.intro}</p>
        </div>
      </section>

      <section className="sectie">
        <div className="container verhaal">
          <div className="verhaal__tekst">
            <h2>{t.overOns.verhaal.titel}</h2>
            {t.overOns.verhaal.alineas.map((alinea) => (
              <p key={alinea.slice(0, 24)}>{alinea}</p>
            ))}
          </div>
          <aside className="verhaal__zij">
            <div className="kaart">
              <div className="fotovak verhaal__foto">
                <Foto sleutel="hero" label="Foto: het erf" className="verhaal__foto-vlak" />
              </div>
              <div className="kaart__body">
                <p className="kaart__tekst">
                  Zes tenten in de eerste zomer. Nu achtenveertig plekken, twee safaritenten en twaalf
                  camperplaatsen.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectie sectie--stro">
        <div className="container">
          <h2 className="sectiekop">{t.overOns.waarden.titel}</h2>
          <ul className="waardenrij">
            {t.overOns.waarden.punten.map((punt) => (
              <li key={punt.titel} className="waarde">
                <h3>{punt.titel}</h3>
                <p>{punt.tekst}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sectie">
        <div className="container">
          <h2 className="sectiekop">{t.overOns.team.titel}</h2>
          <div className="kaartenrij kaartenrij--3">
            {t.overOns.team.leden.map((lid) => (
              <article key={lid.naam} className="kaart teamlid">
                <div className="fotovak teamlid__foto">
                  <span>{lid.foto}</span>
                </div>
                <div className="kaart__body">
                  <p className="teamlid__naam">{lid.naam}</p>
                  <p className="teamlid__rol">{lid.rol}</p>
                  <p className="kaart__tekst">{lid.tekst}</p>
                </div>
              </article>
            ))}
            <article className="kaart teamlid teamlid--jij">
              <div className="teamlid__kip" aria-hidden="true">
                <KipIcoon />
              </div>
              <div className="kaart__body">
                <p className="teamlid__naam">{t.overOns.team.jijTitel}</p>
                <p className="kaart__tekst">{t.overOns.team.jijTekst}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sectie sectie--krap">
        <div className="container">
          <div className="ctabalk">
            <div>
              <h2>{t.overOns.cta.titel}</h2>
              <p>{t.overOns.cta.tekst}</p>
            </div>
            <div className="ctabalk__knopjes">
              <Link className="knop knop--op-groen" to={link('reserveren')}>
                {t.overOns.cta.primair}
              </Link>
              <Link className="knop knop--wit" to={link('contact')}>
                {t.overOns.cta.secundair}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
