import { useState } from "react";
import { HandCoins, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { formatPrice } from "@/components/site/CarCard";
import type { Listing } from "@/lib/types";

export function OfferForm({ listing }: { listing: Listing }) {
  const { user, addOffer } = useApp();
  const price = listing.pricing?.finalPrice ?? listing.expectedPrice;
  const [amount, setAmount] = useState<number>(Math.round(price * 0.97));
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to make an offer");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amount > price * 1.1) {
      toast.error("Offer seems too high — check the amount");
      return;
    }
    addOffer({
      listingId: listing.id,
      buyerId: user.id,
      buyerName: user.name,
      amount,
      message: message || "Interested buyer.",
    });
    toast.success("Offer submitted! The seller will respond shortly.");
    setMessage("");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <HandCoins className="h-4 w-4 text-primary" />
        Make an offer
      </div>
      <p className="text-xs text-muted-foreground">
        Listed at <b className="text-foreground">{formatPrice(price)}</b>. Make a fair offer and the
        seller will respond.
      </p>
      <div>
        <Label className="mb-1.5 inline-block">Your offer (₹)</Label>
        <Input
          type="number"
          value={amount}
          min={Math.round(price * 0.5)}
          max={Math.round(price * 1.1)}
          step={10000}
          onChange={(e) => setAmount(+e.target.value)}
        />
      </div>
      <div>
        <Label className="mb-1.5 inline-block">Message (optional)</Label>
        <Textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'm a serious buyer, can close this week..."
        />
      </div>
      <Button type="submit" className="w-full" disabled={!user}>
        <Send className="mr-1 h-4 w-4" />
        {user ? "Submit offer" : "Sign in to offer"}
      </Button>
      {!user && (
        <p className="text-center text-xs text-muted-foreground">
          Offers are saved to your dashboard once signed in.
        </p>
      )}
    </form>
  );
}
