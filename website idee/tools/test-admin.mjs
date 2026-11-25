/* Test elk "toevoegen"-knop van het beheer tegen de echte omgeving. */
const basis = process.argv[2] ?? 'https://degroeneweide.danielsturkenboom.nl'
let cookie = ''

async function verzoek(pad, opties = {}) {
  const res = await fetch(`${basis}/api/${pad}`, {
    ...opties,
    headers: {
      ...(opties.body && !(opties.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(opties.headers ?? {}),
    },
  })
  const set = res.headers.get('set-cookie')
  if (set) cookie = set.split(';')[0]
  const tekst = await res.text()
  let data = null
  try {
    data = tekst ? JSON.parse(tekst) : null
  } catch {
    data = tekst
  }
  return { status: res.status, data }
}

const uitkomst = []
function note(naam, ok, extra = '') {
  uitkomst.push({ naam, ok, extra })
  console.log(ok ? '✅' : '❌', naam, extra)
}

const login = await verzoek('admin/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'bert@degroeneweide.nl', wachtwoord: 'weide' }),
})
note('inloggen', login.status === 200 && login.data?.admin?.naam === 'Bert')

/* --- plek toevoegen --- */
const nieuwePlek = {
  id: 'T49',
  soort: 'tent',
  weide: 'A',
  stroom: true,
  ondergrond: 'gras',
  vlak: 'vlak',
  water: false,
  rustig: true,
  schaduw: true,
  maxPersonen: 4,
  afstandSanitair: 50,
  prijs: 25,
  status: 'open',
  hond: false,
}
const plek = await verzoek('admin/pitches', { method: 'POST', body: JSON.stringify(nieuwePlek) })
note('plek toevoegen', plek.status === 201 && plek.data?.plek?.id === 'T49', plek.data?.fout ?? '')
const plekken = await verzoek('pitches')
note(
  'plek zichtbaar op de site',
  plekken.data.plekken.some((p) => p.id === 'T49'),
  `${plekken.data.plekken.length} plekken`,
)

const dubbel = await verzoek('admin/pitches', { method: 'POST', body: JSON.stringify(nieuwePlek) })
note('dubbele plek geweigerd', dubbel.status === 409, dubbel.data?.fout ?? '')

/* --- evenement toevoegen --- */
const event = await verzoek('admin/events', {
  method: 'POST',
  body: JSON.stringify({
    dag: 3,
    tijd: '20:30',
    titelNl: 'Sterren kijken op het erf',
    titelEn: 'Stargazing on the farm',
    titelDe: 'Sterne gucken auf dem Hof',
    locatie: 'Speelweide',
    leeftijd: 'Alle leeftijden',
    soort: 'spelen',
  }),
})
note('evenement toevoegen', event.status === 201, event.data?.fout ?? '')
const events = await verzoek('events')
note(
  'evenement in de agenda',
  events.data.events.some((e) => e.titel_nl === 'Sterren kijken op het erf' && e.titel_en.startsWith('Stargazing')),
  `${events.data.events.length} evenementen`,
)

/* --- voorziening toevoegen --- */
const facil = await verzoek('admin/facilities', {
  method: 'POST',
  body: JSON.stringify({ id: 'speeltuin', soort: 'spelen', naam: 'Speeltuin', kort: 'Spelen', x: 2, y: 3 }),
})
note('voorziening toevoegen', facil.status === 201, facil.data?.fout ?? '')
const faciliteiten = await verzoek('facilities')
note(
  'voorziening op de plattegrond',
  faciliteiten.data.voorzieningen.some((v) => v.id === 'speeltuin'),
  `${faciliteiten.data.voorzieningen.length} voorzieningen`,
)

/* --- foto uploaden --- */
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)
const form = new FormData()
form.append('foto', new Blob([png], { type: 'image/png' }), 'test.png')
const upload = await verzoek('admin/media/hero', { method: 'POST', body: form })
note('foto uploaden', upload.status === 201, upload.data?.fout ?? '')
const media = await verzoek('media')
note('foto geregistreerd', Boolean(media.data.foto.hero), JSON.stringify(media.data.foto))
const plaatje = await fetch(`${basis}/api/media/hero`)
note(
  'foto uitgeleverd',
  plaatje.status === 200 && (plaatje.headers.get('content-type') ?? '').includes('image/png'),
  plaatje.headers.get('content-type') ?? '',
)

/* --- teamlid toevoegen --- */
const team = await verzoek('admin/team', {
  method: 'POST',
  body: JSON.stringify({
    naam: 'Test Receptie',
    email: 'test.receptie@degroeneweide.nl',
    rol: 'receptie',
    wachtwoord: 'test12345',
  }),
})
note('teamlid toevoegen', team.status === 201, team.data?.fout ?? '')
const teamlijst = await verzoek('admin/team')
note(
  'teamlid in de lijst',
  teamlijst.data.team.some((t) => t.email === 'test.receptie@degroeneweide.nl'),
  `${teamlijst.data.team.length} beheerders`,
)

const inloggenNieuw = await fetch(`${basis}/api/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test.receptie@degroeneweide.nl', wachtwoord: 'test12345' }),
})
note('nieuw teamlid kan inloggen', inloggenNieuw.status === 200)

/* --- reservering toevoegen vanuit het beheer --- */
const mailstatus = await verzoek('admin/mail/status')
const testAdres = mailstatus.data?.notificatie ?? 'receptie@danielsturkenboom.nl'

const reservering = await verzoek('admin/reservations', {
  method: 'POST',
  body: JSON.stringify({
    aankomst: '2027-06-07',
    vertrek: '2027-06-10',
    volwassenen: 2,
    kinderen: 1,
    plek: 'T49',
    wensen: [],
    taal: 'nl',
    gegevens: {
      naam: 'Beheer Testboeking',
      email: testAdres,
      telefoon: '0612345678',
      adres: 'Testlaan 1',
      postcode: '1234AB',
      plaats: 'Weideveen',
      land: 'Nederland',
      opmerking: 'via het beheer',
    },
  }),
})
note(
  'reservering toevoegen',
  reservering.status === 201 && Boolean(reservering.data?.reservering?.nummer),
  reservering.data?.fout ?? reservering.data?.reservering?.nummer ?? '',
)
const nummer = reservering.data?.reservering?.nummer

const bezet = await verzoek('availability?van=2027-06-07&tot=2027-06-08')
note('plek nu bezet op de site', (bezet.data.bezet['2027-06-07'] ?? []).includes('T49'))

await new Promise((r) => setTimeout(r, 1500))
const outbox = await verzoek('admin/outbox')
const mails = outbox.data.mails.filter((m) => m.onderwerp.includes(nummer ?? 'xxxx'))
note(
  'bevestiging + melding verstuurd',
  mails.length >= 2 && mails.every((m) => m.status === 'verzonden'),
  mails.map((m) => `${m.soort}:${m.status}`).join(', '),
)

/* --- opruimen --- */
if (nummer) await verzoek(`admin/reservations/${nummer}`, { method: 'DELETE' })
await verzoek('admin/pitches/T49', { method: 'DELETE' })
if (event.data?.event?.id) await verzoek(`admin/events/${event.data.event.id}`, { method: 'DELETE' })
await verzoek('admin/facilities/speeltuin', { method: 'DELETE' })
await verzoek('admin/media/hero', { method: 'DELETE' })
await verzoek('admin/team/test.receptie%40degroeneweide.nl', { method: 'DELETE' })

const na = {
  plekken: (await verzoek('pitches')).data.plekken.length,
  events: (await verzoek('events')).data.events.length,
  faciliteiten: (await verzoek('facilities')).data.voorzieningen.length,
  media: Object.keys((await verzoek('media')).data.foto).length,
  team: (await verzoek('admin/team')).data.team.length,
}
console.log('\nNa opruimen:', JSON.stringify(na))

const gefaald = uitkomst.filter((r) => !r.ok)
console.log(`\n${uitkomst.length - gefaald.length}/${uitkomst.length} controles geslaagd`)
if (gefaald.length) {
  console.log('Mislukt:', gefaald.map((r) => `${r.naam} ${r.extra}`).join(' | '))
  process.exitCode = 1
}
