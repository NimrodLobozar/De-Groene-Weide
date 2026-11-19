/* Screenshots + een end-to-end test van de reservering en het beheer.
   Gebruik: node tools/shot.mjs [basis-url] */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const basis = process.argv[2] ?? 'http://localhost:4173'
const uit = 'tools/shots'
await mkdir(uit, { recursive: true })

const fouten = []
const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 1,
  locale: 'nl-NL',
})
const page = await context.newPage()
page.on('console', (m) => m.type() === 'error' && fouten.push(`console: ${m.text()}`))
page.on('pageerror', (e) => fouten.push(`pageerror: ${e.message}`))

async function naar(pad, naam, volledig = true) {
  await page.goto(`${basis}${pad}`, { waitUntil: 'networkidle' })
  const knop = page.getByRole('button', { name: /Alles toestaan/i })
  if (await knop.count()) await knop.first().click()
  await page.waitForTimeout(250)
  if (naam) {
    if (volledig) await page.screenshot({ path: `${uit}/${naam}.png`, fullPage: true })
    await page.screenshot({ path: `${uit}/${naam}-boven.png` })
    console.log('·', naam)
  }
}

const paginas = [
  ['home', '/nl'],
  ['terrein', '/nl/terrein'],
  ['plattegrond', '/nl/plattegrond'],
  ['evenementen', '/nl/evenementen'],
  ['over-ons', '/nl/over-ons'],
  ['contact', '/nl/contact'],
  ['toegankelijkheid', '/nl/toegankelijkheid'],
  ['nietgevonden', '/nl/bestaat-niet'],
]

for (const [naam, pad] of paginas) await naar(pad, naam)

/* ---------------- reservering doorlopen ---------------- */

await naar('/nl/reserveren/stap-1', null)
await page.locator('.dag:not([disabled])').nth(4).click()
await page.locator('.dag:not([disabled])').nth(7).click()
await page.screenshot({ path: `${uit}/stap1-gekozen.png` })
await page.getByRole('button', { name: /Bekijk de beste plekken/i }).click()
await page.waitForTimeout(300)

await page.locator('.soortkaart', { hasText: 'Tent' }).first().click()
await page.getByRole('button', { name: /Rustig/i }).first().click()
await page.screenshot({ path: `${uit}/stap2.png`, fullPage: true })
await page.getByRole('button', { name: /Bekijk de beste plekken/i }).click()
await page.waitForTimeout(300)

await page.screenshot({ path: `${uit}/stap3.png`, fullPage: true })
console.log('· stap 1-3')

await page.getByRole('button', { name: /Kies deze/i }).first().click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${uit}/stap4.png`, fullPage: true })

await page.getByRole('button', { name: /Verder naar je gegevens/i }).click()
await page.waitForTimeout(300)

await page.fill('#naam', 'Sanne de Vries')
await page.fill('#email', 'sanne@example.nl')
await page.fill('#telefoon', '06 12 34 56 78')
await page.fill('#plaats', 'Utrecht')
await page.locator('.checkveld input').check()
await page.screenshot({ path: `${uit}/stap5.png`, fullPage: true })
await page.getByRole('button', { name: /Verder naar controleren/i }).click()
await page.waitForTimeout(300)

await page.screenshot({ path: `${uit}/stap6.png`, fullPage: true })
await page.getByRole('button', { name: /Reserveer nu/i }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${uit}/stap7.png`, fullPage: true })
console.log('· stap 4-7, eind-URL:', new URL(page.url()).pathname)

/* ---------------- beheer ---------------- */

await naar('/nl/beheer/start', null)
await page.getByRole('button', { name: /Inloggen/i }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${uit}/beheer-start.png`, fullPage: true })
console.log('· beheer-start')

for (const [naam, slug] of [
  ['beheer-reserveringen', 'reserveringen'],
  ['beheer-bezetting', 'bezetting'],
  ['beheer-plekken', 'plekken'],
  ['beheer-prijzen', 'prijzen'],
  ['beheer-paginas', 'paginas'],
]) {
  await page.goto(`${basis}/nl/beheer/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${uit}/${naam}.png`, fullPage: true })
  console.log('·', naam)
}

/* ---------------- mobiel ---------------- */

const mobiel = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  locale: 'nl-NL',
})
const mpage = await mobiel.newPage()
mpage.on('pageerror', (e) => fouten.push(`mobiel pageerror: ${e.message}`))
await mpage.goto(`${basis}/nl`, { waitUntil: 'networkidle' })
const mk = mpage.getByRole('button', { name: /Alles toestaan/i })
if (await mk.count()) await mk.first().click()
await mpage.waitForTimeout(300)
await mpage.screenshot({ path: `${uit}/mobiel-home.png`, fullPage: true })
await mpage.getByRole('button', { name: /Menu/i }).first().click()
await mpage.waitForTimeout(300)
await mpage.screenshot({ path: `${uit}/mobiel-menu.png` })
await mpage.goto(`${basis}/nl/reserveren/stap-4`, { waitUntil: 'networkidle' })
await mpage.screenshot({ path: `${uit}/mobiel-stap4.png`, fullPage: true })
console.log('· mobiel')

await browser.close()

if (fouten.length) {
  console.log('\nFOUTEN:')
  for (const f of new Set(fouten)) console.log(' -', f)
} else {
  console.log('\nGeen console-fouten.')
}
