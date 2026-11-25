/**
 * Illustraties in de stijl van het prototype: platte vlakken met een dikke,
 * donkere lijn. Geen foto's, geen gradients.
 */

const LIJN = '#2E2418'
const HUIS = '#C05838'
const TRIM = '#F7F3E8'
const GRAS_MID = '#9CC48C'
const GRAS_VOOR = '#6CA05C'
const ZON = '#F4C848'
const KAM = '#EE8A3C'
const HEMEL = '#E4F0DE'
const WIEL = '#2D3A30'
const ROOK = '#D9DDD3'

export function KipIcoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M12.2 13.2c0-2.6 2.1-4.7 4.7-4.7 2.1 0 3.9 1.4 4.5 3.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12.6 11.4c-.7-1.9.2-3.3 1.4-3.2.9.1 1.2.9 1.1 1.9"
        fill="currentColor"
      />
      <ellipse cx="21.5" cy="23.5" rx="11" ry="9.5" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <circle cx="13.4" cy="14.6" r="5.6" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <path d="M9.2 13.2 5.6 15l3.6 1.6" fill="currentColor" />
      <circle cx="14.6" cy="13.2" r="1.05" fill="currentColor" />
      <path
        d="M20 20.6c2.6-.6 5.6 1 6.3 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M17 32.5v4M26 32.5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * De hero-illustratie: het erf met de stal, het hek, de zon en de kip.
 *
 * De kip loopt heen en weer, pikt naar de grond en probeert op het eind te
 * vliegen (één loop van 28 s). Daarboven vliegen twee zwermen vogels (24 s en
 * 31 s) en één keer per 45 s rijdt de tractor over de achterste heuvel. De
 * tijdlijnen zelf staan in animaties.css onder .hero-verhaal; met de rustknop
 * aan staat alles stil.
 *
 * Elke bewegende groep draait om haar eigen (0, 0). De groep eromheen zet dat
 * punt precies op de plek waar gedraaid of geschaald moet worden, zodat de
 * beginsituatie het stilstaande beeld is.
 */
export function HeroErf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 400"
      preserveAspectRatio="xMidYMax meet"
      className={`hero__illustratie hero-verhaal ${className ?? ''}`}
      aria-hidden="true"
    >
      <defs>
        <path
          id="hero-vogel"
          d="M-10 -4 Q-5 -6 0 1 Q5 -6 10 -4"
          fill="none"
          stroke={LIJN}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="hero-poot-achter"
          d="M56 94 L54 108 M48 108 H60"
          stroke={LIJN}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          id="hero-poot-voor"
          d="M70 92 L72 108 M66 108 H78"
          stroke={LIJN}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          id="hero-vleugel"
          d="M44 66 C52 58 66 60 70 70 C62 78 50 78 44 66 Z"
          fill={TRIM}
          stroke={LIJN}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </defs>

      {/* de lucht, precies de kleur van de herosectie */}
      <rect width="560" height="400" fill={HEMEL} />

      {/* de zon */}
      <g transform="translate(450 96)">
        <circle r="58" fill={ZON} opacity="0.3" />
        <circle r="42" fill={ZON} />
      </g>

      {/* vogels: een zwerm rechts en een paartje links */}
      <g transform="translate(250 64)">
        <g className="vlucht-a">
          <use xlinkHref="#hero-vogel" href="#hero-vogel" className="vleugels" />
          <g transform="translate(26 12)">
            <use
              xlinkHref="#hero-vogel"
              href="#hero-vogel"
              className="vleugels"
              style={{ animationDelay: '-0.25s' }}
            />
          </g>
          <g transform="translate(-22 16)">
            <use
              xlinkHref="#hero-vogel"
              href="#hero-vogel"
              className="vleugels"
              style={{ animationDelay: '-0.4s' }}
            />
          </g>
        </g>
      </g>
      <g transform="translate(150 40)">
        <g className="vlucht-b">
          <g transform="scale(0.75)">
            <use
              xlinkHref="#hero-vogel"
              href="#hero-vogel"
              className="vleugels"
              style={{ animationDelay: '-0.1s' }}
            />
          </g>
          <g transform="translate(20 -8) scale(0.75)">
            <use
              xlinkHref="#hero-vogel"
              href="#hero-vogel"
              className="vleugels"
              style={{ animationDelay: '-0.35s' }}
            />
          </g>
        </g>
      </g>

      {/* achterste heuvel */}
      <path
        d="M0 250 C120 190 220 210 320 240 C420 270 500 220 560 200 L560 400 L0 400 Z"
        fill={GRAS_MID}
      />

      {/* tractor over de achterste heuvel, achter de stal */}
      <g className="tractor">
        <g stroke={LIJN} strokeWidth="2.5" strokeLinejoin="round">
          <g className="tractor-schud">
            <path d="M8 -19 V-29" strokeLinecap="round" fill="none" />
            <path d="M-17 -10 V-33 H-2 L0 -19 H18 V-9 Z" fill={HUIS} />
            <path d="M-13 -29 H-5 V-20 H-13 Z" fill={TRIM} strokeWidth="2" />
          </g>
          <circle cx="13" cy="-6" r="6" fill={WIEL} />
          <g transform="translate(-9 -10)">
            <circle r="10" fill={WIEL} />
            <g className="tractor-wiel">
              <path d="M-6 0 H6 M0 -6 V6" stroke={TRIM} strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
          <g transform="translate(8 -32)" stroke="none" fill={ROOK}>
            <circle className="puf" r="3.5" />
            <circle className="puf" r="3.5" style={{ animationDelay: '-0.45s' }} />
          </g>
        </g>
      </g>

      {/* voorste heuvel, de stal en het hek */}
      <path
        d="M0 300 C140 260 260 290 380 300 C460 306 520 290 560 280 L560 400 L0 400 Z"
        fill={GRAS_VOOR}
      />
      <g stroke={LIJN} strokeWidth="4" strokeLinejoin="round">
        <path d="M90 290 V200 L160 150 L230 200 V290 Z" fill={HUIS} />
        <path d="M135 290 V240 H185 V290" fill={TRIM} />
        <path d="M80 205 L160 145 L240 205" fill="none" />
        <rect x="146" y="180" width="28" height="22" fill={TRIM} />
      </g>
      <g stroke={LIJN} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M300 300 V260 M340 300 V260 M380 300 V260 M290 272 H400" />
      </g>

      {/* de kip */}
      <g transform="translate(380 250)">
        <g className="kip-pad">
          <g className="kip-sprong">
            <g transform="scale(1.15) translate(64 0)">
              <g className="kip-richting">
                <g transform="translate(-64 0)">
                  <g className="poten-stil">
                    <use xlinkHref="#hero-poot-achter" href="#hero-poot-achter" />
                    <use xlinkHref="#hero-poot-voor" href="#hero-poot-voor" />
                  </g>
                  <g className="poten-lopend">
                    <g transform="translate(56 94)">
                      <g className="poot-achter">
                        <g transform="translate(-56 -94)">
                          <use xlinkHref="#hero-poot-achter" href="#hero-poot-achter" />
                        </g>
                      </g>
                    </g>
                    <g transform="translate(70 92)">
                      <g className="poot-voor">
                        <g transform="translate(-70 -92)">
                          <use xlinkHref="#hero-poot-voor" href="#hero-poot-voor" />
                        </g>
                      </g>
                    </g>
                  </g>
                  <g transform="translate(62 94)">
                    <g className="kip-pik">
                      <g transform="translate(-62 -94)">
                        <g strokeLinejoin="round" stroke={LIJN}>
                          <path
                            d="M30 66 C20 58 18 46 24 40 C28 50 32 54 38 56"
                            fill="#fff"
                            strokeWidth="4"
                          />
                          <path
                            d="M30 70 C30 45 50 32 66 36 C70 24 86 22 92 34 C100 50 98 84 72 92 C50 98 30 90 30 70 Z"
                            fill="#fff"
                            strokeWidth="4"
                          />
                          <path
                            d="M76 27 C73 18 80 13 84 20 C86 12 95 14 92 25"
                            fill={KAM}
                            strokeWidth="3"
                          />
                          <path d="M96 40 L108 44 L96 48 Z" fill={ZON} strokeWidth="3" />
                          <path d="M95 50 C97 57 92 59 90 54" fill={KAM} strokeWidth="2.5" />
                          <circle cx="86" cy="38" r="3.5" fill={LIJN} stroke="none" />
                        </g>
                        <g className="vleugel-rust">
                          <use xlinkHref="#hero-vleugel" href="#hero-vleugel" />
                        </g>
                        <g className="vleugel-slag">
                          <g transform="translate(66 66)">
                            <g className="klap">
                              <g transform="translate(-66 -66)">
                                <use xlinkHref="#hero-vleugel" href="#hero-vleugel" />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

/** De koe van de 404-pagina: half over het hek, kont in de lucht. */
export function KoeOntsnapt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden="true">
      <g stroke={LIJN} strokeWidth="3.4" strokeLinejoin="round">
        <path d="M60 96c0-24 20-42 46-42h58c26 0 46 18 46 42v34c0 14-12 24-26 24H86c-14 0-26-10-26-24Z" fill="#fff" />
        <path d="M140 58c-10 10-12 22-8 34 5 14 2 26-8 34" fill="#2E2418" stroke="none" />
        <path d="M176 62c8 8 9 18 6 28-4 12-2 22 6 28" fill="#2E2418" stroke="none" />
        <path d="M210 74c14-6 26 2 26 14 0 10-8 16-20 16" fill="#fff" />
        <path d="M104 154v34M154 154v34M196 154v34" />
        <path d="M96 190v10M146 190v10M188 190v10" strokeLinecap="round" />
        <path d="M96 190h20M146 190h20M188 190h20" strokeLinecap="round" />
      </g>
      <g fill={KAM} stroke={LIJN} strokeWidth="2.4">
        <path d="M112 52c-3-8 1-13 6-11 4 1.6 4 6 3 9Z" />
      </g>
      <circle cx="206" cy="88" r="3.2" fill={LIJN} />
      <path d="M262 120h44M276 120v50M306 120v50" stroke={LIJN} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

/** Plattegrond-placeholder (kaart met route). */
export function KaartVlak({ className, label }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 480 300" className={className} role={label ? 'img' : undefined} aria-label={label}>
      <rect width="480" height="300" fill="#E9EFE1" />
      <path d="M-20 210c90-40 150 10 240-20s170-40 280-10" stroke="#CFDCC4" strokeWidth="26" fill="none" />
      <path d="M120 -20c30 70 0 120 40 180s30 100 20 160" stroke="#CFDCC4" strokeWidth="20" fill="none" />
      <g fill="#D6E4CC">
        <rect x="300" y="40" width="70" height="54" rx="6" />
        <rect x="386" y="40" width="70" height="54" rx="6" />
        <rect x="300" y="112" width="70" height="54" rx="6" />
      </g>
      <g transform="translate(196 176)">
        <path d="M0 0c-14 0-24 11-24 24 0 17 24 40 24 40s24-23 24-40C24 11 14 0 0 0Z" fill="#2F6B3E" />
        <circle cx="0" cy="24" r="8" fill="#FBFAF6" />
      </g>
      {label ? (
        <text x="24" y="284" fill="#6B6B5E" fontFamily="Atkinson Hyperlegible, sans-serif" fontSize="14" fontWeight="700">
          {label}
        </text>
      ) : null}
    </svg>
  )
}
