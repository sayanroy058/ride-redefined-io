import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { generateMockListings, SEED_OFFERS, SEED_TICKETS } from "./mock-data";
import type { Listing, Offer, Ticket, User } from "./types";

interface AppState {
  ready: boolean;
  user: User | null;
  listings: Listing[];
  tickets: Ticket[];
  offers: Offer[];
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  theme: "light" | "dark";
  login: (email: string, password: string) => Promise<User>;
  loginAsAdmin: () => void;
  loginAsAgent: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  markViewed: (id: string) => void;
  addListing: (l: Listing) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status">) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  setTheme: (t: "light" | "dark") => void;
}

const Ctx = createContext<AppState | null>(null);

const KEY = "ucm:v1";

function loadPersisted() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const p = loadPersisted();
    if (p) {
      setUser(p.user ?? null);
      setListings(p.listings ?? generateMockListings());
      setTickets(p.tickets ?? SEED_TICKETS);
      setOffers(p.offers ?? SEED_OFFERS);
      setWishlist(p.wishlist ?? []);
      setRecentlyViewed(p.recentlyViewed ?? []);
      setCompare(p.compare ?? []);
      setThemeState(p.theme ?? "dark");
    } else {
      setListings(generateMockListings());
      setTickets(SEED_TICKETS);
      setOffers(SEED_OFFERS);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ user, listings, tickets, offers, wishlist, recentlyViewed, compare, theme }));
  }, [ready, user, listings, tickets, offers, wishlist, recentlyViewed, compare, theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value: AppState = {
    ready, user, listings, tickets, offers, wishlist, recentlyViewed, compare, theme,
    async login(email) {
      const u: User = { id: "u-" + email, name: email.split("@")[0], email, role: "user" };
      setUser(u); return u;
    },
    loginAsAdmin() {
      setUser({ id: "admin-1", name: "Admin", email: "admin@drivehub.io", role: "admin" });
    },
    loginAsAgent() {
      setUser({ id: "agent-1", name: "Agent Priya", email: "agent@drivehub.io", role: "agent" });
    },
    async register(name, email) {
      const u: User = { id: "u-" + email, name, email, role: "user" };
      setUser(u); return u;
    },
    logout() { setUser(null); },
    toggleWishlist(id) {
      setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    },
    toggleCompare(id) {
      setCompare(c => c.includes(id) ? c.filter(x => x !== id) : c.length >= 3 ? c : [...c, id]);
    },
    markViewed(id) {
      setRecentlyViewed(r => [id, ...r.filter(x => x !== id)].slice(0, 8));
    },
    addListing(l) { setListings(prev => [l, ...prev]); },
    updateListing(id, patch) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
    },
    addTicket(t) {
      const nt: Ticket = { ...t, id: "t-" + Date.now(), status: "open", createdAt: Date.now() };
      setTickets(prev => [nt, ...prev]);
    },
    updateTicket(id, patch) {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    },
    setTheme(t) { setThemeState(t); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
