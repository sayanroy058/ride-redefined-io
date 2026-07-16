import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { generateMockListings, generateSeedReviews, SEED_OFFERS, SEED_TICKETS } from "./mock-data";
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
  reviews: Review[];
  conversations: Conversation[];
  savedSearches: SavedSearch[];
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

interface AppState extends StoreSnapshot, StoreMutators {
  ready: boolean;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

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
      setReviews(p.reviews ?? []);
      setConversations(p.conversations ?? []);
      setSavedSearches(p.savedSearches ?? []);
    } else {
      setListings(generateMockListings());
      setTickets(SEED_TICKETS);
      setOffers(SEED_OFFERS);
      setReviews(generateSeedReviews(generateMockListings()));
    }
    setReady(true);
    _resolveReady();
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
      reviews,
      conversations,
      savedSearches,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [
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
    reviews,
    conversations,
    savedSearches,
  ]);

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
        const no: Offer = { ...o, id: "o-" + Date.now(), state: "pending", createdAt: Date.now() };
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
                  messages: [...c.messages, { ...m, id: "m-" + Date.now(), createdAt: Date.now() }],
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
      removeSavedSearch: (id) => setSavedSearches((prev) => prev.filter((s) => s.id !== id)),
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
        reviews: [],
        conversations: [],
        savedSearches: [],
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
