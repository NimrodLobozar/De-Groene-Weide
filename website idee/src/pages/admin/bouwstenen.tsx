/** Kleine bouwstenen die elke beheerpagina gebruikt. */
import { useState, type ReactNode } from 'react'
import { useTaal } from '../../i18n/context'
import { ApiFout } from '../../lib/api'

export function Kop({
  titel,
  intro,
  actie,
}: {
  titel: string
  intro: string
  actie?: ReactNode
}) {
  return (
    <div className="beheer__kop">
      <div>
        <h1>{titel}</h1>
        <p className="kaart__tekst">{intro}</p>
      </div>
      {actie}
    </div>
  )
}

export function Veld({
  label,
  children,
  breed = false,
}: {
  label: string
  children: ReactNode
  breed?: boolean
}) {
  return (
    <label className={`veld${breed ? ' veld--breed' : ''}`}>
      <span className="veld__label">{label}</span>
      {children}
    </label>
  )
}

export function Formulier({
  titel,
  open,
  onSluit,
  onVerstuur,
  children,
  bezig,
}: {
  titel: string
  open: boolean
  onSluit: () => void
  onVerstuur: () => void
  children: ReactNode
  bezig?: boolean
}) {
  const { t } = useTaal()
  if (!open) return null
  return (
    <form
      className="beheerpaneel formulier"
      onSubmit={(e) => {
        e.preventDefault()
        onVerstuur()
      }}
    >
      <h2 className="beheerpaneel__kop">{titel}</h2>
      <div className="formulier__velden">{children}</div>
      <div className="beheer__pijlen">
        <button type="submit" className="knop knop--klein" disabled={bezig}>
          {t.knoppen.opslaan}
        </button>
        <button type="button" className="knop knop--klein knop--secundair" onClick={onSluit}>
          {t.knoppen.annuleer}
        </button>
      </div>
    </form>
  )
}

export function useMelding() {
  const [fout, setFout] = useState('')
  const [goed, setGoed] = useState('')
  return {
    fout,
    goed,
    setFout,
    setGoed,
    meldFout: (e: unknown, standaard = 'Er ging iets mis.') =>
      setFout(e instanceof ApiFout ? e.message : standaard),
    wissen: () => {
      setFout('')
      setGoed('')
    },
  }
}
