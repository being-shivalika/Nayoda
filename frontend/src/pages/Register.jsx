import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../components/ui";
import { Briefcase, User, ArrowLeft, Check } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(role === "freelancer" ? "/freelancer" : "/client");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm text-steel">
          <ArrowLeft size={14} /> Back home
        </Link>

        {!role ? (
          <>
            <h1 className="font-display text-2xl text-ink mb-2">Create your account</h1>
            <p className="text-sm text-steel mb-8">How will you use SkillSphere?</p>
            <div className="space-y-3">
              <button onClick={() => setRole("client")} className="w-full text-left border border-mist p-5 hover:border-ink transition-colors flex items-start gap-4">
                <Briefcase size={20} className="text-ink mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-base text-ink">I'm hiring</p>
                  <p className="text-sm text-steel mt-1">Post gigs, find verified local freelancers, manage milestones and payments.</p>
                </div>
              </button>
              <button onClick={() => setRole("freelancer")} className="w-full text-left border border-mist p-5 hover:border-ink transition-colors flex items-start gap-4">
                <User size={20} className="text-ink mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-base text-ink">I'm freelancing</p>
                  <p className="text-sm text-steel mt-1">Build a profile, get AI-matched to gigs nearby, grow verified reputation.</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setRole(null)} className="inline-flex items-center gap-1 text-xs text-steel mb-5">
              <ArrowLeft size={12} /> Change role
            </button>
            <h1 className="font-display text-2xl text-ink mb-2">
              Sign up as a {role === "client" ? "client" : "freelancer"}
            </h1>
            <p className="text-sm text-steel mb-7">Takes about two minutes — verification happens after.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" placeholder="Ananya" required />
                <Input label="Last name" placeholder="Sharma" required />
              </div>
              <Input label="Email address" type="email" placeholder="you@company.com" required />
              {role === "client" && <Input label="Company / Organization" placeholder="Nayoda Retail Pvt. Ltd." />}
              <Input label="Location" placeholder="Ludhiana, Punjab" required />
              <Input label="Password" type="password" placeholder="Create a password" required />

              <label className="flex items-start gap-2.5 text-xs text-steel pt-1">
                <input type="checkbox" required className="accent-ink mt-0.5" />
                I agree to the Terms of Service and Privacy Policy, and consent to identity verification.
              </label>

              <Button type="submit" className="w-full">Create account</Button>
            </form>

            <p className="text-center text-sm text-steel mt-8">
              Already have an account? <Link to="/login" className="text-ink font-medium">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
