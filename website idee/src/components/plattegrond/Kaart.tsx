import type { KeyboardEvent, ReactNode } from 'react'
import { ZONE_IDS, type ZoneId } from '../../data/plattegrond'
import { useTaal } from '../../i18n/context'
import { VAKKEN, uitsnedeVoor } from './vakken'

interface ZoneProps {
  id: ZoneId
  label: string
  fill: string
  aantal: number
  actief: boolean
  interactief: boolean
  dashed?: boolean
  ghost?: boolean
  rx?: number
  onKies?: (zone: ZoneId) => void
  children: ReactNode
}

/** Eén plek: de rechthoek met de rand, de tekening erin en het gele bolletje. */
function Zone({
  id,
  label,
  fill,
  aantal,
  actief,
  interactief,
  dashed = false,
  ghost = false,
  rx = 18,
  onKies,
  children,
}: ZoneProps) {
  const { t } = useTaal()
  const vak = VAKKEN[id]
  const kaart = t.plattegrond.kaart
  const beschrijving =
    aantal === 0
      ? label
      : aantal === 1
        ? `${label}${kaart.zoneAantalEen}`
        : `${label}${kaart.zoneAantal.replace('{aantal}', String(aantal))}`

  function toets(event: KeyboardEvent<SVGGElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onKies?.(id)
    }
  }

  const knopproppen = interactief
    ? {
        'data-zone': id,
        tabIndex: 0,
        role: 'button',
        'aria-pressed': actief,
        'aria-label': beschrijving,
        onClick: () => onKies?.(id),
        onKeyDown: toets,
      }
    : { 'aria-hidden': true as const }

  return (
    <g className={`zone${actief ? ' is-active' : ''}`} {...knopproppen}>
      <rect
        className={`zone-bg${dashed ? ' zone-dashed' : ''}${ghost ? ' zone-ghost' : ''}`}
        x={vak.x}
        y={vak.y}
        width={vak.w}
        height={vak.h}
        rx={rx}
        fill={fill}
      />
      {children}
      {aantal > 0 ? (
        <g
          className="zone-badge"
          aria-hidden="true"
          transform={`translate(${vak.x + vak.w - 2} ${vak.y + 2})`}
        >
          <circle r={15} />
          <text y={5.5}>{aantal}</text>
        </g>
      ) : null}
    </g>
  )
}

interface ErfProps {
  actief?: ZoneId | null
  aantallen?: Record<ZoneId, number>
  onKies?: (zone: ZoneId) => void
}

/** Het erf zelf: de weg, de haag, de paden en alle plekken. */
function Erf({ actief = null, aantallen, onKies }: ErfProps) {
  const { t } = useTaal()
  const zones = t.plattegrond.zones
  const kaart = t.plattegrond.kaart
  const interactief = Boolean(onKies)

  const maak = (id: ZoneId) => ({
    id,
    label: zones[id].label,
    aantal: aantallen?.[id] ?? 0,
    actief: actief === id,
    interactief,
    onKies,
  })

  return (
    <>
      {/* De provinciale weg langs het erf */}
      <rect x="0" y="676" width="1000" height="44" fill="#656B67" />
      <path d="M0 698h560M748 698h252" stroke="#F7F2E7" strokeWidth="3" strokeDasharray="22 18" />
      <text x="654" y="704" className="map-road">
        {kaart.weg}
      </text>

      {/* Het erf met de haag eromheen */}
      <rect x="8" y="8" width="984" height="660" rx="40" fill="#4E7E36" />
      <rect x="26" y="26" width="948" height="624" rx="28" fill="#93B868" />
      <g fill="#3F6B2E">
        <circle cx="30" cy="30" r="18" />
        <circle cx="970" cy="30" r="18" />
        <circle cx="970" cy="646" r="18" />
        <circle cx="30" cy="646" r="18" />
        <circle cx="500" cy="18" r="14" />
        <circle cx="740" cy="18" r="12" />
        <circle cx="18" cy="440" r="12" />
        <circle cx="982" cy="300" r="12" />
      </g>

      {/* De paden */}
      <g fill="#E8D9B5">
        <rect x="26" y="240" width="948" height="38" />
        <rect x="26" y="438" width="948" height="36" />
        <rect x="482" y="26" width="18" height="216" />
        <rect x="722" y="26" width="18" height="216" />
        <rect x="282" y="472" width="46" height="206" />
      </g>

      {/* Kampeerveld */}
      <Zone {...maak('kampeerveld')} fill="#A9C97C">
        <text x="256" y="84" className="map-label">
          {zones.kampeerveld.label}
        </text>
        <g>
          <path d="M92 150l16-24 16 24Z" fill="#E9C46A" />
          <path d="M168 196l16-24 16 24Z" fill="#C7613F" />
          <path d="M236 132l16-24 16 24Z" fill="#5C7C8A" />
          <path d="M346 186l16-24 16 24Z" fill="#E9C46A" />
          <path d="M402 128l16-24 16 24Z" fill="#C7613F" />
          <path d="M110 210l14-20 14 20Z" fill="#5C7C8A" />
          <rect
            x="300"
            y="122"
            width="40"
            height="22"
            rx="10"
            fill="#FBF8F1"
            stroke="#CFC6B4"
            strokeWidth="2"
          />
        </g>
        <circle cx="300" cy="196" r="18" fill="#4E7E36" />
        <circle cx="440" cy="206" r="12" fill="#4E7E36" />
      </Zone>

      {/* Camperveld */}
      <Zone {...maak('camperveld')} fill="#A9C97C">
        <text x="612" y="84" className="map-label map-label-sm">
          {zones.camperveld.label}
        </text>
        <g>
          <rect x="534" y="112" width="58" height="26" rx="7" fill="#FBF8F1" stroke="#CFC6B4" strokeWidth="2" />
          <rect x="536" y="126" width="54" height="4" fill="#5C7C8A" />
          <rect x="606" y="176" width="58" height="26" rx="7" fill="#FBF8F1" stroke="#CFC6B4" strokeWidth="2" />
          <rect x="608" y="190" width="54" height="4" fill="#5C7C8A" />
        </g>
        <circle cx="676" cy="126" r="16" fill="#4E7E36" />
      </Zone>

      {/* Achterste veld met de safaritenten */}
      <Zone {...maak('achterste')} fill="#B3CF85" dashed>
        <text x="855" y="84" className="map-label map-label-sm">
          {zones.achterste.label}
        </text>
        <g fill="#EDE0C4" stroke="#BFA979" strokeWidth="2">
          <path d="M776 140l10-12h24l10 12v18h-44z" />
          <path d="M834 140l10-12h24l10 12v18h-44z" />
          <path d="M892 140l10-12h24l10 12v18h-44z" />
          <path d="M776 196l10-12h24l10 12v18h-44z" />
          <path d="M834 196l10-12h24l10 12v18h-44z" />
          <path d="M892 196l10-12h24l10 12v18h-44z" />
        </g>
      </Zone>

      {/* Woonhuis met de receptie */}
      <Zone {...maak('woonhuis')} fill="#A9C97C" rx={16}>
        <path d="M62 374l20-34h146l20 34Z" fill="#B5482A" />
        <rect x="72" y="374" width="166" height="40" fill="#F1E3C4" />
        <g fill="#2F5D3A">
          <rect x="84" y="384" width="16" height="16" rx="2" />
          <rect x="108" y="384" width="16" height="16" rx="2" />
          <rect x="186" y="384" width="16" height="16" rx="2" />
          <rect x="210" y="384" width="16" height="16" rx="2" />
        </g>
        <rect x="146" y="384" width="18" height="30" fill="#6B4A2E" />
        <rect className="map-sign" x="58" y="300" width="194" height="28" rx="14" />
        <text x="155" y="320" className="map-label map-label-sm">
          {zones.woonhuis.label}
        </text>
      </Zone>

      {/* De oude melkstal */}
      <Zone {...maak('melkstal')} fill="#A9C97C" rx={16}>
        <path d="M292 374l18-34h150l18 34Z" fill="#3E4B47" />
        <rect x="300" y="374" width="160" height="40" fill="#A35A3C" />
        <rect x="362" y="380" width="36" height="34" fill="#3F6B45" />
        <path d="M362 380l36 34M398 380l-36 34" stroke="#2C4B31" strokeWidth="2.5" />
        <rect x="312" y="384" width="22" height="12" rx="2" fill="#2B3A35" />
        <rect x="426" y="384" width="22" height="12" rx="2" fill="#2B3A35" />
        <rect className="map-sign" x="300" y="300" width="150" height="28" rx="14" />
        <text x="375" y="320" className="map-label map-label-sm">
          {zones.melkstal.label}
        </text>
      </Zone>

      {/* Sanitairgebouw */}
      <Zone {...maak('sanitair')} fill="#A9C97C" rx={16}>
        <path d="M496 374l18-34h166l18 34Z" fill="#3E4B47" />
        <rect x="504" y="374" width="186" height="40" fill="#DDD5C4" />
        <g fill="#7E9AA3">
          <rect x="516" y="382" width="14" height="32" />
          <rect x="538" y="382" width="14" height="32" />
          <rect x="560" y="382" width="14" height="32" />
          <rect x="582" y="382" width="14" height="32" />
          <rect x="604" y="382" width="14" height="32" />
          <rect x="626" y="382" width="14" height="32" />
          <rect x="648" y="382" width="14" height="32" />
        </g>
        <rect x="668" y="382" width="14" height="32" fill="#2F5D3A" />
        <rect className="map-sign" x="522" y="300" width="150" height="28" rx="14" />
        <text x="597" y="320" className="map-label map-label-sm">
          {zones.sanitair.label}
        </text>
      </Zone>

      {/* Buitenzwembad */}
      <Zone {...maak('zwembad')} fill="#A9C97C" rx={16}>
        <rect x="748" y="342" width="184" height="72" rx="8" fill="#E8D9B5" />
        <rect
          x="762"
          y="352"
          width="128"
          height="52"
          rx="5"
          fill="#6FB7C9"
          stroke="#FFFDF8"
          strokeWidth="5"
        />
        <path
          d="M774 372q8-6 16 0t16 0 16 0 16 0 16 0 16 0"
          stroke="#A9D8E3"
          strokeWidth="3"
          fill="none"
        />
        <path d="M900 360l20 6M900 380l20 6" stroke="#5C7C8A" strokeWidth="6" strokeLinecap="round" />
        <rect className="map-sign" x="780" y="300" width="120" height="28" rx="14" />
        <text x="840" y="320" className="map-label map-label-sm">
          {zones.zwembad.label}
        </text>
      </Zone>

      {/* Parkeerplaats */}
      <Zone {...maak('parkeerplaats')} fill="#D5CDBB" rx={16}>
        <g stroke="#FFFDF8" strokeWidth="3">
          <path d="M64 566v48M96 566v48M128 566v48M160 566v48M192 566v48M224 566v48M256 566v48" />
        </g>
        <rect x="70" y="580" width="20" height="30" rx="5" fill="#C7613F" />
        <rect x="166" y="580" width="20" height="30" rx="5" fill="#5C7C8A" />
        <rect className="map-sign" x="82" y="500" width="150" height="28" rx="14" />
        <text x="157" y="520" className="map-label map-label-sm">
          {zones.parkeerplaats.label}
        </text>
      </Zone>

      {/* Speelweide */}
      <Zone {...maak('speelweide')} fill="#A9C97C">
        <text x="600" y="572" className="map-label">
          {zones.speelweide.label}
        </text>
        <g stroke="#6B4A2E" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M840 612l14-60h60l14 60" />
          <path d="M866 552v36M900 552v36" />
        </g>
        <path d="M860 588h12M894 588h12" stroke="#C7613F" strokeWidth="5" strokeLinecap="round" />
        <g>
          <rect x="770" y="560" width="22" height="30" fill="#C7613F" />
          <path d="M770 560l-6-8h34l-6 8Z" fill="#8E3A22" />
          <path d="M792 568l36 40" stroke="#E9C46A" strokeWidth="8" strokeLinecap="round" />
        </g>
        <rect x="906" y="604" width="34" height="22" rx="4" fill="#E8D9B5" stroke="#C9B48A" strokeWidth="2" />
        <circle cx="420" cy="612" r="16" fill="#4E7E36" />
        <circle cx="452" cy="614" r="11" fill="#4E7E36" />
      </Zone>

      {/* Ingang en hek */}
      <Zone {...maak('ingang')} fill="#E8D9B5" ghost rx={10}>
        <g stroke="#6B4A2E" strokeWidth="4" strokeLinecap="round">
          <path d="M282 640v28M328 640v28M282 646h46M282 656h46M282 666h46M282 666l46-20" />
        </g>
        <rect className="map-sign" x="250" y="610" width="110" height="26" rx="13" />
        <text x="305" y="629" className="map-label map-label-xs">
          {zones.ingang.label}
        </text>
      </Zone>
    </>
  )
}

interface Props {
  zone: ZoneId
  onKies: (zone: ZoneId) => void
  aantallen: Record<ZoneId, number>
}

/** De klikbare kaart met de knoppen eronder. */
export function PlattegrondKaart({ zone, onKies, aantallen }: Props) {
  const { t } = useTaal()
  const zones = t.plattegrond.zones
  const kaart = t.plattegrond.kaart

  return (
    <div className="map-main">
      <div className="map-frame">
        <div className="map-scroll">
          <svg className="map-svg" viewBox="0 0 1000 720" role="group" aria-labelledby="map-svg-title">
            <title id="map-svg-title">{kaart.svgTitel}</title>
            <g id="map-art">
              <Erf actief={zone} aantallen={aantallen} onKies={onKies} />
            </g>
          </svg>
        </div>
        <p className="map-hint">{kaart.hint}</p>
      </div>

      <div className="map-chips" role="group" aria-label={kaart.kiesLabel}>
        {ZONE_IDS.map((id) => {
          const aantal = aantallen[id]
          return (
            <button
              key={id}
              type="button"
              className="chip"
              aria-pressed={zone === id}
              onClick={() => onKies(id)}
            >
              {zones[id].kort}
              {aantal > 0 ? (
                <span className="chip-count" aria-hidden="true">
                  {aantal}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Dezelfde tekening, uitvergroot op één plek: de foto zolang er nog geen foto is. */
export function ErfTekening({ zone }: { zone: ZoneId }) {
  return (
    <svg
      className="map-photo-art"
      viewBox={uitsnedeVoor(zone)}
      aria-hidden="true"
      focusable="false"
    >
      <Erf />
    </svg>
  )
}
