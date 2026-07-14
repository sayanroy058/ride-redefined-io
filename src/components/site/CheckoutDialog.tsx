import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, CalendarClock, Car, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { formatPrice, formatPriceShort } from "@/components/site/CarCard";
import { emiFor } from "@/components/site/EmiCalculator";
import type { BookingType, Listing } from "@/lib/types";

const RESERVE_FEE = 7999;

export function CheckoutDialog({
  listing,
  open,
  onOpenChange,
  type,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: BookingType;
}) {
  const { user, addBooking } = useApp();
  const nav = useNavigate();
  const price = listing.pricing?.finalPrice ?? listing.expectedPrice;
  const [tenure, setTenure] = useState(5);
  const [downPct, setDownPct] = useState(20);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(listing.registrationCity);

  const downPayment = Math.round((price * downPct) / 100);
  const monthly = emiFor(price, downPayment, tenure, 9.5);
  const dueNow = type === "reserve" ? RESERVE_FEE : downPayment;

  function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to continue");
      return;
    }
    if (!name || !phone) {
      toast.error("Please fill your name and phone");
      return;
    }
    addBooking({
      listingId: listing.id,
      userId: user.id,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      type,
      amount: price,
      reserveFee: type === "reserve" ? RESERVE_FEE : undefined,
      tenure,
      downPayment,
    });
    toast.success(
      type === "reserve"
        ? "Car reserved! ₹7,999 holds it for 48h."
        : "Purchase confirmed! We'll be in touch.",
    );
    onOpenChange(false);
    nav({ to: "/dashboard" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "reserve" ? (
              <CalendarClock className="h-5 w-5 text-primary" />
            ) : (
              <CreditCard className="h-5 w-5 text-primary" />
            )}
            {type === "reserve" ? "Reserve this car" : "Confirm purchase"}
          </DialogTitle>
          <DialogDescription>
            {listing.year} {listing.brand} {listing.model} · {listing.variant}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={confirm} className="space-y-5">
          <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Drive-away price</span>
              <span className="font-display text-xl font-bold">{formatPrice(price)}</span>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Down payment ({downPct}%)</span>
              <span className="text-right font-medium">{formatPriceShort(downPayment)}</span>
              <span className="text-muted-foreground">Tenure</span>
              <span className="text-right font-medium">{tenure} yrs</span>
              <span className="text-muted-foreground">EMI estimate</span>
              <span className="text-right font-medium">{formatPriceShort(monthly)}/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SliderRow
              label="Down payment"
              value={`${downPct}%`}
              min={0}
              max={60}
              step={5}
              v={downPct}
              set={setDownPct}
            />
            <SliderRow
              label="Tenure"
              value={`${tenure}y`}
              min={1}
              max={7}
              step={1}
              v={tenure}
              set={setTenure}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 inline-block">Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label className="mb-1.5 inline-block">Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
                required
              />
            </div>
            <div>
              <Label className="mb-1.5 inline-block">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 inline-block">Delivery city</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due now</span>
              <span className="font-display text-2xl font-bold gradient-text">
                {formatPrice(dueNow)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {type === "reserve"
                ? "Refundable reservation fee. Holds the car for 48 hours while we arrange inspection & paperwork."
                : "Down payment due today. Balance via EMI or full payment on delivery."}
            </p>
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              7-day money-back guarantee
            </span>
            <span className="inline-flex items-center gap-2">
              <Car className="h-3.5 w-3.5 text-success" />
              Free home delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 text-success" />
              RC transfer handled
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-success" />
              Pick up in {listing.registrationCity}
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={!user}>
            {type === "reserve"
              ? `Reserve for ${formatPriceShort(RESERVE_FEE)}`
              : `Confirm & pay ${formatPriceShort(dueNow)}`}
          </Button>
          {!user && (
            <p className="text-center text-xs text-muted-foreground">
              Sign in to complete this step.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  v,
  set,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  v: number;
  set: (n: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => set(+e.target.value)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary"
      />
    </div>
  );
}
