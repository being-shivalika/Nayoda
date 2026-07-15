import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Button, Card, Badge } from "../components/ui";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    audience: "For clients posting occasional gigs",
    features: ["Post up to 2 active gigs", "Standard AI matching", "Escrow payments", "Email support"],
  },
  {
    name: "Growth",
    price: "8.5%",
    suffix: "per transaction",
    audience: "For freelancers & regular hirers",
    highlight: true,
    features: ["Unlimited gigs & proposals", "Priority AI matching", "Verified badge eligibility", "Real-time chat & video calls", "Priority dispute resolution"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    audience: "For agencies and high-volume hiring",
    features: ["Dedicated account manager", "Custom analytics dashboards", "Team seats & role permissions", "SLA-backed support"],
  },
];

export default function Pricing() {
  return (
    <div>
      <PublicNav />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center max-w-lg mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel">Pricing</span>
          <h1 className="font-display text-4xl text-ink mt-3 mb-4">Simple, transaction-based pricing</h1>
          <p className="text-slate-500">No listing fees. SkillSphere earns only when you get paid.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <Card key={p.name} className={`p-6 flex flex-col ${p.highlight ? "border-ink" : ""}`}>
              {p.highlight && <Badge tone="dark" className="w-fit mb-4">Most popular</Badge>}
              <p className="font-display text-lg text-ink mb-1">{p.name}</p>
              <p className="text-xs text-steel mb-5">{p.audience}</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="font-display text-3xl text-ink">{p.price}</span>
                {p.suffix && <span className="text-xs text-steel mb-1">{p.suffix}</span>}
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-ink mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register"><Button variant={p.highlight ? "primary" : "secondary"} className="w-full">Get started</Button></Link>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
