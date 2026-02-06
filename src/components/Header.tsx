"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedCards } from "@/context/SavedCardsContext";
import { Layers } from "lucide-react";

const navItems = [
  { href: "/", label: "Browse" },
  { href: "/compare", label: "Compare" },
];

export default function Header() {
  const pathname = usePathname();
  const { savedCount } = useSavedCards();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" />
          <span className="font-bold text-white text-sm">
            Swype
          </span>
          <span className="text-[10px] text-zinc-500 font-medium">
            by blocmates
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
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
