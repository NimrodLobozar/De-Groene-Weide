import { PADEN, TAALNAMEN, type Lang, type PageKey } from '../i18n'

const SITE_URL = 'https://degroeneweide.danielsturkenboom.nl'

export function bepaalPaginakKey(taal: Lang, pathname: string): PageKey {
  const relatief = pathname.replace(new RegExp(`^/${taal}/?`), '').replace(/\/$/, '')
  const eerste = relatief.split('/')[0] ?? ''
  for (const sleutel of Object.keys(PADEN[taal]) as PageKey[]) {
    if (PADEN[taal][sleutel] && PADEN[taal][sleutel] === eerste) return sleutel
  }
  return eerste ? 'home' : 'home'
}

function zetMeta(selector: string, attribute: 'name' | 'property', value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${selector}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, selector)
    document.head.appendChild(element)
  }
  element.content = value
}

function zetLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    if (hreflang) element.hreflang = hreflang
    document.head.appendChild(element)
  }
  element.href = href
}

export function updateRouteMetadata(
  taal: Lang,
  pathname: string,
  titel: string,
  beschrijving: string,
) {
  document.documentElement.lang = taal
  document.title = `${titel} — De Groene Weide`

  zetMeta('description', 'name', beschrijving)
  zetMeta('og:title', 'property', document.title)
  zetMeta('og:description', 'property', beschrijving)
  zetMeta('og:type', 'property', 'website')
  zetMeta('og:locale', 'property', taal === 'nl' ? 'nl_NL' : taal === 'en' ? 'en_GB' : 'de_DE')
  zetMeta('og:image', 'property', `${SITE_URL}/og-image.svg`)
  zetMeta('twitter:card', 'name', 'summary_large_image')

  const canonical = `${SITE_URL}${pathname}`
  zetLink('canonical', canonical)

  for (const alternatieveTaal of ['nl', 'en', 'de'] as Lang[]) {
    const sleutel = bepaalPaginakKey(taal, pathname)
    const alternatievePad = PADEN[alternatieveTaal][sleutel]
    zetLink(
      'alternate',
      `${SITE_URL}/${alternatieveTaal}${alternatievePad ? `/${alternatievePad}` : ''}`,
      alternatieveTaal,
    )
  }
}
