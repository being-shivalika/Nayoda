import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Badge, Button, Card, Input, ProgressBar, Select } from "../../components/ui";
import { currentUser } from "../../data/mockData";
import { ShieldCheck, Upload, Plus } from "lucide-react";

export default function FreelancerProfileEdit() {
  const f = currentUser.freelancer;

  return (
    <DashboardLayout role="freelancer" user={f}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">My profile</h1>
          <p className="text-sm text-steel mt-1">This is what clients see when the AI engine recommends you.</p>
        </div>
        <Button>Save changes</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Basic info</p>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-slate-500 text-white flex items-center justify-center text-xl font-display font-semibold shrink-0">{f.avatar}</div>
              <button className="flex items-center gap-2 text-xs font-medium text-ink border border-mist px-3 py-2"><Upload size={13} /> Upload photo</button>
            </div>
            <Input label="Full name" defaultValue={f.name} />
            <Input label="Professional title" defaultValue={f.title} />
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1.5">Bio</span>
              <textarea rows={4} defaultValue={f.bio} className="w-full border border-mist px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Location" defaultValue={f.location} />
              <Input label="Hourly rate (₹)" type="number" defaultValue={f.hourlyRate} />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Skills & proficiency</p>
            {f.skills.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink font-medium">{s.name}</span>
                  <Select className="!w-32 !py-1" defaultValue={s.level}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                  </Select>
                </div>
              </div>
            ))}
            <button className="text-xs font-medium text-ink flex items-center gap-1"><Plus size={13} /> Add skill</button>
          </Card>

          <Card className="p-6 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Certifications & resume</p>
            <div className="border border-dashed border-mist p-8 text-center">
              <p className="text-sm text-steel">Drag files here or <span className="text-ink font-medium">browse</span></p>
              <p className="text-xs text-steel mt-1">Resume, certificates — PDF up to 10MB</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-ink" />
              <p className="text-sm font-medium text-ink">Verification status</p>
            </div>
            {f.verified ? (
              <Badge tone="dark">Identity verified</Badge>
            ) : (
              <>
                <p className="text-xs text-steel leading-relaxed mb-4">Verification badge increases proposal acceptance by an average of 34%.</p>
                <Button size="sm" className="w-full">Start verification</Button>
              </>
            )}
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-steel mb-4">Profile completeness</p>
            <div className="flex items-end gap-2 mb-2"><span className="font-display text-3xl text-ink">85%</span></div>
            <ProgressBar value={85} className="mb-3" />
            <ul className="text-xs text-steel space-y-1.5">
              <li>✓ Basic info</li><li>✓ Skills added</li><li>✓ Portfolio linked</li>
              <li className="text-ink">○ Add 2 certifications</li>
            </ul>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-ink mb-1">Pricing</p>
            <p className="text-xs text-steel mb-3">Set both hourly and milestone-based rates.</p>
            <Input label="Milestone minimum (₹)" type="number" defaultValue={5000} />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
