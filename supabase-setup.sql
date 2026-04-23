-- Trainingsprogramma — Supabase setup
-- Deze versie sluit aan op de huidige appstructuur met 3 sessies (a/b/c)
-- en losse oefeningen per sessie.

-- Templates: sessies
CREATE TABLE IF NOT EXISTS training_sessions (
  id TEXT PRIMARY KEY CHECK (id IN ('a', 'b', 'c')),
  order_index INT NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  bg_light TEXT NOT NULL,
  focus TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates: oefeningen binnen een sessie
CREATE TABLE IF NOT EXISTS training_exercises (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  sets TEXT NOT NULL,
  reps TEXT,
  duration TEXT,
  muscles TEXT NOT NULL,
  description TEXT NOT NULL,
  tip TEXT NOT NULL,
  common_mistake TEXT NOT NULL,
  equipment TEXT NOT NULL,
  source TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trainingshistorie per user
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES training_sessions(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  exercises_completed JSONB NOT NULL DEFAULT '[]',
  total_exercises INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_training_sessions_order ON training_sessions(order_index);
CREATE INDEX IF NOT EXISTS idx_training_exercises_session_order ON training_exercises(session_id, order_index);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, completed_at DESC);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active training sessions" ON training_sessions;
CREATE POLICY "Public can read active training sessions" ON training_sessions
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read active training exercises" ON training_exercises;
CREATE POLICY "Public can read active training exercises" ON training_exercises
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Users can read own workout sessions" ON workout_sessions;
CREATE POLICY "Users can read own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workout sessions" ON workout_sessions;
CREATE POLICY "Users can insert own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

INSERT INTO training_sessions (id, order_index, name, color, color_hex, bg_light, focus, active)
VALUES
  ('a', 1, 'Knie & Onderlichaam', 'Groen', '#22c55e', 'bg-green-50', 'Quadriceps + heupabductoren versterken = minder belasting op kniepees', true),
  ('b', 2, 'Houding + Bovenrug', 'Blauw', '#3b82f6', 'bg-blue-50', 'Rechter staan, schouders open, tegen vooroverhouding', true),
  ('c', 3, 'Mobiliteit & Balans', 'Geel', '#eab308', 'bg-yellow-50', 'Heupen soepel, enkels mobiel, valpreventie', true)
ON CONFLICT (id) DO UPDATE SET
  order_index = EXCLUDED.order_index,
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  color_hex = EXCLUDED.color_hex,
  bg_light = EXCLUDED.bg_light,
  focus = EXCLUDED.focus,
  active = EXCLUDED.active,
  updated_at = now();

INSERT INTO training_exercises (id, session_id, order_index, name, sets, reps, duration, muscles, description, tip, common_mistake, equipment, source, active)
VALUES
  ('a1', 'a', 1, 'Quad Sets', '3', '15x per been', NULL, 'Quadriceps', 'Op je rug, benen gestrekt. Span je bovenbeenspier en duw de achterkant van je knie hard tegen de vloer. 5 seconden vasthouden, dan loslaten.', 'Dit ziet eruit alsof je niets doet — en dat is het punt! Puur spierspanning zonder beweging. Perfect voor een gevoelige knie.', 'Niet je knie buigen of je teen naar je toe trekken. Alleen de bovenbeenspier spannen.', 'Matje', 'Oef #4 uit 2018', true),
  ('a2', 'a', 2, 'Straight Leg Raise', '2', '12x per been', NULL, 'Quadriceps', 'Op je rug, gezond been gebogen. Knie vast, been gestrekt optillen tot ~45°. 2 sec vasthouden, gecontroleerd zakken.', 'Het been moet recht blijven — geen knie buigen. Langzaam laten zakken (3 sec) is effectiever dan snel optillen.', 'Been niet naar beneden laten vallen. Voel de controle. Rug plat houden.', 'Matje', 'Oef #5 uit 2018', true),
  ('a3', 'a', 3, 'Rekband Knee Extension', '3', '12x per been', NULL, 'Quadriceps', 'Zit op stoel. Band onder voet, andere kant vast. Been langzaam strekken tegen de weerstand. 2 sec vasthouden, gecontroleerd terug.', 'Lichte rekband is genoeg. Het gaat om de controle, niet om zware weerstand.', 'Niet de rekband te zwaar maken. Niet snel laten zakken — gecontroleerd.', 'Stoel + Rekband (licht)', NULL, true),
  ('a4', 'a', 4, 'Side Lying Leg Raise', '2', '15x per kant', NULL, 'Heupabductoren', 'Op je zij. Onderbeen gebogen voor stabiliteit. Bovenbeen gestrekt naar boven tillen (~30 cm). Teen naar voren.', 'Dit traint de gluteus medius — de spier die je knie stabiliseert bij het lopen. Essentieel voor Osgood-Schlatter.', 'Bovenlichaam niet naar achteren kantelen om been hoger te krijgen. 30 cm is genoeg.', 'Matje', NULL, true),
  ('a5', 'a', 5, 'Clamshells met Rekband', '2', '15x per kant', NULL, 'Heupabductoren', 'Op je zij, knieën gebogen. Band net boven knieën. Open bovenbeen als een boek — knie naar het plafond, voeten bij elkaar.', 'Houd je heupen recht — bekken mag niet meedraaien. Kleine beweging, niet groot zwaaien.', 'Bekken niet mee laten draaien. Langzaam bewegen, niet klappen.', 'Matje + Rekband (licht)', NULL, true),
  ('a6', 'a', 6, 'Wall Sit', '2', NULL, '30 sec (of max)', 'Quads + Billen', 'Rug tegen muur. Zak tot knieën 90° (bovenbenen parallel). Houd vol. Duw rug plat tegen de muur.', 'Beginnen met 15 sec is prima. Bouw op. Isometrisch = geen beweging, puur kracht opbouwen. Heel veilig voor knieën.', 'Knieën niet voorbij je tenen laten komen. Rug plat. Niet te diep als het pijn doet.', 'Een muur', NULL, true),
  ('a7', 'a', 7, 'Glute Bridge', '2', '15x', NULL, 'Billen + Hamstrings', 'Op je rug, knieën gebogen. Duw heupen omhoog tot lichaam recht van schouders tot knieën. Billen samen bovenaan (2 sec).', 'Adem uit bij omhoog duwen. Focus op billen, niet op je rug.', 'Niet te hoog duwen (geen holle rug). Billen actief gebruiken, niet je rug.', 'Matje', 'Oef #3 uit 2018', true),
  ('b1', 'b', 1, 'Chin Tucks (Onderkin)', '3', '10x', NULL, 'Nekflexoren', 'Zit rechtop. Trek kin in en maak een onderkin. Houd 2 seconden vast, dan ontspannen.', 'Je kijkt niet naar beneden — je hoofd schuift naar achteren alsof je een dubbele kin maakt.', 'Niet je hoofd omlaag buigen. Het is een horizontale beweging naar achteren.', 'Geen', 'Oef #2 uit 2018', true),
  ('b2', 'b', 2, 'Schouders naar Achter/Beneden', '3', '10x', NULL, 'Rhomboïden + Trapezium', 'Buiklig, handdoek onder voorhoofd. Trek beide schouders zo ver mogelijk naar achteren en naar beneden.', 'Voel je schouderbladen naar elkaar toe bewegen. Dit opent je borstkas.', 'Niet je schouders optrekken naar je oren. Naar achteren én beneden.', 'Matje + handdoek', 'Oef #3/#6 uit 2018', true),
  ('b3', 'b', 3, 'Hoofd Achteruit tegen Weerstand', '3', '10x', NULL, 'Nek extensoren', 'Rechtop zitten, samengevouwen handen op achterhoofd. Duw hoofd naar achteren, voorkom beweging met je handen.', '2 seconden vasthouden. Je spieren spannen zonder dat je hoofd beweegt — isometrisch.', 'Niet je nek forceren tegen je handen. Het is een weerstandsoefening, geen krachtmeting.', 'Geen', 'Oef #5 uit 2018', true),
  ('b4', 'b', 4, 'Opstrekken Bovenrug (Muur)', '3', '10x', NULL, 'Thoracale wervelkolom', '40cm van muur. Ellebogen op opgevouwen handdoek tegen muur, handen in nek. Steun op ellebogen, rug en benen in rechte lijn. Ellebogen naar boven bewegen.', 'Buikspieren gespannen, rug niet hol laten worden. Dit strekt je hele bovenrug.', 'Rug hol maken = foute houding. Houd je buik aangespannen.', 'Muur + handdoek', 'Oef #8 uit 2018', true),
  ('b5', 'b', 5, 'Bovenrug Stretch over Stoel', '2', '10x', NULL, 'Thoracale wervelkolom', 'Zit op stoel (leuning maximaal okselhoogte), handen in nek, ellebogen naar elkaar. Kijk naar achteren en strek bovenrug over de rugleuning.', 'Schuif je billen naar voren om steeds hoger in de rug te komen. 2 seconden vasthouden.', 'Niet met je nek forceren. De beweging komt uit je middenrug.', 'Stoel met lage leuning', 'Oef #9 uit 2018', true),
  ('b6', 'b', 6, 'Armzwaai met Borst-Opening', '2', '10x', NULL, 'Bovenrug + Schouders', 'Recht op zitten, armen laten hangen. Trek schouders naar achteren. Breng armen gestrekt voorwaarts en omhoog. Strek bovenrug door hol te maken.', 'Adem in bij armen omhoog, uit bij armen naar beneden. Voel hoe je borstkas opent.', 'Niet je rug hol trekken vanuit je onderrug. De beweging zit in je bovenrug.', 'Geen', 'Oef #11 uit 2018', true),
  ('b7', 'b', 7, 'Rotatie Bovenrug', '2', '10x', NULL, 'Thoracale rotatie', 'Zit rechtop, armen uitgestrekt naar zijden. Draai linker duim omhoog, rechterduim omlaag. Kijk naar de arm met duim omhoog. Wissel.', 'Dit is de beste rotatieoefening voor je bovenrug. Kijk echt mee met je hoofd.', 'Niet alleen je armen draaien — je bovenrug en hoofd draaien mee.', 'Geen', 'Oef #14 uit 2018', true),
  ('b8', 'b', 8, 'Chest Opener Deuropening', '2', NULL, '30 sec', 'Borstspieren', 'In deurpost staan, gebogen armen op schouderhoogte, handen naar boven. Onderarmen tegen deurposten, 1 been voor. Duw borst naar voren.', 'Verende beweging — niet statisch vasthouden. Maak zachte, ritmische beweging.', 'Niet te ver leunen — je moet controle houden.', 'Een deurpost', 'Oef #13 uit 2018', true),
  ('c1', 'c', 1, 'Hip Flexor Stretch', '2', NULL, '30 sec/kant', 'Heupflexoren', 'Kniel op rechterknie, linkervoet vooruit (lunge). Duw rechterheup naar voren. Rug recht, geen holle rug.', 'Handen op heupen en bekken naar voren duwen. Milde rek is genoeg.', 'Te ver naar voren duwen = holle rug. Rug recht houden.', 'Matje', NULL, true),
  ('c2', 'c', 2, 'Deep Squat Hold', '2', NULL, '30 sec', 'Heupen + Ankels', 'Zo laag mogelijk zakken. Knienen naar buiten duwen met ellebogen. Houd vast. Houd tafel vast als nodig.', 'De ultieme heup-opener. Ga zover als comfortabel — diep squat is een vaardigheid.', 'Niet forceren als je knie niet kan. Houd iets vast voor evenwicht.', 'Matje', NULL, true),
  ('c3', 'c', 3, '90/90 Hip Rotation', '2', '5x per kant', NULL, 'Heuprotatie', 'Zit met benen in twee 90° hoeken. Draai knieën tegelijk naar de andere kant. Houd elke kant 3 sec. Langzaam.', 'De beste heupmobiliteitsoefening die er is. Werk binnen je bereik.', 'Niet forceren om de grond te raken. Langzaam draaien, niet slaan.', 'Matje', NULL, true),
  ('c4', 'c', 4, 'Ankle Dorsiflexion', '2', '10x per kant', NULL, 'Enkelmobiliteit', 'Zijdelings aan muur, voet 10-15cm ervan. Buig knie naar muur, hiel blijft plat. Kom terug.', 'Goede enkelmobiliteit = minder belasting op je knie. Cruciaal!', 'Hiel mag niet van de grond! Zo nodig verder weg van muur.', 'Een muur', NULL, true),
  ('c5', 'c', 5, 'Single-Leg Stand', '2', NULL, '30 sec/been', 'Balans', 'Sta op één been. Ogen open, dan ogen dicht. Wissel van been.', 'Valpreventie. Als je kan: ogen dicht voor extra moeilijkheid.', 'Niet je steunbeen te veel buigen. Sta zo recht mogelijk.', 'Geen', NULL, true),
  ('c6', 'c', 6, 'Achilles Rekken', '2', NULL, '30 sec/kant', 'Kuit + Achilles', 'Gezichtspositie tegen muur, 1 been achter. Hiel plat, knie gestrekt. Leun vooruit tot je rek voelt.', 'Strakke kuit trekt aan je kniepees. Deze stretch helpt direct.', 'Hiel komt van de grond — dat is niet de bedoeling.', 'Een muur', NULL, true),
  ('c7', 'c', 7, 'Rekken Achterste Keten', '2', NULL, '10 sec', 'Achterkant lichaam', 'Midden op stoel. Linkervoet op rechtervoet. Handen vooruit. Rug bol maken, armen uitstrekken, linkerbeen strekken.', 'Rek over je hele achterkant — van nek tot hiel. Adem diep.', 'Niet forceren — maak je rug bol maar forceer de rek niet.', 'Stoel', 'Oef #16 uit 2018', true),
  ('c8', 'c', 8, 'Naar Grond en Opstaan', '3', NULL, NULL, 'Volledig lichaam', 'Staand → gecontroleerd naar de grond → weer opstaan. Zo min mogelijk handen gebruiken.', 'Dit is de ultieme functionele oefening. Valpreventie in het dagelijks leven.', 'Niet haasten. Elke beweging bewust en gecontroleerd.', 'Matje', NULL, true)
ON CONFLICT (id) DO UPDATE SET
  session_id = EXCLUDED.session_id,
  order_index = EXCLUDED.order_index,
  name = EXCLUDED.name,
  sets = EXCLUDED.sets,
  reps = EXCLUDED.reps,
  duration = EXCLUDED.duration,
  muscles = EXCLUDED.muscles,
  description = EXCLUDED.description,
  tip = EXCLUDED.tip,
  common_mistake = EXCLUDED.common_mistake,
  equipment = EXCLUDED.equipment,
  source = EXCLUDED.source,
  active = EXCLUDED.active,
  updated_at = now();
