import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Heart, MessageSquare, Plus, ShoppingBag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";
import { CarCard, formatPrice, StatusBadge } from "@/components/site/CarCard";
import { EmptyState } from "@/components/site/States";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Seller dashboard — DriveHub" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, listings, wishlist, offers, tickets } = useApp();

  if (!user) return <SignedOut />;

  const mine = listings.filter(l => l.sellerId === user.id);
  const wished = listings.filter(l => wishlist.includes(l.id));
  const myTickets = tickets.filter(t => t.email === user.email || t.userId === user.id);

  const stats = [
    { i: Car, label: "Submitted", value: mine.length },
    { i: ShoppingBag, label: "Listed", value: mine.filter(m => m.status === "listed").length },
    { i: Heart, label: "Wishlist", value: wishlist.length },
    { i: Wallet, label: "Offers", value: offers.length },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Hi {user.name} 👋</h1>
          <p className="text-sm text-muted-foreground">Track your listings, offers, and support tickets.</p>
        </div>
        <Button asChild><Link to="/sell"><Plus className="mr-1 h-4 w-4" />List a new car</Link></Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5 card-elevated">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <s.i className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="listings" className="mt-8">
        <TabsList>
          <TabsTrigger value="listings">My listings</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="tickets">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {mine.length === 0 ? (
            <EmptyState title="No listings yet" description="Submit your first car for a free inspection."
              icon={<Car className="h-6 w-6" />}
              action={<Button asChild><Link to="/sell">Sell a car</Link></Button>} />
          ) : (
            <div className="space-y-3">
              {mine.map(l => (
                <div key={l.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 card-elevated">
                  <img src={l.images[0]} alt="" className="h-20 w-28 flex-none rounded-lg object-cover" />
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-display font-semibold">{l.year} {l.brand} {l.model}</div>
                    <div className="text-xs text-muted-foreground">{l.variant} · {l.kmDriven.toLocaleString()} km</div>
                    <div className="mt-2"><StatusBadge status={l.status} /></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Asking</div>
                    <div className="font-display text-lg font-bold">{formatPrice(l.expectedPrice)}</div>
                  </div>
                  <Button asChild size="sm" variant="outline"><Link to="/buy/$id" params={{ id: l.id }}>View</Link></Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {offers.length === 0 ? <EmptyState title="No offers yet" icon={<Wallet className="h-6 w-6" />} /> : (
            <div className="space-y-3">
              {offers.map(o => {
                const l = listings.find(l => l.id === o.listingId);
                return (
                  <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-4 card-elevated">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-display font-semibold">{l ? `${l.brand} ${l.model}` : "Listing"}</div>
                        <div className="text-xs text-muted-foreground">{o.buyerName} · {new Date(o.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold">{formatPrice(o.amount)}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">"{o.message}"</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">Accept</Button>
                      <Button size="sm" variant="outline">Counter</Button>
                      <Button size="sm" variant="ghost">Decline</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          {wished.length === 0 ? <EmptyState title="No saved cars" description="Tap the heart on any car to save it here." icon={<Heart className="h-6 w-6" />} /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{wished.map(l => <CarCard key={l.id} listing={l} />)}</div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          {myTickets.length === 0 ? <EmptyState title="No tickets" description="Need help? Open one from our Support page." icon={<MessageSquare className="h-6 w-6" />}
            action={<Button asChild><Link to="/support">Get help</Link></Button>} /> : (
            <div className="space-y-3">
              {myTickets.map(t => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 card-elevated">
                  <div>
                    <div className="font-display font-semibold">{t.subject}</div>
                    <div className="text-xs text-muted-foreground">{t.category} · {new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">{t.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SignedOut() {
  return <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="font-display text-3xl font-bold">Sign in to access your dashboard</h1>
    <p className="mt-2 text-muted-foreground">Track your listings, offers and support tickets.</p>
    <div className="mt-6 flex justify-center gap-3">
      <Button asChild><Link to="/login">Sign in</Link></Button>
      <Button asChild variant="outline"><Link to="/register">Create account</Link></Button>
    </div>
  </div>;
}
