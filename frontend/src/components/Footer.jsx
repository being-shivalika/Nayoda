import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-6 w-6 bg-ink flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-white" />
            </span>
            <span className="font-display font-semibold">SkillSphere</span>
          </div>
          <p className="text-sm text-steel max-w-xs leading-relaxed">
            The intelligent hyperlocal freelance ecosystem — verified local talent, AI-matched to the work that needs doing.
          </p>
        </div>
        {[
          { title: "Platform", links: ["Browse Gigs", "Post a Gig", "How It Works", "Pricing"] },
          { title: "Company", links: ["About", "Careers", "Trust & Safety", "Contact"] },
          { title: "Resources", links: ["Help Center", "Dispute Resolution", "API Docs", "Status"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-3">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}><Link to="/" className="text-sm text-slate-600 hover:text-ink transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-mist">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-steel">
          <span>© 2026 SkillSphere. Built on the Nayoda MERN stack.</span>
          <span className="font-mono">v1.0.0 — Frontend Preview</span>
        </div>
      </div>
    </footer>
  );
}
