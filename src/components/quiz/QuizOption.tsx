"use client";

import { motion } from "framer-motion";

interface QuizOptionProps {
  emoji: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function QuizOption({
  emoji,
  label,
  description,
  selected,
  onSelect,
}: QuizOptionProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`w-full text-left rounded-2xl p-6 border-2 transition-colors ${
        selected
          ? "bg-accent border-accent text-white shadow-card-hover"
          : "bg-card-bg border-card-border text-foreground shadow-card hover:border-accent/40 hover:shadow-card-hover"
      }`}
    >
      <span className="text-2xl mb-2 block">{emoji}</span>
      <span className={`text-base font-semibold block ${selected ? "text-white" : "text-foreground"}`}>
        {label}
      </span>
      {description && (
        <span className={`text-sm mt-1 block ${selected ? "text-white/70" : "text-muted"}`}>
          {description}
        </span>
      )}
    </motion.button>
  );
}
