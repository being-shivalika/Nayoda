import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui";

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const links = [
    { to: "/marketplace", label: "Browse Gigs" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-mist">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-7 w-7 bg-ink flex items-center justify-center">
            <span className="h-2 w-2 bg-white" />
          </span>
          <span className="font-display font-semibold text-lg tracking-tight">SkillSphere</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${loc.pathname === l.to ? "text-ink" : "text-steel hover:text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/register"><Button variant="primary" size="sm">Get started</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-mist bg-white px-6 py-4 space-y-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full">Log in</Button></Link>
            <Link to="/register" className="flex-1"><Button variant="primary" size="sm" className="w-full">Get started</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
