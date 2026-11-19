import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTaal } from '../i18n/context'
import { LANGS, PADEN, TAALNAMEN, paginaVanPad, type PageKey } from '../i18n'
import { useApp } from '../store/App'
import { Icoon } from './Icoon'
import { KipIcoon } from './Illustraties'

const NAV = [
  'home',
  'terrein',
  'plattegrond',
  'reserveren',
  'evenementen',
  'overOns',
  'contact',
] as const satisfies readonly PageKey[]

const TAAL_KORT: Record<string, string> = { nl: 'NL', en: 'EN', de: 'DE' }

function Taalkeuze({ compact = false }: { compact?: boolean }) {
  const { taal, t } = useTaal()
  const locatie = useLocation()
  const [open, setOpen] = useState(false)
  const huidigePagina = paginaVanPad(taal, locatie.pathname.replace(`/${taal}`, ''))

  if (compact) {
    return (
      <div className="mobiel-menu__taal">
        <span>{t.taalkeuze ?? 'Taal · Language · Sprache'}</span>
        {LANGS.map((lg) => (
          <Link
            key={lg}
            to={`/${lg}/${PADEN[lg][huidigePagina]}`.replace(/\/$/, '') || `/${lg}`}
            className="chip"
            aria-current={lg === taal}
          >
            {TAALNAMEN[lg]}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="taalkeuze">
      <button
        type="button"
        className="taalkeuze__knop"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      >
        {TAAL_KORT[taal] ?? taal.toUpperCase()}
        <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">
          <path d="M1 1.5 5 5.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      {open ? (
        <div className="taalkeuze__lijst" role="menu">
          {LANGS.map((lg) => (
            <Link
              key={lg}
              role="menuitem"
              to={`/${lg}/${PADEN[lg][huidigePagina]}`.replace(/\/$/, '') || `/${lg}`}
              aria-current={lg === taal}
            >
              <span>{TAALNAMEN[lg]}</span>
              <span aria-hidden="true">{TAAL_KORT[lg]}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Rustknop() {
  const { t } = useTaal()
  const { rust, zetRust } = useApp()
  return (
    <button
      type="button"
      className="rustknop"
      aria-pressed={rust}
      title={t.rustknop.uitleg}
      onClick={() => zetRust(!rust)}
    >
      <span className="rustknop__bol" aria-hidden="true" />
      {t.rustknop.label}
    </button>
  )
}

export function SiteKop() {
  const { t, link, taal } = useTaal()
  const { meldingenWeg, sluitMelding, config } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const locatie = useLocation()
  const eersteRender = useRef(true)

  // De meldingen uit het beheer, elk in de taal van de bezoeker. Wat oud is of
  // weggeklikt is, blijft weg — ook na een herlaadbeurt.
  const meldingen = (config?.meldingen ?? []).filter((m) => !meldingenWeg.includes(m.id))

  const tekstVan = (m: { nl: string; en: string; de: string }) =>
    taal === 'nl' ? m.nl : taal === 'en' ? m.en || m.nl : m.de || m.nl

  useEffect(() => {
    if (eersteRender.current) {
      eersteRender.current = false
      return
    }
    setMenuOpen(false)
  }, [locatie.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const opEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', opEsc)
    return () => document.removeEventListener('keydown', opEsc)
  }, [menuOpen])

  return (
    <>
      {meldingen.map((melding) => (
        <div key={melding.id} className={`aankondiging aankondiging--${melding.soort}`}>
          <div className="aankondiging__binnen">
            <span>{tekstVan(melding)}</span>
            <button
              type="button"
              className="aankondiging__sluit"
              aria-label={t.aankondiging.sluit}
              onClick={() => sluitMelding(melding.id)}
            >
              <Icoon naam="kruis" maat={14} />
            </button>
          </div>
        </div>
      ))}

      <header className="site-kop">
        <div className="container site-kop__balk">
          <Link to={link('home')} className="logo" aria-label={t.merk.naam}>
            <KipIcoon />
            <span>{t.merk.naam}</span>
          </Link>

          <nav className="hoofdnav" aria-label="Hoofdmenu">
            <ul>
              {NAV.map((pagina) => (
                <li key={pagina}>
                  <NavLink to={link(pagina)} end={pagina === 'home'}>
                    {t.nav[pagina]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="menuknop"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icoon naam={menuOpen ? 'kruis' : 'menu'} maat={18} />
            {menuOpen ? t.nav.sluitMenu : t.nav.menu}
          </button>
        </div>

        <div className="container site-kop__hulp">
          <Taalkeuze />
          <Rustknop />
        </div>

        {menuOpen ? (
          <div className="mobiel-menu">
            <div className="container mobiel-menu__paneel">
              <ul>
                {NAV.map((pagina) => (
                  <li key={pagina}>
                    <Link to={link(pagina)} aria-current={undefined}>
                      {t.nav[pagina]}
                      <Icoon naam="pijl" maat={18} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Taalkeuze compact />
              <div>
                <Rustknop />
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  )
}

export function SiteVoet() {
  const { t, link, taal } = useTaal()
  return (
    <footer className="site-voet">
      <div className="container site-voet__hoofd">
        <Link to={link('home')} className="site-voet__merk">
          <KipIcoon />
          {t.merk.naam}
        </Link>
        <nav className="site-voet__links" aria-label="Voettekst">
          <Link to={link('toegankelijkheid')}>{t.voettekst.linkLabel}</Link>
          <Link to={link('nieuwsbrief')}>{t.nieuwsbrief.titel}</Link>
          <Link to={link('privacy')}>{t.privacy.titel}</Link>
        </nav>
      </div>
      <div className="container site-voet__onder">
        <span>
          © {new Date().getFullYear()} {t.merk.naam} · {t.merk.slogan}
        </span>
        <span>{TAALNAMEN[taal]}</span>
      </div>
    </footer>
  )
}

export function CookieBanner() {
  const { t } = useTaal()
  const { cookie, zetCookie } = useApp()

  if (cookie !== null) return null

  return (
    <div className="cookiebanner" role="dialog" aria-label={t.cookie.titel}>
      <p className="cookiebanner__kop">{t.cookie.titel}</p>
      <p className="cookiebanner__tekst">{t.cookie.tekst}</p>
      <div className="cookiebanner__acties">
        <button type="button" className="knop knop--klein" onClick={() => zetCookie('ja')}>
          {t.cookie.accepteren}
        </button>
        <button
          type="button"
          className="knop knop--secundair knop--klein"
          onClick={() => zetCookie('nee')}
        >
          {t.cookie.weigeren}
        </button>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="pagina">
      <a className="overslaan" href="#inhoud">
        Direct naar de inhoud
      </a>
      <SiteKop />
      <main id="inhoud" key={pathname}>
        {children}
      </main>
      <SiteVoet />
      <CookieBanner />
    </div>
  )
}
