"use client";

import { ListBullets, Cards } from "@phosphor-icons/react";

export type BrowseView = "list" | "matchmaker";

interface ViewToggleProps {
  view: BrowseView;
  onChange: (view: BrowseView) => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-subtle rounded-full p-1 border border-border">
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
          view === "list"
            ? "bg-dark text-white shadow-sm"
            : "text-muted hover:text-dark"
        }`}
      >
        <ListBullets className="w-4 h-4" weight="bold" />
        List View
      </button>
      <button
        onClick={() => onChange("matchmaker")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
          view === "matchmaker"
            ? "bg-dark text-white shadow-sm"
            : "text-muted hover:text-dark"
        }`}
      >
        <Cards className="w-4 h-4" weight="bold" />
        Matchmaker
      </button>
    </div>
  );
}
