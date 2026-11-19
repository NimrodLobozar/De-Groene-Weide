/* End-to-end test van de live site: reservering maken en in het beheer terugzien. */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const basis = process.argv[2] ?? 'https://degroeneweide.danielsturkenboom.nl'
const uit = 'tools/shots'
await mkdir(uit, { recursive: true })

const fouten = []
const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'nl-NL' })
const page = await context.newPage()
page.on('pageerror', (e) => fouten.push(`pageerror: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && fouten.push(`console: ${m.text()}`))

const api = []
page.on('response', (r) => {
  const u = new URL(r.url())
  if (u.pathname.startsWith('/api/')) api.push(`${r.status()} ${r.request().method()} ${u.pathname}`)
})

await page.goto(`${basis}/nl`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Alles toestaan/i }).click().catch(() => {})
await page.waitForTimeout(400)
await page.screenshot({ path: `${uit}/live2-home.png` })

// reservering doorlopen
await page.goto(`${basis}/nl/reserveren/stap-1`, { waitUntil: 'networkidle' })
await page.locator('.dag:not([disabled])').nth(11).click()
await page.locator('.dag:not([disabled])').nth(13).click()
await page.getByRole('button', { name: /Bekijk de beste plekken/i }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /Bekijk de beste plekken/i }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${uit}/live2-stap3.png`, fullPage: true })

await page.getByRole('button', { name: /Kies deze/i }).first().click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: /Verder naar je gegevens/i }).click()
await page.waitForTimeout(300)

await page.fill('#naam', process.env.GAST_NAAM ?? 'Testgast Van De Weide')
await page.fill('#email', process.env.GAST_EMAIL ?? 'testgast@example.com')
await page.fill('#telefoon', '06 11 22 33 44')
await page.fill('#plaats', 'Weideveen')
await page.locator('.checkveld input').check()
await page.getByRole('button', { name: /Verder naar controleren/i }).click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: /Reserveer nu/i }).click()
await page.waitForTimeout(1600)

const eindUrl = new URL(page.url()).pathname
const nummer = eindUrl.split('/').pop()
console.log('· eind-URL:', eindUrl)
await page.screenshot({ path: `${uit}/live2-bevestiging.png`, fullPage: true })

// beheer
await page.goto(`${basis}/nl/beheer`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /^Inloggen$/ }).click()
await page.waitForTimeout(1200)
await page.screenshot({ path: `${uit}/live2-beheer.png`, fullPage: true })

await page.goto(`${basis}/nl/beheer/reserveringen`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const gevonden = await page.locator('tbody tr', { hasText: nummer }).count()
await page.screenshot({ path: `${uit}/live2-beheer-reserveringen.png`, fullPage: true })
console.log('· reservering in beheer gevonden:', gevonden > 0, `(${nummer})`)

await page.goto(`${basis}/nl/beheer/email`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const mails = await page.locator('tbody tr').count()
await page.screenshot({ path: `${uit}/live2-beheer-email.png`, fullPage: true })
console.log('· mails in wachtrij/logboek:', mails)

await browser.close()

console.log('\nAPI-verkeer:')
for (const regel of [...new Set(api)]) console.log('  ', regel)
console.log('\nJS-fouten:', fouten.length ? fouten : 'geen')
