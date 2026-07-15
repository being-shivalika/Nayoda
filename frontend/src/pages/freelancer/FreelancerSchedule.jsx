import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Card, Badge } from "../../components/ui";
import { currentUser } from "../../data/mockData";
import { CalendarClock } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = ["9–11 AM", "11 AM–1 PM", "2–4 PM", "4–6 PM", "6–8 PM"];

export default function FreelancerSchedule() {
  const [selected, setSelected] = useState({ "Mon-9–11 AM": true, "Mon-2–4 PM": true, "Tue-11 AM–1 PM": true, "Wed-9–11 AM": true, "Thu-2–4 PM": true, "Fri-9–11 AM": true });

  const toggle = (key) => setSelected((s) => ({ ...s, [key]: !s[key] }));

  return (
    <DashboardLayout role="freelancer" user={currentUser.freelancer}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Availability</h1>
          <p className="text-sm text-steel mt-1">Clients see these slots when booking milestone check-ins or calls.</p>
        </div>
        <Button>Save availability</Button>
      </div>

      <Card className="p-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-steel pb-3 w-32">Time</th>
              {days.map((d) => <th key={d} className="text-xs font-mono uppercase tracking-wider text-steel pb-3">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot} className="border-t border-mist">
                <td className="py-3 text-xs text-steel">{slot}</td>
                {days.map((d) => {
                  const key = `${d}-${slot}`;
                  const active = selected[key];
                  return (
                    <td key={key} className="py-2 text-center">
                      <button
                        onClick={() => toggle(key)}
                        className={`h-8 w-8 mx-auto border transition-colors ${active ? "bg-ink border-ink" : "border-mist hover:border-ink"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-8">
        <p className="font-display text-lg text-ink mb-4">Upcoming bookings</p>
        <Card>
          <div className="flex items-center gap-4 p-4">
            <CalendarClock size={18} className="text-steel shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">Milestone review call — Nayoda Retail</p>
              <p className="text-xs text-steel mt-0.5">Wed, 15 Jul · 2:00–2:30 PM</p>
            </div>
            <Badge tone="outline">Confirmed</Badge>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
