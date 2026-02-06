"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedCards } from "@/context/SavedCardsContext";

const navItems = [
  { href: "/", label: "Browse" },
  { href: "/compare", label: "Compare" },
];

export default function Header() {
  const pathname = usePathname();
  const { savedCount } = useSavedCards();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-card-border shadow-[0_1px_4px_rgba(20,17,15,0.05)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-foreground text-lg tracking-tight">
            Swype
          </span>
          <span className="text-[10px] text-muted font-medium">
            by blocmates
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted border-card-border hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {item.label}
                {item.href === "/compare" && savedCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-[10px] font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
