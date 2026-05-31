import { useState } from "react";
import { X, Eye, RotateCcw, Calendar, Plus } from "lucide-react";
import { rentals as allRentals, DashboardRental, RentalStatus } from "@/data/dashboardData";

const FILTERS: { label: string; value: RentalStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Overdue", value: "overdue" },
  { label: "Reserved", value: "reserved" },
  { label: "Completed", value: "completed" },
];

function statusBadge(status: RentalStatus) {
  const s: Record<RentalStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-slate-100 text-slate-500 border-slate-200",
    reserved: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${s[status]}`}>{status}</span>;
}

function sourceBadge(source: string) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${source === "online" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
      {source}
    </span>
  );
}

export function RentalsManagement() {
  const [rentals, setRentals] = useState<DashboardRental[]>(allRentals);
  const [filter, setFilter] = useState<RentalStatus | "all">("all");
  const [selected, setSelected] = useState<DashboardRental | null>(null);

  const filtered = filter === "all" ? rentals : rentals.filter(r => r.status === filter);

  const counts: Record<string, number> = {
    all: rentals.length,
    active: rentals.filter(r => r.status === "active").length,
    overdue: rentals.filter(r => r.status === "overdue").length,
    reserved: rentals.filter(r => r.status === "reserved").length,
    completed: rentals.filter(r => r.status === "completed").length,
  };

  const markReturned = (id: string) => {
    setRentals(p => p.map(r => r.id === id ? { ...r, status: "completed" } : r));
    if (selected?.id === id) setSelected(p => p ? { ...p, status: "completed" } : null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Rentals Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">All rentals — online and walk-in</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`h-8 px-3 rounded-full text-xs font-semibold border transition-all ${
              filter === value
                ? "bg-primary text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {label}
            {counts[value] > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === value ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"}`}>
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Period</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Deposit</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Source</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">No rentals found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-primary whitespace-nowrap">{r.reference}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{r.client}</div>
                    <div className="text-[11px] text-slate-400">{r.clientPhone}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-xs font-medium text-slate-700">{r.car}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.plate}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell whitespace-nowrap">
                    {r.startDate} → {r.endDate}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-accent whitespace-nowrap">${r.totalPrice}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell">${r.deposit}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{sourceBadge(r.source)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {(r.status === "active" || r.status === "overdue") && (
                        <button onClick={() => markReturned(r.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Mark returned">
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">{selected.reference}</h3>
                <p className="text-xs text-slate-500">{selected.source} rental</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                {statusBadge(selected.status)}
                {sourceBadge(selected.source)}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                {[
                  { label: "Client", value: selected.client },
                  { label: "Phone", value: selected.clientPhone },
                  { label: "Driver License", value: selected.driverLicense },
                  { label: "Vehicle", value: `${selected.car}` },
                  { label: "Plate", value: selected.plate },
                  { label: "Period", value: `${selected.startDate} → ${selected.endDate}` },
                  { label: "Pickup Location", value: selected.pickupLocation },
                  { label: "Total Price", value: `$${selected.totalPrice}` },
                  { label: "Deposit Paid", value: `$${selected.deposit}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-400 font-medium flex-shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-slate-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
              {(selected.status === "active" || selected.status === "overdue") && (
                <button
                  onClick={() => { markReturned(selected.id); setSelected(null); }}
                  className="w-full h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Mark as Returned
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
