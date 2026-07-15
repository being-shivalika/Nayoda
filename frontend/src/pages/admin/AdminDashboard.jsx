import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Card, StatCard } from "../../components/ui";
import { currentUser, adminStats, revenueByMonth, pendingVerifications, disputes } from "../../data/mockData";
import { Wallet, Users, TrendingUp, Briefcase, ArrowRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Platform overview</h1>
      <p className="text-sm text-steel mb-8">Admin controls everything — users, gigs, payments and disputes.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Platform revenue" value={`₹${(adminStats.platformRevenue / 100000).toFixed(1)}L`} delta={`+${adminStats.monthlyGrowth}%`} icon={Wallet} />
        <StatCard label="Active freelancers" value={adminStats.activeFreelancers.toLocaleString()} icon={Users} />
        <StatCard label="Active clients" value={adminStats.activeClients.toLocaleString()} icon={Briefcase} />
        <StatCard label="Job success rate" value={`${adminStats.jobSuccessRate}%`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-6">Platform revenue — last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth} margin={{ left: -20 }}>
                <CartesianGrid stroke="#D3D3D3" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#808080" }} axisLine={{ stroke: "#D3D3D3" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#808080" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ border: "1px solid #D3D3D3", borderRadius: 0, fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#000000" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Top categories</p>
          <div className="space-y-3">
            {adminStats.topCategories.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-ink">{c.name}</span>
                  <span className="text-steel text-xs">{c.value}%</span>
                </div>
                <div className="h-1.5 bg-mist/60"><div className="h-full bg-ink" style={{ width: `${c.value * 3}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-lg text-ink">Pending verifications</p>
            <Link to="/admin/verifications" className="text-sm text-ink flex items-center gap-1">View all <ArrowRight size={13} /></Link>
          </div>
          <Card>
            {pendingVerifications.map((v, i) => (
              <div key={v.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-ink">{v.name}</p>
                  <p className="text-xs text-steel mt-0.5">{v.title} · submitted {v.submitted}</p>
                </div>
                <Badge tone="outline">Pending</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-lg text-ink">Open disputes</p>
            <Link to="/admin/disputes" className="text-sm text-ink flex items-center gap-1">View all <ArrowRight size={13} /></Link>
          </div>
          <Card>
            {disputes.map((d, i) => (
              <div key={d.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-ink">{d.gig}</p>
                  <p className="text-xs text-steel mt-0.5">{d.parties}</p>
                </div>
                <Badge tone={d.status === "Resolved" ? "dark" : "outline"}>{d.status}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
