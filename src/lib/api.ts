import { getMutators, getStore, storeReady } from "./store";
import type { Booking, Listing, Offer, Review, Ticket } from "./types";

const FAIL_RATE = 0.03;
const MIN_DELAY = 200;
const MAX_DELAY = 600;

let failuresEnabled = true;
try {
  failuresEnabled = localStorage.getItem("ucm:mock-failures") !== "off";
} catch {
  failuresEnabled = true;
}

export function setMockFailures(enabled: boolean) {
  failuresEnabled = enabled;
  try {
    localStorage.setItem("ucm:mock-failures", enabled ? "on" : "off");
  } catch {
    /* ignore */
  }
}

function delay() {
  const ms = MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function maybeFail() {
  if (failuresEnabled && Math.random() < FAIL_RATE) {
    throw new Error("Network error — please try again.");
  }
}

async function ready() {
  await storeReady;
}

export async function getListings(): Promise<Listing[]> {
  await ready();
  await delay();
  await maybeFail();
  return getStore().listings;
}

export async function getListing(id: string): Promise<Listing> {
  await ready();
  await delay();
  await maybeFail();
  const l = getStore().listings.find((x) => x.id === id);
  if (!l) throw new Error("Listing not found");
  return l;
}

export async function getSimilar(id: string): Promise<Listing[]> {
  await ready();
  await delay();
  await maybeFail();
  const { listings } = getStore();
  const target = listings.find((l) => l.id === id);
  if (!target) return [];
  return listings.filter((l) => l.id !== id && l.bodyType === target.bodyType).slice(0, 3);
}

export interface SearchFilters {
  q?: string;
  brand?: string[];
  body?: string[];
  fuel?: string[];
  trans?: string[];
  own?: string[];
  state?: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMin?: number;
  kmMax?: number;
  sort?: string;
}

export async function searchListings(filters: SearchFilters): Promise<Listing[]> {
  await ready();
  await delay();
  await maybeFail();
  const inventory = getStore().listings.filter(
    (l) => l.status === "listed" || l.status === "approved",
  );
  let r = inventory.filter((l) => {
    const p = l.pricing?.finalPrice ?? l.expectedPrice;
    if (
      filters.q &&
      !`${l.brand} ${l.model} ${l.variant}`.toLowerCase().includes(filters.q.toLowerCase())
    )
      return false;
    if (filters.brand?.length && !filters.brand.includes(l.brand)) return false;
    if (filters.body?.length && !filters.body.includes(l.bodyType)) return false;
    if (filters.fuel?.length && !filters.fuel.includes(l.fuelType)) return false;
    if (filters.trans?.length && !filters.trans.includes(l.transmission)) return false;
    if (filters.own?.length && !filters.own.includes(l.ownership)) return false;
    if (filters.state?.length && !filters.state.includes(l.registrationState)) return false;
    if (filters.priceMin != null && p < filters.priceMin) return false;
    if (filters.priceMax != null && p > filters.priceMax) return false;
    if (filters.yearMin != null && l.year < filters.yearMin) return false;
    if (filters.yearMax != null && l.year > filters.yearMax) return false;
    if (filters.kmMin != null && l.kmDriven < filters.kmMin) return false;
    if (filters.kmMax != null && l.kmDriven > filters.kmMax) return false;
    return true;
  });
  const sort = filters.sort ?? "newest";
  r = [...r].sort((a, b) => {
    const pa = a.pricing?.finalPrice ?? a.expectedPrice;
    const pb = b.pricing?.finalPrice ?? b.expectedPrice;
    if (sort === "price_low") return pa - pb;
    if (sort === "price_high") return pb - pa;
    if (sort === "km_low") return a.kmDriven - b.kmDriven;
    return b.createdAt - a.createdAt;
  });
  return r;
}

export async function getReviews(listingId: string): Promise<Review[]> {
  await ready();
  await delay();
  await maybeFail();
  return getStore().reviews.filter((r) => r.listingId === listingId);
}

export async function addReview(r: Omit<Review, "id" | "createdAt">): Promise<Review> {
  await ready();
  await delay();
  await maybeFail();
  getMutators().addReview(r);
  return { ...r, id: "r-" + Date.now(), createdAt: Date.now() };
}

export async function getOffers(listingId?: string): Promise<Offer[]> {
  await ready();
  await delay();
  await maybeFail();
  const { offers } = getStore();
  return listingId ? offers.filter((o) => o.listingId === listingId) : offers;
}

export async function createOffer(o: Omit<Offer, "id" | "createdAt" | "state">): Promise<Offer> {
  await ready();
  await delay();
  await maybeFail();
  getMutators().addOffer(o);
  return { ...o, id: "o-" + Date.now(), state: "pending", createdAt: Date.now() };
}

export async function counterOffer(id: string, amount: number): Promise<void> {
  await ready();
  await delay();
  await maybeFail();
  getMutators().updateOffer(id, { state: "countered", counterAmount: amount });
}

export async function updateOffer(id: string, patch: Partial<Offer>): Promise<void> {
  await ready();
  await delay();
  await maybeFail();
  getMutators().updateOffer(id, patch);
}

export async function getBookings(userId?: string): Promise<Booking[]> {
  await ready();
  await delay();
  await maybeFail();
  const { bookings } = getStore();
  return userId ? bookings.filter((b) => b.userId === userId) : bookings;
}

export async function createBooking(
  b: Omit<Booking, "id" | "createdAt" | "status">,
): Promise<Booking> {
  await ready();
  await delay();
  await maybeFail();
  return getMutators().addBooking(b);
}

export async function getTickets(userId?: string): Promise<Ticket[]> {
  await ready();
  await delay();
  await maybeFail();
  const { tickets, user } = getStore();
  if (userId) {
    const u = user;
    return tickets.filter((t) => t.email === u?.email || t.userId === userId);
  }
  return tickets;
}

export async function createTicket(
  t: Omit<Ticket, "id" | "createdAt" | "status">,
): Promise<Ticket> {
  await ready();
  await delay();
  await maybeFail();
  getMutators().addTicket(t);
  return { ...t, id: "t-" + Date.now(), status: "open", createdAt: Date.now() };
}
