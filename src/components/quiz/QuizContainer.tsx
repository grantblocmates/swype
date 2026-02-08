"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Compass,
  ShoppingCart,
  AirplaneTilt,
  Bank,
  Sparkle,
  Percent,
  CurrencyDollar,
  ShieldCheck,
  Lightning,
  HandPalm,
  Coins,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import QuizProgress from "./QuizProgress";
import QuizOption from "./QuizOption";
import { answersToParams } from "@/lib/quiz-logic";
import type { QuizAnswers } from "@/lib/types";

interface OptionDef {
  value: string;
  label: string;
  description?: string;
  icon: ReactNode;
  iconBgClass: string;
  accentColor: string;
}

interface QuestionDef {
  id: keyof QuizAnswers;
  title: string;
  multiSelect: boolean;
  options: OptionDef[];
}

const QUESTIONS: QuestionDef[] = [
  {
    id: "region",
    title: "Where are you based?",
    multiSelect: false,
    options: [
      {
        value: "US",
        label: "United States",
        icon: <MapPin size={24} weight="duotone" className="text-accent-ruby" />,
        iconBgClass: "bg-accent-ruby/10",
        accentColor: "#FC6E48",
      },
      {
        value: "EU",
        label: "Europe (EU/EEA)",
        icon: <Globe size={24} weight="duotone" className="text-accent-ocean" />,
        iconBgClass: "bg-accent-ocean/10",
        accentColor: "#4E76D0",
      },
      {
        value: "UK",
        label: "United Kingdom",
        icon: <MapPin size={24} weight="duotone" className="text-accent-lavender" />,
        iconBgClass: "bg-accent-lavender/10",
        accentColor: "#4F467F",
      },
      {
        value: "OTHER",
        label: "Somewhere else",
        icon: <Compass size={24} weight="duotone" className="text-accent-emerald" />,
        iconBgClass: "bg-accent-emerald/10",
        accentColor: "#00936D",
      },
    ],
  },
  {
    id: "priorities",
    title: "What matters most to you?",
    multiSelect: true,
    options: [
      {
        value: "cashback",
        label: "Maximum cashback",
        description: "Earn on every purchase",
        icon: <Percent size={24} weight="duotone" className="text-accent-emerald" />,
        iconBgClass: "bg-accent-emerald/10",
        accentColor: "#00936D",
      },
      {
        value: "self_custody",
        label: "Self-custody (my keys)",
        description: "You hold your own crypto",
        icon: <ShieldCheck size={24} weight="duotone" className="text-accent-ocean" />,
        iconBgClass: "bg-accent-ocean/10",
        accentColor: "#4E76D0",
      },
      {
        value: "no_fees",
        label: "Low or zero fees",
        description: "Simple and free to use",
        icon: <CurrencyDollar size={24} weight="duotone" className="text-accent-yellow" />,
        iconBgClass: "bg-accent-yellow/10",
        accentColor: "#FFB500",
      },
      {
        value: "borrow",
        label: "DeFi features",
        description: "Spend without selling",
        icon: <Lightning size={24} weight="duotone" className="text-accent-lavender" />,
        iconBgClass: "bg-accent-lavender/10",
        accentColor: "#4F467F",
      },
    ],
  },
  {
    id: "staking",
    title: "Happy to stake tokens for better perks?",
    multiSelect: false,
    options: [
      {
        value: "yes",
        label: "Yeah, if the rewards are worth it",
        description: "Higher cashback, more perks",
        icon: <Coins size={24} weight="duotone" className="text-accent-yellow" />,
        iconBgClass: "bg-accent-yellow/10",
        accentColor: "#FFB500",
      },
      {
        value: "no",
        label: "No, I don\u2019t want to lock anything",
        description: "Keep it simple",
        icon: <HandPalm size={24} weight="duotone" className="text-accent-ruby" />,
        iconBgClass: "bg-accent-ruby/10",
        accentColor: "#FC6E48",
      },
      {
        value: "unsure",
        label: "Not sure what staking means",
        description: "We\u2019ll keep it beginner-friendly",
        icon: <Sparkle size={24} weight="duotone" className="text-accent-grape" />,
        iconBgClass: "bg-accent-grape/10",
        accentColor: "#8885D2",
      },
    ],
  },
  {
    id: "usage",
    title: "How do you plan to use the card?",
    multiSelect: true,
    options: [
      {
        value: "everyday",
        label: "Everyday spending",
        description: "Groceries, online, subscriptions",
        icon: <ShoppingCart size={24} weight="duotone" className="text-accent-yellow" />,
        iconBgClass: "bg-accent-yellow/10",
        accentColor: "#FFB500",
      },
      {
        value: "travel",
        label: "Travel & spending abroad",
        description: "Multi-currency, low FX fees",
        icon: <AirplaneTilt size={24} weight="duotone" className="text-accent-ocean" />,
        iconBgClass: "bg-accent-ocean/10",
        accentColor: "#4E76D0",
      },
      {
        value: "atm",
        label: "ATM cash withdrawals",
        description: "Free or cheap cash access",
        icon: <Bank size={24} weight="duotone" className="text-accent-emerald" />,
        iconBgClass: "bg-accent-emerald/10",
        accentColor: "#00936D",
      },
      {
        value: "trying",
        label: "Just trying crypto spending",
        description: "Easy onboarding, no commitment",
        icon: <Sparkle size={24} weight="duotone" className="text-accent-grape" />,
        iconBgClass: "bg-accent-grape/10",
        accentColor: "#8885D2",
      },
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

        setTimeout(() => {
          if (step < QUESTIONS.length - 1) {
            setDirection(1);
            setStep((s) => s + 1);
          } else {
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
    <div className="max-w-[640px] mx-auto px-4">
      {/* Progress */}
      <div className="mb-14">
        <QuizProgress currentStep={step} totalSteps={QUESTIONS.length} />
      </div>

      {/* Back button */}
      <div className="h-8 mb-8">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-muted font-body hover:text-dark transition-colors"
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-dark text-center mb-10 tracking-[-0.02em]">
            {question.title}
          </h2>

          {/* Options grid */}
          <div className={`grid gap-4 ${question.options.length <= 3 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
            {question.options.map((opt) => (
              <QuizOption
                key={opt.value}
                icon={opt.icon}
                iconBgClass={opt.iconBgClass}
                accentColor={opt.accentColor}
                label={opt.label}
                description={opt.description}
                selected={isSelected(opt.value)}
                onSelect={() => handleSelect(opt.value)}
              />
            ))}
          </div>

          {/* Multi-select continue button */}
          {question.multiSelect && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <motion.button
                onClick={handleContinue}
                disabled={!hasSelection()}
                animate={{
                  scale: hasSelection() ? 1 : 0.97,
                  opacity: hasSelection() ? 1 : 0.5,
                }}
                transition={{ duration: 0.2 }}
                className={`px-8 py-3.5 rounded-2xl font-display font-semibold text-sm transition-all ${
                  hasSelection()
                    ? "bg-dark text-white shadow-btn hover:brightness-110"
                    : "bg-dark/[0.08] text-dark/30 cursor-not-allowed"
                }`}
              >
                Continue
              </motion.button>
            </div>
          )}

          {/* Skip link */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted font-body hover:text-dark transition-colors underline underline-offset-4"
            >
              Not sure / Show me everything
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
