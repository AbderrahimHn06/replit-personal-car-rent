import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle, Shield, Award, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cars, Booking, Car } from "@/data/mockData";

export function Home({ addBooking }: { addBooking: (b: Booking) => void }) {
  const { toast } = useToast();
  
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !pickupDate || !returnDate || !selectedCar || !fullName || !phone) {
      toast({
        title: "Incomplete Booking",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const carDetails = cars.find(c => c.id === selectedCar);
    const mockPrice = carDetails ? carDetails.pricePerDay * 3 : 1500; // simple mock calculation

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName: fullName,
      car: carDetails ? carDetails.name : selectedCar,
      pickupDate,
      returnDate,
      pickupLocation,
      status: "Pending",
      totalPrice: mockPrice,
    };

    addBooking(newBooking);
    
    toast({
      title: "Booking Submitted",
      description: "Your luxury vehicle request has been received. Our concierge will contact you shortly.",
    });

    // Reset form
    setPickupLocation("");
    setDropoffLocation("");
    setPickupDate("");
    setReturnDate("");
    setSelectedCar("");
    setFullName("");
    setPhone("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay z-0" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Arrive in <span className="text-primary">Elegance</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10"
          >
            Curated luxury vehicles for discerning individuals. Experience uncompromised comfort and performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none uppercase tracking-widest font-semibold" onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Reserve Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider text-white">The Collection</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, idx) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Card className="bg-card border-card-border overflow-hidden rounded-none group hover:border-primary/50 transition-colors">
                  <div className={`h-48 w-full bg-gradient-to-br ${car.imageGradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                    <span className="text-white/30 font-serif italic text-4xl uppercase tracking-widest transform -rotate-12 select-none pointer-events-none">
                      {car.category}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
                        <p className="text-muted-foreground text-sm uppercase tracking-wider">{car.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">${car.pricePerDay}</span>
                        <span className="text-xs text-muted-foreground block">/ DAY</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 border-t border-border pt-4">
                      <span>{car.seats} Seats</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                      <span className="ml-auto flex items-center text-xs">
                        {car.available ? (
                          <><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Available</>
                        ) : (
                          <><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Reserved</>
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-section" className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-card border-primary/20 rounded-none shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider text-white">Make a Reservation</h2>
                <p className="text-muted-foreground">Submit your request and our concierge will confirm your luxury vehicle.</p>
              </div>
              
              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="text-zinc-400">Pickup Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="pickup" 
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Airport, Hotel, Address" 
                        className="pl-10 bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoff" className="text-zinc-400">Dropoff Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="dropoff" 
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        placeholder="Same as pickup" 
                        className="pl-10 bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate" className="text-zinc-400">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="pickupDate" 
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="pl-10 bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary css-calendar-icon-dark" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate" className="text-zinc-400">Return Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="returnDate" 
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="pl-10 bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary css-calendar-icon-dark" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Vehicle Selection</Label>
                    <Select value={selectedCar} onValueChange={setSelectedCar}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus:ring-primary">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-none">
                        {cars.map((car) => (
                          <SelectItem key={car.id} value={car.id} className="focus:bg-primary/20">
                            {car.name} - ${car.pricePerDay}/day
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-zinc-400">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe" 
                      className="bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" 
                      className="bg-zinc-900 border-zinc-800 rounded-none h-12 text-white focus-visible:ring-primary" 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg rounded-none uppercase tracking-widest font-semibold mt-8">
                  Request Booking
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Unmatched Privacy</h3>
              <p className="text-zinc-400">Discreet delivery and collection, ensuring your travels remain entirely confidential.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Impeccable Condition</h3>
              <p className="text-zinc-400">Every vehicle undergoes rigorous inspection and detailing before each reservation.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Concierge Support</h3>
              <p className="text-zinc-400">Dedicated 24/7 assistance for itinerary changes, recommendations, or immediate needs.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <Crown className="h-8 w-8 text-primary mx-auto mb-6" />
          <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-4">EliteRide</h4>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            The world's finest vehicles for those who demand excellence in every journey.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-zinc-600">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
