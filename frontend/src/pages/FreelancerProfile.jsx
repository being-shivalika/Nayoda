import React from "react";
import { useParams } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Badge, Button, Card, StarRating, ProgressBar } from "../components/ui";
import { freelancers, reviews, gigs } from "../data/mockData";
import { MapPin, ShieldCheck, Clock, Briefcase, Calendar } from "lucide-react";

export default function FreelancerProfile() {
  const { id } = useParams();
  const f = freelancers.find((x) => x.id === id) || freelancers[0];
  const portfolio = gigs.slice(0, 3);

  return (
    <div>
      <PublicNav />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Card className="p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="h-20 w-20 bg-slate-500 text-white flex items-center justify-center text-2xl font-display font-semibold shrink-0">{f.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl text-ink">{f.name}</h1>
                {f.verified && <Badge tone="dark"><ShieldCheck size={11} /> Verified</Badge>}
              </div>
              <p className="text-sm text-slate-500 mb-3">{f.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-steel">
                <span className="flex items-center gap-1"><MapPin size={13} /> {f.location} · {f.distanceKm} km away</span>
                <span className="flex items-center gap-1"><Clock size={13} /> Responds {f.responseTime}</span>
                <span className="flex items-center gap-1"><Briefcase size={13} /> {f.completedJobs} jobs completed</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {f.badges.map((b) => <Badge key={b}>{b}</Badge>)}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-2xl text-ink">₹{f.hourlyRate}<span className="text-sm text-steel">/hr</span></p>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <StarRating rating={f.rating} />
                <span className="text-xs text-steel">{f.rating} ({f.reviewCount})</span>
              </div>
              <Button className="mt-4">Invite to gig</Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-3">About</p>
              <p className="text-sm text-slate-600 leading-relaxed">{f.bio}</p>
            </Card>

            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Skills & proficiency</p>
              <div className="space-y-4">
                {f.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-ink font-medium">{s.name}</span>
                      <span className="text-steel text-xs">{s.level}</span>
                    </div>
                    <ProgressBar value={s.level === "Expert" ? 95 : s.level === "Advanced" ? 75 : 55} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Portfolio</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {portfolio.map((g) => (
                  <div key={g.id} className="border border-mist">
                    <div className="h-24 bg-mist/40" />
                    <div className="p-3">
                      <p className="text-xs font-medium text-ink line-clamp-1">{g.title}</p>
                      <p className="text-[11px] text-steel mt-0.5">{g.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Verified reviews</p>
                <span className="text-xs text-steel">{f.reviewCount} total</span>
              </div>
              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-mist last:border-0 pb-5 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-ink">{r.author}</p>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-1.5">{r.text}</p>
                    <div className="flex items-center gap-2 text-xs text-steel">
                      <span>{r.date}</span>
                      {r.verified && <><span>·</span><span className="flex items-center gap-1"><ShieldCheck size={11} /> Verified hire</span></>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Reputation score</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display text-4xl text-ink">{f.reputationScore}</span>
                <span className="text-sm text-steel mb-1">/ 100</span>
              </div>
              <ProgressBar value={f.reputationScore} />
              <p className="text-xs text-steel mt-3 leading-relaxed">Weighted from verified review quality, on-time delivery and dispute history.</p>
            </Card>

            <Card className="p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Availability</p>
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className={`aspect-square flex items-center justify-center text-xs font-mono ${i === 5 || i === 6 ? "bg-mist/40 text-steel" : "bg-ink text-white"}`}>{d}</div>
                ))}
              </div>
              <p className="text-xs text-steel flex items-center gap-1.5"><Calendar size={12} /> Booking opens 3 days out</p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
