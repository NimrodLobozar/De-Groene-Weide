/* Screenshots van de nieuwe plattegrond. Gebruik: node tools/shot-plattegrond.mjs [basis-url] */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const basis = process.argv[2] ?? 'http://localhost:5188'
const uit = 'tools/shots'
await mkdir(uit, { recursive: true })

const fouten = []
const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  locale: 'nl-NL',
})
const page = await context.newPage()
page.on('console', (m) => m.type() === 'error' && fouten.push(`console: ${m.text()}`))
page.on('pageerror', (e) => fouten.push(`pageerror: ${e.message}`))

async function open(pad) {
  await page.goto(`${basis}${pad}`, { waitUntil: 'networkidle' })
  const koek = page.getByRole('button', { name: /Alles toestaan/i })
  if (await koek.count()) await koek.first().click()
  await page.waitForTimeout(1600)
}

await open('/nl/plattegrond')
await page.screenshot({ path: `${uit}/nieuw-plattegrond-boven.png` })
await page.screenshot({ path: `${uit}/nieuw-plattegrond.png`, fullPage: true })
console.log('· boven')

// Programma: aanmelden openen en bevestigen (de receptie staat standaard open)
const aanmeld = page.locator('.prog-btn').first()
if (await aanmeld.count()) {
  await aanmeld.click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${uit}/nieuw-aanmelden.png`, fullPage: true })
  await page.locator('.prog-field input').fill('Sanne')
  await page.locator('.prog-form-actions .prog-btn').click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${uit}/nieuw-aangemeld.png`, fullPage: true })
  console.log('· aanmelden')
} else {
  console.log('! geen aanmeldknop gevonden')
}

// Een plek aanklikken in de tekening
await page.locator('.map-svg .zone[data-zone="kampeerveld"]').click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${uit}/nieuw-zone-kampeerveld.png`, fullPage: true })
console.log('· zone kampeerveld')

// Een plek met reserveerknop
await page.locator('.map-svg .zone[data-zone="achterste"]').click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${uit}/nieuw-zone-achterste.png`, fullPage: true })
console.log('· zone achterste')

// Via de knoppen onder de kaart
await page.locator('.map-chips .chip', { hasText: 'Speelweide' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${uit}/nieuw-zone-speelweide.png`, fullPage: true })
console.log('· chip speelweide')

// Engelse en Duitse versie
for (const [taal, pad] of [
  ['en', '/en/site-map'],
  ['de', '/de/lageplan'],
]) {
  await open(pad)
  await page.screenshot({ path: `${uit}/nieuw-plattegrond-${taal}.png`, fullPage: true })
  console.log('·', taal)
}

// Mobiel
const mobiel = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  locale: 'nl-NL',
})
const mpage = await mobiel.newPage()
mpage.on('pageerror', (e) => fouten.push(`mobiel pageerror: ${e.message}`))
await mpage.goto(`${basis}/nl/plattegrond`, { waitUntil: 'networkidle' })
const mkoek = mpage.getByRole('button', { name: /Alles toestaan/i })
if (await mkoek.count()) await mkoek.first().click()
await mpage.waitForTimeout(1600)
await mpage.screenshot({ path: `${uit}/nieuw-plattegrond-mobiel.png`, fullPage: true })
await mpage.locator('.map-svg .zone[data-zone="zwembad"]').click({ force: true })
await mpage.waitForTimeout(1200)
await mpage.screenshot({ path: `${uit}/nieuw-plattegrond-mobiel-paneel.png`, fullPage: true })
console.log('· mobiel')

await browser.close()

if (fouten.length) {
  console.log('\nFOUTEN:')
  for (const f of new Set(fouten)) console.log(' -', f)
} else {
  console.log('\nGeen console-fouten.')
}
