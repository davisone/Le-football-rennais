-- Migration 006 : Créer les profils manquants pour les utilisateurs auth existants

insert into public.user_profiles (id, username, display_name, avatar_url)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url'
from auth.users u
where not exists (
  select 1 from public.user_profiles p where p.id = u.id
);

-- Mettre le premier utilisateur créé en admin
update public.user_profiles
set role = 'admin'
where id = (select id from auth.users order by created_at asc limit 1);
