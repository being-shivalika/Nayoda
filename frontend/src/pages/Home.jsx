import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Button, Badge, StarRating, Card } from "../components/ui";
import { freelancers, gigs, categories } from "../data/mockData";
import {
  ShieldCheck,
  Sparkles,
  Wallet,
  MessageSquare,
  Gauge,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const modules = [
  {
    icon: ShieldCheck,
    title: "Multi-role authentication",
    text: "JWT sessions, Google OAuth, and 2FA across client, freelancer and admin roles.",
  },
  {
    icon: Sparkles,
    title: "AI-powered matching",
    text: "Skill-similarity scoring surfaces the right freelancer within your radius, not just the nearest one.",
  },
  {
    icon: Wallet,
    title: "Escrow & milestones",
    text: "Funds are held in escrow and released as each milestone is approved — for both sides.",
  },
  {
    icon: MessageSquare,
    title: "Real-time collaboration",
    text: "Socket.IO-powered chat, file sharing and read receipts, right inside a gig thread.",
  },
  {
    icon: Gauge,
    title: "Weighted reputation",
    text: "Verified reviews and fraud detection keep ratings meaningful, not inflated.",
  },
  {
    icon: MapPin,
    title: "Hyperlocal discovery",
    text: "Location and skill filters find professionals who can actually show up.",
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const Home = () => {
  return (
    <div>
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 grid lg:grid-cols-12 gap-10 items-end overflow-hidden">
        <motion.div
          className="lg:col-span-7"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <Badge
              tone="outline"
              className="mb-6 rounded shadow hover:shadow-[#4103fb87]"
            >
              Hyperlocal · AI-matched · Escrow-secured
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-tight text-ink"
          >
            Find local talent
            <br />
            worth trusting with
            <br />
            the work.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-base text-slate-500 max-w-lg leading-relaxed"
          >
            SkillSphere matches clients with verified freelancers nearby - from
            React developers to electricians - using AI skill-scoring, milestone
            escrow, and a reputation system built to resist fake reviews.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">
                Post a gig <ArrowRight size={16} />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                document
                  .getElementById("capabilities")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore capabilities
            </Button>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center gap-8 text-sm text-steel"
          >
            <div>
              <span className="font-display text-2xl text-ink">1,284</span>
              <br />
              active freelancers
            </div>
            <div className="w-px h-10 bg-mist" />
            <div>
              <span className="font-display text-2xl text-ink">93.4%</span>
              <br />
              job success rate
            </div>
            <div className="w-px h-10 bg-mist" />
            <div>
              <span className="font-display text-2xl text-ink">₹4.8L+</span>
              <br />
              paid out monthly
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-steel">
                AI match preview
              </span>
              <Badge tone="dark">97% match</Badge>
            </div>
            <p className="text-sm text-ink font-medium mb-1">
              React + Node E-commerce Storefront
            </p>
            <p className="text-xs text-steel mb-4">
              Posted 2 hours ago · Ludhiana, Punjab
            </p>
            <div className="space-y-3">
              {freelancers.slice(0, 2).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 border border-mist p-3"
                >
                  <div className="h-9 w-9 bg-slate-500 text-white flex items-center justify-center text-xs font-display font-semibold shrink-0">
                    {f.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-steel truncate">{f.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StarRating rating={f.rating} size={11} />
                    <p className="text-[11px] text-steel mt-0.5">
                      {f.distanceKm} km away
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Trusted categories (Continuous Infinite Marquee) */}
      <section className="border-y border-mist bg-mist/10 overflow-hidden py-5 select-none">
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex shrink-0 gap-8 items-center pr-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {[...categories, ...categories].map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="font-mono text-xs uppercase tracking-wide text-steel whitespace-nowrap"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 1: Platform Capabilities */}
      <section id="capabilities" className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-xl mb-12"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel">
            Platform capabilities
          </span>
          <h2 className="font-display text-3xl mt-3 text-ink">
            Everything a hyperlocal freelance ecosystem needs
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-mist border border-mist"
        >
          {modules.map((m) => (
            <motion.div
              variants={fadeInUp}
              key={m.title}
              className="bg-white p-6 hover:bg-slate-50 transition-colors"
            >
              <m.icon size={20} strokeWidth={1.5} className="text-ink mb-4" />
              <p className="font-display text-base text-ink mb-2">{m.title}</p>
              <p className="text-sm text-steel leading-relaxed">{m.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Section 3 (Featured Gigs Section with ID) */}
      <section
        id="featured-gigs"
        className="mx-auto max-w-7xl px-6 pb-20 scroll-mt-20"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel">
              Live on the marketplace
            </span>
            <h2 className="font-display text-3xl mt-3 text-ink">
              Recently posted gigs
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-medium text-ink flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-5"
        >
          {gigs.slice(0, 3).map((g) => (
            <motion.div variants={fadeInUp} key={g.id}>
              <Link to={`/gigs/${g.id}`} className="block h-full">
                <Card className="p-5 h-full hover:border-ink hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <Badge>{g.category}</Badge>
                    <span className="text-xs text-steel">{g.postedAgo}</span>
                  </div>
                  <p className="font-display text-base text-ink leading-snug mb-2">
                    {g.title}
                  </p>
                  <p className="text-xs text-steel mb-4">{g.location}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">
                      ₹{g.budgetMin.toLocaleString()}–
                      {g.budgetMax.toLocaleString()}
                    </span>
                    <span className="text-steel">{g.proposals} proposals</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works strip */}
      <section className="bg-ink text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="text-[11px] font-mono uppercase tracking-[0.15em] text-mist"
            >
              How it works
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl mt-3 mb-6"
            >
              From posted gig to paid milestone
            </motion.h2>
            <ul className="space-y-4">
              {[
                "Client posts a gig with budget range and milestones",
                "AI engine recommends top-matched, nearby freelancers",
                "Freelancer submits a proposal with bid and timeline",
                "Funds move into escrow once a proposal is accepted",
                "Each milestone is reviewed, approved, and paid out",
              ].map((step, i) => (
                <motion.li
                  variants={fadeInUp}
                  key={step}
                  className="flex gap-4"
                >
                  <span className="font-mono text-sm text-mist w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-mist/90 leading-relaxed">
                    {step}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="border border-slate-600 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={16} className="text-white" />
              <span className="text-sm font-medium">
                Escrow status — Storefront project
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Design & Auth", amount: "₹15,000", status: "Paid" },
                {
                  name: "Catalog & Cart",
                  amount: "₹25,000",
                  status: "In progress",
                },
                {
                  name: "Checkout & Admin",
                  amount: "₹30,000",
                  status: "Pending",
                },
              ].map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between border-b border-slate-700 pb-3"
                >
                  <div>
                    <p className="text-sm">{m.name}</p>
                    <p className="text-xs text-mist/70">{m.amount}</p>
                  </div>
                  <Badge
                    tone={m.status === "Paid" ? "success" : "outline"}
                    className={
                      m.status === "Paid"
                        ? "!text-white !border-slate-500"
                        : "!text-mist !border-slate-600"
                    }
                  >
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-6 py-20 text-center"
      >
        <h2 className="font-display text-3xl text-ink mb-4">
          Ready to build your team, hyperlocally?
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Join as a client to post work, or as a freelancer to get matched —
          verification takes minutes.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Create free account</Button>
          </Link>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Home;
