-- Trainingsprogramma: echte toegangscontrole via Supabase Auth + RLS.
-- Run in Supabase SQL Editor ná het aanmaken van je gebruiker (Authentication → Users → Add user).
-- Idempotent: veilig om opnieuw te draaien.
--
-- Effect:
--   * training_sessions / training_exercises: alleen leesbaar voor ingelogde gebruikers
--     met een e-mail uit de allowlist (de oude "Public can read"-policies verdwijnen).
--   * workout_sessions: alleen de allowlist; de app schrijft via /api/workouts met de
--     service_role key (omzeilt RLS) nadat de server de sessie heeft gecontroleerd.
--   * De anon key (staat publiek in de app) geeft geen toegang meer.
--   * service_role en de SQL Editor omzeilen RLS en blijven werken.

begin;

do $$
declare
  t text;
  p record;
begin
  foreach t in array array['training_sessions', 'training_exercises', 'workout_sessions'] loop
    execute format('alter table public.%I enable row level security', t);

    -- Alle bestaande policies verwijderen (o.a. "Public can read active training ...").
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;

    execute format('revoke all on table public.%I from anon', t);
    execute format('revoke all on table public.%I from public', t);
  end loop;
end $$;

-- Templates: alleen lezen voor de eigenaar; beheer gaat via SQL Editor / service_role.
create policy "Alleen eigenaar leest (allowlist)" on public.training_sessions
  for select
  to authenticated
  using (lower(auth.jwt() ->> 'email') in ('mail@mingusvogel.com', 'mingusvogel@gmail.com'));

create policy "Alleen eigenaar leest (allowlist)" on public.training_exercises
  for select
  to authenticated
  using (lower(auth.jwt() ->> 'email') in ('mail@mingusvogel.com', 'mingusvogel@gmail.com'));

revoke insert, update, delete, truncate on table public.training_sessions from authenticated;
revoke insert, update, delete, truncate on table public.training_exercises from authenticated;
grant select on table public.training_sessions to authenticated;
grant select on table public.training_exercises to authenticated;

-- Trainingshistorie: volledige toegang voor de eigenaar (bestaande rijen hebben geen user_id).
create policy "Alleen eigenaar (allowlist)" on public.workout_sessions
  for all
  to authenticated
  using (lower(auth.jwt() ->> 'email') in ('mail@mingusvogel.com', 'mingusvogel@gmail.com'))
  with check (lower(auth.jwt() ->> 'email') in ('mail@mingusvogel.com', 'mingusvogel@gmail.com'));

grant select, insert, update, delete on table public.workout_sessions to authenticated;

commit;

-- Controle (optioneel): verwacht rls = true en alleen de allowlist-policies.
-- select c.relname, c.relrowsecurity as rls, p.policyname, p.cmd, p.roles
-- from pg_class c left join pg_policies p on p.schemaname = 'public' and p.tablename = c.relname
-- where c.relnamespace = 'public'::regnamespace
--   and c.relname in ('training_sessions', 'training_exercises', 'workout_sessions');
