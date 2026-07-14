import { Link } from "@tanstack/react-router";
import { Fuel, GaugeCircle, Heart, MapPin, Settings2, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import type { Listing } from "@/lib/types";

export function formatPrice(p: number) {
  // Indian numbering (lakhs/crores), prefix with ₹
  return "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(p));
}

export function formatPriceShort(p: number) {
  const n = Math.round(p);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return "₹" + new Intl.NumberFormat("en-IN").format(n);
}

export function StatusBadge({ status }: { status: Listing["status"] }) {
  const map: Record<Listing["status"], { label: string; cls: string }> = {
    pending_review: {
      label: "Pending Review",
      cls: "bg-warning/15 text-warning border-warning/40",
    },
    under_inspection: {
      label: "Under Inspection",
      cls: "bg-accent/15 text-accent border-accent/40",
    },
    approved: { label: "Approved", cls: "bg-success/15 text-success border-success/40" },
    rejected: {
      label: "Rejected",
      cls: "bg-destructive/15 text-destructive border-destructive/40",
    },
    listed: { label: "Listed", cls: "bg-primary/15 text-primary border-primary/40" },
    sold: { label: "Sold", cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status];
  return (
    <Badge variant="outline" className={`border ${m.cls}`}>
      {m.label}
    </Badge>
  );
}

export function CarCard({ listing }: { listing: Listing }) {
  const { wishlist, toggleWishlist, compare, toggleCompare } = useApp();
  const fav = wishlist.includes(listing.id);
  const cmp = compare.includes(listing.id);
  const price = listing.pricing?.finalPrice ?? listing.expectedPrice;

  return (
    <div className="group overflow-hidden rounded-[1.8rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.66))] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 card-elevated">
      <Link
        to="/buy/$id"
        params={{ id: listing.id }}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
      >
        <img
          src={listing.images[0]}
          alt={`${listing.brand} ${listing.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
        {listing.featured && (
          <Badge className="absolute left-4 top-4 border-0 bg-white/90 text-foreground shadow-md">
            Featured
          </Badge>
        )}
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(listing.id);
            }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/85 backdrop-blur transition hover:bg-background"
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(listing.id);
            }}
            className={`grid h-10 w-10 place-items-center rounded-full border border-white/15 backdrop-blur transition ${cmp ? "bg-primary text-primary-foreground" : "bg-background/85 hover:bg-background"}`}
            aria-label="Compare"
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            {listing.registrationCity}
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {listing.variant} / {listing.year}
            </div>
            <h3 className="mt-2 font-display text-[2rem] leading-none">
              {listing.brand} {listing.model}
            </h3>
          </div>
          <div className="rounded-[1.2rem] border border-border/70 bg-white/65 px-3 py-2 text-right">
            <div className="font-display text-2xl leading-none">{formatPrice(price)}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Final price
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/55 px-3 py-2">
            <GaugeCircle className="h-3.5 w-3.5" />
            {listing.kmDriven.toLocaleString()} km
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/55 px-3 py-2">
            <Fuel className="h-3.5 w-3.5" />
            {listing.fuelType}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/55 px-3 py-2">
            <Settings2 className="h-3.5 w-3.5" />
            {listing.transmission}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/55 px-3 py-2">
            <MapPin className="h-3.5 w-3.5" />
            {listing.registrationCity}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/70 pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {listing.ownership}
          </span>
          <Button asChild size="sm" variant="secondary" className="rounded-full">
            <Link to="/buy/$id" params={{ id: listing.id }}>
              View details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
