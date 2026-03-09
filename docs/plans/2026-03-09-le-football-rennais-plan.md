# Le Football Rennais — Plan d'implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer un site vitrine + hub communautaire pour "Le Football Rennais", créateur de contenu football centré sur le Stade Rennais.

**Architecture:** Next.js 15 App Router full-stack avec Supabase (PostgreSQL, Auth, Storage, Realtime). Pages publiques en SSG/ISR, pages dynamiques en SSR, interactions client pour le forum realtime. Services externes : Resend (newsletter), YouTube Data API v3, TikTok oEmbed.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS, Supabase, TipTap, Resend, YouTube Data API v3, TikTok oEmbed, Vercel.

**Design doc:** `docs/plans/2026-03-09-le-football-rennais-design.md`

---

## Phase 1 — Setup projet & infrastructure

### Task 1: Initialiser le projet Next.js

**Files:**
- Create: projet Next.js via `create-next-app`
- Modify: `package.json`, `tsconfig.json`, `tailwind.config.ts`

**Step 1: Créer le projet**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Vérifier que le projet démarre**

Run: `npm run dev`
Expected: Serveur de dev sur http://localhost:3000

**Step 3: Nettoyer les fichiers par défaut**

Supprimer le contenu par défaut de `src/app/page.tsx` et `src/app/globals.css` (garder uniquement les directives Tailwind).

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initialisation du projet Next.js"
```

---

### Task 2: Installer et configurer Supabase

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `.env.local.example`
- Modify: `src/middleware.ts`
- Modify: `package.json`

**Step 1: Installer les dépendances**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Step 2: Créer le fichier d'exemple des variables d'environnement**

```env
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Créer `.env.local` avec les vraies valeurs (ne pas committer).

**Step 3: Créer le client Supabase (navigateur)**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**Step 4: Créer le client Supabase (serveur)**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignoré dans un Server Component (lecture seule)
          }
        },
      },
    }
  );
};
```

**Step 5: Créer le helper middleware Supabase**

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protéger les routes admin
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    return NextResponse.redirect(url);
  }

  // Protéger les routes profil
  if (request.nextUrl.pathname.startsWith("/profil") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
```

**Step 6: Créer le middleware Next.js**

```typescript
// src/middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Step 7: Vérifier le build**

Run: `npm run build`
Expected: Build réussi sans erreurs

**Step 8: Commit**

```bash
git add .
git commit -m "chore: configuration de Supabase (client, serveur, middleware)"
```

---

### Task 3: Créer le schéma de base de données Supabase

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Écrire la migration SQL complète**

```sql
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
```

**Step 2: Appliquer la migration**

Exécuter le SQL dans le Supabase Dashboard (SQL Editor) ou via la CLI Supabase.

**Step 3: Commit**

```bash
git add supabase/
git commit -m "feat(db): schéma initial de la base de données"
```

---

### Task 4: Configurer les Row Level Security (RLS)

**Files:**
- Create: `supabase/migrations/002_rls_policies.sql`

**Step 1: Écrire les politiques RLS**

```sql
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
```

**Step 2: Appliquer dans Supabase Dashboard**

**Step 3: Commit**

```bash
git add supabase/
git commit -m "feat(db): politiques Row Level Security"
```

---

### Task 5: Générer les types TypeScript depuis Supabase

**Files:**
- Create: `src/types/database.ts`
- Modify: `package.json` (script)

**Step 1: Installer la CLI Supabase et générer les types**

```bash
npm install -D supabase
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" > src/types/database.ts
```

**Step 2: Ajouter le script dans package.json**

```json
{
  "scripts": {
    "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts"
  }
}
```

**Step 3: Mettre à jour les clients Supabase pour utiliser les types**

Ajouter le type générique `Database` dans `src/lib/supabase/client.ts` et `server.ts` :

```typescript
import type { Database } from "@/types/database";
// createBrowserClient<Database>(...)
// createServerClient<Database>(...)
```

**Step 4: Vérifier le build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add .
git commit -m "chore: génération des types TypeScript Supabase"
```

---

## Phase 2 — Layout & pages publiques

### Task 6: Créer le layout principal (Header + Footer)

**Files:**
- Create: `src/components/ui/header.tsx`
- Create: `src/components/ui/footer.tsx`
- Create: `src/components/ui/mobile-nav.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Créer le Header**

Header responsive avec :
- Logo LFR (à gauche)
- Navigation : Accueil, Blog, Vidéos, Forum
- Liens sociaux (icônes YouTube, TikTok, Instagram, X)
- Bouton Connexion / Avatar utilisateur (si connecté)
- Menu hamburger mobile

**Step 2: Créer le Footer**

Footer avec :
- Logo + description courte
- Liens de navigation
- Liens réseaux sociaux
- Newsletter (formulaire email)
- Copyright

**Step 3: Créer la navigation mobile**

Drawer/overlay pour le menu mobile avec les mêmes liens.

**Step 4: Intégrer dans le layout**

```typescript
// src/app/layout.tsx
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 5: Vérifier visuellement sur mobile et desktop**

Run: `npm run dev`

**Step 6: Commit**

```bash
git add .
git commit -m "feat(ui): layout principal avec header et footer"
```

---

### Task 7: Page d'accueil

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/sections/latest-articles.tsx`
- Create: `src/components/sections/latest-videos.tsx`
- Create: `src/components/sections/newsletter-cta.tsx`
- Create: `src/components/sections/social-feed.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Créer la section Hero**

Section plein écran avec :
- Image/vidéo de fond (ambiance Roazhon Park)
- Titre "Le Football Rennais"
- Sous-titre / tagline
- CTA vers le forum ou la chaîne YouTube

**Step 2: Créer la section derniers articles**

Grille de 3 cartes avec les derniers articles publiés (titre, image, extrait, date).

**Step 3: Créer la section dernières vidéos**

Grille de vidéos YouTube récentes (thumbnail, titre, date).

**Step 4: Créer le CTA newsletter**

Bannière avec formulaire d'inscription email.

**Step 5: Créer la section réseaux sociaux**

Liens vers YouTube, TikTok, Instagram, X avec compteurs d'abonnés si disponible.

**Step 6: Assembler la page d'accueil**

```typescript
// src/app/page.tsx
import { Hero } from "@/components/sections/hero";
import { LatestArticles } from "@/components/sections/latest-articles";
import { LatestVideos } from "@/components/sections/latest-videos";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { SocialFeed } from "@/components/sections/social-feed";

const HomePage = () => {
  return (
    <>
      <Hero />
      <LatestArticles />
      <LatestVideos />
      <NewsletterCta />
      <SocialFeed />
    </>
  );
};

export default HomePage;
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat(accueil): page d'accueil avec hero, articles, vidéos et newsletter"
```

---

### Task 8: Page À propos

**Files:**
- Create: `src/app/a-propos/page.tsx`

**Step 1: Créer la page**

Page avec :
- Photo/présentation du créateur
- Son parcours, sa passion pour le SRFC
- Ses chiffres (abonnés, vidéos, vues)
- Les types de contenus qu'il propose
- CTA vers la chaîne YouTube et les réseaux

**Step 2: SEO — métadonnées**

```typescript
export const metadata = {
  title: "À propos | Le Football Rennais",
  description: "Découvrez Le Football Rennais, créateur de contenu passionné par le Stade Rennais.",
};
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat(a-propos): page de présentation du créateur"
```

---

## Phase 3 — Authentification

### Task 9: Pages de connexion et inscription

**Files:**
- Create: `src/app/auth/connexion/page.tsx`
- Create: `src/app/auth/inscription/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/components/ui/auth-form.tsx`
- Create: `src/lib/actions/auth.ts`

**Step 1: Créer le composant formulaire d'auth**

Composant client réutilisable avec :
- Champs email / mot de passe
- Champ username (inscription uniquement)
- Boutons OAuth (Google, Discord)
- Lien vers connexion/inscription selon le contexte

**Step 2: Créer les Server Actions pour l'auth**

```typescript
// src/lib/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signUp = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
};

export const signIn = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
```

**Step 3: Créer le callback OAuth**

```typescript
// src/app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(origin);
};
```

**Step 4: Créer les pages connexion et inscription**

Utiliser le composant `AuthForm` avec le mode approprié.

**Step 5: Mettre à jour le Header**

Afficher le bouton "Connexion" si déconnecté, l'avatar + menu dropdown si connecté.

**Step 6: Tester le flux complet**

- Inscription avec email/mot de passe
- Connexion
- Déconnexion
- Vérifier que le profil est créé dans user_profiles

**Step 7: Commit**

```bash
git add .
git commit -m "feat(auth): inscription, connexion, déconnexion et OAuth"
```

---

## Phase 4 — Blog

### Task 10: Affichage des articles (public)

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/ui/article-card.tsx`
- Create: `src/lib/queries/articles.ts`

**Step 1: Créer les fonctions de requête articles**

```typescript
// src/lib/queries/articles.ts
import { createClient } from "@/lib/supabase/server";

export const getPublishedArticles = async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
};

export const getArticleBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("slug", slug)
    .single();
  return data;
};
```

**Step 2: Créer le composant carte article**

Carte avec : image de couverture, titre, extrait, auteur, date, tags.

**Step 3: Créer la page liste des articles**

Grille responsive de cartes, pagination.

**Step 4: Créer la page article individuel**

Affichage du contenu HTML, auteur, date, tags, section commentaires.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(blog): affichage des articles et page article"
```

---

### Task 11: Commentaires sur les articles

**Files:**
- Create: `src/components/ui/comment-section.tsx`
- Create: `src/components/ui/comment-form.tsx`
- Create: `src/lib/actions/comments.ts`
- Create: `src/lib/queries/comments.ts`

**Step 1: Créer les requêtes commentaires**

Fetch des commentaires par article_id avec les profils auteurs.

**Step 2: Créer le formulaire de commentaire**

Composant client avec textarea, bouton envoyer. Affiché uniquement si connecté.

**Step 3: Créer les Server Actions**

Actions pour créer, modifier, supprimer un commentaire.

**Step 4: Créer la section commentaires**

Liste des commentaires avec auteur, date, contenu. Bouton supprimer si auteur ou modérateur.

**Step 5: Intégrer dans la page article**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(blog): système de commentaires sur les articles"
```

---

### Task 12: Dashboard admin — Gestion des articles

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/articles/page.tsx`
- Create: `src/app/admin/articles/nouveau/page.tsx`
- Create: `src/app/admin/articles/[id]/page.tsx`
- Create: `src/components/admin/article-editor.tsx`
- Create: `src/components/admin/admin-sidebar.tsx`
- Create: `src/lib/actions/articles.ts`

**Step 1: Installer TipTap**

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

**Step 2: Créer le layout admin**

Layout avec sidebar de navigation (Articles, Forum, Membres, Newsletter) + vérification du rôle admin.

**Step 3: Créer le dashboard admin**

Page avec stats : nombre d'articles, commentaires, membres, abonnés newsletter.

**Step 4: Créer l'éditeur d'articles**

Composant client avec :
- Champs titre, slug (auto-généré), catégorie, tags
- Upload image de couverture (Supabase Storage)
- Éditeur TipTap pour le contenu
- Boutons : Sauvegarder brouillon, Publier, Prévisualiser

**Step 5: Créer les Server Actions articles**

Actions pour créer, modifier, publier, supprimer un article.

**Step 6: Créer la liste des articles admin**

Tableau avec titre, statut, date, actions (éditer, supprimer, publier).

**Step 7: Tester le flux complet**

Créer un article en brouillon → prévisualiser → publier → vérifier sur /blog.

**Step 8: Commit**

```bash
git add .
git commit -m "feat(admin): dashboard et gestion des articles avec éditeur TipTap"
```

---

## Phase 5 — Forum

### Task 13: Catégories et listing du forum

**Files:**
- Create: `src/app/forum/page.tsx`
- Create: `src/app/forum/[category]/page.tsx`
- Create: `src/components/ui/category-card.tsx`
- Create: `src/components/ui/topic-row.tsx`
- Create: `src/lib/queries/forum.ts`

**Step 1: Créer les requêtes forum**

Fonctions pour :
- Lister les catégories avec compteurs
- Lister les topics d'une catégorie (paginé, topics épinglés en premier)
- Obtenir un topic par slug

**Step 2: Créer la page catégories**

Grille de cartes catégories avec : nom, description, icône, nombre de topics/posts.

**Step 3: Créer la page topics d'une catégorie**

Liste des topics avec : titre, auteur, nombre de réponses, date du dernier post. Topics épinglés en haut. Bouton "Nouveau sujet" (si connecté).

**Step 4: Commit**

```bash
git add .
git commit -m "feat(forum): catégories et listing des topics"
```

---

### Task 14: Discussion dans un topic (avec Realtime)

**Files:**
- Create: `src/app/forum/[category]/[topic]/page.tsx`
- Create: `src/components/ui/forum-post.tsx`
- Create: `src/components/ui/post-form.tsx`
- Create: `src/lib/actions/forum.ts`
- Create: `src/hooks/use-realtime-posts.ts`

**Step 1: Créer les Server Actions forum**

Actions pour :
- Créer un topic (titre + premier post)
- Créer un post dans un topic
- Modifier/supprimer un post
- Épingler/verrouiller un topic (modérateur/admin)

**Step 2: Créer le composant post**

Affichage : avatar auteur, username, badges, contenu, date. Boutons modifier/supprimer si autorisé.

**Step 3: Créer le formulaire de réponse**

Textarea avec bouton "Répondre". Désactivé si topic verrouillé.

**Step 4: Créer le hook Realtime**

```typescript
// src/hooks/use-realtime-posts.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useRealtimePosts = (topicId: string, initialPosts: ForumPost[]) => {
  const [posts, setPosts] = useState(initialPosts);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`topic-${topicId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_posts", filter: `topic_id=eq.${topicId}` },
        (payload) => {
          setPosts((prev) => [...prev, payload.new as ForumPost]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [topicId, supabase]);

  return posts;
};
```

**Step 5: Créer la page topic**

Affichage : titre, posts paginés (cursor-based), formulaire de réponse, realtime.

**Step 6: Incrémenter view_count**

Server action qui incrémente view_count à chaque visite de la page.

**Step 7: Tester le flux**

Créer un topic → poster une réponse → vérifier l'affichage realtime dans un second onglet.

**Step 8: Commit**

```bash
git add .
git commit -m "feat(forum): discussions avec posts et realtime"
```

---

### Task 15: Modération du forum (admin)

**Files:**
- Create: `src/app/admin/forum/page.tsx`
- Create: `src/components/admin/moderation-panel.tsx`

**Step 1: Créer la page de modération admin**

Liste des topics/posts signalés ou récents avec actions : supprimer, verrouiller, épingler.

**Step 2: Ajouter les boutons de modération dans le forum**

Boutons visibles uniquement pour les modérateurs/admins dans les topics et posts.

**Step 3: Commit**

```bash
git add .
git commit -m "feat(admin): modération du forum"
```

---

## Phase 6 — Profils & Badges

### Task 16: Page profil utilisateur

**Files:**
- Create: `src/app/profil/[username]/page.tsx`
- Create: `src/components/ui/profile-card.tsx`
- Create: `src/components/ui/badge-display.tsx`
- Create: `src/lib/queries/profiles.ts`

**Step 1: Créer les requêtes profil**

Fetch du profil par username avec badges et stats.

**Step 2: Créer la page profil**

Affichage : avatar, display_name, bio, rôle, badges, stats (posts, topics, date d'inscription), dernières activités (posts récents).

**Step 3: Ajouter l'édition du profil**

Si c'est son propre profil : bouton éditer, formulaire pour modifier display_name, avatar, bio.

**Step 4: Commit**

```bash
git add .
git commit -m "feat(profil): page profil utilisateur avec badges et édition"
```

---

### Task 17: Système de badges

**Files:**
- Create: `src/app/admin/membres/page.tsx`
- Create: `src/lib/actions/badges.ts`
- Create: `supabase/migrations/003_badge_triggers.sql`

**Step 1: Créer les badges par défaut**

Insérer les badges initiaux via SQL :
- "Première galette" → premier post
- "Habitué du Roazhon" → 50 posts
- "Rouge et Noir" → 1 an de membre

**Step 2: Créer les triggers d'attribution automatique**

Trigger SQL qui vérifie après chaque post si l'utilisateur atteint un seuil.

**Step 3: Créer la page admin membres**

Liste des membres avec : username, rôle, date d'inscription, posts. Actions : changer le rôle, attribuer un badge manuellement.

**Step 4: Commit**

```bash
git add .
git commit -m "feat(badges): système de badges avec attribution automatique et manuelle"
```

---

## Phase 7 — Vidéos

### Task 18: Intégration YouTube + TikTok

**Files:**
- Create: `src/app/videos/page.tsx`
- Create: `src/components/ui/video-card.tsx`
- Create: `src/components/ui/tiktok-embed.tsx`
- Create: `src/lib/youtube.ts`
- Create: `src/lib/tiktok.ts`

**Step 1: Créer le service YouTube**

```typescript
// src/lib/youtube.ts
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

export const getLatestVideos = async (maxResults = 12) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`,
    { next: { revalidate: 3600 } } // Cache 1h
  );
  const data = await res.json();
  return data.items;
};
```

**Step 2: Créer le service TikTok**

```typescript
// src/lib/tiktok.ts
export const getTikTokEmbed = async (url: string) => {
  const res = await fetch(
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
  );
  return res.json();
};
```

Note : TikTok n'a pas d'API publique pour lister les vidéos. Deux options :
- Stocker les URLs TikTok manuellement dans Supabase (table `tiktok_videos`)
- Ou embed les derniers TikToks via un lien manuel depuis l'admin

**Step 3: Créer la page vidéos**

Page avec deux onglets/sections : YouTube et TikTok.
- YouTube : grille de thumbnails cliquables, lecteur embed au clic
- TikTok : embeds des vidéos

**Step 4: Ajouter les variables d'environnement**

```env
YOUTUBE_API_KEY=xxx
YOUTUBE_CHANNEL_ID=xxx
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat(videos): intégration YouTube et TikTok"
```

---

## Phase 8 — Newsletter

### Task 19: Système de newsletter

**Files:**
- Create: `src/lib/actions/newsletter.ts`
- Create: `src/app/admin/newsletter/page.tsx`
- Create: `src/app/api/newsletter/confirm/route.ts`
- Create: `src/components/ui/newsletter-form.tsx`

**Step 1: Installer Resend**

```bash
npm install resend
```

**Step 2: Créer le formulaire d'inscription**

Composant client avec input email + bouton. Utilisé dans le footer et le CTA accueil.

**Step 3: Créer les Server Actions newsletter**

```typescript
// src/lib/actions/newsletter.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const subscribeToNewsletter = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  // Insérer dans la BDD
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") return { error: "Déjà inscrit" };
    return { error: "Erreur lors de l'inscription" };
  }

  // Envoyer l'email de confirmation
  await resend.emails.send({
    from: "Le Football Rennais <newsletter@domain.com>",
    to: email,
    subject: "Confirme ton inscription à la newsletter LFR",
    html: `<p>Clique sur le lien pour confirmer : <a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/confirm?email=${encodeURIComponent(email)}">Confirmer</a></p>`,
  });

  return { success: true };
};
```

**Step 4: Créer la route de confirmation**

Route API qui met `is_confirmed = true` dans la BDD.

**Step 5: Créer la page admin newsletter**

Interface pour :
- Voir le nombre d'abonnés confirmés
- Composer un email (sujet + contenu)
- Envoyer à tous les abonnés confirmés via Resend

**Step 6: Ajouter les variables d'environnement**

```env
RESEND_API_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://lefootballrennais.fr
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat(newsletter): inscription double opt-in et envoi via Resend"
```

---

## Phase 9 — SEO & Finitions

### Task 20: SEO & métadonnées

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: toutes les pages (metadata)

**Step 1: Métadonnées globales dans le layout**

```typescript
export const metadata: Metadata = {
  title: {
    default: "Le Football Rennais | Actu SRFC & Football",
    template: "%s | Le Football Rennais",
  },
  description: "Vlogs, débriefs et actualités du Stade Rennais et du football français.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Le Football Rennais",
  },
};
```

**Step 2: Générer le sitemap dynamique**

```typescript
// src/app/sitemap.ts
import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at")
    .eq("status", "published");

  const articleUrls = (articles ?? []).map((article) => ({
    url: `https://lefootballrennais.fr/blog/${article.slug}`,
    lastModified: article.published_at,
  }));

  return [
    { url: "https://lefootballrennais.fr", lastModified: new Date() },
    { url: "https://lefootballrennais.fr/a-propos", lastModified: new Date() },
    { url: "https://lefootballrennais.fr/blog", lastModified: new Date() },
    { url: "https://lefootballrennais.fr/videos", lastModified: new Date() },
    { url: "https://lefootballrennais.fr/forum", lastModified: new Date() },
    ...articleUrls,
  ];
};

export default sitemap;
```

**Step 3: Créer robots.txt**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
  sitemap: "https://lefootballrennais.fr/sitemap.xml",
});

export default robots;
```

**Step 4: Ajouter les métadonnées sur chaque page**

Open Graph, titre, description pour : blog, articles individuels, forum, vidéos.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(seo): métadonnées, sitemap et robots.txt"
```

---

### Task 21: Tests finaux & déploiement

**Step 1: Vérifier le build**

```bash
npm run build
npm run lint
```

**Step 2: Tester les flux principaux**

- Navigation complète
- Inscription / connexion / déconnexion
- Créer un article (admin) → lire (public) → commenter (membre)
- Créer un topic → poster → vérifier realtime
- Inscription newsletter → confirmation email
- Vérifier le responsive sur mobile

**Step 3: Configurer Vercel**

- Variables d'environnement dans Vercel Dashboard
- Domaine personnalisé si disponible

**Step 4: Déployer**

```bash
vercel --prod
```

**Step 5: Commit final**

```bash
git add .
git commit -m "chore: préparation au déploiement"
```

---

## Résumé des phases

| Phase | Description | Tasks |
|-------|-------------|-------|
| 1 | Setup & infrastructure | 1-5 |
| 2 | Layout & pages publiques | 6-8 |
| 3 | Authentification | 9 |
| 4 | Blog | 10-12 |
| 5 | Forum | 13-15 |
| 6 | Profils & Badges | 16-17 |
| 7 | Vidéos | 18 |
| 8 | Newsletter | 19 |
| 9 | SEO & Finitions | 20-21 |
