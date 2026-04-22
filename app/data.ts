import { Session } from './types';

export const sessions: Session[] = [
  {
    id: 'a',
    name: 'Knie & Onderlichaam',
    color: 'Groen',
    colorHex: '#22c55e',
    bgLight: 'bg-green-50',
    focus: 'Quadriceps + heupabductoren versterken = minder belasting op kniepees',
    exercises: [
      {
        id: 'a1',
        name: 'Quad Sets',
        sets: '3',
        reps: '15x per been',
        muscles: 'Quadriceps',
        source: 'Oef #4 uit 2018',
        description: 'Op je rug, benen gestrekt. Span je bovenbeenspier en duw de achterkant van je knie hard tegen de vloer. 5 seconden vasthouden, dan loslaten.',
        tip: 'Dit ziet eruit alsof je niets doet — en dat is het punt! Puur spierspanning zonder beweging. Perfect voor een gevoelige knie.',
        commonMistake: 'Niet je knie buigen of je teen naar je toe trekken. Alleen de bovenbeenspier spannen.',
        equipment: 'Matje'
      },
      {
        id: 'a2',
        name: 'Straight Leg Raise',
        sets: '2',
        reps: '12x per been',
        muscles: 'Quadriceps',
        source: 'Oef #5 uit 2018',
        description: 'Op je rug, gezond been gebogen. Knie vast, been gestrekt optillen tot ~45°. 2 sec vasthouden, gecontroleerd zakken.',
        tip: 'Het been moet recht blijven — geen knie buigen. Langzaam laten zakken (3 sec) is effectiever dan snel optillen.',
        commonMistake: 'Been niet naar beneden laten vallen. Voel de controle. Rug plat houden.',
        equipment: 'Matje'
      },
      {
        id: 'a3',
        name: 'Rekband Knee Extension',
        sets: '3',
        reps: '12x per been',
        muscles: 'Quadriceps',
        description: 'Zit op stoel. Band onder voet, andere kant vast. Been langzaam strekken tegen de weerstand. 2 sec vasthouden, gecontroleerd terug.',
        tip: 'Lichte rekband is genoeg. Het gaat om de controle, niet om zware weerstand.',
        commonMistake: 'Niet de rekband te zwaar maken. Niet snel laten zakken — gecontroleerd.',
        equipment: 'Stoel + Rekband (licht)'
      },
      {
        id: 'a4',
        name: 'Side Lying Leg Raise',
        sets: '2',
        reps: '15x per kant',
        muscles: 'Heupabductoren',
        description: 'Op je zij. Onderbeen gebogen voor stabiliteit. Bovenbeen gestrekt naar boven tillen (~30 cm). Teen naar voren.',
        tip: 'Dit traint de gluteus medius — de spier die je knie stabiliseert bij het lopen. Essentieel voor Osgood-Schlatter.',
        commonMistake: 'Bovenlichaam niet naar achteren kantelen om been hoger te krijgen. 30 cm is genoeg.',
        equipment: 'Matje'
      },
      {
        id: 'a5',
        name: 'Clamshells met Rekband',
        sets: '2',
        reps: '15x per kant',
        muscles: 'Heupabductoren',
        description: 'Op je zij, knieën gebogen. Band net boven knieën. Open bovenbeen als een boek — knie naar het plafond, voeten bij elkaar.',
        tip: 'Houd je heupen recht — bekken mag niet meedraaien. Kleine beweging, niet groot zwaaien.',
        commonMistake: 'Bekken niet mee laten draaien. Langzaam bewegen, niet klappen.',
        equipment: 'Matje + Rekband (licht)'
      },
      {
        id: 'a6',
        name: 'Wall Sit',
        sets: '2',
        duration: '30 sec (of max)',
        muscles: 'Quads + Billen',
        description: 'Rug tegen muur. Zak tot knieën 90° (bovenbenen parallel). Houd vol. Duw rug plat tegen de muur.',
        tip: 'Beginnen met 15 sec is prima. Bouw op. Isometrisch = geen beweging, puur kracht opbouwen. Heel veilig voor knieën.',
        commonMistake: 'Knieën niet voorbij je tenen laten komen. Rug plat. Niet te diep als het pijn doet.',
        equipment: 'Een muur'
      },
      {
        id: 'a7',
        name: 'Glute Bridge',
        sets: '2',
        reps: '15x',
        muscles: 'Billen + Hamstrings',
        source: 'Oef #3 uit 2018',
        description: 'Op je rug, knieën gebogen. Duw heupen omhoog tot lichaam recht van schouders tot knieën. Billen samen bovenaan (2 sec).',
        tip: 'Adem uit bij omhoog duwen. Focus op billen, niet op je rug.',
        commonMistake: 'Niet te hoog duwen (geen holle rug). Billen actief gebruiken, niet je rug.',
        equipment: 'Matje'
      }
    ]
  },
  {
    id: 'b',
    name: 'Houding + Bovenrug',
    color: 'Blauw',
    colorHex: '#3b82f6',
    bgLight: 'bg-blue-50',
    focus: 'Rechter staan, schouders open, tegen vooroverhouding',
    exercises: [
      {
        id: 'b1',
        name: 'Chin Tucks (Onderkin)',
        sets: '3',
        reps: '10x',
        muscles: 'Nekflexoren',
        source: 'Oef #2 uit 2018',
        description: 'Zit rechtop. Trek kin in en maak een onderkin. Houd 2 seconden vast, dan ontspannen.',
        tip: 'Je kijkt niet naar beneden — je hoofd schuift naar achteren alsof je een dubbele kin maakt.',
        commonMistake: 'Niet je hoofd omlaag buigen. Het is een horizontale beweging naar achteren.',
        equipment: 'Geen'
      },
      {
        id: 'b2',
        name: 'Schouders naar Achter/Beneden',
        sets: '3',
        reps: '10x',
        muscles: 'Rhomboïden + Trapezium',
        source: 'Oef #3/#6 uit 2018',
        description: 'Buiklig, handdoek onder voorhoofd. Trek beide schouders zo ver mogelijk naar achteren en naar beneden.',
        tip: 'Voel je schouderbladen naar elkaar toe bewegen. Dit opent je borstkas.',
        commonMistake: 'Niet je schouders optrekken naar je oren. Naar achteren én beneden.',
        equipment: 'Matje + handdoek'
      },
      {
        id: 'b3',
        name: 'Hoofd Achteruit tegen Weerstand',
        sets: '3',
        reps: '10x',
        muscles: 'Nek extensoren',
        source: 'Oef #5 uit 2018',
        description: 'Rechtop zitten, samengevouwen handen op achterhoofd. Duw hoofd naar achteren, voorkom beweging met je handen.',
        tip: '2 seconden vasthouden. Je spieren spannen zonder dat je hoofd beweegt — isometrisch.',
        commonMistake: 'Niet je nek forceren tegen je handen. Het is een weerstandsoefening, geen krachtmeting.',
        equipment: 'Geen'
      },
      {
        id: 'b4',
        name: 'Opstrekken Bovenrug (Muur)',
        sets: '3',
        reps: '10x',
        muscles: 'Thoracale wervelkolom',
        source: 'Oef #8 uit 2018',
        description: '40cm van muur. Ellebogen op opgevouwen handdoek tegen muur, handen in nek. Steun op ellebogen, rug en benen in rechte lijn. Ellebogen naar boven bewegen.',
        tip: 'Buikspieren gespannen, rug niet hol laten worden. Dit strekt je hele bovenrug.',
        commonMistake: 'Rug hol maken = foute houding. Houd je buik aangespannen.',
        equipment: 'Muur + handdoek'
      },
      {
        id: 'b5',
        name: 'Bovenrug Stretch over Stoel',
        sets: '2',
        reps: '10x',
        muscles: 'Thoracale wervelkolom',
        source: 'Oef #9 uit 2018',
        description: 'Zit op stoel (leuning maximaal okselhoogte), handen in nek, ellebogen naar elkaar. Kijk naar achteren en strek bovenrug over de rugleuning.',
        tip: 'Schuif je billen naar voren om steeds hoger in de rug te komen. 2 seconden vasthouden.',
        commonMistake: 'Niet met je nek forceren. De beweging komt uit je middenrug.',
        equipment: 'Stoel met lage leuning'
      },
      {
        id: 'b6',
        name: 'Armzwaai met Borst-Opening',
        sets: '2',
        reps: '10x',
        muscles: 'Bovenrug + Schouders',
        source: 'Oef #11 uit 2018',
        description: 'Recht op zitten, armen laten hangen. Trek schouders naar achteren. Breng armen gestrekt voorwaarts en omhoog. Strek bovenrug door hol te maken.',
        tip: 'Adem in bij armen omhoog, uit bij armen naar beneden. Voel hoe je borstkas opent.',
        commonMistake: 'Niet je rug hol trekken vanuit je onderrug. De beweging zit in je bovenrug.',
        equipment: 'Geen'
      },
      {
        id: 'b7',
        name: 'Rotatie Bovenrug',
        sets: '2',
        reps: '10x',
        muscles: 'Thoracale rotatie',
        source: 'Oef #14 uit 2018',
        description: 'Zit rechtop, armen uitgestrekt naar zijden. Draai linker duim omhoog, rechterduim omlaag. Kijk naar de arm met duim omhoog. Wissel.',
        tip: 'Dit is de beste rotatieoefening voor je bovenrug. Kijk echt mee met je hoofd.',
        commonMistake: 'Niet alleen je armen draaien — je bovenrug en hoofd draaien mee.',
        equipment: 'Geen'
      },
      {
        id: 'b8',
        name: 'Chest Opener Deuropening',
        sets: '2',
        duration: '30 sec',
        muscles: 'Borstspieren',
        source: 'Oef #13 uit 2018',
        description: 'In deurpost staan, gebogen armen op schouderhoogte, handen naar boven. Onderarmen tegen deurposten, 1 been voor. Duw borst naar voren.',
        tip: 'Verende beweging — niet statisch vasthouden. Maak zachte, ritmische beweging.',
        commonMistake: 'Niet te ver leunen — je moet controle houden.',
        equipment: 'Een deurpost'
      }
    ]
  },
  {
    id: 'c',
    name: 'Mobiliteit & Balans',
    color: 'Geel',
    colorHex: '#eab308',
    bgLight: 'bg-yellow-50',
    focus: 'Heupen soepel, enkels mobiel, valpreventie',
    exercises: [
      {
        id: 'c1',
        name: 'Hip Flexor Stretch',
        sets: '2',
        duration: '30 sec/kant',
        muscles: 'Heupflexoren',
        description: 'Kniel op rechterknie, linkervoet vooruit (lunge). Duw rechterheup naar voren. Rug recht, geen holle rug.',
        tip: 'Handen op heupen en bekken naar voren duwen. Milde rek is genoeg.',
        commonMistake: 'Te ver naar voren duwen = holle rug. Rug recht houden.',
        equipment: 'Matje'
      },
      {
        id: 'c2',
        name: 'Deep Squat Hold',
        sets: '2',
        duration: '30 sec',
        muscles: 'Heupen + Ankels',
        description: 'Zo laag mogelijk zakken. Knienen naar buiten duwen met ellebogen. Houd vast. Houd tafel vast als nodig.',
        tip: 'De ultieme heup-opener. Ga zover als comfortabel — diep squat is een vaardigheid.',
        commonMistake: 'Niet forceren als je knie niet kan. Houd iets vast voor evenwicht.',
        equipment: 'Matje'
      },
      {
        id: 'c3',
        name: '90/90 Hip Rotation',
        sets: '2',
        reps: '5x per kant',
        muscles: 'Heuprotatie',
        description: 'Zit met benen in twee 90° hoeken. Draai knieën tegelijk naar de andere kant. Houd elke kant 3 sec. Langzaam.',
        tip: 'De beste heupmobiliteitsoefening die er is. Werk binnen je bereik.',
        commonMistake: 'Niet forceren om de grond te raken. Langzaam draaien, niet slaan.',
        equipment: 'Matje'
      },
      {
        id: 'c4',
        name: 'Ankle Dorsiflexion',
        sets: '2',
        reps: '10x per kant',
        muscles: 'Enkelmobiliteit',
        description: 'Zijdelings aan muur, voet 10-15cm ervan. Buig knie naar muur, hiel blijft plat. Kom terug.',
        tip: 'Goede enkelmobiliteit = minder belasting op je knie. Cruciaal!',
        commonMistake: 'Hiel mag niet van de grond! Zo nodig verder weg van muur.',
        equipment: 'Een muur'
      },
      {
        id: 'c5',
        name: 'Single-Leg Stand',
        sets: '2',
        duration: '30 sec/been',
        muscles: 'Balans',
        description: 'Sta op één been. Ogen open, dan ogen dicht. Wissel van been.',
        tip: 'Valpreventie. Als je kan: ogen dicht voor extra moeilijkheid.',
        commonMistake: 'Niet je steunbeen te veel buigen. Sta zo recht mogelijk.',
        equipment: 'Geen'
      },
      {
        id: 'c6',
        name: 'Achilles Rekken',
        sets: '2',
        duration: '30 sec/kant',
        muscles: 'Kuit + Achilles',
        description: 'Gezichtspositie tegen muur, 1 been achter. Hiel plat, knie gestrekt. Leun vooruit tot je rek voelt.',
        tip: 'Strakke kuit trekt aan je kniepees. Deze stretch helpt direct.',
        commonMistake: 'Hiel komt van de grond — dat is niet de bedoeling.',
        equipment: 'Een muur'
      },
      {
        id: 'c7',
        name: 'Rekken Achterste Keten',
        sets: '2',
        duration: '10 sec',
        muscles: 'Achterkant lichaam',
        source: 'Oef #16 uit 2018',
        description: 'Midden op stoel. Linkervoet op rechtervoet. Handen vooruit. Rug bol maken, armen uitstrekken, linkerbeen strekken.',
        tip: 'Rek over je hele achterkant — van nek tot hiel. Adem diep.',
        commonMistake: 'Niet forceren — maak je rug bol maar forceer de rek niet.',
        equipment: 'Stoel'
      },
      {
        id: 'c8',
        name: 'Naar Grond en Opstaan',
        sets: '3',
        muscles: 'Volledig lichaam',
        description: 'Staand → gecontroleerd naar de grond → weer opstaan. Zo min mogelijk handen gebruiken.',
        tip: 'Dit is de ultieme functionele oefening. Valpreventie in het dagelijks leven.',
        commonMistake: 'Niet haasten. Elke beweging bewust en gecontroleerd.',
        equipment: 'Matje'
      }
    ]
  }
];
