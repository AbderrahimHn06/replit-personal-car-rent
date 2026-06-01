import { useState, useMemo, useEffect } from "react";
import {
  X, User, Car, Calendar, Clock, MapPin, DollarSign,
  FileText, CheckCircle2, Search,
} from "lucide-react";
import { fleet, FleetCar, DashboardRental, DashboardClient } from "@/data/dashboardData";
import { useActiveLocations, useClients, addClientToStore } from "@/data/localStore";

/* ─── Types ─────────────────────────────────────────────────────── */
export interface RentalCreationProps {
  prefilledCar?: FleetCar;
  prefilledPickupDate?: string;
  prefilledPickupTime?: string;
  prefilledReturnDate?: string;
  prefilledReturnTime?: string;
  prefilledPickupLoc?: string;
  prefilledReturnLoc?: string;
  onClose: () => void;
  onCreated: (rental: DashboardRental) => void;
}

function fmtShort(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ─── Car Picker ────────────────────────────────────────────────── */
function CarPicker({ selected, onSelect }: {
  selected: FleetCar | null;
  onSelect: (car: FleetCar) => void;
}) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(!selected);

  const availableCars = useMemo(() =>
    fleet.filter(c => c.status === "available" || c.status === "reserved").filter(c => {
      if (!search) return true;
      return [c.brand, c.model, c.plate, c.type].some(v => v.toLowerCase().includes(search.toLowerCase()));
    }), [search]);

  if (selected && !expanded) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
        <img src={selected.image} alt={selected.brand} className="w-16 h-11 object-cover rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#1a2332]">{selected.brand} {selected.model}</p>
          <p className="text-[11.5px] text-slate-400 font-mono">{selected.plate} · {selected.year} · {selected.color}</p>
          <p className="text-[11px] text-slate-500">{selected.transmission} · {selected.fuel} · {selected.seats} seats</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[18px] font-bold text-[#1a2332]">${selected.pricePerDay}</p>
          <p className="text-[10.5px] text-slate-400">/day</p>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="flex-shrink-0 h-8 px-3 rounded-xl border border-slate-200 text-[11.5px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition"
          placeholder="Search brand, model, plate…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {availableCars.length === 0 ? (
        <p className="text-center py-6 text-[13px] text-slate-400">No available cars match your search</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {availableCars.map(car => (
            <div
              key={car.id}
              onClick={() => { onSelect(car); setExpanded(false); }}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:border-violet-300 hover:bg-violet-50/40 ${selected?.id === car.id ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white"}`}
            >
              <img src={car.image} alt={car.brand} className="w-14 h-10 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1a2332]">{car.brand} {car.model}</p>
                <p className="text-[11px] text-slate-400 font-mono">{car.plate} · {car.type}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[14px] font-bold text-[#1a2332]">${car.pricePerDay}</p>
                <p className="text-[10px] text-slate-400">/day</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── New Client Mini Form ──────────────────────────────────────── */
interface MiniClientForm { name: string; phone: string; city: string; licenseNumber: string; email: string; }

function NewClientMiniForm({ onCreated }: { onCreated: (c: DashboardClient) => void }) {
  const [f, setF] = useState<MiniClientForm>({ name: "", phone: "", city: "", licenseNumber: "", email: "" });
  const set = (k: keyof MiniClientForm, v: string) => setF(p => ({ ...p, [k]: v }));
  const inp = "w-full h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";

  function handleCreate() {
    if (!f.name.trim() || !f.phone.trim()) return;
    const newClient: DashboardClient = {
      id: `cl-${Date.now()}`,
      name: f.name.trim(),
      phone: f.phone.trim(),
      whatsapp: f.phone.trim(),
      email: f.email,
      city: f.city,
      address: "",
      nationality: "Algerian",
      dateOfBirth: "",
      licenseNumber: f.licenseNumber,
      licenseExpiry: "",
      idNumber: "",
      source: "walk-in",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      totalRentals: 0,
      activeRentals: 0,
      completedRentals: 0,
      cancelledRentals: 0,
      totalSpend: 0,
      depositHeld: 0,
      trustScore: 75,
      internalNotes: "",
      warningNotes: "",
    };
    addClientToStore(newClient);
    onCreated(newClient);
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Client Details</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">Full Name *</label>
          <input className={inp} placeholder="e.g. Ahmed Benali" value={f.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">Phone *</label>
          <input className={inp} placeholder="0661 xxx xxx" value={f.phone} onChange={e => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">City</label>
          <input className={inp} placeholder="Oran" value={f.city} onChange={e => set("city", e.target.value)} />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">License Number</label>
          <input className={inp} placeholder="DL-31-xxxx" value={f.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">Email</label>
          <input className={inp} placeholder="email@example.com" value={f.email} onChange={e => set("email", e.target.value)} />
        </div>
      </div>
      <button
        onClick={handleCreate}
        disabled={!f.name.trim() || !f.phone.trim()}
        className="w-full h-9 bg-[#1a2332] text-white rounded-xl text-[12.5px] font-semibold hover:bg-[#243044] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Create & Select Client
      </button>
    </div>
  );
}

/* ─── Section label helper ──────────────────────────────────────── */
function SecLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</p>
    </div>
  );
}

/* ─── Main RentalCreationModal ──────────────────────────────────── */
export function RentalCreationModal({
  prefilledCar,
  prefilledPickupDate = "",
  prefilledPickupTime = "09:00",
  prefilledReturnDate = "",
  prefilledReturnTime = "17:00",
  prefilledPickupLoc = "",
  prefilledReturnLoc = "",
  onClose,
  onCreated,
}: RentalCreationProps) {
  const locations   = useActiveLocations();
  const allClients  = useClients();

  const [selectedCar,    setSelectedCar]    = useState<FleetCar | null>(prefilledCar ?? null);
  const [pickupDate,     setPickupDate]     = useState(prefilledPickupDate);
  const [pickupTime,     setPickupTime]     = useState(prefilledPickupTime);
  const [returnDate,     setReturnDate]     = useState(prefilledReturnDate);
  const [returnTime,     setReturnTime]     = useState(prefilledReturnTime);
  const [pickupLoc,      setPickupLoc]      = useState(prefilledPickupLoc);
  const [returnLoc,      setReturnLoc]      = useState(prefilledReturnLoc);
  const [clientMode,     setClientMode]     = useState<"existing" | "new">("existing");
  const [selectedClient, setSelectedClient] = useState<DashboardClient | null>(null);
  const [deposit,        setDeposit]        = useState(prefilledCar?.depositAmount ? String(prefilledCar.depositAmount) : "");
  const [notes,          setNotes]          = useState("");
  const [internalNotes,  setInternalNotes]  = useState("");
  const [clientSearch,   setClientSearch]   = useState("");
  const [errors,         setErrors]         = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (selectedCar?.depositAmount && !deposit) {
      setDeposit(String(selectedCar.depositAmount));
    }
  }, [selectedCar]);

  const dayCount = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    return Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000));
  }, [pickupDate, returnDate]);

  const totalPrice = selectedCar ? selectedCar.pricePerDay * Math.max(1, dayCount) : 0;

  const filteredClients = useMemo(() =>
    allClients.filter(c => c.status !== "blocked").filter(c => {
      if (!clientSearch) return true;
      return [c.name, c.phone, c.city, c.email ?? ""].some(v => v.toLowerCase().includes(clientSearch.toLowerCase()));
    }), [allClients, clientSearch]);

  function validate() {
    const e: Record<string, string> = {};
    if (!selectedClient)           e.client = "Select or create a client";
    if (!selectedCar)              e.car = "Select a vehicle";
    if (!pickupDate)               e.pickupDate = "Required";
    if (!returnDate)               e.returnDate = "Required";
    if (!pickupLoc)                e.pickupLoc = "Select pickup location";
    if (!returnLoc)                e.returnLoc = "Select return location";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const ref = `RNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const rental: DashboardRental = {
      id: `r-${Date.now()}`,
      reference: ref,
      client: selectedClient!.name,
      clientPhone: selectedClient!.phone,
      car: `${selectedCar!.brand} ${selectedCar!.model}`,
      plate: selectedCar!.plate,
      startDate: pickupDate,
      endDate: returnDate,
      totalPrice,
      deposit: Number(deposit) || 0,
      status: "reserved",
      source: "walk-in",
      pickupLocation: pickupLoc,
      returnLocation: returnLoc,
      driverLicense: selectedClient!.licenseNumber ?? "N/A",
      notes,
    };
    onCreated(rental);
  }

  const inp = "w-full h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";
  const sel = "w-full h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";
  const errInp = (k: string) => errors[k] ? inp.replace("border-slate-200", "border-red-300").replace("bg-white", "bg-red-50/40") : inp;
  const errSel = (k: string) => errors[k] ? sel.replace("border-slate-200", "border-red-300").replace("bg-white", "bg-red-50/40") : sel;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[18px] font-bold text-[#1a2332]">Create Rental</h3>
              <p className="text-[12.5px] text-slate-400 mt-0.5">
                {prefilledCar
                  ? `Booking ${prefilledCar.brand} ${prefilledCar.model}`
                  : "Walk-in rental — fill in all details below"}
              </p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

            {/* ① Client */}
            <section>
              <SecLabel icon={User}>Client</SecLabel>
              {errors.client && <p className="text-[11px] text-red-500 mb-2">{errors.client}</p>}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 mb-4 w-fit">
                <button
                  onClick={() => setClientMode("existing")}
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${clientMode === "existing" ? "bg-white text-[#1a2332] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Existing Client
                </button>
                <button
                  onClick={() => setClientMode("new")}
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${clientMode === "new" ? "bg-white text-[#1a2332] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  New Client
                </button>
              </div>

              {clientMode === "existing" ? (
                <div className="space-y-2">
                  {!selectedClient && (
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition"
                        placeholder="Search by name, phone, city…"
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                  {selectedClient ? (
                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 bg-emerald-600 text-white">
                        {selectedClient.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-emerald-800">{selectedClient.name}</p>
                        <p className="text-[11.5px] text-emerald-600">{selectedClient.phone} · {selectedClient.city}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedClient(null); setClientSearch(""); }}
                        className="text-emerald-400 hover:text-emerald-700 transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white max-h-52 overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <p className="text-[13px] text-slate-400 text-center py-5">No clients found</p>
                      ) : filteredClients.map(c => (
                        <div
                          key={c.id}
                          onClick={() => { setSelectedClient(c); setClientSearch(""); setErrors(prev => ({ ...prev, client: "" })); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-slate-100 text-slate-600">
                            {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800 truncate">{c.name}</p>
                            <p className="text-[11px] text-slate-400">{c.phone} · {c.city}</p>
                          </div>
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-500">
                            {c.totalRentals}× rentals
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NewClientMiniForm onCreated={c => { setSelectedClient(c); setClientMode("existing"); setErrors(prev => ({ ...prev, client: "" })); }} />
              )}
            </section>

            {/* ② Vehicle */}
            <section>
              <SecLabel icon={Car}>Vehicle</SecLabel>
              {errors.car && <p className="text-[11px] text-red-500 mb-2">{errors.car}</p>}
              {prefilledCar ? (
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <img src={prefilledCar.image} alt={prefilledCar.brand} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[#1a2332]">{prefilledCar.brand} {prefilledCar.model}</p>
                    <p className="text-[12px] text-slate-400 font-mono">{prefilledCar.plate} · {prefilledCar.year}</p>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">{prefilledCar.transmission} · {prefilledCar.fuel} · {prefilledCar.seats} seats</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[20px] font-bold text-[#1a2332]">${prefilledCar.pricePerDay}</p>
                    <p className="text-[11px] text-slate-400">/day</p>
                  </div>
                </div>
              ) : (
                <CarPicker
                  selected={selectedCar}
                  onSelect={car => { setSelectedCar(car); setDeposit(car.depositAmount ? String(car.depositAmount) : ""); setErrors(prev => ({ ...prev, car: "" })); }}
                />
              )}
            </section>

            {/* ③ Rental Period */}
            <section>
              <SecLabel icon={Calendar}>Rental Period</SecLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Pickup Date *</label>
                  <input type="date" className={errInp("pickupDate")} value={pickupDate} onChange={e => { setPickupDate(e.target.value); setErrors(prev => ({ ...prev, pickupDate: "" })); }} />
                  {errors.pickupDate && <p className="text-[11px] text-red-500 mt-1">{errors.pickupDate}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Pickup Time</label>
                  <input type="time" className={inp} value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Return Date *</label>
                  <input type="date" className={errInp("returnDate")} value={returnDate} min={pickupDate} onChange={e => { setReturnDate(e.target.value); setErrors(prev => ({ ...prev, returnDate: "" })); }} />
                  {errors.returnDate && <p className="text-[11px] text-red-500 mt-1">{errors.returnDate}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Return Time</label>
                  <input type="time" className={inp} value={returnTime} onChange={e => setReturnTime(e.target.value)} />
                </div>
              </div>
              {dayCount > 0 && (
                <div className="mt-3 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <p className="text-[12.5px] text-slate-600 font-medium">
                    {dayCount} day{dayCount !== 1 ? "s" : ""}
                    {pickupDate && returnDate && ` · ${fmtShort(pickupDate)} → ${fmtShort(returnDate)}`}
                  </p>
                </div>
              )}
            </section>

            {/* ④ Locations */}
            <section>
              <SecLabel icon={MapPin}>Locations</SecLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Pickup Location *</label>
                  <select className={errSel("pickupLoc")} value={pickupLoc} onChange={e => { setPickupLoc(e.target.value); setErrors(prev => ({ ...prev, pickupLoc: "" })); }}>
                    <option value="">— Select location —</option>
                    {locations.map(l => <option key={l.id} value={l.name}>{l.name}{l.city ? ` · ${l.city}` : ""}</option>)}
                  </select>
                  {errors.pickupLoc && <p className="text-[11px] text-red-500 mt-1">{errors.pickupLoc}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Return Location *</label>
                  <select className={errSel("returnLoc")} value={returnLoc} onChange={e => { setReturnLoc(e.target.value); setErrors(prev => ({ ...prev, returnLoc: "" })); }}>
                    <option value="">— Select location —</option>
                    {locations.map(l => <option key={l.id} value={l.name}>{l.name}{l.city ? ` · ${l.city}` : ""}</option>)}
                  </select>
                  {errors.returnLoc && <p className="text-[11px] text-red-500 mt-1">{errors.returnLoc}</p>}
                </div>
              </div>
            </section>

            {/* ⑤ Pricing */}
            <section>
              <SecLabel icon={DollarSign}>Pricing</SecLabel>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                {selectedCar && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl border border-slate-100 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rate/day</p>
                      <p className="text-[15px] font-bold text-[#1a2332]">${selectedCar.pricePerDay}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                      <p className="text-[15px] font-bold text-slate-600">{dayCount || "—"}d</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Total</p>
                      <p className="text-[15px] font-bold text-emerald-700">${totalPrice}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Deposit Amount ($)</label>
                  <input type="number" className={inp} value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="0" min="0" />
                </div>
              </div>
            </section>

            {/* ⑥ Notes */}
            <section>
              <SecLabel icon={FileText}>Notes</SecLabel>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Rental Notes</label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white"
                    rows={2}
                    placeholder="Special requests, pickup instructions…"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                    Internal Notes <span className="text-slate-300 font-normal">(staff only)</span>
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white"
                    rows={2}
                    placeholder="Internal observations, agent remarks…"
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* ⑦ Summary */}
            {selectedClient && selectedCar && pickupDate && returnDate && (
              <section>
                <SecLabel icon={CheckCircle2}>Summary</SecLabel>
                <div className="bg-[#1a2332] rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/10">
                    <div>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Client</p>
                      <p className="text-[14px] font-bold">{selectedClient.name}</p>
                      <p className="text-[12px] text-white/60">{selectedClient.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Vehicle</p>
                      <p className="text-[14px] font-bold">{selectedCar.brand} {selectedCar.model}</p>
                      <p className="text-[12px] text-white/60 font-mono">{selectedCar.plate}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Period</p>
                      <p className="text-[13px] font-semibold">{fmtShort(pickupDate)} → {fmtShort(returnDate)}</p>
                      <p className="text-[12px] text-white/60">{dayCount} day{dayCount !== 1 ? "s" : ""}</p>
                      {(pickupLoc || returnLoc) && (
                        <p className="text-[11.5px] text-white/50 mt-1">{pickupLoc} → {returnLoc || pickupLoc}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Total</p>
                      <p className="text-[26px] font-bold leading-none">${totalPrice}</p>
                      <p className="text-[11.5px] text-white/50 mt-1">+ ${deposit || 0} deposit</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button
              onClick={handleSubmit}
              className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Create Rental
            </button>
            <button
              onClick={onClose}
              className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13.5px] font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
