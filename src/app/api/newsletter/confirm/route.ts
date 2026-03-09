import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lefootballrennais.fr";

export const GET = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.redirect(`${SITE_URL}?newsletter=error`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_confirmed: true })
    .eq("email", email.toLowerCase());

  if (error) {
    return NextResponse.redirect(`${SITE_URL}?newsletter=error`);
  }

  return NextResponse.redirect(`${SITE_URL}?newsletter=confirmed`);
};
