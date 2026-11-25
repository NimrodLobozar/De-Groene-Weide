import type { ReactNode } from 'react'

export type IcoonNaam =
  | 'kip'
  | 'tractor'
  | 'water'
  | 'eten'
  | 'stekker'
  | 'stilte'
  | 'douche'
  | 'bed'
  | 'hond'
  | 'fiets'
  | 'klok'
  | 'pin'
  | 'mail'
  | 'telefoon'
  | 'pijl'
  | 'terug'
  | 'vink'
  | 'menu'
  | 'kruis'
  | 'kalender'
  | 'zon'
  | 'kaart'
  | 'gebruiker'
  | 'potlood'
  | 'plus'
  | 'zoek'
  | 'filter'
  | 'uitloggen'
  | 'instellingen'
  | 'foto'
  | 'pagina'
  | 'prijs'
  | 'gebouw'
  | 'grafiek'
  | 'schoonmaak'
  | 'download'
  | 'waarschuwing'
  | 'ster'
  | 'prullenbak'
  | 'database'
  | 'schuur'
  | 'brood'
  | 'schommel'
  | 'maan'
  | 'kopje'
  | 'basket'
  | 'was'
  | 'mensen'
  | 'zwembad'
  | 'speel'

const PADEN: Record<IcoonNaam, ReactNode> = {
  kip: (
    <>
      <path d="M14.5 6.6c0-1.6 1.1-2.7 2.5-2.7 1.1 0 2 .7 2.4 1.7" />
      <ellipse cx="12" cy="14" rx="6.4" ry="5.6" />
      <circle cx="7.2" cy="8.6" r="3.2" />
      <path d="M4.4 8.4 2.2 9.6l2.2 1.2" />
      <path d="M9.6 19v3M14.4 19v3" />
    </>
  ),
  tractor: (
    <>
      <path d="M4 16v-4h6l2-4h4v8" />
      <circle cx="7" cy="17.5" r="3.2" />
      <circle cx="16.5" cy="18" r="2.6" />
      <path d="M16 8h4v6" />
    </>
  ),
  water: (
    <>
      <path d="M3 9c2-1.6 3.5-1.6 5.5 0s3.5 1.6 5.5 0 3.5-1.6 5.5 0" />
      <path d="M3 14c2-1.6 3.5-1.6 5.5 0s3.5 1.6 5.5 0 3.5-1.6 5.5 0" />
      <path d="M3 19c2-1.6 3.5-1.6 5.5 0s3.5 1.6 5.5 0 3.5-1.6 5.5 0" />
    </>
  ),
  eten: (
    <>
      <path d="M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" />
      <path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M6 3.5v2M10 3.5v2M14 3.5v2" />
    </>
  ),
  stekker: <path d="M13 3 5.5 13.5H11l-1 7.5 8-11h-5.5Z" />,
  stilte: (
    <>
      <path d="M4 10v4h3l4 3.5v-15L7 10Z" />
      <path d="M15 9.5 20 14M20 9.5 15 14" />
    </>
  ),
  douche: (
    <>
      <path d="M5 21V10a5 5 0 0 1 5-5h3" />
      <path d="M13 3.5 19 7l-4 5-6-2Z" />
      <path d="M12 15v1M15 14v1M9 17v1M14 19v1" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18V8" />
      <path d="M3 12h18v6" />
      <path d="M7 12V9h5v3" />
      <path d="M14 12V9h4a3 3 0 0 1 3 3" />
    </>
  ),
  hond: (
    <>
      <circle cx="7" cy="9" r="1.8" />
      <circle cx="12" cy="7" r="1.8" />
      <circle cx="17" cy="9" r="1.8" />
      <path d="M8.5 15.5c0-2.5 1.6-4.5 3.5-4.5s3.5 2 3.5 4.5c0 1.7-1.6 3-3.5 3s-3.5-1.3-3.5-3Z" />
    </>
  ),
  fiets: (
    <>
      <circle cx="6" cy="16" r="3.4" />
      <circle cx="18" cy="16" r="3.4" />
      <path d="M9 16h4l3-6h-4M13 16l-2-6" />
    </>
  ),
  klok: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  telefoon: (
    <path d="M5 4.5h3l1.5 4-2 1.5a10 10 0 0 0 6.5 6.5L15.5 15l4 1.5v3A2.5 2.5 0 0 1 17 22 15.5 15.5 0 0 1 4.5 9.5 2.5 2.5 0 0 1 5 4.5Z" />
  ),
  pijl: <path d="M4 12h15M14 6.5 19.5 12 14 17.5" />,
  terug: <path d="M20 12H5M10 6.5 4.5 12 10 17.5" />,
  vink: <path d="m4 12.5 5 5L20 6.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  kruis: <path d="M6 6l12 12M18 6 6 18" />,
  kalender: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </>
  ),
  zon: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" />
    </>
  ),
  kaart: (
    <>
      <path d="m3 6.5 5.5-2 7 2.5 5.5-2v13l-5.5 2-7-2.5-5.5 2Z" />
      <path d="M8.5 4.5v13M15.5 7v13" />
    </>
  ),
  gebruiker: (
    <>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 20c.6-3.8 3.6-6 7.2-6s6.6 2.2 7.2 6" />
    </>
  ),
  potlood: (
    <>
      <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16Z" />
      <path d="M14.5 5.5 18.5 9.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  zoek: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  filter: <path d="M3.5 6h17l-6.5 7.5V20l-4-2v-4.5Z" />,
  uitloggen: (
    <>
      <path d="M10 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h4" />
      <path d="M15 8.5 18.5 12 15 15.5M9.5 12h9" />
    </>
  ),
  instellingen: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 7.6l1.9 1.1M17.2 15.3l1.9 1.1M4.9 16.4l1.9-1.1M17.2 8.7l1.9-1.1" />
    </>
  ),
  foto: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.8" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </>
  ),
  pagina: (
    <>
      <path d="M6 3.5h8l4 4v13H6Z" />
      <path d="M14 3.5v4h4M9 12h6M9 16h6" />
    </>
  ),
  prijs: (
    <>
      <path d="M4 4.5h7l9 9-7 7-9-9Z" />
      <circle cx="8.5" cy="9" r="1.6" />
    </>
  ),
  gebouw: (
    <>
      <path d="M4 20V7l7-3.5L18 7v13" />
      <path d="M9 20v-5h4v5M10 9.5h.01M14 9.5h.01" />
    </>
  ),
  grafiek: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  schoonmaak: (
    <>
      <path d="M14 4l2 2-6 6-2-2Z" />
      <path d="M8 10l2 2-4 8-2-2Z" />
      <path d="M11 20h9" />
    </>
  ),
  download: <path d="M12 3.5v11M7.5 10 12 14.5 16.5 10M5 19.5h14" />,
  waarschuwing: (
    <>
      <path d="M12 3.5 21 20H3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  ster: <path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9Z" />,
  prullenbak: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 12.5h9L17.5 7" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </>
  ),

  /* --- plattegrond ------------------------------------------------------- */

  schuur: (
    <>
      <path d="M3.5 20V10L12 4l8.5 6v10z" />
      <path d="M9 20v-6h6v6M9 14l6 6M15 14l-6 6" />
    </>
  ),
  brood: (
    <>
      <path d="M6 11.5A3.75 3.75 0 0 1 7.5 4.5h9a3.75 3.75 0 0 1 1.5 7V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19z" />
      <path d="M10 9.5l-1 2M14 9.5l-1 2" />
    </>
  ),
  schommel: <path d="M3 20L6.5 4h11L21 20M10 4v9.5M14 4v9.5M9 13.5h6" />,
  maan: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  kopje: (
    <>
      <path d="M4 9h12v4.5A5.5 5.5 0 0 1 10.5 19h-1A5.5 5.5 0 0 1 4 13.5z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c-.6.8-.6 1.7 0 2.5M12 3.5c-.6.8-.6 1.7 0 2.5" />
    </>
  ),
  basket: (
    <>
      <path d="M4 10h16l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3z" />
      <path d="M8.5 10l3.5-6 3.5 6M9.5 14v3M12 14v3M14.5 14v3" />
    </>
  ),
  was: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M4 7.5h16M7 5.25h.01M9.5 5.25h.01" />
      <circle cx="12" cy="14" r="4" />
    </>
  ),
  mensen: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </>
  ),
  zwembad: (
    <>
      <path d="M9 16V6a2 2 0 0 0-2-2M15 16V6a2 2 0 0 1 2-2M9 9h6M9 12.5h6" />
      <path d="M2.5 19c1.6 0 1.6 1 3.2 1s1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1" />
    </>
  ),
  speel: <path d="M8 5.5v13l11-6.5Z" />,
}

export function Icoon({
  naam,
  maat = 20,
  className,
  gevuld = false,
}: {
  naam: IcoonNaam
  maat?: number
  className?: string
  gevuld?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={maat}
      height={maat}
      fill={gevuld ? 'currentColor' : 'none'}
      stroke={gevuld ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PADEN[naam]}
    </svg>
  )
}
