import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, Check, CheckCircle2, ArrowRight,
  MapPin, Calendar,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export interface Car {
  id: string;
  name: string;
  type: string;
  pricePerDay: number;
  seats: number;
  transmission: "Manual" | "Automatic";
  available: boolean;
  image: string;
}

export interface Booking {
  id: string;
  clientName: string;
  phone?: string;
  email?: string;
  car: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  totalPrice: number;
  notes?: string;
}

// ── helpers ────────────────────────────────────────────────────────────────
function getFuel(type: string) {
  if (type === "SUV") return "Diesel";
  if (type === "Luxury") return "Premium";
  return "Gasoline";
}
function getLuggage(type: string) {
  if (type === "SUV" || type === "Luxury") return "3 bags";
  if (type === "City" || type === "Economy") return "1 bag";
  return "2 bags";
}
function calcDays(from: string, to: string) {
  if (!from || !to) return 3;
  return Math.max(1, Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));
}

// ── types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  flightNumber: string;
  notes: string;
  driverAge: string;
  licenseNumber: string;
  nationality: string;
  emergencyName: string;
  emergencyPhone: string;
  termsAccepted: boolean;
  infoConfirmed: boolean;
}

const BLANK_FORM: FormState = {
  fullName: "", phone: "", email: "",
  whatsapp: "", flightNumber: "", notes: "",
  driverAge: "", licenseNumber: "", nationality: "",
  emergencyName: "", emergencyPhone: "",
  termsAccepted: false, infoConfirmed: false,
};

const FEATURES = [
  "Unlimited mileage",
  "Basic insurance",
  "Road assistance",
  "Air conditioning",
  "Free cancellation",
];

// ── step variants ────────────────────────────────────────────────────────────
const slide = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
};
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ── component ────────────────────────────────────────────────────────────────
export interface BookingModalProps {
  car: Car;
  onClose: () => void;
  addBooking: (b: Booking) => void;
  pickupLocation?: string;
  returnLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
}

export function BookingModal({
  car, onClose, addBooking,
  pickupLocation = "To be confirmed",
  returnLocation = "To be confirmed",
  pickupDate = "", pickupTime = "10:00",
  returnDate = "", returnTime = "10:00",
}: BookingModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [bookingRef, setBookingRef] = useState("");
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [form, setForm] = useState<FormState>(BLANK_FORM);

  const days = calcDays(pickupDate, returnDate);
  const total = car.pricePerDay * days;
  const fuel = getFuel(car.type);
  const luggage = getLuggage(car.type);

  const isValid =
    form.fullName.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.email.trim() !== "" &&
    form.driverAge.trim() !== "" &&
    form.licenseNumber.trim() !== "" &&
    form.termsAccepted &&
    form.infoConfirmed;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleConfirm = () => {
    const ref = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);
    addBooking({
      id: `bk-${Date.now()}`,
      clientName: form.fullName,
      phone: form.phone,
      email: form.email,
      car: car.name,
      pickupDate: pickupDate || new Date().toISOString().split("T")[0],
      returnDate: returnDate || new Date(Date.now() + 3 * 86_400_000).toISOString().split("T")[0],
      pickupLocation,
      status: "Pending",
      totalPrice: total,
      notes: form.notes,
    });
    setStep(3);
  };

  const specs = [
    { label: "Daily Rate", value: `$${car.pricePerDay}` },
    { label: "Category", value: car.type },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: fuel },
    { label: "Seats", value: `${car.seats} passengers` },
    { label: "Air Conditioning", value: "Included" },
    { label: "Luggage", value: luggage },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={step !== 3 ? onClose : undefined}
      />

      {/* Modal shell */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-5xl sm:max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Details ──────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18 }} className="flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="font-bold text-foreground text-base sm:text-lg leading-tight">{car.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{car.type} · ${car.pricePerDay}/day</p>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground ml-3"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-5 sm:p-6">

                  {/* Left: images */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedThumb(i)}
                          className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                            selectedThumb === i ? "border-primary opacity-100" : "border-border opacity-60 hover:opacity-90"
                          }`}
                        >
                          <img src={car.image} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: info */}
                  <div className="lg:col-span-3 flex flex-col gap-5">

                    {/* Specs grid */}
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Vehicle Information</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {specs.map(({ label, value }) => (
                          <div key={label} className="bg-muted/50 border border-border rounded-xl p-2.5 sm:p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5 leading-tight">{label}</p>
                            <p className="text-sm font-bold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Included features */}
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Included Features</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {FEATURES.map((f) => (
                          <div key={f} className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                            <span className="text-sm text-foreground">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rental summary */}
                    <div className="bg-primary/6 border border-primary/18 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">Rental Summary</p>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground">Pickup</span>
                            <p className="text-sm font-semibold text-foreground truncate">{pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground">Return</span>
                            <p className="text-sm font-semibold text-foreground truncate">{returnLocation}</p>
                          </div>
                        </div>
                        {pickupDate && (
                          <div className="flex items-center gap-2.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm text-foreground">
                              {pickupDate}
                              {pickupTime && <span className="text-muted-foreground"> at {pickupTime}</span>}
                            </p>
                          </div>
                        )}
                        {returnDate && (
                          <div className="flex items-center gap-2.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm text-foreground">
                              {returnDate}
                              {returnTime && <span className="text-muted-foreground"> at {returnTime}</span>}
                            </p>
                          </div>
                        )}
                        <div className="pt-2.5 mt-0.5 border-t border-primary/15 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{days} day{days !== 1 ? "s" : ""} × ${car.pricePerDay}/day</span>
                          <div>
                            <span className="text-xl font-bold text-accent">${total}</span>
                            <span className="text-xs text-muted-foreground ml-1">est.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-t border-border bg-white flex-shrink-0">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Estimated total</p>
                  <p className="text-xl font-bold text-accent">${total}</p>
                </div>
                <Button onClick={() => setStep(2)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-6 rounded-xl font-semibold"
                >
                  Continue Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Booking Form ─────────────────────────────── */}
          {step === 2 && (
            <motion.div key="s2" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18 }} className="flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-border flex-shrink-0">
                <button onClick={() => setStep(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-foreground text-base sm:text-lg">Booking Details</h2>
                  <p className="text-xs text-muted-foreground">Complete your reservation</p>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                <div className="p-5 sm:p-6 max-w-2xl mx-auto space-y-7">

                  {/* Booking summary */}
                  <div className="flex items-center gap-4 bg-primary/6 border border-primary/18 rounded-xl p-4">
                    <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{car.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {days} day{days !== 1 ? "s" : ""} · {pickupDate || "TBD"} → {returnDate || "TBD"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-accent text-lg">${total}</p>
                      <p className="text-[11px] text-muted-foreground">est. total</p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <section>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Customer Information
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Full Name" required>
                          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                            placeholder="John Doe" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                        <FormField label="Phone Number" required>
                          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                            placeholder="+213 XXX XXX XXX" type="tel" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Email Address" required>
                          <Input value={form.email} onChange={(e) => set("email", e.target.value)}
                            placeholder="john@example.com" type="email" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                        <FormField label="WhatsApp Number">
                          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
                            placeholder="Same as phone" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Flight Number">
                          <Input value={form.flightNumber} onChange={(e) => set("flightNumber", e.target.value)}
                            placeholder="Optional" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                      </div>
                      <FormField label="Notes / Special Requests">
                        <textarea
                          value={form.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          placeholder="Any specific requirements..."
                          rows={3}
                          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm resize-none bg-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                        />
                      </FormField>
                    </div>
                  </section>

                  {/* Driver Information */}
                  <section>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Driver Information
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Driver Age" required>
                          <Input value={form.driverAge} onChange={(e) => set("driverAge", e.target.value)}
                            placeholder="e.g. 28" type="number" min="18" max="80"
                            className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                        <FormField label="License Number" required>
                          <Input value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)}
                            placeholder="DL-XXXXXXXXX" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Nationality">
                          <Input value={form.nationality} onChange={(e) => set("nationality", e.target.value)}
                            placeholder="Optional" className="h-10 rounded-lg text-sm border-border" />
                        </FormField>
                      </div>
                    </div>
                  </section>

                  {/* Emergency Contact */}
                  <section>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Emergency Contact
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">Optional</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField label="Contact Name">
                        <Input value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)}
                          placeholder="Full name" className="h-10 rounded-lg text-sm border-border" />
                      </FormField>
                      <FormField label="Contact Phone">
                        <Input value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)}
                          placeholder="Phone number" type="tel" className="h-10 rounded-lg text-sm border-border" />
                      </FormField>
                    </div>
                  </section>

                  {/* Terms */}
                  <section>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Terms & Confirmation
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.termsAccepted}
                          onChange={(e) => set("termsAccepted", e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer flex-shrink-0"
                        />
                        <span className="text-sm text-foreground leading-relaxed">
                          I agree to the rental terms and conditions, including the cancellation policy and insurance coverage.
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.infoConfirmed}
                          onChange={(e) => set("infoConfirmed", e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer flex-shrink-0"
                        />
                        <span className="text-sm text-foreground leading-relaxed">
                          I confirm that all information provided is accurate and complete.
                        </span>
                      </label>
                    </div>
                  </section>

                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-t border-border bg-white flex-shrink-0">
                <Button variant="outline" onClick={() => setStep(1)}
                  className="h-11 px-5 rounded-xl border-border font-medium"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={!isValid}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-6 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Reservation
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Success ──────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="s3" variants={fade} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3 }} className="flex flex-col h-full overflow-hidden"
            >
              <div className="overflow-y-auto flex-1">
                <div className="flex flex-col items-center text-center px-8 py-10 sm:py-14 max-w-lg mx-auto">

                  {/* Animated check */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.1, type: "spring", stiffness: 190 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      Reservation Request Sent
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                      Your reservation request has been received. Our team will contact you shortly to confirm availability and finalize your booking.
                    </p>
                  </motion.div>

                  {/* Booking reference card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-left space-y-3 mb-8"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                        Booking Reference
                      </span>
                      <span className="font-bold text-primary text-base tracking-wide">{bookingRef}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt={car.name} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{car.name}</p>
                        <p className="text-xs text-muted-foreground">{car.type}</p>
                      </div>
                    </div>
                    {(pickupDate || returnDate) && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span>{pickupDate} → {returnDate}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">Estimated Total</span>
                      <span className="font-bold text-accent text-xl">${total}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="flex flex-col sm:flex-row gap-3 w-full"
                  >
                    <Link href="/cars" onClick={onClose} className="flex-1">
                      <Button variant="outline" className="w-full h-11 rounded-xl border-border font-medium">
                        Browse More Cars
                      </Button>
                    </Link>
                    <Link href="/" onClick={onClose} className="flex-1">
                      <Button className="w-full h-11 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold">
                        Back to Home
                      </Button>
                    </Link>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── helper sub-component ─────────────────────────────────────────────────────
function FormField({
  label, required = false, children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold text-foreground mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
