import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Card } from "../../components/ui";
import { currentUser, gigs } from "../../data/mockData";

export default function AdminGigs() {
  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Gig monitoring</h1>
      <p className="text-sm text-steel mb-8">Approve new postings and monitor active gigs for fraud signals.</p>

      <Card>
        <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-4 py-3 border-b border-mist text-[11px] font-mono uppercase tracking-wider text-steel">
          <span>Gig</span><span>Category</span><span>Budget</span><span>Status</span>
        </div>
        {gigs.map((g) => (
          <div key={g.id} className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-4 py-3 border-b border-mist last:border-0 items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{g.title}</p>
              <p className="text-xs text-steel mt-0.5 truncate">{g.client}</p>
            </div>
            <span className="text-xs text-slate-600">{g.category}</span>
            <span className="text-xs text-slate-600">₹{g.budgetMin.toLocaleString()}–{g.budgetMax.toLocaleString()}</span>
            <Badge tone="dark">{g.status}</Badge>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
