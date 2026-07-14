import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Scale, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { CarCard, formatPrice } from "@/components/site/CarCard";
import { EmptyState } from "@/components/site/States";
import { BODY_TYPES, BRANDS, FUEL_TYPES, OWNERSHIP, STATES, TRANSMISSIONS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/buy/")({
  head: () => ({
    meta: [
      { title: "Buy Used Cars — DriveHub Inventory" },
      { name: "description", content: "Browse certified pre-owned cars. Filter by brand, fuel, transmission, price, and more." },
    ],
  }),
  component: BuyPage,
});

type Sort = "newest" | "price_low" | "price_high" | "km_low";

function BuyPage() {
  const { listings, compare, recentlyViewed } = useApp();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string[]>([]);
  const [body, setBody] = useState<string[]>([]);
  const [fuel, setFuel] = useState<string[]>([]);
  const [trans, setTrans] = useState<string[]>([]);
  const [own, setOwn] = useState<string[]>([]);
  const [state, setState] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 10000000]);
  const [year, setYear] = useState<[number, number]>([2015, 2024]);
  const [km, setKm] = useState<[number, number]>([0, 150000]);
  const [sort, setSort] = useState<Sort>("newest");

  const inventory = listings.filter(l => l.status === "listed" || l.status === "approved");

  const filtered = useMemo(() => {
    let r = inventory.filter(l => {
      const p = l.pricing?.finalPrice ?? l.expectedPrice;
      if (query && !`${l.brand} ${l.model} ${l.variant}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (brand.length && !brand.includes(l.brand)) return false;
      if (body.length && !body.includes(l.bodyType)) return false;
      if (fuel.length && !fuel.includes(l.fuelType)) return false;
      if (trans.length && !trans.includes(l.transmission)) return false;
      if (own.length && !own.includes(l.ownership)) return false;
      if (state.length && !state.includes(l.registrationState)) return false;
      if (p < price[0] || p > price[1]) return false;
      if (l.year < year[0] || l.year > year[1]) return false;
      if (l.kmDriven < km[0] || l.kmDriven > km[1]) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const pa = a.pricing?.finalPrice ?? a.expectedPrice;
      const pb = b.pricing?.finalPrice ?? b.expectedPrice;
      if (sort === "price_low") return pa - pb;
      if (sort === "price_high") return pb - pa;
      if (sort === "km_low") return a.kmDriven - b.kmDriven;
      return b.createdAt - a.createdAt;
    });
    return r;
  }, [inventory, query, brand, body, fuel, trans, own, state, price, year, km, sort]);

  const recentList = listings.filter(l => recentlyViewed.includes(l.id)).slice(0, 4);

  const filters = (
    <div className="space-y-6">
      <FilterGroup title="Brand" options={BRANDS} values={brand} onChange={setBrand} />
      <FilterGroup title="Body type" options={BODY_TYPES} values={body} onChange={setBody} />
      <FilterGroup title="Fuel" options={FUEL_TYPES} values={fuel} onChange={setFuel} />
      <FilterGroup title="Transmission" options={TRANSMISSIONS} values={trans} onChange={setTrans} />
      <FilterGroup title="Ownership" options={OWNERSHIP} values={own} onChange={setOwn} />
      <FilterGroup title="Location" options={STATES} values={state} onChange={setState} />

      <div>
        <div className="mb-2 flex justify-between text-sm font-medium"><span>Price</span><span className="text-muted-foreground">{formatPrice(price[0])} – {formatPrice(price[1])}</span></div>
        <Slider min={0} max={10000000} step={50000} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm font-medium"><span>Year</span><span className="text-muted-foreground">{year[0]} – {year[1]}</span></div>
        <Slider min={2015} max={2024} step={1} value={year} onValueChange={(v) => setYear(v as [number, number])} />
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm font-medium"><span>Kilometers</span><span className="text-muted-foreground">{km[0].toLocaleString()} – {km[1].toLocaleString()}</span></div>
        <Slider min={0} max={150000} step={5000} value={km} onValueChange={(v) => setKm(v as [number, number])} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Buy a car</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} inspected, refurbished cars ready to drive</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search Tesla, BMW, M340i..." className="pl-9" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select value={sort} onValueChange={v => setSort(v as Sort)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="km_low">Lowest km</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" className="lg:hidden"><SlidersHorizontal className="h-4 w-4" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto p-6">
              <SheetTitle>Filters</SheetTitle>
              <div className="mt-6">{filters}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {compare.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><Scale className="h-4 w-4 text-primary" />Comparing {compare.length} {compare.length === 1 ? "car" : "cars"} (max 3)</div>
          <div className="flex gap-2"><Button asChild size="sm" disabled={compare.length < 2}><Link to="/buy">Open compare</Link></Button></div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-5 card-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold"><Filter className="h-4 w-4" />Filters</h3>
            </div>
            {filters}
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <EmptyState title="No cars match your filters" description="Try widening the price or year range." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(l => <CarCard key={l.id} listing={l} />)}
            </div>
          )}

          {recentList.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 font-display text-xl font-semibold">Recently viewed</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recentList.map(l => <CarCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options, values, onChange }: { title: string; options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => onChange(values.includes(o) ? values.filter(x => x !== o) : [...values, o]);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        {values.length > 0 && <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => onChange([])}><X className="h-3 w-3 inline" /> clear</button>}
      </div>
      <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
        {options.map(o => (
          <label key={o} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Checkbox checked={values.includes(o)} onCheckedChange={() => toggle(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
