import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Banknote, Car, ChevronRight, Search, ShieldCheck, Sparkles, Star, Wrench } from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useApp } from "@/lib/store";
import { CarCard } from "@/components/site/CarCard";
import { BRANDS, BODY_TYPES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { listings } = useApp();
  const featured = listings.filter(l => l.status === "listed").slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="absolute -right-32 top-10 -z-10 h-[600px] w-[600px] rounded-full" style={{ background: "var(--gradient-glow)" }} />
        <div className="container mx-auto px-4 pb-20 pt-16 md:pt-24 lg:grid lg:grid-cols-2 lg:gap-12 lg:pb-32">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>200-point inspection · 7-day return</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              The next chapter of <span className="gradient-text">your drive</span> starts here.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/70">
              Certified pre-owned cars, inspected and refurbished by experts. Transparent pricing, instant EMI, doorstep delivery.
            </p>

            {/* Search bar */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-background/70 p-3 backdrop-blur-xl card-elevated">
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Select><SelectTrigger className="border-0 bg-transparent"><SelectValue placeholder="Brand" /></SelectTrigger>
                  <SelectContent>{BRANDS.slice(0, 8).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                <Select><SelectTrigger className="border-0 bg-transparent"><SelectValue placeholder="Body type" /></SelectTrigger>
                  <SelectContent>{BODY_TYPES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                <Select><SelectTrigger className="border-0 bg-transparent"><SelectValue placeholder="Budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1000000">Under ₹10 L</SelectItem>
                    <SelectItem value="1000000-2500000">₹10 L – ₹25 L</SelectItem>
                    <SelectItem value="2500000-5000000">₹25 L – ₹50 L</SelectItem>
                    <SelectItem value="5000000+">₹50 L+</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild size="lg" className="gap-1.5">
                  <Link to="/buy"><Search className="h-4 w-4" />Search</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/buy">Browse inventory <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link to="/sell">Sell your car</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-white/70">
              {[["12k+", "Cars sold"], ["4.8★", "Avg rating"], ["200+", "Inspection pts"], ["7-day", "Returns"]].map(([n, l]) => (
                <div key={l as string}><div className="font-display text-2xl font-bold text-white">{n}</div><div className="text-xs uppercase tracking-wider">{l}</div></div>
              ))}
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img src={heroCar} alt="Featured electric sedan" width={1792} height={1024} className="h-full w-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-background/80 p-4 backdrop-blur-xl">
                <div>
                  <div className="text-xs text-muted-foreground">Editor's pick</div>
                  <div className="font-display text-lg font-semibold">2022 Tesla Model 3 LR</div>
                </div>
                <Button asChild size="sm"><Link to="/buy">Explore</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Shop by body type</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find your fit, from city hatchbacks to family SUVs.</p>
          </div>
          <Link to="/buy" className="hidden text-sm text-primary hover:underline md:inline-flex">View all <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {BODY_TYPES.map(b => (
            <Link key={b} to="/buy"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-center transition hover:-translate-y-0.5 hover:border-primary/40 card-elevated">
              <Car className="mx-auto h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <div className="mt-3 text-sm font-medium">{b}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured cars */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Featured this week</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hand-picked, fully inspected, ready to drive.</p>
          </div>
          <Button asChild variant="ghost"><Link to="/buy">See all <ChevronRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(l => <CarCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Trust indicators */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { i: ShieldCheck, t: "200-point inspection", d: "Every car certified by master technicians." },
            { i: Wrench, t: "Refurbished in-house", d: "Detailed, repaired, and ready to drive." },
            { i: Banknote, t: "Instant financing", d: "Pre-approved EMI in under 5 minutes." },
            { i: BadgeCheck, t: "7-day return", d: "Not in love? Return for a full refund." },
          ].map(x => (
            <div key={x.t} className="rounded-2xl border border-border/60 bg-card p-6 card-elevated">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary"><x.i className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-base font-semibold">{x.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sell CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 p-10 md:p-14" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative max-w-2xl text-white">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Sell your car in <span className="gradient-text">48 hours</span></h2>
            <p className="mt-3 text-white/70">Submit details, get a verified inspection at home, accept the best offer. No haggling.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/sell">Get instant quote</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Link to="/about">How it works</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Drivers love DriveHub</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { n: "Priya R.", t: "Sold my old hatchback in 36 hours. The inspection came to me, payment hit my account same day.", r: 5 },
            { n: "Marcus B.", t: "Bought a Polestar 2. The refurbishment was honestly better than the demo car at the dealer.", r: 5 },
            { n: "Lina K.", t: "Financing was approved while I was still browsing. Picked up the keys two days later.", r: 5 },
          ].map(x => (
            <div key={x.n} className="rounded-2xl border border-border/60 bg-card p-6 card-elevated">
              <div className="flex gap-1 text-accent">{Array.from({ length: x.r }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm">{x.t}</p>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">— {x.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold">Frequently asked</h2>
          <Accordion type="single" collapsible className="mt-8">
            {[
              { q: "How is the price calculated?", a: "We start from your expected price, add refurbishment, inspection, transport, documentation, commission, and a small margin. The final listing price is transparent on every car." },
              { q: "Do you offer financing?", a: "Yes — pre-approved EMI in under 5 minutes, with rates starting at 7.9% APR for qualified buyers." },
              { q: "What's covered by the 7-day return?", a: "Any reason. Return the car within 7 days or 300 miles for a full refund (minus minor wear charges)." },
              { q: "How do you inspect cars?", a: "Every car goes through a 200-point inspection by certified master technicians before listing." },
            ].map((x, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left text-base">{x.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{x.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

// Helper because Input is imported above for tree-shaking awareness
void Input;
