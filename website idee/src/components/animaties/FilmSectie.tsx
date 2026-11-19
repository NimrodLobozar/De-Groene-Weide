import { useEffect, useRef, useState } from 'react'
import { useTaal } from '../../i18n/context'
import { useApp } from '../../store/App'
import { ANIMATIES, type Animatie } from '../../data/animaties'
import { Icoon } from '../Icoon'

/**
 * De films van het animatieteam, met een preview in een echt venster.
 *
 * Een klik op de kaart opent de film meteen. Staat de rustknop aan, dan wacht
 * de film op een tweede, bewuste klik — de rustknop wint dus ook hier.
 */
export function FilmSectie() {
  const { t } = useTaal()
  const { rust } = useApp()
  const [actief, setActief] = useState<Animatie | null>(null)
  const [ronde, setRonde] = useState(0)
  const [systeemRust, setSysteemRust] = useState(false)
  const venster = useRef<HTMLDialogElement>(null)

  const teksten = t.evenementen.animaties

  useEffect(() => {
    const vraag = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSysteemRust(vraag.matches)
    const luister = (gebeurtenis: MediaQueryListEvent) => setSysteemRust(gebeurtenis.matches)
    vraag.addEventListener('change', luister)
    return () => vraag.removeEventListener('change', luister)
  }, [])

  useEffect(() => {
    const dialoog = venster.current
    if (!dialoog) return
    if (actief && !dialoog.open) dialoog.showModal()
    if (!actief && dialoog.open) dialoog.close()
  }, [actief])

  useEffect(() => {
    if (actief) return
    setRonde(0)
  }, [actief])

  useEffect(() => {
    if (!actief) return
    const vorige = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = vorige
    }
  }, [actief])

  if (!ANIMATIES.length) return null

  const sluit = () => venster.current?.close()
  const actiefTeksten = actief
    ? teksten.films[actief.id as keyof typeof teksten.films]
    : null
  const wachtOpStart = rust || systeemRust

  return (
    <section className="sectie sectie--krap sectie--stro film-sectie" id="animaties">
      <div className="container">
        <div className="sectiekop">
          <span className="eyebrow">{teksten.eyebrow}</span>
          <h2>{teksten.titel}</h2>
          <p className="sectiekop__intro">{teksten.intro}</p>
        </div>

        <div className="filmrij">
          {ANIMATIES.map((film) => {
            const filmTeksten = teksten.films[film.id as keyof typeof teksten.films]
            if (!filmTeksten) return null
            return (
              <article className="filmkaart" key={film.id}>
                <button
                  type="button"
                  className="filmkaart__beeld"
                  onClick={() => setActief(film)}
                  aria-label={`${teksten.bekijk}: ${filmTeksten.titel}`}
                >
                  <img
                    src={film.poster}
                    alt=""
                    width={1120}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="filmkaart__duur">
                    {film.duur} {teksten.seconden}
                  </span>
                  <span className="filmkaart__speel" aria-hidden="true">
                    <Icoon naam="speel" maat={26} gevuld />
                  </span>
                </button>

                <div className="filmkaart__tekst">
                  <span className="label label--eigel">{filmTeksten.label}</span>
                  <h3>{filmTeksten.titel}</h3>
                  <p>{filmTeksten.beschrijving}</p>
                  <button type="button" className="knop" onClick={() => setActief(film)}>
                    {teksten.bekijk}
                    <Icoon naam="pijl" maat={18} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <dialog
        ref={venster}
        className="filmvenster"
        aria-labelledby="filmvenster-titel"
        onClose={() => setActief(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) sluit()
        }}
      >
        {actief && actiefTeksten ? (
          <div className="filmvenster__binnen">
            <header className="filmvenster__kop">
              <div>
                <span className="eyebrow">{teksten.eyebrow}</span>
                <h2 id="filmvenster-titel">{actiefTeksten.titel}</h2>
              </div>
              <button
                type="button"
                className="filmvenster__sluit"
                onClick={sluit}
                aria-label={teksten.sluiten}
              >
                <Icoon naam="kruis" maat={18} />
              </button>
            </header>

            <div className="filmvenster__beeld">
              {wachtOpStart && ronde === 0 ? (
                <div className="filmvenster__rust">
                  <img src={actief.poster} alt="" />
                  <div className="filmvenster__rustpaneel">
                    <p>{teksten.rust}</p>
                    <button
                      type="button"
                      className="knop"
                      onClick={() => setRonde((huidig) => huidig + 1)}
                    >
                      <Icoon naam="speel" maat={18} gevuld />
                      {teksten.start}
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  key={`${actief.id}-${ronde}`}
                  src={actief.bestand}
                  title={actiefTeksten.titel}
                  allow="autoplay; fullscreen"
                />
              )}
            </div>

            <footer className="filmvenster__voet">
              <span className="filmvenster__meta">
                {actief.duur} {teksten.seconden}
              </span>
              <div className="filmvenster__acties">
                {wachtOpStart && ronde === 0 ? null : (
                  <button
                    type="button"
                    className="knop knop--secundair knop--klein"
                    onClick={() => setRonde((huidig) => huidig + 1)}
                  >
                    <Icoon naam="speel" maat={15} gevuld />
                    {teksten.opnieuw}
                  </button>
                )}
                <a
                  className="filmvenster__link"
                  href={actief.bestand}
                  target="_blank"
                  rel="noreferrer"
                >
                  {teksten.nieuwTabblad}
                </a>
              </div>
            </footer>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
