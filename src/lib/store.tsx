import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  Booking,
  Conversation,
  Listing,
  Offer,
  Review,
  SavedSearch,
  Ticket,
  User,
} from "./types";
import { apiLogin, apiRegister } from "./api";

// ---------------------------------------------------------------------------
// Only UI/local state is persisted — entity data comes from the server
// ---------------------------------------------------------------------------

interface Persisted {
  user: User | null;
  token: string | null;
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  theme: "light" | "dark";
}

export interface StoreSnapshot {
  user: User | null;
  listings: Listing[];
  tickets: Ticket[];
  offers: Offer[];
  bookings: Booking[];
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  reviews: Review[];
  conversations: Conversation[];
  savedSearches: SavedSearch[];
}

export interface StoreMutators {
  addListing: (l: Listing) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status">) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  addOffer: (o: Omit<Offer, "id" | "createdAt" | "state">) => void;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  addConversation: (
    c: Omit<Conversation, "id" | "createdAt" | "messages"> & {
      messages?: Conversation["messages"];
    },
  ) => Conversation;
  appendMessage: (
    id: string,
    m: Omit<Conversation["messages"][number], "id" | "createdAt">,
  ) => void;
  markConversationRead: (id: string, userId: string) => void;
  addSavedSearch: (s: Omit<SavedSearch, "id" | "createdAt">) => void;
  removeSavedSearch: (id: string) => void;
}

let _snapshot: StoreSnapshot | null = null;
let _mutators: StoreMutators | null = null;

let _resolveReady: () => void;
export const storeReady = new Promise<void>((resolve) => {
  _resolveReady = resolve;
});

export function getStore(): StoreSnapshot {
  if (!_snapshot) throw new Error("store not ready");
  return _snapshot;
}

export function getMutators(): StoreMutators {
  if (!_mutators) throw new Error("store not ready");
  return _mutators;
}

export function getToken(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw).token ?? null;
  } catch { /* ignore */ }
  return null;
}

interface AppState extends StoreSnapshot, StoreMutators {
  ready: boolean;
  theme: "light" | "dark";
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  loginAsAdmin: () => Promise<void>;
  loginAsAgent: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  markViewed: (id: string) => void;
  setTheme: (t: "light" | "dark") => void;
  resetData: () => void;
}

const Ctx = createContext<AppState | null>(null);

const KEY = "ucm:v1";

function loadPersisted(): Partial<Persisted> | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

function savePersisted(p: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* ignore */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const p = loadPersisted();
    if (p) {
      setUser(p.user ?? null);
      setToken(p.token ?? null);
      setWishlist(p.wishlist ?? []);
      setRecentlyViewed(p.recentlyViewed ?? []);
      setCompare(p.compare ?? []);
      setThemeState(p.theme ?? "light");
    }
    setReady(true);
    _resolveReady();
  }, []);

  // Persist only UI state + auth token
  useEffect(() => {
    if (!ready) return;
    const data: Persisted = {
      user,
      token,
      wishlist,
      recentlyViewed,
      compare,
      theme,
    };
    savePersisted(data);
  }, [ready, user, token, wishlist, recentlyViewed, compare, theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const mutators = useMemo<StoreMutators>(
    () => ({
      addListing: (l) => setListings((prev) => [l, ...prev]),
      updateListing: (id, patch) =>
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l))),
      addTicket: (t) => {
        const nt: Ticket = { ...t, id: "t-" + Date.now(), status: "open", createdAt: Date.now() };
        setTickets((prev) => [nt, ...prev]);
      },
      updateTicket: (id, patch) =>
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      addOffer: (o) => {
        const no: Offer = {
          ...o,
          id: "o-" + Date.now(),
          state: "pending",
          createdAt: Date.now(),
        };
        setOffers((prev) => [no, ...prev]);
      },
      updateOffer: (id, patch) =>
        setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o))),
      addBooking: (b) => {
        const nb: Booking = {
          ...b,
          id: "b-" + Date.now(),
          status: "confirmed",
          createdAt: Date.now(),
        };
        setBookings((prev) => [nb, ...prev]);
        return nb;
      },
      updateBooking: (id, patch) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b))),
      addReview: (r) => {
        const nr: Review = { ...r, id: "r-" + Date.now(), createdAt: Date.now() };
        setReviews((prev) => [nr, ...prev]);
      },
      addConversation: (c) => {
        const nc: Conversation = {
          id: "c-" + Date.now(),
          createdAt: Date.now(),
          messages: c.messages ?? [],
          listingId: c.listingId,
          buyerId: c.buyerId,
          sellerId: c.sellerId,
          sellerName: c.sellerName,
          listingTitle: c.listingTitle,
        };
        setConversations((prev) => [nc, ...prev]);
        return nc;
      },
      appendMessage: (id, m) =>
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { ...m, id: "m-" + Date.now(), createdAt: Date.now() },
                  ],
                }
              : c,
          ),
        ),
      markConversationRead: (id, userId) =>
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, lastReadAt: { ...(c.lastReadAt ?? {}), [userId]: Date.now() } }
              : c,
          ),
        ),
      addSavedSearch: (s) => {
        const ns: SavedSearch = { ...s, id: "ss-" + Date.now(), createdAt: Date.now() };
        setSavedSearches((prev) => [ns, ...prev]);
      },
      removeSavedSearch: (id) =>
        setSavedSearches((prev) => prev.filter((s) => s.id !== id)),
    }),
    [],
  );

  useEffect(() => {
    _mutators = mutators;
  }, [mutators]);

  useEffect(() => {
    _snapshot = {
      user,
      listings,
      tickets,
      offers,
      bookings,
      wishlist,
      recentlyViewed,
      compare,
      reviews,
      conversations,
      savedSearches,
    };
  }, [
    user,
    listings,
    tickets,
    offers,
    bookings,
    wishlist,
    recentlyViewed,
    compare,
    reviews,
    conversations,
    savedSearches,
  ]);

  const value: AppState = {
    ready,
    user,
    token,
    listings,
    tickets,
    offers,
    bookings,
    wishlist,
    theme,
    recentlyViewed,
    compare,
    reviews,
    conversations,
    savedSearches,
    ...mutators,
    async login(email, password) {
      const { user: u, token: t } = await apiLogin(email, password);
      setUser(u);
      setToken(t);
      return u;
    },
    async register(name, email, password) {
      const { user: u, token: t } = await apiRegister(name, email, password);
      setUser(u);
      setToken(t);
      return u;
    },
    async loginAsAdmin() {
      const { user: u, token: t } = await apiLogin("admin@drivehub.io", "admin");
      setUser(u);
      setToken(t);
    },
    async loginAsAgent() {
      // Try login first (agent is seeded with password "agent")
      try {
        const { user: u, token: t } = await apiLogin("agent@drivehub.io", "agent");
        setUser(u);
        setToken(t);
      } catch {
        // Agent might not be seeded yet — try registering
        try {
          const { user: u, token: t } = await apiRegister("Agent Priya", "agent@drivehub.io", "agent");
          setUser(u);
          setToken(t);
        } catch {
          // Both failed — silently ignore (server unavailable or DB not seeded)
        }
      }
    },
    logout() {
      setUser(null);
      setToken(null);
    },
    updateProfile(patch) {
      setUser((u) => (u ? { ...u, ...patch } : u));
    },
    toggleWishlist(id) {
      setWishlist((w) =>
        w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
      );
    },
    toggleCompare(id) {
      setCompare((c) =>
        c.includes(id)
          ? c.filter((x) => x !== id)
          : c.length >= 3
            ? c
            : [...c, id],
      );
    },
    clearCompare() {
      setCompare([]);
    },
    markViewed(id) {
      setRecentlyViewed((r) =>
        [id, ...r.filter((x) => x !== id)].slice(0, 8),
      );
    },
    setTheme(t) {
      setThemeState(t);
    },
    resetData() {
      setUser(null);
      setToken(null);
      setListings([]);
      setTickets([]);
      setOffers([]);
      setBookings([]);
      setWishlist([]);
      setRecentlyViewed([]);
      setCompare([]);
      setReviews([]);
      setConversations([]);
      setSavedSearches([]);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
