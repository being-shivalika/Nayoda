import React from "react";
import { motion } from "framer-motion";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Card, Badge } from "../components/ui";
import {
  UserPlus,
  FileWarning,
  Sparkles,
  MessagesSquare,
  ShieldCheck,
  Star,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up as a client or freelancer, verify your email, and set up two-factor authentication.",
  },
  {
    icon: FileWarning,
    title: "Post or apply to a gig",
    text: "Clients post gigs with budgets and milestones. Freelancers submit proposals with a bid and timeline.",
  },
  {
    icon: Sparkles,
    title: "Get AI-matched",
    text: "Skill-similarity scoring and location filtering surface the most relevant matches on both sides.",
  },
  {
    icon: MessagesSquare,
    title: "Collaborate in real time",
    text: "Chat, share files, and track progress inside a single gig thread powered by Socket.IO.",
  },
  {
    icon: ShieldCheck,
    title: "Pay through escrow",
    text: "Funds are held securely and released automatically as each milestone is approved.",
  },
  {
    icon: Star,
    title: "Build verified reputation",
    text: "Completed gigs turn into verified reviews that feed a weighted reputation score.",
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      <main className="flex-1 mx-auto max-w-5xl px-6 py-16 w-full">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl"
        >
          <motion.span
            variants={fadeInUp}
            className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel block"
          >
            How it works
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl text-ink mt-3 mb-4 tracking-tight"
          >
            From sign-up to milestone payout
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-slate-500 max-w-lg mb-12 text-base leading-relaxed"
          >
            Six steps stand between posting a gig and getting reliable, verified
            work delivered nearby.
          </motion.p>
        </motion.div>

        {/* Steps List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-px bg-mist border border-mist shadow-sm overflow-hidden"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeInUp}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 flex gap-5 transition-colors hover:bg-slate-50/80 group"
            >
              <span className="font-mono text-xs text-steel w-6 shrink-0 pt-1 group-hover:text-ink transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <s.icon
                size={20}
                strokeWidth={1.5}
                className="text-ink shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
              />
              <div>
                <p className="font-display text-base text-ink mb-1">
                  {s.title}
                </p>
                <p className="text-sm text-steel leading-relaxed">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
