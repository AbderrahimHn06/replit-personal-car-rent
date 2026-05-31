import { useState } from "react";
import { Plus, X, Eye } from "lucide-react";
import { rentals as allRentals, DashboardRental, fleet } from "@/data/dashboardData";

function statusBadge(status: string) {
  const s: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-slate-100 text-slate-500 border-slate-200",
    reserved: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${s[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{status}</span>;
}

const INITIAL_FORM = {
  client: "", phone: "", car: "", pickupDate: "", returnDate: "",
  pickupLocation: "", deposit: "", notes: "",
};

export function OfflineRentals() {
  const [rentals, setRentals] = useState<DashboardRental[]>(
    allRentals.filter(r => r.source === "walk-in")
  );
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<DashboardRental | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedCar = fleet.find(c => c.id === form.car);
  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000))
    : 0;
  const estimatedTotal = selectedCar ? selectedCar.pricePerDay * days : 0;

  const handleCreate = () => {
    if (!form.client || !form.car || !form.pickupDate || !form.returnDate) return;
    const car = fleet.find(c => c.id === form.car);
    const newRental: DashboardRental = {
      id: `r-new-${Date.now()}`,
      reference: `RNT-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`,
      client: form.client,
      clientPhone: form.phone,
      car: `${car?.brand} ${car?.model}` || form.car,
      plate: car?.plate || "—",
      startDate: form.pickupDate,
      endDate: form.returnDate,
      totalPrice: estimatedTotal,
      deposit: parseInt(form.deposit) || 0,
      status: "active",
      source: "walk-in",
      pickupLocation: form.pickupLocation || "Agency Office",
      driverLicense: "—",
    };
    setRentals(prev => [newRental, ...prev]);
    setForm(INITIAL_FORM);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Walk-in Rentals</h2>
          <p className="text-xs text-slate-500 mt-0.5">Counter and office rentals created manually</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Walk-in Rental
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Car</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Dates</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Deposit</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No walk-in rentals yet</td></tr>
              ) : rentals.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-primary">{r.reference}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{r.client}</div>
                    <div className="text-[11px] text-slate-400">{r.clientPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 hidden md:table-cell">
                    <div>{r.car}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.plate}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell whitespace-nowrap">{r.startDate} → {r.endDate}</td>
                  <td className="px-4 py-3 text-xs font-bold text-accent">${r.totalPrice}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell">${r.deposit}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Rental Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">New Walk-in Rental</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Client Full Name <span className="text-red-500">*</span></label>
                  <input value={form.client} onChange={e => setF("client", e.target.value)} placeholder="Enter client name" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="Phone number" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Deposit ($)</label>
                  <input type="number" value={form.deposit} onChange={e => setF("deposit", e.target.value)} placeholder="0" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Vehicle <span className="text-red-500">*</span></label>
                  <select value={form.car} onChange={e => setF("car", e.target.value)} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                    <option value="">Select a vehicle</option>
                    {fleet.filter(c => c.status === "available").map(c => (
                      <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plate}) — ${c.pricePerDay}/day</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Pickup Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.pickupDate} onChange={e => setF("pickupDate", e.target.value)} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Return Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.returnDate} onChange={e => setF("returnDate", e.target.value)} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Pickup Location</label>
                  <input value={form.pickupLocation} onChange={e => setF("pickupLocation", e.target.value)} placeholder="Agency office / address" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Notes</label>
                  <textarea value={form.notes} onChange={e => setF("notes", e.target.value)} placeholder="Any special notes..." rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>

              {/* Price summary */}
              {estimatedTotal > 0 && (
                <div className="bg-primary/6 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{days} day{days !== 1 ? "s" : ""} × ${selectedCar?.pricePerDay}/day</span>
                    <span className="font-bold text-accent text-lg">${estimatedTotal}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.client || !form.car || !form.pickupDate || !form.returnDate}
                  className="flex-1 h-10 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Rental
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">{selected.reference}</h3>
                <p className="text-xs text-slate-500">Walk-in rental</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">{statusBadge(selected.status)}</div>
              {[
                { label: "Client", value: selected.client },
                { label: "Phone", value: selected.clientPhone },
                { label: "Vehicle", value: `${selected.car} (${selected.plate})` },
                { label: "Period", value: `${selected.startDate} → ${selected.endDate}` },
                { label: "Location", value: selected.pickupLocation },
                { label: "Total Price", value: `$${selected.totalPrice}` },
                { label: "Deposit", value: `$${selected.deposit}` },
                { label: "License", value: selected.driverLicense },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between">
                  <span className="text-xs text-slate-400 font-medium">{label}</span>
                  <span className="text-xs font-semibold text-slate-700 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
