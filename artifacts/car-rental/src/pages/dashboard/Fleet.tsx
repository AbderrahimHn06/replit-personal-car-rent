import { useState, useEffect, useMemo } from "react";
import {
  X, LayoutGrid, List, Search, SlidersHorizontal, Plus,
  Car, CheckCircle, Clock, Wrench, CalendarDays, ChevronLeft,
  ChevronRight, Edit2, FileText, Shield, ClipboardList, Upload,
} from "lucide-react";
import {
  fleet as initialFleet, FleetCar, FleetStatus,
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
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Filter state type ────────────────────────────────────────── */
interface Filters {
  status:       FleetStatus | "all";
  transmission: "all" | "Manual" | "Automatic";
  fuel:         "all" | "Gasoline" | "Diesel" | "Electric";
  type:         string;
}
const BLANK_FILTERS: Filters = { status: "all", transmission: "all", fuel: "all", type: "all" };

function activeFilterCount(f: Filters) {
  return [f.status !== "all", f.transmission !== "all", f.fuel !== "all", f.type !== "all"].filter(Boolean).length;
}

/* ─── KPI data ─────────────────────────────────────────────────── */
const KPI_LIST = (fleet: FleetCar[]) => [
  { label: "Total Vehicles",  value: fleet.length,                                          sub: "in your fleet",        color: "text-slate-700",   bg: "bg-slate-100",  icon: Car          },
  { label: "Available",       value: fleet.filter(c => c.status === "available").length,    sub: "ready to rent",        color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle  },
  { label: "Reserved",        value: fleet.filter(c => c.status === "reserved").length,     sub: "upcoming pickups",     color: "text-indigo-600",  bg: "bg-indigo-50",  icon: CalendarDays },
  { label: "Rented",          value: fleet.filter(c => c.status === "rented").length,       sub: "on the road",          color: "text-amber-600",   bg: "bg-amber-50",   icon: Car          },
  { label: "Maintenance",     value: fleet.filter(c => c.status === "maintenance").length,  sub: "in service",           color: "text-red-600",     bg: "bg-red-50",     icon: Wrench       },
  { label: "Returning Today", value: 1,                                                     sub: "expected returns",     color: "text-violet-600",  bg: "bg-violet-50",  icon: Clock        },
];

/* ─── Schedule Modal ───────────────────────────────────────────── */
const RENTAL_COLORS = [
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-amber-100 text-amber-800 border-amber-300",
  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "bg-sky-100 text-sky-800 border-sky-300",
  "bg-violet-100 text-violet-800 border-violet-300",
];

function ScheduleModal({ car, onClose }: { car: FleetCar; onClose: () => void }) {
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(5);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const carRentals  = rentals.filter(r => r.plate === car.plate || r.car.includes(car.model));
  const monthName   = new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  function getDayStatus(day: number) {
    const d = new Date(year, month, day);
    for (let i = 0; i < carRentals.length; i++) {
      const start = new Date(carRentals[i].startDate); start.setHours(0, 0, 0, 0);
      const end   = new Date(carRentals[i].endDate);   end.setHours(23, 59, 59, 999);
      if (d >= start && d <= end) return { rental: carRentals[i], colorIdx: i % RENTAL_COLORS.length };
    }
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a2332]">{car.brand} {car.model} — Schedule</h3>
              <p className="text-[12px] text-slate-400 font-mono mt-0.5">{car.plate}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <p className="text-[14px] font-bold text-[#1a2332]">{monthName}</p>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-7 mb-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className="text-center text-[10.5px] font-bold text-slate-400 uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day  = i + 1;
                  const info = getDayStatus(day);
                  const isToday = year === 2026 && month === 5 && day === 1;
                  return (
                    <div key={day} className={`min-h-[52px] rounded-xl p-1.5 border transition-colors ${
                      info ? `${RENTAL_COLORS[info.colorIdx].split(" ").slice(0,2).join(" ")} border-current/20`
                           : "bg-emerald-50/60 border-emerald-100"
                    }`}>
                      <span className={`text-[11px] font-bold ${isToday ? "w-5 h-5 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-[10px]" : info ? "text-inherit" : "text-emerald-700"}`}>{day}</span>
                      {info && <p className="text-[9px] font-semibold leading-tight mt-0.5 line-clamp-2 opacity-90">{info.rental.client.split(" ")[0]}</p>}
                    </div>
                  );
                })}
              </div>
              {carRentals.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Bookings</p>
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
                <p className="text-[13px] text-slate-400 text-center py-8">No bookings for this vehicle</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Vehicle Modal ───────────────────────────────────────── */
function EditVehicleModal({ car, onClose, onSave }: {
  car: FleetCar;
  onClose: () => void;
  onSave: (updated: FleetCar) => void;
}) {
  const [form, setForm] = useState<FleetCar>({ ...car });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const set = (k: keyof FleetCar, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  const inp = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";
  const sel = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a2332]">Edit Vehicle</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">{car.brand} {car.model} · {car.plate}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
            {/* Basic Info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Basic Information</p>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Brand</label>
                  <input className={inp} value={form.brand} onChange={e => set("brand", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Model</label>
                  <input className={inp} value={form.model} onChange={e => set("model", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Year</label>
                  <input type="number" className={inp} value={form.year} onChange={e => set("year", parseInt(e.target.value) || form.year)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Plate Number</label>
                  <input className={inp} value={form.plate} onChange={e => set("plate", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Color</label>
                  <input className={inp} value={form.color} onChange={e => set("color", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Type</label>
                  <select className={sel} value={form.type} onChange={e => set("type", e.target.value)}>
                    {["Economy","Compact","Sedan","SUV","Luxury","Van","City"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Specifications</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Transmission</label>
                  <select className={sel} value={form.transmission} onChange={e => set("transmission", e.target.value as "Manual"|"Automatic")}>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Fuel</label>
                  <select className={sel} value={form.fuel} onChange={e => set("fuel", e.target.value as "Gasoline"|"Diesel"|"Electric")}>
                    <option>Gasoline</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Seats</label>
                  <input type="number" className={inp} value={form.seats} onChange={e => set("seats", parseInt(e.target.value) || form.seats)} />
                </div>
                <div className="col-span-3">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Mileage (km)</label>
                  <input type="number" className={inp} value={form.mileage} onChange={e => set("mileage", parseInt(e.target.value) || form.mileage)} />
                </div>
              </div>
            </div>

            {/* Pricing + Status */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pricing & Status</p>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Daily Rate ($)</label>
                  <input type="number" className={inp} value={form.pricePerDay} onChange={e => set("pricePerDay", parseFloat(e.target.value) || form.pricePerDay)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Status</label>
                  <select className={sel} value={form.status} onChange={e => set("status", e.target.value as FleetStatus)}>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notes</label>
              <textarea rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                value={form.notes} onChange={e => set("notes", e.target.value)} />
            </div>
          </div>

          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button onClick={() => onSave(form)} className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm">
              Save Changes
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

/* ─── Add Vehicle Modal ───────────────────────────────────────── */
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
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Basic Information</p>
              <div className="grid grid-cols-2 gap-3.5">
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Brand</label><input className={inp} placeholder="e.g. Renault" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Model</label><input className={inp} placeholder="e.g. Clio 5" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Year</label><input type="number" className={inp} placeholder="2024" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Plate Number</label><input className={inp} placeholder="e.g. RCL-031-31" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Color</label><input className={inp} placeholder="e.g. Pearl White" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Type</label>
                  <select className={sel}><option value="">Select type</option>{["Economy","Compact","Sedan","SUV","Luxury","Van"].map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Specifications</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Transmission</label><select className={sel}><option>Manual</option><option>Automatic</option></select></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Fuel</label><select className={sel}><option>Gasoline</option><option>Diesel</option><option>Electric</option></select></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Seats</label><input type="number" className={inp} placeholder="5" /></div>
                <div className="col-span-3"><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Mileage (km)</label><input type="number" className={inp} placeholder="0" /></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pricing</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Daily ($)</label><input type="number" className={inp} placeholder="45" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Weekly ($)</label><input type="number" className={inp} placeholder="280" /></div>
                <div><label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Monthly ($)</label><input type="number" className={inp} placeholder="900" /></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Vehicle Image</p>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-[13px] font-semibold text-slate-500">Click to upload or drag and drop</p>
                <p className="text-[11.5px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm">Add Vehicle</button>
            <button onClick={onClose} className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13.5px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Vehicle Drawer ──────────────────────────────────────────── */
function VehicleDrawer({ car, onClose, onSchedule, onEdit }: {
  car: FleetCar;
  onClose: () => void;
  onSchedule: () => void;
  onEdit: () => void;
}) {
  const carRentals     = rentals.filter(r => r.plate === car.plate || r.car.includes(car.model)).slice(0, 5);
  const carMaintenance = maintenance.find(m => m.plate === car.plate);

  const DOCS = [
    { name: "Insurance Certificate", expires: "2026-12-31", icon: Shield        },
    { name: "Vehicle Registration",  expires: "2027-01-15", icon: FileText      },
    { name: "Technical Inspection",  expires: "2026-09-01", icon: ClipboardList },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="relative h-44 bg-slate-100 flex-shrink-0">
          <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl text-white hover:bg-white/30 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-[18px] font-bold text-white leading-tight">{car.brand} {car.model}</p>
              <p className="text-[12px] text-white/80 font-mono mt-0.5">{car.plate} · {car.year}</p>
            </div>
            <StatusBadge s={car.status} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
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
                {[
                  { label: "Brand",        value: car.brand },
                  { label: "Model",        value: car.model },
                  { label: "Year",         value: car.year.toString() },
                  { label: "Color",        value: car.color },
                  { label: "Plate",        value: car.plate },
                  { label: "Type",         value: car.type },
                  { label: "Transmission", value: car.transmission },
                  { label: "Fuel",         value: car.fuel },
                  { label: "Seats",        value: `${car.seats}` },
                  { label: "Mileage",      value: `${car.mileage.toLocaleString()} km` },
                  { label: "Daily Rate",   value: `$${car.pricePerDay}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Status */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Current Status</p>
              <div className={`rounded-2xl border p-4 ${STATUS_CFG[car.status].badge}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${STATUS_CFG[car.status].dot}`} />
                  <p className="text-[13px] font-bold">{STATUS_CFG[car.status].label}</p>
                </div>
                {car.status === "rented"      && carRentals[0] && <p className="text-[12px] opacity-80">Rented to {carRentals[0].client} · Returns {fmtShort(carRentals[0].endDate)}</p>}
                {car.status === "reserved"    && carRentals[0] && <p className="text-[12px] opacity-80">Reserved by {carRentals[0].client} · Pickup {fmtShort(carRentals[0].startDate)}</p>}
                {car.status === "available"   && <p className="text-[12px] opacity-80">Ready for rental — no active bookings</p>}
                {car.status === "maintenance" && carMaintenance && <p className="text-[12px] opacity-80">{carMaintenance.type} · Est. ready {carMaintenance.scheduledDate}</p>}
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
                    {carRentals.map(r => (
                      <div key={r.id} className="relative flex gap-3">
                        <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          r.status === "completed" ? "bg-emerald-400" : r.status === "active" ? "bg-sky-400" : r.status === "overdue" ? "bg-red-400" : "bg-indigo-400"
                        }`} />
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[12.5px] font-semibold text-slate-800">{r.client}</p>
                            <span className="text-[10.5px] font-semibold text-slate-400 capitalize">{r.status}</span>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">{fmtShort(r.startDate)} → {fmtShort(r.endDate)} · <span className="font-semibold text-slate-700">${r.totalPrice}</span></p>
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
                  { label: "Last Service", value: fmtDate(car.lastService) },
                  { label: "Next Service", value: fmtDate(car.nextService) },
                  ...(carMaintenance ? [
                    { label: "Current Job", value: carMaintenance.type },
                    { label: "Garage",      value: carMaintenance.garage },
                    { label: "Est. Cost",   value: `$${carMaintenance.estimatedCost}` },
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
                {DOCS.map(({ name, expires, icon: Icon }) => (
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

        <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12.5px] font-semibold hover:bg-slate-100 transition-colors">
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

/* ─── Filter Panel ────────────────────────────────────────────── */
function FilterPanel({ filters, onChange, onClose, onClear }: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const selCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all cursor-pointer ${
      active ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
    }`;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 z-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-bold text-slate-700">Filter Vehicles</p>
          <button onClick={onClear} className="text-[11.5px] font-semibold text-violet-600 hover:text-violet-700">Clear all</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Transmission</p>
            <div className="flex gap-2 flex-wrap">
              {(["all","Manual","Automatic"] as const).map(v => (
                <button key={v} onClick={() => onChange({ transmission: v })} className={selCls(filters.transmission === v)}>
                  {v === "all" ? "Any" : v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Fuel</p>
            <div className="flex gap-2 flex-wrap">
              {(["all","Gasoline","Diesel","Electric"] as const).map(v => (
                <button key={v} onClick={() => onChange({ fuel: v })} className={selCls(filters.fuel === v)}>
                  {v === "all" ? "Any" : v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Vehicle Type</p>
            <div className="flex gap-2 flex-wrap">
              {["all","Economy","Compact","Sedan","SUV","Luxury","Van","City"].map(v => (
                <button key={v} onClick={() => onChange({ type: v })} className={selCls(filters.type === v)}>
                  {v === "all" ? "Any" : v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-5 w-full h-10 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] transition-colors">
          Apply Filters
        </button>
      </div>
    </>
  );
}

/* ─── Main Fleet Component ────────────────────────────────────── */
export function Fleet() {
  const [localFleet,   setLocalFleet]   = useState<FleetCar[]>(initialFleet);
  const [search,       setSearch]       = useState("");
  const [filters,      setFilters]      = useState<Filters>(BLANK_FILTERS);
  const [showFilters,  setShowFilters]  = useState(false);
  const [view,         setView]         = useState<"grid" | "list">("grid");
  const [selected,     setSelected]     = useState<FleetCar | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [editing,      setEditing]      = useState<FleetCar | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const counts = useMemo(() => ({
    all:         localFleet.length,
    available:   localFleet.filter(c => c.status === "available").length,
    reserved:    localFleet.filter(c => c.status === "reserved").length,
    rented:      localFleet.filter(c => c.status === "rented").length,
    maintenance: localFleet.filter(c => c.status === "maintenance").length,
  }), [localFleet]);

  const filtered = useMemo(() => localFleet.filter(c => {
    if (filters.status !== "all"       && c.status       !== filters.status)       return false;
    if (filters.transmission !== "all" && c.transmission !== filters.transmission) return false;
    if (filters.fuel !== "all"         && c.fuel         !== filters.fuel)         return false;
    if (filters.type !== "all"         && c.type         !== filters.type)         return false;
    if (search) {
      const q = search.toLowerCase();
      return [c.brand, c.model, c.plate, c.type, c.color, c.fuel, c.transmission].some(v => v.toLowerCase().includes(q));
    }
    return true;
  }), [localFleet, filters, search]);

  const activeFCount = activeFilterCount(filters);
  const hasAnyFilter = activeFCount > 0 || !!search;

  function handleSaveEdit(updated: FleetCar) {
    setLocalFleet(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selected?.id === updated.id) setSelected(updated);
    setEditing(null);
  }

  function mergeFilters(partial: Partial<Filters>) {
    setFilters(prev => ({ ...prev, ...partial }));
  }

  const STATUS_FILTERS: { label: string; value: FleetStatus | "all" }[] = [
    { label: "All",         value: "all"         },
    { label: "Available",   value: "available"   },
    { label: "Reserved",    value: "reserved"    },
    { label: "Rented",      value: "rented"      },
    { label: "Maintenance", value: "maintenance" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* Header */}
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
            <div className="relative">
              <button
                onClick={() => setShowFilters(p => !p)}
                className={`h-10 px-3.5 flex items-center gap-2 border rounded-xl text-[13px] font-medium shadow-sm transition-colors ${
                  activeFCount > 0 ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFCount > 0 && <span className="bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFCount}</span>}
              </button>
              {showFilters && (
                <FilterPanel
                  filters={filters}
                  onChange={mergeFilters}
                  onClose={() => setShowFilters(false)}
                  onClear={() => { setFilters(BLANK_FILTERS); setShowFilters(false); }}
                />
              )}
            </div>
            {hasAnyFilter && (
              <button onClick={() => { setFilters(BLANK_FILTERS); setSearch(""); }}
                className="h-10 px-3.5 flex items-center gap-1.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[12.5px] font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors shadow-sm">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <button onClick={() => setShowAddModal(true)}
              className="h-10 px-5 flex items-center gap-2 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors">
              <Plus className="h-4 w-4" /> Add Vehicle
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {KPI_LIST(localFleet).map(({ label, value, sub, color, bg, icon: Icon }) => (
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

        {/* Active filter chips */}
        {activeFCount > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[11.5px] text-slate-400 font-medium">Active filters:</span>
            {filters.status !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1a2332]/8 border border-[#1a2332]/15 rounded-full text-[11.5px] font-semibold text-[#1a2332]">
                Status: {filters.status} <button onClick={() => mergeFilters({ status: "all" })} className="hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.transmission !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1a2332]/8 border border-[#1a2332]/15 rounded-full text-[11.5px] font-semibold text-[#1a2332]">
                {filters.transmission} <button onClick={() => mergeFilters({ transmission: "all" })} className="hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.fuel !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1a2332]/8 border border-[#1a2332]/15 rounded-full text-[11.5px] font-semibold text-[#1a2332]">
                {filters.fuel} <button onClick={() => mergeFilters({ fuel: "all" })} className="hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.type !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1a2332]/8 border border-[#1a2332]/15 rounded-full text-[11.5px] font-semibold text-[#1a2332]">
                {filters.type} <button onClick={() => mergeFilters({ type: "all" })} className="hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Status pills + view switcher */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(({ label, value }) => {
              const active = filters.status === value;
              return (
                <button key={value} onClick={() => mergeFilters({ status: value })}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                    active ? "bg-[#1a2332] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}>
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {counts[value]}
                  </span>
                </button>
              );
            })}
          </div>
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

      <div className="mx-6 sm:mx-8 mt-4 border-t border-slate-200" />

      {/* Fleet content */}
      <div className="px-6 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12.5px] text-slate-400 font-medium">
            {filtered.length === localFleet.length
              ? `${filtered.length} vehicles`
              : `${filtered.length} of ${localFleet.length} vehicles`}
            {hasAnyFilter && " matching filters"}
          </p>
          {hasAnyFilter && (
            <button onClick={() => { setFilters(BLANK_FILTERS); setSearch(""); }} className="text-[12px] text-violet-600 font-semibold hover:text-violet-700">
              Reset all filters
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Car className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-[15px] font-semibold text-slate-400">No vehicles match your filters</p>
            <p className="text-[13px] text-slate-300 mt-1">Try adjusting the search or filter settings</p>
            <button onClick={() => { setFilters(BLANK_FILTERS); setSearch(""); }} className="mt-4 px-5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Clear all filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(car => (
              <div key={car.id} className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group" onClick={() => { setSelected(car); setShowSchedule(false); }}>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 right-3"><StatusBadge s={car.status} /></div>
                </div>
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
                    <span>{car.year}</span><span className="text-slate-200">·</span>
                    <span>{car.transmission}</span><span className="text-slate-200">·</span>
                    <span>{car.fuel}</span><span className="text-slate-200">·</span>
                    <span>{car.seats} seats</span>
                  </div>
                  <div className="flex gap-2 mt-3.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setSelected(car); setShowSchedule(false); }} className="flex-1 h-8 bg-[#1a2332] text-white rounded-lg text-[11.5px] font-semibold hover:bg-[#243044] transition-colors">View Details</button>
                    <button onClick={() => { setSelected(car); setShowSchedule(true); }} className="h-8 px-3 bg-slate-100 text-slate-600 rounded-lg text-[11.5px] font-semibold hover:bg-slate-200 transition-colors"><CalendarDays className="h-3.5 w-3.5" /></button>
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
                    {["Vehicle","Plate","Type","Specs","Price / day","Mileage","Status","Actions"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left">
                        <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(car => (
                    <tr key={car.id} onClick={() => { setSelected(car); setShowSchedule(false); }} className="hover:bg-slate-50/80 cursor-pointer transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={car.image} alt={car.brand} className="w-14 h-10 object-cover rounded-xl flex-shrink-0" />
                          <div>
                            <p className="text-[13px] font-bold text-[#1a2332]">{car.brand} {car.model}</p>
                            <p className="text-[11.5px] text-slate-400 mt-0.5">{car.year} · {car.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><p className="text-[12px] font-mono font-semibold text-slate-600">{car.plate}</p></td>
                      <td className="px-5 py-4"><p className="text-[12.5px] text-slate-600 font-medium">{car.type}</p></td>
                      <td className="px-5 py-4"><p className="text-[12px] text-slate-500">{car.transmission} · {car.fuel} · {car.seats}s</p></td>
                      <td className="px-5 py-4"><p className="text-[14px] font-bold text-[#1a2332]">${car.pricePerDay}<span className="text-[11px] font-normal text-slate-400">/d</span></p></td>
                      <td className="px-5 py-4"><p className="text-[12.5px] text-slate-600">{car.mileage.toLocaleString()} km</p></td>
                      <td className="px-5 py-4"><StatusBadge s={car.status} /></td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setSelected(car); setShowSchedule(false); }} className="h-8 px-3 rounded-lg bg-slate-100 text-slate-600 text-[11.5px] font-semibold hover:bg-slate-200 transition-colors">Details</button>
                          <button onClick={() => setEditing(car)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => { setSelected(car); setShowSchedule(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><CalendarDays className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[11.5px] text-slate-400 font-medium">Showing {filtered.length} of {localFleet.length} vehicles</span>
            </div>
          </div>
        )}
      </div>

      {/* Drawers & Modals */}
      {selected && !showSchedule && !editing && (
        <VehicleDrawer
          car={selected}
          onClose={() => setSelected(null)}
          onSchedule={() => setShowSchedule(true)}
          onEdit={() => setEditing(selected)}
        />
      )}
      {selected && showSchedule && (
        <ScheduleModal car={selected} onClose={() => { setShowSchedule(false); setSelected(null); }} />
      )}
      {editing && (
        <EditVehicleModal car={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />
      )}
      {showAddModal && (
        <AddVehicleModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
