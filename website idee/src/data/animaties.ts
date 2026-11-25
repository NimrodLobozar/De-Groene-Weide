/**
 * De films van het animatieteam.
 *
 * De titel, beschrijving en labels staan in de woordenboeken onder
 * `evenementen.animaties.films`. Hier staat alleen waar de film en de poster
 * staan, zodat er later makkelijk een tweede film bij kan.
 */
export interface Animatie {
  id: string
  /** Zelfstandige pagina met de film (in een iframe in de preview). */
  bestand: string
  /** Stilstaand beeld voor de kaart en de preview. */
  poster: string
  /** Duur van één ronde in seconden. */
  duur: number
}

export const ANIMATIES: Animatie[] = [
  {
    id: 'de-boerderij',
    bestand: '/animaties/de-boerderij-film.html',
    poster: '/animaties/de-boerderij-film.jpg',
    duur: 71,
  },
]
