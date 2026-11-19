import { useMemo, type CSSProperties } from 'react'
import type { Plek } from '../data/camping'
import { useTaal } from '../i18n/context'
import { useApp } from '../store/App'
import { Icoon, type IcoonNaam } from './Icoon'

const ICOON_PER_SOORT: Record<string, IcoonNaam> = {
  dieren: 'kip',
  water: 'water',
  spelen: 'tractor',
  eten: 'eten',
  sanitair: 'douche',
  receptie: 'kaart',
}

interface Props {
  van: string
  tot: string
  gekozen?: string | null
  tip?: string | null
  onKies?: (plek: Plek) => void
  actieveVoorziening?: string | null
  onVoorziening?: (id: string) => void
  toonLegenda?: boolean
  klein?: boolean
}

export function Plekkenkaart({
  van,
  tot,
  gekozen = null,
  tip = null,
  onKies,
  actieveVoorziening = null,
  onVoorziening,
  toonLegenda = true,
  klein = false,
}: Props) {
  const { t } = useTaal()
  const { vrijePlekken, plekken, voorzieningen } = useApp()

  const vrij = useMemo(() => {
    const set = new Set(vrijePlekken(van, tot))
    if (!van || !tot) {
      plekken.filter((p) => p.status === 'open').forEach((p) => set.add(p.id))
    }
    return set
  }, [van, tot, vrijePlekken, plekken])

  const status = (p: Plek) => {
    if (p.status !== 'open') return 'geblokkeerd'
    if (p.id === gekozen) return 'keuze'
    if (!vrij.has(p.id)) return 'bezet'
    if (p.id === tip) return 'tip'
    return 'vrij'
  }

  const cel = (p: Plek, index: number) => {
    const s = status(p)
    const klikbaar = s !== 'bezet' && s !== 'geblokkeerd'
    return (
      <button
        key={p.id}
        type="button"
        className={`plek plek--${s}${klikbaar ? ' plek--klikbaar' : ''}`}
        style={{ '--i': index } as CSSProperties}
        onClick={() => klikbaar && onKies?.(p)}
        aria-pressed={p.id === gekozen}
        aria-label={p.id}
        title={p.id}
        disabled={!klikbaar}
      >
        <span className="plek__nr">{p.id}</span>
      </button>
    )
  }

  const weide = (letter: 'A' | 'B' | 'C' | 'S') => plekken.filter((p) => p.weide === letter)

  const voorzieningBlok = (id: string, groot = false) => {
    const v = voorzieningen.find((x) => x.id === id)
    if (!v) return null
    const info = (t.plattegrond.voorzieningen as Record<string, { naam: string; kort: string }>)[id]
    const actief = actieveVoorziening === id
    return (
      <button
        key={id}
        type="button"
        className={`erfvak erfvak--${v.soort}${groot ? ' erfvak--groot' : ''}${actief ? ' is-actief' : ''}${
          v.open ? '' : ' is-dicht'
        }`}
        onClick={() => onVoorziening?.(id)}
        title={v.naam}
      >
        <Icoon naam={ICOON_PER_SOORT[v.soort] ?? 'kaart'} maat={groot ? 26 : 18} />
        <span>{groot ? info?.naam ?? v.naam : info?.kort ?? v.kort ?? v.naam}</span>
      </button>
    )
  }

  const zichtbaar = voorzieningen.filter((v) => v.open === 1)
  const groteBlokken = zichtbaar.filter((v) => v.soort === 'spelen')
  const kleineBlokken = zichtbaar.filter((v) => v.soort !== 'spelen')

  return (
    <div className={`plekkenkaart${klein ? ' plekkenkaart--klein' : ''}`}>
      <div className="plekkenkaart__rij plekkenkaart__rij--boven">
        <div className="weide weide--a">
          <span className="weide__kop">{t.plattegrond.weides.a}</span>
          <div className="weide__grid weide__grid--6">{weide('A').map((p, i) => cel(p, i))}</div>
        </div>

        <div className="plekkenkaart__midden">
          {groteBlokken.map((v) => voorzieningBlok(v.id, true))}
          <div className="plekkenkaart__pois">
            {kleineBlokken.map((v) => voorzieningBlok(v.id))}
          </div>
        </div>

        <div className="weide weide--b">
          <span className="weide__kop">{t.plattegrond.weides.b}</span>
          <div className="weide__grid weide__grid--6">{weide('B').map((p, i) => cel(p, i))}</div>
        </div>
      </div>

      <div className="plekkenkaart__rij plekkenkaart__rij--onder">
        <div className="weide weide--c">
          <span className="weide__kop">{t.plattegrond.weides.c}</span>
          <div className="weide__grid weide__grid--6">{weide('C').map((p, i) => cel(p, i))}</div>
        </div>
        <div className="weide weide--s">
          <span className="weide__kop">{t.plattegrond.weides.s}</span>
          <div className="weide__grid weide__grid--4">{weide('S').map((p, i) => cel(p, i))}</div>
        </div>
      </div>

      {toonLegenda ? (
        <div className="plekkenkaart__legenda">
          {(
            [
              ['vrij', t.reserveren.stap4.status.vrij],
              ['bezet', t.reserveren.stap4.status.bezet],
              ['geblokkeerd', t.reserveren.stap4.status.geblokkeerd],
              ['keuze', t.reserveren.stap4.status.keuze],
              ['tip', t.reserveren.stap4.status.tip],
            ] as const
          ).map(([sleutel, label]) => (
            <span key={sleutel} className="legenda-item">
              <span className={`legenda-stip legenda-stip--${sleutel}`} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
