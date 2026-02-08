"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";
import QuizProgress from "./QuizProgress";
import QuizOption from "./QuizOption";
import { answersToParams } from "@/lib/quiz-logic";
import type { QuizAnswers } from "@/lib/types";

interface QuestionDef {
  id: keyof QuizAnswers;
  title: string;
  multiSelect: boolean;
  options: { value: string; emoji: string; label: string; description?: string }[];
}

const QUESTIONS: QuestionDef[] = [
  {
    id: "region",
    title: "Where are you based?",
    multiSelect: false,
    options: [
      { value: "US", emoji: "\u{1F1FA}\u{1F1F8}", label: "United States" },
      { value: "EU", emoji: "\u{1F1EA}\u{1F1FA}", label: "Europe (EU/EEA)" },
      { value: "UK", emoji: "\u{1F1EC}\u{1F1E7}", label: "United Kingdom" },
      { value: "OTHER", emoji: "\u{1F30D}", label: "Somewhere else" },
    ],
  },
  {
    id: "priorities",
    title: "What matters most to you?",
    multiSelect: true,
    options: [
      { value: "cashback", emoji: "\u{1F4B0}", label: "Best cashback & rewards", description: "Earn on every purchase" },
      { value: "self_custody", emoji: "\u{1F510}", label: "Self-custody (my keys)", description: "You hold your own crypto" },
      { value: "no_fees", emoji: "\u{1F193}", label: "No fees, no staking", description: "Simple and free to use" },
      { value: "borrow", emoji: "\u{1F3E6}", label: "Borrow against my crypto", description: "Spend without selling" },
    ],
  },
  {
    id: "staking",
    title: "Happy to stake tokens for better perks?",
    multiSelect: false,
    options: [
      { value: "yes", emoji: "\u2705", label: "Yeah, if the rewards are worth it", description: "Higher cashback, more perks" },
      { value: "no", emoji: "\u274C", label: "No, I don't want to lock anything", description: "Keep it simple" },
      { value: "unsure", emoji: "\u{1F937}", label: "Not sure what staking means", description: "We'll keep it beginner-friendly" },
    ],
  },
  {
    id: "usage",
    title: "How do you plan to use the card?",
    multiSelect: true,
    options: [
      { value: "everyday", emoji: "\u{1F6D2}", label: "Everyday spending", description: "Groceries, online, subscriptions" },
      { value: "travel", emoji: "\u2708\uFE0F", label: "Travel & spending abroad", description: "Multi-currency, low FX fees" },
      { value: "atm", emoji: "\u{1F4B8}", label: "ATM cash withdrawals", description: "Free or cheap cash access" },
      { value: "trying", emoji: "\u{1F9EA}", label: "Just trying crypto spending", description: "Easy onboarding, no commitment" },
    ],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function QuizContainer() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    region: null,
    priorities: [],
    staking: null,
    usage: [],
  });

  const question = QUESTIONS[step];

  const handleSelect = useCallback(
    (value: string) => {
      const qid = question.id;

      if (question.multiSelect) {
        setAnswers((prev) => {
          const arr = prev[qid] as string[];
          const next = arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value];
          return { ...prev, [qid]: next };
        });
      } else {
        setAnswers((prev) => ({ ...prev, [qid]: value }));

        // Auto-advance after brief delay for single-select
        setTimeout(() => {
          if (step < QUESTIONS.length - 1) {
            setDirection(1);
            setStep((s) => s + 1);
          } else {
            // Last question - go to results
            const finalAnswers = { ...answers, [qid]: value };
            router.push(`/results?${answersToParams(finalAnswers as QuizAnswers)}`);
          }
        }, 300);
      }
    },
    [question, step, answers, router]
  );

  const handleContinue = useCallback(() => {
    if (step < QUESTIONS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      router.push(`/results?${answersToParams(answers)}`);
    }
  }, [step, answers, router]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleSkip = useCallback(() => {
    if (step < QUESTIONS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      router.push(`/results?${answersToParams(answers)}`);
    }
  }, [step, answers, router]);

  const isSelected = (value: string): boolean => {
    const val = answers[question.id];
    if (Array.isArray(val)) return (val as string[]).includes(value);
    return val === value;
  };

  const hasSelection = (): boolean => {
    const val = answers[question.id];
    if (Array.isArray(val)) return val.length > 0;
    return val !== null;
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Progress */}
      <div className="mb-10">
        <QuizProgress currentStep={step} totalSteps={QUESTIONS.length} />
      </div>

      {/* Back button */}
      <div className="h-8 mb-4">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" weight="bold" />
            Back
          </button>
        )}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl font-display text-foreground text-center mb-8">
            {question.title}
          </h2>

          {/* Options grid */}
          <div className={`grid gap-3 ${question.options.length <= 3 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            {question.options.map((opt) => (
              <QuizOption
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                description={opt.description}
                selected={isSelected(opt.value)}
                onSelect={() => handleSelect(opt.value)}
              />
            ))}
          </div>

          {/* Multi-select continue button */}
          {question.multiSelect && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={handleContinue}
                disabled={!hasSelection()}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
                  hasSelection()
                    ? "bg-primary text-white hover:bg-primary-hover shadow-card"
                    : "bg-subtle text-muted-light cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          )}

          {/* Skip link */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
            >
              Not sure / Show me everything
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
