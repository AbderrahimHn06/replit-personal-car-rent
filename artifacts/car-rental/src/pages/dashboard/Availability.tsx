import { useState, useMemo, useEffect } from "react";
import {
  Search, CalendarDays, Clock, MapPin, Car, ChevronLeft,
  ChevronRight, X, CheckCircle, AlertTriangle, Wrench, Info,
  CheckCircle2,
} from "lucide-react";
import { fleet, FleetCar, FleetStatus, DashboardRental } from "@/data/dashboardData";
import { useActiveLocations, addRental, useRentals } from "@/data/localStore";
import { RentalCreationModal } from "./RentalCreationModal";

/* ─── helpers ──────────────────────────────────────────────────── */
const STATUS_CFG: Record<FleetStatus, { label: string; dot: string; badge: string }> = {
  available:   { label: "Available",   dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  reserved:    { label: "Reserved",    dot: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700 border border-indigo-200"   },
  rented:      { label: "Rented",      dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border border-amber-200"     },
  maintenance: { label: "Maintenance", dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border border-red-200"           },
};
function StatusBadge({ s }: { s: FleetStatus }) {
  const { label, dot, badge } = STATUS_CFG[s];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isCarAvailable(car: FleetCar, pickupDate: string, returnDate: string, allRentals: DashboardRental[]): { available: boolean; reason?: string; conflict?: { client: string; from: string; to: string } } {
  if (car.status === "maintenance") return { available: false, reason: "In maintenance" };
  const overlap = allRentals.find(r => {
    if (r.plate !== car.plate && !r.car.includes(car.model)) return false;
    if (r.status === "completed") return false;
    return r.startDate <= returnDate && r.endDate >= pickupDate;
  });
  if (overlap) {
    return {
      available: false,
      reason: overlap.status === "reserved" ? "Already reserved" : "Currently rented",
      conflict: { client: overlap.client, from: overlap.startDate, to: overlap.endDate },
    };
  }
  return { available: true };
}

/* ─── Car Schedule Modal ───────────────────────────────────────── */
const RENTAL_COLORS = [
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-amber-100 text-amber-800 border-amber-300",
  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "bg-sky-100 text-sky-800 border-sky-300",
  "bg-violet-100 text-violet-800 border-violet-300",
];

function CarScheduleModal({ car, onClose, highlightFrom, highlightTo, allRentals }: {
  car: FleetCar; onClose: () => void; highlightFrom?: string; highlightTo?: string;
  allRentals: DashboardRental[];
}) {
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(5);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const carRentals  = allRentals.filter(r => r.plate === car.plate || r.car.includes(car.model));
  const monthName   = new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  function getDayInfo(day: number) {
    const d = new Date(year, month, day);
    const iso = d.toISOString().split("T")[0];
    const inHighlight = highlightFrom && highlightTo && iso >= highlightFrom && iso <= highlightTo;
    for (let i = 0; i < carRentals.length; i++) {
      const start = new Date(carRentals[i].startDate); start.setHours(0,0,0,0);
      const end   = new Date(carRentals[i].endDate);   end.setHours(23,59,59,999);
      if (d >= start && d <= end) return { rental: carRentals[i], colorIdx: i % RENTAL_COLORS.length, inHighlight };
    }
    return { rental: null, colorIdx: 0, inHighlight };
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src={car.image} alt={car.brand} className="w-12 h-9 object-cover rounded-xl" />
              <div>
                <h3 className="text-[16px] font-bold text-[#1a2332]">{car.brand} {car.model}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11.5px] text-slate-400 font-mono">{car.plate}</p>
                  <StatusBadge s={car.status} />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <p className="text-[14px] font-bold text-[#1a2332]">{monthName}</p>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
            {highlightFrom && highlightTo && (
              <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-violet-400" />
                <p className="text-[12px] text-slate-500">Your search period: <span className="font-semibold text-violet-600">{fmtShort(highlightFrom)} → {fmtShort(highlightTo)}</span> highlighted in violet</p>
              </div>
            )}
            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-7 mb-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className="text-center text-[10.5px] font-bold text-slate-400 uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const { rental, colorIdx, inHighlight } = getDayInfo(day);
                  const isToday = year === 2026 && month === 5 && day === 1;
                  return (
                    <div key={day} className={`min-h-[52px] rounded-xl p-1.5 border transition-colors ${
                      rental ? `${RENTAL_COLORS[colorIdx].split(" ").slice(0,2).join(" ")} border-current/20`
                        : inHighlight ? "bg-violet-50 border-violet-200" : "bg-emerald-50/60 border-emerald-100"
                    }`}>
                      <span className={`text-[11px] font-bold block ${isToday ? "w-5 h-5 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-[10px]" : rental ? "text-inherit" : inHighlight ? "text-violet-600" : "text-emerald-700"}`}>{day}</span>
                      {rental && <p className="text-[9px] font-semibold leading-tight mt-0.5 line-clamp-2 opacity-90">{rental.client.split(" ")[0]}</p>}
                      {!rental && inHighlight && <p className="text-[9px] font-semibold text-violet-500 mt-0.5">free</p>}
                    </div>
                  );
                })}
              </div>
              {carRentals.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Existing Bookings</p>
                  {carRentals.map((r, i) => (
                    <div key={r.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${RENTAL_COLORS[i % RENTAL_COLORS.length]}`}>
                      <div>
                        <p className="text-[12.5px] font-semibold">{r.client}</p>
                        <p className="text-[11px] opacity-75 font-medium">{fmtShort(r.startDate)} → {fmtShort(r.endDate)}</p>
                      </div>
                      <span className="text-[11px] font-bold opacity-80 capitalize">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {carRentals.length === 0 && (
                <div className="mt-5 text-center py-6 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-emerald-700">No bookings — fully available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Success Toast ────────────────────────────────────────────── */
function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
      <p className="text-[13.5px] font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  );
}

/* ─── Main Availability Section ────────────────────────────────── */
export function AvailabilitySection() {
  const [pickupDate,  setPickupDate]  = useState("2026-06-10");
  const [pickupTime,  setPickupTime]  = useState("09:00");
  const [returnDate,  setReturnDate]  = useState("2026-06-15");
  const [returnTime,  setReturnTime]  = useState("17:00");
  const [pickupLoc,   setPickupLoc]   = useState("");
  const [returnLoc,   setReturnLoc]   = useState("");
  const [searched,    setSearched]    = useState(false);
  const [scheduleFor, setScheduleFor] = useState<FleetCar | null>(null);
  const [bookingCar,  setBookingCar]  = useState<FleetCar | null>(null);
  const [toastMsg,    setToastMsg]    = useState<string | null>(null);

  const activeLocations = useActiveLocations();
  const allRentals = useRentals();

  function handleSearch() {
    if (!pickupDate || !returnDate || returnDate < pickupDate) return;
    setSearched(true);
  }

  const results = useMemo(() => {
    if (!searched) return [];
    return fleet.map(car => ({ car, ...isCarAvailable(car, pickupDate, returnDate, allRentals) }));
  }, [searched, pickupDate, returnDate, allRentals]);

  const available   = results.filter(r => r.available);
  const unavailable = results.filter(r => !r.available);

  const dayCount = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    return Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000));
  }, [pickupDate, returnDate]);

  const inp = "h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition w-full";
  const sel = "h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition w-full";

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-0">
        <div className="mb-6">
          <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">Availability</h2>
          <p className="text-[13px] text-slate-400 mt-1 font-medium">Check which vehicles are available for your selected dates and locations</p>
        </div>

        {/* Search form */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm px-6 py-5 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Search Availability</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> Pickup Date
              </label>
              <input type="date" className={inp} value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Pickup Time
              </label>
              <input type="time" className={inp} value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> Return Date
              </label>
              <input type="date" className={inp} value={returnDate} min={pickupDate} onChange={e => setReturnDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Return Time
              </label>
              <input type="time" className={inp} value={returnTime} onChange={e => setReturnTime(e.target.value)} />
            </div>
            <button
              onClick={handleSearch}
              disabled={!pickupDate || !returnDate || returnDate < pickupDate}
              className="h-10 px-6 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" /> Check Availability
            </button>
          </div>

          {/* Location dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Pickup Location
              </label>
              {activeLocations.length > 0 ? (
                <select className={sel} value={pickupLoc} onChange={e => setPickupLoc(e.target.value)}>
                  <option value="">— Select pickup location —</option>
                  {activeLocations.map(l => <option key={l.id} value={l.name}>{l.name}{l.address ? ` · ${l.address}` : ""}</option>)}
                </select>
              ) : (
                <div className="h-10 rounded-xl border border-slate-200 px-3.5 flex items-center text-[12px] text-slate-400 bg-slate-50">
                  No locations configured — add them in Settings
                </div>
              )}
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Return Location
              </label>
              {activeLocations.length > 0 ? (
                <select className={sel} value={returnLoc} onChange={e => setReturnLoc(e.target.value)}>
                  <option value="">— Select return location —</option>
                  {activeLocations.map(l => <option key={l.id} value={l.name}>{l.name}{l.address ? ` · ${l.address}` : ""}</option>)}
                </select>
              ) : (
                <div className="h-10 rounded-xl border border-slate-200 px-3.5 flex items-center text-[12px] text-slate-400 bg-slate-50">
                  No locations configured — add them in Settings
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result summary */}
        {searched && (
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span className="text-[12.5px] font-semibold text-slate-700">
                  {pickupDate && new Date(pickupDate).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}
                  {" → "}
                  {returnDate && new Date(returnDate).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}
                </span>
                <span className="text-[11.5px] text-slate-400">({dayCount} day{dayCount !== 1 ? "s" : ""})</span>
              </div>
              {(pickupLoc || returnLoc) && (
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {pickupLoc && <span>{pickupLoc}</span>}
                  {pickupLoc && returnLoc && <span className="text-slate-300">→</span>}
                  {returnLoc && <span>{returnLoc}</span>}
                </div>
              )}
              <button onClick={() => setSearched(false)} className="ml-auto text-[12px] text-slate-400 hover:text-slate-600 flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> Clear results
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Available",   value: available.length,                                     color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle  },
                { label: "Reserved",    value: results.filter(r=>r.conflict?.client && r.conflict).length, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: CalendarDays },
                { label: "Unavailable", value: unavailable.length,                                   color: "text-red-600",     bg: "bg-red-50",     border: "border-red-100",     icon: AlertTriangle },
                { label: "Maintenance", value: fleet.filter(c => c.status === "maintenance").length,  color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-100",  icon: Wrench        },
              ].map(({ label, value, color, bg, border, icon: Icon }) => (
                <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />
                  <div>
                    <p className={`text-[20px] font-bold ${color} leading-none`}>{value}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="px-6 sm:px-8 pb-8 space-y-6">

          {/* Available */}
          {available.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                <h3 className="text-[14px] font-bold text-[#1a2332]">Available Cars</h3>
                <span className="text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{available.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {available.map(({ car }) => (
                  <div key={car.id} className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500 text-white">
                          <CheckCircle className="h-3 w-3" /> Free
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-3">
                        <p className="text-white text-[13px] font-bold drop-shadow">{car.brand} {car.model}</p>
                        <p className="text-white/75 text-[10.5px] font-mono">{car.plate}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[11.5px] text-slate-500 flex-wrap">
                          <span>{car.transmission}</span><span className="text-slate-200">·</span>
                          <span>{car.fuel}</span><span className="text-slate-200">·</span>
                          <span>{car.seats} seats</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-[16px] font-bold text-[#1a2332]">${car.pricePerDay}</p>
                          <p className="text-[10px] text-slate-400">/day</p>
                        </div>
                      </div>
                      {dayCount > 0 && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3 flex items-center justify-between">
                          <span className="text-[11.5px] text-emerald-700 font-medium">{dayCount} days total</span>
                          <span className="text-[13px] font-bold text-emerald-700">${car.pricePerDay * dayCount}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setScheduleFor(car)}
                          className="flex-1 h-9 bg-slate-100 text-slate-700 rounded-xl text-[12px] font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CalendarDays className="h-3.5 w-3.5" /> Schedule
                        </button>
                        <button
                          onClick={() => setBookingCar(car)}
                          className="flex-1 h-9 bg-[#1a2332] text-white rounded-xl text-[12px] font-semibold hover:bg-[#243044] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Car className="h-3.5 w-3.5" /> Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unavailable */}
          {unavailable.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-slate-400" />
                <h3 className="text-[14px] font-bold text-slate-500">Unavailable</h3>
                <span className="text-[11.5px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">{unavailable.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {unavailable.map(({ car, reason, conflict }) => (
                  <div key={car.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden opacity-75">
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover grayscale-[40%]" loading="lazy" />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute top-2.5 right-2.5"><StatusBadge s={car.status} /></div>
                      <div className="absolute bottom-2.5 left-3">
                        <p className="text-white text-[13px] font-bold">{car.brand} {car.model}</p>
                        <p className="text-white/75 text-[10.5px] font-mono">{car.plate}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-3">
                        <p className="text-[11.5px] font-bold text-red-600">{reason}</p>
                        {conflict && <p className="text-[11px] text-red-500 mt-0.5">{conflict.client} · {fmtShort(conflict.from)} → {fmtShort(conflict.to)}</p>}
                        {car.status === "maintenance" && <p className="text-[11px] text-red-500 mt-0.5">Est. ready after service</p>}
                      </div>
                      <button onClick={() => setScheduleFor(car)} className="w-full h-9 bg-slate-100 text-slate-600 rounded-xl text-[12px] font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" /> View Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {available.length === 0 && unavailable.length === 0 && (
            <div className="text-center py-16">
              <Car className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-400">No vehicles found</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!searched && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-slate-600 mb-1.5">Check vehicle availability</p>
          <p className="text-[13px] text-slate-400 max-w-sm">Select pickup and return dates above, then click "Check Availability" to see which cars are free.</p>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleFor && (
        <CarScheduleModal
          car={scheduleFor}
          onClose={() => setScheduleFor(null)}
          highlightFrom={pickupDate}
          highlightTo={returnDate}
          allRentals={allRentals}
        />
      )}

      {/* Create Rental Modal — shared component */}
      {bookingCar && (
        <RentalCreationModal
          prefilledCar={bookingCar}
          prefilledPickupDate={pickupDate}
          prefilledPickupTime={pickupTime}
          prefilledReturnDate={returnDate}
          prefilledReturnTime={returnTime}
          prefilledPickupLoc={pickupLoc}
          prefilledReturnLoc={returnLoc}
          onClose={() => setBookingCar(null)}
          onCreated={rental => {
            addRental(rental);
            setBookingCar(null);
            setToastMsg(`Rental created for ${bookingCar.brand} ${bookingCar.model} — ${dayCount} days`);
          }}
        />
      )}

      {/* Toast */}
      {toastMsg && <SuccessToast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
