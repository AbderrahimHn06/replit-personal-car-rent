import { useState } from "react";
import { X, LayoutGrid, List, Fuel, Users, Gauge } from "lucide-react";
import { fleet, FleetCar, FleetStatus } from "@/data/dashboardData";

const STATUS_FILTERS: { label: string; value: FleetStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Rented", value: "rented" },
  { label: "Maintenance", value: "maintenance" },
];

function statusBadge(status: FleetStatus) {
  const s: Record<FleetStatus, string> = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    reserved: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rented: "bg-amber-50 text-amber-700 border-amber-200",
    maintenance: "bg-red-50 text-red-600 border-red-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${s[status]}`}>{status}</span>;
}

function cardStatusDot(status: FleetStatus) {
  const s: Record<FleetStatus, string> = {
    available: "bg-emerald-500",
    reserved: "bg-indigo-500",
    rented: "bg-amber-500",
    maintenance: "bg-red-500",
  };
  return <div className={`w-2 h-2 rounded-full ${s[status]}`} />;
}

export function Fleet() {
  const [statusFilter, setStatusFilter] = useState<FleetStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<FleetCar | null>(null);

  const filtered = statusFilter === "all" ? fleet : fleet.filter(c => c.status === statusFilter);

  const counts: Record<string, number> = {
    all: fleet.length,
    available: fleet.filter(c => c.status === "available").length,
    reserved: fleet.filter(c => c.status === "reserved").length,
    rented: fleet.filter(c => c.status === "rented").length,
    maintenance: fleet.filter(c => c.status === "maintenance").length,
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Fleet Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">{fleet.length} vehicles in your fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg border transition-colors ${view === "grid" ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded-lg border transition-colors ${view === "list" ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {STATUS_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`h-8 px-3 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === value
                ? "bg-primary text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusFilter === value ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"}`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(car => (
            <button
              key={car.id}
              onClick={() => setSelected(car)}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all text-left hover:border-primary/30"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 right-2">{statusBadge(car.status)}</div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{car.brand} {car.model}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{car.plate} · {car.year}</p>
                  </div>
                  <p className="text-sm font-bold text-accent flex-shrink-0">${car.pricePerDay}<span className="text-[11px] font-normal text-slate-400">/d</span></p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span>{car.transmission}</span>
                  <span>·</span>
                  <span>{car.fuel}</span>
                  <span>·</span>
                  <span>{car.seats} seats</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Plate</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Fuel</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Mileage</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(car => (
                  <tr key={car.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(car)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={car.image} alt={car.brand} className="w-10 h-8 object-cover rounded-lg" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{car.brand} {car.model}</p>
                          <p className="text-[11px] text-slate-400">{car.year} · {car.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 hidden sm:table-cell">{car.plate}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell">{car.type}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 hidden lg:table-cell">{car.fuel}</td>
                    <td className="px-4 py-3 text-xs font-bold text-accent">${car.pricePerDay}/d</td>
                    <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">{car.mileage.toLocaleString()} km</td>
                    <td className="px-4 py-3">{statusBadge(car.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Car Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">{selected.brand} {selected.model}</h3>
                <p className="text-xs text-slate-500 font-mono">{selected.plate}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 mb-5">
                <img src={selected.image} alt={selected.brand} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">{statusBadge(selected.status)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Year", value: selected.year.toString() },
                  { label: "Color", value: selected.color },
                  { label: "Fuel", value: selected.fuel },
                  { label: "Transmission", value: selected.transmission },
                  { label: "Seats", value: `${selected.seats}` },
                  { label: "Type", value: selected.type },
                  { label: "Daily Rate", value: `$${selected.pricePerDay}` },
                  { label: "Mileage", value: `${selected.mileage.toLocaleString()} km` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Last Service</span>
                  <span className="font-semibold text-slate-700">{selected.lastService}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Next Service</span>
                  <span className="font-semibold text-slate-700">{selected.nextService}</span>
                </div>
              </div>
              {selected.notes && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-xs text-amber-800">{selected.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
