import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/support")({
  component: Support,
});

const CATEGORIES = ["General Inquiry", "Financing", "Inspection", "Purchase", "Complaint", "Other"];

function Support() {
  const { addTicket, user } = useApp();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", subject: "", category: CATEGORIES[0], message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields"); return;
    }
    addTicket({ ...form, userId: user?.id });
    toast.success("Ticket submitted! Our team will respond within 24 hours.");
    setForm({ ...form, subject: "", message: "" });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold">How can we help?</h1>
        <p className="mt-3 text-muted-foreground">From financing to inspections, our team responds within 24 hours.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
        {[
          { i: Phone, t: "Call us", d: "+1 (800) DRIVE-HUB", a: "9am–9pm, every day" },
          { i: Mail, t: "Email", d: "hello@drivehub.io", a: "Replies within 24h" },
          { i: MessageCircle, t: "Live chat", d: "Available in-app", a: "Mon–Fri, 9–6" },
        ].map(c => (
          <div key={c.t} className="rounded-2xl border border-border/60 bg-card p-5 text-center card-elevated">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><c.i className="h-5 w-5" /></div>
            <h3 className="mt-3 font-display text-base font-semibold">{c.t}</h3>
            <p className="mt-1 text-sm">{c.d}</p>
            <p className="text-xs text-muted-foreground">{c.a}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border/60 bg-card p-6 card-elevated md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Open a support ticket</h2>
        </div>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div><Label>Your name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
          <div><Label>Category</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required /></div>
          <div className="md:col-span-2"><Label>Message</Label><Textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required /></div>
          <div className="md:col-span-2"><Button type="submit" size="lg">Submit ticket</Button></div>
        </form>
      </div>
    </div>
  );
}
