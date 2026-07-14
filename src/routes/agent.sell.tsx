import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { BRANDS, BODY_TYPES, FUEL_TYPES, OWNERSHIP, STATES, TRANSMISSIONS } from "@/lib/mock-data";
import type { Listing } from "@/lib/types";

export const Route = createFileRoute("/agent/sell")({
  component: AgentSell,
});

const STEPS = [
  "Seller details",
  "Vehicle basics",
  "Specifications",
  "Condition & defects",
  "Pricing & submit",
] as const;

const CAR_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
];

function AgentSell() {
  const { user, addListing } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    // seller (walk-in)
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    address: "",
    preferredContactTime: "Afternoon (12-5)",
    // vehicle
    brand: "",
    model: "",
    variant: "",
    bodyType: "Sedan",
    year: 2022,
    registrationYear: 2022,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 25000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    registrationCity: "Mumbai",
    vin: "",
    insuranceStatus: "Active",
    roadTaxStatus: "Paid",
    serviceHistory: "Complete dealer history",
    accidentHistory: "No accidents",
    keys: 2,
    exteriorCondition: "Excellent",
    interiorCondition: "Excellent",
    engineCondition: "Excellent",
    tireCondition: "Good (70%+)",
    batteryCondition: "Good",
    defects: "",
    modifications: "None",
    description: "",
    expectedPrice: 1500000,
    agentNotes: "",
  });

  if (!user || user.role !== "agent") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Agent access required</h1>
        <p className="mt-2 text-muted-foreground">
          Only agents can onboard cars from this workflow.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function submit() {
    if (!f.brand || !f.model || !f.sellerName || !f.sellerPhone) {
      toast.error("Please fill required fields (seller & vehicle basics)");
      return;
    }
    const listing: Listing = {
      id: "L-" + Date.now(),
      sellerId: user!.id,
      sellerName: f.sellerName,
      sellerEmail: f.sellerEmail,
      sellerPhone: f.sellerPhone,
      brand: f.brand,
      model: f.model,
      variant: f.variant,
      year: f.year,
      registrationYear: f.registrationYear,
      fuelType: f.fuelType,
      transmission: f.transmission,
      kmDriven: f.kmDriven,
      ownership: f.ownership,
      registrationState: f.registrationState,
      registrationCity: f.registrationCity,
      vin: f.vin,
      insuranceStatus: f.insuranceStatus,
      roadTaxStatus: f.roadTaxStatus,
      serviceHistory: f.serviceHistory,
      accidentHistory: f.accidentHistory,
      keys: f.keys,
      exteriorCondition: f.exteriorCondition,
      interiorCondition: f.interiorCondition,
      engineCondition: f.engineCondition,
      tireCondition: f.tireCondition,
      batteryCondition: f.batteryCondition,
      defects: f.defects,
      modifications: f.modifications,
      description: `[Agent: ${user!.name}] ${f.description}\n\nAgent notes: ${f.agentNotes}`,
      expectedPrice: f.expectedPrice,
      address: f.address,
      preferredContactTime: f.preferredContactTime,
      bodyType: f.bodyType,
      images: CAR_IMAGES,
      status: "pending_review",
      createdAt: Date.now(),
    };
    addListing(listing);
    toast.success("Car onboarded — submitted for inspection & pricing");
    nav({ to: "/agent" });
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Briefcase className="h-3.5 w-3.5" />
          Agent onboarding
        </div>
      </div>
      <h1 className="font-display text-3xl font-bold">Onboard a car for a walk-in seller</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You'll capture every detail on the seller's behalf. The car goes into our inspection &
        approval pipeline.
      </p>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {step + 1} of {STEPS.length}: <b className="text-foreground">{STEPS[step]}</b>
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="mt-2" />

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 card-elevated">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Seller name *">
              <Input
                value={f.sellerName}
                onChange={(e) => setF({ ...f, sellerName: e.target.value })}
              />
            </Field>
            <Field label="Seller phone *">
              <Input
                value={f.sellerPhone}
                onChange={(e) => setF({ ...f, sellerPhone: e.target.value })}
                placeholder="+91 ..."
              />
            </Field>
            <Field label="Seller email">
              <Input
                type="email"
                value={f.sellerEmail}
                onChange={(e) => setF({ ...f, sellerEmail: e.target.value })}
              />
            </Field>
            <Field label="Preferred contact time">
              <Select
                value={f.preferredContactTime}
                onValueChange={(v) => setF({ ...f, preferredContactTime: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Morning (9-12)", "Afternoon (12-5)", "Evening (5-8)"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Pickup address" className="md:col-span-2">
              <Textarea
                rows={2}
                value={f.address}
                onChange={(e) => setF({ ...f, address: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Brand *">
              <Select value={f.brand} onValueChange={(v) => setF({ ...f, brand: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Model *">
              <Input value={f.model} onChange={(e) => setF({ ...f, model: e.target.value })} />
            </Field>
            <Field label="Variant">
              <Input
                value={f.variant}
                onChange={(e) => setF({ ...f, variant: e.target.value })}
                placeholder="e.g. ZXi AT"
              />
            </Field>
            <Field label="Body type">
              <Select value={f.bodyType} onValueChange={(v) => setF({ ...f, bodyType: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BODY_TYPES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Mfg. year">
              <Input
                type="number"
                value={f.year}
                onChange={(e) => setF({ ...f, year: +e.target.value })}
              />
            </Field>
            <Field label="Registration year">
              <Input
                type="number"
                value={f.registrationYear}
                onChange={(e) => setF({ ...f, registrationYear: +e.target.value })}
              />
            </Field>
            <Field label="Registration state">
              <Select
                value={f.registrationState}
                onValueChange={(v) => setF({ ...f, registrationState: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Registration city">
              <Input
                value={f.registrationCity}
                onChange={(e) => setF({ ...f, registrationCity: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fuel type">
              <Select value={f.fuelType} onValueChange={(v) => setF({ ...f, fuelType: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Transmission">
              <Select value={f.transmission} onValueChange={(v) => setF({ ...f, transmission: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="KM driven">
              <Input
                type="number"
                value={f.kmDriven}
                onChange={(e) => setF({ ...f, kmDriven: +e.target.value })}
              />
            </Field>
            <Field label="Ownership">
              <Select value={f.ownership} onValueChange={(v) => setF({ ...f, ownership: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="VIN / Chassis">
              <Input value={f.vin} onChange={(e) => setF({ ...f, vin: e.target.value })} />
            </Field>
            <Field label="Number of keys">
              <Input
                type="number"
                value={f.keys}
                onChange={(e) => setF({ ...f, keys: +e.target.value })}
              />
            </Field>
            <Field label="Insurance">
              <Select
                value={f.insuranceStatus}
                onValueChange={(v) => setF({ ...f, insuranceStatus: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Active", "Expired", "Third-party only"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Road tax">
              <Select
                value={f.roadTaxStatus}
                onValueChange={(v) => setF({ ...f, roadTaxStatus: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Paid", "Pending", "Lifetime"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Exterior">
              <Input
                value={f.exteriorCondition}
                onChange={(e) => setF({ ...f, exteriorCondition: e.target.value })}
              />
            </Field>
            <Field label="Interior">
              <Input
                value={f.interiorCondition}
                onChange={(e) => setF({ ...f, interiorCondition: e.target.value })}
              />
            </Field>
            <Field label="Engine">
              <Input
                value={f.engineCondition}
                onChange={(e) => setF({ ...f, engineCondition: e.target.value })}
              />
            </Field>
            <Field label="Tires">
              <Input
                value={f.tireCondition}
                onChange={(e) => setF({ ...f, tireCondition: e.target.value })}
              />
            </Field>
            <Field label="Battery">
              <Input
                value={f.batteryCondition}
                onChange={(e) => setF({ ...f, batteryCondition: e.target.value })}
              />
            </Field>
            <Field label="Service history">
              <Input
                value={f.serviceHistory}
                onChange={(e) => setF({ ...f, serviceHistory: e.target.value })}
              />
            </Field>
            <Field label="Accident history" className="md:col-span-2">
              <Input
                value={f.accidentHistory}
                onChange={(e) => setF({ ...f, accidentHistory: e.target.value })}
              />
            </Field>
            <Field label="Known defects (be transparent)" className="md:col-span-2">
              <Textarea
                rows={3}
                value={f.defects}
                onChange={(e) => setF({ ...f, defects: e.target.value })}
                placeholder="Minor dent on rear bumper, AC compressor to be inspected..."
              />
            </Field>
            <Field label="Modifications" className="md:col-span-2">
              <Input
                value={f.modifications}
                onChange={(e) => setF({ ...f, modifications: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4">
            <Field label="Seller's expected price (₹)">
              <Input
                type="number"
                value={f.expectedPrice}
                onChange={(e) => setF({ ...f, expectedPrice: +e.target.value })}
              />
            </Field>
            <Field label="Description for buyers">
              <Textarea
                rows={3}
                value={f.description}
                onChange={(e) => setF({ ...f, description: e.target.value })}
                placeholder="Well-maintained single-owner car with full service history..."
              />
            </Field>
            <Field label="Internal agent notes (not visible to buyers)">
              <Textarea
                rows={3}
                value={f.agentNotes}
                onChange={(e) => setF({ ...f, agentNotes: e.target.value })}
                placeholder="Seller is negotiable up to 5%. Pickup Saturday. Suggest refurb budget ₹40k."
              />
            </Field>
            <div className="rounded-xl border border-border/60 bg-secondary/40 p-4 text-sm">
              <div className="mb-2 font-display font-semibold">Review summary</div>
              <ul className="grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
                <li>
                  Seller: <b className="text-foreground">{f.sellerName || "—"}</b>
                </li>
                <li>
                  Phone: <b className="text-foreground">{f.sellerPhone || "—"}</b>
                </li>
                <li>
                  Car:{" "}
                  <b className="text-foreground">
                    {f.year} {f.brand} {f.model}
                  </b>
                </li>
                <li>
                  KM: <b className="text-foreground">{f.kmDriven.toLocaleString()}</b>
                </li>
                <li>
                  Ask: <b className="text-foreground">₹{f.expectedPrice.toLocaleString("en-IN")}</b>
                </li>
                <li>
                  Location: <b className="text-foreground">{f.registrationCity}</b>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit}>
              <Check className="mr-1 h-4 w-4" />
              Submit for inspection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
