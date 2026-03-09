-- supabase/migrations/002_rls_policies.sql

-- Activer RLS sur toutes les tables
alter table public.user_profiles enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.forum_categories enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Helper : vérifier le rôle d'un utilisateur
create or replace function public.get_user_role(user_id uuid)
returns text as $$
  select role from public.user_profiles where id = user_id;
$$ language sql security definer;

-- == user_profiles ==
create policy "Profils visibles par tous"
  on public.user_profiles for select using (true);

create policy "Un utilisateur peut modifier son propre profil"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- == articles ==
create policy "Articles publiés visibles par tous"
  on public.articles for select
  using (status = 'published' or author_id = auth.uid() or public.get_user_role(auth.uid()) = 'admin');

create policy "Seul admin peut créer des articles"
  on public.articles for insert
  with check (public.get_user_role(auth.uid()) = 'admin');

create policy "Seul admin peut modifier des articles"
  on public.articles for update
  using (public.get_user_role(auth.uid()) = 'admin');

create policy "Seul admin peut supprimer des articles"
  on public.articles for delete
  using (public.get_user_role(auth.uid()) = 'admin');

-- == comments ==
create policy "Commentaires visibles par tous"
  on public.comments for select using (true);

create policy "Utilisateurs authentifiés peuvent commenter"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Un utilisateur peut modifier son commentaire"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "Auteur ou modérateur peut supprimer un commentaire"
  on public.comments for delete
  using (
    auth.uid() = author_id
    or public.get_user_role(auth.uid()) in ('moderator', 'admin')
  );

-- == forum_categories ==
create policy "Catégories visibles par tous"
  on public.forum_categories for select using (true);

create policy "Seul admin peut gérer les catégories"
  on public.forum_categories for insert
  with check (public.get_user_role(auth.uid()) = 'admin');

create policy "Seul admin peut modifier les catégories"
  on public.forum_categories for update
  using (public.get_user_role(auth.uid()) = 'admin');

create policy "Seul admin peut supprimer les catégories"
  on public.forum_categories for delete
  using (public.get_user_role(auth.uid()) = 'admin');

-- == forum_topics ==
create policy "Topics visibles par tous"
  on public.forum_topics for select using (true);

create policy "Membres peuvent créer des topics"
  on public.forum_topics for insert
  with check (auth.uid() = author_id);

create policy "Auteur peut modifier son topic"
  on public.forum_topics for update
  using (
    auth.uid() = author_id
    or public.get_user_role(auth.uid()) in ('moderator', 'admin')
  );

create policy "Modérateur ou admin peut supprimer un topic"
  on public.forum_topics for delete
  using (public.get_user_role(auth.uid()) in ('moderator', 'admin'));

-- == forum_posts ==
create policy "Posts visibles par tous"
  on public.forum_posts for select using (true);

create policy "Membres peuvent poster"
  on public.forum_posts for insert
  with check (auth.uid() = author_id);

create policy "Auteur peut modifier son post"
  on public.forum_posts for update
  using (auth.uid() = author_id);

create policy "Auteur ou modérateur peut supprimer un post"
  on public.forum_posts for delete
  using (
    auth.uid() = author_id
    or public.get_user_role(auth.uid()) in ('moderator', 'admin')
  );

-- == badges ==
create policy "Badges visibles par tous"
  on public.badges for select using (true);

create policy "Seul admin gère les badges"
  on public.badges for all
  using (public.get_user_role(auth.uid()) = 'admin');

-- == user_badges ==
create policy "Badges utilisateurs visibles par tous"
  on public.user_badges for select using (true);

create policy "Seul admin attribue des badges"
  on public.user_badges for insert
  with check (public.get_user_role(auth.uid()) = 'admin');

-- == newsletter_subscribers ==
create policy "Tout le monde peut s'inscrire à la newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Seul admin peut voir les abonnés"
  on public.newsletter_subscribers for select
  using (public.get_user_role(auth.uid()) = 'admin');

create policy "Un abonné peut se désinscrire"
  on public.newsletter_subscribers for update
  using (email = (select email from auth.users where id = auth.uid()));
