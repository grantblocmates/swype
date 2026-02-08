"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface QuizOptionProps {
  icon: ReactNode;
  iconBgClass: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function QuizOption({
  icon,
  iconBgClass,
  label,
  description,
  selected,
  onSelect,
}: QuizOptionProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative w-full text-left rounded-2xl p-6 border-2 transition-all duration-200 ease-out ${
        selected
          ? "border-primary bg-primary/5 shadow-card-hover"
          : "bg-surface border-border hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5"
      }`}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" weight="bold" />
        </div>
      )}

      {/* Icon circle */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        selected ? iconBgClass.replace('/12', '/20') : iconBgClass
      }`}>
        {icon}
      </div>

      <span className="text-lg font-display font-semibold text-dark block">
        {label}
      </span>
      {description && (
        <span className="text-sm text-muted font-body mt-1 block">
          {description}
        </span>
      )}
    </motion.button>
  );
}
