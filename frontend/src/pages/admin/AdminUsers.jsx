import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Avatar, Badge, Button, Card, Input } from "../../components/ui";
import { currentUser, freelancers } from "../../data/mockData";
import { MoreVertical } from "lucide-react";

const users = [
  ...freelancers.map((f) => ({ id: f.id, name: f.name, role: "Freelancer", status: "Active", joined: "Mar 2026", avatar: f.avatar })),
  { id: "u1", name: "Nayoda Retail Pvt. Ltd.", role: "Client", status: "Active", joined: "Jan 2026", avatar: "NR" },
  { id: "u2", name: "Finlync Technologies", role: "Client", status: "Active", joined: "Feb 2026", avatar: "FT" },
  { id: "u3", name: "Rakesh Oberoi", role: "Freelancer", status: "Suspended", joined: "Apr 2026", avatar: "RO" },
];

export default function AdminUsers() {
  const [query, setQuery] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Manage users</h1>
      <p className="text-sm text-steel mb-6">Suspend accounts, review activity, and manage roles.</p>

      <div className="mb-6 max-w-sm">
        <Input placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Card>
        <div className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-4 px-4 py-3 border-b border-mist text-[11px] font-mono uppercase tracking-wider text-steel">
          <span>Name</span><span>Role</span><span>Status</span><span>Joined</span><span></span>
        </div>
        {filtered.map((u) => (
          <div key={u.id} className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-4 px-4 py-3 border-b border-mist last:border-0 items-center">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar initials={u.avatar} size="sm" />
              <span className="text-sm font-medium text-ink truncate">{u.name}</span>
            </div>
            <span className="text-sm text-slate-600">{u.role}</span>
            <Badge tone={u.status === "Active" ? "dark" : "outline"}>{u.status}</Badge>
            <span className="text-xs text-steel">{u.joined}</span>
            <button className="text-steel hover:text-ink justify-self-end"><MoreVertical size={16} /></button>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
