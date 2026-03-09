-- supabase/migrations/001_initial_schema.sql

-- Activer les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Table des profils utilisateurs
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  post_count integer not null default 0,
  topic_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Table des articles
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image_url text,
  author_id uuid references public.user_profiles(id) on delete set null,
  category text,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Table des commentaires
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  author_id uuid references public.user_profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table des catégories du forum
create table public.forum_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  position integer not null default 0,
  topic_count integer not null default 0,
  post_count integer not null default 0
);

-- Table des topics du forum
create table public.forum_topics (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.forum_categories(id) on delete cascade not null,
  author_id uuid references public.user_profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  view_count integer not null default 0,
  post_count integer not null default 0,
  last_post_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Table des posts du forum
create table public.forum_posts (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.forum_topics(id) on delete cascade not null,
  author_id uuid references public.user_profiles(id) on delete cascade not null,
  content text not null,
  is_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table des badges
create table public.badges (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon_url text,
  condition text,
  created_at timestamptz not null default now()
);

-- Table de liaison utilisateurs-badges
create table public.user_badges (
  user_id uuid references public.user_profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Table des abonnés newsletter
create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  is_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Index pour les performances
create index idx_articles_status_published on public.articles(status, published_at desc);
create index idx_articles_slug on public.articles(slug);
create index idx_comments_article on public.comments(article_id, created_at);
create index idx_forum_topics_category on public.forum_topics(category_id, last_post_at desc);
create index idx_forum_topics_slug on public.forum_topics(slug);
create index idx_forum_posts_topic on public.forum_posts(topic_id, created_at);
create index idx_user_profiles_username on public.user_profiles(username);

-- Trigger : créer automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger : incrémenter post_count et topic_count
create or replace function public.increment_post_count()
returns trigger as $$
begin
  update public.user_profiles set post_count = post_count + 1 where id = new.author_id;
  update public.forum_topics set post_count = post_count + 1, last_post_at = now() where id = new.topic_id;
  update public.forum_categories set post_count = post_count + 1
    where id = (select category_id from public.forum_topics where id = new.topic_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_forum_post_created
  after insert on public.forum_posts
  for each row execute procedure public.increment_post_count();

create or replace function public.increment_topic_count()
returns trigger as $$
begin
  update public.user_profiles set topic_count = topic_count + 1 where id = new.author_id;
  update public.forum_categories set topic_count = topic_count + 1 where id = new.category_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_forum_topic_created
  after insert on public.forum_topics
  for each row execute procedure public.increment_topic_count();
