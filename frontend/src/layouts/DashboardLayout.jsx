import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Briefcase, Search, MessageSquare, Wallet, Star,
  Bell, Settings, LogOut, Menu, X, ShieldCheck, Users, Gavel,
  BarChart3, CalendarClock, FileWarning,
} from "lucide-react";
import { Avatar, Badge } from "../components/ui";
import { notifications as mockNotifications } from "../data/mockData";

const NAV = {
  client: [
    { to: "/client", label: "Overview", icon: LayoutGrid },
    { to: "/client/gigs", label: "My Gigs", icon: Briefcase },
    { to: "/client/post-gig", label: "Post a Gig", icon: FileWarning },
    { to: "/marketplace", label: "Find Freelancers", icon: Search },
    { to: "/client/messages", label: "Messages", icon: MessageSquare },
    { to: "/client/payments", label: "Payments", icon: Wallet },
  ],
  freelancer: [
    { to: "/freelancer", label: "Overview", icon: LayoutGrid },
    { to: "/marketplace", label: "Find Gigs", icon: Search },
    { to: "/freelancer/proposals", label: "My Proposals", icon: FileWarning },
    { to: "/freelancer/profile", label: "My Profile", icon: Star },
    { to: "/freelancer/schedule", label: "Availability", icon: CalendarClock },
    { to: "/freelancer/messages", label: "Messages", icon: MessageSquare },
    { to: "/freelancer/earnings", label: "Earnings", icon: Wallet },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutGrid },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
    { to: "/admin/gigs", label: "Gigs", icon: Briefcase },
    { to: "/admin/disputes", label: "Disputes", icon: Gavel },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export default function DashboardLayout({ role, user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const items = NAV[role] || [];
  const unread = mockNotifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-mist transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-mist">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-6 w-6 bg-ink flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-white" />
            </span>
            <span className="font-display font-semibold">SkillSphere</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <div className="px-5 py-4 border-b border-mist">
          <Badge tone="outline">{role}</Badge>
        </div>

        <nav className="p-3 space-y-0.5">
          {items.map((item) => {
            const active = loc.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-ink text-white" : "text-slate-600 hover:bg-mist/40 hover:text-ink"
                }`}
              >
                <Icon size={17} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-mist space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-mist/40 hover:text-ink transition-colors">
            <Settings size={17} strokeWidth={1.75} /> Settings
          </button>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-mist/40 hover:text-ink transition-colors">
            <LogOut size={17} strokeWidth={1.75} /> Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-mist flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden sm:flex items-center gap-2 border border-mist px-3 py-2 w-72">
              <Search size={15} className="text-steel" />
              <input placeholder="Search gigs, freelancers, skills…" className="w-full text-sm outline-none placeholder:text-steel" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 hover:bg-mist/40 transition-colors">
                <Bell size={19} strokeWidth={1.75} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-ink rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-mist shadow-xl">
                  <div className="px-4 py-3 border-b border-mist flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-xs text-steel">{unread} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-mist last:border-0 text-sm ${n.unread ? "bg-mist/20" : ""}`}>
                        <p className="text-ink leading-snug">{n.text}</p>
                        <p className="text-xs text-steel mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <Avatar initials={user.avatar} size="sm" />
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="text-xs text-steel capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 lg:px-8 py-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
