import { useState } from "react";
import { Plus, X, Wrench, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { maintenance as allMaintenance, MaintenanceItem, MaintenanceStatus } from "@/data/dashboardData";

const FILTERS: { label: string; value: MaintenanceStatus | "all" }[] = [
  { label: "All",         value: "all"         },
  { label: "Due Soon",    value: "due-soon"     },
  { label: "In Progress", value: "in-progress"  },
  { label: "Completed",   value: "completed"    },
];

const STATUS_CFG: Record<MaintenanceStatus, { label: string; cls: string; icon: React.ElementType; dot: string }> = {
  "due-soon":    { label: "Due Soon",    cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: AlertTriangle, dot: "bg-amber-400"  },
  "in-progress": { label: "In Progress", cls: "bg-blue-50 text-blue-700 border-blue-200",    icon: Wrench,        dot: "bg-blue-500"   },
  "completed":   { label: "Completed",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, dot: "bg-emerald-500" },
};

const BLANK = { car: "", plate: "", type: "", scheduledDate: "", garage: "", notes: "", estimatedCost: "" };

export function MaintenanceSection() {
  const [items, setItems] = useState<MaintenanceItem[]>(allMaintenance);
  const [filter, setFilter] = useState<MaintenanceStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const filtered = filter === "all" ? items : items.filter(m => m.status === filter);

  const counts: Record<string, number> = {
    all:           items.length,
    "due-soon":    items.filter(m => m.status === "due-soon").length,
    "in-progress": items.filter(m => m.status === "in-progress").length,
    "completed":   items.filter(m => m.status === "completed").length,
  };

  const markDone = (id: string) => {
    setItems(p => p.map(m =>
      m.id === id ? { ...m, status: "completed" as MaintenanceStatus, completedDate: new Date().toISOString().split("T")[0] } : m
    ));
  };

  const handleCreate = () => {
    if (!form.car || !form.type || !form.scheduledDate) return;
    setItems(p => [{
      id: `m-${Date.now()}`, car: form.car, plate: form.plate, type: form.type,
      status: "due-soon" as MaintenanceStatus, scheduledDate: form.scheduledDate,
      notes: form.notes, mileage: 0, garage: form.garage,
      estimatedCost: parseInt(form.estimatedCost) || 0,
    }, ...p]);
    setForm(BLANK);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#1a2332]">Maintenance</h2>
          <p className="text-[12.5px] text-slate-400 mt-0.5">Service queue and scheduled work</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1a2332] text-white text-[12.5px] font-semibold hover:bg-[#243044] transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Schedule Service
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`h-9 px-3.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
              filter === value
                ? "bg-[#1a2332] text-white border-[#1a2332] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              filter === value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const cfg = STATUS_CFG[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${
                item.status === "due-soon"    ? "border-amber-200" :
                item.status === "in-progress" ? "border-blue-200"  : "border-slate-200"
              }`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.status === "due-soon"    ? "bg-amber-50"  :
                    item.status === "in-progress" ? "bg-blue-50"   : "bg-emerald-50"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      item.status === "due-soon"    ? "text-amber-600"  :
                      item.status === "in-progress" ? "text-blue-600"   : "text-emerald-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{item.car}</p>
                    <p className="text-[10.5px] text-slate-400 font-mono">{item.plate}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border flex-shrink-0 ${cfg.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Service type */}
              <p className="text-[13.5px] font-semibold text-slate-700 mb-3">{item.type}</p>

              {/* Details */}
              <div className="space-y-1.5 text-[11.5px] mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Scheduled</span>
                  <span className="font-semibold text-slate-700">{item.scheduledDate}</span>
                </div>
                {item.completedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Completed</span>
                    <span className="font-semibold text-emerald-600">{item.completedDate}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Garage</span>
                  <span className="font-semibold text-slate-600 text-right max-w-[60%] truncate">{item.garage || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Est. Cost</span>
                  <span className="font-bold text-slate-800">${item.estimatedCost}</span>
                </div>
              </div>

              {item.notes && (
                <p className="text-[11px] text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mb-3 line-clamp-2">
                  {item.notes}
                </p>
              )}

              {item.status !== "completed" && (
                <button
                  onClick={() => markDone(item.id)}
                  className="w-full h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11.5px] font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                </button>
              )}
              {item.status === "completed" && (
                <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-emerald-600 font-semibold py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Service completed
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm">
            <Wrench className="h-8 w-8 text-slate-200 mx-auto mb-3" />
            <p className="text-[13px] font-semibold text-slate-400">No maintenance items</p>
            <p className="text-[12px] text-slate-300 mt-1">
              {filter !== "all" ? "Try a different filter" : "Schedule a new service"}
            </p>
          </div>
        )}
      </div>

      {/* Schedule Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a2332]">Schedule Service</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">Add a maintenance job to the queue</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Vehicle Name *",      key: "car",           placeholder: "e.g. Dacia Duster"         },
                { label: "Plate Number",         key: "plate",         placeholder: "e.g. DAD-213-31"          },
                { label: "Type of Service *",    key: "type",          placeholder: "e.g. Oil Change"          },
                { label: "Scheduled Date *",     key: "scheduledDate", placeholder: "",          type: "date"   },
                { label: "Garage / Workshop",    key: "garage",        placeholder: "Garage name and city"     },
                { label: "Estimated Cost ($)",   key: "estimatedCost", placeholder: "0",         type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1.5">{label}</label>
                  <input
                    type={type || "text"}
                    value={(form as Record<string, string>)[key]}
                    onChange={e => setF(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                  />
                </div>
              ))}
              <div>
                <label className="text-[12px] font-semibold text-slate-600 block mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setF("notes", e.target.value)}
                  placeholder="Details about the service..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCreate}
                  disabled={!form.car || !form.type || !form.scheduledDate}
                  className="flex-1 h-10 rounded-xl bg-[#1a2332] text-white text-[13px] font-semibold hover:bg-[#243044] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Schedule
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="h-10 px-5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
