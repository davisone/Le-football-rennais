-- Migration 007 : Bucket Supabase Storage pour les avatars

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Tout le monde peut voir les avatars (bucket public)
create policy "Avatars publics en lecture"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Un utilisateur connecté peut uploader son propre avatar
create policy "Upload avatar personnel"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Un utilisateur peut remplacer son propre avatar
create policy "Mise à jour avatar personnel"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Un utilisateur peut supprimer son propre avatar
create policy "Suppression avatar personnel"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
