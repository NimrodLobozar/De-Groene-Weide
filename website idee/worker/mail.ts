/**
 * Alle e-mail die de site verstuurt.
 *
 * Elke mail wordt eerst in de wachtrij (tabel outbox) gezet en daarna aangeboden
 * aan Cloudflare Email Sending. Lukt dat niet — bijvoorbeeld omdat de omgeving
 * nog geen Email Sending heeft — dan blijft de mail met de foutmelding in de
 * wachtrij staan en kan hij vanuit het beheer opnieuw worden verstuurd. Zo raakt
 * er nooit een bevestiging kwijt.
 */
import type { ReserveringRij, Taal } from './types'

export interface Mail {
  aan: string
  van: string
  onderwerp: string
  tekst: string
  html: string
  soort: string
}

const GROEN = '#2F6B3E'
const MELK = '#FBFAF6'

function datum(isoDatum: string, taal: Taal): string {
  const locale = taal === 'de' ? 'de-DE' : taal === 'en' ? 'en-GB' : 'nl-NL'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${isoDatum}T12:00:00Z`))
}

function geld(bedrag: number, taal: Taal): string {
  const locale = taal === 'de' ? 'de-DE' : taal === 'en' ? 'en-GB' : 'nl-NL'
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(bedrag)
}

function nachten(van: string, tot: string): number {
  return Math.round(
    (new Date(`${tot}T00:00:00Z`).getTime() - new Date(`${van}T00:00:00Z`).getTime()) / 86_400_000,
  )
}

/** Eenvoudige, goed leesbare mailopmaak: één kolom, veel lucht. */
export function wrapMail(titel: string, regels: string[]): string {
  return `<!doctype html>
<html lang="nl"><body style="margin:0;padding:24px;background:${MELK};font-family:'Atkinson Hyperlegible',Verdana,sans-serif;color:#1E2A21">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E3E1D7;border-radius:14px;overflow:hidden">
    <tr><td style="background:${GROEN};padding:18px 24px;color:#fff;font-size:17px;font-weight:bold">De Groene Weide</td></tr>
    <tr><td style="padding:24px">
      <h1 style="margin:0 0 16px;font-size:21px;line-height:1.2;color:#1E2A21">${titel}</h1>
      ${regels.map((r) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6">${r}</p>`).join('')}
    </td></tr>
    <tr><td style="padding:16px 24px;background:#F7F5EE;font-size:12px;color:#5B6156;line-height:1.5">
      Camping De Groene Weide · Groene Weide 1, 1234 AB Weideveen · 0598 – 12 34 56<br />
      Je krijgt deze mail omdat je iets hebt gedaan op onze website. Vragen? Antwoord gerust.
    </td></tr>
  </table>
</body></html>`
}

const TEKST = {
  nl: {
    bevestiging: (r: ReserveringRij) => ({
      onderwerp: `Je plekje in de wei — ${r.nummer}`,
      titel: `Geboekt! Plek ${r.pitch} is van jullie.`,
      regels: [
        `Hallo ${r.naam},`,
        `We hebben je reservering genoteerd. Je bent welkom op <strong>${datum(r.van, 'nl')}</strong> en vertrekt op <strong>${datum(r.tot, 'nl')}</strong> (${nachten(r.van, r.tot)} nachten).`,
        `Plek <strong>${r.pitch}</strong> · ${r.volwassenen} volwassenen, ${r.kinderen} kinderen`,
        `Je betaalt ${geld(r.bedrag, 'nl')} bij aankomst aan de receptie. Annuleren kan tot 48 uur van tevoren.`,
        `Je reserveringsnummer is <strong>${r.nummer}</strong>. Bewaar deze mail, daar staat je link naar je reservering in.`,
        `Tot snel op het erf!
— Bert`,
      ],
    }),
    annulering: (r: ReserveringRij) => ({
      onderwerp: `Je reservering is geannuleerd — ${r.nummer}`,
      titel: 'Je reservering is geannuleerd',
      regels: [
        `Hallo ${r.naam},`,
        `We hebben je reservering voor plek ${r.pitch} (${datum(r.van, 'nl')}) geannuleerd. Je hoeft niets te betalen.`,
        'Klopt dit niet? Antwoord op deze mail, dan kijken we er meteen naar.',
      ],
    }),
    notificatie: 'Nieuwe reservering',
    contact: 'Nieuw bericht via de website',
  },
  en: {
    bevestiging: (r: ReserveringRij) => ({
      onderwerp: `Your pitch in the meadow — ${r.nummer}`,
      titel: `Booked! Pitch ${r.pitch} is yours.`,
      regels: [
        `Hello ${r.naam},`,
        `Your booking is confirmed. You are welcome on <strong>${datum(r.van, 'en')}</strong> and leave on <strong>${datum(r.tot, 'en')}</strong> (${nachten(r.van, r.tot)} nights).`,
        `Pitch <strong>${r.pitch}</strong> · ${r.volwassenen} adults, ${r.kinderen} children`,
        `You pay ${geld(r.bedrag, 'en')} at the reception on arrival. Cancelling is possible up to 48 hours before.`,
        `Your booking number is <strong>${r.nummer}</strong>. Keep this email for the link to your booking.`,
        `See you on the farm!
— Bert`,
      ],
    }),
    annulering: (r: ReserveringRij) => ({
      onderwerp: `Your booking has been cancelled — ${r.nummer}`,
      titel: 'Your booking has been cancelled',
      regels: [
        `Hello ${r.naam},`,
        `We cancelled your booking for pitch ${r.pitch} (${datum(r.van, 'en')}). There is nothing to pay.`,
        'Did we get that wrong? Just reply to this email.',
      ],
    }),
    notificatie: 'New booking',
    contact: 'New message via the website',
  },
  de: {
    bevestiging: (r: ReserveringRij) => ({
      onderwerp: `Dein Platz auf der Wiese — ${r.nummer}`,
      titel: `Gebucht! Platz ${r.pitch} gehört euch.`,
      regels: [
        `Hallo ${r.naam},`,
        `Deine Buchung ist notiert. Du bist am <strong>${datum(r.van, 'de')}</strong> willkommen und reist am <strong>${datum(r.tot, 'de')}</strong> ab (${nachten(r.van, r.tot)} Nächte).`,
        `Platz <strong>${r.pitch}</strong> · ${r.volwassenen} Erwachsene, ${r.kinderen} Kinder`,
        `Du zahlst ${geld(r.bedrag, 'de')} bei der Ankunft an der Rezeption. Stornieren ist bis 48 Stunden vorher möglich.`,
        `Deine Buchungsnummer ist <strong>${r.nummer}</strong>. Bewahre diese E-Mail für den Link zu deiner Buchung auf.`,
        `Bis bald auf dem Hof!
— Bert`,
      ],
    }),
    annulering: (r: ReserveringRij) => ({
      onderwerp: `Deine Buchung wurde storniert — ${r.nummer}`,
      titel: 'Deine Buchung wurde storniert',
      regels: [
        `Hallo ${r.naam},`,
        `Wir haben deine Buchung für Platz ${r.pitch} (${datum(r.van, 'de')}) storniert. Es ist nichts zu zahlen.`,
        'Stimmt das nicht? Antworte einfach auf diese E-Mail.',
      ],
    }),
    notificatie: 'Neue Buchung',
    contact: 'Neue Nachricht über die Website',
  },
} as const

export function bevestigingMail(r: ReserveringRij, van: string): Mail {
  const taal: Taal = (r.taal as Taal) in TEKST ? (r.taal as Taal) : 'nl'
  const t = TEKST[taal].bevestiging(r)
  return {
    aan: r.email,
    van,
    onderwerp: t.onderwerp,
    soort: 'bevestiging',
    tekst: `${t.titel}\n\n${t.regels.map((x) => x.replace(/<[^>]+>/g, '')).join('\n\n')}`,
    html: wrapMail(t.titel, t.regels),
  }
}

export function annuleringMail(r: ReserveringRij, van: string): Mail {
  const taal: Taal = (r.taal as Taal) in TEKST ? (r.taal as Taal) : 'nl'
  const t = TEKST[taal].annulering(r)
  return {
    aan: r.email,
    van,
    onderwerp: t.onderwerp,
    soort: 'annulering',
    tekst: `${t.titel}\n\n${t.regels.map((x) => x.replace(/<[^>]+>/g, '')).join('\n\n')}`,
    html: wrapMail(t.titel, t.regels),
  }
}

/** Interne melding aan de receptie, in het Nederlands. */
export function notificatieMail(r: ReserveringRij, aan: string, van: string, site: string): Mail {
  return {
    aan,
    van,
    onderwerp: `Nieuwe reservering ${r.nummer} · plek ${r.pitch}`,
    soort: 'notificatie',
    tekst: [
      `Nieuwe reservering ${r.nummer}`,
      `${r.naam} <${r.email}> · ${r.telefoon}`,
      `${datum(r.van, 'nl')} t/m ${datum(r.tot, 'nl')} · ${nachten(r.van, r.tot)} nachten`,
      `Plek ${r.pitch} · ${r.volwassenen} volwassenen, ${r.kinderen} kinderen`,
      `Bedrag ${geld(r.bedrag, 'nl')}`,
      r.opmerking ? `Opmerking: ${r.opmerking}` : '',
      `Beheer: ${site}/nl/beheer/reserveringen`,
    ]
      .filter(Boolean)
      .join('\n'),
    html: wrapMail(`Nieuwe reservering ${r.nummer}`, [
      `<strong>${r.naam}</strong> &lt;${r.email}&gt; · ${r.telefoon}`,
      `${datum(r.van, 'nl')} t/m ${datum(r.tot, 'nl')} · ${nachten(r.van, r.tot)} nachten · plek ${r.pitch}`,
      `${r.volwassenen} volwassenen, ${r.kinderen} kinderen · ${geld(r.bedrag, 'nl')}`,
      r.opmerking ? `Opmerking: ${r.opmerking}` : '',
      `<a href="${site}/nl/beheer/reserveringen" style="color:${GROEN}">Open het beheer</a>`,
    ]),
  }
}

export function contactMail(
  bericht: { naam: string; email: string; onderwerp: string; bericht: string },
  aan: string,
  van: string,
): Mail {
  return {
    aan,
    van,
    onderwerp: `Website: ${bericht.onderwerp} — ${bericht.naam}`,
    soort: 'contact',
    tekst: `${bericht.naam} <${bericht.email}>\nOnderwerp: ${bericht.onderwerp}\n\n${bericht.bericht}`,
    html: wrapMail(`Nieuw bericht: ${bericht.onderwerp}`, [
      `<strong>${bericht.naam}</strong> &lt;${bericht.email}&gt;`,
      bericht.bericht.replace(/\n/g, '<br />'),
      'Beantwoord deze mail om direct terug te schrijven.',
    ]),
  }
}

/** Een korte testmail, om te controleren of verzenden werkt. */
export function testMail(aan: string, van: string): Mail {
  const titel = 'Testmail vanaf de website'
  return {
    aan,
    van,
    onderwerp: 'Testmail — De Groene Weide',
    soort: 'test',
    tekst: `${titel}\n\nAls je deze mail ziet, werkt het versturen vanaf ${van}.`,
    html: wrapMail(titel, [
      'Als je deze mail ziet, werkt het versturen vanaf de website.',
      `Afzender: <strong>${van}</strong>`,
    ]),
  }
}

/** Zet een mail in de wachtrij. Versturen gebeurt daarna, buiten het verzoek om. */
export async function stuurMail(env: Env, ctx: ExecutionContext, mail: Mail): Promise<number> {
  const rij = await env.DB.prepare(
    `INSERT INTO outbox (aan, van, onderwerp, tekst, html, soort, status, aangemaakt)
     VALUES (?, ?, ?, ?, ?, ?, 'wacht', ?)`,
  )
    .bind(mail.aan, mail.van, mail.onderwerp, mail.tekst, mail.html, mail.soort, new Date().toISOString())
    .run()

  const id = Number(rij.meta?.last_row_id ?? 0)
  if (id) ctx.waitUntil(probeerVerzenden(env, id, mail))
  return id
}

/** Wacht niet eindeloos op Email Sending; anders blijft een verzoek hangen. */
function metTimeout<T>(belofte: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    belofte,
    new Promise<T>((_, afwijzen) =>
      setTimeout(
        () => afwijzen(new Error(`E-mailserver gaf geen antwoord binnen ${ms / 1000} seconden.`)),
        ms,
      ),
    ),
  ])
}

/**
 * Twee vervoerders:
 *  - RESEND_API_KEY gezet → Resend (gratis tot 3.000 mails per maand), ook naar gasten.
 *  - anders → de Cloudflare-binding, die op een gratis account alleen naar
 *    geverifieerde adressen mag.
 */
export function mailTransport(env: Env): 'resend' | 'cloudflare' {
  return env.RESEND_API_KEY ? 'resend' : 'cloudflare'
}

async function verstuurMail(env: Env, mail: Mail): Promise<void> {
  if (env.RESEND_API_KEY) {
    const antwoord = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `De Groene Weide <${mail.van}>`,
        to: [mail.aan],
        subject: mail.onderwerp,
        html: mail.html,
        text: mail.tekst,
        reply_to: mail.van,
      }),
    })

    if (!antwoord.ok) {
      const tekst = (await antwoord.text()).slice(0, 400)
      throw new Error(`Resend ${antwoord.status}: ${tekst}`)
    }
    return
  }

  await env.EMAIL.send({
    to: mail.aan,
    from: mail.van,
    subject: mail.onderwerp,
    text: mail.tekst,
    html: mail.html,
  })
}

export async function probeerVerzenden(env: Env, id: number, mail: Mail): Promise<boolean> {
  const via = mailTransport(env)
  try {
    await metTimeout(verstuurMail(env, mail), 12_000)
    await env.DB.prepare(
      `UPDATE outbox SET status = 'verzonden', fout = NULL, via = ?, pogingen = pogingen + 1 WHERE id = ?`,
    )
      .bind(via, id)
      .run()
    return true
  } catch (e) {
    const bericht = (e instanceof Error ? e.message : String(e)).slice(0, 400)
    await env.DB.prepare(
      `UPDATE outbox SET status = 'fout', fout = ?, via = ?, pogingen = pogingen + 1 WHERE id = ?`,
    )
      .bind(bericht, via, id)
      .run()
    return false
  }
}
