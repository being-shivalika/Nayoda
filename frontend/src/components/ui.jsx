import React from "react";

export function Badge({ children, tone = "default", className = "" }) {
  const tones = {
    default: "bg-mist/60 text-slate-600 border-mist",
    dark: "bg-ink text-white border-ink",
    outline: "bg-transparent text-slate-500 border-mist",
    success: "bg-slate-50 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-ink text-white hover:bg-slate-600",
    secondary: "bg-white text-ink border border-ink hover:bg-mist/40",
    ghost: "bg-transparent text-slate-500 hover:text-ink",
    danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-sm",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Avatar({ initials, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };
  return (
    <div className={`flex items-center justify-center bg-slate-500 text-white font-display font-semibold shrink-0 ${sizes[size]}`}>
      {initials}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`border border-mist bg-white ${className}`}>{children}</div>;
}

export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-steel">{children}</span>
      <span className="h-px flex-1 bg-mist" />
    </div>
  );
}

export function StatCard({ label, value, delta, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-steel">{label}</span>
        {Icon && <Icon size={16} strokeWidth={1.5} className="text-slate-400" />}
      </div>
      <div className="mt-3 font-display text-2xl text-ink">{value}</div>
      {delta && (
        <div className={`mt-1 text-xs font-medium ${delta.startsWith("-") ? "text-red-600" : "text-slate-500"}`}>
          {delta}
        </div>
      )}
    </Card>
  );
}

export function ProgressBar({ value, max = 100, className = "" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`h-1.5 w-full bg-mist/60 ${className}`}>
      <div className="h-full bg-ink transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" fill={n <= Math.round(rating) ? "#000000" : "#D3D3D3"}>
          <path d="M10 1.5l2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.8l6-.7L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-mist">
      <p className="font-display text-lg text-ink">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-steel max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}</span>}
      <input
        className={`w-full border border-mist bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-steel focus:border-ink outline-none transition-colors ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}</span>}
      <select
        className={`w-full border border-mist bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink outline-none transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
