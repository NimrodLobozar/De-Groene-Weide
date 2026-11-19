import type { ZoneId } from '../../data/plattegrond'

export interface Vak {
  x: number
  y: number
  w: number
  h: number
}

/**
 * De rechthoek (`.zone-bg`) van elke plek, in het coördinatenstelsel van de
 * tekening (viewBox 1000 × 720). Die rechthoek krijgt de rand bij hover en
 * klik, en bepaalt waar de uitvergroting in het paneel op inzoomt.
 */
export const VAKKEN: Record<ZoneId, Vak> = {
  kampeerveld: { x: 44, y: 44, w: 424, h: 184 },
  camperveld: { x: 514, y: 44, w: 196, h: 184 },
  achterste: { x: 754, y: 44, w: 202, h: 184 },
  woonhuis: { x: 44, y: 292, w: 222, h: 132 },
  melkstal: { x: 280, y: 292, w: 190, h: 132 },
  sanitair: { x: 484, y: 292, w: 226, h: 132 },
  zwembad: { x: 724, y: 292, w: 232, h: 132 },
  parkeerplaats: { x: 44, y: 488, w: 226, h: 144 },
  speelweide: { x: 344, y: 488, w: 612, h: 150 },
  ingang: { x: 272, y: 606, w: 66, h: 66 },
}

/** De uitsnede van de kaart die het paneel toont zolang er nog geen foto is. */
export function uitsnedeVoor(id: ZoneId): string {
  const r = VAKKEN[id]
  const marge = 28
  const minBreedte = 260
  const minHoogte = 160
  const cx = r.x + r.w / 2
  const cy = r.y + r.h / 2
  const w = Math.max(r.w + marge * 2, minBreedte)
  const h = Math.max(r.h + marge * 2, minHoogte)
  return [cx - w / 2, cy - h / 2, w, h].join(' ')
}
