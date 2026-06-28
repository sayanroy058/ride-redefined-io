import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Calendar, Car, Fuel, GaugeCircle, Heart, MapPin, Phone, PlayCircle, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { CarCard, formatPrice } from "@/components/site/CarCard";
import { emiEstimate } from "@/lib/mock-data";

export const Route = createFileRoute("/buy/$id")({
  component: VehicleDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Car not found</h1>
      <Button asChild className="mt-4"><Link to="/buy">Back to inventory</Link></Button>
    </div>
  ),
  errorComponent: ({ error }) => <div className="container mx-auto p-10 text-center text-destructive">{String(error)}</div>,
});

function VehicleDetail() {
  const { id } = useParams({ from: "/buy/$id" });
  const { listings, markViewed, toggleWishlist, wishlist } = useApp();
  const listing = listings.find(l => l.id === id);
  const [active, setActive] = useState(0);

  useEffect(() => { if (listing) markViewed(listing.id); }, [listing?.id]);

  if (!listing) throw notFound();

  const price = listing.pricing?.finalPrice ?? listing.expectedPrice;
  const emi = emiEstimate(price);
  const similar = listings.filter(l => l.id !== listing.id && l.bodyType === listing.bodyType).slice(0, 3);
  const fav = wishlist.includes(listing.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/buy" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to inventory</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl border border-border/60 card-elevated">
            <div className="relative aspect-[16/10] bg-muted">
              <img src={listing.images[active]} alt={`${listing.brand} ${listing.model}`} className="h-full w-full object-cover" />
              <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur" onClick={() => toggleWishlist(listing.id)}>
                <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
              </button>
              <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur">
                <PlayCircle className="h-4 w-4" /> Walkaround video
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto p-3">
              {listing.images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`relative h-16 w-24 flex-none overflow-hidden rounded-lg border-2 transition ${i === active ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">{listing.bodyType}</Badge>
                <h1 className="font-display text-3xl font-bold">{listing.year} {listing.brand} {listing.model}</h1>
                <p className="text-muted-foreground">{listing.variant}</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Listed price</div>
                <div className="font-display text-3xl font-bold gradient-text">{formatPrice(price)}</div>
                <div className="text-xs text-muted-foreground">EMI from {formatPrice(emi)}/mo</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { i: GaugeCircle, l: `${listing.kmDriven.toLocaleString()} km` },
                { i: Fuel, l: listing.fuelType },
                { i: Settings2, l: listing.transmission },
                { i: Calendar, l: `${listing.ownership}` },
              ].map((x, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-sm">
                  <x.i className="h-4 w-4 text-primary" />{x.l}
                </div>
              ))}
            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="inspection">Inspection</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Sunroof", "Apple CarPlay", "360° Camera", "Heated seats", "ADAS Level 2", "Premium audio", "Wireless charging"].map(f => (
                      <Badge key={f} variant="outline">{f}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="pt-4">
                <SpecGrid items={[
                  ["Year", listing.year], ["Registration year", listing.registrationYear],
                  ["VIN", listing.vin], ["Body type", listing.bodyType],
                  ["Fuel", listing.fuelType], ["Transmission", listing.transmission],
                  ["KM driven", listing.kmDriven.toLocaleString()], ["Ownership", listing.ownership],
                  ["State", listing.registrationState], ["City", listing.registrationCity],
                  ["Insurance", listing.insuranceStatus], ["Road tax", listing.roadTaxStatus],
                  ["Keys", listing.keys],
                ]} />
              </TabsContent>

              <TabsContent value="inspection" className="space-y-3 pt-4">
                <SpecGrid items={[
                  ["Exterior", listing.exteriorCondition], ["Interior", listing.interiorCondition],
                  ["Engine", listing.engineCondition], ["Tires", listing.tireCondition],
                  ["Battery", listing.batteryCondition], ["Accidents", listing.accidentHistory],
                  ["Defects", listing.defects], ["Modifications", listing.modifications],
                ]} />
                <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
                  <ShieldCheck className="mr-2 inline h-4 w-4 text-success" />Passed our 200-point inspection.
                </div>
              </TabsContent>

              <TabsContent value="service" className="pt-4">
                <p className="text-sm text-muted-foreground">{listing.serviceHistory}</p>
              </TabsContent>

              <TabsContent value="pricing" className="pt-4">
                {listing.pricing ? (
                  <div className="rounded-2xl border border-border/60 bg-card p-5">
                    {[
                      ["Base price", listing.pricing.basePrice],
                      ["Refurbishment", listing.pricing.refurbishment],
                      ["Repair", listing.pricing.repair],
                      ["Transportation", listing.pricing.transportation],
                      ["Inspection", listing.pricing.inspection],
                      ["Documentation", listing.pricing.documentation],
                      ["Platform commission", listing.pricing.commission],
                      ["Margin", listing.pricing.margin],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex justify-between border-b border-border/60 py-2 text-sm last:border-0">
                        <span className="text-muted-foreground">{k}</span><span className="font-medium">{formatPrice(v as number)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between pt-2 font-display text-lg font-bold"><span>Final price</span><span className="gradient-text">{formatPrice(listing.pricing.finalPrice)}</span></div>
                  </div>
                ) : <p className="text-sm text-muted-foreground">Pricing pending admin review.</p>}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border/60 bg-card p-5 card-elevated">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total drive-away</div>
            <div className="mt-1 font-display text-3xl font-bold">{formatPrice(price)}</div>
            <div className="mt-1 text-sm text-muted-foreground">From <span className="font-semibold text-foreground">{formatPrice(emi)}/mo</span> · 60 months</div>
            <div className="mt-4 grid gap-2">
              <Button size="lg" className="w-full">Buy now</Button>
              <Button size="lg" variant="outline" className="w-full">Reserve · ₹7,999</Button>
              <Button size="lg" variant="ghost" className="w-full"><Phone className="mr-2 h-4 w-4" />Talk to advisor</Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-success" />7-day return guarantee</div>
              <div className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5 text-success" />200-point inspection passed</div>
              <div className="flex items-center gap-2"><Car className="h-3.5 w-3.5 text-success" />Free home delivery</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 card-elevated">
            <h3 className="font-display text-sm font-semibold">Location</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{listing.registrationCity}, {listing.registrationState}</div>
          </div>
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-semibold">Similar cars</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map(l => <CarCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecGrid({ items }: { items: Array<[string, any]> }) {
  return (
    <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-border/60 py-2 text-sm">
          <span className="text-muted-foreground">{k}</span>
          <span className="text-right font-medium">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
