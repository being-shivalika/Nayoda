import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Avatar, Badge } from "../components/ui";
import { currentUser, messages, chatThread } from "../data/mockData";
import { Paperclip, Send, Check, CheckCheck, Video, FileText } from "lucide-react";

export default function Messages({ role = "client" }) {
  const [active, setActive] = useState(messages[0]);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(chatThread);
  const [typing, setTyping] = useState(false);

  const user = currentUser[role];

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setThread([...thread, { id: thread.length + 1, sender: "me", text: draft, time: "Now" }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => setTyping(false), 1800);
  };

  return (
    <DashboardLayout role={role} user={user}>
      <h1 className="font-display text-2xl text-ink mb-1">Messages</h1>
      <p className="text-sm text-steel mb-6">Real-time chat, file sharing and read receipts for every gig thread.</p>

      <div className="border border-mist grid grid-cols-1 md:grid-cols-[280px_1fr] h-[600px]">
        <div className="border-r border-mist overflow-y-auto">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className={`w-full flex items-center gap-3 p-4 border-b border-mist text-left transition-colors ${active.id === m.id ? "bg-mist/30" : "hover:bg-mist/10"}`}
            >
              <Avatar initials={m.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink truncate">{m.from}</p>
                  <span className="text-[11px] text-steel shrink-0">{m.time}</span>
                </div>
                <p className="text-xs text-steel truncate">{m.preview}</p>
              </div>
              {m.unread && <span className="h-2 w-2 bg-ink shrink-0 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between p-4 border-b border-mist">
            <div className="flex items-center gap-3">
              <Avatar initials={active.avatar} size="sm" />
              <div>
                <p className="text-sm font-medium text-ink">{active.from}</p>
                <p className="text-xs text-steel">Active now</p>
              </div>
            </div>
            <button className="p-2 border border-mist text-steel hover:text-ink"><Video size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {thread.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 text-sm ${m.sender === "me" ? "bg-ink text-white" : "bg-mist/30 text-ink"}`}>
                  <p className="leading-relaxed">{m.text}</p>
                  {m.file && (
                    <div className={`flex items-center gap-2 mt-2 px-2.5 py-1.5 text-xs border ${m.sender === "me" ? "border-slate-500" : "border-mist"}`}>
                      <FileText size={12} /> {m.file}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-1 text-[10px] ${m.sender === "me" ? "text-mist/80" : "text-steel"}`}>
                    {m.time}
                    {m.sender === "me" && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 bg-mist/30 text-xs text-steel">typing…</div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-mist">
            <button type="button" className="p-2 text-steel hover:text-ink"><Paperclip size={17} /></button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 text-sm outline-none px-2"
            />
            <button type="submit" className="p-2.5 bg-ink text-white"><Send size={15} /></button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
