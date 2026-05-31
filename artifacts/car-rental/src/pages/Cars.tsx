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
        <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
            {(activeType !== "All" || activePriceIdx !== 0) && (
              <button
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setActiveType("All"); setActivePriceIdx(0); }}
                data-testid="button-clear-filters"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            {/* Type filter */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Vehicle Type
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveType("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    activeType === "All"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                  data-testid="filter-type-all"
                >
                  All
                </button>
                {ALL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      activeType === type
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                    data-testid={`filter-type-${type.toLowerCase()}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div className="sm:w-56 flex-shrink-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Price Range
              </p>
              <div className="flex flex-col gap-1.5">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => setActivePriceIdx(idx)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      activePriceIdx === idx
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-white text-muted-foreground border-border hover:border-accent hover:text-foreground"
                    }`}
                    data-testid={`filter-price-${idx}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
