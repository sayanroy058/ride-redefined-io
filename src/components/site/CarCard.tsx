import { Link } from "@tanstack/react-router";
import { Fuel, GaugeCircle, Heart, MapPin, Settings2, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import type { Listing } from "@/lib/types";

export function formatPrice(p: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);
}

export function StatusBadge({ status }: { status: Listing["status"] }) {
  const map: Record<Listing["status"], { label: string; cls: string }> = {
    pending_review: { label: "Pending Review", cls: "bg-warning/15 text-warning border-warning/40" },
    under_inspection: { label: "Under Inspection", cls: "bg-accent/15 text-accent border-accent/40" },
    approved: { label: "Approved", cls: "bg-success/15 text-success border-success/40" },
    rejected: { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/40" },
    listed: { label: "Listed", cls: "bg-primary/15 text-primary border-primary/40" },
    sold: { label: "Sold", cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status];
  return <Badge variant="outline" className={`border ${m.cls}`}>{m.label}</Badge>;
}

export function CarCard({ listing }: { listing: Listing }) {
  const { wishlist, toggleWishlist, compare, toggleCompare } = useApp();
  const fav = wishlist.includes(listing.id);
  const cmp = compare.includes(listing.id);
  const price = listing.pricing?.finalPrice ?? listing.expectedPrice;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-primary/40 card-elevated">
      <Link to="/buy/$id" params={{ id: listing.id }} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        <img src={listing.images[0]} alt={`${listing.brand} ${listing.model}`} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {listing.featured && <Badge className="absolute left-3 top-3 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">Featured</Badge>}
        <div className="absolute right-3 top-3 flex gap-1">
          <button onClick={e => { e.preventDefault(); toggleWishlist(listing.id); }}
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
            aria-label="Wishlist">
            <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <button onClick={e => { e.preventDefault(); toggleCompare(listing.id); }}
            className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${cmp ? "bg-primary text-primary-foreground" : "bg-background/80 hover:bg-background"}`}
            aria-label="Compare">
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold leading-tight">{listing.brand} {listing.model}</h3>
            <p className="text-xs text-muted-foreground">{listing.variant} · {listing.year}</p>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold">{formatPrice(price)}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Final price</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><GaugeCircle className="h-3.5 w-3.5" />{listing.kmDriven.toLocaleString()} km</span>
          <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{listing.fuelType}</span>
          <span className="inline-flex items-center gap-1.5"><Settings2 className="h-3.5 w-3.5" />{listing.transmission}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{listing.registrationCity}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{listing.ownership}</span>
          <Button asChild size="sm" variant="secondary"><Link to="/buy/$id" params={{ id: listing.id }}>View details</Link></Button>
        </div>
      </div>
    </div>
  );
}
