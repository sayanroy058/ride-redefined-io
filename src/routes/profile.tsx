import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { user } = useApp();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", address: "" });

  if (!user) {
    return <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold">Please sign in</h1>
      <Button asChild className="mt-4"><Link to="/login">Sign in</Link></Button>
    </div>;
  }
  return <div className="container mx-auto max-w-3xl px-4 py-12">
    <h1 className="font-display text-3xl font-bold">Your profile</h1>
    <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 card-elevated">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="font-display text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={e => { e.preventDefault(); toast.success("Profile saved"); }}>
        <div><Label>Full name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 123 4567" /></div>
        <div className="md:col-span-2"><Label>Address</Label><Textarea rows={3} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
        <div className="md:col-span-2"><Button type="submit">Save changes</Button></div>
      </form>
    </div>
  </div>;
}
