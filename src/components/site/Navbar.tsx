import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Car,
  Heart,
  LogOut,
  Menu,
  Moon,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  User2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy Cars" },
  { to: "/sell", label: "Sell Your Car" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
] as const;

export function Navbar() {
  const { user, logout, theme, setTheme, wishlist, loginAsAdmin, loginAsAgent } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="container mx-auto">
        <div className="surface-panel ambient-noise flex min-h-18 items-center justify-between rounded-[1.7rem] border border-border/70 px-4 py-3 md:px-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-primary text-primary-foreground shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.34),transparent_55%)]" />
                <Car className="relative h-5 w-5" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  Refined Motoring
                </span>
                <span className="font-display text-[2rem] leading-none">
                  Drive<span className="gradient-text">Hub</span>
                </span>
              </span>
            </Link>
            <div className="hidden rounded-full border border-border/70 bg-white/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground xl:inline-flex">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
              Certified arrivals weekly
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/45 p-1 md:flex">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] transition-all ${active ? "bg-primary text-primary-foreground shadow-[0_14px_30px_-18px_rgba(0,0,0,0.55)]" : "text-muted-foreground hover:bg-white/70 hover:text-foreground"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full border border-border/70 bg-white/45 hover:bg-white/70"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Compare"
              className="relative hidden rounded-full border border-border/70 bg-white/45 hover:bg-white/70 sm:inline-flex"
            >
              <Link to="/compare">
                <Scale className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="relative rounded-full border border-border/70 bg-white/45 hover:bg-white/70"
            >
              <Link to="/wishlist">
                <Heart className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-0 bg-accent px-1.5 text-[10px] text-accent-foreground">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="hidden rounded-full border border-border/70 bg-white/45 hover:bg-white/70 sm:inline-flex"
            >
              <Link to="/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-11 rounded-full border border-border/70 bg-white/45 px-2.5 hover:bg-white/70"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden px-1 text-xs font-semibold uppercase tracking-[0.18em] md:inline">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-3xl border-border/70 p-2">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Signed in as
                    </div>
                    <div className="mt-1 text-sm">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User2 className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  ) : user.role === "agent" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/agent">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Agent console
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <User2 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/70 bg-white/45 px-4 hover:bg-white/70"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full px-5">
                  <Link to="/register">Register</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loginAsAdmin}
                  className="hidden rounded-full px-4 lg:inline-flex"
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Demo Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loginAsAgent}
                  className="hidden rounded-full px-4 lg:inline-flex"
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Demo Agent
                </Button>
              </div>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-border/70 bg-white/45 hover:bg-white/70 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto border-l-border/70 p-6">
                <div className="mt-6">
                  <div className="rounded-[1.75rem] border border-border/70 bg-card/70 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      DriveHub
                    </div>
                    <div className="mt-2 font-display text-4xl">Curated mobility.</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Premium used cars, refined buying journeys, and verified resale.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-1">
                    {NAV.map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setOpen(false)}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to)) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary/80"}`}
                      >
                        {n.label}
                      </Link>
                    ))}
                    <div className="my-3 h-px bg-border/70" />
                    <Link
                      to="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Wishlist
                      </span>
                      {wishlist.length > 0 && (
                        <Badge className="h-5 min-w-5 rounded-full border-0 bg-accent px-1.5 text-[10px] text-accent-foreground">
                          {wishlist.length}
                        </Badge>
                      )}
                    </Link>
                    <Link
                      to="/compare"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                    >
                      <Scale className="mr-2 inline h-4 w-4" /> Compare
                    </Link>
                    <Link
                      to="/finance"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                    >
                      Finance & EMI
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                    >
                      Contact
                    </Link>
                    <button
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                      }}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                    >
                      <span className="inline-flex items-center gap-2">
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        {theme === "dark" ? "Light mode" : "Dark mode"}
                      </span>
                    </button>
                    {user ? (
                      <>
                        <div className="my-3 h-px bg-border/70" />
                        <div className="px-4 py-1 text-xs text-muted-foreground">
                          Signed in as {user.email}
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                        >
                          <User2 className="mr-2 inline h-4 w-4" /> Profile
                        </Link>
                        <Link
                          to="/notifications"
                          onClick={() => setOpen(false)}
                          className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                        >
                          <Bell className="mr-2 inline h-4 w-4" /> Notifications
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setOpen(false)}
                          className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                        >
                          <Settings className="mr-2 inline h-4 w-4" /> Settings
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-secondary/80"
                        >
                          <LogOut className="mr-2 inline h-4 w-4" /> Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="my-3 h-px bg-border/70" />
                        <Link
                          to="/login"
                          onClick={() => setOpen(false)}
                          className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary/80"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setOpen(false)}
                          className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                        >
                          Register
                        </Link>
                        <button
                          onClick={() => {
                            loginAsAdmin();
                            setOpen(false);
                          }}
                          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-secondary/80"
                        >
                          <ShieldCheck className="mr-2 inline h-4 w-4" /> Demo Admin
                        </button>
                        <button
                          onClick={() => {
                            loginAsAgent();
                            setOpen(false);
                          }}
                          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-secondary/80"
                        >
                          <ShieldCheck className="mr-2 inline h-4 w-4" /> Demo Agent
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="px-4 pb-6 pt-20">
      <div className="container mx-auto">
        <div className="ambient-noise overflow-hidden rounded-[2.25rem] border border-border/70 bg-[var(--gradient-hero)] text-white shadow-[0_40px_120px_-45px_rgba(0,0,0,0.7)]">
          <div className="grid gap-12 px-6 py-10 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-14">
            <div className="relative">
              <div className="absolute -left-14 top-0 h-40 w-40 rounded-full bg-[var(--gradient-glow)] blur-2xl" />
              <div className="relative max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Modern used-car marketplace
                </div>
                <h2 className="mt-5 font-display text-5xl sm:text-6xl">
                  The calmest place to buy or sell your next car.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
                  Verified inspections, elegant financing, and a buying journey designed with the
                  same care as the vehicles themselves.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/buy">
                      Explore inventory <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/8 text-white hover:bg-white/12 hover:text-white"
                  >
                    <Link to="/sell">Get a valuation</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 rounded-[1.8rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                    Buy & Sell
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm text-white/75">
                    <li>
                      <Link to="/buy" className="hover:text-white">
                        Browse inventory
                      </Link>
                    </li>
                    <li>
                      <Link to="/sell" className="hover:text-white">
                        Sell your car
                      </Link>
                    </li>
                    <li>
                      <Link to="/finance" className="hover:text-white">
                        Finance & EMI
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                    Company
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm text-white/75">
                    <li>
                      <Link to="/about" className="hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/support" className="hover:text-white">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="hover:text-white">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="hover:text-white">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className="hover:text-white">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-black/10 p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Stay in the loop
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Get new arrivals, inspection highlights, and price drops in your inbox.
                </p>
                <form
                  className="mt-4 flex gap-2 min-w-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Subscribed! Watch your inbox for new arrivals.");
                    (e.currentTarget.querySelector("input") as HTMLInputElement).value = "";
                  }}
                >
                  <input
                    className="min-w-0 flex-1 rounded-full border border-white/14 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none"
                    placeholder="you@email.com"
                    type="email"
                    required
                  />
                  <Button type="submit" size="icon" className="h-11 w-11 rounded-full">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-5 text-xs uppercase tracking-[0.2em] text-white/45 md:px-14">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>© {new Date().getFullYear()} DriveHub</span>
              <span>Mock marketplace for demonstration purposes</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
