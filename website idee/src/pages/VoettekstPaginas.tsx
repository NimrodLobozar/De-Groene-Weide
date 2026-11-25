import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { Icoon } from '../components/Icoon'
import { api, ApiFout } from '../lib/api'
import { KoeOntsnapt } from '../components/Illustraties'

export function Toegankelijkheid() {
  const { t } = useTaal()
  return (
    <>
      <section className="paginakop paginakop--gras">
        <div className="container container--smal paginakop__binnen">
          <h1>{t.voettekst.titel}</h1>
          <p className="lead">{t.voettekst.intro}</p>
        </div>
      </section>

      <section className="sectie sectie--krap">
        <div className="container">
          <h2 className="sectiekop">{t.voettekst.onderdelenTitel}</h2>
          <div className="tabelvak">
            <table className="tabel">
              <thead>
                <tr>
                  <th scope="col">{t.voettekst.kolommen.plek}</th>
                  <th scope="col">{t.voettekst.kolommen.bereikbaar}</th>
                  <th scope="col">{t.voettekst.kolommen.voorziening}</th>
                  <th scope="col">{t.voettekst.kolommen.opmerking}</th>
                </tr>
              </thead>
              <tbody>
                {t.voettekst.onderdelen.map((rij) => (
                  <tr key={rij.plek}>
                    <th scope="row">{rij.plek}</th>
                    <td>{rij.bereikbaar}</td>
                    <td>{rij.voorziening}</td>
                    <td>{rij.opmerking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sectie sectie--stro">
        <div className="container container--smal">
          <h2 className="sectiekop">{t.voettekst.vragenTitel}</h2>
          <div className="faq">
            {t.voettekst.vragen.map((vraag) => (
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

export function Nieuwsbrief() {
  const { t, taal } = useTaal()
  const [klaar, setKlaar] = useState(false)
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)

  async function versturen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    setBezig(true)
    setFout('')
    try {
      await api.nieuwsbrief(email, taal)
      setKlaar(true)
    } catch (err) {
      setFout(err instanceof ApiFout ? err.message : 'Aanmelden lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  return (
    <section className="paginakop paginakop--gras paginakop--hoog">
      <div className="container container--smal">
        <h1>{t.nieuwsbrief.titel}</h1>
        <p className="lead">{t.nieuwsbrief.intro}</p>

        {klaar ? (
          <div className="mededeling">
            <Icoon naam="vink" maat={22} />
            <p>{t.nieuwsbrief.succes}</p>
          </div>
        ) : (
          <form className="nieuwsbriefvorm" onSubmit={versturen}>
            <label className="sr-only" htmlFor="nieuwsbrief-email">
              {t.nieuwsbrief.veld}
            </label>
            <input
              id="nieuwsbrief-email"
              name="email"
              type="email"
              required
              placeholder={t.nieuwsbrief.veld}
              className="invoer"
            />
            <button type="submit" className="knop" disabled={bezig}>
              {bezig ? 'Bezig…' : t.nieuwsbrief.knop}
            </button>
          </form>
        )}

        {fout ? <p className="fouttekst">{fout}</p> : null}

        <p className="kleineletter">{t.nieuwsbrief.akkoord}</p>
        <div className="mededeling mededeling--eigel nieuwsbrief-tip">
          <Icoon naam="kip" maat={20} />
          <p>{t.nieuwsbrief.tip}</p>
        </div>
      </div>
    </section>
  )
}

export function Privacy() {
  const { t } = useTaal()
  return (
    <>
      <section className="paginakop">
        <div className="container container--smal paginakop__binnen">
          <h1>{t.privacy.titel}</h1>
          <p className="lead">{t.privacy.intro}</p>
        </div>
      </section>
      <section className="sectie sectie--krap">
        <div className="container container--smal proza">
          {t.privacy.alineas.map((alinea) => (
            <p key={alinea.slice(0, 24)}>{alinea}</p>
          ))}
          <h2>{t.privacy.contactTitel}</h2>
          <p>
            {t.privacy.contactTekst}{' '}
            <a href="mailto:hallo@degroeneweide.nl">hallo@degroeneweide.nl</a>
          </p>
        </div>
      </section>
    </>
  )
}

export function NietGevonden() {
  const { t, link } = useTaal()
  return (
    <section className="nietgevonden">
      <div className="container nietgevonden__binnen">
        <div className="nietgevonden__tekst">
          <span className="eyebrow">{t.nietGevonden.fout}</span>
          <h1>{t.nietGevonden.titel}</h1>
          <p className="lead">{t.nietGevonden.tekst}</p>
          <div className="nietgevonden__knopjes">
            <Link className="knop" to={link('home')}>
              {t.nietGevonden.terug}
            </Link>
            <Link className="knop knop--secundair" to={link('plattegrond')}>
              {t.nav.plattegrond}
            </Link>
          </div>
        </div>
        <div className="nietgevonden__beeld">
          <KoeOntsnapt className="nietgevonden__koe" />
        </div>
      </div>
    </section>
  )
}
