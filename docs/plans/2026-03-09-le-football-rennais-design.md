# Design — Le Football Rennais

## Contexte

Site web pour "Le Football Rennais" (LFR), créateur de contenu YouTube/TikTok/Instagram/X centré sur le Stade Rennais et le football français. 4,2k abonnés, 333 vidéos, 775k vues.

**Objectifs** : Site vitrine professionnel + hub communautaire avec engagement.

## Architecture générale

```
Vercel (Next.js App Router)
    │
    ├── Pages publiques (SSG/ISR) : Accueil, À propos
    ├── Pages dynamiques (SSR) : Blog, Forum, Dashboard admin
    └── Interactions client : Forum realtime, formulaires, commentaires
    │
    ▼
Supabase (PostgreSQL + Auth + Storage + Realtime)
    │
    ▼
Services externes : Resend (newsletter), YouTube Data API v3, TikTok oEmbed
```

## Stack technique

| Élément       | Choix                              |
|---------------|------------------------------------|
| Framework     | Next.js 15 (App Router)            |
| Langage       | TypeScript (strict)                |
| Styling       | Tailwind CSS                       |
| BDD           | PostgreSQL (Supabase)              |
| Auth          | Supabase Auth                      |
| Storage       | Supabase Storage                   |
| Realtime      | Supabase Realtime                  |
| ORM           | Supabase JS Client                 |
| Éditeur       | TipTap                             |
| Newsletter    | Resend                             |
| Vidéos        | YouTube Data API v3 + TikTok oEmbed|
| Hébergement   | Vercel                             |
| Package mgr   | npm                                |

## Structure des routes

```
app/
├── page.tsx                           # Accueil
├── a-propos/page.tsx                  # À propos
├── blog/
│   ├── page.tsx                       # Liste des articles
│   └── [slug]/page.tsx                # Article individuel
├── videos/page.tsx                    # Galerie vidéos (YouTube + TikTok)
├── forum/
│   ├── page.tsx                       # Catégories du forum
│   ├── [category]/page.tsx            # Topics d'une catégorie
│   └── [category]/[topic]/page.tsx    # Discussion
├── auth/
│   ├── connexion/page.tsx
│   └── inscription/page.tsx
├── profil/
│   └── [username]/page.tsx            # Profil membre
├── admin/
│   ├── page.tsx                       # Dashboard
│   ├── articles/page.tsx              # Gestion articles
│   ├── forum/page.tsx                 # Modération forum
│   ├── membres/page.tsx               # Gestion membres
│   └── newsletter/page.tsx            # Envoi newsletter
```

## Schéma de base de données

### user_profiles
- `id` (FK auth.users) — PK
- `username` (unique)
- `display_name`
- `avatar_url`
- `bio`
- `role` (member / moderator / admin)
- `post_count`
- `topic_count`
- `created_at`

### articles
- `id` — PK
- `title`
- `slug` (unique)
- `content` (text, rich text HTML)
- `excerpt`
- `cover_image_url`
- `author_id` (FK user_profiles)
- `category`
- `tags` (text[])
- `status` (draft / published)
- `published_at`
- `created_at`

### comments
- `id` — PK
- `article_id` (FK articles)
- `author_id` (FK user_profiles)
- `content`
- `created_at`
- `updated_at`

### forum_categories
- `id` — PK
- `name`
- `slug` (unique)
- `description`
- `icon`
- `position` (ordre d'affichage)
- `topic_count`
- `post_count`

### forum_topics
- `id` — PK
- `category_id` (FK forum_categories)
- `author_id` (FK user_profiles)
- `title`
- `slug` (unique)
- `is_pinned`
- `is_locked`
- `view_count`
- `post_count`
- `last_post_at`
- `created_at`

### forum_posts
- `id` — PK
- `topic_id` (FK forum_topics)
- `author_id` (FK user_profiles)
- `content`
- `is_edited`
- `created_at`
- `updated_at`

### badges
- `id` — PK
- `name`
- `description`
- `icon_url`
- `condition` (description de la condition d'obtention)
- `created_at`

### user_badges
- `user_id` (FK user_profiles)
- `badge_id` (FK badges)
- `awarded_at`
- PK composite (user_id, badge_id)

### newsletter_subscribers
- `id` — PK
- `email` (unique)
- `is_confirmed`
- `created_at`
- `unsubscribed_at`

### Sécurité BDD
- Row Level Security (RLS) sur toutes les tables
- Les membres ne modifient que leurs propres contenus
- Seuls admin/moderator peuvent modérer le forum
- Seul admin accède au dashboard

## Fonctionnalités détaillées

### Authentification
- Supabase Auth : email/mot de passe + OAuth (Google, Discord)
- Création automatique du user_profile via trigger Supabase
- 3 rôles : member, moderator, admin
- Middleware Next.js pour protéger /admin/* et /profil/*

### Blog & Dashboard admin
- Éditeur TipTap (rich text)
- Upload d'images via Supabase Storage
- Tags et catégories
- Preview + planification (published_at)
- Stats dashboard : articles, commentaires, membres

### Forum
- Catégories créées par l'admin (ex: "Matchs SRFC", "Ligue 1", "Transferts", "Hors-sujet")
- Topics créés par les membres, réponses en posts
- Modération : épingler, verrouiller, supprimer (moderator + admin)
- Realtime via Supabase Realtime (nouveaux posts en temps réel)
- Pagination cursor-based

### Badges
- Attribution manuelle (admin) ou automatique (triggers) :
  - "Première galette" → premier post
  - "Habitué du Roazhon" → 50 posts
  - "Rouge et Noir" → 1 an de membre
- Affichés sur le profil et dans le forum

### Intégration vidéos
- YouTube : fetch via YouTube Data API v3, affichage grille + embed
- TikTok : embed via oEmbed API
- Cache ISR (revalidation toutes les heures)
- Filtrage par catégorie (vlogs, débriefs, lives)

### Newsletter
- Double opt-in (confirmation par email)
- Envoi via Resend
- Interface admin pour composer et envoyer

### Réseaux sociaux
- Barre de liens sociaux persistante (header/footer) : YouTube, TikTok, Instagram, X
- Section accueil avec derniers contenus de chaque plateforme
- Boutons de partage sur les articles

## Identité visuelle
- Charte graphique existante du client à respecter (logo, couleurs)
- Responsive mobile-first
- Performance : next/image, lazy loading, minimum JS client
