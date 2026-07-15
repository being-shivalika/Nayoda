import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card, StatCard, ProgressBar } from "../../components/ui";
import { currentUser, myProposals, activeContracts, gigs } from "../../data/mockData";
import { Briefcase, Star, Wallet, Eye, ArrowRight, Sparkles } from "lucide-react";

export default function FreelancerDashboard() {
  const f = currentUser.freelancer;
  const recommended = gigs.slice(0, 3);

  return (
    <DashboardLayout role="freelancer" user={f}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Welcome back, {f.name.split(" ")[0]}</h1>
          <p className="text-sm text-steel mt-1">You have {myProposals.filter((p) => p.status === "Pending").length} proposals awaiting response.</p>
        </div>
        <Link to="/marketplace"><Button>Find gigs</Button></Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Profile views" value="312" delta="+18 this week" icon={Eye} />
        <StatCard label="Active contracts" value="1" icon={Briefcase} />
        <StatCard label="Reputation score" value={f.reputationScore} icon={Star} />
        <StatCard label="Earnings (Jul)" value="₹47,000" delta="+9.2%" icon={Wallet} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg text-ink">AI-recommended gigs for you</p>
              <Link to="/marketplace" className="text-sm text-ink flex items-center gap-1">View all <ArrowRight size={13} /></Link>
            </div>
            <div className="space-y-4">
              {recommended.map((g) => (
                <Link key={g.id} to={`/gigs/${g.id}`}>
                  <Card className="p-5 hover:border-ink transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-ink">{g.title}</p>
                      <Badge tone="dark"><Sparkles size={11} /> {g.matchScore}%</Badge>
                    </div>
                    <p className="text-xs text-steel mb-4">{g.location} · {g.postedAgo}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">₹{g.budgetMin.toLocaleString()}–{g.budgetMax.toLocaleString()}</span>
                      <span className="text-steel">{g.pricingType}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-lg text-ink mb-4">My proposals</p>
            <Card>
              {myProposals.map((p, i) => (
                <div key={p.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{p.gig.title}</p>
                    <p className="text-xs text-steel mt-0.5">₹{p.bidAmount.toLocaleString()} · {p.days} days · {p.submittedAgo}</p>
                  </div>
                  <Badge tone={p.status === "Accepted" ? "dark" : p.status === "Rejected" ? "outline" : "outline"} className="shrink-0">{p.status}</Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Active contract</p>
            {activeContracts.map((c) => (
              <div key={c.id}>
                <p className="text-sm font-medium text-ink mb-1">{c.gigTitle}</p>
                <p className="text-xs text-steel mb-4">for {c.counterparty} · due {c.dueDate}</p>
                <ProgressBar value={c.progress} className="mb-2" />
                <p className="text-xs text-steel mb-4">{c.progress}% complete · ₹{c.paid.toLocaleString()} received so far</p>
                <Link to="/freelancer/earnings"><Button variant="secondary" size="sm" className="w-full">View earnings</Button></Link>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Profile completeness</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-display text-3xl text-ink">85%</span>
            </div>
            <ProgressBar value={85} className="mb-3" />
            <p className="text-xs text-steel leading-relaxed mb-4">Add 2 more certifications to reach 100% and improve match ranking.</p>
            <Link to="/freelancer/profile"><Button variant="secondary" size="sm" className="w-full">Complete profile</Button></Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
