import { useState, useEffect, useMemo } from "react";
import {
  X, LayoutGrid, List, Search, SlidersHorizontal, Plus,
  Car, CheckCircle, Clock, Wrench, CalendarDays, ChevronLeft,
  ChevronRight, Edit2, Printer, AlertTriangle, FileText, Shield,
  ClipboardList, Upload, Phone,
} from "lucide-react";
import {
  fleet, FleetCar, FleetStatus,
  rentals, maintenance,
} from "@/data/dashboardData";

/* ─── helpers ─────────────────────────────────────────────────── */
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
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ─── KPI data ─────────────────────────────────────────────────── */
const KPI_LIST = [
  { label: "Total Vehicles", value: fleet.length,                                          sub: "in your fleet",        color: "text-slate-700",   bg: "bg-slate-100",  icon: Car          },
  { label: "Available",      value: fleet.filter(c => c.status === "available").length,    sub: "ready to rent",        color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle  },
  { label: "Reserved",       value: fleet.filter(c => c.status === "reserved").length,     sub: "upcoming pickups",     color: "text-indigo-600",  bg: "bg-indigo-50",  icon: CalendarDays },
  { label: "Rented",         value: fleet.filter(c => c.status === "rented").length,       sub: "currently on the road",color: "text-amber-600",   bg: "bg-amber-50",   icon: Car          },
  { label: "Maintenance",    value: fleet.filter(c => c.status === "maintenance").length,  sub: "in service",           color: "text-red-600",     bg: "bg-red-50",     icon: Wrench       },
  { label: "Returning Today",value: 1,                                                     sub: "expected returns",     color: "text-violet-600",  bg: "bg-violet-50",  icon: Clock        },
];

/* ─── Schedule calendar ─────────────────────────────────────────── */
const RENTAL_COLORS = [
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-amber-100 text-amber-800 border-amber-300",
  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "bg-sky-100 text-sky-800 border-sky-300",
  "bg-violet-100 text-violet-800 border-violet-300",
];

function ScheduleModal({ car, onClose }: { car: FleetCar; onClose: () => void }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // 0-indexed, 5 = June

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const carRentals = rentals.filter(r => r.plate === car.plate || r.car.includes(car.model));

  const monthName = new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-first

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  function getDayStatus(day: number) {
    const d = new Date(year, month, day);
    for (let i = 0; i < carRentals.length; i++) {
      const start = new Date(carRentals[i].startDate);
      const end   = new Date(carRentals[i].endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      if (d >= start && d <= end) return { rental: carRentals[i], colorIdx: i % RENTAL_COLORS.length };
    }
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a2332]">{car.brand} {car.model}</h3>
              <p className="text-[12px] text-slate-400 font-mono mt-0.5">{car.plate}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-[14px] font-bold text-[#1a2332]">{monthName}</p>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-100 flex-wrap">
              {[
                { label: "Available",  color: "bg-emerald-100 border-emerald-300" },
                { label: "Booked",     color: "bg-indigo-100 border-indigo-300" },
                { label: "Returning",  color: "bg-violet-100 border-violet-300" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium">
                  <span className={`w-3 h-3 rounded border ${color}`} />
                  {label}
                </span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="px-6 pb-6 pt-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="text-center text-[10.5px] font-bold text-slate-400 uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day  = i + 1;
                  const info = getDayStatus(day);
                  const isToday = year === 2026 && month === 5 && day === 1;
                  return (
                    <div key={day} className={`relative min-h-[52px] rounded-xl p-1.5 border transition-colors ${
                      info
                        ? `${RENTAL_COLORS[info.colorIdx].split(" ").slice(0, 2).join(" ")} border-current/20`
                        : "bg-emerald-50/60 border-emerald-100 hover:bg-emerald-100/60"
                    }`}>
                      <span className={`text-[11px] font-bold ${isToday ? "w-5 h-5 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-[10px]" : info ? "text-inherit" : "text-emerald-700"}`}>
                        {day}
                      </span>
                      {info && (
                        <p className="text-[9px] font-semibold leading-tight mt-0.5 line-clamp-2 opacity-90">
                          {info.rental.client.split(" ")[0]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Booking list */}
              {carRentals.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Bookings This Period</p>
                  {carRentals.map((r, i) => (
                    <div key={r.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${RENTAL_COLORS[i % RENTAL_COLORS.length]}`}>
                      <div>
                        <p className="text-[12.5px] font-semibold">{r.client}</p>
                        <p className="text-[11px] opacity-75 font-medium">{fmtShort(r.startDate)} → {fmtShort(r.endDate)}</p>
                      </div>
                      <span className="text-[11px] font-bold opacity-80 capitalize">{r.status}</span>
                    </div>
                  ))}
                  {carRentals.length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-4">No bookings for this vehicle</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Add Vehicle Modal ──────────────────────────────────────────── */
function AddVehicleModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const inp = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";
  const sel = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a2332]">Add New Vehicle</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">Fill in the details to add a vehicle to your fleet</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

            {/* Basic Info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Basic Information</p>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Brand <span className="text-red-400">*</span></label>
                  <input className={inp} placeholder="e.g. Renault" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Model <span className="text-red-400">*</span></label>
                  <input className={inp} placeholder="e.g. Clio 5" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Year</label>
                  <input type="number" className={inp} placeholder="2024" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Plate Number <span className="text-red-400">*</span></label>
                  <input className={inp} placeholder="e.g. RCL-031-31" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Color</label>
                  <input className={inp} placeholder="e.g. Pearl White" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Type</label>
                  <select className={sel}>
                    <option value="">Select type</option>
                    {["Economy", "Compact", "Sedan", "SUV", "Luxury", "Van"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Specifications</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Transmission</label>
                  <select className={sel}>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Fuel</label>
                  <select className={sel}>
                    <option>Gasoline</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Seats</label>
                  <input type="number" className={inp} placeholder="5" />
                </div>
                <div className="col-span-3">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Current Mileage (km)</label>
                  <input type="number" className={inp} placeholder="0" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pricing</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Daily Rate ($) <span className="text-red-400">*</span></label>
                  <input type="number" className={inp} placeholder="45" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Weekly Rate ($)</label>
                  <input type="number" className={inp} placeholder="280" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Monthly Rate ($)</label>
                  <input type="number" className={inp} placeholder="900" />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Vehicle Image</p>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-[13px] font-semibold text-slate-500">Click to upload or drag and drop</p>
                <p className="text-[11.5px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notes</label>
              <textarea rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition" placeholder="Any notes about the vehicle…" />
            </div>
          </div>

          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm">
              Add Vehicle
            </button>
            <button onClick={onClose} className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13.5px] font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Vehicle Drawer ─────────────────────────────────────────────── */
function VehicleDrawer({ car, onClose, onSchedule }: {
  car: FleetCar;
  onClose: () => void;
  onSchedule: () => void;
}) {
  const carRentals    = rentals.filter(r => r.plate === car.plate || r.car.includes(car.model)).slice(0, 5);
  const carMaintenance = maintenance.find(m => m.plate === car.plate);

  const DOCS = [
    { name: "Insurance Certificate", expires: "2026-12-31", status: "valid",   icon: Shield    },
    { name: "Vehicle Registration",  expires: "2027-01-15", status: "valid",   icon: FileText  },
    { name: "Technical Inspection",  expires: "2026-09-01", status: "valid",   icon: ClipboardList },
  ];

  const infoRows = [
    { label: "Brand",        value: car.brand         },
    { label: "Model",        value: car.model         },
    { label: "Year",         value: car.year.toString()},
    { label: "Color",        value: car.color         },
    { label: "Plate",        value: car.plate         },
    { label: "Type",         value: car.type          },
    { label: "Transmission", value: car.transmission  },
    { label: "Fuel",         value: car.fuel          },
    { label: "Seats",        value: `${car.seats}`    },
    { label: "Mileage",      value: `${car.mileage.toLocaleString()} km` },
    { label: "Daily Rate",   value: `$${car.pricePerDay}` },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Hero image + header */}
        <div className="relative h-44 bg-slate-100 flex-shrink-0">
          <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl text-white hover:bg-white/30 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[18px] font-bold text-white leading-tight">{car.brand} {car.model}</p>
                <p className="text-[12px] text-white/80 font-mono mt-0.5">{car.plate} · {car.year}</p>
              </div>
              <StatusBadge s={car.status} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Quick price strip */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-b border-slate-100">
            <div>
              <span className="text-[22px] font-bold text-[#1a2332]">${car.pricePerDay}</span>
              <span className="text-[13px] text-slate-400 font-medium"> / day</span>
            </div>
            <button onClick={onSchedule} className="flex items-center gap-2 h-9 px-4 bg-[#1a2332] text-white rounded-xl text-[12.5px] font-semibold hover:bg-[#243044] transition-colors">
              <CalendarDays className="h-3.5 w-3.5" /> View Schedule
            </button>
          </div>

          <div className="px-6 py-6 space-y-7">

            {/* Overview */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Vehicle Overview</p>
              <div className="grid grid-cols-2 gap-2">
                {infoRows.map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Current Status */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Current Status</p>
              <div className={`rounded-2xl border p-4 ${STATUS_CFG[car.status].badge}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_CFG[car.status].dot}`} />
                  <p className="text-[13px] font-bold">{STATUS_CFG[car.status].label}</p>
                </div>
                {car.status === "rented" && carRentals[0] && (
                  <p className="text-[12px] opacity-80">Rented to {carRentals[0].client} · Returns {fmtShort(carRentals[0].endDate)}</p>
                )}
                {car.status === "reserved" && carRentals[0] && (
                  <p className="text-[12px] opacity-80">Reserved by {carRentals[0].client} · Pickup {fmtShort(carRentals[0].startDate)}</p>
                )}
                {car.status === "available" && (
                  <p className="text-[12px] opacity-80">Ready for rental — no active bookings</p>
                )}
                {car.status === "maintenance" && carMaintenance && (
                  <p className="text-[12px] opacity-80">{carMaintenance.type} · Est. ready {carMaintenance.scheduledDate}</p>
                )}
              </div>
            </section>

            {/* Rental History */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Rental History</p>
              {carRentals.length === 0 ? (
                <p className="text-[13px] text-slate-400 py-3">No rental history for this vehicle.</p>
              ) : (
                <div className="relative pl-5">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200 rounded-full" />
                  <div className="space-y-4">
                    {carRentals.map((r, i) => (
                      <div key={r.id} className="relative flex gap-3">
                        <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          r.status === "completed" ? "bg-emerald-400" :
                          r.status === "active"    ? "bg-sky-400" :
                          r.status === "overdue"   ? "bg-red-400" : "bg-indigo-400"
                        }`} />
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[12.5px] font-semibold text-slate-800">{r.client}</p>
                            <span className="text-[10.5px] font-semibold text-slate-400 capitalize">{r.status}</span>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">{fmtShort(r.startDate)} → {fmtShort(r.endDate)} · <span className="font-semibold text-slate-700">${r.totalPrice}</span></p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{r.reference}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Maintenance */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Maintenance</p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
                {[
                  { label: "Last Service",  value: fmtDate(car.lastService) },
                  { label: "Next Service",  value: fmtDate(car.nextService) },
                  ...(carMaintenance ? [
                    { label: "Current Job",   value: carMaintenance.type },
                    { label: "Garage",        value: carMaintenance.garage },
                    { label: "Est. Cost",     value: `$${carMaintenance.estimatedCost}` },
                  ] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center px-4 py-3">
                    <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                    <span className="text-[12.5px] text-slate-700 font-semibold text-right max-w-[200px]">{value}</span>
                  </div>
                ))}
              </div>
              {car.notes && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                  <p className="text-[11.5px] text-amber-800 leading-relaxed">{car.notes}</p>
                </div>
              )}
            </section>

            {/* Documents */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Documents</p>
              <div className="space-y-2">
                {DOCS.map(({ name, expires, status, icon: Icon }) => (
                  <div key={name} className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-slate-700">{name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Expires {fmtDate(expires)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Valid
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Quick actions */}
        <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12.5px] font-semibold hover:bg-slate-100 transition-colors">
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button onClick={onSchedule} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12.5px] font-semibold hover:bg-slate-100 transition-colors">
            <CalendarDays className="h-4 w-4" /> Schedule
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12.5px] font-semibold hover:bg-slate-100 transition-colors">
            <Wrench className="h-4 w-4" /> Maintenance
          </button>
          {car.status !== "available" && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12.5px] font-semibold hover:bg-emerald-100 transition-colors">
              <CheckCircle className="h-4 w-4" /> Mark Available
            </button>
          )}
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Main Fleet component ────────────────────────────────────────── */
export function Fleet() {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<FleetStatus | "all">("all");
  const [view,         setView]         = useState<"grid" | "list">("grid");
  const [selected,     setSelected]     = useState<FleetCar | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => fleet.filter(c => {
    const mf = statusFilter === "all" || c.status === statusFilter;
    const ms = !search || [c.brand, c.model, c.plate, c.type, c.color].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    );
    return mf && ms;
  }), [search, statusFilter]);

  const counts: Record<string, number> = {
    all:         fleet.length,
    available:   fleet.filter(c => c.status === "available").length,
    reserved:    fleet.filter(c => c.status === "reserved").length,
    rented:      fleet.filter(c => c.status === "rented").length,
    maintenance: fleet.filter(c => c.status === "maintenance").length,
  };

  const STATUS_FILTERS: { label: string; value: FleetStatus | "all" }[] = [
    { label: "All",         value: "all"         },
    { label: "Available",   value: "available"   },
    { label: "Reserved",    value: "reserved"    },
    { label: "Rented",      value: "rented"      },
    { label: "Maintenance", value: "maintenance" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* ── Page header ── */}
      <div className="px-6 sm:px-8 pt-7 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">Fleet</h2>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Manage vehicles, availability, maintenance, and fleet operations</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search brand, model, plate…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 h-10 w-56 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-sm transition"
              />
            </div>
            <button className="h-10 px-3.5 flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="h-10 px-5 flex items-center gap-2 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Vehicle
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {KPI_LIST.map(({ label, value, sub, color, bg, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-[26px] font-bold ${color} leading-none tabular-nums mb-1`}>{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-tight mb-1">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filter bar + view switcher */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(({ label, value }) => {
              const active = statusFilter === value;
              return (
                <button key={value} onClick={() => setStatusFilter(value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                    active ? "bg-[#1a2332] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}>
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>{counts[value]}</span>
                </button>
              );
            })}
          </div>
          {/* View switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={() => setView("grid")} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${view === "grid" ? "bg-[#1a2332] text-white" : "text-slate-400 hover:bg-slate-100"}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setView("list")} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${view === "list" ? "bg-[#1a2332] text-white" : "text-slate-400 hover:bg-slate-100"}`}>
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 sm:mx-8 mt-4 border-t border-slate-200" />

      {/* ── Fleet content ── */}
      <div className="px-6 sm:px-8 py-6">

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Car className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-[15px] font-semibold text-slate-400">No vehicles match your search</p>
            <p className="text-[13px] text-slate-300 mt-1">Try adjusting the filter or search term</p>
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(car => (
              <div
                key={car.id}
                className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                onClick={() => setSelected(car)}
              >
                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <StatusBadge s={car.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[14px] font-bold text-[#1a2332] leading-tight">{car.brand} {car.model}</p>
                      <p className="text-[11.5px] text-slate-400 font-mono mt-0.5">{car.plate}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[17px] font-bold text-[#1a2332]">${car.pricePerDay}</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">/day</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11.5px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                    <span className="flex items-center gap-1">{car.year}</span>
                    <span className="text-slate-200">·</span>
                    <span>{car.transmission}</span>
                    <span className="text-slate-200">·</span>
                    <span>{car.fuel}</span>
                    <span className="text-slate-200">·</span>
                    <span>{car.seats} seats</span>
                  </div>

                  <div className="flex gap-2 mt-3.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelected(car)}
                      className="flex-1 h-8 bg-[#1a2332] text-white rounded-lg text-[11.5px] font-semibold hover:bg-[#243044] transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => { setSelected(car); setShowSchedule(true); }}
                      className="h-8 px-3 bg-slate-100 text-slate-600 rounded-lg text-[11.5px] font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === "list" && filtered.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Vehicle", "Plate", "Type", "Specs", "Price / day", "Mileage", "Status", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(car => (
                    <tr key={car.id} onClick={() => setSelected(car)} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={car.image} alt={car.brand} className="w-14 h-10 object-cover rounded-xl flex-shrink-0" />
                          <div>
                            <p className="text-[13px] font-bold text-[#1a2332]">{car.brand} {car.model}</p>
                            <p className="text-[11.5px] text-slate-400 mt-0.5">{car.year} · {car.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12px] font-mono font-semibold text-slate-600">{car.plate}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12.5px] text-slate-600 font-medium">{car.type}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12px] text-slate-500">{car.transmission} · {car.fuel} · {car.seats}s</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-bold text-[#1a2332]">${car.pricePerDay}<span className="text-[11px] font-normal text-slate-400">/d</span></p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12.5px] text-slate-600">{car.mileage.toLocaleString()} km</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge s={car.status} /></td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(car)} title="View details"
                            className="h-8 px-3 rounded-lg bg-slate-100 text-slate-600 text-[11.5px] font-semibold hover:bg-slate-200 transition-colors">
                            Details
                          </button>
                          <button onClick={() => { setSelected(car); setShowSchedule(true); }} title="Schedule"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <CalendarDays className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[11.5px] text-slate-400 font-medium">Showing {filtered.length} of {fleet.length} vehicles</span>
            </div>
          </div>
        )}
      </div>

      {/* Drawers & Modals */}
      {selected && !showSchedule && (
        <VehicleDrawer
          car={selected}
          onClose={() => setSelected(null)}
          onSchedule={() => setShowSchedule(true)}
        />
      )}
      {selected && showSchedule && (
        <ScheduleModal
          car={selected}
          onClose={() => { setShowSchedule(false); setSelected(null); }}
        />
      )}
      {showAddModal && (
        <AddVehicleModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
