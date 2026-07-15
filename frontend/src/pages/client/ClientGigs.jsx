import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card } from "../../components/ui";
import { currentUser, gigs } from "../../data/mockData";
import { Plus } from "lucide-react";

const statusFilters = ["All", "Open", "In Progress", "Completed"];

export default function ClientGigs() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? gigs : gigs.filter((g) => g.status === filter);

  return (
    <DashboardLayout role="client" user={currentUser.client}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-ink">My gigs</h1>
        <Link to="/client/post-gig"><Button><Plus size={15} /> Post a gig</Button></Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-mist">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${filter === s ? "border-ink text-ink" : "border-transparent text-steel"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((g) => (
          <Link key={g.id} to={`/gigs/${g.id}`}>
            <Card className="p-5 hover:border-ink transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <p className="font-display text-base text-ink">{g.title}</p>
                <Badge tone="outline">{g.status}</Badge>
              </div>
              <p className="text-xs text-steel mb-4">{g.postedAgo} · {g.location}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {g.skills.map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
              <div className="flex items-center justify-between border-t border-mist pt-4 text-sm">
                <span className="font-medium text-ink">₹{g.budgetMin.toLocaleString()}–{g.budgetMax.toLocaleString()}</span>
                <span className="text-steel">{g.proposals} proposals received</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
