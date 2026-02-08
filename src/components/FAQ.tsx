"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "@phosphor-icons/react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is self-custody?",
    answer:
      "Self-custody means you hold the private keys to your own crypto. With a self-custody card, your funds stay in your own wallet until the moment you spend. The card provider never holds your crypto for you. This is different from custodial cards (like Crypto.com or Coinbase) where the company holds your crypto on your behalf, similar to how a bank holds your money. Self-custody gives you more control but also more responsibility.",
  },
  {
    question: "What does staking mean and why do some cards require it?",
    answer:
      "Staking means locking up a certain amount of a cryptocurrency (usually the card provider's own token) to unlock better perks like higher cashback rates. For example, Crypto.com requires you to stake CRO tokens to get their higher-tier cards. The catch is that the token's price can go up or down while it's locked, so you're taking on price risk in exchange for better rewards. Some cards don't require any staking at all.",
  },
  {
    question: "What's the difference between a crypto debit card and a crypto credit card?",
    answer:
      "Most crypto cards are prepaid debit cards. You load crypto onto them and spend it, and the crypto gets converted to fiat (like GBP or EUR) at the point of sale. A crypto credit card lets you borrow against your crypto holdings without selling them. So if you hold ETH, you can spend using a credit line backed by that ETH. If your crypto goes up in value, you still own it. But if it drops too far, you might face liquidation.",
  },
  {
    question: "Will I need to do KYC (identity verification)?",
    answer:
      "Yes, virtually all crypto cards require KYC verification because they're issued by regulated financial institutions. You'll typically need to provide a government-issued ID and proof of address. The level of KYC varies but most have a quick selfie plus ID check that takes minutes.",
  },
  {
    question: "What are FX fees and why do they matter?",
    answer:
      "FX (foreign exchange) fees are charged when you spend in a different currency than your card's base currency. If your card is denominated in EUR and you buy something in GBP, you'll pay the exchange rate plus an FX markup fee. This can range from 0% to 1-2%. If you travel a lot or buy from international websites, low FX fees save you serious money.",
  },
  {
    question: "What happens to my cashback rewards?",
    answer:
      "It depends on the card. Some pay cashback in their own native token (Crypto.com pays in CRO, Cypher pays in CYPR), which means your cashback value can fluctuate with the token price. Others pay in stablecoins like USDC, or in the crypto you spent. Check whether you're getting cashback in a volatile token or something stable, because 5% cashback in a token that drops 50% is actually 2.5%.",
  },
  {
    question: "Are crypto cards safe to use?",
    answer:
      "Crypto cards from established providers are generally as safe as any fintech debit card for day-to-day spending. They use Visa or Mastercard networks, support chip and PIN, and work with Apple/Google Pay. The main risks are different from traditional cards: your loaded crypto can fluctuate in value before you spend it, and if you're using a self-custody card, you're responsible for securing your own wallet.",
  },
  {
    question: "Can I use a crypto card for everyday spending?",
    answer:
      "Yes. Any crypto card that runs on the Visa or Mastercard network works anywhere those networks are accepted, which is basically everywhere. You can use it for groceries, online shopping, subscriptions, restaurants, the lot. Many also support Apple Pay and Google Pay for contactless.",
  },
  {
    question: "Why can't I get every card in my country?",
    answer:
      "Crypto card providers need to be licensed in each region they operate. Some cards are US-only (like Gemini or BitPay), some are EU/EEA-only (like Gnosis Pay or Nexo), and some are available globally (like Crypto.com). Regional availability is one of the biggest factors when choosing a card.",
  },
];

const INITIAL_VISIBLE = 5;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqData : faqData.slice(0, INITIAL_VISIBLE);

  return (
    <section className="bg-white rounded-3xl py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-foreground text-center mb-10 uppercase tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {visibleFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border-2 transition-colors ${
                  isOpen
                    ? "border-accent-yellow bg-white"
                    : "border-card-border bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-foreground pr-4">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-foreground"
                  >
                    <Plus className="w-4 h-4" weight="bold" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <p className="text-sm text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {!showAll && faqData.length > INITIAL_VISIBLE && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="rounded-full border-2 border-foreground text-foreground px-6 py-2 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
