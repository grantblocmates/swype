"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface QuizOptionProps {
  icon: ReactNode;
  iconBgClass: string;
  accentColor?: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function QuizOption({
  icon,
  iconBgClass,
  accentColor,
  label,
  description,
  selected,
  onSelect,
}: QuizOptionProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={`relative w-full text-left rounded-3xl p-7 transition-all duration-200 ease-out overflow-hidden ${
        selected
          ? "border-2 border-primary shadow-card-hover"
          : "border border-border shadow-card hover:shadow-card-hover hover:-translate-y-[2px] hover:border-border-strong"
      }`}
      style={{ background: "#FFFFFF" }}
    >
      {/* Subtle inner glow - accent colour radial gradient */}
      <div
        className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          opacity: selected ? 0.06 : 0.04,
          background: accentColor
            ? `radial-gradient(circle at 0% 0%, ${accentColor}, transparent 70%)`
            : undefined,
        }}
      />

      {/* Selected: primary wash gradient */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(64, 112, 118, 0.03), transparent 70%)",
          }}
        />
      )}

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute top-4 right-4 w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center"
        >
          <Check size={12} className="text-white" weight="bold" />
        </motion.div>
      )}

      {/* Icon circle */}
      <div
        className={`relative z-[1] w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
          selected ? iconBgClass.replace("/10", "/20").replace("/12", "/20") : iconBgClass
        }`}
      >
        {icon}
      </div>

      <span className="relative z-[1] text-lg font-display font-semibold text-dark block">
        {label}
      </span>
      {description && (
        <span className="relative z-[1] text-sm text-muted font-body mt-1 block">
          {description}
        </span>
      )}
    </motion.button>
  );
}
