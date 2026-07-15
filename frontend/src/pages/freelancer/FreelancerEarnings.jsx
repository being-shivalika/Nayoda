import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Card, StatCard } from "../../components/ui";
import { currentUser, freelancerEarnings, transactions } from "../../data/mockData";
import { Wallet, Eye, Briefcase, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function FreelancerEarnings() {
  return (
    <DashboardLayout role="freelancer" user={currentUser.freelancer}>
      <h1 className="font-display text-2xl text-ink mb-1">Earnings & analytics</h1>
      <p className="text-sm text-steel mb-8">Profile views, gig applications and revenue over time.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="This month" value="₹47,000" delta="+9.2%" icon={Wallet} />
        <StatCard label="Profile views" value="312" delta="+18" icon={Eye} />
        <StatCard label="Gig applications" value="9" icon={Briefcase} />
        <StatCard label="Client feedback avg" value="4.9★" icon={Star} />
      </div>

      <Card className="p-6 mb-8">
        <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-6">Monthly revenue</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={freelancerEarnings} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#D3D3D3" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#808080" }} axisLine={{ stroke: "#D3D3D3" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#808080" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ border: "1px solid #D3D3D3", borderRadius: 0, fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString()}`, "Earnings"]} />
              <Area type="monotone" dataKey="earnings" stroke="#000000" strokeWidth={2} fill="url(#earn)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <p className="font-display text-lg text-ink mb-4">Transaction history</p>
      <Card>
        {transactions.map((t, i) => (
          <div key={t.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
            <div>
              <p className="text-sm font-medium text-ink">{t.desc}</p>
              <p className="text-xs text-steel mt-0.5">{t.counterparty} · {t.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-ink">{t.type === "debit" ? "-" : "+"}₹{t.amount.toLocaleString()}</p>
              <Badge tone="outline" className="mt-1">{t.status}</Badge>
            </div>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
