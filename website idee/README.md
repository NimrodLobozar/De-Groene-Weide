# De Groene Weide — website

De website van camping **De Groene Weide**, gebouwd op het high-fidelity prototype:
stijlgids, home, terrein & activiteiten, plattegrond, reserveren (7 stappen), evenementen,
over ons, contact, voettekstpagina's, 404 en het beheerpaneel — in het Nederlands, Engels
en Duits.

**Live:** https://degroeneweide.danielsturkenboom.nl/nl
**Beheer:** https://degroeneweide.danielsturkenboom.nl/nl/beheer

Alles wat met reserveringen te maken heeft loopt via een echte database (Cloudflare D1)
in een Worker, niet meer via de browser.

## Snel starten

```bash
npm install
npm run dev        # http://localhost:5173/nl
npm run build      # frontend naar dist/
npm run typecheck  # TypeScript-controle (site + worker)
```

Lokaal werken met de database en e-mail:

```bash
npx wrangler dev                       # Worker + D1 + assets op localhost:8787
npx wrangler d1 migrations apply de-groene-weide-db --local
```

## Opbouw

| Pad | Wat |
| --- | --- |
| `worker/index.ts` | De Worker: `/api/*` naar de API, de rest naar de statische site (SPA-fallback). |
| `worker/api.ts` | Alle routes, validatie en beheeracties. |
| `worker/data.ts` | Databasewerk: plekken, beschikbaarheid, prijsberekening, reserveringen. |
| `worker/cms.ts` | Evenementen, voorzieningen, foto's en beheerders. |
| `worker/teksten.ts` | Eigen teksten en meldingen bovenop de teksten uit de code. |
| `worker/vertaler.ts` | Vertalen via Lara Translate (getekende aanvraag, geen SDK). |
| `worker/auth.ts` | Inloggen met PBKDF2-SHA256 en sessiecookies (HttpOnly, Secure, SameSite=Lax). |
| `worker/mail.ts` | Mailopmaak (NL/EN/DE), de wachtrij en de twee vervoerders. |
| `migrations/` | Het databaseschema en de startgegevens. |
| `src/i18n/nl.ts` | Alle zichtbare tekst; `en.ts` en `de.ts` volgen dezelfde vorm (`type Dict`). |
| `src/i18n/index.ts` | Talen en de URL per pagina per taal (`/nl/plattegrond`, `/en/site-map`, `/de/lageplan`). |
| `src/lib/teksten.ts` | De eigen teksten over de woordenboeken heen leggen, zodat elk component `t.…` blijft gebruiken. |
| `src/data/camping.ts` | Tarieven, seizoen en de standaardplekken (worden bij de eerste start in de database gezet). |
| `src/data/plattegrond.ts` | De plekken op de plattegrond (foto, reserveersoort, iconen) en het programma. |
| `src/lib/plattegrond.ts` | De rekenregels van de plattegrond: dagen, tijden, vrije plekken en aanmeldingen. |
| `src/components/plattegrond/` | De kaart (`Kaart.tsx`), het infopaneel (`Paneel.tsx`) en de coördinaten (`vakken.ts`). |
| `src/lib/api.ts` | Typed client voor de API. |
| `src/store/App.tsx` | Boekingsconcept, plekken/agenda/foto's uit de database, cookiekeuze en rustknop. |
| `src/styles/tokens.css` | De kleuren en typografie uit de stijlgids. |
| `src/styles/plattegrond.css` | De opmaak van de plattegrond, onder `.plattegrond-sectie`. |

### Stijlgids, letterlijk overgenomen

- Wedegroen `#2F6B3E` · Gras licht `#E4F0DE` · Schuurbrun `#5A3E26` · Stro `#F2E8DC`
- Eigel `#F5C84B` · Kam-oranje `#EE8A3C` · Inkt `#1E2A21` · Melk `#FBFAF6`
- Koppen: **Bricolage Grotesque** 600 · 44 / 32 / 24 px
- Tekst: **Atkinson Hyperlegible** 400/700 · 18 px, regelafstand 1,6

### Taalwissel

Elke pagina heeft per taal een eigen URL; de taalkeuze linkt naar dezelfde pagina in de
andere taal.

## Plattegrond

De pagina **Plattegrond** (`/nl/plattegrond`) is de interactieve tekening van het erf:

- **Klikken.** Elke plek is met muis, vinger of toetsenbord (Tab + Enter) te kiezen, net als
  de knoppen onder de kaart. De teller op de knop en het gele bolletje op de kaart laten zien
  hoeveel activiteiten er die dag op die plek zijn.
- **Infopaneel.** Rechts (op smalle schermen eronder) staat de plek: een foto uit het beheer,
  of zolang die ontbreekt een uitvergroting van de tekening zelf; daaronder het programma van
  vandaag, morgen en overmorgen, wat je er altijd kunt doen, praktische weetjes en — bij de
  velden — een reserveerknop die de boeking met het juiste soort plek voorinvult.
- **Aanmelden.** Bij een activiteit met vrije plekken kun je je naam en het aantal personen
  opgeven en je later weer afmelden. Er is nog geen server voor: de aanmeldingen staan in de
  browser van de gast (demo) en het aantal vrije plekken is een voorbeeld. Een server
  aansluiten kan in `src/lib/plattegrond.ts` — daar staan de aanmeldingen nu bewaard.
- **Buiten het seizoen** (november t/m maart) toont het programma als voorbeeld 1 juli en de
  dagen erna, met een melding erbij.

Alles is aan te passen:

| Wat | Waar |
| --- | --- |
| Plekken, foto per plek, reserveersoort, iconen | `src/data/plattegrond.ts` |
| Programma (dagen, tijden, aantal plekken, zomer-only) | `src/data/plattegrond.ts` |
| Teksten per plek en per activiteit (NL/EN/DE) | `src/i18n/*.ts` onder `plattegrond` |
| Tekening, kleuren en labels in de SVG | `src/components/plattegrond/Kaart.tsx` |
| Grootte en positie van elke plek | `src/components/plattegrond/vakken.ts` |
| Opmaak | `src/styles/plattegrond.css` |

Foto's upload je in **Beheer → Foto's**: `woonhuis`, `kampeerveld`, `camperveld`,
`parkeerplaats` en `ingang` zijn er voor de plattegrond bij gekomen; de overige plekken
gebruiken de bestaande foto's (`kantine`, `sanitair`, `zwembad`, `speelweide`, `safaritent`).

## Beweging

De site heeft een eigen bewegingslaag in `src/styles/animaties.css`, met de logica in
`src/lib/animaties.ts`. Speels, maar nooit in de weg:

- **Binnenkomst** — kop en hero komen op in lagen; kaarten, panelen, agenda's en tabellen
  schuiven in beeld zodra je scrolt (IntersectionObserver, met een trap per rij).- **Micro-interacties** — knoppen tillen op met een glans, pijltjes schuiven mee, chips
  ploppen, kaarten zweven, foto's zoomen zacht uit, de kip in het plekadvies knikt.
- **Kaart** — de plekken ploppen één voor één in, je keuze pulseert, de tip van de kip
  wiebelt zacht.
- **Boeking** — afgevinkte stappen ploppen, de huidige stap pulseert, gekozen dagen en
  plekken springen in beeld, de bevestigingsvink tekent zichzelf.
- **Beheer** — tellers lopen op, rijen schuiven in, formulieren klappen open, het
  navigatiemenu schuift mee.
- **Paginawissel** — elke route krijgt een zachte entree doordat `main` opnieuw mount.

### Het verhaal in de hero

De illustratie op de homepagina bestaat uit drie tijdlijnen die door elkaar heen lopen. Ze
staan in `src/components/Illustraties.tsx` (`HeroErf`) en `src/styles/animaties.css` onder
`.hero-verhaal`; elke bewegende groep draait om haar eigen (0, 0) en de groep eromheen zet
dat punt waar gedraaid moet worden.

**De kip** — één loop van 28 seconden:

| Tijd | Wat er gebeurt |
| --- | --- |
| 0–2,2 s | Ze staat rustig rechts bij het hek, met haar kop naar rechts |
| 2,2–6,6 s | Ze draait zich om en wandelt naar links |
| 6,6–9,7 s | Ze staat stil en pikt drie keer naar de grond |
| 9,7–13,6 s | Ze wandelt verder tot bij de stal |
| 13,6–14,8 s | Ze staat stil en draait zich weer om |
| 14,8–18,6 s | Ze wandelt terug |
| 18,6–21,6 s | **Fladderen.** Ze springt op en klappert met haar vleugels |
| 21,6–26 s | Ze wandelt terug naar haar plek |
| 26–28 s | Ze staat weer rustig, klaar om opnieuw te beginnen |

**De vogels** — twee zwermen met een eigen tempo: één van 24 s (links naar rechts) en één
van 31 s (rechts naar links). Hun vleugels klapperen elke 0,7 s.

**De tractor** — één loop van 45 s. Hij staat de eerste 13,5 s naast het beeld, rijdt dan in
ongeveer 9 s over de achterste heuvel (de wielen draaien en de uitlaat puff rook) en
verdwijnt daarna achter de heuvels.

Het beeld is één rechthoek waarvan de lucht precies de kleur van de herosectie heeft
(`#e4f0de`), zodat de illustratie naadloos in de band opgaat. De tractor staat bij het begin
buiten beeld en de rookpufjes staan op `opacity: 0`, zodat het beeld zonder beweging precies
het stilstaande ontwerp uit het prototype is.

**De rustknop wint altijd.** Staat *Rustknop* aan (of heeft de bezoeker in het systeem
"minder beweging" aangevinkt), dan staat alle beweging stil en wordt niets verborgen: de
klasse die blokken onzichtbaar maakt wordt dan niet eens gezet, en de CSS zet alles
alsnog op `opacity: 1`.

## Films van het animatieteam

Boven de weekagenda op **Evenementen** staat de film van het animatieteam. Een klik op
de kaart opent de preview in een venster; de film speelt in een iframe en begint meteen.
Staat de rustknop aan (of vraagt het systeem om minder beweging), dan wacht de film op
een bewuste tweede klik — ook daar wint de rustknop.

| Wat | Waar |
| --- | --- |
| De film en de poster | `public/animaties/` |
| Lijst met films (id, bestand, poster, duur) | `src/data/animaties.ts` |
| Titels en beschrijvingen (NL/EN/DE) | `src/i18n/*.ts` onder `evenementen.animaties` |
| Kaart, venster en sluitgedrag | `src/components/animaties/FilmSectie.tsx` |
| Opmaak | `src/styles/pages.css` (Films van het animatieteam) |

Een tweede film toevoegen: zet het HTML-bestand en een poster in `public/animaties/`,
voeg een regel toe aan `ANIMATIES` en zet de teksten onder `films` in de drie
woordenboeken. De kaart, de preview en de rustknop werken dan meteen mee.

## Teksten, meldingen en de grap

Drie beheerpagina's waarop de eigenaar zelf de inhoud van de site bepaalt. Je vult alles in
het **Nederlands** in; het Engels en Duits worden automatisch gemaakt door
[Lara Translate](https://laratranslate.com).

| Pagina | Wat je ermee doet |
| --- | --- |
| **Alle teksten** (`/nl/beheer/teksten`) | Alle teksten van de site, per onderdeel en te doorzoeken. Je ziet van elke tekst de Nederlandse bron plus de Engelse en Duitse versie. Opslaan betekent bewaren én vertalen; **Terug naar standaard** haalt je aanpassing weg, waarna de tekst uit `src/i18n` weer geldt. |
| **Meldingen** (`/nl/beheer/meldingen`) | De gekleurde balk bovenaan elke pagina, zoals „Het zwembad is vandaag gesloten”. Soort (geel, oranje of rood), een optionele periode, aan/uit, en meteen een voorbeeld. |
| **Grap van de dag** (`/nl/beheer/grap`) | De grap in het kaartje op de homepagina, met voorbeeld en een paar ideetjes. |

Hoe het werkt:

- Een aangepaste tekst staat in de tabel `texts`: de Nederlandse bron plus de vertalingen.
  Staat er niets, dan gebruikt de site de tekst uit `src/i18n` — er kan dus nooit iets
  ontbreken.
- Bij het opslaan vertaalt de Worker de tekst naar `en-US` en `de-DE` en bewaart beide. Lukt
  vertalen even niet (storing of tegoed op), dan wordt het Nederlands alsnog bewaard en zegt
  het beheer dat de vertaling nog moet gebeuren; met **Vertaal nu** of **Ontbrekende
  vertalingen aanvullen** haal je dat later in.
- Elke tekst gaat in een eigen verzoek: losse websiteonderdelen in één verzoek laten elkaar
  van context verwisselen.
- Teksten met `{placeholders}` (zoals `Goedemorgen, {naam}`) worden niet stukvertaald: mist
  een placeholder in de vertaling, dan blijft de Nederlandse tekst staan.
- Wie een melding wegklikt, ziet hem niet opnieuw tot je hem wijzigt.

### Lara Translate instellen

De sleutels staan als geheim in Cloudflare, nooit in de repo:

```bash
npx wrangler secret put LARA_ID       # Access Key ID
npx wrangler secret put LARA_SECRET   # Access Key Secret
```

Voor lokaal ontwikkelen zet je ze in `.dev.vars` (staat in `.gitignore`):

```
LARA_ID=…
LARA_SECRET=…
```

Zonder sleutels blijft alles werken: het beheer bewaart dan alleen het Nederlands en de site
valt terug op de teksten uit de code. Het gratis Lara-abonnement doet 10.000 tekens per
maand; daarom vertaalt **Ontbrekende vertalingen aanvullen** per klik hooguit twintig
teksten.

De Worker tekent de aanvraag zelf (HMAC-SHA256, zie `worker/vertaler.ts`), omdat de
Node-SDK van Lara niet in een Worker past.

## Database (D1)

Tabellen: `reservations`, `pitches`, `events`, `facilities`, `media`, `admins`, `sessions`,
`messages`, `subscribers`, `outbox`, `settings`, `texts`, `notices`.

Alles wat op de site te zien is, komt uit de database:

- **Plekken** (68) met alle kenmerken: soort, weide, stroom, water, rustig, schaduw, hond,
  ondergrond, vlakheid, maximum aantal personen, afstand tot sanitair, prijs en status.
  Toevoegen, wijzigen en verwijderen kan in het beheer.
- **Evenementen** met een Nederlandse, Engelse en Duitse titel; de agenda op de site en de
  drie uitgelichte evenementen op de homepagina komen hier vandaan.
- **Voorzieningen** bepalen de blokken op de plekkenkaart in de boekingsstap.
- **Foto's** staan in Cloudflare KV (gratis, tot 2 MB per foto) en worden via
  `/api/media/<plek>` uitgeleverd; de site toont ze op de plek van de fotovakken en in het
  paneel van de plattegrond.
- **Beschikbaarheid** komt uit `reservations`: kaart, kalender en de tips van de kip lezen
  dezelfde bron.
- **Prijzen** worden altijd op de server berekend (laagseizoen uit de database, hoogseizoen
  als delta daarop, plus toeristenbelasting, extra persoon en schoonmaak).
- Elke reservering krijgt een nummer (`GW-…`) en een onraadbaar token waarmee de gast zijn
  eigen reservering kan bekijken en annuleren — zonder account.

### API

| Route | Wat |
| --- | --- |
| `GET /api/config` | Meldingen, seizoen en instellingen voor de site |
| `GET /api/texts` | Eigen teksten (NL/EN/DE) bovenop de teksten uit de code |
| `GET /api/pitches` | Prijs en status per plek |
| `GET /api/availability?van&tot` | Welke plek op welke dag bezet is |
| `POST /api/reservations` | Reservering aanmaken (valideert en rekent af op de server) |
| `GET /api/reservations/:nr?token=` | Reservering van de gast |
| `POST /api/reservations/:nr/annuleer` | Annuleren met token |
| `POST /api/contact` / `POST /api/nieuwsbrief` | Bericht en aanmelding opslaan + melden |
| `/api/admin/*` | Inloggen, reserveringen, statistieken, plekken, berichten, mail, instellingen, teksten, meldingen |

## E-mail

Elke mail wordt eerst in de tabel `outbox` gezet en daarna verstuurd. Lukt versturen
niet, dan blijft de mail staan met de foutmelding erbij; in **Beheer → E-mail** zie je de
status, welke weg hij ging, en kun je hem opnieuw aanbieden. Er raakt dus nooit een
bevestiging zoek.

Twee vervoerders, automatisch gekozen:

| Situatie | Verzendt via | Bereik |
| --- | --- | --- |
| `RESEND_API_KEY` gezet (nu het geval) | **Resend** | naar iedereen, gratis tot 3.000 mails/maand (100 per dag) |
| geen sleutel | Cloudflare Email Sending | alleen geverifieerde adressen, vereist Workers Paid |

Afzenders:

- `boekingen@degroeneweide.danielsturkenboom.nl` — bevestiging en annulering naar de gast
- `receptie@degroeneweide.danielsturkenboom.nl` — interne melding bij een nieuwe boeking
- interne meldingen gaan naar `receptie@danielsturkenboom.nl` (aan te passen met de variabele
  `MAIL_NOTIFICATIE` in `wrangler.jsonc`)

Het domein `degroeneweide.danielsturkenboom.nl` is bij Resend aangemeld en geverifieerd;
de DKIM-, SPF- en MX-records staan in Cloudflare. Daardoor voldoet de mail aan de strikte
DMARC-policy van het domein.

Sleutel vervangen of opnieuw instellen:

```bash
npx wrangler secret put RESEND_API_KEY     # plak de re_… sleutel als je daarom vraagt
```

Zonder sleutel blijft alles werken, maar gaan mails alleen nog naar geverifieerde adressen.

## Beheer

`/nl/beheer` — start (aankomst, vertrek, schoonmaak, bezetting), reserveringen met zoeken,
filteren, status wijzigen, verwijderen en **zelf een reservering toevoegen** (de gast krijgt
dezelfde bevestigingsmail), plekken (toevoegen, prijs en status wijzigen, verwijderen),
bezetting per plek per dag, berichten (lezen, markeren, verwijderen), e-mailwachtrij met
opnieuw versturen en testmail, evenementen (toevoegen, verbergen, verwijderen), voorzieningen
(toevoegen, verwijderen), foto's per plek (uploaden, vervangen, verwijderen), prijzen,
team (beheerder toevoegen met rol en wachtwoord, verwijderen), **Alle teksten**,
**Meldingen** (de balk bovenaan de site), **Grap van de dag** en **Gegevens**.

### Gegevens en verwijderen

Twee aparte tabbladen:

**Gegevens** — een overzicht van wat er in de database staat (per onderdeel het aantal),
en het verwijderen van de gegevens van **één gast** op e-mailadres: reserveringen,
berichten en de nieuwsbriefaanmelding. Dat dekt het recht op vergetelheid uit de AVG.

**Verwijderen** — per afdeling een eigen knop, zodat je dingen los kunt opruimen:

| Afdeling | Wat er weg gaat |
| --- | --- |
| Reserveringen | Alle boekingen; de plekken komen weer vrij op de kaart |
| E-maillog | De geschiedenis van verstuurde en mislukte mails (de mails zelf zijn al weg) |
| Contactberichten | Alles uit het contactformulier |
| Nieuwsbriefaanmeldingen | De opgegeven e-mailadressen |
| Ingelogde sessies | Iedereen wordt uitgelogd, ook jij |
| Foto's | De geüploade foto's én de bestanden in de opslag |
| Alles in één keer | Alle bovenstaande; de inrichting blijft staan |

Elke wisactie vraagt om een bevestiging die je moet overtikken (`VERWIJDER`, of `ALLES`
voor de grote opruiming), zodat je niet per ongeluk alles weggooit. Afdelingen waar niets
in zit hebben een uitgeschakelde knop.

Alles wat je daar wijzigt staat meteen in de database en dus op de site.

## Controleren

```bash
node tools/shot.mjs http://localhost:4173          # screenshots + lokale flow
node tools/shot-plattegrond.mjs http://localhost:4173   # alleen de plattegrond (NL/EN/DE, mobiel)
node tools/flow-live.mjs https://degroeneweide.danielsturkenboom.nl   # echte reservering + beheer
node tools/test-admin.mjs                          # alle toevoegen-knoppen van het beheer
```

`test-admin.mjs` loopt de hele beheerketen door: plek toevoegen (en dubbele weigeren),
evenement, voorziening, foto-upload, teamlid (en of die kan inloggen), reservering
toevoegen met bevestigingsmail, en daarna alles weer opruimen.

## Publiceren

```bash
npm run build
npx wrangler d1 migrations apply de-groene-weide-db --remote   # alleen bij schemawijziging
npx wrangler deploy
```

De Worker heet `de-groene-weide`, heeft D1-binding `DB`, e-mailbinding `EMAIL`,
assets-binding `ASSETS` en draait op het custom domain
`degroeneweide.danielsturkenboom.nl`. De geheimen staan niet in de repo maar bij de Worker:
`RESEND_API_KEY`, `LARA_ID` en `LARA_SECRET`.
