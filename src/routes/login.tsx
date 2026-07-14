import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Car, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { login, loginAsAdmin } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    await login(email, password);
    toast.success("Welcome back!");
    nav({ to: "/dashboard" });
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to DriveHub.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <div className="flex justify-between">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            loginAsAdmin();
            toast.success("Signed in as admin");
            nav({ to: "/admin" });
          }}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Try as Admin
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div className="hidden text-white lg:block">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs">
            <Car className="h-3.5 w-3.5" />
            DriveHub
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight leading-tight">
            Drive the next <span className="gradient-text">chapter</span>.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Inspected, refurbished, ready-to-drive used cars with transparent pricing and instant
            EMI.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
