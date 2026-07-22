import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Button, Card, Badge } from "../components/ui";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    audience: "For clients posting occasional gigs",
    features: [
      "Post up to 2 active gigs",
      "Standard AI matching",
      "Escrow payments",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "8.5%",
    suffix: "per transaction",
    audience: "For freelancers & regular hirers",
    highlight: true,
    features: [
      "Unlimited gigs & proposals",
      "Priority AI matching",
      "Verified badge eligibility",
      "Real-time chat & video calls",
      "Priority dispute resolution",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    audience: "For agencies and high-volume hiring",
    features: [
      "Dedicated account manager",
      "Custom analytics dashboards",
      "Team seats & role permissions",
      "SLA-backed support",
    ],
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

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      <main className="flex-1 mx-auto max-w-6xl px-6 py-16 w-full">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-lg mx-auto mb-14"
        >
          <motion.span
            variants={fadeInUp}
            className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel block"
          >
            Pricing
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl text-ink mt-3 mb-4 tracking-tight"
          >
            Simple, transaction-based pricing
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-slate-500 leading-relaxed"
          >
            No listing fees. SkillSphere earns only when you get paid.
          </motion.p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-5 items-stretch"
        >
          {plans.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <Card
                className={`p-6 flex flex-col w-full transition-shadow duration-300 hover:shadow-lg ${
                  p.highlight ? "border-ink ring-1 ring-ink/10" : ""
                }`}
              >
                {p.highlight ? (
                  <Badge tone="dark" className="w-fit mb-4">
                    Most popular
                  </Badge>
                ) : (
                  <div className="h-6 mb-4" /> // Keeps vertical alignment consistent across cards
                )}

                <p className="font-display text-lg text-ink mb-1">{p.name}</p>
                <p className="text-xs text-steel mb-5">{p.audience}</p>

                <div className="flex items-end gap-1 mb-6">
                  <span className="font-display text-3xl text-ink">
                    {p.price}
                  </span>
                  {p.suffix && (
                    <span className="text-xs text-steel mb-1">{p.suffix}</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check size={14} className="text-ink mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="w-full">
                  <Button
                    variant={p.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    Get started
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
