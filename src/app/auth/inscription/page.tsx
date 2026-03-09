import type { Metadata } from "next";
import { AuthForm } from "@/components/ui/auth-form";

export const metadata: Metadata = {
  title: "Inscription | Le Football Rennais",
};

const InscriptionPage = () => {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <AuthForm mode="inscription" />
    </section>
  );
};

export default InscriptionPage;
