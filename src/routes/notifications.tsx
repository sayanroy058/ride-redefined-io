import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CalendarCheck, HandCoins, Inbox, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { EmptyState } from "@/components/site/States";
import { formatPrice } from "@/components/site/CarCard";
import type { Offer, Ticket, Booking } from "@/lib/types";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

type Item = {
  id: string;
  kind: "offer" | "ticket" | "booking";
  title: string;
  body: string;
  time: number;
  href?: { to: string; params?: Record<string, string> };
  badge?: string;
};

function NotificationsPage() {
  const { user, listings, offers, tickets, bookings } = useApp();

  const myListings = listings.filter((l) => l.sellerId === user?.id);
  const myListingIds = new Set(myListings.map((l) => l.id));

  const items: Item[] = [];

  // Offers on my listings (seller view) + offers I made (buyer view)
  offers.forEach((o: Offer) => {
    const l = listings.find((l) => l.id === o.listingId);
    const onMyListing = myListingIds.has(o.listingId);
    const mine = o.buyerId === user?.id;
    if (!onMyListing && !mine) return;
    if (onMyListing) {
      const state = o.state ?? "pending";
      items.push({
        id: "offer-" + o.id,
        kind: "offer",
        title: `${o.buyerName} made an offer of ${formatPrice(o.amount)}`,
        body: o.message,
        time: o.createdAt,
        href: { to: "/dashboard" },
        badge: state,
      });
    } else if (mine) {
      items.push({
        id: "offer-mine-" + o.id,
        kind: "offer",
        title: `Your offer of ${formatPrice(o.amount)} ${o.state === "accepted" ? "was accepted 🎉" : o.state === "declined" ? "was declined" : "is " + (o.state ?? "pending")}`,
        body: l ? `${l.brand} ${l.model}` : "",
        time: o.createdAt,
        href: l ? { to: "/buy/$id", params: { id: l.id } } : undefined,
        badge: o.state,
      });
    }
  });

  // Tickets (mine)
  tickets
    .filter((t) => t.email === user?.email || t.userId === user?.id)
    .forEach((t: Ticket) => {
      items.push({
        id: "ticket-" + t.id,
        kind: "ticket",
        title: `Support ticket: ${t.subject}`,
        body: `Status: ${t.status.replace("_", " ")}`,
        time: t.createdAt,
        href: { to: "/support" },
        badge: t.status.replace("_", " "),
      });
    });

  // Bookings (mine)
  bookings
    .filter((b) => b.userId === user?.id)
    .forEach((b: Booking) => {
      const l = listings.find((l) => l.id === b.listingId);
      items.push({
        id: "booking-" + b.id,
        kind: "booking",
        title: `${b.type === "reserve" ? "Reservation" : "Purchase"} confirmed: ${l ? `${l.brand} ${l.model}` : "a car"}`,
        body: `${formatPrice(b.type === "reserve" ? (b.reserveFee ?? 0) : (b.downPayment ?? 0))} ${b.type === "reserve" ? "reserve fee" : "down payment"} paid`,
        time: b.createdAt,
        href: l ? { to: "/buy/$id", params: { id: l.id } } : { to: "/dashboard" },
        badge: b.status,
      });
    });

  items.sort((a, b) => b.time - a.time);

  const ICON = { offer: HandCoins, ticket: LifeBuoy, booking: CalendarCheck };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Offers on your listings, booking updates, and ticket replies show up here."
          icon={<Inbox className="h-6 w-6" />}
          action={
            <Button asChild>
              <Link to="/buy">Browse cars</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const Icon = ICON[it.kind];
            return (
              <Link
                key={it.id}
                to={it.href?.to ?? "/dashboard"}
                params={it.href?.params}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition hover:border-primary/40"
              >
                <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{it.title}</div>
                    {it.badge && (
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {it.badge}
                      </Badge>
                    )}
                  </div>
                  {it.body && <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(it.time).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
