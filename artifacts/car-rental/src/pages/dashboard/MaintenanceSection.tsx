import { useState, useRef, useEffect } from "react";
import {
  Plus, X, Wrench, CheckCircle2, AlertTriangle,
  Search, Edit2, ChevronDown, Car,
} from "lucide-react";
import {
  maintenance as allMaintenance, MaintenanceItem, MaintenanceStatus,
  fleet,
} from "@/data/dashboardData";
import { useT } from "@/data/localStore";

const SERVICE_PRESETS = [
  "Oil change", "Oil + filter change", "Filter change", "Tire check",
  "Tire rotation & alignment", "Brake check", "General inspection",
  "Engine service", "Battery check", "AC service", "Other",
];

const FLEET_STATUS_BADGE: Record<string, string> = {
  available:   "bg-emerald-50 text-emerald-700",
  reserved:    "bg-indigo-50 text-indigo-700",
  rented:      "bg-amber-50 text-amber-700",
  maintenance: "bg-red-50 text-red-700",
};

interface MForm {
  carId: string; car: string; plate: string; carImage: string;
  servicePreset: string; customService: string;
  scheduledDate: string; nextServiceDate: string;
  garage: string; estimatedCost: string; notes: string;
  status: MaintenanceStatus;
}

const BLANK: MForm = {
  carId: "", car: "", plate: "", carImage: "",
  servicePreset: "", customService: "",
  scheduledDate: "", nextServiceDate: "",
  garage: "", estimatedCost: "", notes: "",
  status: "due-soon",
};

interface CarOption { id: string; name: string; plate: string; image: string; status: string; }

function CarSelector({ value, onChange }: { value: CarOption | null; onChange: (car: CarOption) => void }) {
  const t = useT();
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const FLEET_STATUS_LABEL: Record<string, string> = {
    available:   t("status.available"),
    reserved:    t("status.reserved"),
    rented:      t("status.rented"),
    maintenance: t("status.inService"),
  };

  const options = fleet.filter(c => {
    const q = search.toLowerCase();
    return `${c.brand} ${c.model}`.toLowerCase().includes(q) || c.plate.toLowerCase().includes(q);
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center gap-3 h-11 px-3.5 border rounded-xl transition-all text-left bg-white ${
          open ? "border-violet-400 ring-2 ring-violet-500/20" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {value?.name ? (
          <>
            {value.image ? (
              <img src={value.image} alt="" className="w-10 h-7 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Car className="h-4 w-4 text-slate-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-700 truncate">{value.name}</p>
              <p className="text-[10.5px] text-slate-400 font-mono leading-tight">{value.plate}</p>
            </div>
            {value.status && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${FLEET_STATUS_BADGE[value.status] ?? "bg-slate-100 text-slate-500"}`}>
                {FLEET_STATUS_LABEL[value.status] ?? value.status}
              </span>
            )}
          </>
        ) : (
          <span className="text-[13px] text-slate-400 flex-1">{t("maintenance.selectVehicle")}</span>
        )}
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-xl">
              <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("maintenance.searchVehicle")}
                className="flex-1 text-[12px] bg-transparent text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {options.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[12px] text-slate-400">{t("maintenance.noVehicles")}</p>
              </div>
            ) : (
              <div className="p-1.5 space-y-0.5">
                {options.map(car => (
                  <button
                    key={car.id}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      onChange({ id: car.id, name: `${car.brand} ${car.model}`, plate: car.plate, image: car.image || "", status: car.status });
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {car.image ? (
                        <img src={car.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-slate-700 truncate">{car.brand} {car.model}</p>
                      <p className="text-[10.5px] text-slate-400 font-mono">{car.plate}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${FLEET_STATUS_BADGE[car.status] ?? "bg-slate-100 text-slate-500"}`}>
                      {FLEET_STATUS_LABEL[car.status] ?? car.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MaintenanceModal({ isEdit, form, setForm, onSave, onClose }: {
  isEdit?: boolean;
  form: MForm; setForm: React.Dispatch<React.SetStateAction<MForm>>;
  onSave: () => void; onClose: () => void;
}) {
  const t = useT();

  const STATUS_CFG_LABELS: Record<MaintenanceStatus, string> = {
    "due-soon":    t("status.dueSoon"),
    "in-progress": t("status.inProgress"),
    "completed":   t("status.completed"),
  };

  const inp = "w-full h-10 px-3.5 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white";
  const sel = "w-full h-10 px-3.5 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white";
  const lbl = "text-[12px] font-semibold text-slate-600 block mb-1.5";
  const sec = "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block";
  const set = (k: keyof MForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedCar: CarOption | null = form.car
    ? { id: form.carId, name: form.car, plate: form.plate, image: form.carImage, status: "" }
    : null;

  const serviceType = form.servicePreset === "Other" ? form.customService : form.servicePreset;
  const canSave = !!form.car && !!serviceType && !!form.scheduledDate;

  const title    = isEdit ? t("maintenance.editTitle")    : t("maintenance.addTitle");
  const subtitle = isEdit ? t("maintenance.editSub")      : t("maintenance.addSub");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a2332]">{title}</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <span className={sec}>{t("table.vehicle")}</span>
            <label className={lbl}>{t("maintenance.selectVehicle")}</label>
            <CarSelector
              value={selectedCar}
              onChange={c => setForm(p => ({ ...p, carId: c.id, car: c.name, plate: c.plate, carImage: c.image }))}
            />
            {form.plate && (
              <p className="text-[11px] text-slate-400 mt-1.5 font-mono">{t("maintenance.plate")}: {form.plate}</p>
            )}
          </div>

          <div>
            <span className={sec}>{t("maintenance.serviceType")}</span>
            <div className="space-y-3">
              <div>
                <label className={lbl}>{t("maintenance.selectPreset")}</label>
                <select className={sel} value={form.servicePreset} onChange={e => set("servicePreset", e.target.value)}>
                  <option value="">{t("misc.chooseService")}</option>
                  {SERVICE_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {form.servicePreset === "Other" && (
                <div>
                  <label className={lbl}>{t("maintenance.customService")}</label>
                  <input
                    className={inp}
                    value={form.customService}
                    onChange={e => set("customService", e.target.value)}
                    placeholder={t("misc.describeService")}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <span className={sec}>{t("maintenance.dates")}</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("maintenance.serviceDate")}</label>
                <input type="date" className={inp} value={form.scheduledDate} onChange={e => set("scheduledDate", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>{t("maintenance.nextServiceDate")}</label>
                <input type="date" className={inp} value={form.nextServiceDate} onChange={e => set("nextServiceDate", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <span className={sec}>{t("maintenance.details")}</span>
            <div className="space-y-3">
              {isEdit && (
                <div>
                  <label className={lbl}>{t("form.status")}</label>
                  <select className={sel} value={form.status} onChange={e => set("status", e.target.value as MaintenanceStatus)}>
                    {(["due-soon", "in-progress", "completed"] as MaintenanceStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_CFG_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={lbl}>{t("maintenance.garage")}</label>
                <input className={inp} value={form.garage} onChange={e => set("garage", e.target.value)} placeholder={t("misc.garageCity")} />
              </div>
              <div>
                <label className={lbl}>{t("maintenance.estimatedCost")}</label>
                <input type="number" min="0" className={inp} value={form.estimatedCost} onChange={e => set("estimatedCost", e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className={lbl}>{t("maintenance.notes")}</label>
                <textarea
                  value={form.notes}
                  onChange={e => set("notes", e.target.value)}
                  placeholder={t("misc.detailsAboutService")}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onSave}
            disabled={!canSave}
            className="flex-1 h-10 rounded-xl bg-[#1a2332] text-white text-[13px] font-semibold hover:bg-[#243044] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isEdit ? t("action.saveChanges") : t("maintenance.scheduleService")}
          </button>
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t("action.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MaintenanceSection() {
  const t = useT();
  const [items, setItems]       = useState<MaintenanceItem[]>(allMaintenance);
  const [filter, setFilter]     = useState<MaintenanceStatus | "all">("all");
  const [showAdd, setShowAdd]   = useState(false);
  const [editItem, setEditItem] = useState<MaintenanceItem | null>(null);
  const [form, setForm]         = useState<MForm>(BLANK);

  const FILTERS: { label: string; value: MaintenanceStatus | "all" }[] = [
    { label: t("filter.all"),        value: "all"          },
    { label: t("filter.dueSoon"),    value: "due-soon"     },
    { label: t("filter.inProgress"), value: "in-progress"  },
    { label: t("filter.completed"),  value: "completed"    },
  ];

  const STATUS_CFG: Record<MaintenanceStatus, { label: string; cls: string; icon: React.ElementType; dot: string; card: string }> = {
    "due-soon":    { label: t("status.dueSoon"),    cls: "bg-amber-50 text-amber-700 border-amber-200",        icon: AlertTriangle, dot: "bg-amber-400",   card: "border-amber-200"  },
    "in-progress": { label: t("status.inProgress"), cls: "bg-blue-50 text-blue-700 border-blue-200",          icon: Wrench,        dot: "bg-blue-500",    card: "border-blue-200"   },
    "completed":   { label: t("status.completed"),  cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2,  dot: "bg-emerald-500", card: "border-slate-200"  },
  };

  const filtered = filter === "all" ? items : items.filter(m => m.status === filter);
  const counts: Record<string, number> = {
    all: items.length,
    "due-soon":    items.filter(m => m.status === "due-soon").length,
    "in-progress": items.filter(m => m.status === "in-progress").length,
    "completed":   items.filter(m => m.status === "completed").length,
  };

  const openAdd = () => { setForm(BLANK); setShowAdd(true); };
  const openEdit = (item: MaintenanceItem) => {
    const presetMatch = SERVICE_PRESETS.find(p => p !== "Other" && p === item.type);
    const preset = presetMatch ?? "Other";
    const matchedCar = fleet.find(c => `${c.brand} ${c.model}` === item.car || c.plate === item.plate);
    setForm({
      carId: matchedCar?.id ?? "", car: item.car, plate: item.plate, carImage: matchedCar?.image ?? "",
      servicePreset: preset, customService: preset === "Other" ? item.type : "",
      scheduledDate: item.scheduledDate, nextServiceDate: item.nextServiceDate ?? "",
      garage: item.garage ?? "", estimatedCost: item.estimatedCost ? String(item.estimatedCost) : "",
      notes: item.notes ?? "", status: item.status,
    });
    setEditItem(item);
  };

  const handleCreate = () => {
    const serviceType = form.servicePreset === "Other" ? form.customService : form.servicePreset;
    if (!form.car || !serviceType || !form.scheduledDate) return;
    setItems(p => [{
      id: `m-${Date.now()}`, car: form.car, plate: form.plate, type: serviceType, status: "due-soon",
      scheduledDate: form.scheduledDate, nextServiceDate: form.nextServiceDate || undefined,
      notes: form.notes, mileage: 0, garage: form.garage,
      estimatedCost: parseFloat(form.estimatedCost) || 0,
    }, ...p]);
    setShowAdd(false); setForm(BLANK);
  };

  const handleEdit = () => {
    if (!editItem) return;
    const serviceType = form.servicePreset === "Other" ? form.customService : form.servicePreset;
    if (!form.car || !serviceType || !form.scheduledDate) return;
    setItems(p => p.map(m => {
      if (m.id !== editItem.id) return m;
      return {
        ...m, car: form.car, plate: form.plate, type: serviceType,
        scheduledDate: form.scheduledDate, nextServiceDate: form.nextServiceDate || undefined,
        garage: form.garage, notes: form.notes, estimatedCost: parseFloat(form.estimatedCost) || 0,
        status: form.status,
        completedDate: form.status === "completed" && !m.completedDate ? new Date().toISOString().split("T")[0] : m.completedDate,
      };
    }));
    setEditItem(null); setForm(BLANK);
  };

  return (
    <div className="px-6 sm:px-8 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#1a2332]">{t("maintenance.title")}</h2>
          <p className="text-[12.5px] text-slate-400 mt-0.5">{t("maintenance.sub")}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1a2332] text-white text-[12.5px] font-semibold hover:bg-[#243044] transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> {t("maintenance.scheduleService")}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            onMouseDown={e => e.preventDefault()}
            className={`h-9 px-3.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
              filter === value
                ? "bg-[#1a2332] text-white border-[#1a2332] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const cfg  = STATUS_CFG[item.status];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className={`bg-white border-2 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${cfg.card}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.status === "due-soon" ? "bg-amber-50" : item.status === "in-progress" ? "bg-blue-50" : "bg-emerald-50"
                  }`}>
                    <Icon className={`h-4 w-4 ${item.status === "due-soon" ? "text-amber-600" : item.status === "in-progress" ? "text-blue-600" : "text-emerald-600"}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{item.car}</p>
                    <p className="text-[10.5px] text-slate-400 font-mono">{item.plate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    onMouseDown={e => e.preventDefault()}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" /> {t("action.edit")}
                  </button>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${cfg.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
              </div>

              <p className="text-[13.5px] font-semibold text-slate-700 mb-3">{item.type}</p>

              <div className="space-y-1.5 text-[11.5px] mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t("maintenance.scheduled")}</span>
                  <span className="font-semibold text-slate-700">{item.scheduledDate}</span>
                </div>
                {item.completedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("maintenance.completedDate")}</span>
                    <span className="font-semibold text-slate-700">{item.completedDate}</span>
                  </div>
                )}
                {item.garage && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("maintenance.garage")}</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[60%] text-right">{item.garage}</span>
                  </div>
                )}
                {item.estimatedCost !== undefined && item.estimatedCost > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("maintenance.estimatedCost")}</span>
                    <span className="font-semibold text-slate-700">${item.estimatedCost}</span>
                  </div>
                )}
              </div>

              {item.notes && (
                <p className="text-[11px] text-slate-400 italic border-t border-slate-100 pt-2 mt-2 line-clamp-2">{item.notes}</p>
              )}

              {item.status !== "completed" && (
                <button
                  onClick={() => setItems(p => p.map(m =>
                    m.id === item.id ? { ...m, status: "completed", completedDate: new Date().toISOString().split("T")[0] } : m
                  ))}
                  className="mt-3 w-full h-8 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> {t("status.completed")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showAdd && (
        <MaintenanceModal
          form={form} setForm={setForm}
          onSave={handleCreate}
          onClose={() => { setShowAdd(false); setForm(BLANK); }}
        />
      )}
      {editItem && (
        <MaintenanceModal
          isEdit
          form={form} setForm={setForm}
          onSave={handleEdit}
          onClose={() => { setEditItem(null); setForm(BLANK); }}
        />
      )}
    </div>
  );
}
