import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";
import { Badge, Button, Card, StarRating, Input, Select } from "../components/ui";
import { gigs, freelancers, categories } from "../data/mockData";
import { SlidersHorizontal, MapPin, Sparkles, X } from "lucide-react";

export default function Marketplace() {
  const [tab, setTab] = useState("gigs");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("match");
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [query, setQuery] = useState("");

  const filteredGigs = useMemo(() => {
    let list = gigs.filter((g) => (category === "All" || g.category === category) && g.title.toLowerCase().includes(query.toLowerCase()));
    if (sort === "match") list = [...list].sort((a, b) => b.matchScore - a.matchScore);
    if (sort === "budget") list = [...list].sort((a, b) => b.budgetMax - a.budgetMax);
    if (sort === "recent") list = [...list];
    return list;
  }, [category, sort, query]);

  const filteredFreelancers = useMemo(() => {
    let list = freelancers.filter(
      (f) => f.distanceKm <= maxDistance && f.rating >= minRating && f.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "match") list = [...list].sort((a, b) => b.reputationScore - a.reputationScore);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [maxDistance, minRating, sort, query]);

  return (
    <div>
      <PublicNav />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel">Advanced search engine</span>
            <h1 className="font-display text-3xl text-ink mt-2">Browse the marketplace</h1>
          </div>
          <div className="flex border border-mist w-fit">
            {[{ id: "gigs", label: "Gigs" }, { id: "freelancers", label: "Freelancers" }].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? "bg-ink text-white" : "text-slate-500"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-64 shrink-0 space-y-6">
            <Input placeholder="Search by name or title" value={query} onChange={(e) => setQuery(e.target.value)} />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal size={14} className="text-steel" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filters</span>
              </div>

              {tab === "gigs" ? (
                <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>All</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </Select>
              ) : (
                <>
                  <label className="block mb-4">
                    <span className="block text-xs font-medium text-slate-500 mb-1.5">Max distance — {maxDistance} km</span>
                    <input type="range" min="1" max="50" value={maxDistance} onChange={(e) => setMaxDistance(+e.target.value)} className="w-full accent-ink" />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 mb-1.5">Minimum rating — {minRating}★</span>
                    <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="w-full accent-ink" />
                  </label>
                </>
              )}
            </div>

            <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="match">Best match</option>
              {tab === "gigs" ? <option value="budget">Highest budget</option> : <option value="rating">Highest rated</option>}
              <option value="recent">Most recent</option>
            </Select>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {tab === "gigs" ? (
              <div className="space-y-4">
                {filteredGigs.map((g) => (
                  <Link key={g.id} to={`/gigs/${g.id}`}>
                    <Card className="p-5 hover:border-ink transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <p className="font-display text-lg text-ink">{g.title}</p>
                        <Badge tone="dark" className="shrink-0"><Sparkles size={11} /> {g.matchScore}% match</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-steel mb-4">
                        <span>{g.client}</span><span>·</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {g.location}</span>
                        <span>·</span><span>{g.postedAgo}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">{g.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {g.skills.map((s) => <Badge key={s}>{s}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between border-t border-mist pt-4">
                        <div>
                          <span className="font-display text-lg text-ink">₹{g.budgetMin.toLocaleString()}–{g.budgetMax.toLocaleString()}</span>
                          <span className="text-xs text-steel ml-2">{g.pricingType}</span>
                        </div>
                        <span className="text-xs text-steel">{g.proposals} proposals</span>
                      </div>
                    </Card>
                  </Link>
                ))}
                {filteredGigs.length === 0 && <p className="text-sm text-steel py-16 text-center">No gigs match your filters.</p>}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredFreelancers.map((f) => (
                  <Link key={f.id} to={`/freelancers/${f.id}`}>
                    <Card className="p-5 h-full hover:border-ink transition-colors">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-11 w-11 bg-slate-500 text-white flex items-center justify-center text-sm font-display font-semibold shrink-0">{f.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base text-ink truncate">{f.name}</p>
                          <p className="text-xs text-steel truncate">{f.title}</p>
                        </div>
                        {f.verified && <Badge tone="dark" className="shrink-0">Verified</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={f.rating} />
                        <span className="text-xs text-steel">{f.rating} ({f.reviewCount})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {f.skills.slice(0, 3).map((s) => <Badge key={s.name}>{s.name}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between border-t border-mist pt-4 text-sm">
                        <span className="font-medium text-ink">₹{f.hourlyRate}/hr</span>
                        <span className="text-xs text-steel flex items-center gap-1"><MapPin size={11} /> {f.distanceKm} km</span>
                      </div>
                    </Card>
                  </Link>
                ))}
                {filteredFreelancers.length === 0 && <p className="text-sm text-steel py-16 text-center col-span-2">No freelancers match your filters.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
