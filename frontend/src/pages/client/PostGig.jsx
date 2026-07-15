import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Input, Select, Card } from "../../components/ui";
import { currentUser, categories } from "../../data/mockData";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function PostGig() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([{ name: "", amount: "" }]);
  const [pricingType, setPricingType] = useState("Fixed");
  const [posted, setPosted] = useState(false);

  const addMilestone = () => setMilestones([...milestones, { name: "", amount: "" }]);
  const removeMilestone = (i) => setMilestones(milestones.filter((_, idx) => idx !== i));

  if (posted) {
    return (
      <DashboardLayout role="client" user={currentUser.client}>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="h-14 w-14 border border-mist flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={26} className="text-ink" />
          </div>
          <h1 className="font-display text-2xl text-ink mb-2">Gig posted</h1>
          <p className="text-sm text-steel mb-8">Your gig is now live. The AI matching engine is already scoring nearby freelancers.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate("/client/gigs")}>View my gigs</Button>
            <Button variant="secondary" onClick={() => setPosted(false)}>Post another</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client" user={currentUser.client}>
      <h1 className="font-display text-2xl text-ink mb-1">Post a gig</h1>
      <p className="text-sm text-steel mb-8">Describe the work — the AI engine will recommend matched freelancers automatically.</p>

      <form onSubmit={(e) => { e.preventDefault(); setPosted(true); }} className="max-w-2xl space-y-8">
        <Card className="p-6 space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Basics</p>
          <Input label="Gig title" placeholder="e.g. Build a React + Node E-commerce Storefront" required />
          <Select label="Category" required>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1.5">Description</span>
            <textarea rows={5} required className="w-full border border-mist px-3.5 py-2.5 text-sm outline-none focus:border-ink" placeholder="What needs to be done? Include scope, deliverables and any must-have skills." />
          </label>
          <Input label="Required skills (comma separated)" placeholder="React, Node.js, MongoDB" />
          <Input label="Location" placeholder="Ludhiana, Punjab" defaultValue="Ludhiana, Punjab" required />
        </Card>

        <Card className="p-6 space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Budget</p>
          <div className="grid grid-cols-3 gap-2">
            {["Fixed", "Milestone", "Hourly"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setPricingType(t)}
                className={`py-2.5 text-xs font-medium border transition-colors ${pricingType === t ? "bg-ink text-white border-ink" : "border-mist text-slate-500 hover:border-ink"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Minimum budget (₹)" type="number" placeholder="20000" required />
            <Input label="Maximum budget (₹)" type="number" placeholder="35000" required />
          </div>

          {pricingType === "Milestone" && (
            <div className="pt-2">
              <span className="block text-xs font-medium text-slate-500 mb-2">Milestones</span>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1"><Input placeholder={`Milestone ${i + 1} name`} /></div>
                    <div className="w-32"><Input type="number" placeholder="₹ amount" /></div>
                    <button type="button" onClick={() => removeMilestone(i)} className="p-2.5 border border-mist text-steel hover:text-ink"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addMilestone} className="mt-3 text-xs font-medium text-ink flex items-center gap-1">
                <Plus size={13} /> Add milestone
              </button>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-steel">Documents</p>
          <div className="border border-dashed border-mist p-8 text-center">
            <p className="text-sm text-steel">Drag files here or <span className="text-ink font-medium">browse</span></p>
            <p className="text-xs text-steel mt-1">PDF, DOCX, PNG up to 10MB</p>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary">Save as draft</Button>
          <Button type="submit">Publish gig</Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
