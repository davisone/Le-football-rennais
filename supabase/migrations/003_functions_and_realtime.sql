-- supabase/migrations/003_functions_and_realtime.sql

-- Fonction RPC pour incrémenter le view_count d'un topic
create or replace function public.increment_view_count(topic_id uuid)
returns void as $$
begin
  update public.forum_topics
  set view_count = view_count + 1
  where id = topic_id;
end;
$$ language plpgsql security definer;

-- Activer le Realtime sur forum_posts (nécessaire pour le forum live)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'forum_posts'
  ) then
    alter publication supabase_realtime add table public.forum_posts;
  end if;
end
$$;

-- Supprimer les badges si déjà existants puis les recréer
delete from public.badges where condition in ('first_post', 'posts_50', 'member_1_year');

-- Insérer les badges par défaut
insert into public.badges (name, description, condition) values
  ('Première galette', 'A publié son premier message sur le forum', 'first_post'),
  ('Habitué du Roazhon', 'A publié 50 messages sur le forum', 'posts_50'),
  ('Rouge et Noir', 'Membre depuis plus d''un an', 'member_1_year');
