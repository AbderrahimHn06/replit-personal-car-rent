import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cars, CarType, Booking } from "@/data/mockData";

const ALL_TYPES: CarType[] = ["SUV", "Economy", "Compact", "Luxury", "Sedan", "City"];

const PRICE_RANGES = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under $35/day", min: 0, max: 35 },
  { label: "$35 – $55/day", min: 35, max: 55 },
  { label: "$55+/day", min: 55, max: Infinity },
];

export function Cars({ addBooking }: { addBooking: (b: Booking) => void }) {
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<CarType | "All">("All");
  const [activePriceIdx, setActivePriceIdx] = useState(0);

  const priceRange = PRICE_RANGES[activePriceIdx];

  const filtered = cars.filter((car) => {
    const typeMatch = activeType === "All" || car.type === activeType;
    const priceMatch = car.pricePerDay >= priceRange.min && car.pricePerDay < priceRange.max;
    return typeMatch && priceMatch;
  });

  const handleBook = (carName: string, pricePerDay: number) => {
    const today = new Date();
    const pickup = today.toISOString().split("T")[0];
    const ret = new Date(today.setDate(today.getDate() + 3)).toISOString().split("T")[0];
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName: "Guest",
      car: carName,
      pickupDate: pickup,
      returnDate: ret,
      pickupLocation: "To be confirmed",
      status: "Pending",
      totalPrice: pricePerDay * 3,
    };
    addBooking(newBooking);
    toast({
      title: "Booking Request Sent",
      description: `${carName} has been added to your reservations.`,
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Page header */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Browse Fleet</p>
          <h1 className="text-3xl font-bold text-white">Our Cars</h1>
          <p className="text-white/60 text-sm mt-1.5">
            {cars.length} vehicles available for rental
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        {(() => {
          const activeCount = (activeType !== "All" ? 1 : 0) + (activePriceIdx !== 0 ? 1 : 0);
          const hasActive = activeCount > 0;
          return (
            <div className="bg-white border border-border rounded-2xl shadow-sm p-5 sm:p-6 mb-7">
              {/* Header row */}
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-bold text-foreground">Filters</span>
                {hasActive && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold leading-none">
                    {activeCount}
                  </span>
                )}
                {hasActive && (
                  <button
                    className="ml-auto text-xs font-semibold text-primary hover:text-primary/70 transition-colors"
                    onClick={() => { setActiveType("All"); setActivePriceIdx(0); }}
                    data-testid="button-clear-filters"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Vehicle Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["All", ...ALL_TYPES] as const).map((type) => {
                    const isActive = activeType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setActiveType(type as CarType | "All")}
                        className={`h-10 px-4 rounded-full text-sm font-semibold border transition-all duration-150 ${
                          isActive
                            ? "bg-primary text-white border-transparent shadow-sm"
                            : "bg-white text-primary border-border hover:bg-primary/8 hover:border-primary/30"
                        }`}
                        data-testid={`filter-type-${type.toLowerCase()}`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border mb-5" />

              {/* Price Range */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range, idx) => {
                    const isActive = activePriceIdx === idx;
                    return (
                      <button
                        key={range.label}
                        onClick={() => setActivePriceIdx(idx)}
                        className={`h-10 px-4 rounded-full text-sm font-semibold border transition-all duration-150 ${
                          isActive
                            ? "bg-primary text-white border-transparent shadow-sm"
                            : "bg-white text-primary border-border hover:bg-primary/8 hover:border-primary/30"
                        }`}
                        data-testid={`filter-price-${idx}`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> vehicle{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-base font-medium mb-2">No vehicles match your filters</p>
            <button
              className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              onClick={() => { setActiveType("All"); setActivePriceIdx(0); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((car, idx) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                data-testid={`card-car-${car.id}`}
              >
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-xl h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full border border-border">
                      {car.type}
                    </span>
                    {!car.available && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-muted-foreground text-white text-xs font-semibold px-3 py-1 rounded-full">
                          On Trip
                        </span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-base mb-1">{car.name}</h3>
                      <p className="text-muted-foreground text-xs mb-4">
                        {car.seats} seats · {car.transmission}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-accent">${car.pricePerDay}</span>
                        <span className="text-xs text-muted-foreground"> / day</span>
                      </div>
                      <Button
                        className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-4 rounded-lg text-xs font-semibold"
                        onClick={() => handleBook(car.name, car.pricePerDay)}
                        disabled={!car.available}
                        data-testid={`button-book-${car.id}`}
                      >
                        {car.available ? "Book Now" : "Unavailable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
