"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import type { TierCardPreview } from "@/lib/types";
import CardPreview from "./CardPreview";
import { Heart, X } from "lucide-react";

interface SwipeableCardProps {
  card: TierCardPreview;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  direction: number;
}

const SWIPE_THRESHOLD = 100;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : direction < 0 ? -300 : 0,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    rotate: direction > 0 ? 12 : -12,
    scale: 0.95,
    transition: { duration: 0.3 },
  }),
};

export default function SwipeableCard({
  card,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  direction,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);

  // Indicator opacities
  const saveOpacity = useTransform(x, [0, 60, 130], [0, 0.4, 1]);
  const skipOpacity = useTransform(x, [-130, -60, 0], [1, 0.4, 0]);

  // Save/skip tint overlays
  const saveBg = useTransform(
    x,
    [0, 60, 150],
    ["rgba(64,112,118,0)", "rgba(64,112,118,0.03)", "rgba(64,112,118,0.08)"]
  );
  const skipBg = useTransform(
    x,
    [-150, -60, 0],
    ["rgba(165,63,43,0.08)", "rgba(165,63,43,0.03)", "rgba(165,63,43,0)"]
  );

  function handleDragEnd(_: any, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      onSwipeRight();
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      onSwipeLeft();
    }
  }

  return (
    <motion.div
      className="cursor-grab active:cursor-grabbing"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{
        x,
        rotate,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onClick={onTap}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {/* Swipe indicators */}
      <motion.div
        className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-white font-bold shadow-lg"
        style={{ opacity: saveOpacity }}
      >
        <Heart className="w-5 h-5" />
        SAVE
      </motion.div>
      <motion.div
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-white font-bold shadow-lg"
        style={{ opacity: skipOpacity }}
      >
        <X className="w-5 h-5" />
        SKIP
      </motion.div>

      <motion.div
        className="bg-card-bg border border-card-border rounded-3xl p-7 shadow-card-lg relative overflow-hidden"
        style={{ background: saveBg }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{ background: skipBg }}
        />
        <div className="relative">
          <CardPreview card={card} />
        </div>
      </motion.div>
    </motion.div>
  );
}
