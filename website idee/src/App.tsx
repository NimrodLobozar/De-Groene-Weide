import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { PADEN, STANDAARD_TAAL, isTaal, type Dict, type Lang, type PageKey } from './i18n'
import { TaalProvider } from './i18n/context'
import { AppProvider, useApp } from './store/App'
import { useAnimaties } from './lib/animaties'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Terrein } from './pages/Terrein'
import { Plattegrond } from './pages/Plattegrond'
import { Evenementen } from './pages/Evenementen'
import { OverOns } from './pages/OverOns'
import { Contact } from './pages/Contact'
import { Nieuwsbrief, NietGevonden, Privacy, Toegankelijkheid } from './pages/VoettekstPaginas'
import { Reserveer } from './pages/Reserveer'
import { Admin } from './pages/admin/Admin'
import { bepaalPaginakKey, updateRouteMetadata } from './lib/metadata'

function paginatitel(tekst: Dict, taal: Lang, sleutel: PageKey): string {
  if (sleutel === 'home') return tekst.merk.naam
  if (sleutel === 'overOns') return tekst.nav.overOns
  if (sleutel === 'plattegrond') return tekst.nav.plattegrond
  if (sleutel === 'reserveren') return tekst.nav.reserveren
  if (sleutel === 'evenementen') return tekst.nav.evenementen
  if (sleutel === 'toegankelijkheid') return taal === 'nl' ? 'Toegankelijkheid' : taal === 'en' ? 'Accessibility' : 'Barrierefreiheit'
  if (sleutel === 'nieuwsbrief') return taal === 'nl' ? 'Nieuwsbrief' : 'Newsletter'
  if (sleutel === 'privacy') return taal === 'nl' ? 'Privacy' : taal === 'en' ? 'Privacy' : 'Datenschutz'
  if (sleutel === 'admin') return tekst.nav.admin
  return tekst.nav[sleutel as 'terrein' | 'contact']
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to={`/${STANDAARD_TAAL}`} replace />} />
          <Route path="/:lang/*" element={<TaalRoutes />} />
          <Route path="*" element={<Navigate to={`/${STANDAARD_TAAL}`} replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

function TaalRoutes() {
  const { lang } = useParams()
  const locatie = useLocation()
  const taal = isTaal(lang) ? lang : STANDAARD_TAAL
  const paden = PADEN[taal]
  const isBeheer = locatie.pathname.startsWith(`/${taal}/${paden.admin}`)
  const { woordenboeken } = useApp()

  useAnimaties(locatie.pathname)

  useEffect(() => {
    if (!isBeheer) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [locatie.pathname, isBeheer])

  useEffect(() => {
    if (!isTaal(lang)) return
    const sleutel = bepaalPaginakKey(taal, locatie.pathname)
    const tekst = woordenboeken[taal]
    const titel = paginatitel(tekst, taal, sleutel)
    updateRouteMetadata(
      taal,
      locatie.pathname,
      titel,
      sleutel === 'home'
        ? tekst.merk.beschrijving
        : `${titel} — ${tekst.merk.beschrijving}`,
    )
  }, [taal, lang, locatie.pathname, woordenboeken])

  if (!isTaal(lang)) {
    return <Navigate to={`/${STANDAARD_TAAL}${locatie.pathname}`} replace />
  }

  const beheer = (
    <Routes>
      <Route path={`${paden.admin}/*`} element={<Admin />} />
    </Routes>
  )

  const site = (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path={paden.terrein} element={<Terrein />} />
        <Route path={paden.plattegrond} element={<Plattegrond />} />
        <Route path={`${paden.reserveren}/*`} element={<Reserveer />} />
        <Route path={paden.evenementen} element={<Evenementen />} />
        <Route path={paden.overOns} element={<OverOns />} />
        <Route path={paden.contact} element={<Contact />} />
        <Route path={paden.toegankelijkheid} element={<Toegankelijkheid />} />
        <Route path={paden.nieuwsbrief} element={<Nieuwsbrief />} />
        <Route path={paden.privacy} element={<Privacy />} />
        <Route path="*" element={<NietGevonden />} />
      </Routes>
    </Layout>
  )

  return (
    <TaalProvider taal={taal} woordenboeken={woordenboeken}>
      {isBeheer ? beheer : site}
    </TaalProvider>
  )
}
