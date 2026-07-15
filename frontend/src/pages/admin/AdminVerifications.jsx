import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Avatar, Badge, Button, Card } from "../../components/ui";
import { currentUser, pendingVerifications } from "../../data/mockData";
import { FileText, Check, X } from "lucide-react";

export default function AdminVerifications() {
  const [items, setItems] = useState(pendingVerifications.map((v) => ({ ...v, decided: null })));

  const decide = (id, decision) => setItems((its) => its.map((i) => (i.id === id ? { ...i, decided: decision } : i)));

  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Freelancer verifications</h1>
      <p className="text-sm text-steel mb-8">Review submitted ID documents and certifications before granting the verified badge.</p>

      <div className="space-y-4 max-w-2xl">
        {items.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Avatar initials={v.name.split(" ").map((n) => n[0]).join("")} />
                <div>
                  <p className="text-sm font-medium text-ink">{v.name}</p>
                  <p className="text-xs text-steel mt-0.5">{v.title} · submitted {v.submitted}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-600 border border-mist px-2 py-1"><FileText size={11} /> Aadhaar_ID.pdf</span>
                    <span className="flex items-center gap-1 text-xs text-slate-600 border border-mist px-2 py-1"><FileText size={11} /> Certification.pdf</span>
                  </div>
                </div>
              </div>
              {v.decided ? (
                <Badge tone={v.decided === "approved" ? "dark" : "outline"} className="capitalize">{v.decided}</Badge>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => decide(v.id, "approved")} className="p-2 border border-mist hover:border-ink text-slate-600 hover:text-ink"><Check size={15} /></button>
                  <button onClick={() => decide(v.id, "rejected")} className="p-2 border border-mist hover:border-ink text-slate-600 hover:text-ink"><X size={15} /></button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
