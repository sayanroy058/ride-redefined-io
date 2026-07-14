import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Car,
  ChevronRight,
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
      <section className="relative px-4 pb-8 pt-8 md:pb-12 md:pt-10">
        <div className="container mx-auto">
          <div className="ambient-noise relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-[var(--gradient-hero)] px-6 py-10 text-white shadow-[0_40px_120px_-45px_rgba(0,0,0,0.7)] md:px-10 md:py-14 lg:px-14">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div
              className="absolute -right-20 top-0 h-[28rem] w-[28rem] rounded-full blur-3xl"
              style={{ background: "var(--gradient-glow)" }}
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="max-w-2xl">
                <div className="eyebrow border-white/12 bg-white/8 text-white/70">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Handpicked certified inventory
                </div>
                <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-8xl">
                  Modern car buying with a calmer point of view.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                  Browse inspected pre-owned cars with transparent pricing, same-day finance
                  approvals, and a visual experience that feels as premium as the vehicles.
                </p>

                <div className="mt-8 grid gap-3 rounded-[1.8rem] border border-white/10 bg-white/8 p-3 backdrop-blur-xl sm:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_auto]">
                  <Select value={heroBrand || undefined} onValueChange={setHeroBrand}>
                    <SelectTrigger className="h-13 rounded-[1.2rem] border-white/10 bg-black/10 text-white shadow-none">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.slice(0, 8).map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={heroBody || undefined} onValueChange={setHeroBody}>
                    <SelectTrigger className="h-13 rounded-[1.2rem] border-white/10 bg-black/10 text-white shadow-none">
                      <SelectValue placeholder="Body type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_TYPES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={heroBudget || undefined} onValueChange={setHeroBudget}>
                    <SelectTrigger className="h-13 rounded-[1.2rem] border-white/10 bg-black/10 text-white shadow-none">
                      <SelectValue placeholder="Budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1000000">Under ₹10 L</SelectItem>
                      <SelectItem value="1000000-2500000">₹10 L - ₹25 L</SelectItem>
                      <SelectItem value="2500000-5000000">₹25 L - ₹50 L</SelectItem>
                      <SelectItem value="5000000+">₹50 L+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="lg" className="h-13 w-full justify-center gap-1.5" onClick={search}>
                    <Search className="h-4 w-4" />
                    Search stock
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to="/buy">
                      Browse inventory <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/16 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                  >
                    <Link to="/sell">Sell your car</Link>
                  </Button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-4">
                  {[
                    ["12k+", "Cars sold"],
                    ["4.8/5", "Average rating"],
                    ["200", "Inspection points"],
                    ["7-day", "Return promise"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4"
                    >
                      <div className="font-display text-3xl text-white">{value}</div>
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-3 backdrop-blur-xl">
                  <div className="overflow-hidden rounded-[1.6rem]">
                    <img
                      src={heroCar}
                      alt="Featured electric sedan"
                      width={1792}
                      height={1024}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-7 right-7 top-7 flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                      Editorial pick
                    </div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      Certified
                    </div>
                  </div>
                  <div className="absolute inset-x-7 bottom-7 grid gap-4 rounded-[1.6rem] border border-white/10 bg-background/88 p-5 text-foreground shadow-[0_24px_70px_-35px_rgba(0,0,0,0.65)] backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Featured model
                      </div>
                      <div className="mt-2 font-display text-3xl">
                        {heroListing
                          ? `${heroListing.year} ${heroListing.brand} ${heroListing.model}`
                          : "2022 Tesla Model 3 LR"}
                      </div>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Low-mileage, professionally detailed, and ready for immediate delivery with
                        a transparent inspection history.
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <div className="text-left md:text-right">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Starting from
                        </div>
                        <div className="mt-2 font-display text-3xl gradient-text">
                          {heroListing?.pricing?.finalPrice
                            ? `₹${new Intl.NumberFormat("en-IN", {
                                maximumFractionDigits: 0,
                              }).format(heroListing.pricing.finalPrice)}`
                            : "₹39,90,000"}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to="/buy">Explore now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-4 hidden max-w-[16rem] rounded-[1.5rem] border border-white/10 bg-white/8 p-5 text-white backdrop-blur-xl lg:block">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Why buyers switch
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    A dealership-grade journey without showroom pressure, hidden fees, or clutter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="section-shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">Discover by lifestyle</div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Shop by body type</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              A cleaner way to browse, from compact city cars to long-distance tourers and family
              SUVs.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {BODY_TYPES.map((b, index) => (
              <Link
                key={b}
                to="/buy"
                className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-white/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-white"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gradient-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <Car className="mt-8 h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:text-accent" />
                <div className="mt-4 font-medium">{b}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="section-shell">
            <div className="eyebrow">Why DriveHub</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              A more trustworthy experience.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Every key moment is designed to reduce friction, build confidence, and keep the focus
              on the right car instead of the sales process.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                {
                  i: ShieldCheck,
                  t: "200-point inspection",
                  d: "Master technicians verify safety, performance, and cosmetic quality before listing.",
                },
                {
                  i: Wrench,
                  t: "Refurbished in-house",
                  d: "Each vehicle is detailed, repaired, and photographed to showroom standards.",
                },
                {
                  i: Banknote,
                  t: "Instant financing",
                  d: "Pre-approved EMI options arrive in minutes, not after endless callbacks.",
                },
                {
                  i: BadgeCheck,
                  t: "7-day return",
                  d: "If the car is not right, return it within seven days with full transparency.",
                },
              ].map((x) => (
                <div
                  key={x.t}
                  className="flex gap-4 rounded-[1.5rem] border border-border/70 bg-white/55 p-4"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] bg-primary text-primary-foreground">
                    <x.i className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl">{x.t}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="eyebrow">Curated this week</div>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">Featured arrivals</h2>
              </div>
              <Button asChild variant="ghost" className="w-fit rounded-full">
                <Link to="/buy">
                  See all cars <ChevronRight className="h-4 w-4" />
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

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="ambient-noise relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-[var(--gradient-hero)] px-6 py-10 text-white shadow-[0_36px_110px_-48px_rgba(0,0,0,0.7)] md:px-10 md:py-14">
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="eyebrow border-white/12 bg-white/8 text-white/70">
                Sell with confidence
              </div>
              <h2 className="mt-5 font-display text-5xl sm:text-6xl">
                Sell your car in 48 hours, minus the dealership theatre.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                Schedule a home inspection, receive a verified offer, and finish paperwork digitally
                without chasing buyers or negotiating in parking lots.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/sell">Get instant quote</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/16 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link to="/about">How it works</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
              {[
                ["1", "Share car details and service history."],
                ["2", "Book a doorstep inspection slot."],
                ["3", "Approve the offer and get paid fast."],
              ].map(([step, text]) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-[1.4rem] border border-white/10 bg-black/10 p-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/10 font-display text-xl">
                    {step}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-white/72">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="section-shell">
            <div className="eyebrow">Loved by drivers</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Customers notice the difference.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  n: "Priya R.",
                  t: "Sold my old hatchback in 36 hours. The inspection came to me, payment hit my account the same day.",
                  r: 5,
                },
                {
                  n: "Marcus B.",
                  t: "Bought a Polestar 2. The refurbishment was honestly better than the demo car at the dealer.",
                  r: 5,
                },
                {
                  n: "Lina K.",
                  t: "Financing was approved while I was still browsing. Picked up the keys two days later.",
                  r: 5,
                },
              ].map((x) => (
                <div
                  key={x.n}
                  className="rounded-[1.6rem] border border-border/70 bg-white/55 p-5 card-elevated"
                >
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: x.r }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7">{x.t}</p>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {x.n}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell">
            <div className="eyebrow">Answers first</div>
            <h2 className="mt-4 text-center font-display text-4xl md:text-5xl">Frequently asked</h2>
            <Accordion type="single" collapsible className="mt-8">
              {[
                {
                  q: "How is the price calculated?",
                  a: "We start from your expected price, add refurbishment, inspection, transport, documentation, commission, and a small margin. Every listing shows transparent pricing so buyers understand the value.",
                },
                {
                  q: "Do you offer financing?",
                  a: "Yes. Pre-approved EMI options are available in under five minutes, with rates starting at 7.9% APR for qualified buyers.",
                },
                {
                  q: "What's covered by the 7-day return?",
                  a: "Any reason. Return the car within 7 days or 300 miles for a full refund, excluding documented minor wear charges.",
                },
                {
                  q: "How do you inspect cars?",
                  a: "Every vehicle passes through a 200-point inspection performed by certified master technicians before it appears on DriveHub.",
                },
              ].map((x, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="border-border/70">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {x.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-muted-foreground">
                    {x.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper because Input is imported above for tree-shaking awareness
void Input;
