/**
 * Alle zichtbare tekst van de site, in het Nederlands.
 *
 * Het prototype werkte met placeholders ([ADRES], [EEN GRA P]) zodat de eigenaar
 * ze later kon vullen. Hier staan ze gevuld, in dezelfde toon: rustig, vrolijk,
 * toegankelijk, één grapje per scherm.
 */

export const nl = {
  code: 'nl',
  taalnaam: 'Nederlands',
  taalKort: 'NL',

  merk: {
    naam: 'De Groene Weide',
    slogan: 'Rustig wonen en boerenleven',
    beschrijving:
      'Camping op het erf van Bert. Kamperen tussen de kippen, de tractor en de oude melkstal.',
  },

  nav: {
    home: 'Home',
    terrein: 'Terrein & activiteiten',
    plattegrond: 'Plattegrond',
    reserveren: 'Reserveren',
    evenementen: 'Evenementen',
    overOns: 'Over ons',
    contact: 'Contact',
    menu: 'Menu',
    sluitMenu: 'Sluit menu',
    overslaan: 'Direct naar de inhoud',
    admin: 'Beheer',
  },

  aankondiging: {
    tekst: 'Zwembad gaat dinsdag dicht voor onderhoud. Douches blijven open.',
    sluit: 'Melding sluiten',
  },

  knoppen: {
    boek: 'Boek je plekje in de wei',
    planRoute: 'Plan je route',
    stuurBericht: 'Stuur een bericht',
    vraagDeKip: 'Vraag het de kip',
    startPlekmatch: 'Start Plekmatch',
    verder: 'Verder',
    terug: 'Terug',
    volgende: 'Volgende stap',
    bekijkAlles: 'Bekijk alles op de kaart',
    kiesDeze: 'Kies deze plek',
    naarGegevens: 'Verder naar je gegevens',
    reserveerNu: 'Reserveer nu',
    meerLezen: 'Lees verder',
    heleAgenda: 'Hele agenda',
    allesOpHetErf: 'Alles op het erf',
    leesToegankelijkheid: 'Lees over toegankelijkheid',
    sluit: 'Sluiten',
    annuleer: 'Annuleren',
    opslaan: 'Opslaan',
    wijzig: 'Wijzigen',
  },

  taalkeuze: 'Taal · Language · Sprache',

  rustknop: {
    label: 'Rustknop',
    uitleg:
      'Zet beweging en geluid uit. Handig als je snel afgeleid raakt of rustig wilt lezen.',
    aan: 'Rust aan',
    uit: 'Rust uit',
  },

  cookie: {
    titel: 'Koekjes? Alleen die van ons.',
    tekst:
      'We gebruiken alleen cookies die nodig zijn om de site te laten werken. Bezoekcijfers meten we zonder cookies. Extra’s, zoals de kaart van Google, staan uit tot je ze aanzet.',
    accepteren: 'Alles toestaan',
    weigeren: 'Kies zelf',
    uitleg: 'Lees de cookieverklaring',
  },

  home: {
    hero: {
      eyebrow: 'Camping · 1 april – 31 oktober',
      titel: 'Beleef het echte boerenleven',
      intro:
        'Tussen de kippen, de tractor en de oude melkstal. Kies zelf je plekje op de kaart en word wakker met gemekker.',
      grapLabel: 'Grap van de dag',
      grap: 'Waarom stak de kip de weg over? Om aan de andere kant te komen.',
    },
    terrein: {
      eyebrow: 'Terrein & activiteiten',
      titel: 'Wat kun je hier doen?',
      link: 'Alles op het erf',
      kaarten: [
        {
          titel: 'De kippen',
          tekst: 'Eieren rapen om negen uur. Voorzichtig, ze zijn nog niet wakker.',
          foto: 'Foto: de kippen',
        },
        {
          titel: 'Speelweide met tractor',
          tekst: 'Klimmen, rennen en spelen op de oude tractor.',
          foto: 'Foto: speelweide met tractor',
        },
        {
          titel: 'Buitenzwembad',
          tekst: 'Even afkoelen na een dag op het erf.',
          foto: 'Foto: buitenzwembad',
        },
        {
          titel: 'Kantine in de oude melkstal',
          tekst: 'Met een winkeltje vol producten van lokale boeren.',
          foto: 'Foto: de oude melkstal',
        },
      ],
    },
    plekadvies: {
      eyebrow: 'Plekadvies',
      titel: 'Welke plek past bij jullie?',
      tekst:
        'De kip stelt vijf korte vragen en wijst de drie beste vrije plekken aan. In een halve minuut.',
    },
    evenementen: {
      eyebrow: 'Evenementen',
      titel: 'Binnenkort op het erf',
    },
    vindons: {
      titel: 'Zo vind je ons',
      adresLabel: 'Adres',
      adres: 'Groene Weide 1\n1234 AB Weideveen',
      tijdenLabel: 'Receptie open',
      tijden: 'Elke dag 08:00 – 20:00',
      seizoen: 'Geopend van 1 april tot en met 31 oktober',
      kaart: 'Kaart met route',
    },
  },

  terrein: {
    titel: 'Wat kun je hier doen?',
    intro:
      'Alles op het erf is te voet te bereiken in twee minuten. Hieronder zie je wat er allemaal is, en voor wie.',
    tip: 'Tip: het hele dorp is met de fiets in tien minuten te doen. Fietsen staan bij de receptie.',
    filterLabel: 'Filter het erf',
    filters: {
      alles: 'Alles',
      dieren: 'Dieren',
      water: 'Water',
      spelen: 'Spelen',
      eten: 'Eten & drinken',
      sanitair: 'Sanitair',
    },
    plekken: [
      {
        titel: 'De kippen',
        tekst:
          'Elke ochtend om negen uur mag je mee eieren rapen. De kippen lopen vrij over het erf en zijn gek op kinderen met een handje graan.',
        foto: 'Foto: de kippenwei',
        filter: 'dieren',
        label: 'Elke dag · 09:00',
      },
      {
        titel: 'Speelweide met tractor',
        tekst:
          'Een groot grasveld met een echte oude tractor om op te klimmen, een schommel en genoeg ruimte om te rennen.',
        foto: 'Foto: speelweide met tractor',
        filter: 'spelen',
        label: 'Hele dag open',
      },
      {
        titel: 'Buitenzwembad',
        tekst:
          'Verwarmd van mei tot september. Ondiep gedeelte voor de kleintjes, en ’s avonds stil water voor wie rustig zwemt.',
        foto: 'Foto: buitenzwembad',
        filter: 'water',
        label: 'Mei – september',
      },
      {
        titel: 'Kantine in de oude melkstal',
        tekst:
          'Koffie, broodjes en soep van wat de boerderij die dag heeft. Op woensdag is er een warme maaltijd.',
        foto: 'Foto: de oude melkstal',
        filter: 'eten',
        label: '08:00 – 20:00',
      },
      {
        titel: 'Het winkeltje',
        tekst:
          'Eieren, kaas, honing en jam van boeren uit de buurt. Betalen kan met pin, en contant in een potje.',
        foto: 'Foto: het winkeltje',
        filter: 'eten',
        label: 'Bij de receptie',
      },
      {
        titel: 'Sanitair & wasruimte',
        tekst:
          'Warm water, twee gezinsdouches, een wasmachine en een plek om je laarzen schoon te spuiten.',
        foto: 'Foto: sanitair',
        filter: 'sanitair',
        label: 'Warm water, 24 uur',
      },
    ],
    rolstoel: {
      titel: 'Rolstoel of kinderwagen?',
      tekst:
        'De meeste paden op het erf zijn verhard en breed genoeg. De speelweide is graspad, bij nat weer minder prettig met een rolstoel.',
      link: 'Bekijk alles op de toegankelijkheidspagina',
    },
    cta: {
      titel: 'Zin gekregen?',
      tekst:
        'Boek je plekje in de wei. Eén e-mailadres volstaat, een account is niet nodig.',
    },
  },

  plattegrond: {
    titel: 'Verken het erf',
    intro:
      'Klik op een plek op de kaart en ontdek wat je waar vindt. Een geel bolletje laat zien hoeveel activiteiten er die dag zijn.',
    fotoAlt: 'Foto van {plek}',
    doenKop: 'Wat kun je hier doen',
    feitenKop: 'Goed om te weten',
    kaart: {
      weg: 'Provinciale weg',
      kiesLabel: 'Kies een plek op de plattegrond',
      svgTitel:
        'Plattegrond van De Groene Weide. Gebruik de knoppen onder de kaart om een plek te kiezen.',
      hint: 'Veeg opzij om de hele plattegrond te zien, of kies hieronder een plek.',
      paneelLabel: 'Over deze plek',
      zoneAantalEen: ', 1 activiteit op het programma',
      zoneAantal: ', {aantal} activiteiten op het programma',
    },
    zones: {
      woonhuis: {
        kort: 'Receptie',
        label: 'Woonhuis + receptie',
        tag: 'Hier begint je verblijf',
        titel: 'Woonhuis & receptie',
        tekst:
          'Hier woont Bert en hier meld je je bij aankomst. Bij de receptie kun je terecht met vragen, voor broodjes en voor tips over de omgeving.',
        doen: [
          {
            titel: 'Rondje over het erf met Bert',
            detail: 'Hoe werkte een melkveebedrijf? Bert vertelt, en kinderen mogen alles vragen.',
          },
          {
            titel: 'Broodjes bestellen',
            detail: 'De avond ervoor bestellen, om 08:00 bezorgt de bakker ze',
          },
          { titel: 'Tips voor de omgeving', detail: 'Fiets- en wandelroutes in de buurt' },
        ],
        feiten: [
          'Receptie open van 09:00 tot 20:00',
          'Inchecken vanaf 13:00, uitchecken vóór 11:00',
          'Goed mobiel bereik op het erf',
        ],
      },
      kampeerveld: {
        kort: 'Kampeerveld',
        label: 'Kampeerveld',
        tag: '40 plekken voor tent of caravan',
        titel: 'Kampeerveld',
        tekst:
          'Ruime plekken op het gras, met de boerderij in je rug en weilanden voor je. Het grootste veld van De Groene Weide.',
        doen: [
          { titel: 'Ontbijten in het gras', detail: 'Met verse broodjes van de bakker' },
          { titel: 'Sterren kijken', detail: 'Ver van de stad is het ’s nachts echt donker' },
          { titel: 'Spelen op de speelweide', detail: 'Op een paar minuten lopen' },
        ],
        feiten: [
          'Tent of caravan, tot 6 personen per plek',
          'Sanitair op loopafstand',
          'Mobiel bereik is hier beperkt',
        ],
      },
      camperveld: {
        kort: 'Camperveld',
        label: 'Camperveld',
        tag: '12 camperplekken',
        titel: 'Camperveld',
        tekst:
          'Een eigen veld, alleen voor campers. Je rijdt er direct naartoe via het middenpad en het sanitairgebouw ligt om de hoek.',
        doen: [
          { titel: 'Direct naar je plek rijden', detail: 'Via het middenpad' },
          { titel: 'Douchen om de hoek', detail: 'Het sanitairgebouw ligt direct onder het veld' },
          {
            titel: 'Boodschappen bij de buren',
            detail: 'Het winkeltje in de oude melkstal ligt op loopafstand',
          },
        ],
        feiten: ['Apart veld, alleen voor campers', 'Tot 6 personen per plek', 'Mobiel bereik is hier beperkt'],
      },
      achterste: {
        kort: 'Safaritenten',
        label: 'Achterste veld',
        tag: '8 ingerichte safaritenten',
        titel: 'Achterste veld',
        tekst:
          'Het rustigste stukje van het erf, ver van de weg. Hier staan de safaritenten: je hoeft alleen jezelf mee te nemen.',
        doen: [
          { titel: 'Sterren kijken', detail: 'Het donkerste en stilste plekje van het erf' },
          {
            titel: 'Ontbijten op je veranda',
            detail: 'Elke tent heeft een keukenhoek en een overdekte veranda',
          },
          { titel: 'Uitslapen', detail: 'Ver van de weg, dus lekker rustig' },
        ],
        feiten: [
          'Bedden staan klaar, geen kampeerspullen nodig',
          'Tot 5 personen per tent',
          'Mobiel bereik is hier beperkt',
        ],
      },
      melkstal: {
        kort: 'Oude melkstal',
        label: 'Oude melkstal',
        tag: 'Kantine & winkeltje',
        titel: 'De oude melkstal',
        tekst:
          'Waar vroeger elke ochtend en avond werd gemolken, drink je nu een kop koffie of een koud biertje. Het winkeltje verkoopt producten van boeren uit de buurt.',
        doen: [
          { titel: 'Een drankje in de kantine', detail: 'Koffie overdag, een koud biertje ’s avonds' },
          { titel: 'Boodschappen in het winkeltje', detail: 'Producten van boeren uit de buurt' },
          {
            titel: 'Zien waar gemolken werd',
            detail: 'Hier stonden vroeger elke ochtend en avond de koeien',
          },
        ],
        feiten: ['Fijne plek als het regent', 'Mobiel bereik is hier beperkt'],
      },
      sanitair: {
        kort: 'Sanitair',
        label: 'Sanitairgebouw',
        tag: 'Schoon en dichtbij',
        titel: 'Sanitairgebouw',
        tekst:
          'Centraal op het terrein, dus vanaf elke plek snel bereikbaar. Ook de wasruimte vind je hier.',
        doen: [
          { titel: 'Douchen', detail: '12 douches en 14 toiletten' },
          { titel: 'Was draaien', detail: 'Wasruimte met wasmachines' },
        ],
        feiten: ['Centraal op het terrein', 'Vanaf elke plek snel bereikbaar'],
      },
      zwembad: {
        kort: 'Zwembad',
        label: 'Zwembad',
        tag: 'Verkoeling na een warme dag',
        titel: 'Buitenzwembad',
        tekst:
          'Een buitenzwembad met ligstoelen, naast het sanitairgebouw. Openingstijden hoor je bij de receptie.',
        doen: [
          { titel: 'Zwemmen', detail: 'Verkoeling na een warme dag' },
          { titel: 'Zonnen op een ligstoel', detail: 'Rond het bad staan ligstoelen' },
        ],
        feiten: ['Openingstijden hoor je bij de receptie', 'Vlak bij de speelweide'],
      },
      speelweide: {
        kort: 'Speelweide',
        label: 'Speelweide',
        tag: 'Ruimte om te rennen',
        titel: 'Speelweide',
        tekst:
          'Een groot grasveld met schommels, een glijbaan en een zandbak. In juli en augustus organiseert het animatieteam hier spellen.',
        doen: [
          {
            titel: 'Schommelen, glijden en zandkastelen bouwen',
            detail: 'Voor de kleintjes',
          },
          { titel: 'Spellen met het animatieteam', detail: 'In juli en augustus' },
          { titel: 'Rennen en spelen in het gras', detail: 'Een groot veld, ver van de auto’s' },
        ],
        feiten: ['Autovrij, dus veilig spelen', 'Zwembad en sanitair liggen vlakbij'],
      },
      parkeerplaats: {
        kort: 'Parkeren',
        label: 'Parkeerplaats',
        tag: 'Auto’s aan de rand',
        titel: 'Parkeerplaats',
        tekst:
          'Na het uitladen parkeer je hier. Zo blijft het terrein rustig en veilig voor spelende kinderen.',
        doen: [],
        feiten: [
          'Direct naast de ingang',
          'Eerst uitladen bij je plek, dan hier parkeren',
          'Zo blijft het terrein autoluw',
        ],
      },
      ingang: {
        kort: 'Ingang',
        label: 'Ingang / hek',
        tag: 'Aan de provinciale weg',
        titel: 'Ingang',
        tekst:
          'Hier rijd je het erf op. Kom je aan na sluitingstijd van de receptie? Laat het ons vooraf weten, dan spreken we iets af.',
        doen: [],
        feiten: [
          'Aankomen kan vanaf 13:00',
          'Receptie direct links na de ingang',
          'Late aankomst? Meld het vooraf',
        ],
      },
    },
    cta: {
      kampeerplek: 'Reserveer een kampeerplek',
      camperplek: 'Reserveer een camperplek',
      safaritent: 'Reserveer een safaritent',
    },
    programma: {
      kop: 'Op het programma',
      dicht: 'De camping is nu dicht. Als voorbeeld zie je het programma vanaf {datum}.',
      demo:
        'Demo: aanmeldingen worden alleen in deze browser bewaard en het aantal vrije plekken is een voorbeeld.',
      vandaag: 'Vandaag',
      morgen: 'Morgen',
      dagKies: 'Kies een dag',
      leegVandaag: 'Vandaag staat hier niets op het programma.',
      leegMorgen: 'Morgen staat hier niets op het programma.',
      leegOp: 'Op {datum} staat hier niets op het programma.',
      vrij: 'Nog {aantal} plek vrij',
      vrijMeer: 'Nog {aantal} plekken vrij',
      vol: 'Vol',
      bezig: 'Is al begonnen',
      afgelopen: 'Afgelopen',
      tot: 'tot {tijd}',
      aanmelden: 'Aanmelden',
      aanmeldenVoor: 'Aanmelden voor {titel}',
      afmelden: 'Afmelden',
      jeStaatErOp: 'Je staat erop met {aantal} persoon.',
      jeStaatErOpMeer: 'Je staat erop met {aantal} personen.',
      naam: 'Je naam',
      personen: 'Personen',
      bevestig: 'Bevestig aanmelding',
      annuleer: 'Annuleer',
      foutNaam: 'Vul je naam in, dan weet het team wie er komt.',
      aangemeld: 'Je bent aangemeld voor {titel} met {aantal} persoon.',
      aangemeldMeer: 'Je bent aangemeld voor {titel} met {aantal} personen.',
      afgemeld: 'Je bent afgemeld voor {titel}.',
      activiteit: {
        erfwandeling: {
          titel: 'Rondje over het erf met Bert',
          detail: 'Verzamelen bij de receptie. Bert vertelt hoe het melkveebedrijf werkte.',
        },
        fietstocht: {
          titel: 'Fietstocht langs de buren',
          detail: 'Een rondje langs boeren uit de buurt. Neem je eigen fiets mee.',
        },
        speurtocht: {
          titel: 'Speurtocht over het erf',
          detail: 'Voor kinderen, ouders mogen mee zoeken.',
        },
        animatie: {
          titel: 'Spelmiddag met het animatieteam',
          detail: 'Spellen op de speelweide voor jong en oud.',
        },
        watergym: {
          titel: 'Watergym',
          detail: 'Rustig bewegen in het buitenzwembad.',
        },
        proeverij: {
          titel: 'Proeverij uit het winkeltje',
          detail: 'Proef producten van boeren uit de buurt.',
        },
        boerenquiz: {
          titel: 'Boerenquiz in de kantine',
          detail: 'Hoeveel liter melk geeft een koe per dag? Speel mee in teams.',
        },
        sterren: {
          titel: 'Samen sterren kijken',
          detail: 'Neem een kleed en een warme trui mee.',
        },
      },
    },
    weides: {
      a: 'Weide A · T1–T24',
      b: 'Weide B · T25–T48',
      c: 'Camperplaatsen C1–C12',
      s: 'Safaritenten S1–S8',
    },
    plekDetails: {
      foto: 'Foto van',
      voorzieningen: 'Voorzieningen',
      beschikbaar: 'Beschikbaar',
      boekDeze: 'Boek deze plek',
      afstand: 'Afstand tot sanitair',
      tip: 'Tip van de kip: deze plek hoort de kippen ’s ochtends als eerste.',
    },
    voorzieningen: {
      kippenwei: {
        naam: 'Kippenwei',
        kort: 'Kippen',
        tekst:
          'Elke ochtend om negen uur mogen gasten mee eieren rapen. De kippen lopen vrij rond en zijn niet bang.',
        tip: 'Kom je met kleine kinderen? Hier is om 09:00 het drukst.',
      },
      melkstal: {
        naam: 'Kantine in de oude melkstal',
        kort: 'Kantine',
        tekst:
          'Koffie, broodjes en soep van wat de boerderij die dag heeft. Op woensdag een warme maaltijd.',
        tip: 'De melkstal is de droogste plek bij regen.',
      },
      sanitair: {
        naam: 'Sanitair & wasruimte',
        kort: 'Sanitair',
        tekst:
          'Warm water, twee gezinsdouches, invalidentoilet, wasmachine en een kraan om laarzen te spoelen.',
        tip: 'Tussen 07:00 en 08:00 is het er rustig.',
      },
      zwembad: {
        naam: 'Buitenzwembad',
        kort: 'Zwembad',
        tekst:
          'Verwarmd van mei tot september, met een ondiep deel voor de kleintjes en ’s avonds stil water.',
        tip: 'Vrijdag om 17:00 is het zwembad-uurtje met de boer.',
      },
      receptie: {
        naam: 'Receptie & winkeltje',
        kort: 'Receptie',
        tekst:
          'Inchecken, vragen en het winkeltje met eieren, kaas, honing en jam van boeren uit de buurt.',
        tip: 'Hier staan ook de fietsen die je gratis kunt lenen.',
      },
      speelweide: {
        naam: 'Speelweide met tractor',
        kort: 'Speelweide',
        tekst:
          'Een grasveld met een oude tractor om op te klimmen, een schommel en ruimte om te rennen.',
        tip: 'Plekken T1 tot en met T6 liggen hier het verst vandaan.',
      },
    },
  },

  evenementen: {
    titel: 'Wat is er te doen op het erf?',
    intro:
      'Alles is gratis en je hoeft je alleen bij de kippen even te melden. Bij regen schuiven we naar de melkstal.',
    week: 'Deze week',
    filterLabel: 'Soort activiteit',
    filters: {
      alles: 'Alles',
      dieren: 'Dieren',
      spelen: 'Spelen',
      water: 'Water',
      eten: 'Eten',
    },
    dagen: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
    agendaTitel: 'De agenda van deze week',
    meedoen: 'Meedoen',
    niets: 'Deze dag is er niets gepland. Mooi moment om te wandelen.',
    soorten: {
      dieren: 'Dieren',
      spelen: 'Spelen',
      water: 'Water',
      eten: 'Eten',
    },
    animaties: {
      eyebrow: 'Evenement · animatieteam',
      titel: 'De film van het animatieteam',
      intro:
        'Ons animatieteam maakte een korte tekenfilm over het erf. Klik op de kaart om de preview te openen.',
      bekijk: 'Bekijk de preview',
      seconden: 'seconden',
      sluiten: 'Sluiten',
      opnieuw: 'Opnieuw',
      nieuwTabblad: 'Open in een nieuw tabblad',
      rust: 'De ruststand staat aan, dus de film blijft stil. Start hem hieronder zelf.',
      start: 'Start de film',
      films: {
        'de-boerderij': {
          label: 'Film',
          titel: 'Mini film: de boerderij',
          beschrijving:
            'De kip, de tractor, een ufo en een wekker: op het erf gebeurt van alles. Eén ronde duurt 71 seconden en begint daarna weer opnieuw.',
        },
      },
    },
    list: [
      {
        dag: 0,
        tijd: '09:00',
        titel: 'Kippen voeren',
        locatie: 'Kippenwei',
        leeftijd: 'Alle leeftijden',
        soort: 'dieren',
      },
      {
        dag: 0,
        tijd: '17:00',
        titel: 'Melkstal-soep',
        locatie: 'Kantine',
        leeftijd: 'Alle leeftijden',
        soort: 'eten',
      },
      {
        dag: 1,
        tijd: '10:30',
        titel: 'Eieren rapen',
        locatie: 'Kippenwei',
        leeftijd: '4+',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '09:00',
        titel: 'Kippen voeren',
        locatie: 'Kippenwei',
        leeftijd: 'Alle leeftijden',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '15:00',
        titel: 'Tractor-tocht met Bert',
        locatie: 'Speelweide',
        leeftijd: '4+',
        soort: 'spelen',
      },
      {
        dag: 3,
        tijd: '19:30',
        titel: 'Rustig zwemmen',
        locatie: 'Buitenzwembad',
        leeftijd: 'Alle leeftijden',
        soort: 'water',
      },
      {
        dag: 4,
        tijd: '09:00',
        titel: 'Kippen voeren',
        locatie: 'Kippenwei',
        leeftijd: 'Alle leeftijden',
        soort: 'dieren',
      },
      {
        dag: 4,
        tijd: '17:00',
        titel: 'Zwembad-uurtje',
        locatie: 'Buitenzwembad',
        leeftijd: 'Alle leeftijden',
        soort: 'water',
      },
      {
        dag: 5,
        tijd: '11:00',
        titel: 'Brood bakken',
        locatie: 'Kantine',
        leeftijd: '6+',
        soort: 'eten',
      },
      {
        dag: 6,
        tijd: '10:00',
        titel: 'Wandeling met de boer',
        locatie: 'Start bij de receptie',
        leeftijd: 'Alle leeftijden',
        soort: 'spelen',
      },
    ],
    cta: {
      titel: 'Niets gemist?',
      tekst: 'De agenda van volgende week staat er elke vrijdag op.',
      knop: 'Meld je aan voor de nieuwsbrief',
    },
  },

  overOns: {
    titel: 'Van melkveehouder tot campingboer',
    intro:
      'Bert heeft de koeien weggedaan en de weilanden klaargemaakt voor tenten. De oude melkstal werd kantine, de hooischuur werd sanitaire ruimte.',
    verhaal: {
      titel: 'Het verhaal van de boerderij',
      alineas: [
        'Toen de laatste koe in 2011 de stal verliet, stond Bert met een leeg erf. Zijn dochter stelde voor om er een paar tenten op te zetten. In juli dat jaar stonden er zes.',
        'Sindsdien is de camping gegroeid naar achtenveertig plekken, twee safaritenten en twaalf camperplaatsen. De kippen zijn gebleven, de tractor ook.',
        'We zoeken het niet in groter worden, maar in rustiger worden. Daarom is er geen wifi op de kampeervelden, geen muziek in de kantine en één stille avond per week.',
      ],
    },
    waarden: {
      titel: 'Waar we voor staan',
      punten: [
        {
          titel: 'Bewust klein',
          tekst: 'Maximaal vijftig plekken, geen animatieteam en geen luidsprekers.',
        },
        {
          titel: 'Van de buurt',
          tekst: 'Brood, kaas en groente komen uit het dorp, niet uit een vrachtwagen.',
        },
        {
          titel: 'Voor iedereen',
          tekst: 'Verharde paden, ruime plekken en een rustknop op elke pagina.',
        },
      ],
    },
    team: {
      titel: 'Het team',
      leden: [
        {
          naam: 'Bert',
          rol: 'Boer',
          tekst: 'Kent elke kip bij naam en rijdt de tractor op woensdag.',
          foto: 'Foto: Bert',
        },
        {
          naam: 'Monique',
          rol: 'Receptie & administratie',
          tekst: 'Regelt je boeking en weet waar de beste koffie is.',
          foto: 'Foto: Monique',
        },
        {
          naam: 'Jesse',
          rol: 'Erf & sanitair',
          tekst: 'Zorgt dat het zwembad schoon is en de douches warm.',
          foto: 'Foto: Jesse',
        },
      ],
      jijTitel: 'En jij?',
      jijTekst:
        'Je bent geen gast, je woont hier even. Ruim je plekje op als je weggaat, dan is de volgende blij.',
    },
    cta: {
      titel: 'Kom het zelf beleven',
      tekst: 'Een nachtje tussen de kippen zegt meer dan een verhaal.',
      primair: 'Boek je plekje in de wei',
      secundair: 'Stuur een bericht',
    },
  },

  contact: {
    titel: 'Vraag het gerust',
    intro: 'Weet je iets niet? Bel, mail of schrijf het hieronder. Je krijgt meestal dezelfde dag antwoord.',
    form: {
      naam: 'Naam',
      email: 'E-mailadres',
      onderwerp: 'Waar gaat het over?',
      onderwerpen: ['Een boeking', 'Een vraag', 'Een klacht', 'Iets anders'],
      bericht: 'Je bericht',
      berichtHint: 'Vermeld je reserveringsnummer als je er een hebt.',
      akkoord: 'Je mag me mailen over mijn vraag.',
      versturen: 'Verstuur je vraag',
      succes: 'Je bericht is verstuurd. We mailen je binnen één werkdag terug.',
    },
    direct: {
      titel: 'Direct contact',
      telefoon: 'Telefoon',
      email: 'E-mail',
      post: 'Postadres',
    },
    receptie: {
      titel: 'Receptie open',
      week: 'Maandag t/m vrijdag',
      weekend: 'Zaterdag en zondag',
      feestdagen: 'Feestdagen',
    },
    faq: {
      titel: 'Veelgestelde vragen',
      vragen: [
        {
          vraag: 'Mag mijn hond mee?',
          antwoord:
            'Op de speciaal aangewezen plekken T41 tot en met T48 is een hond welkom, aan de lijn. In het zwembad en bij de kippen niet.',
        },
        {
          vraag: 'Hoe laat kan ik inchecken?',
          antwoord:
            'Van 14:00 tot 20:00. Kom je later? Bel even, dan legt de receptie de sleutel klaar.',
        },
        {
          vraag: 'Is er wifi op de camping?',
          antwoord:
            'Bij de receptie en in de kantine wel. Op de kampeervelden bewust niet.',
        },
        {
          vraag: 'Kan ik mijn eigen beddengoed meenemen?',
          antwoord:
            'Ja. Onze safaritenten hebben dekbedden, maar je mag ook je eigen slaapzak meebrengen.',
        },
      ],
    },
  },

  voettekst: {
    linkLabel: 'Toegankelijkheid',
    titel: 'Toegankelijkheid op De Groene Weide',
    intro:
      'Wij willen dat iedere gast zich hier thuis voelt. Hieronder lees je precies wat wel en niet kan. Iets gemist? Bel of mail ons, dan zoeken we een oplossing.',
    onderdelenTitel: 'Op het terrein',
    onderdelen: [
      { plek: 'Sanitair', bereikbaar: 'Verhard pad', voorziening: 'Invalidentoilet', opmerking: 'Draaideur, 90 cm breed' },
      { plek: 'Kantine', bereikbaar: 'Drempelloos', voorziening: 'Rolstoeltoegankelijk', opmerking: 'Pinnen kan bij de balie' },
      { plek: 'Kippenwei', bereikbaar: 'Graspad', voorziening: 'Deels toegankelijk', opmerking: 'Bij nat weer drassig' },
      { plek: 'Zwembad', bereikbaar: 'Trap met leuning', voorziening: 'Geen tillift', opmerking: 'Wel een ondiep badje' },
      { plek: 'Speelweide', bereikbaar: 'Gras', voorziening: 'Zelfde pad als kippenwei', opmerking: 'Kinderwagen gaat net' },
      { plek: 'Receptie', bereikbaar: 'Drempelloos', voorziening: 'Rustplek en water', opmerking: 'Ook een graag-even-zitten-stoel' },
    ],
    kolommen: { plek: 'Plek', bereikbaar: 'Bereikbaar', voorziening: 'Voorziening', opmerking: 'Let op' },
    vragenTitel: 'Kan ik…?',
    vragen: [
      {
        vraag: 'Kan ik een rolstoel huren?',
        antwoord: 'Nee, maar de dorpsleenhub heeft er twee. De receptie belt ze voor je.',
      },
      {
        vraag: 'Zijn er rustige plekken?',
        antwoord:
          'Ja. Plekken T1 tot en met T6 liggen het verst van de speelweide en het zwembad.',
      },
      {
        vraag: 'Is de site voor te lezen?',
        antwoord:
          'Ja. De rustknop zet beweging uit en de site werkt met elke voorleesfunctie van je apparaat.',
      },
    ],
  },

  nieuwsbrief: {
    titel: 'Nieuwsbrief & tips',
    intro: 'Eén mail per maand. Wat er op het erf gebeurt, en één tip om het boerenleven thuis te proeven.',
    veld: 'Je e-mailadres',
    knop: 'Aanmelden',
    akkoord: 'Ik weet dat ik me altijd weer kan afmelden.',
    succes: 'Je staat op de lijst. De eerste mail komt begin volgende maand.',
    tip: 'Deze maand: wat je met een kist eieren en een zak meel kunt doen zonder oven.',
  },

  privacy: {
    titel: 'Privacy & cookies',
    intro:
      'Kort en eerlijk: we bewaren wat we nodig hebben om je boeking te laten werken, en niets meer.',
    alineas: [
      'Bij een boeking bewaren we je naam, e-mailadres, telefoonnummer en de datums. Die gegevens verwijderen we drie maanden na je verblijf.',
      'We gebruiken geen advertentiecookies en verkopen niets door. Bezoekcijfers meten we zonder cookies.',
      'De kaart op de pagina’s Plattegrond en Contact komt van Google. Die laadt pas nadat je daar toestemming voor geeft.',
    ],
    contactTitel: 'Vragen over je gegevens?',
    contactTekst: 'Mail de receptie. We reageren binnen vier weken.',
  },

  nietGevonden: {
    fout: 'Foutje 404',
    titel: 'Deze koe is ontsnapt.',
    tekst:
      'De pagina die je zocht staat niet meer in de wei. Misschien is hij verhuisd, of heeft iemand het hek open laten staan.',
    terug: 'Terug naar het erf',
  },

  reserveren: {
    titel: 'Reserveer je plekje',
    intro: 'Zeven korte stappen. Je kunt op elk moment terug.',
    stapVan: 'stap {stap} van 7',
    stappen: [
      'Datum',
      'Personen & wens',
      'Plekmatch',
      'Plek kiezen',
      'Gegevens',
      'Controleren',
      'Bevestiging',
    ],
    stap1: {
      titel: 'Wanneer kom je logeren?',
      intro: 'Kies je aankomst en vertrek. Weken met een streepje zijn vol.',
      aankomst: 'Aankomst',
      vertrek: 'Vertrek',
      kiesDatum: 'Kies je aankomst',
      jouwKeuze: 'Jouw selectie',
      nachten: 'nachten',
      nacht: 'nacht',
      volgeboekt: 'Volgeboekt',
      beschikbaar: 'Nog plek',
      volgend: 'Bekijk de beste plekken',
    },
    stap2: {
      titel: 'Wie komen er, en waar in slaap je?',
      personen: 'Personen',
      volwassenen: 'Volwassenen',
      kinderen: 'Kinderen',
      volwassenenHint: '18 jaar en ouder',
      kinderenHint: 'Tot 18 jaar',
      slapen: 'Slapen in',
      wens: 'Jouw wensje?',
      wensen: {
        stroom: 'Stroom',
        rustig: 'Rustig',
        sanitair: 'Sanitair dichtbij',
        schaduw: 'Schaduw',
        speelweide: 'Dicht bij de speelweide',
      },
      volgend: 'Bekijk de beste plekken',
      soorten: {
        tent: 'Tent',
        camper: 'Camper',
        safaritent: 'Safaritent',
      },
      soortUitleg: {
        tent: 'Eigen tent, eigen plekje gras.',
        camper: 'Verharde plek met stroom en afvoer.',
        safaritent: 'Onze tent met bedden, klaar om in te stappen.',
      },
    },
    stap3: {
      titel: 'De kip heeft drie tips voor je',
      intro: 'Op basis van je wensen. De eerste past meestal het best.',
      tip: 'Tip',
      match: 'Match',
      waarom: 'Waarom deze',
      kies: 'Kies deze',
      bekijkAlles: 'Bekijk alles op de kaart',
      opnieuw: 'Pas je wensen aan',
      tips: {
        stroom: 'heeft stroom',
        rustig: 'ligt rustig',
        sanitair: 'dicht bij sanitair',
        schaduw: 'heeft schaduw',
        speelweide: 'dicht bij de speelweide',
      },
    },
    stap4: {
      titel: 'Kies je plekje in de wei',
      kaart: 'Kaart',
      lijst: 'Lijst',
      aankomst: 'Aankomst',
      vertrek: 'Vertrek',
      personen: 'Personen',
      wens: 'Soort wens',
      legendaTitel: 'Legenda',
      tipVanDeKip: 'Tip van de kip',
      reserveer: 'Verder naar je gegevens',
      geenAccount: 'Geen account nodig. Eén e-mailadres volstaat om je reservering te bewaren.',
      alAccount: 'Heb je al een account?',
      houdVast: 'De kip houdt deze plek 15 minuten voor je warm.',
      nachten: 'nachten',
      status: {
        vrij: 'Vrij',
        bezet: 'Bezet',
        geblokkeerd: 'Geblokkeerd',
        keuze: 'Jouw keuze',
        tip: 'Tip',
      },
      voorzieningenTitels: {
        stroom: 'Stroom',
        ondergrond: 'Ondergrond',
        vlak: 'Vlak',
        water: 'Water',
        rustig: 'Rustig',
        maxPersonen: 'Max. personen',
        afstand: 'Afstand tot sanitair',
      },
    },
    stap5: {
      titel: 'Op wiens naam mag het?',
      intro: 'Alleen wat we nodig hebben. Geen account, geen wachtwoord.',
      plek: 'Plek',
      naam: 'Naam',
      email: 'E-mailadres',
      telefoon: 'Telefoonnummer',
      adres: 'Adres',
      postcode: 'Postcode',
      plaats: 'Plaats',
      land: 'Land',
      opmerking: 'Iets wat we moeten weten?',
      opmerkingHint: 'Bijvoorbeeld een hond, een rolstoel of late aankomst.',
      akkoord: 'Ik ga akkoord met de voorwaarden en de privacyverklaring.',
      voorwaarden: 'voorwaarden',
      privacy: 'privacyverklaring',
      volgende: 'Verder naar controleren',
      selectie: 'Jouw selectie',
      verplicht: 'Vul je naam en e-mailadres in.',
      verplichtAkkoord: 'Vink de voorwaarden aan om verder te gaan.',
    },
    stap6: {
      titel: 'Klopt alles?',
      intro: 'Eén laatste blik. Daarna zetten we de plek op jouw naam.',
      wie: 'Wie',
      wanneer: 'Wanneer',
      waar: 'Waar',
      wat: 'Wat',
      betalen: 'Betaal later',
      betalenUitleg: 'Je betaalt bij aankomst bij de receptie. Annuleren kan tot 48 uur van tevoren.',
      totaal: 'Totaal',
      reserveer: 'Reserveer nu',
      wijzig: 'Wijzigen',
      voorwaardenKort: 'Door te reserveren ga je akkoord met de voorwaarden.',
    },
    stap7: {
      titel: 'Geboekt! Plek {plek} is van jullie.',
      intro: 'Je krijgt een mail met alle gegevens. Tot snel op het erf.',
      nummer: 'Reserveringsnummer',
      nu: 'Wat nu?',
      gemaild: 'Ik heb het al gemaild',
      planRoute: 'Plan je route',
      ical: 'Zet in je agenda',
      handig: 'Handig om te weten',
      tips: [
        'Inchecken kan vanaf 14:00 bij de receptie.',
        'Neem laarzen mee, het erf is ’s ochtends nat.',
        'Kippen voeren is elke dag om 09:00.',
      ],
      naarMijn: 'Bekijk mijn reservering',
    },
    netBezet: {
      titel: 'Oei, plek {plek} is net weg.',
      tekst:
        'Iemand was je net voor. De kip heeft al twee andere plekken voor je klaargezet.',
      alternatief: 'Bekijk de alternatieven',
      opnieuw: 'Kies zelf een andere plek',
    },
    mijnereservering: {
      titel: 'Nog {nachten} nachtjes slapen',
      intro: 'Alles wat je nodig hebt voor je verblijf.',
      gegevens: 'Je gegevens',
      aankomst: 'Aankomst',
      vertrek: 'Vertrek',
      plek: 'Plek',
      annuleren: 'Reservering annuleren',
      wijzigen: 'Gegevens wijzigen',
      route: 'Plan je route',
      watMee: 'Wat je mee kunt nemen',
      mee: ['Laarzen', 'Een zaklamp', 'Handdoeken', 'Eigen beddengoed mag'],
      aankomstInfo:
        'Inchecken vanaf 14:00 bij de receptie. Kom je later dan 20:00? Bel even.',
      geen: 'We konden deze reservering niet vinden. Klopt de link?',
    },
    aankomstdag: {
      titel: 'Welkom vandaag!',
      tekst: 'Je plekje is klaar. Meld je bij de receptie, dan wijst de boer je de weg.',
      receptie: 'Receptie is open tot 20:00',
    },
  },

  admin: {
    titel: 'Beheer',
    inloggen: {
      titel: 'Goedemorgen even inloggen.',
      intro: 'Deze omgeving is alleen voor het team van De Groene Weide.',
      email: 'E-mailadres',
      wachtwoord: 'Wachtwoord',
      knop: 'Inloggen',
      fout: 'Dat e-mailadres en wachtwoord horen niet bij elkaar.',
      hint: 'Demo: bert@degroeneweide.nl / weide',
      uitloggen: 'Uitloggen',
    },
    nav: {
      start: 'Start',
      reserveringen: 'Reserveringen',
      bezetting: 'Bezetting',
      plekken: 'Plekken',
      berichten: 'Berichten',
      email: 'E-mail',
      evenementen: 'Evenementen',
      paginas: 'Pagina’s & blokken',
      fotos: 'Foto’s & bestanden',
      prijzen: 'Prijzen & seizoenen',
      voorzieningen: 'Voorzieningen',
      gegevens: 'Gegevens',
      opruimen: 'Verwijderen',
      team: 'Wie mag wat',
      teksten: 'Alle teksten',
      meldingen: 'Meldingen',
      grap: 'Grap van de dag',
    },
    berichten: {
      titel: 'Berichten',
      intro: 'Wat gasten via het contactformulier stuurden.',
      geen: 'Nog geen berichten.',
      nieuw: 'Nieuw',
      gelezen: 'Gelezen',
      markeer: 'Markeer als gelezen',
    },
    email: {
      titel: 'E-mail',
      intro:
        'Elke mail die de site verstuurt, met de status. Mislukte mails blijven staan tot ze weg zijn.',
      geen: 'Er is nog geen e-mail verstuurd.',
      opnieuw: 'Opnieuw versturen',
      kolommen: { aan: 'Aan', onderwerp: 'Onderwerp', soort: 'Soort', status: 'Status', wanneer: 'Wanneer' },
      test: 'Testmail versturen',
      testUitleg: 'Stuur een mail naar dit adres om te zien of verzenden werkt.',
      testGelukt: 'Verstuurd via',
      testMislukt: 'Mislukt',
      transport: 'Verzendt via',
      transportResend: 'Resend (gratis abonnement)',
      transportCloudflare: 'Cloudflare Email Sending',
      statussen: { verzonden: 'Verzonden', fout: 'Mislukt', wacht: 'In wachtrij' },
    },
    opruimen: {
      titel: 'Verwijderen per afdeling',
      intro:
        'Kies precies wat je weggooit. Elk onderdeel heeft zijn eigen knop, dus je kunt de mailgeschiedenis wissen zonder je reserveringen aan te raken — en andersom.',
      allesTitel: 'Alles in één keer',
      allesUitleg:
        'Reserveringen, e-maillog, berichten, nieuwsbriefaanmeldingen, sessies en foto’s in één keer. Plekken, evenementen, voorzieningen, beheerders en instellingen blijven staan.',
      uitleg: {
        reserveringen:
          'Alle boekingen, inclusief de bevestigingsmails die daarbij horen. De plekken komen daarmee weer vrij op de kaart.',
        mails:
          'De geschiedenis van verstuurde en mislukte e-mails. De mails zelf zijn dan al verzonden; dit wist alleen het logboek.',
        berichten: 'Alles wat gasten via het contactformulier hebben ingestuurd.',
        aanmeldingen: 'De e-mailadressen die zich voor de nieuwsbrief hebben opgegeven.',
        sessies: 'Iedereen die nu in het beheer is ingelogd wordt uitgelogd — ook jijzelf.',
        fotos: 'De geüploade foto’s, inclusief de bestanden. De fotovakken op de site worden weer placeholders.',
      },
      sessiesWaarschuwing: 'Let op: je wordt hierna uitgelogd.',
      leeg: 'Niets om te verwijderen',
    },
    gegevens: {
      titel: 'Gegevens',
      intro:
        'Bekijk wat er in de database staat en ruim op wat je niet meer nodig hebt. Opruimen kan niet ongedaan worden gemaakt.',
      overzicht: 'Wat staat er in de database',
      opruimen: 'Opruimen',
      opruimenUitleg: 'Kies een onderdeel en typ VERWIJDER om het te wissen.',
      wissen: 'Wissen',
      bevestig: 'Typ VERWIJDER om te bevestigen',
      bevestigAlles: 'Typ ALLES om alles te wissen',
      alles: 'Alle gastgegevens wissen',
      allesUitleg:
        'Reserveringen, e-maillog, berichten, nieuwsbriefaanmeldingen, sessies en foto’s. Plekken, evenementen, voorzieningen en beheerders blijven staan.',
      gast: 'Gegevens van één gast',
      gastUitleg:
        'Verwijdert alle reserveringen, berichten en de nieuwsbriefaanmelding van dit e-mailadres. Gebruik dit als een gast vraagt om zijn gegevens te wissen.',
      gastKnop: 'Verwijder gegevens van deze gast',
      klaar: 'Verwijderd',
      niets: 'Er stond niets om te verwijderen.',
      labels: {
        reserveringen: 'Reserveringen',
        mails: 'E-maillog',
        berichten: 'Contactberichten',
        aanmeldingen: 'Nieuwsbriefaanmeldingen',
        sessies: 'Ingelogde sessies',
        fotos: 'Foto’s',
        plekken: 'Plekken',
        events: 'Evenementen',
        voorzieningen: 'Voorzieningen',
        beheerders: 'Beheerders',
      },
    },
    velden: {
      weide: 'Weide',
      hond: 'Hond toegestaan',
      schaduw: 'Schaduw',
      dag: 'Dag',
      tijd: 'Tijd',
      titel: 'Titel',
      locatie: 'Locatie',
      leeftijd: 'Leeftijd',
      categorie: 'Soort',
      kort: 'Korte naam',
      positie: 'Plek op de kaart',
      wachtwoord: 'Wachtwoord',
      nieuweFoto: 'Foto kiezen',
      geenFoto: 'Nog geen foto',
    },
    verwijderen: 'Verwijderen',
    start: {
      groet: 'Goedemorgen, {naam}',
      intro: 'Dit is wat er vandaag speelt op het erf.',
      snel: 'Snel naar',
      nieuw: 'Nieuwe reservering',
      reserveren: 'Reservering toevoegen',
      plekken: 'Plekken beheren',
      berichten: 'Berichten',
      berichtenUitleg: 'Vragen van gasten via het contactformulier.',
      vandaag: 'Vandaag',
      aankomst: 'aankomst',
      vertrek: 'vertrek',
      schoonmaak: 'Schoonmaak',
      instellingen: 'Instellingen van vandaag',
      plekmatch: 'Plekmatch aan',
      plekmatchUitleg: 'Gasten krijgen drie tips in plaats van de hele kaart.',
      melding: 'Melding op de site',
      meldingUitleg: 'De gele balk bovenaan elke pagina.',
      alles: 'Alle reserveringen',
    },
    reserveringen: {
      titel: 'Alle reserveringen',
      intro: 'Zoek, filter en open een reservering.',
      zoek: 'Zoek op naam of nummer',
      filter: 'Filter',
      periode: 'Periode',
      nieuwe: 'Nieuwe reservering',
      kolommen: {
        nummer: 'Nummer',
        naam: 'Naam',
        plek: 'Plek',
        van: 'Van',
        tot: 'Tot',
        personen: 'Personen',
        bedrag: 'Bedrag',
        status: 'Status',
      },
      statussen: {
        bevestigd: 'Bevestigd',
        betaald: 'Betaald',
        geannuleerd: 'Geannuleerd',
        nieuw: 'Nieuw',
      },
      geen: 'Geen reserveringen gevonden.',
      totaal: '{aantal} reserveringen',
    },
    bezetting: {
      titel: 'Wie staat waar?',
      intro: 'Sleepvrij overzicht per plek en per dag.',
      legenda: 'Groen is bezet, oranje is aankomst of vertrek.',
      week: 'Week',
      dagen: 'Dagen',
    },
    plekken: {
      titel: 'Alle plekken in de wei',
      intro: 'Zet een plek open, dicht of in onderhoud.',
      kolommen: {
        plek: 'Plek',
        soort: 'Soort',
        status: 'Status',
        stroom: 'Stroom',
        ondergrond: 'Ondergrond',
        prijs: 'Prijs/nacht',
      },
      status: {
        open: 'Open',
        dicht: 'Dicht',
        onderhoud: 'Onderhoud',
      },
      toevoegen: 'Nieuwe plek',
    },
    evenementen: {
      titel: 'Evenementen',
      intro: 'De agenda die gasten zien op de pagina Evenementen.',
      week: 'Terugkerend per week',
      toevoegen: 'Evenement toevoegen',
    },
    paginas: {
      titel: 'Pagina’s & blokken',
      intro: 'Alle URL’s van de site, in drie talen. De teksten zelf pas je aan bij Alle teksten.',
      kolommen: { pagina: 'Pagina', taal: 'Taal', status: 'Status', gewijzigd: 'Gewijzigd' },
      status: { gepubliceerd: 'Gepubliceerd', concept: 'Concept', verouderd: 'Verouderd' },
    },
    teksten: {
      titel: 'Alle teksten',
      intro:
        'Vul hier in wat er op de site staat. Je schrijft in het Nederlands; het Engels en Duits worden automatisch vertaald.',
      zoeken: 'Zoek op tekst of sleutel',
      onderdeel: 'Onderdeel',
      alles: 'Alles',
      aantal: '{aantal} teksten',
      geen: 'Geen tekst gevonden. Probeer een andere zoekterm.',
      meer: 'Meer teksten tonen',
      standaard: 'Standaard',
      aangepast: 'Aangepast',
      vertaald: 'Vertaald',
      mist: 'Vertaling mist',
      opslaan: 'Opslaan en vertalen',
      bewaard: 'Opgeslagen en vertaald.',
      bewaardZonder: 'Opgeslagen. Vertalen lukte nu niet — probeer het later opnieuw.',
      herstel: 'Terug naar standaard',
      hersteld: 'Weer de tekst uit de code.',
      vertaalAlles: 'Ontbrekende vertalingen aanvullen',
      vertaalUitleg:
        'Er worden per keer hooguit 20 teksten vertaald, zodat het tegoed van de vertaaldienst niet in één keer op is.',
      vertaalKlaar: '{aantal} teksten vertaald.',
      vertaalOpen: 'Nog {aantal} te gaan.',
      geenVertaler:
        'Er zijn nog geen Lara-sleutels ingesteld, dus vertalen kan nog niet. Je Nederlandse tekst wordt wel bewaard.',
      leeg: 'Leeg laten betekent: terug naar de tekst uit de code.',
    },
    meldingen: {
      titel: 'Meldingen bovenaan de site',
      intro:
        'Een melding komt als gekleurde balk boven elke pagina te staan, bijvoorbeeld „Het zwembad is vandaag gesloten”. Je schrijft in het Nederlands; Engels en Duits worden automatisch vertaald.',
      nieuw: 'Nieuwe melding',
      tekst: 'Tekst van de melding',
      soort: 'Soort',
      soorten: {
        mededeling: 'Mededeling (geel)',
        waarschuwing: 'Waarschuwing (oranje)',
        dringend: 'Dringend (rood)',
      },
      vanaf: 'Vanaf (leeg = meteen)',
      tot: 'Tot en met (leeg = altijd)',
      actief: 'Staat aan',
      aanzetten: 'Zet aan',
      uitzetten: 'Zet uit',
      plaatsen: 'Melding plaatsen',
      wijzigen: 'Wijzigen',
      vertaal: 'Vertaal nu',
      bewaren: 'Wijziging bewaren',
      annuleer: 'Annuleren',
      verwijderen: 'Verwijderen',
      verwijderBevestig: 'Deze melding verwijderen?',
      geen: 'Er staan nog geen meldingen. De site is dan gewoon schoon.',
      loopt: 'Staat nu op de site',
      gepland: 'Komt later',
      verlopen: 'Is afgelopen',
      uit: 'Staat uit',
      voorbeeld: 'Zo ziet het eruit',
      bewaard: 'Melding bewaard en vertaald.',
      bewaardZonder: 'Melding bewaard. Vertalen lukte nu niet.',
      anoniem: 'Bezoekers kunnen een melding wegklikken; hij komt terug bij een nieuwe melding.',
      telling: '{aantal} meldingen',
    },
    grap: {
      titel: 'Grap van de dag',
      intro:
        'De grap staat in het kaartje bovenaan de homepagina. Schrijf hem in het Nederlands; Engels en Duits komen er automatisch bij.',
      voorbeeld: 'Zo staat hij op de homepagina',
      label: 'Kopje',
      opslaan: 'Grap opslaan en vertalen',
      bewaard: 'Grap opgeslagen en vertaald.',
      bewaardZonder: 'Grap opgeslagen. Vertalen lukte nu niet.',
      herstel: 'Terug naar de standaardgrap',
      leeg: 'Een lege grap laat het kaartje verdwijnen.',
      ideeen: 'Misschien iets hiervan?',
      ideeenLijst: [
        'Waarom stak de kip de weg over? Om aan de andere kant te komen.',
        'Wat zegt een kip als ze een ei legt? „Dit is niet mijn ei.”',
        'Waarom zijn kippen zo rustig? Ze leggen alles naast zich neer.',
      ],
    },
    fotos: {
      titel: 'Foto’s & bestanden',
      intro: 'Sleep een foto in een vak. De site pakt hem automatisch op de juiste maat.',
      uploaden: 'Foto’s uploaden',
      alt: 'Alt-tekst verplicht',
      stats: 'Opslag gebruikt',
    },
    prijzen: {
      titel: 'Prijzen & seizoenen',
      intro: 'Wat kost een nacht, en wanneer.',
      kolommen: { soort: 'Soort', laag: 'Laagseizoen', hoog: 'Hoogseizoen', min: 'Min. nachten' },
      toeristenbelasting: 'Toeristenbelasting',
      schoonmaak: 'Schoonmaak safaritent',
      extra: 'Extra persoon',
    },
    voorzieningen: {
      titel: 'Wat staat er op het erf?',
      intro: 'Deze lijst vult de plattegrond en de plekdetails.',
      toevoegen: 'Voorziening toevoegen',
      status: { open: 'Open', dicht: 'Dicht', storing: 'Storing' },
    },
    team: {
      titel: 'Wie mag wat?',
      intro: 'Rollen en rechten van het team.',
      kolommen: { naam: 'Naam', rol: 'Rol', mail: 'E-mail', rechten: 'Rechten' },
      rollen: { eigenaar: 'Eigenaar', receptie: 'Receptie', terrein: 'Terrein', schoonmaak: 'Schoonmaak' },
      rechten: ['Reserveringen bekijken', 'Reserveringen wijzigen', 'Prijzen wijzigen', 'Pagina’s publiceren', 'Team beheren'],
      toevoegen: 'Iemand toevoegen',
    },
  },
}

/** Tekstmodel waar elke taal aan moet voldoen. */
export type Dict = typeof nl
