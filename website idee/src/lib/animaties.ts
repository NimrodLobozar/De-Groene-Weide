import { useEffect } from 'react'

/**
 * Laat blokken binnenkomen zodra ze in beeld komen.
 *
 * De klasse `reveleer` wordt pas door JavaScript gezet, dus zonder JavaScript (of
 * met de rustknop aan) is alles gewoon zichtbaar. Zo kan er nooit iets onzichtbaar
 * blijven staan.
 */

const KIEZER = [
  'main .kaart',
  'main .filmkaart',
  'main .paneelkaart',
  'main .tipkaart',
  'main .waarde',
  'main .agenda__dag',
  'main .beheerkaart',
  'main .beheerpaneel',
  'main .tabelvak',
  'main .adviesbalk',
  'main .ctabalk',
  'main .mededeling',
  'main .vindons__tekst',
  'main .paginakop__binnen',
  'main .plekkenkaart',
  'main .map-frame',
  'main .map-panel',
  'main .contactkaart',
  'main .teamkaart',
].join(',')

function bewegingUit(): boolean {
  return (
    document.documentElement.dataset.rust === 'aan' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function useAnimaties(pad: string) {
  useEffect(() => {
    if (bewegingUit()) return

    const elementen = Array.from(document.querySelectorAll<HTMLElement>(KIEZER)).filter(
      (el) => !el.classList.contains('is-zicht'),
    )
    if (!elementen.length) return

    // Binnen dezelfde rij krijgt elk blok een kleine vertraging.
    const perOuder = new Map<Element, HTMLElement[]>()
    for (const el of elementen) {
      const ouder = el.parentElement
      if (!ouder) continue
      const lijst = perOuder.get(ouder) ?? []
      lijst.push(el)
      perOuder.set(ouder, lijst)
    }
    for (const lijst of perOuder.values()) {
      lijst.forEach((el, index) => {
        el.style.setProperty('--vertraging', `${Math.min(index, 8) * 55}ms`)
      })
    }

    const waarnemer = new IntersectionObserver(
      (meldingen) => {
        for (const melding of meldingen) {
          if (!melding.isIntersecting) continue
          melding.target.classList.add('is-zicht')
          waarnemer.unobserve(melding.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )

    for (const el of elementen) {
      el.classList.add('reveleer')
      waarnemer.observe(el)
    }

    // Vangnet: wat al in beeld staat maar om wat voor reden dan ook niet afgaat,
    // wordt na een seconde alsnog getoond.
    const vangnet = window.setTimeout(() => {
      for (const el of elementen) {
        if (el.classList.contains('is-zicht')) continue
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-zicht')
      }
    }, 1200)

    return () => {
      waarnemer.disconnect()
      window.clearTimeout(vangnet)
    }
  }, [pad])
}
