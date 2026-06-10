import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, Car, CheckCircle2, DollarSign, Inbox, LifeBuoy, Package, Search, ShieldCheck, TrendingUp, Users, XCircle } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { calculateFinalPrice } from "@/lib/mock-data";
import { formatPrice, StatusBadge } from "@/components/site/CarCard";
import type { Listing, TicketStatus } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — DriveHub" }] }),
  component: Admin,
});

function Admin() {
  const { user, listings, tickets, updateTicket } = useApp();

  if (!user || user.role !== "admin") {
    return <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Admin access required</h1>
      <p className="mt-2 text-muted-foreground">Sign in with an admin account or use the demo admin from the login page.</p>
      <Button asChild className="mt-4"><Link to="/login">Sign in</Link></Button>
    </div>;
  }

  const totalRevenue = listings.filter(l => l.pricing).reduce((s, l) => s + (l.pricing!.finalPrice * 0.13), 0);
  const stats = [
    { i: Car, label: "Total submissions", value: listings.length, trend: "+12%" },
    { i: Inbox, label: "Pending approvals", value: listings.filter(l => l.status === "pending_review" || l.status === "under_inspection").length, trend: "-3" },
    { i: Package, label: "Active listings", value: listings.filter(l => l.status === "listed").length, trend: "+8%" },
    { i: CheckCircle2, label: "Sold", value: listings.filter(l => l.status === "sold").length, trend: "+22%" },
    { i: DollarSign, label: "Total revenue", value: formatPrice(totalRevenue), trend: "+18%" },
    { i: LifeBuoy, label: "Open tickets", value: tickets.filter(t => t.status !== "resolved").length, trend: "" },
  ];

  const monthly = [
    { m: "Jan", sales: 8, revenue: 280 }, { m: "Feb", sales: 12, revenue: 410 },
    { m: "Mar", sales: 15, revenue: 520 }, { m: "Apr", sales: 18, revenue: 640 },
    { m: "May", sales: 22, revenue: 790 }, { m: "Jun", sales: 28, revenue: 960 },
  ];
  const statusData = (["pending_review", "under_inspection", "approved", "listed", "sold", "rejected"] as const).map(s => ({
    name: s.replace("_", " "), value: listings.filter(l => l.status === s).length,
  }));
  const COLORS = ["oklch(0.78 0.16 75)", "oklch(0.78 0.16 195)", "oklch(0.65 0.16 160)", "oklch(0.72 0.18 240)", "oklch(0.55 0.04 260)", "oklch(0.65 0.22 25)"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><ShieldCheck className="h-3.5 w-3.5" />Admin console</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Operations dashboard</h1>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search anything..." className="pl-9" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-4 card-elevated">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.i className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="mt-2 font-display text-xl font-bold">{s.value}</div>
            {s.trend && <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-success"><TrendingUp className="h-2.5 w-2.5" />{s.trend}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5 card-elevated lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Sales & revenue</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.18 240)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.72 0.18 240)" stopOpacity={0} /></linearGradient>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.16 195)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.78 0.16 195)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="m" stroke="oklch(0.7 0.02 250)" fontSize={12} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 260)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="sales" stroke="oklch(0.72 0.18 240)" fill="url(#gp)" />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.78 0.16 195)" fill="url(#gr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 card-elevated">
          <h3 className="mb-3 font-display text-sm font-semibold">Inventory by status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Tabs defaultValue="approvals" className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="approvals">Approval queue</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="tickets">Support tickets</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="mt-6">
          <div className="space-y-3">
            {listings.filter(l => l.status === "pending_review" || l.status === "under_inspection" || l.status === "approved").map(l => (
              <ApprovalRow key={l.id} listing={l} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="p-3">Car</th><th className="p-3">Status</th><th className="p-3">Asking</th><th className="p-3">Final</th><th className="p-3">Views</th><th className="p-3">Listed</th></tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b border-border/40 last:border-0">
                    <td className="p-3"><div className="flex items-center gap-3"><img src={l.images[0]} className="h-10 w-14 rounded object-cover" alt="" /><div><div className="font-medium">{l.brand} {l.model}</div><div className="text-xs text-muted-foreground">{l.year} · {l.variant}</div></div></div></td>
                    <td className="p-3"><StatusBadge status={l.status} /></td>
                    <td className="p-3">{formatPrice(l.expectedPrice)}</td>
                    <td className="p-3 font-medium">{l.pricing ? formatPrice(l.pricing.finalPrice) : "—"}</td>
                    <td className="p-3 text-muted-foreground">{l.views ?? 0}</td>
                    <td className="p-3 text-muted-foreground">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 card-elevated">
                <div className="min-w-[200px] flex-1">
                  <div className="font-display font-semibold">{t.subject}</div>
                  <div className="text-xs text-muted-foreground">{t.name} · {t.email} · {t.category}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.message}</p>
                </div>
                <Select value={t.status} onValueChange={(v) => { updateTicket(t.id, { status: v as TicketStatus }); toast.success("Ticket updated"); }}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="waiting_customer">Waiting customer</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="rounded-2xl border border-border/60 bg-card p-5 card-elevated">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Seller activity</h3>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[
                { m: "Jan", sellers: 12, buyers: 34 }, { m: "Feb", sellers: 18, buyers: 42 },
                { m: "Mar", sellers: 22, buyers: 56 }, { m: "Apr", sellers: 30, buyers: 71 },
                { m: "May", sellers: 36, buyers: 88 }, { m: "Jun", sellers: 41, buyers: 102 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="m" stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 260)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="sellers" fill="oklch(0.72 0.18 240)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="buyers" fill="oklch(0.78 0.16 195)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApprovalRow({ listing }: { listing: Listing }) {
  const { updateListing } = useApp();
  const [open, setOpen] = useState(false);
  const [p, setP] = useState({
    basePrice: listing.expectedPrice,
    refurbishment: listing.pricing?.refurbishment ?? Math.round(listing.expectedPrice * 0.04),
    repair: listing.pricing?.repair ?? Math.round(listing.expectedPrice * 0.02),
    transportation: listing.pricing?.transportation ?? 450,
    inspection: listing.pricing?.inspection ?? 250,
    documentation: listing.pricing?.documentation ?? 180,
    commission: listing.pricing?.commission ?? Math.round(listing.expectedPrice * 0.05),
    margin: listing.pricing?.margin ?? Math.round(listing.expectedPrice * 0.08),
  });
  const final = useMemo(() => calculateFinalPrice(p), [p]);

  function approve() {
    updateListing(listing.id, { status: "listed", pricing: { ...p, finalPrice: final } });
    toast.success("Listing approved & published"); setOpen(false);
  }
  function reject() { updateListing(listing.id, { status: "rejected" }); toast.success("Listing rejected"); }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 card-elevated">
      <img src={listing.images[0]} alt="" className="h-20 w-28 flex-none rounded-lg object-cover" />
      <div className="min-w-[200px] flex-1">
        <div className="font-display font-semibold">{listing.year} {listing.brand} {listing.model}</div>
        <div className="text-xs text-muted-foreground">{listing.sellerName} · {listing.registrationCity} · {listing.kmDriven.toLocaleString()} km</div>
        <div className="mt-2"><StatusBadge status={listing.status} /></div>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">Asking</div>
        <div className="font-display text-lg font-bold">{formatPrice(listing.expectedPrice)}</div>
      </div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm">Review & price</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{listing.year} {listing.brand} {listing.model} {listing.variant}</DialogTitle></DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <img src={listing.images[0]} className="aspect-video w-full rounded-lg object-cover" alt="" />
                <div className="mt-3 grid grid-cols-4 gap-2">{listing.images.slice(1, 5).map((s, i) => <img key={i} src={s} className="aspect-square rounded object-cover" alt="" />)}</div>
                <div className="mt-3 rounded-xl border border-border/60 bg-secondary/40 p-3 text-xs">
                  <div><b>Seller:</b> {listing.sellerName} · {listing.sellerPhone}</div>
                  <div className="mt-1"><b>VIN:</b> {listing.vin || "—"}</div>
                  <div className="mt-1"><b>Defects:</b> {listing.defects || "—"}</div>
                </div>
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold">Cost breakdown</h4>
                <div className="mt-3 space-y-2">
                  {([
                    ["basePrice", "Base price"], ["refurbishment", "Refurbishment"], ["repair", "Repair"],
                    ["transportation", "Transportation"], ["inspection", "Inspection"], ["documentation", "Documentation"],
                    ["commission", "Platform commission"], ["margin", "Margin"],
                  ] as const).map(([k, label]) => (
                    <div key={k} className="grid grid-cols-2 items-center gap-3">
                      <Label className="text-xs">{label}</Label>
                      <Input type="number" value={p[k]} onChange={e => setP({ ...p, [k]: +e.target.value })} className="h-8" />
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/15 to-accent/15 p-3">
                  <span className="font-display text-sm font-semibold">Final selling price</span>
                  <span className="font-display text-2xl font-bold gradient-text">{formatPrice(final)}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={approve} className="flex-1"><CheckCircle2 className="mr-1 h-4 w-4" />Approve & publish</Button>
                  <Button onClick={reject} variant="outline"><XCircle className="mr-1 h-4 w-4" />Reject</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
