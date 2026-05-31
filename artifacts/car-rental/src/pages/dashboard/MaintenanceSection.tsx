import { useState } from "react";
import { Plus, X, Wrench, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { maintenance as allMaintenance, MaintenanceItem, MaintenanceStatus } from "@/data/dashboardData";

const FILTERS: { label: string; value: MaintenanceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Due Soon", value: "due-soon" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

function statusBadge(status: MaintenanceStatus) {
  const s: Record<MaintenanceStatus, { cls: string; icon: React.ElementType }> = {
    "due-soon": { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    "in-progress": { cls: "bg-blue-50 text-blue-700 border-blue-200", icon: Wrench },
    "completed": { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  };
  const { cls, icon: Icon } = s[status];
  const label = status === "due-soon" ? "Due Soon" : status === "in-progress" ? "In Progress" : "Completed";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

const BLANK = { car: "", plate: "", type: "", scheduledDate: "", garage: "", notes: "", estimatedCost: "" };

export function MaintenanceSection() {
  const [items, setItems] = useState<MaintenanceItem[]>(allMaintenance);
  const [filter, setFilter] = useState<MaintenanceStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<MaintenanceItem | null>(null);
  const [form, setForm] = useState(BLANK);

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const filtered = filter === "all" ? items : items.filter(m => m.status === filter);

  const counts: Record<string, number> = {
    all: items.length,
    "due-soon": items.filter(m => m.status === "due-soon").length,
    "in-progress": items.filter(m => m.status === "in-progress").length,
    "completed": items.filter(m => m.status === "completed").length,
  };

  const markDone = (id: string) => {
    setItems(p => p.map(m => m.id === id ? { ...m, status: "completed", completedDate: new Date().toISOString().split("T")[0] } : m));
    if (selected?.id === id) setSelected(p => p ? { ...p, status: "completed" } : null);
  };

  const handleCreate = () => {
    if (!form.car || !form.type || !form.scheduledDate) return;
    setItems(p => [{
      id: `m-new-${Date.now()}`, car: form.car, plate: form.plate, type: form.type,
      status: "due-soon", scheduledDate: form.scheduledDate, notes: form.notes,
      mileage: 0, garage: form.garage, estimatedCost: parseInt(form.estimatedCost) || 0,
    }, ...p]);
    setForm(BLANK);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Maintenance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Service queue and scheduled maintenance</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Schedule Service
        </button>
      </div>

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
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === value ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"}`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`bg-white border rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${
              item.status === "due-soon" ? "border-amber-200" :
              item.status === "in-progress" ? "border-blue-200" : "border-slate-200"
            }`}
            onClick={() => setSelected(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.status === "due-soon" ? "bg-amber-50" :
                  item.status === "in-progress" ? "bg-blue-50" : "bg-emerald-50"
                }`}>
                  <Wrench className={`h-4 w-4 ${
                    item.status === "due-soon" ? "text-amber-600" :
                    item.status === "in-progress" ? "text-blue-600" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.car}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.plate}</p>
                </div>
              </div>
              {statusBadge(item.status)}
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-2">{item.type}</p>
            <div className="space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span>Scheduled</span>
                <span className="font-semibold text-slate-700">{item.scheduledDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Garage</span>
                <span className="font-semibold text-slate-600 text-right max-w-[60%] truncate">{item.garage || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Est. Cost</span>
                <span className="font-semibold text-accent">${item.estimatedCost}</span>
              </div>
            </div>
            {item.notes && (
              <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100 line-clamp-2">{item.notes}</p>
            )}
            {item.status !== "completed" && (
              <button
                onClick={e => { e.stopPropagation(); markDone(item.id); }}
                className="mt-3 w-full h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-3 w-3" /> Mark Completed
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
            No maintenance items for this filter
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Schedule Maintenance</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Vehicle Name *", key: "car", placeholder: "e.g. Dacia Duster" },
                { label: "Plate Number", key: "plate", placeholder: "e.g. DAD-213-31" },
                { label: "Type of Service *", key: "type", placeholder: "e.g. Oil Change" },
                { label: "Scheduled Date *", key: "scheduledDate", placeholder: "", type: "date" },
                { label: "Garage / Workshop", key: "garage", placeholder: "Garage name and city" },
                { label: "Estimated Cost ($)", key: "estimatedCost", placeholder: "0", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
                  <input type={type || "text"} value={(form as any)[key]} onChange={e => setF(key, e.target.value)} placeholder={placeholder} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setF("notes", e.target.value)} placeholder="Details about the service..." rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={!form.car || !form.type || !form.scheduledDate} className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Maintenance Detail</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>{statusBadge(selected.status)}</div>
              <div className="space-y-2.5">
                {[
                  { label: "Vehicle", value: selected.car },
                  { label: "Plate", value: selected.plate },
                  { label: "Service Type", value: selected.type },
                  { label: "Scheduled", value: selected.scheduledDate },
                  { label: "Completed", value: selected.completedDate || "Pending" },
                  { label: "Mileage", value: `${selected.mileage.toLocaleString()} km` },
                  { label: "Garage", value: selected.garage },
                  { label: "Est. Cost", value: `$${selected.estimatedCost}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-xs font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-xs text-slate-600">{selected.notes}</p>
                </div>
              )}
              {selected.status !== "completed" && (
                <button onClick={() => { markDone(selected.id); setSelected(null); }} className="w-full h-9 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
