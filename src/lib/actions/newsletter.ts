"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lefootballrennais.fr";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Le Football Rennais <onboarding@resend.dev>";

export const subscribeToNewsletter = async (
  formData: FormData
): Promise<{ error: string | null; success: boolean }> => {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { error: "Cette adresse est déjà inscrite.", success: false };
    }
    return { error: "Erreur lors de l'inscription.", success: false };
  }

  // Email de confirmation
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Confirme ton inscription à la newsletter LFR 🔴⚫",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px;">
        <h2 style="color: #E30613;">Le Football Rennais</h2>
        <p>Merci de ton inscription ! Clique sur le bouton ci-dessous pour confirmer ton adresse email.</p>
        <a href="${SITE_URL}/api/newsletter/confirm?email=${encodeURIComponent(email)}"
           style="display: inline-block; background: #E30613; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Confirmer mon inscription
        </a>
        <p style="color: #666; font-size: 12px;">Si tu n'as pas demandé cette inscription, tu peux ignorer cet email.</p>
      </div>
    `,
  });

  return { error: null, success: true };
};

export const sendNewsletter = async (
  formData: FormData
): Promise<{ error: string | null; sent: number }> => {
  // Vérification admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié.", sent: 0 };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();
  if (profile?.role !== "admin") return { error: "Non autorisé.", sent: 0 };

  const subject = (formData.get("subject") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!subject) return { error: "Le sujet est requis.", sent: 0 };
  if (!content) return { error: "Le contenu est requis.", sent: 0 };

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("is_confirmed", true)
    .is("unsubscribed_at", null);

  if (!subscribers || subscribers.length === 0) {
    return { error: "Aucun abonné confirmé.", sent: 0 };
  }

  // Envoi par batch de 50
  const emails = subscribers.map((s) => s.email);
  let sent = 0;

  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50);
    await resend.emails.send({
      from: FROM_EMAIL,
      bcc: batch,
      to: FROM_EMAIL,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px;">
          <h2 style="color: #E30613;">Le Football Rennais</h2>
          ${content}
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #999; font-size: 11px;">
            Pour te désabonner : <a href="${SITE_URL}/api/newsletter/unsubscribe?email={{email}}">cliquer ici</a>
          </p>
        </div>
      `,
    });
    sent += batch.length;
  }

  return { error: null, sent };
};
