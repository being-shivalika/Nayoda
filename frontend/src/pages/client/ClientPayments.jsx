import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card, StatCard } from "../../components/ui";
import { currentUser, transactions, activeContracts } from "../../data/mockData";
import { Wallet, ShieldCheck, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

const typeStyles = {
  credit: "text-slate-600",
  debit: "text-slate-600",
  escrow: "text-slate-600",
  refund: "text-slate-600",
};

export default function ClientPayments() {
  return (
    <DashboardLayout role="client" user={currentUser.client}>
      <h1 className="font-display text-2xl text-ink mb-1">Payments</h1>
      <p className="text-sm text-steel mb-8">Track escrow balances, milestone releases and transaction history.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="In escrow" value="₹15,000" icon={Wallet} />
        <StatCard label="Paid this month" value="₹23,000" icon={ArrowUpFromLine} />
        <StatCard label="Total spent" value="₹1,86,400" icon={ArrowDownToLine} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className="font-display text-lg text-ink mb-4">Transaction history</p>
          <Card>
            {transactions.map((t, i) => (
              <div key={t.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-mist" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-ink">{t.desc}</p>
                  <p className="text-xs text-steel mt-0.5">{t.counterparty} · {t.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${t.type === "debit" ? "text-ink" : "text-slate-600"}`}>
                    {t.type === "debit" ? "-" : "+"}₹{t.amount.toLocaleString()}
                  </p>
                  <Badge tone="outline" className="mt-1">{t.status}</Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-ink" />
              <p className="text-sm font-medium text-ink">Escrow protection</p>
            </div>
            <p className="text-xs text-steel leading-relaxed mb-4">
              Funds are held securely until you approve each milestone. Disputes pause the release automatically.
            </p>
            {activeContracts.map((c) => (
              <div key={c.id} className="border-t border-mist pt-4 mt-4">
                <p className="text-sm font-medium text-ink mb-3">{c.gigTitle}</p>
                {c.milestones.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-steel">{m.name}</span>
                    <Badge tone={m.status === "paid" ? "dark" : "outline"} className="capitalize">{m.status}</Badge>
                  </div>
                ))}
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-ink mb-2">Payment method</p>
            <div className="flex items-center justify-between border border-mist p-3 mb-3">
              <span className="text-sm text-slate-600">Razorpay — HDFC •••• 4821</span>
              <Badge tone="outline">Default</Badge>
            </div>
            <Button variant="secondary" size="sm" className="w-full">Manage payment methods</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
