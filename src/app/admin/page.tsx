"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Plus, Pencil, Trash2, Layers } from "lucide-react";

interface AdminCard {
  id: string;
  name: string;
  slug: string;
  issuer: string;
  card_type: string;
  is_active: boolean;
  display_order: number;
  tiers?: { id: string; name: string; monthly_fee: number; tier_order: number }[];
}

export default function AdminDashboard() {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      loadCards();
    } else {
      setError("Invalid password");
    }
  }

  async function loadCards() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cards");
      const data = await res.json();
      setCards(data);
    } catch {
      console.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/cards/${id}`, { method: "DELETE" });
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete card");
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
      loadCards();
    } else {
      setLoading(false);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-card-bg border border-card-border rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-bold text-white">Swype Admin</h1>
          </div>
          <label className="block text-sm text-zinc-400 mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent"
          />
          {error && <p className="text-danger text-xs mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" />
          <h1 className="text-xl font-bold text-white">Swype Admin</h1>
        </div>
        <Link
          href="/admin/cards/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400">No cards yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-card-bg border border-card-border rounded-xl"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {card.name}
                  </h3>
                  {!card.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-danger/20 text-danger">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {card.issuer} &middot; {card.card_type.replace("_", " ")}{" "}
                  &middot; {card.tiers?.length || 0} tier(s)
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/cards/${card.id}/edit`}
                  className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(card.id, card.name)}
                  className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
