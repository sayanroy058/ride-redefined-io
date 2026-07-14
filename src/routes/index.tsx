import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Car,
  ChevronRight,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useApp } from "@/lib/store";
import { CarCard } from "@/components/site/CarCard";
import { BRANDS, BODY_TYPES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { listings } = useApp();
  const nav = useNavigate();
  const featured = listings.filter((l) => l.status === "listed").slice(0, 6);
  const heroListing = featured[0] ?? listings[0];
  const [heroBrand, setHeroBrand] = useState<string>("");
  const [heroBody, setHeroBody] = useState<string>("");
  const [heroBudget, setHeroBudget] = useState<string>("");

  function search() {
    nav({
      to: "/buy",
      search: {
        brand: heroBrand || undefined,
        body: heroBody || undefined,
        budget: heroBudget || undefined,
      },
    });
  }

  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div
          className="absolute right-0 top-0 h-[40rem] w-[40rem] rounded-full blur-3xl"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Handpicked certified inventory
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Modern car buying, <br />
                <span className="text-accent">redefined.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                Browse inspected pre-owned cars with transparent pricing, same-day finance
                approvals, and a premium experience from click to driveway.
              </p>

              {/* Search bar */}
              <div className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <Select value={heroBrand || undefined} onValueChange={setHeroBrand}>
                  <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white shadow-none">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.slice(0, 8).map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={heroBody || undefined} onValueChange={setHeroBody}>
                  <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white shadow-none">
                    <SelectValue placeholder="Body type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_TYPES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={heroBudget || undefined} onValueChange={setHeroBudget}>
                  <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white shadow-none">
                    <SelectValue placeholder="Budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1000000">Under ₹10 L</SelectItem>
                    <SelectItem value="1000000-2500000">₹10 L - ₹25 L</SelectItem>
                    <SelectItem value="2500000-5000000">₹25 L - ₹50 L</SelectItem>
                    <SelectItem value="5000000+">₹50 L+</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-11 gap-1.5" onClick={search}>
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/buy">
                    Browse inventory <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/sell">Sell your car</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["12k+", "Cars sold"],
                  ["4.8/5", "Avg rating"],
                  ["200", "Inspection pts"],
                  ["7-day", "Returns"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="mt-0.5 text-xs text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image card */}
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={heroCar}
                  alt="Featured electric sedan"
                  width={1792}
                  height={1024}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-72 rounded-xl border border-border/60 bg-card p-5 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Certified & inspected
                </div>
                <div className="mt-3 text-lg font-bold">
                  {heroListing
                    ? `${heroListing.year} ${heroListing.brand} ${heroListing.model}`
                    : "2022 Tesla Model 3 LR"}
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {heroListing?.pricing?.finalPrice
                      ? `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(heroListing.pricing.finalPrice)}`
                      : "₹39,90,000"}
                  </span>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/buy">View <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body types */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Browse by type</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Shop by body type</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            From compact city cars to long-distance tourers and family SUVs — find the right fit.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {BODY_TYPES.map((b) => (
            <Link
              key={b}
              to="/buy"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Car className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium">{b}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why + Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Why DriveHub */}
          <div className="rounded-3xl border border-border/60 bg-card p-8">
            <div className="eyebrow">Why DriveHub</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              A more trustworthy experience.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Every step is designed to reduce friction and build confidence.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { i: ShieldCheck, t: "200-point inspection", d: "Master technicians verify safety, performance, and cosmetic quality." },
                { i: Wrench, t: "Refurbished in-house", d: "Each vehicle is detailed, repaired, and photographed to showroom standards." },
                { i: Banknote, t: "Instant financing", d: "Pre-approved EMI options arrive in minutes, not after endless callbacks." },
                { i: BadgeCheck, t: "7-day returns", d: "If the car isn't right, return it within seven days with full transparency." },
              ].map((x) => (
                <div key={x.t} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <x.i className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{x.t}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="eyebrow">Curated this week</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">Featured arrivals</h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/buy">
                  See all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((l) => (
                <CarCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl px-8 py-12 text-white md:px-12 md:py-16" style={{ background: "var(--gradient-hero)" }}>
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Sell with confidence
              </div>
              <h2 className="mt-5 text-4xl font-bold tracking-tight">
                Sell your car in 48 hours.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                Schedule a home inspection, receive a verified offer, and finish paperwork
                digitally — no chasing buyers or negotiating in parking lots.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/sell">Get instant quote</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/about">How it works</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                ["1", "Share car details and service history."],
                ["2", "Book a doorstep inspection slot."],
                ["3", "Approve the offer and get paid fast."],
              ].map(([step, text]) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-accent-foreground">
                    {step}
                  </div>
                  <p className="text-sm text-white/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials + FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Testimonials */}
          <div>
            <div className="eyebrow">Loved by drivers</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Customers notice the difference.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Thousands of buyers and sellers trust DriveHub for a calmer, more transparent way to
              change cars.
            </p>
            <div className="mt-6 grid gap-4">
              {[
                { n: "Priya R.", role: "Sold a hatchback", t: "Sold my old hatchback in 36 hours. The inspection came to me, payment hit my account the same day.", r: 5 },
                { n: "Marcus B.", role: "Bought a Polestar 2", t: "The refurbishment was honestly better than the demo car at the dealer.", r: 5 },
                { n: "Lina K.", role: "Financed in minutes", t: "Financing was approved while I was still browsing. Picked up the keys two days later.", r: 5 },
              ].map((x) => (
                <div
                  key={x.n}
                  className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: x.r }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/90">"{x.t}"</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {x.n.slice(0, 1)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{x.n}</div>
                      <div className="text-xs text-muted-foreground">{x.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="lg:pl-4">
            <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
              <div className="eyebrow">Answers first</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Everything you need to know before you buy or sell.
              </p>
              <Accordion type="single" collapsible className="mt-4">
                {[
                  { q: "How is the price calculated?", a: "We start from your expected price, add refurbishment, inspection, transport, documentation, commission, and a small margin. Every listing shows transparent pricing." },
                  { q: "Do you offer financing?", a: "Yes. Pre-approved EMI options are available in under five minutes, with rates starting at 7.9% APR for qualified buyers." },
                  { q: "What's covered by the 7-day return?", a: "Any reason. Return the car within 7 days or 300 miles for a full refund, excluding documented minor wear charges." },
                  { q: "How do you inspect cars?", a: "Every vehicle passes through a 200-point inspection performed by certified master technicians before it appears on DriveHub." },
                ].map((x, i) => (
                  <AccordionItem key={i} value={`q-${i}`} className="border-b border-border/60 last:border-0">
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                      {x.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">
                      {x.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-secondary/60 p-4">
                <div>
                  <div className="text-sm font-semibold">Still have questions?</div>
                  <div className="text-xs text-muted-foreground">Our team replies within an hour.</div>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/support">
                    Contact us <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

void Input;
