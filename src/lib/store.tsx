import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { generateMockListings, SEED_OFFERS, SEED_TICKETS } from "./mock-data";
import type { Booking, Listing, Offer, Ticket, User } from "./types";

interface Persisted {
  user: User | null;
  listings: Listing[];
  tickets: Ticket[];
  offers: Offer[];
  bookings: Booking[];
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  theme: "light" | "dark";
}

interface AppState {
  ready: boolean;
  user: User | null;
  listings: Listing[];
  tickets: Ticket[];
  offers: Offer[];
  bookings: Booking[];
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  theme: "light" | "dark";
  login: (email: string, password: string) => Promise<User>;
  loginAsAdmin: () => void;
  loginAsAgent: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  markViewed: (id: string) => void;
  addListing: (l: Listing) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status">) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  addOffer: (o: Omit<Offer, "id" | "createdAt" | "state">) => void;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  setTheme: (t: "light" | "dark") => void;
  resetData: () => void;
}

const Ctx = createContext<AppState | null>(null);

const KEY = "ucm:v1";

function loadPersisted() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const p = loadPersisted();
    if (p) {
      setUser(p.user ?? null);
      setListings(p.listings ?? generateMockListings());
      setTickets(p.tickets ?? SEED_TICKETS);
      setOffers(p.offers ?? SEED_OFFERS);
      setBookings(p.bookings ?? []);
      setWishlist(p.wishlist ?? []);
      setRecentlyViewed(p.recentlyViewed ?? []);
      setCompare(p.compare ?? []);
      setThemeState(p.theme ?? "light");
    } else {
      setListings(generateMockListings());
      setTickets(SEED_TICKETS);
      setOffers(SEED_OFFERS);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const data: Persisted = {
      user,
      listings,
      tickets,
      offers,
      bookings,
      wishlist,
      recentlyViewed,
      compare,
      theme,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [ready, user, listings, tickets, offers, bookings, wishlist, recentlyViewed, compare, theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value: AppState = {
    ready,
    user,
    listings,
    tickets,
    offers,
    bookings,
    wishlist,
    recentlyViewed,
    compare,
    theme,
    async login(email) {
      const u: User = { id: "u-" + email, name: email.split("@")[0], email, role: "user" };
      setUser(u);
      return u;
    },
    loginAsAdmin() {
      setUser({ id: "admin-1", name: "Admin", email: "admin@drivehub.io", role: "admin" });
    },
    loginAsAgent() {
      setUser({ id: "agent-1", name: "Agent Priya", email: "agent@drivehub.io", role: "agent" });
    },
    async register(name, email) {
      const u: User = { id: "u-" + email, name, email, role: "user" };
      setUser(u);
      return u;
    },
    logout() {
      setUser(null);
    },
    updateProfile(patch) {
      setUser((u) => (u ? { ...u, ...patch } : u));
    },
    toggleWishlist(id) {
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
    },
    toggleCompare(id) {
      setCompare((c) =>
        c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id],
      );
    },
    clearCompare() {
      setCompare([]);
    },
    markViewed(id) {
      setRecentlyViewed((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8));
    },
    addListing(l) {
      setListings((prev) => [l, ...prev]);
    },
    updateListing(id, patch) {
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    },
    addTicket(t) {
      const nt: Ticket = { ...t, id: "t-" + Date.now(), status: "open", createdAt: Date.now() };
      setTickets((prev) => [nt, ...prev]);
    },
    updateTicket(id, patch) {
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    addOffer(o) {
      const no: Offer = { ...o, id: "o-" + Date.now(), state: "pending", createdAt: Date.now() };
      setOffers((prev) => [no, ...prev]);
    },
    updateOffer(id, patch) {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    },
    addBooking(b) {
      const nb: Booking = {
        ...b,
        id: "b-" + Date.now(),
        status: "confirmed",
        createdAt: Date.now(),
      };
      setBookings((prev) => [nb, ...prev]);
      return nb;
    },
    updateBooking(id, patch) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    },
    setTheme(t) {
      setThemeState(t);
    },
    resetData() {
      const fresh: Persisted = {
        user: null,
        listings: generateMockListings(),
        tickets: SEED_TICKETS,
        offers: SEED_OFFERS,
        bookings: [],
        wishlist: [],
        recentlyViewed: [],
        compare: [],
        theme: "light",
      };
      localStorage.setItem(KEY, JSON.stringify(fresh));
      setUser(fresh.user);
      setListings(fresh.listings);
      setTickets(fresh.tickets);
      setOffers(fresh.offers);
      setBookings(fresh.bookings);
      setWishlist(fresh.wishlist);
      setRecentlyViewed(fresh.recentlyViewed);
      setCompare(fresh.compare);
      setThemeState(fresh.theme);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
