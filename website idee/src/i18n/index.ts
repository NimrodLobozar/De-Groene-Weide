import { nl, type Dict } from './nl'
import { en } from './en'
import { de } from './de'

export type { Dict }

export const LANGS = ['nl', 'en', 'de'] as const
export type Lang = (typeof LANGS)[number]

export const STANDAARD_TAAL: Lang = 'nl'

export const WOORDENBOEKEN: Record<Lang, Dict> = { nl, en, de }

export const PAGE_KEYS = [
  'home',
  'terrein',
  'plattegrond',
  'reserveren',
  'evenementen',
  'overOns',
  'contact',
  'toegankelijkheid',
  'nieuwsbrief',
  'privacy',
  'admin',
] as const

export type PageKey = (typeof PAGE_KEYS)[number]

/**
 * Elke pagina heeft per taal een eigen URL, zoals in het prototype:
 * /nl/plattegrond · /en/site-map · /de/lageplan
 */
export const PADEN: Record<Lang, Record<PageKey, string>> = {
  nl: {
    home: '',
    terrein: 'terrein',
    plattegrond: 'plattegrond',
    reserveren: 'reserveren',
    evenementen: 'evenementen',
    overOns: 'over-ons',
    contact: 'contact',
    toegankelijkheid: 'toegankelijkheid',
    nieuwsbrief: 'nieuwsbrief',
    privacy: 'privacy',
    admin: 'beheer',
  },
  en: {
    home: '',
    terrein: 'farm',
    plattegrond: 'site-map',
    reserveren: 'book',
    evenementen: 'events',
    overOns: 'about',
    contact: 'contact',
    toegankelijkheid: 'accessibility',
    nieuwsbrief: 'newsletter',
    privacy: 'privacy',
    admin: 'manage',
  },
  de: {
    home: '',
    terrein: 'gelaende',
    plattegrond: 'lageplan',
    reserveren: 'buchen',
    evenementen: 'veranstaltungen',
    overOns: 'ueber-uns',
    contact: 'kontakt',
    toegankelijkheid: 'barrierefreiheit',
    nieuwsbrief: 'newsletter',
    privacy: 'datenschutz',
    admin: 'verwaltung',
  },
}

export function isTaal(waarde: string | undefined): waarde is Lang {
  return !!waarde && (LANGS as readonly string[]).includes(waarde)
}

/** Bouw een link naar een pagina in een bepaalde taal. */
export function pad(taal: Lang, pagina: PageKey, extra?: string): string {
  const slug = PADEN[taal][pagina]
  const basis = slug ? `/${taal}/${slug}` : `/${taal}`
  return extra ? `${basis}/${extra}` : basis
}

/** Zoek bij een willekeurig pad de paginasleutel, zodat de taalkeuze goed linkt. */
export function paginaVanPad(taal: Lang, padNaam: string): PageKey {
  const schoon = padNaam.replace(/^\/+|\/+$/g, '').split('/')[0]
  for (const sleutel of PAGE_KEYS) {
    if (PADEN[taal][sleutel] === schoon) return sleutel
  }
  return 'home'
}

export const TAALNAMEN: Record<Lang, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
}
