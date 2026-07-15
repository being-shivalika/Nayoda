import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, StatCard } from "../../components/ui";
import { currentUser, adminStats, revenueByMonth } from "../../data/mockData";
import { Wallet, Users, TrendingUp, Percent } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#000000", "#34434E", "#647583", "#8B97A2", "#D3D3D3"];

export default function AdminAnalytics() {
  return (
    <DashboardLayout role="admin" user={currentUser.admin}>
      <h1 className="font-display text-2xl text-ink mb-1">Platform analytics</h1>
      <p className="text-sm text-steel mb-8">Revenue, category mix and platform-wide growth trends.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={`₹${(adminStats.platformRevenue / 100000).toFixed(1)}L`} delta={`+${adminStats.monthlyGrowth}%`} icon={Wallet} />
        <StatCard label="Active users" value={(adminStats.activeFreelancers + adminStats.activeClients).toLocaleString()} icon={Users} />
        <StatCard label="Success rate" value={`${adminStats.jobSuccessRate}%`} icon={TrendingUp} />
        <StatCard label="Take rate" value="8.5%" icon={Percent} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-6">Revenue trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth} margin={{ left: -20 }}>
                <CartesianGrid stroke="#D3D3D3" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#808080" }} axisLine={{ stroke: "#D3D3D3" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#808080" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ border: "1px solid #D3D3D3", borderRadius: 0, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} dot={{ fill: "#000000", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Category mix</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adminStats.topCategories} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {adminStats.topCategories.map((c, i) => <Cell key={c.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ border: "1px solid #D3D3D3", borderRadius: 0, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {adminStats.topCategories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-600 truncate">{c.name}</span>
                <span className="text-steel ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
