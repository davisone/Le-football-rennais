import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SendNewsletterForm } from "@/components/admin/send-newsletter-form";

export const metadata: Metadata = {
  title: "Newsletter | Admin — Le Football Rennais",
};

const AdminNewsletterPage = async () => {
  const supabase = await createClient();
  const { count: confirmedCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("is_confirmed", true)
    .is("unsubscribed_at", null);

  const { count: totalCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Newsletter</h1>
        <p className="mt-1 text-sm text-gray-400">
          {confirmedCount ?? 0} abonné{(confirmedCount ?? 0) !== 1 ? "s" : ""} confirmé
          {(confirmedCount ?? 0) !== 1 ? "s" : ""} ·{" "}
          {totalCount ?? 0} inscription{(totalCount ?? 0) !== 1 ? "s" : ""} au total
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
        <h2 className="mb-5 font-semibold text-white">Envoyer un email</h2>
        <SendNewsletterForm />
      </div>
    </div>
  );
};

export default AdminNewsletterPage;
