/**
 * Types TypeScript correspondant au schema SQL Supabase.
 * Générés manuellement pour l'instant, pourront etre remplacés
 * par `supabase gen types typescript` une fois le projet connecté.
 */

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: "member" | "moderator" | "admin";
          post_count: number;
          topic_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "member" | "moderator" | "admin";
          post_count?: number;
          topic_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "member" | "moderator" | "admin";
          post_count?: number;
          topic_count?: number;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image_url: string | null;
          author_id: string | null;
          category: string | null;
          tags: string[];
          status: "draft" | "published";
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image_url?: string | null;
          author_id?: string | null;
          category?: string | null;
          tags?: string[];
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image_url?: string | null;
          author_id?: string | null;
          category?: string | null;
          tags?: string[];
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          article_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          author_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          position: number;
          topic_count: number;
          post_count: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          position?: number;
          topic_count?: number;
          post_count?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          position?: number;
          topic_count?: number;
          post_count?: number;
        };
      };
      forum_topics: {
        Row: {
          id: string;
          category_id: string;
          author_id: string;
          title: string;
          slug: string;
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          post_count: number;
          last_post_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          author_id: string;
          title: string;
          slug: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          post_count?: number;
          last_post_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          post_count?: number;
          last_post_at?: string;
          created_at?: string;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          topic_id: string;
          author_id: string;
          content: string;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          author_id: string;
          content: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          author_id?: string;
          content?: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          condition: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          condition?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          condition?: string | null;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
          awarded_at: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          awarded_at?: string;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
          awarded_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          is_confirmed: boolean;
          created_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          is_confirmed?: boolean;
          created_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          is_confirmed?: boolean;
          created_at?: string;
          unsubscribed_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
};

// Types utilitaires pour simplifier l'utilisation
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
