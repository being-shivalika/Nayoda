import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Badge } from "../components/ui";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("client");
  const [step, setStep] = useState("credentials"); // credentials | twofa
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("twofa");
  };

  const handleVerify = (e) => {
    e.preventDefault();
    navigate(role === "admin" ? "/admin" : role === "freelancer" ? "/freelancer" : "/client");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-6 w-6 bg-white flex items-center justify-center">
            <span className="h-1.5 w-1.5 bg-ink" />
          </span>
          <span className="font-display font-semibold">SkillSphere</span>
        </Link>
        <div>
          <p className="font-display text-3xl leading-tight mb-4">"Milestone escrow made client payments feel safe for the first time."</p>
          <p className="text-sm text-mist/70">— Ananya Sharma, Full-Stack Developer</p>
        </div>
        <span className="text-xs text-mist/50 font-mono">SECURE LOGIN · JWT + 2FA</span>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8 text-sm text-steel">
            <ArrowLeft size={14} /> Back home
          </Link>

          {step === "credentials" ? (
            <>
              <h1 className="font-display text-2xl text-ink mb-2">Log in to SkillSphere</h1>
              <p className="text-sm text-steel mb-7">Choose your role and sign in to continue.</p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {["client", "freelancer", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-2.5 text-xs font-medium capitalize border transition-colors ${
                      role === r ? "bg-ink text-white border-ink" : "border-mist text-slate-500 hover:border-ink"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email address" type="email" placeholder="you@company.com" required defaultValue="demo@skillsphere.io" />
                <Input label="Password" type="password" placeholder="••••••••" required defaultValue="password" />
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-steel">
                    <input type="checkbox" className="accent-ink" /> Remember me
                  </label>
                  <a href="#" className="text-ink font-medium">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full">Continue</Button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <span className="h-px flex-1 bg-mist" /><span className="text-xs text-steel">or</span><span className="h-px flex-1 bg-mist" />
              </div>

              <Button variant="secondary" className="w-full">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#000" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-steel mt-8">
                Don't have an account? <Link to="/register" className="text-ink font-medium">Sign up</Link>
              </p>
            </>
          ) : (
            <>
              <div className="h-11 w-11 border border-mist flex items-center justify-center mb-5">
                <ShieldCheck size={20} className="text-ink" />
              </div>
              <h1 className="font-display text-2xl text-ink mb-2">Two-factor verification</h1>
              <p className="text-sm text-steel mb-7">Enter the 6-digit code sent to your registered device.</p>
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      defaultValue={i < 6 ? "•" : ""}
                      className="w-11 h-12 text-center border border-mist focus:border-ink outline-none font-mono text-lg"
                    />
                  ))}
                </div>
                <Button type="submit" className="w-full">Verify and continue</Button>
                <button type="button" onClick={() => setStep("credentials")} className="text-xs text-steel flex items-center gap-1 mx-auto">
                  <ArrowLeft size={12} /> Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
