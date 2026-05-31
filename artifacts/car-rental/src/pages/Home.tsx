import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Shield, Award, CheckCircle, Crown, ChevronDown } from "lucide-react";
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

  const handleSearch = () => {
    if (!pickupLocation || !pickupDate || !returnDate) {
      toast({
        title: "Missing details",
        description: "Please fill in pickup location and dates.",
        variant: "destructive",
      });
      return;
    }
    setHasSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleBookNow = (carName: string, pricePerDay: number) => {
    if (!pickupDate || !returnDate) {
      toast({ title: "Select dates first", description: "Please use the search form above to select your dates." });
      return;
    }
    const days = Math.max(
      1,
      Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000)
    );
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName: "Guest",
      car: carName,
      pickupDate,
      returnDate,
      pickupLocation,
      status: "Pending",
      totalPrice: pricePerDay * days,
    };
    addBooking(newBooking);
    toast({
      title: "Booking Request Sent",
      description: `${carName} reserved from ${pickupDate} to ${returnDate}. Our team will confirm shortly.`,
    });
  };

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000))
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[520px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-800 via-zinc-700 to-stone-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 text-center px-4 mb-10 mt-8">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary font-semibold tracking-[0.25em] uppercase text-sm mb-4"
          >
            Premium Car Rental
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            Arrive in <span className="text-primary">Elegance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-stone-300 text-lg max-w-xl mx-auto"
          >
            Curated luxury vehicles for discerning individuals.
          </motion.p>
        </div>

        {/* Horizontal Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 w-full max-w-5xl px-4 pb-10"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5">
            <div className="flex flex-col lg:flex-row gap-3 items-end">
              {/* Pickup Location */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="City, airport..."
                    className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm"
                    data-testid="input-pickup-location"
                  />
                </div>
              </div>

              {/* Return Location */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Return Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Same as pickup"
                    className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm"
                    data-testid="input-return-location"
                  />
                </div>
              </div>

              {/* Pickup Date + Time */}
              <div className="flex gap-2 flex-shrink-0">
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
                      className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm w-40"
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
                      className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm w-32"
                      data-testid="input-pickup-time"
                    />
                  </div>
                </div>
              </div>

              {/* Return Date + Time */}
              <div className="flex gap-2 flex-shrink-0">
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
                      className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm w-40"
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
                      className="pl-9 h-11 rounded-lg border-border bg-muted/40 text-sm w-32"
                      data-testid="input-return-time"
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 self-end">
                <Button
                  onClick={handleSearch}
                  className="h-11 px-7 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold text-sm whitespace-nowrap shadow-lg"
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
          </div>
        </motion.div>

        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center"
          >
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </motion.div>
        )}
      </section>

      {/* Available Cars Results */}
      <AnimatePresence>
        {hasSearched && (
          <motion.section
            ref={resultsRef}
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 bg-white"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Available Vehicles
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {availableCars.length} vehicles available · {pickupLocation} · {pickupDate} – {returnDate}
                  </p>
                </div>
                {days && (
                  <div className="hidden md:block text-right">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Rental period</span>
                    <p className="font-bold text-foreground">{days} day{days > 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCars.map((car, idx) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    data-testid={`card-car-${car.id}`}
                  >
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 group">
                      <div className={`h-44 w-full bg-gradient-to-br ${car.imageGradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 font-bold italic text-3xl uppercase tracking-widest transform -rotate-6 select-none">
                            {car.category}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                            {car.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-foreground text-base">{car.name}</h3>
                            <p className="text-muted-foreground text-xs mt-0.5">{car.seats} seats · {car.transmission}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-xl font-bold text-primary">${car.pricePerDay}</span>
                            <span className="text-xs text-muted-foreground block">/ day</span>
                          </div>
                        </div>

                        {days && (
                          <p className="text-xs text-muted-foreground mb-3 font-medium">
                            Total estimate: <span className="text-foreground font-bold">${car.pricePerDay * days}</span>
                          </p>
                        )}

                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg font-semibold text-sm"
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
      <section className={`py-20 ${hasSearched ? "bg-muted/40" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Choose EliteRide</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Unmatched Privacy", desc: "Discreet delivery and collection, ensuring your travels remain entirely confidential." },
              { icon: Award, title: "Impeccable Condition", desc: "Every vehicle undergoes rigorous inspection and detailing before each reservation." },
              { icon: CheckCircle, title: "Concierge Support", desc: "Dedicated 24/7 assistance for itinerary changes, recommendations, or immediate needs." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 uppercase tracking-wide">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-10 text-center">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "50+", label: "Luxury Vehicles" },
              { value: "24/7", label: "Concierge Service" },
              { value: "5★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <Crown className="h-7 w-7 text-primary mx-auto mb-5" />
          <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-3">EliteRide</h4>
          <p className="text-stone-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            The finest vehicles for those who demand excellence in every journey.
          </p>
          <div className="flex justify-center gap-6 text-sm text-stone-500">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
