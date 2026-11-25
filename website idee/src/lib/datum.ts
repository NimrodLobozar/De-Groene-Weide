import { uitIso } from '../data/camping'

export function datumKort(dag: string, taal: string): string {
  if (!dag) return '—'
  return new Intl.DateTimeFormat(taal, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(uitIso(dag))
}

export function datumLang(dag: string, taal: string): string {
  if (!dag) return '—'
  return new Intl.DateTimeFormat(taal, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(uitIso(dag))
}

export function maandLabel(jaar: number, maand: number, taal: string): string {
  const label = new Intl.DateTimeFormat(taal, { month: 'long', year: 'numeric' }).format(
    new Date(jaar, maand, 1),
  )
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function weekdagKort(taal: string): string[] {
  const basis = new Date(2024, 0, 1) // maandag
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(basis)
    d.setDate(basis.getDate() + i)
    return new Intl.DateTimeFormat(taal, { weekday: 'short' }).format(d)
  })
}

export function prijs(bedrag: number, taal: string): string {
  return new Intl.NumberFormat(taal === 'nl' ? 'nl-NL' : taal === 'de' ? 'de-DE' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(bedrag)
}

export function prijsExact(bedrag: number, taal: string): string {
  return new Intl.NumberFormat(taal === 'nl' ? 'nl-NL' : taal === 'de' ? 'de-DE' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(bedrag)
}

/** Dagen van een maand die binnen het seizoen vallen. */
export function maandDagen(jaar: number, maand: number): string[] {
  const dagen: string[] = []
  const d = new Date(jaar, maand, 1)
  while (d.getMonth() === maand) {
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const dag = `${d.getDate()}`.padStart(2, '0')
    dagen.push(`${d.getFullYear()}-${m}-${dag}`)
    d.setDate(d.getDate() + 1)
  }
  return dagen
}

/** Maandag = 0. */
export function weekdagIndex(dag: string): number {
  return (uitIso(dag).getDay() + 6) % 7
}
