"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedCards } from "@/context/SavedCardsContext";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Quiz" },
  { href: "/browse", label: "Browse" },
  { href: "/compare", label: "Compare" },
];

export default function Header() {
  const pathname = usePathname();
  const { savedCount } = useSavedCards();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold text-dark tracking-tight">
            Swype
          </span>
          <span className="text-xs text-muted font-body font-normal">
            by blocmates
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-5 py-2 rounded-full text-sm font-display font-medium transition-all ${
                  isActive
                    ? "bg-dark text-white"
                    : "text-dark hover:text-primary"
                }`}
              >
                {item.label}
                {item.href === "/compare" && savedCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-yellow text-dark text-[10px] font-display font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-dark hover:bg-subtle transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X size={22} weight="bold" />
          ) : (
            <List size={22} weight="bold" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-sm font-display font-medium transition-colors ${
                  isActive
                    ? "bg-dark text-white"
                    : "text-dark hover:text-primary"
                }`}
              >
                {item.label}
                {item.href === "/compare" && savedCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-yellow text-dark text-[10px] font-display font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
