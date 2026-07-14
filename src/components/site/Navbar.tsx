import { Link, useRouterState } from "@tanstack/react-router";
import { Car, Heart, LogOut, Menu, Moon, Search, ShieldCheck, Sun, User2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span>Drive<span className="gradient-text">Hub</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(n => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="hidden sm:inline-flex relative">
            <Link to="/dashboard">
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">{wishlist.length}</Badge>}
            </Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile"><User2 className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                {user.role === "admin" ? (
                  <DropdownMenuItem asChild><Link to="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>
                ) : user.role === "agent" ? (
                  <DropdownMenuItem asChild><Link to="/agent"><ShieldCheck className="mr-2 h-4 w-4" />Agent console</Link></DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild><Link to="/dashboard"><User2 className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
              <Button asChild size="sm"><Link to="/register">Register</Link></Button>
              <Button variant="outline" size="sm" onClick={loginAsAdmin} className="hidden lg:inline-flex">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />Demo Admin
              </Button>
              <Button variant="outline" size="sm" onClick={loginAsAgent} className="hidden lg:inline-flex">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />Demo Agent
              </Button>
            </div>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map(n => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">{n.label}</Link>
                ))}
                {!user && <>
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Register</Link>
                </>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground"><Car className="h-5 w-5" /></span>
            Drive<span className="gradient-text">Hub</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">The trusted marketplace for refurbished, inspected, and ready-to-drive used cars.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Buy & Sell</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/buy" className="hover:text-foreground">Browse inventory</Link></li>
            <li><Link to="/sell" className="hover:text-foreground">Sell your car</Link></li>
            <li><Link to="/buy" className="hover:text-foreground">Finance & EMI</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/support" className="hover:text-foreground">Support</Link></li>
            <li><Link to="/support" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Stay in the loop</h4>
          <p className="mt-3 text-sm text-muted-foreground">Get new arrivals & price drops to your inbox.</p>
          <form className="mt-3 flex gap-2 min-w-0" onSubmit={e => e.preventDefault()}>
            <input className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="you@email.com" />
            <Button type="submit" size="sm" className="shrink-0"><Search className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} DriveHub. Mock marketplace for demo purposes.</div>
    </footer>
  );
}
