/** De JSON-API van de site: alles wat de site, de reservering en het beheer nodig hebben. */
import {
  cookieWaarde,
  controleerLoginLimiet,
  login,
  registreerMislukteLogin,
  sessie,
  uitloggen,
  wisCookie,
  wisMislukteLogins,
  type Beheerder,
} from './auth'
import {
  allePlekken,
  beschikbaarheid,
  haalReservering,
  instellingen,
  lijstReserveringen,
  maakPlek,
  maakReservering,
  statistieken,
  verwijderPlek,
  verwijderReservering,
  wijzigPlekRij,
  zetInstelling,
  zorgVoorPlekken,
  type NieuweReservering,
} from './data'
import {
  bewaarMedia,
  haalMedia,
  lijstBeheerders,
  lijstEvents,
  lijstFaciliteiten,
  lijstMedia,
  maakBeheerder,
  maakEvent,
  maakFaciliteit,
  verwijderBeheerder,
  verwijderEvent,
  verwijderFaciliteit,
  verwijderMedia,
  wijzigBeheerder,
  wijzigEvent,
  wijzigFaciliteit,
  zorgVoorCms,
} from './cms'
import {
  annuleringMail,
  bevestigingMail,
  contactMail,
  mailTransport,
  notificatieMail,
  probeerVerzenden,
  stuurMail,
  testMail,
} from './mail'
import type { BerichtRij, OutboxRij, ReserveringRij, Taal } from './types'
import {
  actieveMeldingen,
  beheerTeksten,
  eigenTeksten,
  lijstMeldingen,
  maakMelding,
  vertaalOntbrekend,
  verwijderMelding,
  wijzigMelding,
  wisTekst,
  zetTekst,
} from './teksten'
import { vertalenMogelijk } from './vertaler'
import { dataOverzicht, wisData, wisGast, type DataOnderdeel } from './onderhoud'
import { fout, isDatum, isEmail, json, leesJson, seizoen, tekst, vandaag } from './util'

const STATUSSEN = ['bevestigd', 'betaald', 'geannuleerd', 'nieuw'] as const
const TALEN = ['nl', 'en', 'de'] as const

/* -------------------------------------------------------------------------- */
/* Openbaar                                                                   */
/* -------------------------------------------------------------------------- */

async function configuratie(env: Env) {
  const s = await instellingen(env)
  const seizoenNu = seizoen()
  return {
    aankondiging: s.aankondiging ?? '',
    aankondigingAan: s.aankondiging_aan === '1',
    plekmatchAan: s.plekmatch_aan === '1',
    seizoen: { van: seizoenNu.van, tot: seizoenNu.tot },
    meldingen: await actieveMeldingen(env),
  }
}

async function beschikbaarheidRoute(env: Env, url: URL) {
  const van = url.searchParams.get('van') ?? ''
  const tot = url.searchParams.get('tot') ?? ''
  if (!isDatum(van) || !isDatum(tot)) throw fout(400, 'Geef van en tot als YYYY-MM-DD.')
  if (tot <= van) throw fout(400, 'tot moet na van liggen.')

  const dagen =
    (new Date(`${tot}T00:00:00Z`).getTime() - new Date(`${van}T00:00:00Z`).getTime()) / 86_400_000
  if (dagen > 400) throw fout(400, 'Periode is te lang.')

  return { bezet: await beschikbaarheid(env, van, tot) }
}

function publiekeReservering(r: ReserveringRij) {
  return {
    nummer: r.nummer,
    pitch: r.pitch,
    van: r.van,
    tot: r.tot,
    volwassenen: r.volwassenen,
    kinderen: r.kinderen,
    naam: r.naam,
    email: r.email,
    bedrag: r.bedrag,
    status: r.status,
    taal: r.taal,
  }
}

interface ReserveringBody {
  aankomst?: string
  vertrek?: string
  volwassenen?: number
  kinderen?: number
  plek?: string
  wensen?: string[]
  taal?: string
  akkoord?: boolean
  gegevens?: {
    naam?: string
    email?: string
    telefoon?: string
    adres?: string
    postcode?: string
    plaats?: string
    land?: string
    opmerking?: string
  }
}

function leesReservering(
  invoer: ReserveringBody,
  vereisAkkoord: boolean,
): NieuweReservering {
  const van = invoer.aankomst ?? ''
  const tot = invoer.vertrek ?? ''

  if (!isDatum(van) || !isDatum(tot)) throw fout(400, 'Kies een aankomst- en vertrekdatum.')
  if (tot <= van) throw fout(400, 'De vertrekdatum moet na de aankomst liggen.')
  if (!invoer.plek) throw fout(400, 'Kies een plek.')
  if (!invoer.gegevens || !tekst(invoer.gegevens.naam, 120)) throw fout(400, 'Vul een naam in.')
  if (!isEmail(invoer.gegevens.email)) throw fout(400, 'Vul een geldig e-mailadres in.')
  if (vereisAkkoord && invoer.akkoord !== true) throw fout(400, 'Vink de voorwaarden aan.')

  const g = invoer.gegevens
  return {
    pitch: tekst(invoer.plek, 8).toUpperCase(),
    van,
    tot,
    volwassenen: Math.min(12, Math.max(1, Number(invoer.volwassenen) || 1)),
    kinderen: Math.min(10, Math.max(0, Number(invoer.kinderen) || 0)),
    naam: tekst(g.naam, 120),
    email: tekst(g.email, 160).toLowerCase(),
    telefoon: tekst(g.telefoon, 40),
    adres: tekst(g.adres, 160),
    postcode: tekst(g.postcode, 16),
    plaats: tekst(g.plaats, 80),
    land: tekst(g.land, 80) || 'Nederland',
    opmerking: tekst(g.opmerking, 1000),
    wensen: JSON.stringify((invoer.wensen ?? []).map((w) => tekst(w, 24)).slice(0, 8)),
    taal: (TALEN as readonly string[]).includes(invoer.taal ?? '') ? (invoer.taal as Taal) : 'nl',
  }
}

async function nieuweReservering(env: Env, ctx: ExecutionContext, request: Request) {
  const invoer = await leesJson<ReserveringBody>(request)
  const rij = await maakReservering(env, leesReservering(invoer, true))

  await stuurMail(env, ctx, bevestigingMail(rij, env.MAIL_BOEKINGEN))
  await stuurMail(
    env,
    ctx,
    notificatieMail(rij, env.MAIL_NOTIFICATIE, env.MAIL_RECEPTIE, env.SITE_URL),
  )

  return {
    nummer: rij.nummer,
    token: rij.token,
    bedrag: rij.bedrag,
    plek: rij.pitch,
    van: rij.van,
    tot: rij.tot,
  }
}

async function bekijkReservering(env: Env, nummer: string, token: string) {
  const rij = await haalReservering(env, nummer)
  if (!rij) throw fout(404, 'Reservering niet gevonden.')
  if (!token || token !== rij.token) throw fout(403, 'Deze link hoort niet bij de reservering.')
  return publiekeReservering(rij)
}

async function annuleerReservering(env: Env, ctx: ExecutionContext, nummer: string, request: Request) {
  const body = await leesJson<{ token?: string }>(request)
  const rij = await haalReservering(env, nummer)
  if (!rij) throw fout(404, 'Reservering niet gevonden.')
  if (!body.token || body.token !== rij.token) throw fout(403, 'Deze link hoort niet bij de reservering.')
  if (rij.status === 'geannuleerd') return { ok: true, alGeannuleerd: true }

  await env.DB.prepare("UPDATE reservations SET status = 'geannuleerd' WHERE nummer = ?")
    .bind(nummer)
    .run()

  await stuurMail(env, ctx, annuleringMail({ ...rij, status: 'geannuleerd' }, env.MAIL_BOEKINGEN))
  return { ok: true, alGeannuleerd: false }
}

async function nieuwBericht(env: Env, ctx: ExecutionContext, request: Request) {
  const invoer = await leesJson<{ naam?: string; email?: string; onderwerp?: string; bericht?: string }>(request)
  const naam = tekst(invoer.naam, 120)
  const email = tekst(invoer.email, 160)
  const onderwerp = tekst(invoer.onderwerp, 120) || 'Vraag'
  const bericht = tekst(invoer.bericht, 4000)

  if (!naam) throw fout(400, 'Vul je naam in.')
  if (!isEmail(email)) throw fout(400, 'Vul een geldig e-mailadres in.')
  if (bericht.length < 2) throw fout(400, 'Schrijf even wat je vraag is.')

  await env.DB.prepare(
    'INSERT INTO messages (naam, email, onderwerp, bericht, aangemaakt) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(naam, email.toLowerCase(), onderwerp, bericht, new Date().toISOString())
    .run()

  await stuurMail(
    env,
    ctx,
    contactMail({ naam, email, onderwerp, bericht }, env.MAIL_NOTIFICATIE, env.MAIL_RECEPTIE),
  )
  return { ok: true }
}

async function nieuweAanmelding(env: Env, request: Request) {
  const invoer = await leesJson<{ email?: string; taal?: string }>(request)
  const email = tekst(invoer.email, 160).toLowerCase()
  if (!isEmail(email)) throw fout(400, 'Vul een geldig e-mailadres in.')

  const taal = (TALEN as readonly string[]).includes(invoer.taal ?? '') ? invoer.taal! : 'nl'
  await env.DB.prepare(
    'INSERT INTO subscribers (email, taal, aangemaakt) VALUES (?, ?, ?) ON CONFLICT (email) DO NOTHING',
  )
    .bind(email, taal, new Date().toISOString())
    .run()

  return { ok: true }
}

/* -------------------------------------------------------------------------- */
/* Beheer                                                                     */
/* -------------------------------------------------------------------------- */

async function beheerder(request: Request, env: Env): Promise<Beheerder> {
  const admin = await sessie(request, env)
  if (!admin) throw fout(401, 'Niet ingelogd.')
  return admin
}

async function loginRoute(env: Env, request: Request) {
  const { email, wachtwoord } = await leesJson<{ email?: string; wachtwoord?: string }>(request)
  if (!isEmail(email) || typeof wachtwoord !== 'string' || wachtwoord.length < 3) {
    throw fout(400, 'Vul je e-mailadres en wachtwoord in.')
  }
  const schoonEmail = email.trim().toLowerCase()
  await controleerLoginLimiet(request, env, schoonEmail)
  try {
    const { admin, token, maxAge } = await login(env, schoonEmail, wachtwoord)
    await wisMislukteLogins(request, env, schoonEmail)
    return { admin, cookie: cookieWaarde(token, maxAge) }
  } catch (e) {
    if ((e as { status?: number }).status === 401) {
      await registreerMislukteLogin(request, env, schoonEmail)
    }
    throw e
  }
}

async function beheerReserveringen(env: Env, url: URL) {
  const rijen = await lijstReserveringen(
    env,
    tekst(url.searchParams.get('q'), 80),
    tekst(url.searchParams.get('status'), 20),
  )
  return { reserveringen: rijen }
}

async function beheerNieuweReservering(env: Env, ctx: ExecutionContext, request: Request) {
  const invoer = await leesJson<ReserveringBody>(request)
  const rij = await maakReservering(env, leesReservering(invoer, false))

  await stuurMail(env, ctx, bevestigingMail(rij, env.MAIL_BOEKINGEN))
  await stuurMail(
    env,
    ctx,
    notificatieMail(rij, env.MAIL_NOTIFICATIE, env.MAIL_RECEPTIE, env.SITE_URL),
  )

  return { reservering: rij }
}

async function wijzigReservering(env: Env, ctx: ExecutionContext, nummer: string, request: Request) {
  const { status } = await leesJson<{ status?: string }>(request)
  if (!(STATUSSEN as readonly string[]).includes(status ?? '')) throw fout(400, 'Onbekende status.')

  const rij = await haalReservering(env, nummer)
  if (!rij) throw fout(404, 'Reservering niet gevonden.')

  await env.DB.prepare('UPDATE reservations SET status = ? WHERE nummer = ?')
    .bind(status, nummer)
    .run()

  if (status === 'geannuleerd' && rij.status !== 'geannuleerd') {
    await stuurMail(env, ctx, annuleringMail({ ...rij, status: 'geannuleerd' }, env.MAIL_BOEKINGEN))
  }
  return { ok: true }
}

async function beheerBerichten(env: Env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM messages ORDER BY aangemaakt DESC LIMIT 200',
  ).all<BerichtRij>()
  return { berichten: results ?? [] }
}

async function beheerOutbox(env: Env) {
  const { results } = await env.DB.prepare(
    'SELECT id, aan, van, onderwerp, soort, status, fout, via, pogingen, aangemaakt FROM outbox ORDER BY id DESC LIMIT 100',
  ).all<Omit<OutboxRij, 'tekst' | 'html'>>()
  return { mails: results ?? [] }
}

async function opnieuwVersturen(env: Env, id: number) {
  const rij = await env.DB.prepare('SELECT * FROM outbox WHERE id = ?').bind(id).first<OutboxRij>()
  if (!rij) throw fout(404, 'Mail niet gevonden.')
  const gelukt = await probeerVerzenden(env, id, {
    aan: rij.aan,
    van: rij.van,
    onderwerp: rij.onderwerp,
    tekst: rij.tekst,
    html: rij.html,
    soort: rij.soort,
  })
  return { ok: gelukt }
}

function mailStatus(env: Env) {
  return {
    transport: mailTransport(env),
    boekingen: env.MAIL_BOEKINGEN,
    receptie: env.MAIL_RECEPTIE,
    notificatie: env.MAIL_NOTIFICATIE,
  }
}

async function stuurTestmail(env: Env, request: Request) {
  const { aan } = await leesJson<{ aan?: string }>(request)
  const doel = tekst(aan, 160) || env.MAIL_NOTIFICATIE
  if (!isEmail(doel)) throw fout(400, 'Vul een geldig e-mailadres in.')

  const mail = testMail(doel, env.MAIL_BOEKINGEN)
  const rij = await env.DB.prepare(
    `INSERT INTO outbox (aan, van, onderwerp, tekst, html, soort, status, aangemaakt)
     VALUES (?, ?, ?, ?, ?, 'test', 'wacht', ?)`,
  )
    .bind(mail.aan, mail.van, mail.onderwerp, mail.tekst, mail.html, new Date().toISOString())
    .run()

  const id = Number(rij.meta?.last_row_id ?? 0)
  const gelukt = await probeerVerzenden(env, id, mail)
  const na = await env.DB.prepare('SELECT fout, via FROM outbox WHERE id = ?')
    .bind(id)
    .first<{ fout: string | null; via: string | null }>()

  return { ok: gelukt, aan: doel, via: na?.via ?? mailTransport(env), fout: na?.fout ?? null }
}

/* -------------------------------------------------------------------------- */
/* Router                                                                     */
/* -------------------------------------------------------------------------- */

async function route(request: Request, env: Env, ctx: ExecutionContext, url: URL): Promise<Response> {
  const pad = url.pathname.replace(/^\/api\/?/, '')
  const delen = pad.split('/').filter(Boolean).map(decodeURIComponent)
  const methode = request.method
  const kop = delen[0] ?? ''

  /* --- openbaar --- */
  if (kop === 'health') return json({ ok: true, vandaag: vandaag(), seizoen: seizoen() })
  if (kop === 'config' && methode === 'GET') return json(await configuratie(env))
  if (kop === 'texts' && methode === 'GET') return json({ teksten: await eigenTeksten(env) })
  if (kop === 'pitches' && methode === 'GET') return json({ plekken: await allePlekken(env) })
  if (kop === 'availability' && methode === 'GET') return json(await beschikbaarheidRoute(env, url))
  if (kop === 'events' && methode === 'GET') return json({ events: await lijstEvents(env) })
  if (kop === 'facilities' && methode === 'GET') return json({ voorzieningen: await lijstFaciliteiten(env) })

  if (kop === 'media' && methode === 'GET' && !delen[1]) {
    const rijen = await lijstMedia(env)
    return json({ foto: Object.fromEntries(rijen.map((m) => [m.sleutel, m.aangemaakt])) })
  }
  if (kop === 'media' && methode === 'GET' && delen[1]) {
    const foto = await haalMedia(env, delen[1])
    if (!foto) throw fout(404, 'Geen foto.')
    return new Response(foto.bytes, {
      headers: {
        'Content-Type': foto.type,
        'Cache-Control': 'public, max-age=60',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  if (kop === 'reservations' && methode === 'POST') return json(await nieuweReservering(env, ctx, request), 201)
  if (kop === 'reservations' && delen[1]) {
    const nummer = delen[1]
    if (methode === 'GET') {
      return json(await bekijkReservering(env, nummer, url.searchParams.get('token') ?? ''))
    }
    if (methode === 'POST' && delen[2] === 'annuleer') {
      return json(await annuleerReservering(env, ctx, nummer, request))
    }
  }
  if (kop === 'contact' && methode === 'POST') return json(await nieuwBericht(env, ctx, request))
  if (kop === 'nieuwsbrief' && methode === 'POST') return json(await nieuweAanmelding(env, request))

  /* --- beheer --- */
  if (kop === 'admin') {
    if (delen[1] === 'login' && methode === 'POST') {
      const { admin, cookie } = await loginRoute(env, request)
      return json({ admin }, 200, { 'Set-Cookie': cookie })
    }
    if (delen[1] === 'logout' && methode === 'POST') {
      await uitloggen(request, env)
      return json({ ok: true }, 200, { 'Set-Cookie': wisCookie() })
    }
    if (delen[1] === 'ik' && methode === 'GET') {
      return json({ admin: await sessie(request, env) })
    }

    await beheerder(request, env)
    const wat = delen[1]
    const id = delen[2]

    /* reserveringen */
    if (wat === 'reservations' && methode === 'GET' && !id) {
      return json(await beheerReserveringen(env, url))
    }
    if (wat === 'reservations' && methode === 'POST' && !id) {
      return json(await beheerNieuweReservering(env, ctx, request), 201)
    }
    if (wat === 'reservations' && id && methode === 'PATCH') {
      return json(await wijzigReservering(env, ctx, id, request))
    }
    if (wat === 'reservations' && id && methode === 'DELETE') {
      await verwijderReservering(env, id)
      return json({ ok: true })
    }

    /* statistieken en instellingen */
    if (wat === 'stats' && methode === 'GET') {
      return json(await statistieken(env, url.searchParams.get('dag') ?? vandaag()))
    }
    if (wat === 'settings' && methode === 'GET') {
      return json({ instellingen: await instellingen(env) })
    }
    if (wat === 'settings' && methode === 'PATCH') {
      const invoer = await leesJson<Record<string, string>>(request)
      const toegestaan = new Set(['aankondiging', 'aankondiging_aan', 'plekmatch_aan'])
      for (const [sleutel, waarde] of Object.entries(invoer)) {
        if (!toegestaan.has(sleutel)) continue
        await zetInstelling(env, sleutel, tekst(waarde, 240))
      }
      return json({ instellingen: await instellingen(env) })
    }

    /* teksten */
    if (wat === 'texts' && methode === 'GET') {
      return json({ teksten: await beheerTeksten(env), vertalen: vertalenMogelijk(env) })
    }
    if (wat === 'texts' && id === 'vertalen' && methode === 'POST') {
      return json(await vertaalOntbrekend(env))
    }
    if (wat === 'texts' && id && methode === 'PATCH') {
      const { nl: nlWaarde } = await leesJson<{ nl?: string }>(request)
      return json({ tekst: await zetTekst(env, id, nlWaarde) })
    }
    if (wat === 'texts' && id && methode === 'DELETE') {
      await wisTekst(env, id)
      return json({ ok: true })
    }

    /* meldingen bovenaan de site */
    if (wat === 'notices' && methode === 'GET') return json({ meldingen: await lijstMeldingen(env) })
    if (wat === 'notices' && methode === 'POST' && !id) {
      return json({ melding: await maakMelding(env, await leesJson(request)) }, 201)
    }
    if (wat === 'notices' && id && methode === 'PATCH') {
      return json({ melding: await wijzigMelding(env, Number(id), await leesJson(request)) })
    }
    if (wat === 'notices' && id && methode === 'DELETE') {
      await verwijderMelding(env, Number(id))
      return json({ ok: true })
    }

    /* plekken */
    if (wat === 'pitches' && methode === 'GET') return json({ plekken: await allePlekken(env) })
    if (wat === 'pitches' && methode === 'POST' && !id) {
      return json({ plek: await maakPlek(env, await leesJson(request)) }, 201)
    }
    if (wat === 'pitches' && id && methode === 'PATCH') {
      await wijzigPlekRij(env, id, await leesJson(request))
      return json({ ok: true })
    }
    if (wat === 'pitches' && id && methode === 'DELETE') {
      await verwijderPlek(env, id)
      return json({ ok: true })
    }

    /* evenementen */
    if (wat === 'events' && methode === 'GET') return json({ events: await lijstEvents(env) })
    if (wat === 'events' && methode === 'POST' && !id) {
      return json({ event: await maakEvent(env, await leesJson(request)) }, 201)
    }
    if (wat === 'events' && id && methode === 'PATCH') {
      await wijzigEvent(env, Number(id), await leesJson(request))
      return json({ ok: true })
    }
    if (wat === 'events' && id && methode === 'DELETE') {
      await verwijderEvent(env, Number(id))
      return json({ ok: true })
    }

    /* voorzieningen */
    if (wat === 'facilities' && methode === 'GET') {
      return json({ voorzieningen: await lijstFaciliteiten(env) })
    }
    if (wat === 'facilities' && methode === 'POST' && !id) {
      return json({ voorziening: await maakFaciliteit(env, await leesJson(request)) }, 201)
    }
    if (wat === 'facilities' && id && methode === 'PATCH') {
      await wijzigFaciliteit(env, id, await leesJson(request))
      return json({ ok: true })
    }
    if (wat === 'facilities' && id && methode === 'DELETE') {
      await verwijderFaciliteit(env, id)
      return json({ ok: true })
    }

    /* foto's */
    if (wat === 'media' && methode === 'GET') return json({ foto: await lijstMedia(env) })
    if (wat === 'media' && id && methode === 'POST') {
      const form = await request.formData()
      const bestand = form.get('foto')
      if (!(bestand instanceof File)) throw fout(400, 'Geen bestand ontvangen.')
      return json({ foto: await bewaarMedia(env, id, bestand) }, 201)
    }
    if (wat === 'media' && id && methode === 'DELETE') {
      await verwijderMedia(env, id)
      return json({ ok: true })
    }

    /* beheerders */
    if (wat === 'team' && methode === 'GET') return json({ team: await lijstBeheerders(env) })
    if (wat === 'team' && methode === 'POST' && !id) {
      return json({ beheerder: await maakBeheerder(env, await leesJson(request)) }, 201)
    }
    if (wat === 'team' && id && methode === 'PATCH') {
      await wijzigBeheerder(env, id, await leesJson(request))
      return json({ ok: true })
    }
    if (wat === 'team' && id && methode === 'DELETE') {
      const admin = await beheerder(request, env)
      await verwijderBeheerder(env, id, admin.email)
      return json({ ok: true })
    }

    /* gegevens verwijderen */
    if (wat === 'data' && methode === 'GET') {
      return json(await dataOverzicht(env))
    }
    if (wat === 'data' && id === 'verwijder' && methode === 'POST') {
      const { wat: onderdeel, bevestig } = await leesJson<{ wat?: string; bevestig?: string }>(request)
      if (!onderdeel) throw fout(400, 'Kies wat je wilt verwijderen.')
      if (onderdeel === 'alles' ? bevestig !== 'ALLES' : bevestig !== 'VERWIJDER') {
        throw fout(400, 'Bevestiging ontbreekt.')
      }
      const uitkomst = await wisData(env, onderdeel as DataOnderdeel)
      return json({ ok: true, ...uitkomst })
    }
    if (wat === 'data' && id === 'gast' && methode === 'POST') {
      const { email, bevestig } = await leesJson<{ email?: string; bevestig?: string }>(request)
      if (bevestig !== 'VERWIJDER') throw fout(400, 'Bevestiging ontbreekt.')
      return json({ ok: true, ...(await wisGast(env, email ?? '')) })
    }

    /* berichten */
    if (wat === 'messages' && methode === 'GET') return json(await beheerBerichten(env))
    if (wat === 'messages' && id && methode === 'PATCH') {
      const { gelezen } = await leesJson<{ gelezen?: boolean }>(request)
      await env.DB.prepare('UPDATE messages SET gelezen = ? WHERE id = ?')
        .bind(gelezen ? 1 : 0, Number(id))
        .run()
      return json({ ok: true })
    }
    if (wat === 'messages' && id && methode === 'DELETE') {
      await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(Number(id)).run()
      return json({ ok: true })
    }

    /* mail */
    if (wat === 'outbox' && methode === 'GET') return json(await beheerOutbox(env))
    if (wat === 'outbox' && id && delen[3] === 'opnieuw' && methode === 'POST') {
      return json(await opnieuwVersturen(env, Number(id)))
    }
    if (wat === 'mail' && id === 'status' && methode === 'GET') return json(mailStatus(env))
    if (wat === 'mail' && id === 'test' && methode === 'POST') return json(await stuurTestmail(env, request))
  }

  throw fout(404, 'Onbekend API-pad.')
}

export async function verwerk(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url)
  try {
    await zorgVoorPlekken(env)
    await zorgVoorCms(env)
    return await route(request, env, ctx, url)
  } catch (e) {
    const status = (e as { status?: number }).status ?? 500
    if (status >= 500) console.error('api-fout', { pad: url.pathname, fout: String(e) })
    return json({ fout: e instanceof Error ? e.message : 'Onbekende fout.' }, status)
  }
}
