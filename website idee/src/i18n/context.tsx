import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { WOORDENBOEKEN, pad, type Dict, type Lang, type PageKey } from './index'

interface TaalWaarde {
  taal: Lang
  t: Dict
  /** Link naar een pagina in de huidige taal. */
  link: (pagina: PageKey, extra?: string) => string
}

const TaalContext = createContext<TaalWaarde | null>(null)

export function TaalProvider({
  taal,
  woordenboeken = WOORDENBOEKEN,
  children,
}: {
  taal: Lang
  /** De teksten van de site, met wat de eigenaar in het beheer aanpaste erin. */
  woordenboeken?: Record<Lang, Dict>
  children: ReactNode
}) {
  const waarde = useMemo<TaalWaarde>(
    () => ({
      taal,
      t: woordenboeken[taal] ?? WOORDENBOEKEN[taal],
      link: (pagina: PageKey, extra?: string) => pad(taal, pagina, extra),
    }),
    [taal, woordenboeken],
  )

  return <TaalContext.Provider value={waarde}>{children}</TaalContext.Provider>
}

export function useTaal(): TaalWaarde {
  const waarde = useContext(TaalContext)
  if (!waarde) throw new Error('useTaal moet binnen een TaalProvider staan')
  return waarde
}
