import { useCallback, useEffect, useRef, useState } from 'react'
import { useTaal } from '../../i18n/context'
import { Icoon } from '../../components/Icoon'
import { PRIJZEN, VOORZIENINGEN_SUOORTEN, type Soort } from '../../data/camping'
import { PADEN, PAGE_KEYS, type PageKey } from '../../i18n'
import { prijs } from '../../lib/datum'
import {
  api,
  ApiFout,
  type ApiBericht,
  type ApiDataOverzicht,
  type ApiEvent,
  type ApiFaciliteit,
  type ApiMail,
  type ApiMailStatus,
  type ApiMedia,
  type ApiPlek,
  type ApiTeamlid,
} from '../../lib/api'
import { Formulier, Kop, Veld, useMelding } from './bouwstenen'
import { Grap, Meldingen, Teksten } from './AdminTeksten'

export function AdminBeheer({ weergave }: { weergave: string }) {
  switch (weergave) {
    case 'plekken':
      return <Plekken />
    case 'evenementen':
      return <EvenementenBeheer />
    case 'voorzieningen':
      return <Voorzieningen />
    case 'fotos':
      return <Fotos />
    case 'berichten':
      return <Berichten />
    case 'email':
      return <Email />
    case 'team':
      return <Team />
    case 'prijzen':
      return <Prijzen />
    case 'gegevens':
      return <Gegevens />
    case 'opruimen':
      return <Opruimen />
    case 'paginas':
      return <Paginas />
    case 'teksten':
      return <Teksten />
    case 'meldingen':
      return <Meldingen />
    case 'grap':
      return <Grap />
    default:
      return null
  }
}

/* -------------------------------------------------------------------------- */
/* Plekken                                                                    */
/* -------------------------------------------------------------------------- */

const LEEG_PLEK: Omit<ApiPlek, 'status'> & { status?: ApiPlek['status'] } = {
  id: '',
  soort: 'tent',
  weide: 'A',
  stroom: false,
  ondergrond: 'gras',
  vlak: 'vlak',
  water: false,
  rustig: false,
  schaduw: false,
  maxPersonen: 4,
  afstandSanitair: 80,
  prijs: 24,
  hond: false,
}

function Plekken() {
  const { t, taal } = useTaal()
  const [rijen, setRijen] = useState<ApiPlek[]>([])
  const [open, setOpen] = useState(false)
  const [nieuw, setNieuw] = useState({ ...LEEG_PLEK })
  const [bezig, setBezig] = useState(false)
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminPlekken()).plekken)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function wijzig(id: string, w: Partial<Pick<ApiPlek, 'status' | 'prijs' | 'maxPersonen'>>) {
    try {
      await api.adminWijzigPlek(id, w)
      setRijen((h) => h.map((p) => (p.id === id ? ({ ...p, ...w } as ApiPlek) : p)))
      m.wissen()
    } catch (e) {
      m.meldFout(e, 'Wijzigen lukte niet.')
    }
  }

  async function toevoegen() {
    setBezig(true)
    try {
      const { plek } = await api.adminMaakPlek({ ...nieuw, status: 'open' })
      setRijen((h) => [...h, plek])
      setNieuw({ ...LEEG_PLEK })
      setOpen(false)
      m.setGoed(`Plek ${plek.id} toegevoegd.`)
    } catch (e) {
      m.meldFout(e, 'Toevoegen lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  async function verwijder(id: string) {
    if (!window.confirm(`${t.admin.verwijderen}: ${id}?`)) return
    try {
      await api.adminVerwijderPlek(id)
      setRijen((h) => h.filter((p) => p.id !== id))
      m.wissen()
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop
        titel={t.admin.plekken.titel}
        intro={t.admin.plekken.intro}
        actie={
          <button type="button" className="knop" onClick={() => setOpen((v) => !v)}>
            <Icoon naam="plus" maat={16} /> {t.admin.plekken.toevoegen}
          </button>
        }
      />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {m.goed ? <p className="kaart__tekst">{m.goed}</p> : null}

      <Formulier
        titel={t.admin.plekken.toevoegen}
        open={open}
        onSluit={() => setOpen(false)}
        onVerstuur={() => void toevoegen()}
        bezig={bezig}
      >
        <Veld label={t.admin.plekken.kolommen.plek}>
          <input
            value={nieuw.id}
            onChange={(e) => setNieuw({ ...nieuw, id: e.target.value.toUpperCase() })}
            placeholder="T49"
            required
          />
        </Veld>
        <Veld label={t.admin.plekken.kolommen.soort}>
          <select
            value={nieuw.soort}
            onChange={(e) => setNieuw({ ...nieuw, soort: e.target.value as Soort })}
          >
            <option value="tent">{t.reserveren.stap2.soorten.tent}</option>
            <option value="camper">{t.reserveren.stap2.soorten.camper}</option>
            <option value="safaritent">{t.reserveren.stap2.soorten.safaritent}</option>
          </select>
        </Veld>
        <Veld label={t.admin.velden.weide}>
          <select
            value={nieuw.weide}
            onChange={(e) => setNieuw({ ...nieuw, weide: e.target.value as ApiPlek['weide'] })}
          >
            <option value="A">Weide A</option>
            <option value="B">Weide B</option>
            <option value="C">C</option>
            <option value="S">S</option>
          </select>
        </Veld>
        <Veld label={t.admin.plekken.kolommen.ondergrond}>
          <select
            value={nieuw.ondergrond}
            onChange={(e) =>
              setNieuw({ ...nieuw, ondergrond: e.target.value as ApiPlek['ondergrond'] })
            }
          >
            <option value="gras">gras</option>
            <option value="halfverhard">halfverhard</option>
            <option value="verhard">verhard</option>
            <option value="hout">hout</option>
          </select>
        </Veld>
        <Veld label={t.reserveren.stap4.voorzieningenTitels.vlak}>
          <select
            value={nieuw.vlak}
            onChange={(e) => setNieuw({ ...nieuw, vlak: e.target.value as ApiPlek['vlak'] })}
          >
            <option value="vlak">vlak</option>
            <option value="licht hellend">licht hellend</option>
            <option value="hellend">hellend</option>
          </select>
        </Veld>
        <Veld label={t.admin.prijzen.kolommen.laag}>
          <input
            type="number"
            min={0}
            value={nieuw.prijs}
            onChange={(e) => setNieuw({ ...nieuw, prijs: Number(e.target.value) })}
          />
        </Veld>
        <Veld label={t.reserveren.stap4.voorzieningenTitels.maxPersonen}>
          <input
            type="number"
            min={1}
            max={12}
            value={nieuw.maxPersonen}
            onChange={(e) => setNieuw({ ...nieuw, maxPersonen: Number(e.target.value) })}
          />
        </Veld>
        <Veld label={t.reserveren.stap4.voorzieningenTitels.afstand}>
          <input
            type="number"
            min={0}
            value={nieuw.afstandSanitair}
            onChange={(e) => setNieuw({ ...nieuw, afstandSanitair: Number(e.target.value) })}
          />
        </Veld>
        <div className="veld veld--breed checkveld-lijst">
          {(
            [
              ['stroom', t.reserveren.stap4.voorzieningenTitels.stroom],
              ['water', t.reserveren.stap4.voorzieningenTitels.water],
              ['rustig', t.reserveren.stap4.voorzieningenTitels.rustig],
              ['schaduw', t.admin.velden.schaduw],
              ['hond', t.admin.velden.hond],
            ] as const
          ).map(([sleutel, label]) => (
            <label key={sleutel} className="checkveld">
              <input
                type="checkbox"
                checked={Boolean(nieuw[sleutel])}
                onChange={(e) => setNieuw({ ...nieuw, [sleutel]: e.target.checked })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </Formulier>

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.plekken.kolommen.plek}</th>
              <th scope="col">{t.admin.plekken.kolommen.soort}</th>
              <th scope="col">{t.admin.velden.weide}</th>
              <th scope="col">{t.admin.plekken.kolommen.stroom}</th>
              <th scope="col">{t.admin.plekken.kolommen.ondergrond}</th>
              <th scope="col">{t.admin.plekken.kolommen.prijs}</th>
              <th scope="col">{t.admin.plekken.kolommen.status}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rijen.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.id}</th>
                <td>{t.reserveren.stap2.soorten[p.soort]}</td>
                <td>{p.weide}</td>
                <td>{p.stroom ? 'Ja' : 'Nee'}</td>
                <td>{p.ondergrond}</td>
                <td>
                  <input
                    className="invoer invoer--klein"
                    type="number"
                    min={0}
                    defaultValue={p.prijs}
                    aria-label={`prijs ${p.id}`}
                    onBlur={(e) => {
                      const w = Number(e.target.value)
                      if (Number.isFinite(w) && w !== p.prijs) void wijzig(p.id, { prijs: w })
                    }}
                  />
                </td>
                <td>
                  <select
                    className="invoer invoer--klein"
                    value={p.status}
                    aria-label={`status ${p.id}`}
                    onChange={(e) => void wijzig(p.id, { status: e.target.value as ApiPlek['status'] })}
                  >
                    <option value="open">{t.admin.plekken.status.open}</option>
                    <option value="dicht">{t.admin.plekken.status.dicht}</option>
                    <option value="onderhoud">{t.admin.plekken.status.onderhoud}</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void verwijder(p.id)}
                    title={t.admin.verwijderen}
                  >
                    <Icoon naam="kruis" maat={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="kaart__tekst">
        {rijen.length} plekken · prijzen zijn het laagseizoen-tarief; in juli en augustus komt daar{' '}
        {prijs(PRIJZEN.tent.hoog - PRIJZEN.tent.laag, taal)} bij.
      </p>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Evenementen                                                                */
/* -------------------------------------------------------------------------- */

const LEEG_EVENT = {
  dag: 0,
  tijd: '09:00',
  titelNl: '',
  titelEn: '',
  titelDe: '',
  locatie: '',
  leeftijd: '',
  soort: 'dieren',
}

function EvenementenBeheer() {
  const { t } = useTaal()
  const [rijen, setRijen] = useState<ApiEvent[]>([])
  const [open, setOpen] = useState(false)
  const [nieuw, setNieuw] = useState({ ...LEEG_EVENT })
  const [bezig, setBezig] = useState(false)
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminEvents()).events)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toevoegen() {
    setBezig(true)
    try {
      const { event } = await api.adminMaakEvent(nieuw)
      setRijen((h) => [...h, event])
      setNieuw({ ...LEEG_EVENT })
      setOpen(false)
      m.setGoed('Evenement toegevoegd.')
    } catch (e) {
      m.meldFout(e, 'Toevoegen lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  async function verwijder(id: number) {
    if (!window.confirm(`${t.admin.verwijderen}?`)) return
    try {
      await api.adminVerwijderEvent(id)
      setRijen((h) => h.filter((e) => e.id !== id))
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  async function zetActief(id: number, actief: boolean) {
    try {
      await api.adminWijzigEvent(id, { actief })
      setRijen((h) => h.map((e) => (e.id === id ? { ...e, actief: actief ? 1 : 0 } : e)))
    } catch (e) {
      m.meldFout(e, 'Wijzigen lukte niet.')
    }
  }

  return (
    <>
      <Kop
        titel={t.admin.evenementen.titel}
        intro={t.admin.evenementen.intro}
        actie={
          <button type="button" className="knop" onClick={() => setOpen((v) => !v)}>
            <Icoon naam="plus" maat={16} /> {t.admin.evenementen.toevoegen}
          </button>
        }
      />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {m.goed ? <p className="kaart__tekst">{m.goed}</p> : null}

      <Formulier
        titel={t.admin.evenementen.toevoegen}
        open={open}
        onSluit={() => setOpen(false)}
        onVerstuur={() => void toevoegen()}
        bezig={bezig}
      >
        <Veld label={t.admin.velden.dag}>
          <select value={nieuw.dag} onChange={(e) => setNieuw({ ...nieuw, dag: Number(e.target.value) })}>
            {t.evenementen.dagen.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </Veld>
        <Veld label={t.admin.velden.tijd}>
          <input
            type="time"
            value={nieuw.tijd}
            onChange={(e) => setNieuw({ ...nieuw, tijd: e.target.value })}
          />
        </Veld>
        <Veld label={`${t.admin.velden.titel} (NL)`}>
          <input
            value={nieuw.titelNl}
            onChange={(e) => setNieuw({ ...nieuw, titelNl: e.target.value })}
            required
          />
        </Veld>
        <Veld label={`${t.admin.velden.titel} (EN)`}>
          <input value={nieuw.titelEn} onChange={(e) => setNieuw({ ...nieuw, titelEn: e.target.value })} />
        </Veld>
        <Veld label={`${t.admin.velden.titel} (DE)`}>
          <input value={nieuw.titelDe} onChange={(e) => setNieuw({ ...nieuw, titelDe: e.target.value })} />
        </Veld>
        <Veld label={t.admin.velden.locatie}>
          <input value={nieuw.locatie} onChange={(e) => setNieuw({ ...nieuw, locatie: e.target.value })} />
        </Veld>
        <Veld label={t.admin.velden.leeftijd}>
          <input value={nieuw.leeftijd} onChange={(e) => setNieuw({ ...nieuw, leeftijd: e.target.value })} />
        </Veld>
        <Veld label={t.admin.velden.categorie}>
          <select value={nieuw.soort} onChange={(e) => setNieuw({ ...nieuw, soort: e.target.value })}>
            {Object.entries(t.evenementen.soorten).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Veld>
      </Formulier>

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.velden.dag}</th>
              <th scope="col">{t.admin.velden.tijd}</th>
              <th scope="col">{t.admin.velden.titel}</th>
              <th scope="col">{t.admin.velden.locatie}</th>
              <th scope="col">{t.admin.velden.categorie}</th>
              <th scope="col">{t.admin.plekken.kolommen.status}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rijen.map((e) => (
              <tr key={e.id}>
                <td>{t.evenementen.dagen[e.dag]}</td>
                <td>{e.tijd}</td>
                <td>{e.titel_nl}</td>
                <td className="kaart__tekst">{e.locatie}</td>
                <td>{e.soort}</td>
                <td>
                  <label className="checkveld">
                    <input
                      type="checkbox"
                      checked={e.actief === 1}
                      onChange={(ev) => void zetActief(e.id, ev.target.checked)}
                    />
                    <span className="kaart__tekst">{e.actief === 1 ? 'Zichtbaar' : 'Verborgen'}</span>
                  </label>
                </td>
                <td>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void verwijder(e.id)}
                    title={t.admin.verwijderen}
                  >
                    <Icoon naam="kruis" maat={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Voorzieningen                                                              */
/* -------------------------------------------------------------------------- */

function Voorzieningen() {
  const { t } = useTaal()
  const [rijen, setRijen] = useState<ApiFaciliteit[]>([])
  const [open, setOpen] = useState(false)
  const [nieuw, setNieuw] = useState({ id: '', soort: 'spelen', naam: '', kort: '', x: 3, y: 3 })
  const [bezig, setBezig] = useState(false)
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminVoorzieningen()).voorzieningen)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toevoegen() {
    setBezig(true)
    try {
      const { voorziening } = await api.adminMaakVoorziening(nieuw)
      setRijen((h) => [...h, voorziening])
      setNieuw({ id: '', soort: 'spelen', naam: '', kort: '', x: 3, y: 3 })
      setOpen(false)
      m.setGoed('Voorziening toegevoegd.')
    } catch (e) {
      m.meldFout(e, 'Toevoegen lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  async function verwijder(id: string) {
    if (!window.confirm(`${t.admin.verwijderen}: ${id}?`)) return
    try {
      await api.adminVerwijderVoorziening(id)
      setRijen((h) => h.filter((v) => v.id !== id))
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop
        titel={t.admin.voorzieningen.titel}
        intro={t.admin.voorzieningen.intro}
        actie={
          <button type="button" className="knop" onClick={() => setOpen((v) => !v)}>
            <Icoon naam="plus" maat={16} /> {t.admin.voorzieningen.toevoegen}
          </button>
        }
      />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {m.goed ? <p className="kaart__tekst">{m.goed}</p> : null}

      <Formulier
        titel={t.admin.voorzieningen.toevoegen}
        open={open}
        onSluit={() => setOpen(false)}
        onVerstuur={() => void toevoegen()}
        bezig={bezig}
      >
        <Veld label="Id (zonder spaties)">
          <input
            value={nieuw.id}
            onChange={(e) => setNieuw({ ...nieuw, id: e.target.value })}
            placeholder="speeltuin"
            required
          />
        </Veld>
        <Veld label={t.admin.velden.categorie}>
          <select value={nieuw.soort} onChange={(e) => setNieuw({ ...nieuw, soort: e.target.value })}>
            {VOORZIENINGEN_SUOORTEN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Veld>
        <Veld label={t.admin.velden.titel}>
          <input
            value={nieuw.naam}
            onChange={(e) => setNieuw({ ...nieuw, naam: e.target.value })}
            placeholder="Speeltuin"
            required
          />
        </Veld>
        <Veld label={t.admin.velden.kort}>
          <input value={nieuw.kort} onChange={(e) => setNieuw({ ...nieuw, kort: e.target.value })} />
        </Veld>
        <Veld label={`${t.admin.velden.positie} (x)`}>
          <input
            type="number"
            min={1}
            max={6}
            value={nieuw.x}
            onChange={(e) => setNieuw({ ...nieuw, x: Number(e.target.value) })}
          />
        </Veld>
        <Veld label={`${t.admin.velden.positie} (y)`}>
          <input
            type="number"
            min={1}
            max={3}
            value={nieuw.y}
            onChange={(e) => setNieuw({ ...nieuw, y: Number(e.target.value) })}
          />
        </Veld>
      </Formulier>

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">{t.admin.velden.titel}</th>
              <th scope="col">{t.admin.velden.categorie}</th>
              <th scope="col">{t.admin.velden.positie}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rijen.map((v) => (
              <tr key={v.id}>
                <th scope="row" className="mono">
                  {v.id}
                </th>
                <td>{v.naam}</td>
                <td>{v.soort}</td>
                <td className="kaart__tekst">
                  x {v.x} · y {v.y}
                </td>
                <td>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void verwijder(v.id)}
                    title={t.admin.verwijderen}
                  >
                    <Icoon naam="kruis" maat={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Foto's                                                                     */
/* -------------------------------------------------------------------------- */

const FOTO_SLEUTELS: Array<{ sleutel: string; label: string }> = [
  { sleutel: 'hero', label: 'Het erf (over ons)' },
  { sleutel: 'kippen', label: 'De kippen' },
  { sleutel: 'speelweide', label: 'Speelweide' },
  { sleutel: 'zwembad', label: 'Buitenzwembad' },
  { sleutel: 'kantine', label: 'Kantine' },
  { sleutel: 'sanitair', label: 'Sanitair' },
  { sleutel: 'winkel', label: 'Winkeltje' },
  { sleutel: 'safaritent', label: 'Safaritent (achterste veld)' },
  { sleutel: 'woonhuis', label: 'Woonhuis + receptie' },
  { sleutel: 'kampeerveld', label: 'Kampeerveld' },
  { sleutel: 'camperveld', label: 'Camperveld' },
  { sleutel: 'parkeerplaats', label: 'Parkeerplaats' },
  { sleutel: 'ingang', label: 'Ingang / hek' },
]

function Fotos() {
  const { t } = useTaal()
  const [rijen, setRijen] = useState<ApiMedia[]>([])
  const [bezig, setBezig] = useState<string | null>(null)
  const m = useMelding()
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminMedia()).foto)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function upload(sleutel: string, bestand: File | undefined) {
    if (!bestand) return
    setBezig(sleutel)
    try {
      const { foto } = await api.adminUploadMedia(sleutel, bestand)
      setRijen((h) => [...h.filter((f) => f.sleutel !== sleutel), foto])
      m.setGoed(`${bestand.name} geüpload.`)
    } catch (e) {
      m.meldFout(e, 'Uploaden lukte niet.')
    } finally {
      setBezig(null)
      const input = inputs.current[sleutel]
      if (input) input.value = ''
    }
  }

  async function verwijder(sleutel: string) {
    if (!window.confirm(`${t.admin.verwijderen}?`)) return
    try {
      await api.adminVerwijderMedia(sleutel)
      setRijen((h) => h.filter((f) => f.sleutel !== sleutel))
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop titel={t.admin.fotos.titel} intro={t.admin.fotos.intro} />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {m.goed ? <p className="kaart__tekst">{m.goed}</p> : null}

      <div className="fotoraster">
        {FOTO_SLEUTELS.map(({ sleutel, label }) => {
          const foto = rijen.find((f) => f.sleutel === sleutel)
          return (
            <figure key={sleutel} className="fotovak fotovak--slot">
              {foto ? (
                <img className="foto foto--thumb" src={`/api/media/${sleutel}?v=${foto.aangemaakt}`} alt={label} />
              ) : (
                <Icoon naam="foto" maat={22} />
              )}
              <figcaption>{label}</figcaption>
              <input
                ref={(el) => {
                  inputs.current[sleutel] = el
                }}
                type="file"
                accept="image/*"
                className="sr-only"
                id={`foto-${sleutel}`}
                onChange={(e) => void upload(sleutel, e.target.files?.[0])}
              />
              <label htmlFor={`foto-${sleutel}`} className="knop knop--klein">
                {bezig === sleutel ? 'Bezig…' : foto ? t.knoppen.wijzig : t.admin.velden.nieuweFoto}
              </label>
              {foto ? (
                <button
                  type="button"
                  className="knop knop--klein knop--secundair"
                  onClick={() => void verwijder(sleutel)}
                >
                  {t.admin.verwijderen}
                </button>
              ) : (
                <span className="kaart__tekst">{t.admin.velden.geenFoto}</span>
              )}
            </figure>
          )
        })}
      </div>
      <p className="kaart__tekst">
        JPG, PNG, WebP of AVIF · maximaal 2 MB per foto. De foto verschijnt meteen op de site.
      </p>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Berichten                                                                  */
/* -------------------------------------------------------------------------- */

function Berichten() {
  const { t, taal } = useTaal()
  const [rijen, setRijen] = useState<ApiBericht[]>([])
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminBerichten()).berichten)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function markeer(id: number, gelezen: boolean) {
    try {
      await api.adminMarkeerBericht(id, gelezen)
      setRijen((h) => h.map((b) => (b.id === id ? { ...b, gelezen: gelezen ? 1 : 0 } : b)))
    } catch (e) {
      m.meldFout(e, 'Wijzigen lukte niet.')
    }
  }

  async function verwijder(id: number) {
    if (!window.confirm(`${t.admin.verwijderen}?`)) return
    try {
      await api.adminVerwijderBericht(id)
      setRijen((h) => h.filter((b) => b.id !== id))
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop titel={t.admin.berichten.titel} intro={t.admin.berichten.intro} />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {rijen.length === 0 ? <p className="kaart__tekst">{t.admin.berichten.geen}</p> : null}

      <div className="beheerpaneel">
        <ul className="beheer__lijst">
          {rijen.map((b) => (
            <li key={b.id} className="beheer__lijstitem">
              <span className={`stippel ${b.gelezen ? 'stippel--groen' : 'stippel--oranje'}`} />
              <div style={{ flex: 1 }}>
                <p>
                  <strong>{b.naam}</strong> · {b.onderwerp}
                </p>
                <p className="kaart__tekst" style={{ whiteSpace: 'pre-wrap' }}>
                  {b.bericht}
                </p>
                <p className="kaart__tekst">
                  <a href={`mailto:${b.email}`}>{b.email}</a> ·{' '}
                  {new Date(b.aangemaakt).toLocaleString(
                    taal === 'de' ? 'de-DE' : taal === 'en' ? 'en-GB' : 'nl-NL',
                  )}
                </p>
              </div>
              <div className="beheer__pijlen">
                <button
                  type="button"
                  className="knop knop--klein knop--secundair"
                  onClick={() => void markeer(b.id, b.gelezen !== 1)}
                >
                  {b.gelezen ? t.admin.berichten.nieuw : t.admin.berichten.markeer}
                </button>
                <button
                  type="button"
                  className="knop knop--klein knop--secundair"
                  onClick={() => void verwijder(b.id)}
                  title={t.admin.verwijderen}
                >
                  <Icoon naam="kruis" maat={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* E-mail                                                                     */
/* -------------------------------------------------------------------------- */

function Email() {
  const { t, taal } = useTaal()
  const [rijen, setRijen] = useState<ApiMail[]>([])
  const [status, setStatus] = useState<ApiMailStatus | null>(null)
  const [laden, setLaden] = useState(true)
  const [bezig, setBezig] = useState<number | null>(null)
  const [testAdres, setTestAdres] = useState('')
  const [testBezig, setTestBezig] = useState(false)
  const [testUitslag, setTestUitslag] = useState<{ ok: boolean; via: string; fout: string | null } | null>(
    null,
  )
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminOutbox()).mails)
      m.setFout('')
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    } finally {
      setLaden(false)
    }
  }, [])

  useEffect(() => {
    void laad()
    api
      .adminMailStatus()
      .then(setStatus)
      .catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function opnieuw(id: number) {
    setBezig(id)
    try {
      await api.adminOpnieuw(id)
      await laad()
    } catch (e) {
      m.meldFout(e, 'Versturen lukte niet.')
    } finally {
      setBezig(null)
    }
  }

  async function testVersturen() {
    setTestBezig(true)
    setTestUitslag(null)
    try {
      const r = await api.adminMailTest(testAdres)
      setTestUitslag({ ok: r.ok, via: r.via, fout: r.fout })
      await laad()
    } catch (e) {
      setTestUitslag({ ok: false, via: '', fout: e instanceof ApiFout ? e.message : 'Versturen lukte niet.' })
    } finally {
      setTestBezig(false)
    }
  }

  return (
    <>
      <Kop titel={t.admin.email.titel} intro={t.admin.email.intro} />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}

      <div className="beheerpaneel">
        <p className="kaart__tekst">
          <strong>{t.admin.email.transport}:</strong>{' '}
          {status?.transport === 'resend'
            ? t.admin.email.transportResend
            : t.admin.email.transportCloudflare}
          {status ? (
            <>
              {' '}
              · {t.admin.email.kolommen.aan.toLowerCase()}: <code>{status.boekingen}</code>
            </>
          ) : null}
        </p>
        <div className="veld">
          <span className="veld__label">{t.admin.email.testUitleg}</span>
          <div className="nieuwsbriefvorm" style={{ margin: 0 }}>
            <input
              className="invoer"
              type="email"
              placeholder={status?.notificatie ?? 'jij@voorbeeld.nl'}
              value={testAdres}
              onChange={(e) => setTestAdres(e.target.value)}
            />
            <button type="button" className="knop" disabled={testBezig} onClick={() => void testVersturen()}>
              {testBezig ? 'Bezig…' : t.admin.email.test}
            </button>
          </div>
        </div>
        {testUitslag ? (
          <p className={testUitslag.ok ? 'kaart__tekst' : 'fouttekst'}>
            {testUitslag.ok
              ? `${t.admin.email.testGelukt} ${testUitslag.via}`
              : `${t.admin.email.testMislukt}: ${testUitslag.fout}`}
          </p>
        ) : null}
      </div>

      {!laden && rijen.length === 0 ? <p className="kaart__tekst">{t.admin.email.geen}</p> : null}

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.email.kolommen.aan}</th>
              <th scope="col">{t.admin.email.kolommen.onderwerp}</th>
              <th scope="col">{t.admin.email.kolommen.soort}</th>
              <th scope="col">{t.admin.email.kolommen.status}</th>
              <th scope="col">{t.admin.email.kolommen.wanneer}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rijen.map((mail) => (
              <tr key={mail.id}>
                <th scope="row">
                  {mail.aan}
                  <br />
                  <span className="kaart__tekst">van {mail.van}</span>
                </th>
                <td>{mail.onderwerp}</td>
                <td className="kaart__tekst">{mail.soort}</td>
                <td>
                  <span
                    className={`label ${
                      mail.status === 'verzonden'
                        ? ''
                        : mail.status === 'fout'
                          ? 'label--oranje'
                          : 'label--eigel'
                    }`}
                  >
                    {t.admin.email.statussen[mail.status]}
                  </span>
                  {mail.fout ? (
                    <>
                      <br />
                      <span className="kaart__tekst">{mail.fout}</span>
                    </>
                  ) : null}
                </td>
                <td className="kaart__tekst">
                  {new Date(mail.aangemaakt).toLocaleString(
                    taal === 'de' ? 'de-DE' : taal === 'en' ? 'en-GB' : 'nl-NL',
                  )}
                </td>
                <td>
                  {mail.status !== 'verzonden' ? (
                    <button
                      type="button"
                      className="knop knop--klein knop--secundair"
                      disabled={bezig === mail.id}
                      onClick={() => void opnieuw(mail.id)}
                    >
                      {bezig === mail.id ? 'Bezig…' : t.admin.email.opnieuw}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Team                                                                       */
/* -------------------------------------------------------------------------- */

function Team() {
  const { t } = useTaal()
  const [rijen, setRijen] = useState<ApiTeamlid[]>([])
  const [open, setOpen] = useState(false)
  const [nieuw, setNieuw] = useState({ naam: '', email: '', rol: 'receptie', wachtwoord: '' })
  const [bezig, setBezig] = useState(false)
  const m = useMelding()

  const laad = useCallback(async () => {
    try {
      setRijen((await api.adminTeam()).team)
    } catch (e) {
      m.meldFout(e, 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toevoegen() {
    setBezig(true)
    try {
      await api.adminMaakTeamlid(nieuw)
      await laad()
      setNieuw({ naam: '', email: '', rol: 'receptie', wachtwoord: '' })
      setOpen(false)
      m.setGoed('Beheerder toegevoegd.')
    } catch (e) {
      m.meldFout(e, 'Toevoegen lukte niet.')
    } finally {
      setBezig(false)
    }
  }

  async function verwijder(email: string) {
    if (!window.confirm(`${t.admin.verwijderen}: ${email}?`)) return
    try {
      await api.adminVerwijderTeamlid(email)
      setRijen((h) => h.filter((x) => x.email !== email))
    } catch (e) {
      m.meldFout(e, 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop
        titel={t.admin.team.titel}
        intro={t.admin.team.intro}
        actie={
          <button type="button" className="knop" onClick={() => setOpen((v) => !v)}>
            <Icoon naam="plus" maat={16} /> {t.admin.team.toevoegen}
          </button>
        }
      />
      {m.fout ? <p className="fouttekst">{m.fout}</p> : null}
      {m.goed ? <p className="kaart__tekst">{m.goed}</p> : null}

      <Formulier
        titel={t.admin.team.toevoegen}
        open={open}
        onSluit={() => setOpen(false)}
        onVerstuur={() => void toevoegen()}
        bezig={bezig}
      >
        <Veld label={t.admin.reserveringen.kolommen.naam}>
          <input value={nieuw.naam} onChange={(e) => setNieuw({ ...nieuw, naam: e.target.value })} required />
        </Veld>
        <Veld label={t.admin.reserveringen.kolommen.naam.replace('Naam', 'E-mailadres')}>
          <input
            type="email"
            value={nieuw.email}
            onChange={(e) => setNieuw({ ...nieuw, email: e.target.value })}
            required
          />
        </Veld>
        <Veld label={t.admin.team.kolommen.rol}>
          <select value={nieuw.rol} onChange={(e) => setNieuw({ ...nieuw, rol: e.target.value })}>
            {Object.entries(t.admin.team.rollen).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Veld>
        <Veld label={t.admin.velden.wachtwoord}>
          <input
            type="password"
            value={nieuw.wachtwoord}
            onChange={(e) => setNieuw({ ...nieuw, wachtwoord: e.target.value })}
            minLength={5}
            required
          />
        </Veld>
      </Formulier>

      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.team.kolommen.naam}</th>
              <th scope="col">{t.admin.team.kolommen.rol}</th>
              <th scope="col">{t.admin.team.kolommen.mail}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rijen.map((lid) => (
              <tr key={lid.email}>
                <th scope="row">{lid.naam}</th>
                <td>
                  <span className="label">{t.admin.team.rollen[lid.rol as keyof typeof t.admin.team.rollen] ?? lid.rol}</span>
                </td>
                <td className="mono">{lid.email}</td>
                <td>
                  <button
                    type="button"
                    className="knop knop--klein knop--secundair"
                    onClick={() => void verwijder(lid.email)}
                    title={t.admin.verwijderen}
                  >
                    <Icoon naam="kruis" maat={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Gegevens                                                                   */
/* -------------------------------------------------------------------------- */

type GegevensSleutel = keyof typeof nl_adminGegevensLabels
const nl_adminGegevensLabels = {
  reserveringen: '',
  mails: '',
  berichten: '',
  aanmeldingen: '',
  sessies: '',
  fotos: '',
  plekken: '',
  events: '',
  voorzieningen: '',
  beheerders: '',
}

function WisKnop({
  vereist,
  label,
  onWis,
  uit = false,
}: {
  vereist: string
  label?: string
  onWis: () => Promise<void>
  uit?: boolean
}) {
  const { t } = useTaal()
  const [open, setOpen] = useState(false)
  const [tekst, setTekst] = useState('')
  const [bezig, setBezig] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        className="knop knop--klein knop--secundair"
        onClick={() => setOpen(true)}
        disabled={uit}
      >
        {label ?? t.admin.gegevens.wissen}
      </button>
    )
  }

  const klaar = tekst === vereist

  return (
    <span className="wisbevestig">
      <input
        className="invoer invoer--klein"
        placeholder={vereist === 'ALLES' ? t.admin.gegevens.bevestigAlles : t.admin.gegevens.bevestig}
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        aria-label={vereist === 'ALLES' ? t.admin.gegevens.bevestigAlles : t.admin.gegevens.bevestig}
      />
      <button
        type="button"
        className="knop knop--klein"
        disabled={!klaar || bezig}
        onClick={async () => {
          setBezig(true)
          try {
            await onWis()
            setOpen(false)
            setTekst('')
          } finally {
            setBezig(false)
          }
        }}
      >
        {bezig ? 'Bezig…' : t.admin.gegevens.wissen}
      </button>
      <button
        type="button"
        className="knop knop--klein knop--secundair"
        onClick={() => {
          setOpen(false)
          setTekst('')
        }}
      >
        {t.knoppen.annuleer}
      </button>
    </span>
  )
}

function Gegevens() {
  const { t } = useTaal()
  const [overzicht, setOverzicht] = useState<ApiDataOverzicht | null>(null)
  const [fout, setFout] = useState('')
  const [goed, setGoed] = useState('')
  const [gastEmail, setGastEmail] = useState('')

  const laad = useCallback(async () => {
    try {
      setOverzicht(await api.adminData())
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
  }, [laad])

  const labels = t.admin.gegevens.labels as Record<GegevensSleutel, string>

  async function wisGast() {
    try {
      const r = await api.adminWisGast(gastEmail, 'VERWIJDER')
      const aantal = r.reserveringen + r.berichten + r.aanmeldingen
      setGoed(
        aantal
          ? `${t.admin.gegevens.klaar}: ${r.reserveringen} reserveringen, ${r.berichten} berichten, ${r.aanmeldingen} aanmeldingen`
          : t.admin.gegevens.niets,
      )
      setFout('')
      setGastEmail('')
      await laad()
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Verwijderen lukte niet.')
    }
  }

  const gastgegevens: Array<{ sleutel: GegevensSleutel; aantal: number }> = [
    { sleutel: 'reserveringen', aantal: overzicht?.reserveringen ?? 0 },
    { sleutel: 'mails', aantal: overzicht?.mails ?? 0 },
    { sleutel: 'berichten', aantal: overzicht?.berichten ?? 0 },
    { sleutel: 'aanmeldingen', aantal: overzicht?.aanmeldingen ?? 0 },
    { sleutel: 'sessies', aantal: overzicht?.sessies ?? 0 },
    { sleutel: 'fotos', aantal: overzicht?.fotos ?? 0 },
  ]

  const inrichting: Array<{ sleutel: GegevensSleutel; aantal: number }> = [
    { sleutel: 'plekken', aantal: overzicht?.plekken ?? 0 },
    { sleutel: 'events', aantal: overzicht?.events ?? 0 },
    { sleutel: 'voorzieningen', aantal: overzicht?.voorzieningen ?? 0 },
    { sleutel: 'beheerders', aantal: overzicht?.beheerders ?? 0 },
  ]

  return (
    <>
      <Kop titel={t.admin.gegevens.titel} intro={t.admin.gegevens.intro} />
      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}

      <section className="beheerpaneel">
        <h2 className="beheerpaneel__kop">{t.admin.gegevens.overzicht}</h2>
        <ul className="gegevenslijst">
          {[...gastgegevens, ...inrichting].map((rij) => (
            <li key={rij.sleutel}>
              <span>{labels[rij.sleutel]}</span>
              <strong>{rij.aantal}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="beheerpaneel">
        <h2 className="beheerpaneel__kop">{t.admin.gegevens.gast}</h2>
        <p className="kaart__tekst">{t.admin.gegevens.gastUitleg}</p>
        <div className="nieuwsbriefvorm" style={{ margin: 0 }}>
          <input
            className="invoer"
            type="email"
            placeholder="gast@voorbeeld.nl"
            value={gastEmail}
            onChange={(e) => setGastEmail(e.target.value)}
            aria-label={t.admin.gegevens.gast}
          />
          {gastEmail.includes('@') ? (
            <WisKnop vereist="VERWIJDER" label={t.admin.gegevens.gastKnop} onWis={wisGast} />
          ) : null}
        </div>
      </section>

      <p className="kaart__tekst">
        Wil je in één keer een onderdeel wissen — de mailgeschiedenis, je reserveringen, de
        foto’s? Dat staat op het tabblad <strong>{t.admin.nav.opruimen}</strong>.
      </p>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Verwijderen per afdeling                                                   */
/* -------------------------------------------------------------------------- */

function Opruimen() {
  const { t } = useTaal()
  const [overzicht, setOverzicht] = useState<ApiDataOverzicht | null>(null)
  const [fout, setFout] = useState('')
  const [goed, setGoed] = useState('')

  const laad = useCallback(async () => {
    try {
      setOverzicht(await api.adminData())
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Laden lukte niet.')
    }
  }, [])

  useEffect(() => {
    void laad()
  }, [laad])

  const labels = t.admin.gegevens.labels as Record<GegevensSleutel, string>
  const uitleg = t.admin.opruimen.uitleg as Record<string, string>

  const afdelingen: Array<{ sleutel: GegevensSleutel; aantal: number }> = [
    { sleutel: 'reserveringen', aantal: overzicht?.reserveringen ?? 0 },
    { sleutel: 'mails', aantal: overzicht?.mails ?? 0 },
    { sleutel: 'berichten', aantal: overzicht?.berichten ?? 0 },
    { sleutel: 'aanmeldingen', aantal: overzicht?.aanmeldingen ?? 0 },
    { sleutel: 'sessies', aantal: overzicht?.sessies ?? 0 },
    { sleutel: 'fotos', aantal: overzicht?.fotos ?? 0 },
  ]

  const totaal = afdelingen.reduce((a, r) => a + r.aantal, 0)

  async function wis(wat: string, bevestig: string) {
    try {
      const r = await api.adminWisData(wat, bevestig)
      setGoed(
        r.verwijderd === 0
          ? t.admin.opruimen.leeg
          : `${t.admin.gegevens.klaar}: ${r.verwijderd} × ${labels[wat as GegevensSleutel] ?? wat}`,
      )
      setFout('')
      await laad()
    } catch (e) {
      setFout(e instanceof ApiFout ? e.message : 'Verwijderen lukte niet.')
    }
  }

  return (
    <>
      <Kop titel={t.admin.opruimen.titel} intro={t.admin.opruimen.intro} />
      {fout ? <p className="fouttekst">{fout}</p> : null}
      {goed ? <p className="kaart__tekst">{goed}</p> : null}

      <div className="afdelingen">
        {afdelingen.map((afdeling) => (
          <section key={afdeling.sleutel} className="beheerpaneel afdeling">
            <div className="afdeling__kop">
              <h2 className="beheerpaneel__kop">{labels[afdeling.sleutel]}</h2>
              <span className={`label ${afdeling.aantal === 0 ? 'label--grijs' : 'label--eigel'}`}>
                {afdeling.aantal}
              </span>
            </div>
            <p className="kaart__tekst">{uitleg[afdeling.sleutel]}</p>
            {afdeling.sleutel === 'sessies' && afdeling.aantal > 0 ? (
              <p className="kaart__tekst">{t.admin.opruimen.sessiesWaarschuwing}</p>
            ) : null}
            <WisKnop
              vereist="VERWIJDER"
              uit={afdeling.aantal === 0}
              label={
                afdeling.aantal === 0
                  ? t.admin.opruimen.leeg
                  : `${t.admin.gegevens.wissen}: ${labels[afdeling.sleutel]}`
              }
              onWis={() => wis(afdeling.sleutel, 'VERWIJDER')}
            />
          </section>
        ))}
      </div>

      <section className="beheerpaneel beheerpaneel--gevaar">
        <h2 className="beheerpaneel__kop">{t.admin.opruimen.allesTitel}</h2>
        <p className="kaart__tekst">{t.admin.opruimen.allesUitleg}</p>
        <p className="kaart__tekst">
          Nu: <strong>{totaal}</strong> regels.
        </p>
        <WisKnop vereist="ALLES" label={t.admin.opruimen.allesTitel} onWis={() => wis('alles', 'ALLES')} />
      </section>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Prijzen en pagina's                                                        */
/* -------------------------------------------------------------------------- */

function Prijzen() {
  const { t, taal } = useTaal()
  const [plekken, setPlekken] = useState<ApiPlek[]>([])

  useEffect(() => {
    api
      .adminPlekken()
      .then((r) => setPlekken(r.plekken))
      .catch(() => undefined)
  }, [])

  const laagVan = (soort: Soort) => {
    const rij = plekken.find((p) => p.soort === soort)
    return rij?.prijs ?? PRIJZEN[soort].laag
  }

  const rijen = (['tent', 'camper', 'safaritent'] as const).map((soort) => {
    const laag = laagVan(soort)
    return {
      soort: t.reserveren.stap2.soorten[soort],
      laag,
      hoog: laag + (PRIJZEN[soort].hoog - PRIJZEN[soort].laag),
      min: PRIJZEN[soort].minNachten,
    }
  })

  return (
    <>
      <Kop titel={t.admin.prijzen.titel} intro={t.admin.prijzen.intro} />
      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.prijzen.kolommen.soort}</th>
              <th scope="col">{t.admin.prijzen.kolommen.laag}</th>
              <th scope="col">{t.admin.prijzen.kolommen.hoog}</th>
              <th scope="col">{t.admin.prijzen.kolommen.min}</th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((rij) => (
              <tr key={rij.soort}>
                <th scope="row">{rij.soort}</th>
                <td>{prijs(rij.laag, taal)}</td>
                <td>{prijs(rij.hoog, taal)}</td>
                <td>{rij.min}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">{t.admin.prijzen.toeristenbelasting}</th>
              <td colSpan={3}>{prijs(PRIJZEN.toeristenbelasting, taal)} p.p.p.n.</td>
            </tr>
            <tr>
              <th scope="row">{t.admin.prijzen.schoonmaak}</th>
              <td colSpan={3}>{prijs(PRIJZEN.schoonmaakSafaritent, taal)}</td>
            </tr>
            <tr>
              <th scope="row">{t.admin.prijzen.extra}</th>
              <td colSpan={3}>{prijs(PRIJZEN.extraPersoon, taal)} p.p.p.n.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="kaart__tekst">
        Het laagseizoentarief stel je per plek in bij <strong>{t.admin.nav.plekken}</strong>; hier zie je het
        resultaat per soort.
      </p>
    </>
  )
}

function Paginas() {
  const { t } = useTaal()
  const naamVan = (pagina: PageKey) => {
    if (pagina === 'toegankelijkheid') return t.voettekst.linkLabel
    if (pagina === 'nieuwsbrief') return t.nieuwsbrief.titel
    if (pagina === 'privacy') return t.privacy.titel
    return (t.nav as Record<string, string>)[pagina] ?? pagina
  }
  return (
    <>
      <Kop titel={t.admin.paginas.titel} intro={t.admin.paginas.intro} />
      <div className="tabelvak">
        <table className="tabel tabel--beheer">
          <thead>
            <tr>
              <th scope="col">{t.admin.paginas.kolommen.pagina}</th>
              <th scope="col">NL</th>
              <th scope="col">EN</th>
              <th scope="col">DE</th>
            </tr>
          </thead>
          <tbody>
            {PAGE_KEYS.filter((p) => p !== 'admin').map((pagina: PageKey) => (
              <tr key={pagina}>
                <th scope="row">{naamVan(pagina)}</th>
                <td className="mono">{`/nl/${PADEN.nl[pagina]}`.replace(/\/$/, '')}</td>
                <td className="mono">{`/en/${PADEN.en[pagina]}`.replace(/\/$/, '')}</td>
                <td className="mono">{`/de/${PADEN.de[pagina]}`.replace(/\/$/, '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="kaart__tekst">
        De teksten van deze pagina's staan per taal in <code>src/i18n</code>. Deze lijst laat zien welke URL's
        er bestaan, zodat je zeker weet dat elke pagina in elke taal bereikbaar is.
      </p>
    </>
  )
}
