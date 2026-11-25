import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { Icoon } from '../components/Icoon'
import { api, ApiFout } from '../lib/api'

export function Contact() {
  const { t, link } = useTaal()
  const [verstuurd, setVerstuurd] = useState(false)
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)
  const [onderwerp, setOnderwerp] = useState(t.contact.form.onderwerpen[0])

  async function versturen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const naam = String(data.get('naam') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const bericht = String(data.get('bericht') ?? '').trim()

    if (!naam || !email.includes('@')) {
      setFout('Vul je naam en een geldig e-mailadres in.')
      return
    }

    setBezig(true)
    setFout('')
    try {
      await api.contact({ naam, email, onderwerp, bericht })
      setVerstuurd(true)
    } catch (err) {
      setFout(err instanceof ApiFout ? err.message : 'Versturen lukte niet. Probeer het opnieuw.')
    } finally {
      setBezig(false)
    }
  }

  return (
    <>
      <section className="paginakop">
        <div className="container paginakop__binnen">
          <nav className="broodkruimel" aria-label="Kruimelpad">
            <Link to={link('home')}>{t.nav.home}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{t.nav.contact}</span>
          </nav>
          <h1>{t.contact.titel}</h1>
          <p className="lead">{t.contact.intro}</p>
        </div>
      </section>

      <section className="sectie sectie--krap">
        <div className="container contactraster">
          <div className="contactraster__formulier">
            {verstuurd ? (
              <div className="mededeling">
                <Icoon naam="vink" maat={22} />
                <div>
                  <p className="mededeling__titel">Verstuurd</p>
                  <p>{t.contact.form.succes}</p>
                </div>
              </div>
            ) : (
              <form className="formulier-raster" onSubmit={versturen} noValidate>
                <div className="formulier-raster--2 formulier-raster">
                  <div className="veld">
                    <label htmlFor="naam">{t.contact.form.naam}</label>
                    <input id="naam" name="naam" autoComplete="name" required />
                  </div>
                  <div className="veld">
                    <label htmlFor="email">{t.contact.form.email}</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                  </div>
                </div>

                <div className="veld">
                  <span className="veld__label">{t.contact.form.onderwerp}</span>
                  <div className="filterrij filterrij--krap">
                    {t.contact.form.onderwerpen.map((optie) => (
                      <button
                        key={optie}
                        type="button"
                        className="chip"
                        aria-pressed={onderwerp === optie}
                        onClick={() => setOnderwerp(optie)}
                      >
                        {optie}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="onderwerp" value={onderwerp} />
                </div>

                <div className="veld">
                  <label htmlFor="bericht">{t.contact.form.bericht}</label>
                  <textarea id="bericht" name="bericht" />
                  <span className="veld__hint">{t.contact.form.berichtHint}</span>
                </div>

                <label className="checkveld">
                  <input type="checkbox" name="akkoord" defaultChecked />
                  <span>{t.contact.form.akkoord}</span>
                </label>

                {fout ? <p className="fouttekst">{fout}</p> : null}

                <button type="submit" className="knop" disabled={bezig}>
                  {bezig ? 'Bezig…' : t.contact.form.versturen}
                </button>
              </form>
            )}
          </div>

          <aside className="contactraster__zij">
            <div className="contactkaart">
              <h2>{t.contact.direct.titel}</h2>
              <ul className="contactlijst">
                <li>
                  <Icoon naam="telefoon" maat={18} />
                  <div>
                    <span>{t.contact.direct.telefoon}</span>
                    <a href="tel:+31598123456">0598 – 12 34 56</a>
                  </div>
                </li>
                <li>
                  <Icoon naam="mail" maat={18} />
                  <div>
                    <span>{t.contact.direct.email}</span>
                    <a href="mailto:hallo@degroeneweide.nl">hallo@degroeneweide.nl</a>
                  </div>
                </li>
                <li>
                  <Icoon naam="pin" maat={18} />
                  <div>
                    <span>{t.contact.direct.post}</span>
                    Groene Weide 1
                    <br />
                    1234 AB Weideveen
                  </div>
                </li>
              </ul>
            </div>

            <div className="contactkaart contactkaart--zacht">
              <h2>{t.contact.receptie.titel}</h2>
              <dl className="tijdenlijst">
                <div>
                  <dt>{t.contact.receptie.week}</dt>
                  <dd>08:00 – 20:00</dd>
                </div>
                <div>
                  <dt>{t.contact.receptie.weekend}</dt>
                  <dd>09:00 – 18:00</dd>
                </div>
                <div>
                  <dt>{t.contact.receptie.feestdagen}</dt>
                  <dd>09:00 – 12:00</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectie sectie--stro">
        <div className="container container--smal">
          <h2 className="sectiekop">{t.contact.faq.titel}</h2>
          <div className="faq">
            {t.contact.faq.vragen.map((vraag) => (
              <details key={vraag.vraag} className="faq__item">
                <summary>
                  {vraag.vraag}
                  <span className="faq__plus" aria-hidden="true" />
                </summary>
                <p>{vraag.antwoord}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
