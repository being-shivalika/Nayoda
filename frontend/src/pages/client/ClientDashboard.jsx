import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card, StatCard, StarRating } from "../../components/ui";
import { currentUser, gigs, proposalsForClient, activeContracts } from "../../data/mockData";
import { Briefcase, Users, Wallet, TrendingUp, ArrowRight, Plus } from "lucide-react";

export default function ClientDashboard() {
  const myGigs = gigs.slice(0, 3);

  return (
    <DashboardLayout role="client" user={currentUser.client}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Welcome back, {currentUser.client.name.split(" ")[0]}</h1>
          <p className="text-sm text-steel mt-1">Here's what's happening across your gigs today.</p>
        </div>
        <Link to="/client/post-gig"><Button><Plus size={15} /> Post a gig</Button></Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active gigs" value="3" delta="+1 this week" icon={Briefcase} />
        <StatCard label="Proposals received" value="47" delta="+12 this week" icon={Users} />
        <StatCard label="In escrow" value="₹15,000" icon={Wallet} />
        <StatCard label="Job success rate" value="93%" delta="+2.1%" icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg text-ink">Your active gigs</p>
              <Link to="/client/gigs" className="text-sm text-ink flex items-center gap-1">View all <ArrowRight size={13} /></Link>
            </div>
            <div className="space-y-4">
              {myGigs.map((g) => (
                <Link key={g.id} to={`/gigs/${g.id}`}>
                  <Card className="p-5 hover:border-ink transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-ink">{g.title}</p>
                      <Badge tone="outline">{g.status}</Badge>
                    </div>
                    <p className="text-xs text-steel mb-4">{g.postedAgo} · {g.proposals} proposals</p>
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
            <p className="font-display text-lg text-ink mb-4">Recent proposals</p>
            <Card>
              {proposalsForClient.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-4 p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
                  <div className="h-10 w-10 bg-slate-500 text-white flex items-center justify-center text-xs font-display font-semibold shrink-0">{p.freelancer.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{p.freelancer.name}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={p.freelancer.rating} size={11} />
                      <span className="text-xs text-steel">₹{p.bidAmount.toLocaleString()} · {p.days} days</span>
                    </div>
                  </div>
                  <Badge tone={p.status === "Accepted" ? "dark" : "outline"} className="shrink-0">{p.status}</Badge>
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
                <p className="text-xs text-steel mb-4">with {c.counterparty} · due {c.dueDate}</p>
                <div className="h-1.5 w-full bg-mist/60 mb-2">
                  <div className="h-full bg-ink" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="text-xs text-steel mb-4">{c.progress}% complete · ₹{c.paid.toLocaleString()} of ₹{c.amount.toLocaleString()} paid</p>
                <Link to="/client/payments"><Button variant="secondary" size="sm" className="w-full">View payment schedule</Button></Link>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Recommended for you</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">The AI matching engine found 3 new freelancers this week whose skills fit your open gigs.</p>
            <Link to="/marketplace"><Button variant="secondary" size="sm" className="w-full">Browse matches</Button></Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
