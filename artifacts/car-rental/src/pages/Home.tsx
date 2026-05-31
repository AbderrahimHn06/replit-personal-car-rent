import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Shield, Award, CheckCircle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cars, Booking } from "@/data/mockData";

export function Home({ addBooking }: { addBooking: (b: Booking) => void }) {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [pickupLocation, setPickupLocation] = useState("Oran - USTO");
  const [returnLocation, setReturnLocation] = useState("Oran - USTO");
  const [pickupDate, setPickupDate] = useState("2026-06-01");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("2026-06-09");
  const [returnTime, setReturnTime] = useState("11:00");
  const [hasSearched, setHasSearched] = useState(false);

  const availableCars = cars.filter((c) => c.available);

  const days =
    pickupDate && returnDate
      ? Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000))
      : null;

  const handleSearch = () => {
    if (!pickupLocation || !pickupDate || !returnDate) {
      toast({ title: "Missing details", description: "Please fill in pickup location and dates.", variant: "destructive" });
      return;
    }
    setHasSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleBookNow = (carName: string, pricePerDay: number) => {
    const rental = days ?? 1;
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName: "Guest",
      car: carName,
      pickupDate,
      returnDate,
      pickupLocation,
      status: "Pending",
      totalPrice: pricePerDay * rental,
    };
    addBooking(newBooking);
    toast({
      title: "Booking Request Sent",
      description: `${carName} reserved from ${pickupDate} to ${returnDate}. Our team will confirm shortly.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-primary pt-12 pb-0">
        <div className="container mx-auto px-4 text-center pb-10">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-accent font-semibold tracking-[0.2em] uppercase text-xs mb-3"
          >
            Premium Car Rental
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3"
          >
            Find Your Perfect Ride
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 text-sm sm:text-base max-w-lg mx-auto"
          >
            Wide selection of vehicles for every need and budget.
          </motion.p>
        </div>

        {/* Search Form */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-border p-4 sm:p-5 translate-y-8"
          >
            {/* Row 1: locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="City, airport..."
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm"
                    data-testid="input-pickup-location"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Return Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Same as pickup"
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm"
                    data-testid="input-return-location"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: dates + times + button */}
            <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end">
              {/* Pickup date */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm w-full"
                    data-testid="input-pickup-date"
                  />
                </div>
              </div>

              {/* Pickup time */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Pickup Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm w-full"
                    data-testid="input-pickup-time"
                  />
                </div>
              </div>

              {/* Return date */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm w-full"
                    data-testid="input-return-date"
                  />
                </div>
              </div>

              {/* Return time */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Return Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="pl-9 h-11 rounded-lg bg-white border-border focus-visible:ring-accent text-sm w-full"
                    data-testid="input-return-time"
                  />
                </div>
              </div>

              {/* CTA — full width on mobile (spans 2 cols), auto on lg */}
              <div className="col-span-2 lg:col-span-1">
                <Button
                  onClick={handleSearch}
                  className="w-full h-11 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold text-sm shadow-sm"
                  data-testid="button-see-vehicles"
                >
                  See vehicles
                </Button>
              </div>
            </div>

            {days && (
              <p className="text-xs text-muted-foreground mt-3 pl-1">
                {days} day{days > 1 ? "s" : ""} rental period
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Spacer for translate-y overlap */}
      <div className="h-12 bg-background" />

      {/* Available Cars */}
      <AnimatePresence>
        {hasSearched && (
          <motion.section
            ref={resultsRef}
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-10 bg-background"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Available Vehicles</h2>
                  <p className="text-muted-foreground text-sm mt-0.5 leading-snug">
                    {availableCars.length} vehicles · {pickupLocation}
                    <span className="hidden sm:inline"> · {pickupDate} – {returnDate}</span>
                  </p>
                </div>
                {days && (
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Rental period</span>
                    <p className="font-bold text-foreground text-sm">{days} day{days > 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {availableCars.map((car, idx) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    data-testid={`card-car-${car.id}`}
                  >
                    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-xl">
                      <div className="relative h-40 overflow-hidden bg-muted">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-white/90 text-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full border border-border">
                          {car.type}
                        </span>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground text-sm mb-1">{car.name}</h3>
                        <p className="text-muted-foreground text-xs mb-3">
                          {car.seats} seats · {car.transmission}
                        </p>
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <span className="text-xl font-bold text-accent">${car.pricePerDay}</span>
                            <span className="text-xs text-muted-foreground"> / day</span>
                          </div>
                          {days && (
                            <span className="text-xs text-muted-foreground">
                              Total: <span className="font-semibold text-foreground">${car.pricePerDay * days}</span>
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-9 rounded-lg font-semibold text-xs"
                          onClick={() => handleBookNow(car.name, car.pricePerDay)}
                          data-testid={`button-book-${car.id}`}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Why Choose EliteRide</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Guaranteed Privacy", desc: "Discreet delivery and collection, ensuring your travels remain entirely confidential." },
              { icon: Award, title: "Certified Fleet", desc: "Every vehicle undergoes rigorous inspection and detailing before each reservation." },
              { icon: CheckCircle, title: "24/7 Support", desc: "Dedicated assistance for itinerary changes, recommendations, or immediate needs." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "50+", label: "Vehicles" },
              { value: "24/7", label: "Support" },
              { value: "5★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-accent">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Car className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">EliteRide</span>
          </div>
          <p className="text-white/60 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            The finest vehicles for those who demand excellence in every journey.
          </p>
          <div className="flex justify-center gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
