import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Card } from "../../components/ui";
import { currentUser, myProposals } from "../../data/mockData";

const tabs = ["All", "Pending", "Accepted", "Rejected"];

export default function FreelancerProposals() {
  const [tab, setTab] = useState("All");
  const list = tab === "All" ? myProposals : myProposals.filter((p) => p.status === tab);

  return (
    <DashboardLayout role="freelancer" user={currentUser.freelancer}>
      <h1 className="font-display text-2xl text-ink mb-1">My proposals</h1>
      <p className="text-sm text-steel mb-8">Track the status of every gig you've applied to.</p>

      <div className="flex gap-2 mb-6 border-b border-mist">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-ink text-ink" : "border-transparent text-steel"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((p) => (
          <Link key={p.id} to={`/gigs/${p.gig.id}`}>
            <Card className="p-5 hover:border-ink transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <p className="font-display text-base text-ink">{p.gig.title}</p>
                <Badge tone={p.status === "Accepted" ? "dark" : "outline"}>{p.status}</Badge>
              </div>
              <p className="text-xs text-steel mb-4">{p.gig.client} · submitted {p.submittedAgo}</p>
              <div className="flex items-center justify-between border-t border-mist pt-4 text-sm">
                <span className="font-medium text-ink">Your bid: ₹{p.bidAmount.toLocaleString()}</span>
                <span className="text-steel">{p.days} day timeline</span>
              </div>
            </Card>
          </Link>
        ))}
        {list.length === 0 && <p className="text-sm text-steel py-16 text-center">No proposals in this category.</p>}
      </div>
    </DashboardLayout>
  );
}
