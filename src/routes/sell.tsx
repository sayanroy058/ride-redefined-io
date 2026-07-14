import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Image as ImageIcon, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { BRANDS, BODY_TYPES, FUEL_TYPES, OWNERSHIP, STATES, TRANSMISSIONS } from "@/lib/mock-data";
import type { Listing } from "@/lib/types";

export const Route = createFileRoute("/sell")({
  component: Sell,
});

const STEPS = ["Vehicle basics", "Specifications", "Condition", "Media & docs", "Seller details"] as const;

function Sell() {
  const { user, addListing } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    brand: "", model: "", variant: "", bodyType: "Sedan",
    year: 2022, registrationYear: 2022, fuelType: "Petrol", transmission: "Automatic",
    kmDriven: 25000, ownership: "1st Owner", registrationState: "California", registrationCity: "Los Angeles",
    vin: "", insuranceStatus: "Active", roadTaxStatus: "Paid",
    serviceHistory: "Complete dealer history", accidentHistory: "No accidents", keys: 2,
    exteriorCondition: "Excellent", interiorCondition: "Excellent", engineCondition: "Excellent",
    tireCondition: "Good (70%+)", batteryCondition: "Good", defects: "", modifications: "None",
    description: "", expectedPrice: 25000,
    sellerName: user?.name ?? "", sellerEmail: user?.email ?? "", sellerPhone: "", address: "",
    preferredContactTime: "Afternoon (12-5)",
  });

  if (!user) return <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="font-display text-3xl font-bold">Sign in to sell your car</h1>
    <p className="mt-2 text-muted-foreground">Create an account to submit your vehicle.</p>
    <div className="mt-6 flex justify-center gap-3"><Button asChild><Link to="/login">Login</Link></Button><Button asChild variant="outline"><Link to="/register">Register</Link></Button></div>
  </div>;

  function next() { if (step < STEPS.length - 1) setStep(s => s + 1); }
  function prev() { if (step > 0) setStep(s => s - 1); }

  function submit() {
    if (!f.brand || !f.model || !f.sellerName || !f.sellerPhone) { toast.error("Please complete required fields"); return; }
    const listing: Listing = {
      id: "L-" + Date.now(),
      sellerId: user!.id,
      sellerName: f.sellerName, sellerEmail: f.sellerEmail, sellerPhone: f.sellerPhone,
      brand: f.brand, model: f.model, variant: f.variant, year: f.year, registrationYear: f.registrationYear,
      fuelType: f.fuelType, transmission: f.transmission, kmDriven: f.kmDriven, ownership: f.ownership,
      registrationState: f.registrationState, registrationCity: f.registrationCity, vin: f.vin,
      insuranceStatus: f.insuranceStatus, roadTaxStatus: f.roadTaxStatus, serviceHistory: f.serviceHistory,
      accidentHistory: f.accidentHistory, keys: f.keys,
      exteriorCondition: f.exteriorCondition, interiorCondition: f.interiorCondition,
      engineCondition: f.engineCondition, tireCondition: f.tireCondition, batteryCondition: f.batteryCondition,
      defects: f.defects, modifications: f.modifications, description: f.description,
      expectedPrice: f.expectedPrice, address: f.address, preferredContactTime: f.preferredContactTime,
      bodyType: f.bodyType,
      images: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
      ],
      status: "pending_review",
      createdAt: Date.now(),
    };
    addListing(listing);
    toast.success("Submission received! Our team will review within 24 hours.");
    nav({ to: "/dashboard" });
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Sell your car</h1>
        <p className="mt-1 text-sm text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
        <Progress value={progress} className="mt-4 h-2" />
        <div className="mt-4 hidden flex-wrap gap-2 md:flex">
          {STEPS.map((s, i) => (
            <div key={s} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${i < step ? "bg-success/10 text-success" : i === step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {i < step && <Check className="h-3 w-3" />} {i + 1}. {s}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 card-elevated md:p-8">
        {step === 0 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand *"><SelectV value={f.brand} onChange={v => setF({ ...f, brand: v })} options={BRANDS} placeholder="Choose brand" /></Field>
          <Field label="Model *"><Input value={f.model} onChange={e => setF({ ...f, model: e.target.value })} placeholder="e.g. Model 3" /></Field>
          <Field label="Variant"><Input value={f.variant} onChange={e => setF({ ...f, variant: e.target.value })} placeholder="e.g. Long Range AWD" /></Field>
          <Field label="Body type"><SelectV value={f.bodyType} onChange={v => setF({ ...f, bodyType: v })} options={BODY_TYPES} /></Field>
          <Field label="Manufacturing year"><Input type="number" value={f.year} onChange={e => setF({ ...f, year: +e.target.value })} /></Field>
          <Field label="Registration year"><Input type="number" value={f.registrationYear} onChange={e => setF({ ...f, registrationYear: +e.target.value })} /></Field>
          <Field label="Expected selling price (₹ INR)"><Input type="number" value={f.expectedPrice} onChange={e => setF({ ...f, expectedPrice: +e.target.value })} /></Field>
        </div>}

        {step === 1 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Fuel type"><SelectV value={f.fuelType} onChange={v => setF({ ...f, fuelType: v })} options={FUEL_TYPES} /></Field>
          <Field label="Transmission"><SelectV value={f.transmission} onChange={v => setF({ ...f, transmission: v })} options={TRANSMISSIONS} /></Field>
          <Field label="Kilometers driven"><Input type="number" value={f.kmDriven} onChange={e => setF({ ...f, kmDriven: +e.target.value })} /></Field>
          <Field label="Ownership"><SelectV value={f.ownership} onChange={v => setF({ ...f, ownership: v })} options={OWNERSHIP} /></Field>
          <Field label="Registration state"><SelectV value={f.registrationState} onChange={v => setF({ ...f, registrationState: v })} options={STATES} /></Field>
          <Field label="Registration city"><Input value={f.registrationCity} onChange={e => setF({ ...f, registrationCity: e.target.value })} /></Field>
          <Field label="VIN / Chassis number"><Input value={f.vin} onChange={e => setF({ ...f, vin: e.target.value })} /></Field>
          <Field label="Insurance status"><SelectV value={f.insuranceStatus} onChange={v => setF({ ...f, insuranceStatus: v })} options={["Active", "Expired", "Expires soon", "None"]} /></Field>
          <Field label="Road tax status"><SelectV value={f.roadTaxStatus} onChange={v => setF({ ...f, roadTaxStatus: v })} options={["Paid", "Pending", "Expired"]} /></Field>
          <Field label="Keys available"><Input type="number" value={f.keys} onChange={e => setF({ ...f, keys: +e.target.value })} /></Field>
        </div>}

        {step === 2 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Service history"><SelectV value={f.serviceHistory} onChange={v => setF({ ...f, serviceHistory: v })} options={["Complete dealer history", "Partial records", "Owner serviced", "Not available"]} /></Field>
          <Field label="Accident history"><SelectV value={f.accidentHistory} onChange={v => setF({ ...f, accidentHistory: v })} options={["No accidents", "Minor — repaired", "Major — repaired"]} /></Field>
          <Field label="Exterior condition"><SelectV value={f.exteriorCondition} onChange={v => setF({ ...f, exteriorCondition: v })} options={["Excellent", "Very Good", "Good", "Fair"]} /></Field>
          <Field label="Interior condition"><SelectV value={f.interiorCondition} onChange={v => setF({ ...f, interiorCondition: v })} options={["Excellent", "Very Good", "Good", "Fair"]} /></Field>
          <Field label="Engine condition"><SelectV value={f.engineCondition} onChange={v => setF({ ...f, engineCondition: v })} options={["Excellent", "Very Good", "Good", "Needs work"]} /></Field>
          <Field label="Tire condition"><SelectV value={f.tireCondition} onChange={v => setF({ ...f, tireCondition: v })} options={["New (90%+)", "Good (70%+)", "Fair (50%+)", "Worn"]} /></Field>
          <Field label="Battery condition"><SelectV value={f.batteryCondition} onChange={v => setF({ ...f, batteryCondition: v })} options={["Excellent", "Good", "Fair", "Needs replacement"]} /></Field>
          <Field label="Modifications"><Input value={f.modifications} onChange={e => setF({ ...f, modifications: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Known defects or damages"><Textarea rows={3} value={f.defects} onChange={e => setF({ ...f, defects: e.target.value })} /></Field></div>
          <div className="md:col-span-2"><Field label="Description"><Textarea rows={4} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} placeholder="Tell buyers about your car..." /></Field></div>
        </div>}

        {step === 3 && <div className="grid gap-5">
          <UploadCard icon={ImageIcon} title="Vehicle images" desc="Upload at least 10 images: exterior, interior, dashboard, engine, tires, damages." count={12} />
          <UploadCard icon={Video} title="Walkaround video" desc="A 1–2 minute video showing the entire vehicle." count={1} />
          <UploadCard icon={FileText} title="Documents" desc="Insurance, service records, RC, road tax receipt." count={4} />
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <Upload className="mr-2 inline h-4 w-4 text-primary" />For this demo, we'll use placeholder media. Real uploads supported once Cloud is enabled.
          </div>
        </div>}

        {step === 4 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Seller name *"><Input value={f.sellerName} onChange={e => setF({ ...f, sellerName: e.target.value })} /></Field>
          <Field label="Contact number *"><Input value={f.sellerPhone} onChange={e => setF({ ...f, sellerPhone: e.target.value })} placeholder="+1 555 123 4567" /></Field>
          <Field label="Email"><Input type="email" value={f.sellerEmail} onChange={e => setF({ ...f, sellerEmail: e.target.value })} /></Field>
          <Field label="Preferred contact time"><SelectV value={f.preferredContactTime} onChange={v => setF({ ...f, preferredContactTime: v })} options={["Morning (9-12)", "Afternoon (12-5)", "Evening (5-8)"]} /></Field>
          <div className="md:col-span-2"><Field label="Complete address"><Textarea rows={3} value={f.address} onChange={e => setF({ ...f, address: e.target.value })} /></Field></div>
        </div>}

        <div className="mt-8 flex justify-between gap-3">
          <Button variant="outline" onClick={prev} disabled={step === 0}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={next}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
            : <Button onClick={submit} size="lg">Submit for review</Button>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 inline-block">{label}</Label>{children}</div>;
}
function SelectV({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
    <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
  </Select>;
}
function UploadCard({ icon: Icon, title, desc, count }: { icon: any; title: string; desc: string; count: number }) {
  return <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-5 transition hover:border-primary/50 hover:bg-secondary/50">
    <div className="grid h-12 w-12 place-items-center rounded-xl bg-background"><Icon className="h-5 w-5 text-primary" /></div>
    <div className="flex-1">
      <div className="font-display text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <div className="text-xs font-semibold text-success">{count} attached</div>
    <input type="file" multiple className="hidden" />
  </label>;
}
