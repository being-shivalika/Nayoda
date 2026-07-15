import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Badge, Button, Card, Input, StarRating } from "../components/ui";
import { gigs, freelancers, proposalsForClient } from "../data/mockData";
import { MapPin, Clock, Paperclip, Sparkles, CheckCircle2 } from "lucide-react";

export default function GigDetail() {
  const { id } = useParams();
  const gig = gigs.find((g) => g.id === id) || gigs[0];
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const related = proposalsForClient.filter((p) => p.gigId === gig.id);

  const recommended = freelancers.slice(0, 3);

  return (
    <div>
      <PublicNav />
      <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge>{gig.category}</Badge>
              <Badge tone="dark"><Sparkles size={11} /> {gig.matchScore}% AI match</Badge>
            </div>
            <h1 className="font-display text-3xl text-ink leading-tight mb-3">{gig.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-steel">
              <span>{gig.client}</span><span>·</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {gig.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {gig.postedAgo}</span>
            </div>
          </div>

          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-3">Project description</p>
            <p className="text-sm text-slate-600 leading-relaxed">{gig.description}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {gig.skills.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
          </Card>

          {gig.milestones.length > 0 && (
            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Milestones · Escrow protected</p>
              <div className="space-y-3">
                {gig.milestones.map((m, i) => (
                  <div key={m.name} className="flex items-center justify-between border-b border-mist last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm text-ink">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-ink">₹{m.amount.toLocaleString()}</span>
                      <Badge tone="outline" className="capitalize">{m.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {related.length > 0 && (
            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Proposals received ({related.length})</p>
              <div className="space-y-4">
                {related.map((p) => (
                  <div key={p.id} className="flex gap-3 border-b border-mist last:border-0 pb-4 last:pb-0">
                    <div className="h-10 w-10 bg-slate-500 text-white flex items-center justify-center text-xs font-display font-semibold shrink-0">{p.freelancer.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{p.freelancer.name}</p>
                        <Badge tone={p.status === "Accepted" ? "dark" : "outline"}>{p.status}</Badge>
                      </div>
                      <p className="text-xs text-steel mb-2">₹{p.bidAmount.toLocaleString()} · {p.days} days</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{p.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-3">Budget</p>
            <p className="font-display text-2xl text-ink mb-1">₹{gig.budgetMin.toLocaleString()}–{gig.budgetMax.toLocaleString()}</p>
            <p className="text-xs text-steel mb-6">{gig.pricingType} pricing</p>

            {!submitted ? (
              !showProposalForm ? (
                <Button className="w-full" onClick={() => setShowProposalForm(true)}>Submit a proposal</Button>
              ) : (
                <form
                  className="space-y-3"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <Input label="Your bid (₹)" type="number" placeholder="60000" required />
                  <Input label="Estimated completion (days)" type="number" placeholder="21" required />
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 mb-1.5">Proposal note</span>
                    <textarea rows={4} required className="w-full border border-mist px-3.5 py-2.5 text-sm outline-none focus:border-ink" placeholder="Explain your approach and relevant experience…" />
                  </label>
                  <button type="button" className="flex items-center gap-2 text-xs text-steel">
                    <Paperclip size={13} /> Attach portfolio file
                  </button>
                  <Button type="submit" className="w-full">Send proposal</Button>
                </form>
              )
            ) : (
              <div className="flex items-start gap-3 border border-mist p-4">
                <CheckCircle2 size={18} className="text-ink shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-ink">Proposal sent</p>
                  <p className="text-xs text-steel mt-1">The client will be notified and can review your bid in their dashboard.</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">AI-recommended for this gig</p>
            <div className="space-y-3">
              {recommended.map((f) => (
                <Link key={f.id} to={`/freelancers/${f.id}`} className="flex items-center gap-3 border border-mist p-3 hover:border-ink transition-colors">
                  <div className="h-9 w-9 bg-slate-500 text-white flex items-center justify-center text-xs font-display font-semibold shrink-0">{f.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{f.name}</p>
                    <StarRating rating={f.rating} size={11} />
                  </div>
                  <span className="text-xs text-steel shrink-0">{f.distanceKm} km</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
