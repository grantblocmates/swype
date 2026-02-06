"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import type { CardPreviewData } from "@/lib/types";
import CardPreview from "./CardPreview";
import { Heart, X } from "lucide-react";

interface SwipeableCardProps {
  card: CardPreviewData;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  isTop: boolean;
  index: number;
}

const SWIPE_THRESHOLD = 120;

export default function SwipeableCard({
  card,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  isTop,
  index,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-300, -100, 0, 100, 300],
    [0.5, 1, 1, 1, 0.5]
  );

  // Indicator opacities
  const saveOpacity = useTransform(x, [0, 80, 150], [0, 0.5, 1]);
  const skipOpacity = useTransform(x, [-150, -80, 0], [1, 0.5, 0]);

  function handleDragEnd(_: any, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      onSwipeRight();
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      onSwipeLeft();
    }
  }

  // Stack effect: cards behind are slightly scaled down and offset
  const stackScale = 1 - index * 0.04;
  const stackY = index * 8;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        scale: stackScale,
        y: stackY,
        zIndex: 50 - index,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      onClick={isTop ? onTap : undefined}
      initial={isTop ? { scale: 0.95, opacity: 0 } : false}
      animate={{
        scale: stackScale,
        y: stackY,
        opacity: index < 4 ? 1 : 0,
      }}
      exit={{
        x: x.get() > 0 ? 400 : -400,
        opacity: 0,
        rotate: x.get() > 0 ? 20 : -20,
        transition: { duration: 0.3 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <motion.div
            className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full bg-success/90 px-4 py-2 text-white font-bold shadow-lg"
            style={{ opacity: saveOpacity }}
          >
            <Heart className="w-5 h-5" />
            SAVE
          </motion.div>
          <motion.div
            className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-danger/90 px-4 py-2 text-white font-bold shadow-lg"
            style={{ opacity: skipOpacity }}
          >
            <X className="w-5 h-5" />
            SKIP
          </motion.div>
        </>
      )}

      <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-xl h-full">
        <CardPreview card={card} />
      </div>
    </motion.div>
  );
}
