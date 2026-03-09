"use client";

import { useEffect } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
}

export const MobileNav = ({
  isOpen,
  onClose,
  navLinks,
  socialLinks,
}: MobileNavProps) => {
  /* Empêcher le scroll du body quand le menu est ouvert */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay sombre */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panneau de navigation */}
      <nav className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-gray-950 p-6 shadow-xl">
        {/* En-tête avec logo et bouton fermer */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            <span className="text-[#E30613]">LFR</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Fermer le menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Liens de navigation */}
        <div className="mt-8 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-lg font-medium text-gray-200 transition-colors hover:text-[#E30613]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Séparateur */}
        <div className="my-6 h-px bg-white/10" />

        {/* Bouton connexion */}
        <Link
          href="/auth/connexion"
          onClick={onClose}
          className="rounded-md bg-[#E30613] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c00510]"
        >
          Connexion
        </Link>

        {/* Réseaux sociaux */}
        <div className="mt-auto flex items-center justify-center gap-5 pt-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-gray-400 transition-colors hover:text-[#E30613]"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};
