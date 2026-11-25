import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTaal } from '../../i18n/context'
import type { Dict } from '../../i18n'
import { Icoon, type IcoonNaam } from '../../components/Icoon'
import { KipIcoon } from '../../components/Illustraties'
import { datumKort, prijs } from '../../lib/datum'
import { useApp } from '../../store/App'
import { api, ApiFout, type ApiBeheerder, type ApiReservering, type ApiStats } from '../../lib/api'
import { AdminBeheer } from './AdminBeheer'

const NAV: Array<{ slug: string; sleutel: keyof Dict['admin']['nav']; icoon: IcoonNaam }> = [
  { slug: 'start', sleutel: 'start', icoon: 'grafiek' },
  { slug: 'reserveringen', sleutel: 'reserveringen', icoon: 'kalender' },
  { slug: 'bezetting', sleutel: 'bezetting', icoon: 'kaart' },
  { slug: 'plekken', sleutel: 'plekken', icoon: 'gebouw' },
  { slug: 'berichten', sleutel: 'berichten', icoon: 'mail' },
  { slug: 'email', sleutel: 'email', icoon: 'waarschuwing' },
  { slug: 'evenementen', sleutel: 'evenementen', icoon: 'ster' },
  { slug: 'paginas', sleutel: 'paginas', icoon: 'pagina' },
  { slug: 'teksten', sleutel: 'teksten', icoon: 'pagina' },
  { slug: 'meldingen', sleutel: 'meldingen', icoon: 'waarschuwing' },
  { slug: 'grap', sleutel: 'grap', icoon: 'ster' },
  { slug: 'fotos', sleutel: 'fotos', icoon: 'foto' },
  { slug: 'prijzen', sleutel: 'prijzen', icoon: 'prijs' },
  { slug: 'voorzieningen', sleutel: 'voorzieningen', icoon: 'stekker' },
  { slug: 'gegevens', sleutel: 'gegevens', icoon: 'database' },
  { slug: 'opruimen', sleutel: 'opruimen', icoon: 'prullenbak' },
  { slug: 'team', sleutel: 'team', icoon: 'gebruiker' },
]

export function Admin() {
  const { t, link } = useTaal()
  const locatie = useLocation()
  const navigate = useNavigate()

  const [admin, setAdmin] = useState<ApiBeheerder | null>(null)
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    let levend = true
    api
      .adminIk()
      .then((r) => {
        if (levend) setAdmin(r.admin)
      })
      .catch(() => {
        if (levend) setAdmin(null)
      })
      .finally(() => {
        if (levend) setLaden(false)
      })
    return () => {
      levend = false
    }
  }, [])

  const basis = link('admin')
  const rest = locatie.pathname.replace(basis, '').replace(/^\//, '')
  const weergave = rest || 'start'

  const uitloggen = useCallback(async () => {
    try {
      await api.adminLogout()
    } finally {
      setAdmin(null)
      navigate(basis)
    }
  }, [basis, navigate])

  if (laden) {
    return (
      <div className="beheer-inloggen">
        <div className="beheer-inloggen__kaart">
          <p className="kaart__tekst">Even kijken of je ingelogd bent…</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Inloggen onKlaar={setAdmin} />
  }

  return (
    <div className="beheer">
      <aside className="beheer__zijkant">
        <Link to={basis} className="beheer__merk">
          <KipIcoon />
          <span>{t.merk.naam}</span>
        </Link>
        <nav className="beheer__nav" aria-label={t.admin.titel}>
          {NAV.map((item) => (
            <Link
              key={item.slug}
              to={`${basis}/${item.slug}`}
              className="beheer__navitem"
              aria-current={weergave === item.slug ? 'page' : undefined}
            >
              <Icoon naam={item.icoon} maat={17} />
              {t.admin.nav[item.sleutel]}
            </Link>
          ))}
        </nav>
        <div className="beheer__onder">
          <p>
            Ingelogd als <span className="tekst-zacht">{admin.naam}</span>
          </p>
          <button type="button" className="knop knop--klein knop--op-groen" onClick={() => void uitloggen()}>
            {t.admin.inloggen.uitloggen}
          </button>
        </div>
      </aside>

      <div className="beheer__hoofd">
        <header className="beheer__balk">
          <span className="beheer__balk-titel">{t.admin.titel}</span>
          <div className="beheer__balk-rechts">
            <Link className="knop knop--klein knop--secundair" to={link('home')}>
              {t.nav.home}
            </Link>
            <Link className="knop knop--klein" to={link('reserveren')}>
              {t.admin.start.nieuw}
            </Link>
          </div>
        </header>

        <main className="beheer__inhoud" key={weergave}>
          {weergave === 'start' ? <Start admin={admin} /> : null}
          {weergave === 'reserveringen' ? <ReserveringenLijst /> : null}
          {weergave === 'bezetting' ? <Bezetting /> : null}
          {[
            'plekken',
            'berichten',
            'email',
            'evenementen',
            'paginas',
            'teksten',
            'meldingen',
            'grap',
            'fotos',
            'prijzen',
            'voorzieningen',
            'gegevens',
            'opruimen',
            'team',
          ].includes(weergave) ? (
            <AdminBeheer weergave={weergave} />
          ) : null}
          {!['start', 'reserveringen', 'bezetting'].includes(weergave) &&
          ![
            'plekken',
            'berichten',
            'email',
            'evenementen',
            'paginas',
            'teksten',
            'meldingen',
            'grap',
            'fotos',
            'prijzen',
            'voorzieningen',
            'gegevens',
            'opruimen',
            'team',
          ].includes(weergave) ? (
            <Start admin={admin} />
          ) : null}
        </main>
      </div>
    </div>
  )
}

function Inloggen({ onKlaar }: { onKlaar: (admin: ApiBeheerder) => void }) {
  const { t } = useTaal()
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)

  async function versturen(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setBezig(true)
    setFout('')
    try {
      const { admin } = await api.adminLogin(
        String(data.get('email') ?? ''),
        String(data.get('wachtwoord') ?? ''),
      )
      onKlaar(admin)
    } catch (err) {
      setFout(err instanceof ApiFout ? err.message : t.admin.inloggen.fout)
    } finally {
      setBezig(false)
    }
  }

  return (
    <div className="beheer-inloggen">
      <form className="beheer-inloggen__kaart" onSubmit={versturen}>
        <div className="beheer-inloggen__merk">
          <KipIcoon />
          <span>{t.merk.naam}</span>
        </div>
        <h1>{t.admin.inloggen.titel}</h1>
        <p className="kaart__tekst">{t.admin.inloggen.intro}</p>

        <div className="veld">
          <label htmlFor="admin-email">{t.admin.inloggen.email}</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="bert@degroeneweide.nl"
            required
          />
        </div>
        <div className="veld">
          <label htmlFor="admin-wachtwoord">{t.admin.inloggen.wachtwoord}</label>
          <input
            id="admin-wachtwoord"
            name="wachtwoord"
            type="password"
            autoComplete="current-password"
            defaultValue="weide"
            required
          />
        </div>

        {fout ? <p className="fouttekst">{fout}</p> : null}

        <button type="submit" className="knop knop--breed" disabled={bezig}>
          {bezig ? 'Bezig…' : t.admin.inloggen.knop}
        </button>
        <p className="veld__hint">{t.admin.inloggen.hint}</p>
      </form>
    </div>
  )
}

/** Telt een getal op naar zijn waarde; staat stil als de rustknop aan is. */
function Teller({ waarde, duur = 700 }: { waarde: number; duur?: number }) {
  const [nu, setNu] = useState(0)

  useEffect(() => {
    if (document.documentElement.dataset.rust === 'aan') {
      setNu(waarde)
      return
    }
    let start: number | null = null
    let frame = 0
    const stap = (tijd: number) => {
      if (start === null) start = tijd
      const deel = Math.min(1, (tijd - start) / duur)
      const zacht = 1 - Math.pow(1 - deel, 3)
      setNu(Math.round(waarde * zacht))
      if (deel < 1) frame = requestAnimationFrame(stap)
    }
    frame = requestAnimationFrame(stap)
    return () => cancelAnimationFrame(frame)
  }, [waarde, duur])

  return <>{nu}</>
}

function Start({ admin }: { admin: ApiBeheerder }) {
  const { t, taal } = useTaal()
  const [stats, setStats] = useState<ApiStats | null>(null)
  const [reserveringen, setReserveringen] = useState<ApiReservering[]>([])
  const [instellingen, setInstellingen] = useState<Record<string, string>>({})
  const [fout, setFout] = useState('')

  useEffect(() => {
    let levend = true
    Promise.all([api.adminStats(), api.adminReserveringen(), api.adminInstellingen()])
      .then(([s, r, i]) => {
        if (!levend) return
        setStats(s)
        setReserveringen(r.reserveringen)
        setInstellingen(i.instellingen)
      })
      .catch((e) => {
        if (levend) setFout(e instanceof ApiFout ? e.message : 'Laden lukte niet.')
      })
    return () => {
      levend = false
    }
  }, [])

  const vandaag = stats?.dag ?? ''
  const aankomst = reserveringen.filter((r) => r.van === vandaag && r.status !== 'geannuleerd')
  const vertrek = reserveringen.filter((r) => r.tot === vandaag && r.status !== 'geannuleerd')

  async function zetInstelling(sleutel: string, waarde: string) {
    const nieuw = { ...instellingen, [sleutel]: waarde }
    setInstellingen(nieuw)
    try {
      await api.adminZetInstellingen({ [sleutel]: waarde })
    } catch {
      setInstellingen(instellingen)
    }
  }

  return (
    <>
      <div className="beheer__kop">
        <div>
          <h1>{t.admin.start.groet.replace('{naam}', admin.naam)}</h1>
          <p className="kaart__tekst">{t.admin.start.intro}</p>
        </div>
        <Link className="knop" to="reserveringen">
          {t.admin.start.reserveren}
        </Link>
      </div>

      {fout ? <p className="fouttekst">{fout}</p> : null}

      <div className="beheer__kaarten">
        <article className="beheerkaart">
          <p className="beheerkaart__label">{t.admin.start.aankomst}</p>
          <p className="beheerkaart__getal">
            {stats ? <Teller waarde={stats.aankomst} /> : '—'}
          </p>
          <p className="beheerkaart__hint">{vandaag ? datumKort(vandaag, taal) : ''}</p>
        </article>
        <article className="beheerkaart">
          <p className="beheerkaart__label">{t.admin.start.vertrek}</p>
          <p className="beheerkaart__getal">
            {stats ? <Teller waarde={stats.vertrek} /> : '—'}
          </p>
          <p className="beheerkaart__hint">{vandaag ? datumKort(vandaag, taal) : ''}</p>
        </article>
        <article className="beheerkaart">
          <p className="beheerkaart__label">{t.admin.start.schoonmaak}</p>
          <p className="beheerkaart__getal">
            {stats ? <Teller waarde={stats.vertrek} /> : '—'}
          </p>
          <p className="beheerkaart__hint">{t.admin.nav.plekken}</p>
        </article>
        <article className="beheerkaart beheerkaart--groen">
          <p className="beheerkaart__label">{t.admin.nav.bezetting}</p>
          <p className="beheerkaart__getal">
            {stats ? <Teller waarde={stats.bezetting} /> : '—'}
            {stats ? '%' : ''}
          </p>
          <p className="beheerkaart__hint">{stats ? `${stats.bezet} / ${stats.plekken}` : ''}</p>
        </article>
      </div>

      <div className="beheer__raster">
        <section className="beheerpaneel">
          <h2 className="beheerpaneel__kop">{t.admin.start.vandaag}</h2>
          <ul className="beheer__lijst">
            {[...aankomst, ...vertrek].slice(0, 8).map((r) => (
              <li key={r.nummer} className="beheer__lijstitem">
                <span className={`stippel ${r.van === vandaag ? 'stippel--groen' : 'stippel--oranje'}`} />
                <div>
                  <p>{r.naam}</p>
                  <p className="kaart__tekst">
                    {r.pitch} · {r.van === vandaag ? t.admin.start.aankomst : t.admin.start.vertrek} ·{' '}
                    {datumKort(r.van === vandaag ? r.van : r.tot, taal)}
                  </p>
                </div>
                <span className="beheer__nummer">{r.nummer}</span>
              </li>
            ))}
            {aankomst.length + vertrek.length === 0 ? (
              <li className="kaart__tekst">Niets vandaag. Koffie.</li>
            ) : null}
          </ul>
        </section>

        <section className="beheerpaneel">
          <h2 className="beheerpaneel__kop">{t.admin.start.snel}</h2>
          <ul className="snelkoppelingen">
            <li>
              <Link to="plekken">{t.admin.start.plekken}</Link>
            </li>
            <li>
              <Link to="berichten">{t.admin.nav.berichten}</Link>
            </li>
            <li>
              <Link to="email">{t.admin.nav.email}</Link>
            </li>
            <li>
              <Link to="prijzen">{t.admin.nav.prijzen}</Link>
            </li>
          </ul>

          <h2 className="beheerpaneel__kop">{t.admin.start.instellingen}</h2>
          <label className="checkveld">
            <input
              type="checkbox"
              checked={instellingen.plekmatch_aan === '1'}
              onChange={(e) => void zetInstelling('plekmatch_aan', e.target.checked ? '1' : '0')}
            />
            <span>
              <strong>{t.admin.start.plekmatch}</strong>
              <br />
              <span className="kaart__tekst">{t.admin.start.plekmatchUitleg}</span>
            </span>
          </label>
          <p className="kaart__tekst">
            {t.admin.start.meldingUitleg}{' '}
            <Link to="meldingen">{t.admin.nav.meldingen}</Link>
          </p>
        </section>
      </div>
    </>
  )
}

function ReserveringenLijst() {
  const { t, taal } = useTaal()
  const [zoek, setZoek] = useState('')
  const [status, setStatus] = useState<'alles' | 'bevestigd' | 'betaald' | 'geannuleerd'>('alles')
  const [rijen, setRijen] = useState<ApiReservering[]>([])
  const [laden, setLaden] = useState(true)
  const [fout, setFout] = useState('')
  const [toonForm, setToonForm] = useState(false)

  const laad = useCallback(async (q: string, s: string) => {
    setLaden(true)
    try {
      const { reserveringen } = await api.adminReserveringen(q, s === 'alles' ? '' : s)
      setRijen(reserveringen)
      setFout('')
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Laden lukte niet.')
    } finally {
      setLaden(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void laad(zoek, status), 250)
    return () => window.clearTimeout(timer)
  }, [zoek, status, laad])

  async function wijzig(nummer: string, nieuweStatus: string) {
    try {
      await api.adminWijzigReservering(nummer, nieuweStatus)
      setRijen((huidig) =>
        huidig.map((r) => (r.nummer === nummer ? { ...r, status: nieuweStatus as ApiReservering['status'] } : r)),
      )
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Wijzigen lukte niet.')
    }
  }

  async function wis(nummer: string) {
    if (!window.confirm(`${t.admin.verwijderen}: ${nummer}?`)) return
    try {
      await api.adminVerwijderReservering(nummer)
      setRijen((huidig) => huidig.filter((r) => r.nummer !== nummer))
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <div className="beheer__kop">
        <div>
          <h1>{t.admin.reserveringen.titel}</h1>
          <p className="kaart__tekst">{t.admin.reserveringen.intro}</p>
        </div>
        <button type="button" className="knop" onClick={() => setToonForm((v) => !v)}>
          <Icoon naam="plus" maat={16} /> {t.admin.reserveringen.nieuwe}
        </button>
      </div>

      {toonForm ? (
        <NieuweReservering
          onSluit={() => setToonForm(false)}
          onKlaar={() => {
            setToonForm(false)
            void laad(zoek, status)
          }}
        />
      ) : null}

      <div className="beheer__filters">
        <label className="zoekveld">
          <Icoon naam="zoek" maat={17} />
          <input
            type="search"
            placeholder={t.admin.reserveringen.zoek}
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            aria-label={t.admin.reserveringen.zoek}
          />
        </label>
        <div className="filterrij filterrij--krap">
          {(['alles', 'bevestigd', 'betaald', 'geannuleerd'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
            >
              {s === 'alles' ? t.admin.reserveringen.filter : t.admin.reserveringen.statussen[s]}
            </button>
          ))}
        </div>
        <span className="kaart__tekst">
          {laden ? 'Laden…' : t.admin.reserveringen.totaal.replace('{aantal}', String(rijen.length))}
        </span>
      </div>

      {fout ? <p className="fouttekst">{fout}</p> : null}

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.reserveringen.kolommen.nummer}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.naam}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.plek}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.van}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.tot}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.personen}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.bedrag}</th>
              <th scope="col">{t.admin.reserveringen.kolommen.status}</th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((r) => (
              <tr key={r.nummer}>
                <th scope="row" className="mono">
                  {r.nummer}
                </th>
                <td>
                  {r.naam}
                  <br />
                  <span className="kaart__tekst">{r.plaats || r.email}</span>
                </td>
                <td>{r.pitch}</td>
                <td>{datumKort(r.van, taal)}</td>
                <td>{datumKort(r.tot, taal)}</td>
                <td>{r.volwassenen + r.kinderen}</td>
                <td>{prijs(r.bedrag, taal)}</td>
                <td>
                  <select
                    className="invoer invoer--klein"
                    value={r.status}
                    aria-label={`status ${r.nummer}`}
                    onChange={(e) => void wijzig(r.nummer, e.target.value)}
                  >
                    {(['bevestigd', 'betaald', 'geannuleerd', 'nieuw'] as const).map((s) => (
                      <option key={s} value={s}>
                        {t.admin.reserveringen.statussen[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    title={t.admin.verwijderen}
                    onClick={() => void wis(r.nummer)}
                  >
                    <Icoon naam="kruis" maat={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!laden && rijen.length === 0 ? (
          <p className="kaart__tekst" style={{ padding: 16 }}>
            {t.admin.reserveringen.geen}
          </p>
        ) : null}
      </div>
    </>
  )
}

function NieuweReservering({ onKlaar, onSluit }: { onKlaar: () => void; onSluit: () => void }) {
  const { t } = useTaal()
  const { plekken } = useApp()
  const [velden, setVelden] = useState({
    plek: '',
    van: '',
    tot: '',
    volwassenen: 2,
    kinderen: 0,
    naam: '',
    email: '',
    telefoon: '',
    plaats: '',
    opmerking: '',
  })
  const [bezig, setBezig] = useState(false)
  const [fout, setFout] = useState('')
  const [goed, setGoed] = useState('')

  const zet = (wijziging: Partial<typeof velden>) => setVelden((h) => ({ ...h, ...wijziging }))

  async function opslaan() {
    setBezig(true)
    setFout('')
    setGoed('')
    try {
      const { reservering } = await api.adminMaakReservering({
        aankomst: velden.van,
        vertrek: velden.tot,
        volwassenen: Number(velden.volwassenen),
        kinderen: Number(velden.kinderen),
        plek: velden.plek,
        wensen: [],
        taal: 'nl',
        gegevens: {
          naam: velden.naam,
          email: velden.email,
          telefoon: velden.telefoon,
          adres: '',
          postcode: '',
          plaats: velden.plaats,
          land: 'Nederland',
          opmerking: velden.opmerking,
        },
      })
      setGoed(
        `${reservering.nummer} · plek ${reservering.pitch} · ${prijs(reservering.bedrag, 'nl')} — bevestiging verstuurd`,
      )
      onKlaar()
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Opslaan lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  return (
    <form
      className="beheerpaneel formulier"
      onSubmit={(e) => {
        e.preventDefault()
        void opslaan()
      }}
    >
      <h2 className="beheerpaneel__kop">{t.admin.reserveringen.nieuwe}</h2>
      <div className="formulier__velden">
        <label className="veld">
          <span className="veld__label">{t.admin.reserveringen.kolommen.plek}</span>
          <select value={velden.plek} onChange={(e) => zet({ plek: e.target.value })} required>
            <option value="">—</option>
            {plekken
              .filter((p) => p.status === 'open')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} · {t.reserveren.stap2.soorten[p.soort]}
                </option>
              ))}
          </select>
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap1.aankomst}</span>
          <input type="date" value={velden.van} onChange={(e) => zet({ van: e.target.value })} required />
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap1.vertrek}</span>
          <input type="date" value={velden.tot} onChange={(e) => zet({ tot: e.target.value })} required />
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap2.volwassenen}</span>
          <input
            type="number"
            min={1}
            max={12}
            value={velden.volwassenen}
            onChange={(e) => zet({ volwassenen: Number(e.target.value) })}
          />
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap2.kinderen}</span>
          <input
            type="number"
            min={0}
            max={10}
            value={velden.kinderen}
            onChange={(e) => zet({ kinderen: Number(e.target.value) })}
          />
        </label>
        <label className="veld">
          <span className="veld__label">{t.admin.reserveringen.kolommen.naam}</span>
          <input value={velden.naam} onChange={(e) => zet({ naam: e.target.value })} required />
        </label>
        <label className="veld">
          <span className="veld__label">E-mailadres</span>
          <input
            type="email"
            value={velden.email}
            onChange={(e) => zet({ email: e.target.value })}
            required
          />
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap5.telefoon}</span>
          <input value={velden.telefoon} onChange={(e) => zet({ telefoon: e.target.value })} />
        </label>
        <label className="veld">
          <span className="veld__label">{t.reserveren.stap5.plaats}</span>
          <input value={velden.plaats} onChange={(e) => zet({ plaats: e.target.value })} />
        </label>
        <label className="veld veld--breed">
          <span className="veld__label">{t.reserveren.stap5.opmerking}</span>
          <input value={velden.opmerking} onChange={(e) => zet({ opmerking: e.target.value })} />
        </label>
      </div>

      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}

      <div className="beheer__pijlen">
        <button type="submit" className="knop knop--klein" disabled={bezig}>
          {bezig ? 'Bezig…' : t.knoppen.opslaan}
        </button>
        <button type="button" className="knop knop--klein knop--secundair" onClick={onSluit}>
          {t.knoppen.annuleer}
        </button>
      </div>
    </form>
  )
}

function Bezetting() {
  const { t, taal } = useTaal()
  const { plekken } = useApp()
  const [start, setStart] = useState(() => {
    const d = new Date()
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  })
  const [reserveringen, setReserveringen] = useState<ApiReservering[]>([])

  useEffect(() => {
    let levend = true
    api
      .adminReserveringen()
      .then((r) => {
        if (levend) setReserveringen(r.reserveringen)
      })
      .catch(() => undefined)
    return () => {
      levend = false
    }
  }, [])

  const dagen = useMemo(() => {
    const uit: string[] = []
    const d = new Date(start)
    for (let i = 0; i < 14; i += 1) {
      uit.push(d.toISOString().slice(0, 10))
      d.setUTCDate(d.getUTCDate() + 1)
    }
    return uit
  }, [start])

  const bezetPerCel = useMemo(() => {
    const kaart = new Map<string, { naam: string; nummer: string }>()
    for (const r of reserveringen) {
      if (r.status === 'geannuleerd') continue
      const d = new Date(`${r.van}T00:00:00Z`)
      const eind = new Date(`${r.tot}T00:00:00Z`)
      while (d < eind) {
        kaart.set(`${d.toISOString().slice(0, 10)}|${r.pitch}`, { naam: r.naam, nummer: r.nummer })
        d.setUTCDate(d.getUTCDate() + 1)
      }
    }
    return kaart
  }, [reserveringen])

  const schuif = (n: number) => {
    const d = new Date(start)
    d.setUTCDate(d.getUTCDate() + n)
    setStart(d)
  }

  return (
    <>
      <div className="beheer__kop">
        <div>
          <h1>{t.admin.bezetting.titel}</h1>
          <p className="kaart__tekst">{t.admin.bezetting.intro}</p>
        </div>
        <div className="beheer__pijlen">
          <button
            type="button"
            className="knop knop--klein knop--secundair"
            onClick={() => schuif(-14)}
            aria-label="twee weken terug"
          >
            <Icoon naam="terug" maat={16} />
          </button>
          <button
            type="button"
            className="knop knop--klein knop--secundair"
            onClick={() => schuif(14)}
            aria-label="twee weken verder"
          >
            <Icoon naam="pijl" maat={16} />
          </button>
        </div>
      </div>

      <div className="tabelvak bezettingstabel">
        <table className="tabel tabel--bezetting">
          <thead>
            <tr>
              <th scope="col">{t.admin.nav.plekken}</th>
              {dagen.map((d) => (
                <th key={d} scope="col">
                  {datumKort(d, taal)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plekken.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.id}</th>
                {dagen.map((d) => {
                  const r = bezetPerCel.get(`${d}|${p.id}`)
                  return (
                    <td key={d} className={r ? 'cel--bezet' : 'cel--vrij'} title={r?.naam ?? ''}>
                      {r ? r.naam.split(' ')[0] : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="kaart__tekst">{t.admin.bezetting.legenda}</p>
    </>
  )
}

