import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { CarCard } from "@/components/site/CarCard";
import { EmptyState } from "@/components/site/States";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { listings, wishlist } = useApp();
  const wished = listings.filter((l) => wishlist.includes(l.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Your wishlist</h1>
        <p className="text-sm text-muted-foreground">
          {wished.length} saved {wished.length === 1 ? "car" : "cars"}. Tap the heart again to
          remove.
        </p>
      </div>

      {wished.length === 0 ? (
        <EmptyState
          title="No saved cars"
          description="Tap the heart on any car to save it here for later."
          icon={<Heart className="h-6 w-6" />}
          action={
            <Button asChild>
              <Link to="/buy">Browse inventory</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wished.map((l) => (
            <CarCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
