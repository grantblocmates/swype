"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminCardForm from "@/components/AdminCardForm";
import { Loader2 } from "lucide-react";

export default function EditCardPage() {
  const params = useParams();
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/cards/${params.id}`);
        const data = await res.json();
        setCardData(data);
      } catch {
        console.error("Failed to load card");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Card not found.</p>
      </div>
    );
  }

  return <AdminCardForm initialData={cardData} />;
}
