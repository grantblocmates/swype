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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_4px_rgba(20,17,15,0.05)]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl text-foreground tracking-tight">
            Swype
          </span>
          <span className="text-[10px] text-muted font-body font-medium">
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
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground hover:bg-gray-100"
                }`}
              >
                {item.label}
                {item.href === "/compare" && savedCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-yellow text-dark text-[10px] font-bold">
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
          className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-gray-100 transition-colors"
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
        <div className="sm:hidden border-t border-gray-100 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground hover:bg-gray-100"
                }`}
              >
                {item.label}
                {item.href === "/compare" && savedCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-yellow text-dark text-[10px] font-bold">
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
