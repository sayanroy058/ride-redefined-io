import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { CompareTable } from "@/components/site/CompareTable";
import { EmptyState } from "@/components/site/States";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});

function ComparePage() {
  const { listings, compare } = useApp();
  const cars = listings.filter((l) => compare.includes(l.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Compare cars</h1>
        <p className="text-sm text-muted-foreground">
          Side-by-side specs for up to 3 cars. Best value in each row is highlighted.
        </p>
      </div>

      {cars.length === 0 ? (
        <EmptyState
          title="Nothing to compare yet"
          description="Add cars to your compare list using the scale icon on any listing."
          icon={<Scale className="h-6 w-6" />}
          action={
            <Button asChild>
              <Link to="/buy">Browse inventory</Link>
            </Button>
          }
        />
      ) : cars.length < 2 ? (
        <>
          <CompareTable listings={cars} />
          <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-muted-foreground">
            Add at least one more car to see a full comparison.
          </div>
        </>
      ) : (
        <CompareTable listings={cars} />
      )}
    </div>
  );
}
