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
  Settings,
  ShieldCheck,
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Drive<span className="text-primary">Hub</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-9 w-9"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Compare"
              className="hidden h-9 w-9 sm:inline-flex"
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
              className="relative h-9 w-9"
            >
              <Link to="/wishlist">
                <Heart className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-background bg-primary px-1 text-[10px] text-primary-foreground">
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
              className="hidden h-9 w-9 sm:inline-flex"
            >
              <Link to="/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 gap-2 px-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
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
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loginAsAdmin}
                  className="hidden lg:inline-flex"
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Demo Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loginAsAgent}
                  className="hidden lg:inline-flex"
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Demo Agent
                </Button>
              </div>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto p-6">
                <div className="mt-6">
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Car className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-bold tracking-tight">
                      Drive<span className="text-primary">Hub</span>
                    </span>
                  </Link>
                  <div className="mt-6 flex flex-col gap-1">
                    {NAV.map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setOpen(false)}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to)) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                      >
                        {n.label}
                      </Link>
                    ))}
                    <div className="my-2 h-px bg-border" />
                    <Link
                      to="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Wishlist
                      </span>
                      {wishlist.length > 0 && (
                        <Badge className="h-5 min-w-5 rounded-full border-0 bg-primary px-1.5 text-[10px] text-primary-foreground">
                          {wishlist.length}
                        </Badge>
                      )}
                    </Link>
                    <Link
                      to="/compare"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      <Scale className="mr-2 inline h-4 w-4" /> Compare
                    </Link>
                    <Link
                      to="/finance"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      Finance & EMI
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      Contact
                    </Link>
                    <button
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                      }}
                      className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
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
                        <div className="my-2 h-px bg-border" />
                        <div className="px-4 py-1 text-xs text-muted-foreground">
                          Signed in as {user.email}
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                        >
                          <User2 className="mr-2 inline h-4 w-4" /> Profile
                        </Link>
                        <Link
                          to="/notifications"
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                        >
                          <Bell className="mr-2 inline h-4 w-4" /> Notifications
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                        >
                          <Settings className="mr-2 inline h-4 w-4" /> Settings
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="rounded-lg px-4 py-2.5 text-left text-sm font-medium hover:bg-secondary"
                        >
                          <LogOut className="mr-2 inline h-4 w-4" /> Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="my-2 h-px bg-border" />
                        <Link
                          to="/login"
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setOpen(false)}
                          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                        >
                          Register
                        </Link>
                        <button
                          onClick={() => {
                            loginAsAdmin();
                            setOpen(false);
                          }}
                          className="rounded-lg px-4 py-2.5 text-left text-sm font-medium hover:bg-secondary"
                        >
                          <ShieldCheck className="mr-2 inline h-4 w-4" /> Demo Admin
                        </button>
                        <button
                          onClick={() => {
                            loginAsAgent();
                            setOpen(false);
                          }}
                          className="rounded-lg px-4 py-2.5 text-left text-sm font-medium hover:bg-secondary"
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
    <footer className="border-t border-border/60 bg-card mt-20">
      <div className="container mx-auto">
        <div className="grid gap-12 px-1 py-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Drive<span className="text-primary">Hub</span>
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              The calmest place to buy or sell your next car.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Verified inspections, elegant financing, and a buying journey designed with the
              same care as the vehicles themselves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="default">
                <Link to="/buy">
                  Explore inventory <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default">
                <Link to="/sell">Get a valuation</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold">Buy & Sell</h4>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/buy" className="hover:text-foreground">Browse inventory</Link>
                </li>
                <li>
                  <Link to="/sell" className="hover:text-foreground">Sell your car</Link>
                </li>
                <li>
                  <Link to="/finance" className="hover:text-foreground">Finance & EMI</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground">About</Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-foreground">Support</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground">Contact</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 py-6">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>&copy; {new Date().getFullYear()} DriveHub. All rights reserved.</span>
            <span className="text-xs">Mock marketplace for demonstration purposes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
