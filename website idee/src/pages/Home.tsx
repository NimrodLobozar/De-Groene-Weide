import { Link } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { useApp } from '../store/App'
import { HeroErf, KaartVlak, KipIcoon } from '../components/Illustraties'
import { Foto } from '../components/Foto'
import { Icoon, type IcoonNaam } from '../components/Icoon'

const SOORT_ICOON: Record<string, IcoonNaam> = {
  dieren: 'kip',
  spelen: 'tractor',
  water: 'water',
  eten: 'eten',
}

const FOTO_SLEUTELS = ['kippen', 'speelweide', 'zwembad', 'kantine']

export function Home() {
  const { events } = useApp()
  const { t, link, taal } = useTaal()
  const uitgelicht = events.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__binnen">
          <div className="hero__tekst">
            <span className="eyebrow">{t.home.hero.eyebrow}</span>
            <h1 className="hero__titel">{t.home.hero.titel}</h1>
            <p className="hero__intro">{t.home.hero.intro}</p>
            <div className="hero__knopjes">
              <Link className="knop" to={link('reserveren')}>
                {t.knoppen.boek}
              </Link>
              <a
                className="knop knop--secundair"
                href="https://www.google.com/maps/search/?api=1&query=Groene+Weide+1+Weideveen"
                target="_blank"
                rel="noreferrer"
              >
                {t.knoppen.planRoute}
              </a>
            </div>
          </div>

          <div className="hero__beeld">
            <HeroErf className="hero__illustratie" />
            <div className="grapkaartje">
              <span className="grapkaartje__label">{t.home.hero.grapLabel}</span>
              <p className="grapkaartje__tekst">{t.home.hero.grap}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terrein & activiteiten */}
      <section className="sectie">
        <div className="container">
          <div className="koprij">
            <div>
              <span className="eyebrow">{t.home.terrein.eyebrow}</span>
              <h2>{t.home.terrein.titel}</h2>
            </div>
            <Link className="pijllink" to={link('terrein')}>
              {t.home.terrein.link}
            </Link>
          </div>

          <div className="kaartenrij kaartenrij--4">
            {t.home.terrein.kaarten.map((kaart, index) => (
              <article key={kaart.titel} className="kaart activiteit">
                <Foto sleutel={FOTO_SLEUTELS[index] ?? 'kippen'} label={kaart.foto} className="activiteit__foto" />
                <div className="kaart__body">
                  <h3 className="kaart__titel">{kaart.titel}</h3>
                  <p className="kaart__tekst">{kaart.tekst}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Plekadvies */}
      <section className="sectie sectie--krap">
        <div className="container">
          <div className="adviesbalk">
            <div className="adviesbalk__kip" aria-hidden="true">
              <KipIcoon />
            </div>
            <div className="adviesbalk__tekst">
              <span className="adviesbalk__label">{t.home.plekadvies.eyebrow}</span>
              <h3 className="adviesbalk__titel">{t.home.plekadvies.titel}</h3>
              <p>{t.home.plekadvies.tekst}</p>
            </div>
            <Link className="knop adviesbalk__knop" to={link('reserveren', 'stap-2')}>
              {t.knoppen.vraagDeKip}
            </Link>
          </div>
        </div>
      </section>

      {/* Evenementen */}
      <section className="sectie">
        <div className="container">
          <div className="koprij">
            <div>
              <span className="eyebrow">{t.home.evenementen.eyebrow}</span>
              <h2>{t.home.evenementen.titel}</h2>
            </div>
            <Link className="pijllink" to={link('evenementen')}>
              {t.knoppen.heleAgenda}
            </Link>
          </div>

          <div className="kaartenrij kaartenrij--3">
            {uitgelicht.map((ev) => (
              <article key={`${ev.dag}-${ev.tijd}`} className="kaart evenement">
                <div className="evenement__icoon" aria-hidden="true">
                  <Icoon naam={SOORT_ICOON[ev.soort] ?? 'ster'} maat={20} />
                </div>
                <div>
                  <p className="evenement__titel">{taal === 'en' ? ev.titel_en || ev.titel_nl : taal === 'de' ? ev.titel_de || ev.titel_nl : ev.titel_nl}</p>
                  <p className="evenement__meta">
                    {t.evenementen.dagen[ev.dag]} {ev.tijd} · {ev.locatie} · {ev.leeftijd}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Zo vind je ons */}
      <section className="sectie sectie--stro">
        <div className="container vindons">
          <div className="vindons__kaart">
            <KaartVlak className="vindons__vlak" label={t.home.vindons.kaart} />
          </div>
          <div className="vindons__tekst">
            <h2>{t.home.vindons.titel}</h2>
            <dl className="gegevenslijst">
              <div>
                <dt>{t.home.vindons.adresLabel}</dt>
                <dd>
                  {t.home.vindons.adres.split('\n').map((regel) => (
                    <span key={regel}>
                      {regel}
                      <br />
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{t.home.vindons.tijdenLabel}</dt>
                <dd>{t.home.vindons.tijden}</dd>
              </div>
            </dl>
            <p className="vindons__seizoen">{t.home.vindons.seizoen}</p>
            <div className="vindons__knopjes">
              <a
                className="knop"
                href="https://www.google.com/maps/search/?api=1&query=Groene+Weide+1+Weideveen"
                target="_blank"
                rel="noreferrer"
              >
                {t.knoppen.planRoute}
              </a>
              <Link className="knop knop--secundair" to={link('contact')}>
                {t.knoppen.stuurBericht}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
