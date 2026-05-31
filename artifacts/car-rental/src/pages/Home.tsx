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
    addBooking({
      id: `bk-${Date.now()}`,
      clientName: "Guest",
      car: carName,
      pickupDate,
      returnDate,
      pickupLocation,
      status: "Pending",
      totalPrice: pricePerDay * rental,
    });
    toast({
      title: "Booking Request Sent",
      description: `${carName} reserved from ${pickupDate} to ${returnDate}. Our team will confirm shortly.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Hero + Search ── */}
      <section className="bg-primary">
        {/* Headline */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-accent font-semibold tracking-widest uppercase text-xs mb-3"
          >
            Premium Car Rental
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-3"
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

        {/* Search form card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-t-xl shadow-lg border border-b-0 border-border p-4 sm:p-6"
          >
            {/* Form fields
                Mobile  : flex-col  — all inputs + button full-width, stacked
                Tablet  : 2-col grid — locations row 1, dates row 2, button row 3
                Desktop : single flex row aligned at bottom
            */}
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:items-end lg:gap-3">

              {/* Pickup location */}
              <div className="lg:flex-1">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="City, airport..."
                    className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                    data-testid="input-pickup-location"
                  />
                </div>
              </div>

              {/* Return location */}
              <div className="lg:flex-1">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Return Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Same as pickup"
                    className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                    data-testid="input-return-location"
                  />
                </div>
              </div>

              {/* Pickup date + time */}
              <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-2 lg:flex-shrink-0">
                <div className="lg:flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                      data-testid="input-pickup-date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                      data-testid="input-pickup-time"
                    />
                  </div>
                </div>
              </div>

              {/* Return date + time */}
              <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-2 lg:flex-shrink-0">
                <div className="lg:flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                      data-testid="input-return-date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="pl-9 h-11 w-full rounded-lg border-border bg-white focus-visible:ring-accent text-sm"
                      data-testid="input-return-time"
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="sm:col-span-2 lg:flex-shrink-0 lg:self-end">
                <Button
                  onClick={handleSearch}
                  className="w-full lg:w-auto h-11 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold text-sm"
                  data-testid="button-see-vehicles"
                >
                  See vehicles
                </Button>
              </div>
            </div>

            {days && (
              <p className="text-xs text-muted-foreground mt-3">
                {days} day{days > 1 ? "s" : ""} rental period
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Available Cars ── */}
      <AnimatePresence>
        {hasSearched && (
          <motion.section
            ref={resultsRef}
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-8 sm:py-12 lg:py-16 bg-background border-t border-border"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start justify-between mb-6 sm:mb-8 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Available Vehicles</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {availableCars.length} vehicles · {pickupLocation} · {pickupDate} – {returnDate}
                  </p>
                </div>
                {days && (
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Rental period</span>
                    <p className="font-bold text-foreground text-sm">{days} day{days > 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {availableCars.map((car, idx) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    data-testid={`card-car-${car.id}`}
                  >
                    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-xl h-full flex flex-col">
                      <div className="relative overflow-hidden bg-muted">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-[200px] object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full border border-border">
                          {car.type}
                        </span>
                      </div>
                      <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">{car.name}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                          {car.seats} seats · {car.transmission}
                        </p>
                        <div className="flex items-end justify-between mb-4 mt-auto">
                          <div>
                            <span className="text-xl font-bold text-accent">${car.pricePerDay}</span>
                            <span className="text-xs text-muted-foreground"> / day</span>
                          </div>
                          {days && (
                            <span className="text-xs text-muted-foreground text-right">
                              Total:<br />
                              <span className="font-semibold text-foreground">${car.pricePerDay * days}</span>
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-9 rounded-lg font-semibold text-sm"
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

      {/* ── Why Choose Us ── */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Why Choose EliteRide
            </h2>
            <div className="w-12 h-0.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
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
                className="bg-card border border-border rounded-xl p-5 sm:p-6 text-center shadow-sm"
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

      {/* ── Trust Badges ── */}
      <section className="py-8 sm:py-10 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "50+", label: "Vehicles" },
              { value: "24/7", label: "Support" },
              { value: "5★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl sm:text-2xl font-bold text-accent">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
