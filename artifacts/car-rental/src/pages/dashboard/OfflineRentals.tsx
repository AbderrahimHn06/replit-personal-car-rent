import { useState } from "react";
import { Plus, X, Eye, CheckCircle2, Printer, CalendarPlus } from "lucide-react";
import { rentals as allRentals, DashboardRental, RentalStatus, fleet } from "@/data/dashboardData";

const STATUS_CFG: Record<RentalStatus, { cls: string; label: string; dot: string }> = {
  active:    { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", label: "Active",    dot: "bg-emerald-500" },
  reserved:  { cls: "bg-indigo-50 text-indigo-700 border border-indigo-100",   label: "Reserved",  dot: "bg-indigo-500"  },
  overdue:   { cls: "bg-red-50 text-red-700 border border-red-100",            label: "Overdue",   dot: "bg-red-500"     },
  completed: { cls: "bg-slate-100 text-slate-500 border border-slate-200",     label: "Completed", dot: "bg-slate-400"   },
};

function Badge({ s }: { s: RentalStatus }) {
  const { cls, label, dot } = STATUS_CFG[s];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const walkInRentals = allRentals.filter(r => r.source === "walk-in");
const availableCars = fleet.filter(c => c.status === "available");

interface FormState {
  clientName: string; phone: string; licenseNumber: string;
  carId: string; pickupDate: string; returnDate: string;
  dailyPrice: string; deposit: string; notes: string;
}
const BLANK: FormState = {
  clientName: "", phone: "", licenseNumber: "",
  carId: "", pickupDate: "", returnDate: "",
  dailyPrice: "", deposit: "", notes: "",
};

function calcTotal(carId: string, from: string, to: string, manual: string): number {
  if (manual) return Number(manual);
  if (!carId || !from || !to) return 0;
  const car = fleet.find(c => c.id === carId);
  if (!car) return 0;
  const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
  return car.pricePerDay * days;
}

/* ── Detail Drawer ── */
function DetailDrawer({ rental, onClose, onReturn }: {
  rental: DashboardRental;
  onClose: () => void;
  onReturn: (id: string) => void;
}) {
  const isOverdue = rental.status === "overdue";
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className={`flex items-start justify-between px-7 py-6 border-b flex-shrink-0 ${isOverdue ? "bg-red-50 border-red-100" : "border-slate-100"}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge s={rental.status} />
              <span className="text-[11px] text-slate-400 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full font-medium">Walk-in</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#1a2332] font-mono">{rental.reference}</h3>
            <p className="text-[12px] text-slate-500 mt-1 font-medium">{rental.client}</p>
            {isOverdue && (
              <p className="text-[11.5px] text-red-600 font-semibold mt-1.5">⚠ Vehicle overdue — contact client immediately</p>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/80 text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Client</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: "Name",    value: rental.client        },
                { label: "Phone",   value: rental.clientPhone   },
                { label: "License", value: rental.driverLicense },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Rental Details</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: "Vehicle",  value: `${rental.car} (${rental.plate})` },
                { label: "Pickup",   value: fmt(rental.startDate)              },
                { label: "Return",   value: fmt(rental.endDate)                },
                { label: "Location", value: rental.pickupLocation              },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Payment</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">Total price</span>
                <span className="text-[15px] text-[#1a2332] font-bold">${rental.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">Deposit</span>
                <span className="text-[12.5px] text-slate-700 font-semibold">${rental.deposit}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 px-7 py-5 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          {(rental.status === "active" || rental.status === "overdue") && (
            <button onClick={() => { onReturn(rental.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12.5px] font-semibold hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="h-4 w-4" /> Mark Returned
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-200 transition-colors">
            <Printer className="h-4 w-4" /> Print Agreement
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── New Walk-in Modal ── */
function NewRentalModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (r: DashboardRental) => void;
}) {
  const [form, setForm]     = useState<FormState>(BLANK);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (k: keyof FormState, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const total = calcTotal(form.carId, form.pickupDate, form.returnDate, form.dailyPrice);
  const selectedCar = fleet.find(c => c.id === form.carId);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.clientName.trim()) e.clientName = "Required";
    if (!form.phone.trim())      e.phone = "Required";
    if (!form.carId)             e.carId = "Select a car";
    if (!form.pickupDate)        e.pickupDate = "Required";
    if (!form.returnDate)        e.returnDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date();
    onSave({
      id: `wi-${Date.now()}`,
      reference: `RNT-${now.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      client: form.clientName.trim(),
      clientPhone: form.phone.trim(),
      car: selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "",
      plate: selectedCar?.plate ?? "",
      startDate: form.pickupDate,
      endDate: form.returnDate,
      totalPrice: total,
      deposit: Number(form.deposit) || 0,
      status: "active",
      source: "walk-in",
      pickupLocation: "Counter",
      driverLicense: form.licenseNumber.trim() || "N/A",
    });
    onClose();
  };

  const inp = (k: keyof FormState) =>
    `w-full rounded-xl border px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition placeholder-slate-400 ${
      errors[k] ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white"
    }`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a2332]">New Walk-in Rental</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">Create a counter rental for a walk-in client</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

            {/* Client info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Client Information</p>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input className={inp("clientName")} placeholder="e.g. Ahmed Benali" value={form.clientName} onChange={e => set("clientName", e.target.value)} />
                  {errors.clientName && <p className="text-[11px] text-red-500 mt-1">{errors.clientName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                    <input className={inp("phone")} placeholder="0661 xxx xxx" value={form.phone} onChange={e => set("phone", e.target.value)} />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">License / ID</label>
                    <input className={inp("licenseNumber")} placeholder="DL-31-xxxx" value={form.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Dates */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Vehicle & Dates</p>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Select Car <span className="text-red-400">*</span></label>
                  <select className={inp("carId")} value={form.carId} onChange={e => {
                    const car = fleet.find(c => c.id === e.target.value);
                    set("carId", e.target.value);
                    if (car) set("dailyPrice", String(car.pricePerDay));
                  }}>
                    <option value="">— Choose a vehicle —</option>
                    {availableCars.map(c => (
                      <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plate}) — ${c.pricePerDay}/day</option>
                    ))}
                  </select>
                  {errors.carId && <p className="text-[11px] text-red-500 mt-1">{errors.carId}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Pickup Date <span className="text-red-400">*</span></label>
                    <input type="date" className={inp("pickupDate")} value={form.pickupDate} onChange={e => set("pickupDate", e.target.value)} />
                    {errors.pickupDate && <p className="text-[11px] text-red-500 mt-1">{errors.pickupDate}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Return Date <span className="text-red-400">*</span></label>
                    <input type="date" className={inp("returnDate")} value={form.returnDate} onChange={e => set("returnDate", e.target.value)} />
                    {errors.returnDate && <p className="text-[11px] text-red-500 mt-1">{errors.returnDate}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pricing</p>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Daily Rate ($)</label>
                  <input type="number" className={inp("dailyPrice")} placeholder="Auto from car" value={form.dailyPrice} onChange={e => set("dailyPrice", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Deposit ($)</label>
                  <input type="number" className={inp("deposit")} placeholder="0" value={form.deposit} onChange={e => set("deposit", e.target.value)} />
                </div>
              </div>
              {total > 0 && (
                <div className="mt-4 flex items-center justify-between px-5 py-3.5 bg-[#1a2332]/5 border border-[#1a2332]/10 rounded-xl">
                  <span className="text-[12.5px] text-[#1a2332] font-semibold">Estimated Total</span>
                  <span className="text-[18px] font-bold text-[#1a2332]">${total}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notes</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                placeholder="Special instructions or notes…"
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button onClick={handleSave}
              className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm">
              Save Rental
            </button>
            <button onClick={onClose}
              className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13.5px] font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main ── */
export function OfflineRentals({ search = "" }: { search?: string }) {
  const [local, setLocal]         = useState<DashboardRental[]>(walkInRentals);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected]   = useState<DashboardRental | null>(null);

  const markReturned = (id: string) =>
    setLocal(prev => prev.map(r => r.id === id ? { ...r, status: "completed" as RentalStatus } : r));

  const addRental = (r: DashboardRental) => setLocal(prev => [r, ...prev]);

  const filtered = local.filter(r =>
    !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="px-6 sm:px-8 py-6 space-y-4">

      {/* Table header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-slate-500">
          {local.length} walk-in rental{local.length !== 1 ? "s" : ""}
          <span className="ml-2 text-slate-400 font-normal">·</span>
          <span className="ml-2 text-emerald-600 font-semibold">{local.filter(r => r.status === "active").length} active</span>
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-5 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> New Walk-in Rental
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Reference", "Client", "Vehicle", "Dates", "Total", "Deposit", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-[14px] text-slate-400 font-medium">No walk-in rentals found</p>
                  </td>
                </tr>
              )}
              {filtered.map(r => {
                const isOverdue = r.status === "overdue";
                return (
                  <tr key={r.id}
                    onClick={() => setSelected(r)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors group ${isOverdue ? "bg-red-50/20" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-mono font-semibold text-slate-600">{r.reference}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-800">{r.client}</p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">{r.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-700">{r.car}</p>
                      <p className="text-[11.5px] font-mono text-slate-400 mt-0.5">{r.plate}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-[12.5px] font-medium text-slate-700">{fmt(r.startDate)}</p>
                      <p className={`text-[11.5px] mt-0.5 font-medium ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                        → {fmt(r.endDate)}{isOverdue ? " ⚠" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-bold text-slate-800">${r.totalPrice}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12.5px] text-slate-600">${r.deposit}</p>
                    </td>
                    <td className="px-5 py-4"><Badge s={r.status} /></td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(r)} title="View"
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {(r.status === "active" || r.status === "overdue") && (
                          <button onClick={() => markReturned(r.id)} title="Mark returned"
                            className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button title="Extend"
                          className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors">
                          <CalendarPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[11.5px] text-slate-400 font-medium">Showing {filtered.length} of {local.length} walk-in rentals</span>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          rental={local.find(r => r.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onReturn={markReturned}
        />
      )}
      {showModal && <NewRentalModal onClose={() => setShowModal(false)} onSave={addRental} />}
    </div>
  );
}
