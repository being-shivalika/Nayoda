import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card } from "../../components/ui";
import { currentUser, disputes } from "../../data/mockData";
import { Paperclip } from "lucide-react";

export default function AdminDisputes() {
  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Dispute resolution</h1>
      <p className="text-sm text-steel mb-8">Mediate payment disputes with evidence review.</p>

      <div className="space-y-4 max-w-3xl">
        {disputes.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-medium text-ink">{d.gig}</p>
                <p className="text-xs text-steel mt-0.5">{d.parties} · raised by {d.raisedBy} · {d.date}</p>
              </div>
              <Badge tone={d.status === "Resolved" ? "dark" : "outline"}>{d.status}</Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{d.reason}</p>
            <div className="flex items-center justify-between border-t border-mist pt-3">
              <span className="flex items-center gap-1.5 text-xs text-steel"><Paperclip size={12} /> 2 evidence files attached</span>
              <span className="text-sm font-medium text-ink">Amount held: ₹{d.amount.toLocaleString()}</span>
            </div>
            {d.status !== "Resolved" && (
              <div className="flex gap-2 mt-4">
                <Button size="sm">Rule for client</Button>
                <Button size="sm" variant="secondary">Rule for freelancer</Button>
                <Button size="sm" variant="ghost">Request more evidence</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
