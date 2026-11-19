/**
 * Every visible text on the site, in English.
 *
 * Same shape and the same tone as the Dutch: calm, cheerful, accessible,
 * one little joke per screen. British English throughout.
 */

import type { Dict } from './nl'

export const en: Dict = {
  code: 'en',
  taalnaam: 'English',
  taalKort: 'EN',

  merk: {
    naam: 'De Groene Weide',
    slogan: 'Quiet living and farm life',
    beschrijving:
      'A campsite on Bert’s farmyard. Camping between the chickens, the tractor and the old dairy.',
  },

  nav: {
    home: 'Home',
    terrein: 'The farm & things to do',
    plattegrond: 'Site map',
    reserveren: 'Book',
    evenementen: 'Events',
    overOns: 'About us',
    contact: 'Contact',
    menu: 'Menu',
    sluitMenu: 'Close menu',
    overslaan: 'Skip to the content',
    admin: 'Manage',
  },

  aankondiging: {
    tekst: 'The pool closes on Tuesday for maintenance. The showers stay open.',
    sluit: 'Close this notice',
  },

  knoppen: {
    boek: 'Book your pitch in the meadow',
    planRoute: 'Plan your route',
    stuurBericht: 'Send a message',
    vraagDeKip: 'Ask the chicken',
    startPlekmatch: 'Start Pitchmatch',
    verder: 'Continue',
    terug: 'Back',
    volgende: 'Next step',
    bekijkAlles: 'See everything on the map',
    kiesDeze: 'Choose this pitch',
    naarGegevens: 'Continue to your details',
    reserveerNu: 'Reserve now',
    meerLezen: 'Read on',
    heleAgenda: 'The whole programme',
    allesOpHetErf: 'Everything on the farm',
    leesToegankelijkheid: 'Read about accessibility',
    sluit: 'Close',
    annuleer: 'Cancel',
    opslaan: 'Save',
    wijzig: 'Change',
  },

  taalkeuze: 'Language · Taal · Sprache',

  rustknop: {
    label: 'Calm button',
    uitleg:
      'Turns movement and sound off. Handy if you are easily distracted or just want to read in peace.',
    aan: 'Calm on',
    uit: 'Calm off',
  },

  cookie: {
    titel: 'Biscuits? Only our own.',
    tekst:
      'We only use the cookies needed to make the site work. We count visitors without cookies. Extras, like the map from Google, stay off until you switch them on.',
    accepteren: 'Allow everything',
    weigeren: 'Pick and choose',
    uitleg: 'Read the cookie statement',
  },

  home: {
    hero: {
      eyebrow: 'Campsite · 1 April – 31 October',
      titel: 'Live the real farm life',
      intro:
        'Between the chickens, the tractor and the old dairy. Choose your own pitch on the map and wake up to bleating.',
      grapLabel: 'Joke of the day',
      grap: 'Why did the chicken cross the road? To get to the other side.',
    },
    terrein: {
      eyebrow: 'The farm & things to do',
      titel: 'What is there to do here?',
      link: 'Everything on the farm',
      kaarten: [
        {
          titel: 'The chickens',
          tekst: 'Collecting eggs at nine o’clock. Gently, they are not awake yet.',
          foto: 'Photo: the chickens',
        },
        {
          titel: 'Play meadow with tractor',
          tekst: 'Climbing, running and playing on the old tractor.',
          foto: 'Photo: play meadow with tractor',
        },
        {
          titel: 'Outdoor pool',
          tekst: 'Cool down after a day on the farm.',
          foto: 'Photo: outdoor pool',
        },
        {
          titel: 'Canteen in the old dairy',
          tekst: 'With a little shop full of produce from local farmers.',
          foto: 'Photo: the old dairy',
        },
      ],
    },
    plekadvies: {
      eyebrow: 'Pitch advice',
      titel: 'Which pitch suits you?',
      tekst:
        'The chicken asks five short questions and points out the three best free pitches. In half a minute.',
    },
    evenementen: {
      eyebrow: 'Events',
      titel: 'Coming up on the farm',
    },
    vindons: {
      titel: 'How to find us',
      adresLabel: 'Address',
      adres: 'Groene Weide 1\n1234 AB Weideveen',
      tijdenLabel: 'Reception open',
      tijden: 'Every day 08:00 – 20:00',
      seizoen: 'Open from 1 April to 31 October',
      kaart: 'Map with directions',
    },
  },

  terrein: {
    titel: 'What is there to do here?',
    intro:
      'Everything on the farm is a two-minute walk away. Below you can see what is here, and who it is for.',
    tip: 'Tip: the whole village is ten minutes away by bike. The bikes are at reception.',
    filterLabel: 'Filter the farm',
    filters: {
      alles: 'Everything',
      dieren: 'Animals',
      water: 'Water',
      spelen: 'Play',
      eten: 'Food & drink',
      sanitair: 'Washrooms',
    },
    plekken: [
      {
        titel: 'The chickens',
        tekst:
          'Every morning at nine you can help collect the eggs. The chickens roam freely across the farm and adore children with a handful of grain.',
        foto: 'Photo: the chicken meadow',
        filter: 'dieren',
        label: 'Every day · 09:00',
      },
      {
        titel: 'Play meadow with tractor',
        tekst:
          'A big grass field with a genuine old tractor to climb on, a swing and plenty of room to run.',
        foto: 'Photo: play meadow with tractor',
        filter: 'spelen',
        label: 'Open all day',
      },
      {
        titel: 'Outdoor pool',
        tekst:
          'Heated from May to September. A shallow part for the little ones, and still water in the evening for those who swim quietly.',
        foto: 'Photo: outdoor pool',
        filter: 'water',
        label: 'May – September',
      },
      {
        titel: 'Canteen in the old dairy',
        tekst:
          'Coffee, rolls and soup from whatever the farm has that day. On Wednesday there is a hot meal.',
        foto: 'Photo: the old dairy',
        filter: 'eten',
        label: '08:00 – 20:00',
      },
      {
        titel: 'The little shop',
        tekst:
          'Eggs, cheese, honey and jam from farmers nearby. You can pay by card, or cash into a little pot.',
        foto: 'Photo: the little shop',
        filter: 'eten',
        label: 'At reception',
      },
      {
        titel: 'Washrooms & laundry',
        tekst:
          'Hot water, two family showers, a washing machine and a place to hose your boots down.',
        foto: 'Photo: washrooms',
        filter: 'sanitair',
        label: 'Hot water, 24 hours',
      },
    ],
    rolstoel: {
      titel: 'Wheelchair or pushchair?',
      tekst:
        'Most paths on the farm are paved and wide enough. The play meadow is a grass path, which is less pleasant with a wheelchair in wet weather.',
      link: 'See everything on the accessibility page',
    },
    cta: {
      titel: 'Fancy it?',
      tekst:
        'Book your pitch in the meadow. One email address is enough, no account needed.',
    },
  },

  plattegrond: {
    titel: 'Explore the farm',
    intro:
      'Click a spot on the map and discover what is where. A yellow dot shows how many activities there are that day.',
    fotoAlt: 'Photo of {plek}',
    doenKop: 'What you can do here',
    feitenKop: 'Good to know',
    kaart: {
      weg: 'Provincial road',
      kiesLabel: 'Pick a spot on the map',
      svgTitel: 'Map of De Groene Weide. Use the buttons below the map to pick a spot.',
      hint: 'Swipe sideways to see the whole map, or pick a spot below.',
      paneelLabel: 'About this spot',
      zoneAantalEen: ', 1 activity on the programme',
      zoneAantal: ', {aantal} activities on the programme',
    },
    zones: {
      woonhuis: {
        kort: 'Reception',
        label: 'Farmhouse + reception',
        tag: 'Your stay starts here',
        titel: 'Farmhouse & reception',
        tekst:
          'This is where Bert lives and where you check in on arrival. The reception is the place for questions, bread rolls and tips for the area.',
        doen: [
          {
            titel: 'A walk around the farm with Bert',
            detail: 'How did a dairy farm work? Bert tells you, and children may ask anything.',
          },
          {
            titel: 'Ordering bread rolls',
            detail: 'Order the evening before, the baker delivers them at 08:00',
          },
          { titel: 'Tips for the area', detail: 'Cycling and walking routes nearby' },
        ],
        feiten: [
          'Reception open 09:00 to 20:00',
          'Check-in from 13:00, check-out before 11:00',
          'Good mobile signal on the farm',
        ],
      },
      kampeerveld: {
        kort: 'Camping field',
        label: 'Camping field',
        tag: '40 pitches for a tent or caravan',
        titel: 'Camping field',
        tekst:
          'Roomy pitches on the grass, with the farm at your back and meadows in front. The biggest field at De Groene Weide.',
        doen: [
          { titel: 'Breakfast in the grass', detail: 'With fresh rolls from the baker' },
          { titel: 'Stargazing', detail: 'Far from the city it gets properly dark at night' },
          { titel: 'Playing on the play meadow', detail: 'A few minutes’ walk away' },
        ],
        feiten: [
          'Tent or caravan, up to 6 people per pitch',
          'Washrooms within walking distance',
          'Mobile signal is limited here',
        ],
      },
      camperveld: {
        kort: 'Motorhome field',
        label: 'Motorhome field',
        tag: '12 motorhome pitches',
        titel: 'Motorhome field',
        tekst:
          'A field of its own, only for motorhomes. Drive straight to it along the middle path; the washroom building is around the corner.',
        doen: [
          { titel: 'Drive straight to your pitch', detail: 'Along the middle path' },
          {
            titel: 'Showering around the corner',
            detail: 'The washroom building is right below the field',
          },
          {
            titel: 'Groceries next door',
            detail: 'The little shop in the old dairy is a short walk away',
          },
        ],
        feiten: [
          'A separate field, motorhomes only',
          'Up to 6 people per pitch',
          'Mobile signal is limited here',
        ],
      },
      achterste: {
        kort: 'Safari tents',
        label: 'Back field',
        tag: '8 ready-made safari tents',
        titel: 'Back field',
        tekst:
          'The quietest corner of the farm, far from the road. This is where the safari tents stand: all you need to bring is yourself.',
        doen: [
          { titel: 'Stargazing', detail: 'The darkest and quietest spot on the farm' },
          {
            titel: 'Breakfast on your veranda',
            detail: 'Every tent has a kitchen corner and a covered veranda',
          },
          { titel: 'Sleeping in', detail: 'Far from the road, so lovely and quiet' },
        ],
        feiten: [
          'Beds are made, no camping gear needed',
          'Up to 5 people per tent',
          'Mobile signal is limited here',
        ],
      },
      melkstal: {
        kort: 'Old dairy',
        label: 'Old dairy',
        tag: 'Canteen & little shop',
        titel: 'The old dairy',
        tekst:
          'Where the cows were milked every morning and evening, you now have coffee or a cold beer. The little shop sells produce from farmers nearby.',
        doen: [
          { titel: 'A drink in the canteen', detail: 'Coffee by day, a cold beer in the evening' },
          { titel: 'Groceries in the little shop', detail: 'Produce from farmers nearby' },
          {
            titel: 'Seeing where the milking happened',
            detail: 'This is where the cows stood morning and evening',
          },
        ],
        feiten: ['A good spot when it rains', 'Mobile signal is limited here'],
      },
      sanitair: {
        kort: 'Washrooms',
        label: 'Washroom building',
        tag: 'Clean and close by',
        titel: 'Washroom building',
        tekst:
          'In the middle of the site, so quickly reached from every pitch. The laundry is here too.',
        doen: [
          { titel: 'Showering', detail: '12 showers and 14 toilets' },
          { titel: 'Doing the washing', detail: 'Laundry room with washing machines' },
        ],
        feiten: ['In the middle of the site', 'Quickly reached from every pitch'],
      },
      zwembad: {
        kort: 'Pool',
        label: 'Pool',
        tag: 'Cooling off after a hot day',
        titel: 'Outdoor pool',
        tekst:
          'An outdoor pool with sunloungers, next to the washroom building. Opening hours are available at reception.',
        doen: [
          { titel: 'Swimming', detail: 'Cooling off after a hot day' },
          { titel: 'Sunbathing on a lounger', detail: 'There are sunloungers around the pool' },
        ],
        feiten: ['Opening hours at reception', 'Right next to the play meadow'],
      },
      speelweide: {
        kort: 'Play meadow',
        label: 'Play meadow',
        tag: 'Room to run',
        titel: 'Play meadow',
        tekst:
          'A big grass field with swings, a slide and a sandpit. In July and August the entertainment team organises games here.',
        doen: [
          { titel: 'Swings, sliding and building sandcastles', detail: 'For the little ones' },
          { titel: 'Games with the entertainment team', detail: 'In July and August' },
          { titel: 'Running and playing in the grass', detail: 'A big field, far from the cars' },
        ],
        feiten: ['Car-free, so safe to play', 'The pool and washrooms are close by'],
      },
      parkeerplaats: {
        kort: 'Car park',
        label: 'Car park',
        tag: 'Cars at the edge',
        titel: 'Car park',
        tekst:
          'After unloading, park here. That keeps the site quiet and safe for playing children.',
        doen: [],
        feiten: [
          'Right next to the entrance',
          'Unload at your pitch first, then park here',
          'That keeps the site almost car-free',
        ],
      },
      ingang: {
        kort: 'Entrance',
        label: 'Entrance / gate',
        tag: 'On the provincial road',
        titel: 'Entrance',
        tekst:
          'This is where you drive onto the farm. Arriving after reception has closed? Let us know in advance and we will arrange something.',
        doen: [],
        feiten: [
          'Arrival from 13:00',
          'Reception immediately on the left after the entrance',
          'Arriving late? Let us know in advance',
        ],
      },
    },
    cta: {
      kampeerplek: 'Book a camping pitch',
      camperplek: 'Book a motorhome pitch',
      safaritent: 'Book a safari tent',
    },
    programma: {
      kop: 'What is on',
      dicht: 'The campsite is closed now. As an example you see the programme from {datum}.',
      demo:
        'Demo: sign-ups are kept in this browser only and the free spots are an example.',
      vandaag: 'Today',
      morgen: 'Tomorrow',
      dagKies: 'Pick a day',
      leegVandaag: 'Nothing on the programme here today.',
      leegMorgen: 'Nothing on the programme here tomorrow.',
      leegOp: 'Nothing on the programme here on {datum}.',
      vrij: 'Only {aantal} spot left',
      vrijMeer: '{aantal} spots left',
      vol: 'Full',
      bezig: 'Already started',
      afgelopen: 'Finished',
      tot: 'to {tijd}',
      aanmelden: 'Sign up',
      aanmeldenVoor: 'Sign up for {titel}',
      afmelden: 'Cancel',
      jeStaatErOp: 'You are on the list with {aantal} person.',
      jeStaatErOpMeer: 'You are on the list with {aantal} people.',
      naam: 'Your name',
      personen: 'People',
      bevestig: 'Confirm sign-up',
      annuleer: 'Cancel',
      foutNaam: 'Please fill in your name so the team knows who is coming.',
      aangemeld: 'You are signed up for {titel} with {aantal} person.',
      aangemeldMeer: 'You are signed up for {titel} with {aantal} people.',
      afgemeld: 'Your sign-up for {titel} is cancelled.',
      activiteit: {
        erfwandeling: {
          titel: 'A walk around the farm with Bert',
          detail: 'Meet at reception. Bert tells you how the dairy farm worked.',
        },
        fietstocht: {
          titel: 'Cycle ride past the neighbours',
          detail: 'A loop past farmers nearby. Bring your own bike.',
        },
        speurtocht: {
          titel: 'Scavenger hunt around the farm',
          detail: 'For children; parents may help search.',
        },
        animatie: {
          titel: 'Games afternoon with the entertainment team',
          detail: 'Games on the play meadow for young and old.',
        },
        watergym: {
          titel: 'Aqua gym',
          detail: 'Gentle exercise in the outdoor pool.',
        },
        proeverij: {
          titel: 'Tasting from the little shop',
          detail: 'Taste produce from farmers nearby.',
        },
        boerenquiz: {
          titel: 'Farm quiz in the canteen',
          detail: 'How many litres of milk does a cow give a day? Play in teams.',
        },
        sterren: {
          titel: 'Stargazing together',
          detail: 'Bring a blanket and a warm jumper.',
        },
      },
    },
    weides: {
      a: 'Meadow A · T1–T24',
      b: 'Meadow B · T25–T48',
      c: 'Motorhome pitches C1–C12',
      s: 'Safari tents S1–S8',
    },
    plekDetails: {
      foto: 'Photo of',
      voorzieningen: 'Facilities',
      beschikbaar: 'Available',
      boekDeze: 'Book this pitch',
      afstand: 'Distance to the washrooms',
      tip: 'Chicken’s tip: this pitch hears the chickens first thing in the morning.',
    },
    voorzieningen: {
      kippenwei: {
        naam: 'Chicken meadow',
        kort: 'Chickens',
        tekst:
          'Every morning at nine, guests can help collect the eggs. The chickens roam freely and are not shy.',
        tip: 'Coming with small children? This is the busiest spot at 09:00.',
      },
      melkstal: {
        naam: 'Canteen in the old dairy',
        kort: 'Canteen',
        tekst:
          'Coffee, rolls and soup from whatever the farm has that day. A hot meal on Wednesday.',
        tip: 'The dairy is the driest spot when it rains.',
      },
      sanitair: {
        naam: 'Washrooms & laundry',
        kort: 'Washrooms',
        tekst:
          'Hot water, two family showers, an accessible toilet, a washing machine and a tap to rinse your boots.',
        tip: 'Between 07:00 and 08:00 it is quiet in there.',
      },
      zwembad: {
        naam: 'Outdoor pool',
        kort: 'Pool',
        tekst:
          'Heated from May to September, with a shallow part for the little ones and still water in the evening.',
        tip: 'Friday at 17:00 is pool hour with the farmer.',
      },
      receptie: {
        naam: 'Reception & little shop',
        kort: 'Reception',
        tekst:
          'Check-in, questions, and the little shop with eggs, cheese, honey and jam from farmers nearby.',
        tip: 'The bikes you can borrow for free are here too.',
      },
      speelweide: {
        naam: 'Play meadow with tractor',
        kort: 'Play meadow',
        tekst:
          'A grass field with an old tractor to climb on, a swing and room to run.',
        tip: 'Pitches T1 to T6 are the furthest away from here.',
      },
    },
  },

  evenementen: {
    titel: 'What is on at the farm?',
    intro:
      'Everything is free, and all you have to do is check in at the chickens. If it rains we move to the dairy.',
    week: 'This week',
    filterLabel: 'Kind of activity',
    filters: {
      alles: 'Everything',
      dieren: 'Animals',
      spelen: 'Play',
      water: 'Water',
      eten: 'Food',
    },
    dagen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    agendaTitel: 'This week’s programme',
    meedoen: 'Join in',
    niets: 'Nothing planned on this day. A good moment for a walk.',
    soorten: {
      dieren: 'Animals',
      spelen: 'Play',
      water: 'Water',
      eten: 'Food',
    },
    animaties: {
      eyebrow: 'Event · animation team',
      titel: 'The animation team’s film',
      intro:
        'Our animation team made a short cartoon about the farm. Click the card to open the preview.',
      bekijk: 'Watch the preview',
      seconden: 'seconds',
      sluiten: 'Close',
      opnieuw: 'Replay',
      nieuwTabblad: 'Open in a new tab',
      rust: 'A calm setting is on, so the film stays still. Start it yourself below.',
      start: 'Start the film',
      films: {
        'de-boerderij': {
          label: 'Film',
          titel: 'Mini film: the farm',
          beschrijving:
            'The chicken, the tractor, a UFO and an alarm clock: there is always something happening on the farm. One round lasts 71 seconds, then it starts all over again.',
        },
      },
    },
    list: [
      {
        dag: 0,
        tijd: '09:00',
        titel: 'Feeding the chickens',
        locatie: 'Chicken meadow',
        leeftijd: 'All ages',
        soort: 'dieren',
      },
      {
        dag: 0,
        tijd: '17:00',
        titel: 'Dairy soup',
        locatie: 'Canteen',
        leeftijd: 'All ages',
        soort: 'eten',
      },
      {
        dag: 1,
        tijd: '10:30',
        titel: 'Collecting eggs',
        locatie: 'Chicken meadow',
        leeftijd: '4+',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '09:00',
        titel: 'Feeding the chickens',
        locatie: 'Chicken meadow',
        leeftijd: 'All ages',
        soort: 'dieren',
      },
      {
        dag: 2,
        tijd: '15:00',
        titel: 'Tractor ride with Bert',
        locatie: 'Play meadow',
        leeftijd: '4+',
        soort: 'spelen',
      },
      {
        dag: 3,
        tijd: '19:30',
        titel: 'Quiet swimming',
        locatie: 'Outdoor pool',
        leeftijd: 'All ages',
        soort: 'water',
      },
      {
        dag: 4,
        tijd: '09:00',
        titel: 'Feeding the chickens',
        locatie: 'Chicken meadow',
        leeftijd: 'All ages',
        soort: 'dieren',
      },
      {
        dag: 4,
        tijd: '17:00',
        titel: 'Pool hour',
        locatie: 'Outdoor pool',
        leeftijd: 'All ages',
        soort: 'water',
      },
      {
        dag: 5,
        tijd: '11:00',
        titel: 'Baking bread',
        locatie: 'Canteen',
        leeftijd: '6+',
        soort: 'eten',
      },
      {
        dag: 6,
        tijd: '10:00',
        titel: 'Walk with the farmer',
        locatie: 'Starts at reception',
        leeftijd: 'All ages',
        soort: 'spelen',
      },
    ],
    cta: {
      titel: 'Missed nothing?',
      tekst: 'Next week’s programme goes up every Friday.',
      knop: 'Sign up for the newsletter',
    },
  },

  overOns: {
    titel: 'From dairy farmer to campsite farmer',
    intro:
      'Bert got rid of the cows and made the meadows ready for tents. The old dairy became a canteen, the hay barn became washrooms.',
    verhaal: {
      titel: 'The story of the farm',
      alineas: [
        'When the last cow left the shed in 2011, Bert was left with an empty farmyard. His daughter suggested putting up a few tents. By July of that year there were six.',
        'Since then the campsite has grown to forty-eight pitches, two safari tents and twelve motorhome pitches. The chickens stayed, and so did the tractor.',
        'We are not after getting bigger, we are after getting quieter. That is why there is no wifi on the camping fields, no music in the canteen and one silent evening a week.',
      ],
    },
    waarden: {
      titel: 'What we stand for',
      punten: [
        {
          titel: 'Deliberately small',
          tekst: 'Fifty pitches at most, no entertainment team and no loudspeakers.',
        },
        {
          titel: 'From around here',
          tekst: 'Bread, cheese and vegetables come from the village, not from a lorry.',
        },
        {
          titel: 'For everyone',
          tekst: 'Paved paths, roomy pitches and a calm button on every page.',
        },
      ],
    },
    team: {
      titel: 'The team',
      leden: [
        {
          naam: 'Bert',
          rol: 'Farmer',
          tekst: 'Knows every chicken by name and drives the tractor on Wednesday.',
          foto: 'Photo: Bert',
        },
        {
          naam: 'Monique',
          rol: 'Reception & admin',
          tekst: 'Sorts out your booking and knows where the best coffee is.',
          foto: 'Photo: Monique',
        },
        {
          naam: 'Jesse',
          rol: 'Grounds & washrooms',
          tekst: 'Keeps the pool clean and the showers warm.',
          foto: 'Photo: Jesse',
        },
      ],
      jijTitel: 'And you?',
      jijTekst:
        'You are not a guest, you live here for a while. Tidy your pitch when you leave, and the next person will be glad of it.',
    },
    cta: {
      titel: 'Come and see for yourself',
      tekst: 'One night among the chickens says more than a story.',
      primair: 'Book your pitch in the meadow',
      secundair: 'Send a message',
    },
  },

  contact: {
    titel: 'Just ask',
    intro: 'Not sure about something? Call, email or write it below. You usually get an answer the same day.',
    form: {
      naam: 'Name',
      email: 'Email address',
      onderwerp: 'What is it about?',
      onderwerpen: ['A booking', 'A question', 'A complaint', 'Something else'],
      bericht: 'Your message',
      berichtHint: 'Mention your booking number if you have one.',
      akkoord: 'You may email me about my question.',
      versturen: 'Send your question',
      succes: 'Your message is on its way. We will email you back within one working day.',
    },
    direct: {
      titel: 'Direct contact',
      telefoon: 'Phone',
      email: 'Email',
      post: 'Postal address',
    },
    receptie: {
      titel: 'Reception open',
      week: 'Monday to Friday',
      weekend: 'Saturday and Sunday',
      feestdagen: 'Public holidays',
    },
    faq: {
      titel: 'Frequently asked questions',
      vragen: [
        {
          vraag: 'Can my dog come along?',
          antwoord:
            'On the specially designated pitches T41 to T48 a dog is welcome, on a lead. Not in the pool or at the chickens.',
        },
        {
          vraag: 'What time can I check in?',
          antwoord:
            'From 14:00 to 20:00. Coming later? Give us a ring and reception will leave the key out for you.',
        },
        {
          vraag: 'Is there wifi on the campsite?',
          antwoord:
            'At reception and in the canteen there is. On the camping fields, deliberately not.',
        },
        {
          vraag: 'Can I bring my own bedding?',
          antwoord:
            'Yes. Our safari tents have duvets, but you are welcome to bring your own sleeping bag.',
        },
      ],
    },
  },

  voettekst: {
    linkLabel: 'Accessibility',
    titel: 'Accessibility at De Groene Weide',
    intro:
      'We want every guest to feel at home here. Below you can read exactly what is and is not possible. Missed something? Call or email us and we will find a solution.',
    onderdelenTitel: 'Around the site',
    onderdelen: [
      { plek: 'Washrooms', bereikbaar: 'Paved path', voorziening: 'Accessible toilet', opmerking: 'Revolving door, 90 cm wide' },
      { plek: 'Canteen', bereikbaar: 'Step-free', voorziening: 'Wheelchair accessible', opmerking: 'Pay by card at the counter' },
      { plek: 'Chicken meadow', bereikbaar: 'Grass path', voorziening: 'Partly accessible', opmerking: 'Muddy in wet weather' },
      { plek: 'Pool', bereikbaar: 'Steps with a handrail', voorziening: 'No pool hoist', opmerking: 'But a shallow pool' },
      { plek: 'Play meadow', bereikbaar: 'Grass', voorziening: 'Same path as the chickens', opmerking: 'A pushchair just about fits' },
      { plek: 'Reception', bereikbaar: 'Step-free', voorziening: 'A place to rest and water', opmerking: 'Also a please-do-sit-down chair' },
    ],
    kolommen: { plek: 'Place', bereikbaar: 'Access', voorziening: 'Facility', opmerking: 'Note' },
    vragenTitel: 'Can I…?',
    vragen: [
      {
        vraag: 'Can I hire a wheelchair?',
        antwoord: 'No, but the village lending hub has two. Reception will ring them for you.',
      },
      {
        vraag: 'Are there quiet pitches?',
        antwoord:
          'Yes. Pitches T1 to T6 are the furthest from the play meadow and the pool.',
      },
      {
        vraag: 'Can the site be read aloud?',
        antwoord:
          'Yes. The calm button stops movement, and the site works with any read-aloud function on your device.',
      },
    ],
  },

  nieuwsbrief: {
    titel: 'Newsletter & tips',
    intro: 'One email a month. What is happening on the farm, and one tip to taste farm life at home.',
    veld: 'Your email address',
    knop: 'Sign up',
    akkoord: 'I know I can always unsubscribe again.',
    succes: 'You are on the list. The first email arrives at the start of next month.',
    tip: 'This month: what you can do with a box of eggs and a bag of flour, no oven needed.',
  },

  privacy: {
    titel: 'Privacy & cookies',
    intro:
      'Short and honest: we keep what we need to make your booking work, and nothing more.',
    alineas: [
      'When you book, we keep your name, email address, phone number and the dates. We delete that data three months after your stay.',
      'We use no advertising cookies and we sell nothing on. We count visitors without cookies.',
      'The map on the Site map and Contact pages comes from Google. It only loads once you give permission for it.',
    ],
    contactTitel: 'Questions about your data?',
    contactTekst: 'Email reception. We reply within four weeks.',
  },

  nietGevonden: {
    fout: 'Oops 404',
    titel: 'This cow has escaped.',
    tekst:
      'The page you were looking for is no longer in the meadow. Perhaps it has moved, or someone left the gate open.',
    terug: 'Back to the farm',
  },

  reserveren: {
    titel: 'Reserve your pitch',
    intro: 'Seven short steps. You can go back at any point.',
    stapVan: 'step {stap} of 7',
    stappen: [
      'Date',
      'People & wishes',
      'Pitchmatch',
      'Choosing a pitch',
      'Details',
      'Checking',
      'Confirmation',
    ],
    stap1: {
      titel: 'When are you coming to stay?',
      intro: 'Choose your arrival and departure. Weeks with a line through them are full.',
      aankomst: 'Arrival',
      vertrek: 'Departure',
      kiesDatum: 'Choose your arrival',
      jouwKeuze: 'Your selection',
      nachten: 'nights',
      nacht: 'night',
      volgeboekt: 'Fully booked',
      beschikbaar: 'Still room',
      volgend: 'See the best pitches',
    },
    stap2: {
      titel: 'Who is coming, and where will you sleep?',
      personen: 'People',
      volwassenen: 'Adults',
      kinderen: 'Children',
      volwassenenHint: '18 and over',
      kinderenHint: 'Under 18',
      slapen: 'Sleeping in',
      wens: 'Any little wishes?',
      wensen: {
        stroom: 'Electricity',
        rustig: 'Quiet',
        sanitair: 'Washrooms close by',
        schaduw: 'Shade',
        speelweide: 'Close to the play meadow',
      },
      volgend: 'See the best pitches',
      soorten: {
        tent: 'Tent',
        camper: 'Motorhome',
        safaritent: 'Safari tent',
      },
      soortUitleg: {
        tent: 'Your own tent, your own patch of grass.',
        camper: 'A paved pitch with electricity and drainage.',
        safaritent: 'Our tent with beds, ready to step into.',
      },
    },
    stap3: {
      titel: 'The chicken has three tips for you',
      intro: 'Based on your wishes. The first usually suits best.',
      tip: 'Tip',
      match: 'Match',
      waarom: 'Why this one',
      kies: 'Choose this one',
      bekijkAlles: 'See everything on the map',
      opnieuw: 'Adjust your wishes',
      tips: {
        stroom: 'has electricity',
        rustig: 'is quiet',
        sanitair: 'close to the washrooms',
        schaduw: 'has shade',
        speelweide: 'close to the play meadow',
      },
    },
    stap4: {
      titel: 'Choose your pitch in the meadow',
      kaart: 'Map',
      lijst: 'List',
      aankomst: 'Arrival',
      vertrek: 'Departure',
      personen: 'People',
      wens: 'Kind of wish',
      legendaTitel: 'Legend',
      tipVanDeKip: 'Tip from the chicken',
      reserveer: 'Continue to your details',
      geenAccount: 'No account needed. One email address is enough to keep your booking.',
      alAccount: 'Already have an account?',
      houdVast: 'The chicken will keep this pitch warm for you for 15 minutes.',
      nachten: 'nights',
      status: {
        vrij: 'Free',
        bezet: 'Taken',
        geblokkeerd: 'Blocked',
        keuze: 'Your choice',
        tip: 'Tip',
      },
      voorzieningenTitels: {
        stroom: 'Electricity',
        ondergrond: 'Surface',
        vlak: 'Level',
        water: 'Water',
        rustig: 'Quiet',
        maxPersonen: 'Max. people',
        afstand: 'Distance to the washrooms',
      },
    },
    stap5: {
      titel: 'Whose name should it go in?',
      intro: 'Only what we need. No account, no password.',
      plek: 'Pitch',
      naam: 'Name',
      email: 'Email address',
      telefoon: 'Phone number',
      adres: 'Address',
      postcode: 'Postcode',
      plaats: 'Town',
      land: 'Country',
      opmerking: 'Anything we should know?',
      opmerkingHint: 'For example a dog, a wheelchair or a late arrival.',
      akkoord: 'I agree to the terms and the privacy statement.',
      voorwaarden: 'terms',
      privacy: 'privacy statement',
      volgende: 'Continue to check',
      selectie: 'Your selection',
      verplicht: 'Please fill in your name and email address.',
      verplichtAkkoord: 'Tick the terms to continue.',
    },
    stap6: {
      titel: 'Does everything look right?',
      intro: 'One last look. Then we put the pitch in your name.',
      wie: 'Who',
      wanneer: 'When',
      waar: 'Where',
      wat: 'What',
      betalen: 'Pay later',
      betalenUitleg: 'You pay on arrival at reception. You can cancel up to 48 hours beforehand.',
      totaal: 'Total',
      reserveer: 'Reserve now',
      wijzig: 'Change',
      voorwaardenKort: 'By reserving you agree to the terms.',
    },
    stap7: {
      titel: 'Booked! Pitch {plek} is yours.',
      intro: 'You will get an email with all the details. See you soon on the farm.',
      nummer: 'Booking number',
      nu: 'What now?',
      gemaild: 'I have had the email already',
      planRoute: 'Plan your route',
      ical: 'Add to your calendar',
      handig: 'Good to know',
      tips: [
        'You can check in from 14:00 at reception.',
        'Bring boots, the farmyard is wet in the morning.',
        'Feeding the chickens is every day at 09:00.',
      ],
      naarMijn: 'View my booking',
    },
    netBezet: {
      titel: 'Oh dear, pitch {plek} has just gone.',
      tekst:
        'Someone got there just before you. The chicken has already lined up two other pitches for you.',
      alternatief: 'See the alternatives',
      opnieuw: 'Choose another pitch yourself',
    },
    mijnereservering: {
      titel: '{nachten} more sleeps',
      intro: 'Everything you need for your stay.',
      gegevens: 'Your details',
      aankomst: 'Arrival',
      vertrek: 'Departure',
      plek: 'Pitch',
      annuleren: 'Cancel booking',
      wijzigen: 'Change details',
      route: 'Plan your route',
      watMee: 'What to bring',
      mee: ['Boots', 'A torch', 'Towels', 'Your own bedding is fine'],
      aankomstInfo:
        'Check in from 14:00 at reception. Coming later than 20:00? Give us a ring.',
      geen: 'We could not find this booking. Is the link right?',
    },
    aankomstdag: {
      titel: 'Welcome today!',
      tekst: 'Your pitch is ready. Check in at reception and the farmer will point you the way.',
      receptie: 'Reception is open until 20:00',
    },
  },

  admin: {
    titel: 'Manage',
    inloggen: {
      titel: 'Good morning, sign in first.',
      intro: 'This area is for the De Groene Weide team only.',
      email: 'Email address',
      wachtwoord: 'Password',
      knop: 'Sign in',
      fout: 'That email address and password do not belong together.',
      hint: 'Demo: bert@degroeneweide.nl / weide',
      uitloggen: 'Sign out',
    },
    nav: {
      start: 'Start',
      reserveringen: 'Bookings',
      bezetting: 'Occupancy',
      plekken: 'Pitches',
      berichten: 'Messages',
      email: 'Email',
      evenementen: 'Events',
      paginas: 'Pages & blocks',
      fotos: 'Photos & files',
      prijzen: 'Prices & seasons',
      voorzieningen: 'Facilities',
      gegevens: 'Data',
      opruimen: 'Delete',
      team: 'Who may do what',
      teksten: 'All texts',
      meldingen: 'Notices',
      grap: 'Joke of the day',
    },
    berichten: {
      titel: 'Messages',
      intro: 'What guests sent through the contact form.',
      geen: 'No messages yet.',
      nieuw: 'New',
      gelezen: 'Read',
      markeer: 'Mark as read',
    },
    email: {
      titel: 'Email',
      intro:
        'Every email the site sends, with its status. Failed emails stay here until they go out.',
      geen: 'No email has been sent yet.',
      opnieuw: 'Send again',
      kolommen: { aan: 'To', onderwerp: 'Subject', soort: 'Type', status: 'Status', wanneer: 'When' },
      test: 'Send a test email',
      testUitleg: 'Send an email to this address to check whether sending works.',
      testGelukt: 'Sent via',
      testMislukt: 'Failed',
      transport: 'Sending via',
      transportResend: 'Resend (free plan)',
      transportCloudflare: 'Cloudflare Email Sending',
      statussen: { verzonden: 'Sent', fout: 'Failed', wacht: 'Queued' },
    },
    opruimen: {
      titel: 'Delete per section',
      intro:
        'Choose exactly what you throw away. Every section has its own button, so you can clear the email history without touching your bookings — and the other way round.',
      allesTitel: 'Everything at once',
      allesUitleg:
        'Bookings, email log, messages, newsletter sign-ups, sessions and photos in one go. Pitches, events, facilities, administrators and settings stay.',
      uitleg: {
        reserveringen:
          'All bookings, including the confirmation emails that belong to them. The pitches become available on the map again.',
        mails:
          'The history of sent and failed emails. The emails themselves have already gone out; this only clears the log.',
        berichten: 'Everything guests sent through the contact form.',
        aanmeldingen: 'The email addresses that signed up for the newsletter.',
        sessies: 'Everyone currently signed in to the admin is signed out — including you.',
        fotos: 'The uploaded photos, including the files. The photo slots on the site become placeholders again.',
      },
      sessiesWaarschuwing: 'Careful: you will be signed out after this.',
      leeg: 'Nothing to delete',
    },
    gegevens: {
      titel: 'Data',
      intro:
        'See what is stored in the database and remove what you no longer need. Removing cannot be undone.',
      overzicht: 'What is in the database',
      opruimen: 'Clean up',
      opruimenUitleg: 'Pick a part and type VERWIJDER to remove it.',
      wissen: 'Remove',
      bevestig: 'Type VERWIJDER to confirm',
      bevestigAlles: 'Type ALLES to remove everything',
      alles: 'Remove all guest data',
      allesUitleg:
        'Bookings, email log, messages, newsletter sign-ups, sessions and photos. Pitches, events, facilities and administrators stay.',
      gast: 'Data of one guest',
      gastUitleg:
        'Removes all bookings, messages and the newsletter sign-up for this email address. Use this when a guest asks for their data to be erased.',
      gastKnop: 'Erase this guest’s data',
      klaar: 'Removed',
      niets: 'There was nothing to remove.',
      labels: {
        reserveringen: 'Bookings',
        mails: 'Email log',
        berichten: 'Contact messages',
        aanmeldingen: 'Newsletter sign-ups',
        sessies: 'Signed-in sessions',
        fotos: 'Photos',
        plekken: 'Pitches',
        events: 'Events',
        voorzieningen: 'Facilities',
        beheerders: 'Administrators',
      },
    },
    velden: {
      weide: 'Meadow',
      hond: 'Dogs allowed',
      schaduw: 'Shade',
      dag: 'Day',
      tijd: 'Time',
      titel: 'Title',
      locatie: 'Location',
      leeftijd: 'Age',
      categorie: 'Type',
      kort: 'Short name',
      positie: 'Position on the map',
      wachtwoord: 'Password',
      nieuweFoto: 'Choose photo',
      geenFoto: 'No photo yet',
    },
    verwijderen: 'Delete',
    start: {
      groet: 'Good morning, {naam}',
      intro: 'This is what is going on at the farm today.',
      snel: 'Jump to',
      nieuw: 'New booking',
      reserveren: 'Add a booking',
      plekken: 'Manage pitches',
      berichten: 'Messages',
      berichtenUitleg: 'Questions from guests via the contact form.',
      vandaag: 'Today',
      aankomst: 'arrivals',
      vertrek: 'departures',
      schoonmaak: 'Cleaning',
      instellingen: 'Today’s settings',
      plekmatch: 'Pitchmatch on',
      plekmatchUitleg: 'Guests get three tips instead of the whole map.',
      melding: 'Notice on the site',
      meldingUitleg: 'The yellow bar at the top of every page.',
      alles: 'All bookings',
    },
    reserveringen: {
      titel: 'All bookings',
      intro: 'Search, filter and open a booking.',
      zoek: 'Search by name or number',
      filter: 'Filter',
      periode: 'Period',
      nieuwe: 'New booking',
      kolommen: {
        nummer: 'Number',
        naam: 'Name',
        plek: 'Pitch',
        van: 'From',
        tot: 'To',
        personen: 'People',
        bedrag: 'Amount',
        status: 'Status',
      },
      statussen: {
        bevestigd: 'Confirmed',
        betaald: 'Paid',
        geannuleerd: 'Cancelled',
        nieuw: 'New',
      },
      geen: 'No bookings found.',
      totaal: '{aantal} bookings',
    },
    bezetting: {
      titel: 'Who is where?',
      intro: 'An overview per pitch and per day, no dragging required.',
      legenda: 'Green is taken, orange is an arrival or a departure.',
      week: 'Week',
      dagen: 'Days',
    },
    plekken: {
      titel: 'All pitches in the meadow',
      intro: 'Set a pitch to open, closed or under maintenance.',
      kolommen: {
        plek: 'Pitch',
        soort: 'Type',
        status: 'Status',
        stroom: 'Electricity',
        ondergrond: 'Surface',
        prijs: 'Price/night',
      },
      status: {
        open: 'Open',
        dicht: 'Closed',
        onderhoud: 'Maintenance',
      },
      toevoegen: 'New pitch',
    },
    evenementen: {
      titel: 'Events',
      intro: 'The programme guests see on the Events page.',
      week: 'Repeating weekly',
      toevoegen: 'Add an event',
    },
    paginas: {
      titel: 'Pages & blocks',
      intro: 'Every URL of the site, in three languages. You change the texts themselves under All texts.',
      kolommen: { pagina: 'Page', taal: 'Language', status: 'Status', gewijzigd: 'Changed' },
      status: { gepubliceerd: 'Published', concept: 'Draft', verouderd: 'Out of date' },
    },
    teksten: {
      titel: 'All texts',
      intro:
        'Write here what appears on the site. You write in Dutch; English and German are translated automatically.',
      zoeken: 'Search by text or key',
      onderdeel: 'Section',
      alles: 'All',
      aantal: '{aantal} texts',
      geen: 'No text found. Try another search term.',
      meer: 'Show more texts',
      standaard: 'Default',
      aangepast: 'Edited',
      vertaald: 'Translated',
      mist: 'Translation missing',
      opslaan: 'Save and translate',
      bewaard: 'Saved and translated.',
      bewaardZonder: 'Saved. Translating failed for now — please try again later.',
      herstel: 'Back to default',
      hersteld: 'Back to the text from the code.',
      vertaalAlles: 'Fill in missing translations',
      vertaalUitleg:
        'At most 20 texts are translated per go, so the translation credit is not used up in one click.',
      vertaalKlaar: '{aantal} texts translated.',
      vertaalOpen: '{aantal} to go.',
      geenVertaler:
        'No Lara keys have been set up yet, so translating is not possible. Your Dutch text is saved anyway.',
      leeg: 'Leave empty to go back to the text from the code.',
    },
    meldingen: {
      titel: 'Notices at the top of the site',
      intro:
        'A notice appears as a coloured bar above every page, for example “The pool is closed today”. You write in Dutch; English and German are translated automatically.',
      nieuw: 'New notice',
      tekst: 'Text of the notice',
      soort: 'Type',
      soorten: {
        mededeling: 'Notice (yellow)',
        waarschuwing: 'Warning (orange)',
        dringend: 'Urgent (red)',
      },
      vanaf: 'From (empty = right away)',
      tot: 'Until (empty = always)',
      actief: 'Switched on',
      aanzetten: 'Switch on',
      uitzetten: 'Switch off',
      plaatsen: 'Publish notice',
      wijzigen: 'Edit',
      vertaal: 'Translate now',
      bewaren: 'Save change',
      annuleer: 'Cancel',
      verwijderen: 'Delete',
      verwijderBevestig: 'Delete this notice?',
      geen: 'No notices yet. The site is simply clean.',
      loopt: 'Live on the site now',
      gepland: 'Starts later',
      verlopen: 'Has ended',
      uit: 'Switched off',
      voorbeeld: 'This is how it looks',
      bewaard: 'Notice saved and translated.',
      bewaardZonder: 'Notice saved. Translating failed for now.',
      anoniem: 'Visitors can close a notice; it comes back when you change it.',
      telling: '{aantal} notices',
    },
    grap: {
      titel: 'Joke of the day',
      intro:
        'The joke sits in the card at the top of the home page. Write it in Dutch; English and German are added automatically.',
      voorbeeld: 'This is how it looks on the home page',
      label: 'Heading',
      opslaan: 'Save joke and translate',
      bewaard: 'Joke saved and translated.',
      bewaardZonder: 'Joke saved. Translating failed for now.',
      herstel: 'Back to the default joke',
      leeg: 'An empty joke hides the card.',
      ideeen: 'Maybe one of these?',
      ideeenLijst: [
        'Why did the chicken cross the road? To get to the other side.',
        'What does a chicken say when she lays an egg? “That is not my egg.”',
        'Why are chickens so calm? They drop everything.',
      ],
    },
    fotos: {
      titel: 'Photos & files',
      intro: 'Drop a photo into a slot. The site picks it up at the right size for you.',
      uploaden: 'Upload photos',
      alt: 'Alt text required',
      stats: 'Storage used',
    },
    prijzen: {
      titel: 'Prices & seasons',
      intro: 'What a night costs, and when.',
      kolommen: { soort: 'Type', laag: 'Low season', hoog: 'High season', min: 'Min. nights' },
      toeristenbelasting: 'Tourist tax',
      schoonmaak: 'Safari tent cleaning',
      extra: 'Extra person',
    },
    voorzieningen: {
      titel: 'What is on the farm?',
      intro: 'This list fills the site map and the pitch details.',
      toevoegen: 'Add a facility',
      status: { open: 'Open', dicht: 'Closed', storing: 'Out of order' },
    },
    team: {
      titel: 'Who may do what?',
      intro: 'Roles and permissions of the team.',
      kolommen: { naam: 'Name', rol: 'Role', mail: 'Email', rechten: 'Permissions' },
      rollen: { eigenaar: 'Owner', receptie: 'Reception', terrein: 'Grounds', schoonmaak: 'Cleaning' },
      rechten: ['View bookings', 'Change bookings', 'Change prices', 'Publish pages', 'Manage the team'],
      toevoegen: 'Add someone',
    },
  },
}
