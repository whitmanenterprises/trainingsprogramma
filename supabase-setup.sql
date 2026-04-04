-- Oefeningen
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  order_index INT NOT NULL DEFAULT 0,
  dutch TEXT NOT NULL,
  name TEXT NOT NULL,
  muscles TEXT[] NOT NULL,
  sets INT NOT NULL,
  reps TEXT NOT NULL,
  why TEXT NOT NULL,
  how TEXT[] NOT NULL,
  feel TEXT,
  view TEXT DEFAULT 'front',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout sessies
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  exercises_completed JSONB NOT NULL DEFAULT '[]',
  total_exercises INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON workout_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_order ON exercises(order_index);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can read active exercises" ON exercises
  FOR SELECT USING (active = true);

CREATE POLICY "Users can read own sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Oefeningen inladen
INSERT INTO exercises (order_index, dutch, name, muscles, sets, reps, why, how, feel, view) VALUES
(1, 'Muurzit', 'Wall Sit', '{"quadriceps","knees"}', 3, '30 sec', 'Versterkt de spieren rond je knie zonder impact. Bouwt stabiliteit op in je bovenbeen.', '{"Leun met je rug plat tegen de muur","Zak door je knie\u00ebn tot 90\u00b0 hoek","Houd je knie\u00ebn boven je enkels","Adem rustig door en houd vol"}', 'Brandend gevoel in je bovenbenen, druk rond je knieschijf', 'front'),
(2, 'Heupbrug', 'Glute Bridge', '{"gluteal","hamstring","lower-back"}', 3, '12\u00d7', 'Activeert je bilspieren en hamstrings. Ontlast je knie\u00ebn en verbetert je houding.', '{"Lig op je rug, knie\u00ebn gebogen, voeten plat","Duw je heupen omhoog tot rechte lijn","Knijp je billen samen bovenaan","Laat langzaam zakken en herhaal"}', 'Spanning in je bilspieren en achterkant bovenbenen', 'back'),
(3, 'Kuitheffen', 'Calf Raise', '{"calves","knees","ankles"}', 3, '15\u00d7', 'Sterke kuiten stabiliseren je knie en verbeteren je balans.', '{"Sta recht, voeten op heupbreedte","Kom langzaam op je tenen omhoog","Houd 2 seconden vast bovenaan","Laat gecontroleerd zakken"}', 'Spanning in je kuiten, lichte druk rond je enkels', 'front'),
(4, 'Dode Kever', 'Dead Bug', '{"abs","obliques"}', 3, '10\u00d7 per kant', 'Traint je core-stabiliteit. Essentieel voor een rechte houding.', '{"Lig op je rug, armen omhoog, knie\u00ebn in 90\u00b0","Strek rechterarm en linkerbeen tegelijk uit","Houd je onderrug plat op de grond","Wissel af van kant"}', 'Diepe spanning in je buikspieren', 'front'),
(5, 'Superman', 'Superman Hold', '{"upper-back","lower-back","gluteal"}', 3, '20 sec', 'Versterkt je rugspieren voor een betere houding.', '{"Lig op je buik, armen gestrekt","Til armen, borst en benen tegelijk op","Houd je nek in lijn met je rug","Houd vast en adem rustig door"}', 'Spanning door je hele rug en bilspieren', 'back'),
(6, 'Muurengel', 'Wall Angel', '{"trapezius","deltoids","upper-back"}', 3, '10\u00d7', 'Opent je schouders en borst. Corrigeert voorovergebogen houding.', '{"Sta met je rug tegen de muur","Armen als een ''U'' tegen de muur","Schuif armen langzaam omhoog en omlaag","Schouderbladen samenknijpen"}', 'Stretch in je borst, spanning tussen schouderbladen', 'back'),
(7, 'Opstap', 'Step-Up', '{"quadriceps","gluteal","calves","knees"}', 3, '10\u00d7 per been', 'Functionele knieversterking: nabootst traplopen.', '{"Gebruik een stabiele verhoging","Stap op met rechtervoet, duw omhoog","Sta recht bovenop","Stap gecontroleerd terug, wissel"}', 'Quadriceps en bilspieren werken hard', 'front'),
(8, 'Kat-Koe Stretch', 'Cat-Cow', '{"abs","lower-back","upper-back","neck"}', 1, '10\u00d7 langzaam', 'Mobiliseert je hele wervelkolom. Helpt tegen stijfheid.', '{"Ga op handen en knie\u00ebn","Koe: buik zakken, kijk omhoog","Kat: rond je rug, kijk naar navel","Beweeg langzaam met ademhaling"}', 'Stretch door je hele rug, ontspanning in nek', 'back');
