/**
 * Alle zichtbare tekst van de site, in het Duits.
 *
 * Zelfde opbouw en toon als het Nederlands: rustig, warm, toegankelijk,
 * één klein grapje per scherm.
 */

import type { Dict } from './nl'

export const de: Dict = {
  code: 'de',
  taalnaam: 'Deutsch',
  taalKort: 'DE',

  merk: {
    naam: 'De Groene Weide',
    slogan: 'Ruhig wohnen und Bauernhofleben',
    beschrijving:
      'Camping auf Berts Hof. Zelten zwischen Hühnern, Traktor und alter Molkerei.',
  },

  nav: {
    home: 'Start',
    terrein: 'Gelände & Aktivitäten',
    plattegrond: 'Lageplan',
    reserveren: 'Buchen',
    evenementen: 'Veranstaltungen',
    overOns: 'Über uns',
    contact: 'Kontakt',
    menu: 'Menü',
    sluitMenu: 'Menü schließen',
    overslaan: 'Direkt zum Inhalt',
    admin: 'Verwaltung',
  },

  aankondiging: {
    tekst: 'Das Schwimmbad schließt am Dienstag wegen Wartung. Die Duschen bleiben offen.',
    sluit: 'Hinweis schließen',
  },

  knoppen: {
    boek: 'Sichere dir deinen Platz auf der Wiese',
    planRoute: 'Route planen',
    stuurBericht: 'Nachricht senden',
    vraagDeKip: 'Frag das Huhn',
    startPlekmatch: 'Platzmatch starten',
    verder: 'Weiter',
    terug: 'Zurück',
    volgende: 'Nächster Schritt',
    bekijkAlles: 'Alles auf der Karte ansehen',
    kiesDeze: 'Diesen Platz wählen',
    naarGegevens: 'Weiter zu deinen Daten',
    reserveerNu: 'Jetzt reservieren',
    meerLezen: 'Weiterlesen',
    heleAgenda: 'Ganzer Kalender',
    allesOpHetErf: 'Alles auf dem Hof',
    leesToegankelijkheid: 'Über Barrierefreiheit lesen',
    sluit: 'Schließen',
    annuleer: 'Abbrechen',
    opslaan: 'Speichern',
    wijzig: 'Ändern',
  },

  taalkeuze: 'Sprache · Language · Taal',

  rustknop: {
    label: 'Ruheknopf',
    uitleg:
      'Schaltet Bewegung und Ton aus. Praktisch, wenn du schnell abgelenkt wirst oder in Ruhe lesen möchtest.',
    aan: 'Ruhe an',
    uit: 'Ruhe aus',
  },

  cookie: {
    titel: 'Kekse? Nur unsere eigenen.',
    tekst:
      'Wir verwenden nur die Cookies, die für diese Seite nötig sind. Besucherzahlen messen wir ohne Cookies. Extras wie die Karte von Google sind aus, bis du sie einschaltest.',
    accepteren: 'Alles erlauben',
    weigeren: 'Selbst entscheiden',
    uitleg: 'Zur Cookie-Erklärung',
  },

  home: {
    hero: {
      eyebrow: 'Camping · 1. April – 31. Oktober',
      titel: 'Erlebe das echte Bauernhofleben',
      intro:
        'Zwischen Hühnern, Traktor und alter Molkerei. Such dir deinen Platz selbst auf der Karte und wach mit Gemecker auf.',
      grapLabel: 'Witz des Tages',
      grap: 'Warum hat das Huhn die Straße überquert? Um auf die andere Seite zu kommen.',
    },
    terrein: {
      eyebrow: 'Gelände & Aktivitäten',
      titel: 'Was kannst du hier machen?',
      link: 'Alles auf dem Hof',
      kaarten: [
        {
          titel: 'Die Hühner',
          tekst: 'Um neun Uhr Eier sammeln. Vorsichtig, sie sind noch nicht wach.',
          foto: 'Foto: die Hühner',
        },
        {
          titel: 'Spielwiese mit Traktor',
          tekst: 'Klettern, rennen und auf dem alten Traktor spielen.',
          foto: 'Foto: Spielwiese mit Traktor',
        },
        {
          titel: 'Freibad',
          tekst: 'Mal abkühlen nach einem Tag auf dem Hof.',
          foto: 'Foto: Freibad',
        },
        {
          titel: 'Kantine in der alten Molkerei',
          tekst: 'Mit einem kleinen Laden voller Produkte von Bauern aus der Region.',
          foto: 'Foto: die alte Molkerei',
        },
      ],
    },
    plekadvies: {
      eyebrow: 'Platztipp',
      titel: 'Welcher Platz passt zu euch?',
      tekst:
        'Das Huhn stellt fünf kurze Fragen und zeigt die drei besten freien Plätze. In einer halben Minute.',
    },
    evenementen: {
      eyebrow: 'Veranstaltungen',
      titel: 'Demnächst auf dem Hof',
    },
    vindons: {
      titel: 'So findest du uns',
      adresLabel: 'Adresse',
      adres: 'Groene Weide 1\n1234 AB Weideveen',
      tijdenLabel: 'Rezeption geöffnet',
      tijden: 'Jeden Tag 08:00 – 20:00',
      seizoen: 'Geöffnet vom 1. April bis 31. Oktober',
      kaart: 'Karte mit Route',
    },
  },

  terrein: {
    titel: 'Was kannst du hier machen?',
    intro:
      'Alles auf dem Hof ist in zwei Minuten zu Fuß erreichbar. Unten siehst du, was es gibt – und für wen.',
    tip: 'Tipp: Das ganze Dorf ist mit dem Fahrrad in zehn Minuten erledigt. Fahrräder stehen an der Rezeption.',
    filterLabel: 'Hof filtern',
    filters: {
      alles: 'Alles',
      dieren: 'Tiere',
      water: 'Wasser',
      spelen: 'Spielen',
      eten: 'Essen & Trinken',
      sanitair: 'Sanitär',
    },
    plekken: [
      {
        titel: 'Die Hühner',
        tekst:
          'Jeden Morgen um neun darfst du mit Eier sammeln. Die Hühner laufen frei über den Hof und lieben Kinder mit einer Handvoll Korn.',
        foto: 'Foto: die Hühnerwiese',
        filter: 'dieren',
        label: 'Jeden Tag · 09:00',
      },
      {
        titel: 'Spielwiese mit Traktor',
        tekst:
          'Eine große Wiese mit einem echten alten Traktor zum Klettern, einer Schaukel und viel Platz zum Rennen.',
        foto: 'Foto: Spielwiese mit Traktor',
        filter: 'spelen',
        label: 'Ganztägig offen',
      },
      {
        titel: 'Freibad',
        tekst:
          'Von Mai bis September beheizt. Ein flacher Teil für die Kleinen, und abends ruhiges Wasser für alle, die entspannt schwimmen.',
        foto: 'Foto: Freibad',
        filter: 'water',
        label: 'Mai – September',
      },
      {
        titel: 'Kantine in der alten Molkerei',
        tekst:
          'Kaffee, Brötchen und Suppe von dem, was der Hof an diesem Tag hat. Mittwochs gibt es ein warmes Essen.',
        foto: 'Foto: die alte Molkerei',
        filter: 'eten',
        label: '08:00 – 20:00',
      },
      {
        titel: 'Der kleine Laden',
        tekst:
          'Eier, Käse, Honig und Marmelade von Bauern aus der Nachbarschaft. Bezahlen geht mit Karte, Bargeld kommt in ein kleines Glas.',
        foto: 'Foto: der kleine Laden',
        filter: 'eten',
        label: 'An der Rezeption',
      },
      {
        titel: 'Sanitär & Waschraum',
        tekst:
          'Warmes Wasser, zwei Familienduschen, eine Waschmaschine und ein Platz, um deine Stiefel abzuspritzen.',
        foto: 'Foto: Sanitär',
        filter: 'sanitair',
        label: 'Warmes Wasser, 24 Stunden',
      },
    ],
    rolstoel: {
      titel: 'Rollstuhl oder Kinderwagen?',
      tekst:
        'Die meisten Wege auf dem Hof sind befestigt und breit genug. Zur Spielwiese führt ein Grasweg – bei nassem Wetter mit dem Rollstuhl weniger schön.',
      link: 'Alles auf der Seite zur Barrierefreiheit ansehen',
    },
    cta: {
      titel: 'Lust bekommen?',
      tekst:
        'Buche deinen Platz auf der Wiese. Eine E-Mail-Adresse genügt, ein Konto ist nicht nötig.',
    },
  },

  plattegrond: {
    titel: 'Erkunde den Hof',
    intro:
      'Klicke auf einen Ort auf der Karte und entdecke, was wo ist. Ein gelber Punkt zeigt, wie viele Aktivitäten es an diesem Tag gibt.',
    fotoAlt: 'Foto von {plek}',
    doenKop: 'Was du hier machen kannst',
    feitenKop: 'Gut zu wissen',
    kaart: {
      weg: 'Provinzstraße',
      kiesLabel: 'Wähle einen Ort auf der Karte',
      svgTitel:
        'Lageplan von De Groene Weide. Nutze die Schaltflächen unter der Karte, um einen Ort zu wählen.',
      hint: 'Wische zur Seite, um den ganzen Plan zu sehen, oder wähle unten einen Ort.',
      paneelLabel: 'Über diesen Ort',
      zoneAantalEen: ', 1 Aktivität auf dem Programm',
      zoneAantal: ', {aantal} Aktivitäten auf dem Programm',
    },
    zones: {
      woonhuis: {
        kort: 'Rezeption',
        label: 'Wohnhaus + Rezeption',
        tag: 'Hier beginnt dein Aufenthalt',
        titel: 'Wohnhaus & Rezeption',
        tekst:
          'Hier wohnt Bert und hier meldest du dich bei der Ankunft an. Die Rezeption ist die Anlaufstelle für Fragen, Brötchen und Tipps für die Umgebung.',
        doen: [
          {
            titel: 'Rundgang über den Hof mit Bert',
            detail: 'Wie lief ein Milchviehbetrieb? Bert erzählt, und Kinder dürfen alles fragen.',
          },
          {
            titel: 'Brötchen bestellen',
            detail: 'Am Abend vorher bestellen, um 08:00 bringt der Bäcker sie',
          },
          { titel: 'Tipps für die Umgebung', detail: 'Rad- und Wanderwege in der Nähe' },
        ],
        feiten: [
          'Rezeption geöffnet von 09:00 bis 20:00',
          'Check-in ab 13:00, Check-out vor 11:00',
          'Guter Handyempfang auf dem Hof',
        ],
      },
      kampeerveld: {
        kort: 'Zeltwiese',
        label: 'Zeltwiese',
        tag: '40 Plätze für Zelt oder Wohnwagen',
        titel: 'Zeltwiese',
        tekst:
          'Geräumige Plätze auf dem Gras, mit dem Hof im Rücken und Wiesen vor dir. Die größte Wiese auf De Groene Weide.',
        doen: [
          { titel: 'Frühstück im Gras', detail: 'Mit frischen Brötchen vom Bäcker' },
          { titel: 'Sterne schauen', detail: 'Weit von der Stadt ist es nachts wirklich dunkel' },
          { titel: 'Spielen auf der Spielwiese', detail: 'Ein paar Minuten zu Fuß' },
        ],
        feiten: [
          'Zelt oder Wohnwagen, bis 6 Personen pro Platz',
          'Sanitär in Gehweite',
          'Handyempfang ist hier begrenzt',
        ],
      },
      camperveld: {
        kort: 'Wohnmobilwiese',
        label: 'Wohnmobilwiese',
        tag: '12 Stellplätze',
        titel: 'Wohnmobilwiese',
        tekst:
          'Eine eigene Wiese, nur für Wohnmobile. Du fährst über den Mittelweg direkt hin; das Sanitärgebäude liegt gleich um die Ecke.',
        doen: [
          { titel: 'Direkt zum Platz fahren', detail: 'Über den Mittelweg' },
          { titel: 'Duschen um die Ecke', detail: 'Das Sanitärgebäude liegt direkt unterhalb der Wiese' },
          {
            titel: 'Einkaufen bei den Nachbarn',
            detail: 'Der kleine Laden in der alten Molkerei ist zu Fuß erreichbar',
          },
        ],
        feiten: [
          'Eigene Wiese, nur für Wohnmobile',
          'Bis 6 Personen pro Platz',
          'Handyempfang ist hier begrenzt',
        ],
      },
      achterste: {
        kort: 'Safari-Zelte',
        label: 'Hintere Wiese',
        tag: '8 fertige Safari-Zelte',
        titel: 'Hintere Wiese',
        tekst:
          'Der ruhigste Winkel des Hofs, weit weg von der Straße. Hier stehen die Safari-Zelte: du musst nur dich selbst mitbringen.',
        doen: [
          { titel: 'Sterne schauen', detail: 'Der dunkelste und stillste Platz auf dem Hof' },
          {
            titel: 'Frühstück auf der Veranda',
            detail: 'Jedes Zelt hat eine Küchenecke und eine überdachte Veranda',
          },
          { titel: 'Ausschlafen', detail: 'Weit von der Straße, also herrlich ruhig' },
        ],
        feiten: [
          'Betten stehen bereit, keine Campingausrüstung nötig',
          'Bis 5 Personen pro Zelt',
          'Handyempfang ist hier begrenzt',
        ],
      },
      melkstal: {
        kort: 'Alte Molkerei',
        label: 'Alte Molkerei',
        tag: 'Kantine & kleiner Laden',
        titel: 'Die alte Molkerei',
        tekst:
          'Wo früher jeden Morgen und Abend gemolken wurde, trinkst du jetzt Kaffee oder ein kaltes Bier. Der kleine Laden verkauft Produkte von Bauern aus der Nachbarschaft.',
        doen: [
          { titel: 'Ein Getränk in der Kantine', detail: 'Kaffee tagsüber, ein kaltes Bier am Abend' },
          { titel: 'Einkaufen im kleinen Laden', detail: 'Produkte von Bauern aus der Nachbarschaft' },
          {
            titel: 'Sehen, wo gemolken wurde',
            detail: 'Hier standen früher jeden Morgen und Abend die Kühe',
          },
        ],
        feiten: ['Ein guter Platz bei Regen', 'Handyempfang ist hier begrenzt'],
      },
      sanitair: {
        kort: 'Sanitär',
        label: 'Sanitärgebäude',
        tag: 'Sauber und nah',
        titel: 'Sanitärgebäude',
        tekst:
          'Zentral auf dem Gelände, also von jedem Platz schnell erreichbar. Auch der Waschraum ist hier.',
        doen: [
          { titel: 'Duschen', detail: '12 Duschen und 14 Toiletten' },
          { titel: 'Wäsche waschen', detail: 'Waschraum mit Waschmaschinen' },
        ],
        feiten: ['Zentral auf dem Gelände', 'Von jedem Platz schnell erreichbar'],
      },
      zwembad: {
        kort: 'Freibad',
        label: 'Freibad',
        tag: 'Abkühlung nach einem heißen Tag',
        titel: 'Freibad',
        tekst:
          'Ein Freibad mit Liegestühlen, neben dem Sanitärgebäude. Die Öffnungszeiten erfährst du an der Rezeption.',
        doen: [
          { titel: 'Schwimmen', detail: 'Abkühlung nach einem heißen Tag' },
          { titel: 'In der Sonne liegen', detail: 'Rund um das Becken stehen Liegestühle' },
        ],
        feiten: ['Öffnungszeiten an der Rezeption', 'Direkt neben der Spielwiese'],
      },
      speelweide: {
        kort: 'Spielwiese',
        label: 'Spielwiese',
        tag: 'Platz zum Rennen',
        titel: 'Spielwiese',
        tekst:
          'Eine große Wiese mit Schaukeln, einer Rutsche und einem Sandkasten. Im Juli und August organisiert das Animationsteam hier Spiele.',
        doen: [
          { titel: 'Schaukeln, Rutschen und Sandburgen bauen', detail: 'Für die Kleinen' },
          { titel: 'Spiele mit dem Animationsteam', detail: 'Im Juli und August' },
          { titel: 'Rennen und Spielen im Gras', detail: 'Eine große Wiese, weit weg von den Autos' },
        ],
        feiten: ['Autofrei, also sicheres Spielen', 'Freibad und Sanitär sind gleich nebenan'],
      },
      parkeerplaats: {
        kort: 'Parkplatz',
        label: 'Parkplatz',
        tag: 'Autos am Rand',
        titel: 'Parkplatz',
        tekst:
          'Nach dem Ausladen parkst du hier. So bleibt das Gelände ruhig und sicher für spielende Kinder.',
        doen: [],
        feiten: [
          'Direkt neben dem Eingang',
          'Erst am Platz ausladen, dann hier parken',
          'So bleibt das Gelände fast autofrei',
        ],
      },
      ingang: {
        kort: 'Eingang',
        label: 'Eingang / Tor',
        tag: 'An der Provinzstraße',
        titel: 'Eingang',
        tekst:
          'Hier fährst du auf den Hof. Kommst du nach der Schließzeit der Rezeption an? Sag uns vorher Bescheid, dann finden wir eine Lösung.',
        doen: [],
        feiten: [
          'Anreise ab 13:00',
          'Rezeption direkt links nach dem Eingang',
          'Späte Anreise? Melde dich vorher',
        ],
      },
    },
    cta: {
      kampeerplek: 'Buche einen Zeltplatz',
      camperplek: 'Buche einen Wohnmobilstellplatz',
      safaritent: 'Buche ein Safari-Zelt',
    },
    programma: {
      kop: 'Auf dem Programm',
      dicht: 'Der Campingplatz ist jetzt geschlossen. Als Beispiel siehst du das Programm ab {datum}.',
      demo:
        'Demo: Anmeldungen werden nur in diesem Browser gespeichert und die freien Plätze sind ein Beispiel.',
      vandaag: 'Heute',
      morgen: 'Morgen',
      dagKies: 'Wähle einen Tag',
      leegVandaag: 'Heute steht hier nichts auf dem Programm.',
      leegMorgen: 'Morgen steht hier nichts auf dem Programm.',
      leegOp: 'Am {datum} steht hier nichts auf dem Programm.',
      vrij: 'Nur noch {aantal} Platz frei',
      vrijMeer: 'Noch {aantal} Plätze frei',
      vol: 'Voll',
      bezig: 'Hat schon begonnen',
      afgelopen: 'Vorbei',
      tot: 'bis {tijd}',
      aanmelden: 'Anmelden',
      aanmeldenVoor: 'Anmelden für {titel}',
      afmelden: 'Abmelden',
      jeStaatErOp: 'Du stehst mit {aantal} Person auf der Liste.',
      jeStaatErOpMeer: 'Du stehst mit {aantal} Personen auf der Liste.',
      naam: 'Dein Name',
      personen: 'Personen',
      bevestig: 'Anmeldung bestätigen',
      annuleer: 'Abbrechen',
      foutNaam: 'Bitte gib deinen Namen ein, damit das Team weiß, wer kommt.',
      aangemeld: 'Du bist für {titel} mit {aantal} Person angemeldet.',
      aangemeldMeer: 'Du bist für {titel} mit {aantal} Personen angemeldet.',
      afgemeld: 'Deine Anmeldung für {titel} ist abgesagt.',
      activiteit: {
        erfwandeling: {
          titel: 'Rundgang über den Hof mit Bert',
          detail: 'Treffpunkt an der Rezeption. Bert erzählt, wie der Milchviehbetrieb funktionierte.',
        },
        fietstocht: {
          titel: 'Radtour zu den Nachbarn',
          detail: 'Eine Runde zu Bauern aus der Nachbarschaft. Bring dein eigenes Rad mit.',
        },
        speurtocht: {
          titel: 'Schnitzeljagd über den Hof',
          detail: 'Für Kinder, Eltern dürfen mitsuchen.',
        },
        animatie: {
          titel: 'Spielnachmittag mit dem Animationsteam',
          detail: 'Spiele auf der Spielwiese für Jung und Alt.',
        },
        watergym: {
          titel: 'Wassergymnastik',
          detail: 'Sanfte Bewegung im Freibad.',
        },
        proeverij: {
          titel: 'Verkostung aus dem kleinen Laden',
          detail: 'Probiere Produkte von Bauern aus der Nachbarschaft.',
        },
        boerenquiz: {
          titel: 'Bauernquiz in der Kantine',
          detail: 'Wie viele Liter Milch gibt eine Kuh am Tag? Spiel in Teams mit.',
        },
        sterren: {
          titel: 'Gemeinsam Sterne schauen',
          detail: 'Bring eine Decke und einen warmen Pullover mit.',
        },
      },
    },
    weides: {
      a: 'Wiese A · T1–T24',
      b: 'Wiese B · T25–T48',
      c: 'Stellplätze C1–C12',
      s: 'Safari-Zelte S1–S8',
    },
    plekDetails: {
      foto: 'Foto von',
      voorzieningen: 'Ausstattung',
      beschikbaar: 'Verfügbar',
      boekDeze: 'Diesen Platz buchen',
      afstand: 'Entfernung zu Sanitär',
      tip: 'Tipp vom Huhn: Auf diesem Platz hörst du morgens die Hühner als erstes.',
    },
    voorzieningen: {
      kippenwei: {
        naam: 'Hühnerwiese',
        kort: 'Hühner',
        tekst:
          'Jeden Morgen um neun dürfen Gäste mit Eier sammeln. Die Hühner laufen frei herum und sind nicht schüchtern.',
        tip: 'Kommst du mit kleinen Kindern? Um 09:00 ist hier am meisten los.',
      },
      melkstal: {
        naam: 'Kantine in der alten Molkerei',
        kort: 'Kantine',
        tekst:
          'Kaffee, Brötchen und Suppe von dem, was der Hof an diesem Tag hat. Mittwochs ein warmes Essen.',
        tip: 'Die Molkerei ist bei Regen der trockenste Platz.',
      },
      sanitair: {
        naam: 'Sanitär & Waschraum',
        kort: 'Sanitär',
        tekst:
          'Warmes Wasser, zwei Familienduschen, barrierefreie Toilette, Waschmaschine und ein Wasserhahn zum Stiefelspülen.',
        tip: 'Zwischen 07:00 und 08:00 ist es hier ruhig.',
      },
      zwembad: {
        naam: 'Freibad',
        kort: 'Freibad',
        tekst:
          'Von Mai bis September beheizt, mit einem flachen Teil für die Kleinen und abends ruhigem Wasser.',
        tip: 'Freitags um 17:00 ist die Schwimmstunde mit dem Bauern.',
      },
      receptie: {
        naam: 'Rezeption & kleiner Laden',
        kort: 'Rezeption',
        tekst:
          'Einchecken, Fragen und der kleine Laden mit Eiern, Käse, Honig und Marmelade von Bauern aus der Nachbarschaft.',
        tip: 'Hier stehen auch die Fahrräder, die du kostenlos ausleihen kannst.',
      },
      speelweide: {
        naam: 'Spielwiese mit Traktor',
        kort: 'Spielwiese',
        tekst:
          'Eine Wiese mit einem alten Traktor zum Klettern, einer Schaukel und Platz zum Rennen.',
        tip: 'Die Plätze T1 bis T6 liegen am weitesten entfernt.',
      },
    },
  },

  evenementen: {
    titel: 'Was ist auf dem Hof los?',
    intro:
      'Alles ist kostenlos, und du musst dich nur kurz bei den Hühnern melden. Bei Regen ziehen wir in die Molkerei um.',
    week: 'Diese Woche',
    filterLabel: 'Art der Aktivität',
    filters: {
      alles: 'Alles',
      dieren: 'Tiere',
      spelen: 'Spielen',
      water: 'Wasser',
      eten: 'Essen',
    },
    dagen: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    agendaTitel: 'Der Kalender dieser Woche',
    meedoen: 'Mitmachen',
    niets: 'An diesem Tag ist nichts geplant. Ein guter Moment für einen Spaziergang.',
    soorten: {
      dieren: 'Tiere',
      spelen: 'Spielen',
      water: 'Wasser',
      eten: 'Essen',
    },
    animaties: {
      eyebrow: 'Veranstaltung · Animationsteam',
      titel: 'Der Film des Animationsteams',
      intro:
        'Unser Animationsteam hat einen kurzen Zeichentrickfilm über den Hof gemacht. Klicke auf die Karte, um die Vorschau zu öffnen.',
      bekijk: 'Vorschau ansehen',
      seconden: 'Sekunden',
      sluiten: 'Schließen',
      opnieuw: 'Noch einmal',
      nieuwTabblad: 'In einem neuen Tab öffnen',
      rust: 'Der Ruhemodus ist an, deshalb steht der Film still. Starte ihn unten selbst.',
      start: 'Film starten',
      films: {
        'de-boerderij': {
          label: 'Film',
          titel: 'Kurzfilm: der Bauernhof',
          beschrijving:
            'Das Huhn, der Traktor, ein Ufo und ein Wecker: Auf dem Hof ist immer etwas los. Eine Runde dauert 71 Sekunden, dann beginnt alles von vorn.',
        },
      },
    },
    list: [
      {
        dag: 0,
        tijd: '09:00',
        titel: 'Hühner füttern',
        locatie: 'Hühnerwiese',
        leeftijd: 'Alle Altersgruppen',
        soort: 'dieren',
      },
      {
        dag: 0,
        tijd: '17:00',
        titel: 'Molkerei-Suppe',
        locatie: 'Kantine',
        leeftijd: 'Alle Altersgruppen',
        soort: 'eten',
      },
      {
        dag: 1,
        tijd: '10:30',
        titel: 'Eier sammeln',
        locatie: 'Hühnerwiese',
        leeftijd: '4+',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '09:00',
        titel: 'Hühner füttern',
        locatie: 'Hühnerwiese',
        leeftijd: 'Alle Altersgruppen',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '15:00',
        titel: 'Traktor-Tour mit Bert',
        locatie: 'Spielwiese',
        leeftijd: '4+',
        soort: 'spelen',
      },
      {
        dag: 3,
        tijd: '19:30',
        titel: 'Ruhiges Schwimmen',
        locatie: 'Freibad',
        leeftijd: 'Alle Altersgruppen',
        soort: 'water',
      },
      {
        dag: 4,
        tijd: '09:00',
        titel: 'Hühner füttern',
        locatie: 'Hühnerwiese',
        leeftijd: 'Alle Altersgruppen',
        soort: 'dieren',
      },
      {
        dag: 4,
        tijd: '17:00',
        titel: 'Schwimmstunde',
        locatie: 'Freibad',
        leeftijd: 'Alle Altersgruppen',
        soort: 'water',
      },
      {
        dag: 5,
        tijd: '11:00',
        titel: 'Brot backen',
        locatie: 'Kantine',
        leeftijd: '6+',
        soort: 'eten',
      },
      {
        dag: 6,
        tijd: '10:00',
        titel: 'Spaziergang mit dem Bauern',
        locatie: 'Start an der Rezeption',
        leeftijd: 'Alle Altersgruppen',
        soort: 'spelen',
      },
    ],
    cta: {
      titel: 'Nichts verpasst?',
      tekst: 'Der Kalender für die nächste Woche steht jeden Freitag hier.',
      knop: 'Melde dich für den Newsletter an',
    },
  },

  overOns: {
    titel: 'Vom Milchbauern zum Campingbauern',
    intro:
      'Bert hat die Kühe abgeschafft und die Weiden für Zelte hergerichtet. Die alte Molkerei wurde Kantine, die Heuscheune wurde Sanitärraum.',
    verhaal: {
      titel: 'Die Geschichte des Hofes',
      alineas: [
        'Als 2011 die letzte Kuh den Stall verließ, stand Bert mit einem leeren Hof da. Seine Tochter schlug vor, ein paar Zelte daraufzustellen. Im Juli jenes Jahres standen sechs.',
        'Seitdem ist der Campingplatz auf achtundvierzig Plätze, zwei Safari-Zelte und zwölf Stellplätze gewachsen. Die Hühner sind geblieben, der Traktor auch.',
        'Wir wollen nicht größer werden, sondern ruhiger. Deshalb gibt es kein WLAN auf den Stellplätzen, keine Musik in der Kantine und einen stillen Abend pro Woche.',
      ],
    },
    waarden: {
      titel: 'Wofür wir stehen',
      punten: [
        {
          titel: 'Bewusst klein',
          tekst: 'Höchstens fünfzig Plätze, kein Animationsteam und keine Lautsprecher.',
        },
        {
          titel: 'Aus der Nachbarschaft',
          tekst: 'Brot, Käse und Gemüse kommen aus dem Dorf, nicht aus einem Lastwagen.',
        },
        {
          titel: 'Für alle',
          tekst: 'Befestigte Wege, großzügige Plätze und ein Ruheknopf auf jeder Seite.',
        },
      ],
    },
    team: {
      titel: 'Das Team',
      leden: [
        {
          naam: 'Bert',
          rol: 'Bauer',
          tekst: 'Kennt jedes Huhn beim Namen und fährt mittwochs den Traktor.',
          foto: 'Foto: Bert',
        },
        {
          naam: 'Monique',
          rol: 'Rezeption & Verwaltung',
          tekst: 'Regelt deine Buchung und weiß, wo der beste Kaffee ist.',
          foto: 'Foto: Monique',
        },
        {
          naam: 'Jesse',
          rol: 'Hof & Sanitär',
          tekst: 'Sorgt dafür, dass das Freibad sauber ist und die Duschen warm.',
          foto: 'Foto: Jesse',
        },
      ],
      jijTitel: 'Und du?',
      jijTekst:
        'Du bist kein Gast, du wohnst hier eine Weile. Räum deinen Platz auf, wenn du gehst – dann freut sich der Nächste.',
    },
    cta: {
      titel: 'Erlebe es selbst',
      tekst: 'Eine Nacht zwischen den Hühnern sagt mehr als eine Geschichte.',
      primair: 'Sichere dir deinen Platz auf der Wiese',
      secundair: 'Nachricht senden',
    },
  },

  contact: {
    titel: 'Frag einfach',
    intro: 'Weißt du etwas nicht? Ruf an, schreib eine Mail oder nutze das Formular unten. Meist antworten wir noch am selben Tag.',
    form: {
      naam: 'Name',
      email: 'E-Mail-Adresse',
      onderwerp: 'Worum geht es?',
      onderwerpen: ['Eine Buchung', 'Eine Frage', 'Eine Beschwerde', 'Etwas anderes'],
      bericht: 'Deine Nachricht',
      berichtHint: 'Nenne deine Buchungsnummer, wenn du eine hast.',
      akkoord: 'Du darfst mir zu meiner Frage eine E-Mail schicken.',
      versturen: 'Frage abschicken',
      succes: 'Deine Nachricht ist unterwegs. Wir melden uns innerhalb eines Werktages.',
    },
    direct: {
      titel: 'Direkter Kontakt',
      telefoon: 'Telefon',
      email: 'E-Mail',
      post: 'Postanschrift',
    },
    receptie: {
      titel: 'Rezeption geöffnet',
      week: 'Montag bis Freitag',
      weekend: 'Samstag und Sonntag',
      feestdagen: 'Feiertage',
    },
    faq: {
      titel: 'Häufige Fragen',
      vragen: [
        {
          vraag: 'Darf mein Hund mit?',
          antwoord:
            'Auf den eigens dafür ausgewiesenen Plätzen T41 bis T48 ist ein Hund willkommen, an der Leine. Im Freibad und bei den Hühnern nicht.',
        },
        {
          vraag: 'Ab wann kann ich einchecken?',
          antwoord:
            'Von 14:00 bis 20:00. Kommst du später? Ruf kurz an, dann legt die Rezeption den Schlüssel bereit.',
        },
        {
          vraag: 'Gibt es WLAN auf dem Campingplatz?',
          antwoord:
            'An der Rezeption und in der Kantine ja. Auf den Stellplätzen bewusst nicht.',
        },
        {
          vraag: 'Kann ich meine eigene Bettwäsche mitbringen?',
          antwoord:
            'Ja. Unsere Safari-Zelte haben Bettdecken, du darfst aber auch deinen eigenen Schlafsack mitbringen.',
        },
      ],
    },
  },

  voettekst: {
    linkLabel: 'Barrierefreiheit',
    titel: 'Barrierefreiheit auf De Groene Weide',
    intro:
      'Wir möchten, dass sich jeder Gast hier wohlfühlt. Unten liest du genau, was geht und was nicht. Etwas fehlt? Ruf an oder schreib uns, dann finden wir eine Lösung.',
    onderdelenTitel: 'Auf dem Gelände',
    onderdelen: [
      { plek: 'Sanitär', bereikbaar: 'Befestigter Weg', voorziening: 'Behindertentoilette', opmerking: 'Drehtür, 90 cm breit' },
      { plek: 'Kantine', bereikbaar: 'Schwellenlos', voorziening: 'Rollstuhlgerecht', opmerking: 'Kartenzahlung an der Theke' },
      { plek: 'Hühnerwiese', bereikbaar: 'Grasweg', voorziening: 'Teilweise zugänglich', opmerking: 'Bei nassem Wetter matschig' },
      { plek: 'Freibad', bereikbaar: 'Treppe mit Geländer', voorziening: 'Kein Lift', opmerking: 'Dafür ein flaches Becken' },
      { plek: 'Spielwiese', bereikbaar: 'Gras', voorziening: 'Gleicher Weg wie zur Hühnerwiese', opmerking: 'Kinderwagen geht gerade noch' },
      { plek: 'Rezeption', bereikbaar: 'Schwellenlos', voorziening: 'Ruheplatz und Wasser', opmerking: 'Auch ein „setz dich doch kurz hin“-Stuhl' },
    ],
    kolommen: { plek: 'Ort', bereikbaar: 'Erreichbar', voorziening: 'Ausstattung', opmerking: 'Achtung' },
    vragenTitel: 'Kann ich …?',
    vragen: [
      {
        vraag: 'Kann ich einen Rollstuhl ausleihen?',
        antwoord: 'Nein, aber der Leihdienst im Dorf hat zwei. Die Rezeption ruft für dich an.',
      },
      {
        vraag: 'Gibt es ruhige Plätze?',
        antwoord:
          'Ja. Die Plätze T1 bis T6 liegen am weitesten von der Spielwiese und dem Freibad entfernt.',
      },
      {
        vraag: 'Lässt sich die Seite vorlesen?',
        antwoord:
          'Ja. Der Ruheknopf stoppt alle Bewegungen, und die Seite funktioniert mit jeder Vorlesefunktion deines Geräts.',
      },
    ],
  },

  nieuwsbrief: {
    titel: 'Newsletter & Tipps',
    intro: 'Eine Mail pro Monat. Was auf dem Hof passiert, und ein Tipp, wie das Bauernhofleben zu Hause schmeckt.',
    veld: 'Deine E-Mail-Adresse',
    knop: 'Anmelden',
    akkoord: 'Ich weiß, dass ich mich jederzeit wieder abmelden kann.',
    succes: 'Du stehst auf der Liste. Die erste Mail kommt Anfang nächsten Monats.',
    tip: 'Diesen Monat: Was du mit einer Kiste Eier und einem Sack Mehl ohne Ofen hinbekommst.',
  },

  privacy: {
    titel: 'Datenschutz & Cookies',
    intro:
      'Kurz und ehrlich: Wir speichern, was wir für deine Buchung brauchen, und nichts darüber hinaus.',
    alineas: [
      'Bei einer Buchung speichern wir deinen Namen, deine E-Mail-Adresse, deine Telefonnummer und die Daten. Diese Angaben löschen wir drei Monate nach deinem Aufenthalt.',
      'Wir verwenden keine Werbe-Cookies und verkaufen nichts weiter. Besucherzahlen messen wir ohne Cookies.',
      'Die Karte auf den Seiten Lageplan und Kontakt kommt von Google. Sie lädt erst, nachdem du zugestimmt hast.',
    ],
    contactTitel: 'Fragen zu deinen Daten?',
    contactTekst: 'Schreib der Rezeption eine Mail. Wir antworten innerhalb von vier Wochen.',
  },

  nietGevonden: {
    fout: 'Fehler 404',
    titel: 'Diese Kuh ist ausgebüxt.',
    tekst:
      'Die Seite, die du gesucht hast, steht nicht mehr auf der Wiese. Vielleicht ist sie umgezogen, oder jemand hat das Tor offen stehen lassen.',
    terug: 'Zurück zum Hof',
  },

  reserveren: {
    titel: 'Buche deinen Platz',
    intro: 'Sieben kurze Schritte. Du kannst jederzeit zurück.',
    stapVan: 'Schritt {stap} von 7',
    stappen: [
      'Datum',
      'Personen & Wünsche',
      'Platzmatch',
      'Platz wählen',
      'Daten',
      'Prüfen',
      'Bestätigung',
    ],
    stap1: {
      titel: 'Wann kommst du zu Besuch?',
      intro: 'Wähle Anreise und Abreise. Wochen mit einem Strich sind ausgebucht.',
      aankomst: 'Anreise',
      vertrek: 'Abreise',
      kiesDatum: 'Wähle deine Anreise',
      jouwKeuze: 'Deine Auswahl',
      nachten: 'Nächte',
      nacht: 'Nacht',
      volgeboekt: 'Ausgebucht',
      beschikbaar: 'Noch frei',
      volgend: 'Die besten Plätze ansehen',
    },
    stap2: {
      titel: 'Wer kommt mit, und wo schläfst du?',
      personen: 'Personen',
      volwassenen: 'Erwachsene',
      kinderen: 'Kinder',
      volwassenenHint: 'Ab 18 Jahren',
      kinderenHint: 'Bis 18 Jahre',
      slapen: 'Schlafen in',
      wens: 'Dein kleiner Wunsch?',
      wensen: {
        stroom: 'Strom',
        rustig: 'Ruhig',
        sanitair: 'Sanitär in der Nähe',
        schaduw: 'Schatten',
        speelweide: 'Nahe der Spielwiese',
      },
      volgend: 'Die besten Plätze ansehen',
      soorten: {
        tent: 'Zelt',
        camper: 'Wohnmobil',
        safaritent: 'Safari-Zelt',
      },
      soortUitleg: {
        tent: 'Eigenes Zelt, eigener Grasplatz.',
        camper: 'Befestigter Platz mit Strom und Abwasser.',
        safaritent: 'Unser Zelt mit Betten, fertig zum Einziehen.',
      },
    },
    stap3: {
      titel: 'Das Huhn hat drei Tipps für dich',
      intro: 'Auf Basis deiner Wünsche. Der erste passt meistens am besten.',
      tip: 'Tipp',
      match: 'Match',
      waarom: 'Warum dieser',
      kies: 'Diesen wählen',
      bekijkAlles: 'Alles auf der Karte ansehen',
      opnieuw: 'Wünsche anpassen',
      tips: {
        stroom: 'hat Strom',
        rustig: 'liegt ruhig',
        sanitair: 'nah bei Sanitär',
        schaduw: 'hat Schatten',
        speelweide: 'nah bei der Spielwiese',
      },
    },
    stap4: {
      titel: 'Wähle deinen Platz auf der Wiese',
      kaart: 'Karte',
      lijst: 'Liste',
      aankomst: 'Anreise',
      vertrek: 'Abreise',
      personen: 'Personen',
      wens: 'Art des Wunsches',
      legendaTitel: 'Legende',
      tipVanDeKip: 'Tipp vom Huhn',
      reserveer: 'Weiter zu deinen Daten',
      geenAccount: 'Kein Konto nötig. Eine E-Mail-Adresse genügt, um deine Buchung zu speichern.',
      alAccount: 'Hast du schon ein Konto?',
      houdVast: 'Das Huhn hält diesen Platz 15 Minuten für dich warm.',
      nachten: 'Nächte',
      status: {
        vrij: 'Frei',
        bezet: 'Belegt',
        geblokkeerd: 'Gesperrt',
        keuze: 'Deine Wahl',
        tip: 'Tipp',
      },
      voorzieningenTitels: {
        stroom: 'Strom',
        ondergrond: 'Boden',
        vlak: 'Eben',
        water: 'Wasser',
        rustig: 'Ruhig',
        maxPersonen: 'Max. Personen',
        afstand: 'Entfernung zu Sanitär',
      },
    },
    stap5: {
      titel: 'Auf welchen Namen darf es laufen?',
      intro: 'Nur was wir brauchen. Kein Konto, kein Passwort.',
      plek: 'Platz',
      naam: 'Name',
      email: 'E-Mail-Adresse',
      telefoon: 'Telefonnummer',
      adres: 'Adresse',
      postcode: 'Postleitzahl',
      plaats: 'Ort',
      land: 'Land',
      opmerking: 'Etwas, das wir wissen müssen?',
      opmerkingHint: 'Zum Beispiel ein Hund, ein Rollstuhl oder eine späte Anreise.',
      akkoord: 'Ich stimme den Bedingungen und der Datenschutzerklärung zu.',
      voorwaarden: 'Bedingungen',
      privacy: 'Datenschutzerklärung',
      volgende: 'Weiter zum Prüfen',
      selectie: 'Deine Auswahl',
      verplicht: 'Bitte Namen und E-Mail-Adresse ausfüllen.',
      verplichtAkkoord: 'Bitte den Bedingungen zustimmen, um weiterzugehen.',
    },
    stap6: {
      titel: 'Stimmt alles?',
      intro: 'Ein letzter Blick. Danach läuft der Platz auf deinen Namen.',
      wie: 'Wer',
      wanneer: 'Wann',
      waar: 'Wo',
      wat: 'Was',
      betalen: 'Später zahlen',
      betalenUitleg: 'Du zahlst bei der Ankunft an der Rezeption. Stornieren ist bis 48 Stunden vorher möglich.',
      totaal: 'Gesamt',
      reserveer: 'Jetzt reservieren',
      wijzig: 'Ändern',
      voorwaardenKort: 'Mit der Reservierung stimmst du den Bedingungen zu.',
    },
    stap7: {
      titel: 'Gebucht! Platz {plek} gehört euch.',
      intro: 'Du bekommst eine Mail mit allen Angaben. Bis bald auf dem Hof.',
      nummer: 'Buchungsnummer',
      nu: 'Und jetzt?',
      gemaild: 'Ich habe es schon per Mail geschickt',
      planRoute: 'Route planen',
      ical: 'In den Kalender eintragen',
      handig: 'Gut zu wissen',
      tips: [
        'Einchecken ist ab 14:00 an der Rezeption möglich.',
        'Bring Stiefel mit, der Hof ist morgens nass.',
        'Hühner füttern ist jeden Tag um 09:00.',
      ],
      naarMijn: 'Meine Buchung ansehen',
    },
    netBezet: {
      titel: 'Hoppla, Platz {plek} ist gerade weg.',
      tekst:
        'Jemand war schneller als du. Das Huhn hat schon zwei andere Plätze für dich klaargelegt.',
      alternatief: 'Alternativen ansehen',
      opnieuw: 'Selbst einen anderen Platz wählen',
    },
    mijnereservering: {
      titel: 'Noch {nachten} Nächte schlafen',
      intro: 'Alles, was du für deinen Aufenthalt brauchst.',
      gegevens: 'Deine Daten',
      aankomst: 'Anreise',
      vertrek: 'Abreise',
      plek: 'Platz',
      annuleren: 'Buchung stornieren',
      wijzigen: 'Daten ändern',
      route: 'Route planen',
      watMee: 'Was du mitnehmen kannst',
      mee: ['Stiefel', 'Eine Taschenlampe', 'Handtücher', 'Eigene Bettwäsche ist erlaubt'],
      aankomstInfo:
        'Einchecken ab 14:00 an der Rezeption. Kommst du nach 20:00? Ruf kurz an.',
      geen: 'Wir konnten diese Buchung nicht finden. Stimmt der Link?',
    },
    aankomstdag: {
      titel: 'Heute willkommen!',
      tekst: 'Dein Platz ist fertig. Melde dich an der Rezeption, dann zeigt dir der Bauer den Weg.',
      receptie: 'Die Rezeption ist bis 20:00 geöffnet',
    },
  },

  admin: {
    titel: 'Verwaltung',
    inloggen: {
      titel: 'Guten Morgen, einmal einloggen.',
      intro: 'Dieser Bereich ist nur für das Team von De Groene Weide.',
      email: 'E-Mail-Adresse',
      wachtwoord: 'Passwort',
      knop: 'Einloggen',
      fout: 'Diese E-Mail-Adresse und dieses Passwort gehören nicht zusammen.',
      hint: 'Demo: bert@degroeneweide.nl / weide',
      uitloggen: 'Ausloggen',
    },
    nav: {
      start: 'Start',
      reserveringen: 'Buchungen',
      bezetting: 'Belegung',
      plekken: 'Plätze',
      berichten: 'Nachrichten',
      email: 'E-Mail',
      evenementen: 'Veranstaltungen',
      paginas: 'Seiten & Blöcke',
      fotos: 'Fotos & Dateien',
      prijzen: 'Preise & Saisons',
      voorzieningen: 'Ausstattung',
      gegevens: 'Daten',
      opruimen: 'Löschen',
      team: 'Wer darf was',
      teksten: 'Alle Texte',
      meldingen: 'Hinweise',
      grap: 'Witz des Tages',
    },
    berichten: {
      titel: 'Nachrichten',
      intro: 'Was Gäste über das Kontaktformular geschickt haben.',
      geen: 'Noch keine Nachrichten.',
      nieuw: 'Neu',
      gelezen: 'Gelesen',
      markeer: 'Als gelesen markieren',
    },
    email: {
      titel: 'E-Mail',
      intro:
        'Jede E-Mail, die die Website verschickt, mit Status. Fehlgeschlagene bleiben liegen, bis sie raus sind.',
      geen: 'Es wurde noch keine E-Mail verschickt.',
      opnieuw: 'Erneut senden',
      kolommen: { aan: 'An', onderwerp: 'Betreff', soort: 'Art', status: 'Status', wanneer: 'Wann' },
      test: 'Testmail senden',
      testUitleg: 'Sende eine E-Mail an diese Adresse, um zu prüfen, ob das Senden funktioniert.',
      testGelukt: 'Gesendet über',
      testMislukt: 'Fehlgeschlagen',
      transport: 'Versand über',
      transportResend: 'Resend (kostenlos)',
      transportCloudflare: 'Cloudflare Email Sending',
      statussen: { verzonden: 'Gesendet', fout: 'Fehlgeschlagen', wacht: 'In Warteschlange' },
    },
    opruimen: {
      titel: 'Pro Bereich löschen',
      intro:
        'Wähle genau, was du wegwirfst. Jeder Bereich hat seine eigene Schaltfläche, du kannst also das E-Mail-Protokoll löschen, ohne die Buchungen anzutasten — und umgekehrt.',
      allesTitel: 'Alles auf einmal',
      allesUitleg:
        'Buchungen, E-Mail-Protokoll, Nachrichten, Newsletter-Anmeldungen, Sitzungen und Fotos auf einmal. Plätze, Veranstaltungen, Ausstattung, Verwalter und Einstellungen bleiben.',
      uitleg: {
        reserveringen:
          'Alle Buchungen samt den zugehörigen Bestätigungsmails. Die Plätze sind danach wieder frei auf dem Plan.',
        mails:
          'Der Verlauf gesendeter und fehlgeschlagener E-Mails. Die Mails selbst sind schon raus; das löscht nur das Protokoll.',
        berichten: 'Alles, was Gäste über das Kontaktformular geschickt haben.',
        aanmeldingen: 'Die E-Mail-Adressen, die sich für den Newsletter angemeldet haben.',
        sessies: 'Alle, die gerade in der Verwaltung angemeldet sind, werden abgemeldet — auch du.',
        fotos: 'Die hochgeladenen Fotos samt Dateien. Die Fotofelder auf der Website werden wieder Platzhalter.',
      },
      sessiesWaarschuwing: 'Achtung: Du wirst danach abgemeldet.',
      leeg: 'Nichts zu löschen',
    },
    gegevens: {
      titel: 'Daten',
      intro:
        'Sieh nach, was in der Datenbank steht, und räume auf, was du nicht mehr brauchst. Löschen lässt sich nicht rückgängig machen.',
      overzicht: 'Was steht in der Datenbank',
      opruimen: 'Aufräumen',
      opruimenUitleg: 'Wähle einen Bereich und tippe VERWIJDER zum Löschen.',
      wissen: 'Löschen',
      bevestig: 'Tippe VERWIJDER zur Bestätigung',
      bevestigAlles: 'Tippe ALLES, um alles zu löschen',
      alles: 'Alle Gästedaten löschen',
      allesUitleg:
        'Buchungen, E-Mail-Protokoll, Nachrichten, Newsletter-Anmeldungen, Sitzungen und Fotos. Plätze, Veranstaltungen, Ausstattung und Verwalter bleiben.',
      gast: 'Daten einer Gästin oder eines Gastes',
      gastUitleg:
        'Löscht alle Buchungen, Nachrichten und die Newsletter-Anmeldung dieser E-Mail-Adresse. Nutze das, wenn jemand seine Daten löschen lassen möchte.',
      gastKnop: 'Daten dieser Person löschen',
      klaar: 'Gelöscht',
      niets: 'Es gab nichts zu löschen.',
      labels: {
        reserveringen: 'Buchungen',
        mails: 'E-Mail-Protokoll',
        berichten: 'Kontaktnachrichten',
        aanmeldingen: 'Newsletter-Anmeldungen',
        sessies: 'Angemeldete Sitzungen',
        fotos: 'Fotos',
        plekken: 'Plätze',
        events: 'Veranstaltungen',
        voorzieningen: 'Ausstattung',
        beheerders: 'Verwalter',
      },
    },
    velden: {
      weide: 'Wiese',
      hond: 'Hund erlaubt',
      schaduw: 'Schatten',
      dag: 'Tag',
      tijd: 'Zeit',
      titel: 'Titel',
      locatie: 'Ort',
      leeftijd: 'Alter',
      categorie: 'Art',
      kort: 'Kurzname',
      positie: 'Position auf dem Plan',
      wachtwoord: 'Passwort',
      nieuweFoto: 'Foto wählen',
      geenFoto: 'Noch kein Foto',
    },
    verwijderen: 'Löschen',
    start: {
      groet: 'Guten Morgen, {naam}',
      intro: 'Das passiert heute auf dem Hof.',
      snel: 'Schnell zu',
      nieuw: 'Neue Buchung',
      reserveren: 'Buchung hinzufügen',
      plekken: 'Plätze verwalten',
      berichten: 'Nachrichten',
      berichtenUitleg: 'Fragen von Gästen über das Kontaktformular.',
      vandaag: 'Heute',
      aankomst: 'Anreise',
      vertrek: 'Abreise',
      schoonmaak: 'Reinigung',
      instellingen: 'Einstellungen für heute',
      plekmatch: 'Platzmatch an',
      plekmatchUitleg: 'Gäste bekommen drei Tipps statt der ganzen Karte.',
      melding: 'Hinweis auf der Website',
      meldingUitleg: 'Der gelbe Balken oben auf jeder Seite.',
      alles: 'Alle Buchungen',
    },
    reserveringen: {
      titel: 'Alle Buchungen',
      intro: 'Suchen, filtern und eine Buchung öffnen.',
      zoek: 'Nach Name oder Nummer suchen',
      filter: 'Filter',
      periode: 'Zeitraum',
      nieuwe: 'Neue Buchung',
      kolommen: {
        nummer: 'Nummer',
        naam: 'Name',
        plek: 'Platz',
        van: 'Von',
        tot: 'Bis',
        personen: 'Personen',
        bedrag: 'Betrag',
        status: 'Status',
      },
      statussen: {
        bevestigd: 'Bestätigt',
        betaald: 'Bezahlt',
        geannuleerd: 'Storniert',
        nieuw: 'Neu',
      },
      geen: 'Keine Buchungen gefunden.',
      totaal: '{aantal} Buchungen',
    },
    bezetting: {
      titel: 'Wer steht wo?',
      intro: 'Übersicht ohne Ziehen, pro Platz und pro Tag.',
      legenda: 'Grün ist belegt, orange ist Anreise oder Abreise.',
      week: 'Woche',
      dagen: 'Tage',
    },
    plekken: {
      titel: 'Alle Plätze auf der Wiese',
      intro: 'Setze einen Platz auf offen, geschlossen oder in Wartung.',
      kolommen: {
        plek: 'Platz',
        soort: 'Art',
        status: 'Status',
        stroom: 'Strom',
        ondergrond: 'Boden',
        prijs: 'Preis/Nacht',
      },
      status: {
        open: 'Offen',
        dicht: 'Geschlossen',
        onderhoud: 'Wartung',
      },
      toevoegen: 'Neuer Platz',
    },
    evenementen: {
      titel: 'Veranstaltungen',
      intro: 'Der Kalender, den Gäste auf der Seite Veranstaltungen sehen.',
      week: 'Wöchentlich wiederkehrend',
      toevoegen: 'Veranstaltung hinzufügen',
    },
    paginas: {
      titel: 'Seiten & Blöcke',
      intro: 'Alle URLs der Website, in drei Sprachen. Die Texte selbst änderst du unter Alle Texte.',
      kolommen: { pagina: 'Seite', taal: 'Sprache', status: 'Status', gewijzigd: 'Geändert' },
      status: { gepubliceerd: 'Veröffentlicht', concept: 'Entwurf', verouderd: 'Veraltet' },
    },
    teksten: {
      titel: 'Alle Texte',
      intro:
        'Schreibe hier, was auf der Website steht. Du schreibst auf Niederländisch; Englisch und Deutsch werden automatisch übersetzt.',
      zoeken: 'Nach Text oder Schlüssel suchen',
      onderdeel: 'Bereich',
      alles: 'Alles',
      aantal: '{aantal} Texte',
      geen: 'Kein Text gefunden. Versuche einen anderen Suchbegriff.',
      meer: 'Mehr Texte zeigen',
      standaard: 'Standard',
      aangepast: 'Angepasst',
      vertaald: 'Übersetzt',
      mist: 'Übersetzung fehlt',
      opslaan: 'Speichern und übersetzen',
      bewaard: 'Gespeichert und übersetzt.',
      bewaardZonder: 'Gespeichert. Übersetzen hat gerade nicht geklappt — bitte später erneut versuchen.',
      herstel: 'Zurück zum Standard',
      hersteld: 'Wieder der Text aus dem Code.',
      vertaalAlles: 'Fehlende Übersetzungen ergänzen',
      vertaalUitleg:
        'Pro Durchgang werden höchstens 20 Texte übersetzt, damit das Guthaben des Übersetzungsdienstes nicht mit einem Klick aufgebraucht ist.',
      vertaalKlaar: '{aantal} Texte übersetzt.',
      vertaalOpen: 'Noch {aantal} offen.',
      geenVertaler:
        'Es sind noch keine Lara-Schlüssel hinterlegt, deshalb ist Übersetzen noch nicht möglich. Dein niederländischer Text wird trotzdem gespeichert.',
      leeg: 'Leer lassen bedeutet: zurück zum Text aus dem Code.',
    },
    meldingen: {
      titel: 'Hinweise oben auf der Website',
      intro:
        'Ein Hinweis erscheint als farbiger Balken über jeder Seite, zum Beispiel „Das Schwimmbad ist heute geschlossen“. Du schreibst auf Niederländisch; Englisch und Deutsch werden automatisch übersetzt.',
      nieuw: 'Neuer Hinweis',
      tekst: 'Text des Hinweises',
      soort: 'Art',
      soorten: {
        mededeling: 'Mitteilung (gelb)',
        waarschuwing: 'Warnung (orange)',
        dringend: 'Dringend (rot)',
      },
      vanaf: 'Ab (leer = sofort)',
      tot: 'Bis einschließlich (leer = immer)',
      actief: 'Ist an',
      aanzetten: 'Einschalten',
      uitzetten: 'Ausschalten',
      plaatsen: 'Hinweis veröffentlichen',
      wijzigen: 'Bearbeiten',
      vertaal: 'Jetzt übersetzen',
      bewaren: 'Änderung speichern',
      annuleer: 'Abbrechen',
      verwijderen: 'Löschen',
      verwijderBevestig: 'Diesen Hinweis löschen?',
      geen: 'Noch keine Hinweise. Die Website ist dann einfach sauber.',
      loopt: 'Jetzt auf der Website',
      gepland: 'Beginnt später',
      verlopen: 'Ist vorbei',
      uit: 'Ist aus',
      voorbeeld: 'So sieht es aus',
      bewaard: 'Hinweis gespeichert und übersetzt.',
      bewaardZonder: 'Hinweis gespeichert. Übersetzen hat gerade nicht geklappt.',
      anoniem: 'Besucher können einen Hinweis wegklicken; er kommt zurück, wenn du ihn änderst.',
      telling: '{aantal} Hinweise',
    },
    grap: {
      titel: 'Witz des Tages',
      intro:
        'Der Witz steht in der Karte oben auf der Startseite. Schreibe ihn auf Niederländisch; Englisch und Deutsch kommen automatisch dazu.',
      voorbeeld: 'So sieht er auf der Startseite aus',
      label: 'Überschrift',
      opslaan: 'Witz speichern und übersetzen',
      bewaard: 'Witz gespeichert und übersetzt.',
      bewaardZonder: 'Witz gespeichert. Übersetzen hat gerade nicht geklappt.',
      herstel: 'Zurück zum Standardwitz',
      leeg: 'Ein leerer Witz blendet die Karte aus.',
      ideeen: 'Vielleicht einer davon?',
      ideeenLijst: [
        'Warum überquerte das Huhn die Straße? Um auf die andere Seite zu kommen.',
        'Was sagt ein Huhn, wenn es ein Ei legt? „Das ist nicht mein Ei.“',
        'Warum sind Hühner so ruhig? Sie legen alles beiseite.',
      ],
    },
    fotos: {
      titel: 'Fotos & Dateien',
      intro: 'Zieh ein Foto in ein Feld. Die Website passt es automatisch auf die richtige Größe an.',
      uploaden: 'Fotos hochladen',
      alt: 'Alt-Text erforderlich',
      stats: 'Belegter Speicher',
    },
    prijzen: {
      titel: 'Preise & Saisons',
      intro: 'Was eine Nacht kostet – und wann.',
      kolommen: { soort: 'Art', laag: 'Nebensaison', hoog: 'Hochsaison', min: 'Min. Nächte' },
      toeristenbelasting: 'Kurtaxe',
      schoonmaak: 'Reinigung Safari-Zelt',
      extra: 'Zusätzliche Person',
    },
    voorzieningen: {
      titel: 'Was steht auf dem Hof?',
      intro: 'Diese Liste füllt den Lageplan und die Platzdetails.',
      toevoegen: 'Ausstattung hinzufügen',
      status: { open: 'Offen', dicht: 'Geschlossen', storing: 'Störung' },
    },
    team: {
      titel: 'Wer darf was?',
      intro: 'Rollen und Rechte des Teams.',
      kolommen: { naam: 'Name', rol: 'Rolle', mail: 'E-Mail', rechten: 'Rechte' },
      rollen: { eigenaar: 'Inhaber', receptie: 'Rezeption', terrein: 'Gelände', schoonmaak: 'Reinigung' },
      rechten: ['Buchungen ansehen', 'Buchungen ändern', 'Preise ändern', 'Seiten veröffentlichen', 'Team verwalten'],
      toevoegen: 'Person hinzufügen',
    },
  },
}
