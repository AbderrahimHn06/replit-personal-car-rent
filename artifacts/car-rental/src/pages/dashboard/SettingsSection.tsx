import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Building2, Phone, Mail, Clock, FileText, Palette, MapPin,
  Plus, Edit2, X, ToggleLeft, ToggleRight, CheckCircle, DollarSign, Globe, Languages,
} from "lucide-react";
import {
  useLocations, addLocation, updateLocation, removeLocation, AgencyLocation,
  useCurrencySettings, updateCurrencySettings, CurrencyCode, CURRENCY_NAMES, CURRENCY_SYMBOLS,
  useLanguageSettings, updateLanguageSettings, LanguageCode, LANGUAGE_NAMES,
} from "@/data/localStore";

const INITIAL = {
  agencyName: "EliteRide Car Rental",
  address: "Rue Ahmed Zabana, Oran 31000, Algeria",
  phone: "+213 41 234 567",
  mobile: "+213 555 678 901",
  email: "contact@eliteride.dz",
  whatsapp: "+213 555 678 901",
  website: "www.eliteride.dz",
  taxId: "RCN-31-2024-0045",
  terms: `1. The renter must be at least 21 years old and hold a valid driver's license.\n2. A valid ID/passport and credit card are required at pickup.\n3. The rental period begins at the time of vehicle pickup and ends upon return.\n4. Fuel is not included. The vehicle must be returned with the same fuel level.\n5. The renter is responsible for all traffic fines and penalties incurred during the rental period.\n6. Damage to the vehicle must be reported immediately.\n7. Cancellations made 48h before pickup receive a full refund. Less than 48h: 50% refund.\n8. Unauthorized use of the vehicle in off-road conditions voids the insurance coverage.`,
};

const HOURS = [
  { day: "Monday – Friday", open: "08:00", close: "20:00", closed: false },
  { day: "Saturday",        open: "08:00", close: "18:00", closed: false },
  { day: "Sunday",          open: "09:00", close: "14:00", closed: false },
  { day: "Public Holidays", open: "",      close: "",      closed: true  },
];

function Field({ label, value, onChange, placeholder, type = "text", full = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );
}

/* ─── Location Form Modal ──────────────────────────────────────── */
const BLANK_LOC: Omit<AgencyLocation, "id"> = { name: "", address: "", city: "", notes: "", isActive: true };

function LocationModal({ initial, onSave, onClose }: {
  initial?: AgencyLocation | null;
  onSave: (l: AgencyLocation) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<AgencyLocation, "id">>(
    initial
      ? { name: initial.name, address: initial.address, city: initial.city, notes: initial.notes, isActive: initial.isActive }
      : { ...BLANK_LOC }
  );
  const set = (k: keyof typeof form, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const inp = "w-full h-10 rounded-xl border border-slate-200 px-3.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition";

  function handleSave() {
    if (!form.name.trim()) return;
    onSave({ ...(initial ?? { id: `loc-${Date.now()}` }), ...form });
    onClose();
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-[16px] font-bold text-[#1a2332]">{initial ? "Edit Location" : "Add Location"}</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">Agency pickup / return point</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Location Name *</label>
              <input className={inp} placeholder="e.g. Oran Airport" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Address</label>
              <input className={inp} placeholder="e.g. Ahmed Ben Bella Airport, Es Senia" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">City</label>
              <input className={inp} placeholder="e.g. Oran" value={form.city} onChange={e => set("city", e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notes <span className="text-slate-300">(optional)</span></label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition"
                rows={2} placeholder="e.g. Terminal 1 arrivals hall" value={form.notes} onChange={e => set("notes", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Active</p>
                <p className="text-[11px] text-slate-400">Show in pickup/return dropdowns</p>
              </div>
              <button onClick={() => set("isActive", !form.isActive)} className="transition-colors cursor-pointer">
                {form.isActive
                  ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                  : <ToggleLeft  className="h-7 w-7 text-slate-300"   />}
              </button>
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3">
            <button onClick={handleSave} disabled={!form.name.trim()} className="flex-1 h-10 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              {initial ? "Save Changes" : "Add Location"}
            </button>
            <button onClick={onClose} className="h-10 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─── Locations Section ────────────────────────────────────────── */
function LocationsSection() {
  const locations = useLocations();
  const [editing, setEditing] = useState<AgencyLocation | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-slate-700">Locations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Pickup & return points shown to clients and staff</p>
          </div>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 h-9 px-4 bg-[#1a2332] text-white rounded-xl text-xs font-semibold hover:bg-[#243044] transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add Location
        </button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
          <MapPin className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No locations yet</p>
          <p className="text-xs text-slate-400 mt-0.5">Add your agency's pickup and return points</p>
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map(loc => (
            <div key={loc.id} className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors ${loc.isActive ? "bg-white border-slate-200 hover:bg-slate-50" : "bg-slate-50 border-slate-200 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${loc.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{loc.name}</p>
                  {loc.address && <p className="text-[11.5px] text-slate-400">{loc.address}{loc.city ? ` · ${loc.city}` : ""}</p>}
                  {loc.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{loc.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${loc.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  {loc.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => updateLocation({ ...loc, isActive: !loc.isActive })}
                  className="h-7 px-2.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {loc.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => setEditing(loc)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removeLocation(loc.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {adding && (
          <LocationModal onSave={l => addLocation(l)} onClose={() => setAdding(false)} />
        )}
        {editing && (
          <LocationModal initial={editing} onSave={l => { updateLocation(l); setEditing(null); }} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Currency Section ─────────────────────────────────────────── */
const ALL_CURRENCIES: CurrencyCode[] = ["DZD", "USD", "EUR"];

function CurrencySection() {
  const { mainCurrency, supportedCurrencies } = useCurrencySettings();
  const [saved, setSaved] = useState(false);

  function handleMainChange(c: CurrencyCode) {
    const newSupported = supportedCurrencies.includes(c)
      ? supportedCurrencies
      : [...supportedCurrencies, c];
    updateCurrencySettings({ mainCurrency: c, supportedCurrencies: newSupported });
    flash();
  }

  function toggleSupported(c: CurrencyCode) {
    if (c === mainCurrency) return;
    const has = supportedCurrencies.includes(c);
    updateCurrencySettings({
      supportedCurrencies: has
        ? supportedCurrencies.filter(x => x !== c)
        : [...supportedCurrencies, c],
    });
    flash();
  }

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-slate-700">Currency</h3>
            <p className="text-xs text-slate-400 mt-0.5">Set main currency and accepted payment currencies</p>
          </div>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
            <CheckCircle className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Main currency */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Main Currency</p>
          <div className="grid grid-cols-3 gap-2.5">
            {ALL_CURRENCIES.map(c => {
              const isMain = mainCurrency === c;
              return (
                <button
                  key={c}
                  onClick={() => handleMainChange(c)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isMain
                      ? "bg-[#1a2332] border-[#1a2332] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-[15px] font-bold ${isMain ? "text-white" : "text-slate-400"}`}>
                    {CURRENCY_SYMBOLS[c]}
                  </span>
                  <div>
                    <p className={`text-[12.5px] font-bold ${isMain ? "text-white" : "text-slate-800"}`}>{c}</p>
                    <p className={`text-[10.5px] ${isMain ? "text-white/70" : "text-slate-400"}`}>
                      {CURRENCY_NAMES[c].split(" (")[0]}
                    </p>
                  </div>
                  {isMain && <CheckCircle className="h-4 w-4 ml-auto text-white/80" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supported currencies */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Supported Currencies</p>
          <p className="text-[12px] text-slate-500 mb-3">Enable currencies for multi-currency pricing on your fleet.</p>
          <div className="space-y-2">
            {ALL_CURRENCIES.map(c => {
              const isEnabled = supportedCurrencies.includes(c);
              const isMain = mainCurrency === c;
              return (
                <div key={c} className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-slate-400 w-6 text-center">{CURRENCY_SYMBOLS[c]}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{c} <span className="text-slate-400 font-normal text-[11.5px]">· {CURRENCY_NAMES[c].split(" (")[0]}</span></p>
                      {isMain && <p className="text-[10.5px] text-violet-600 font-semibold mt-0.5">Main currency</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSupported(c)}
                    disabled={isMain}
                    className="cursor-pointer disabled:opacity-40 disabled:cursor-default"
                  >
                    {isEnabled
                      ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                      : <ToggleLeft  className="h-7 w-7 text-slate-300"   />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Language Section ─────────────────────────────────────────── */
const ALL_LANGUAGES: LanguageCode[] = ["fr", "en", "ar"];
const LANG_FLAGS: Record<LanguageCode, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇩🇿" };

function LanguageSection() {
  const { mainLanguage, supportedLanguages } = useLanguageSettings();
  const [saved, setSaved] = useState(false);

  function handleMainChange(l: LanguageCode) {
    const newSupported = supportedLanguages.includes(l)
      ? supportedLanguages
      : [...supportedLanguages, l];
    updateLanguageSettings({ mainLanguage: l, supportedLanguages: newSupported });
    flash();
  }

  function toggleSupported(l: LanguageCode) {
    if (l === mainLanguage) return;
    const has = supportedLanguages.includes(l);
    updateLanguageSettings({
      supportedLanguages: has
        ? supportedLanguages.filter(x => x !== l)
        : [...supportedLanguages, l],
    });
    flash();
  }

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-slate-700">Language</h3>
            <p className="text-xs text-slate-400 mt-0.5">Interface and document language preferences</p>
          </div>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
            <CheckCircle className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Main language */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Main Language</p>
          <div className="grid grid-cols-3 gap-2.5">
            {ALL_LANGUAGES.map(l => {
              const isMain = mainLanguage === l;
              return (
                <button
                  key={l}
                  onClick={() => handleMainChange(l)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isMain
                      ? "bg-[#1a2332] border-[#1a2332] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[18px]">{LANG_FLAGS[l]}</span>
                  <div>
                    <p className={`text-[12.5px] font-bold ${isMain ? "text-white" : "text-slate-800"}`}>
                      {l.toUpperCase()}
                    </p>
                    <p className={`text-[10.5px] ${isMain ? "text-white/70" : "text-slate-400"}`}>
                      {LANGUAGE_NAMES[l]}
                    </p>
                  </div>
                  {isMain && <CheckCircle className="h-4 w-4 ml-auto text-white/80" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supported languages */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Supported Languages</p>
          <p className="text-[12px] text-slate-500 mb-3">Enable languages for rental agreements and client communications.</p>
          <div className="space-y-2">
            {ALL_LANGUAGES.map(l => {
              const isEnabled = supportedLanguages.includes(l);
              const isMain = mainLanguage === l;
              return (
                <div key={l} className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <span className="text-[18px]">{LANG_FLAGS[l]}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {LANGUAGE_NAMES[l]}
                        <span className="text-slate-400 font-normal text-[11.5px]"> ({l.toUpperCase()})</span>
                      </p>
                      {isMain && <p className="text-[10.5px] text-violet-600 font-semibold mt-0.5">Main language</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSupported(l)}
                    disabled={isMain}
                    className="cursor-pointer disabled:opacity-40 disabled:cursor-default"
                  >
                    {isEnabled
                      ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                      : <ToggleLeft  className="h-7 w-7 text-slate-300"   />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Settings Section ────────────────────────────────────── */
export function SettingsSection() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#1a2332]">Settings</h2>
          <p className="text-[12.5px] text-slate-400 mt-0.5">Agency configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${saved ? "bg-emerald-600 text-white" : "bg-[#1a2332] text-white hover:bg-[#243044]"}`}
        >
          {saved ? <CheckCircle className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Agency Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-slate-700">Agency Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Agency Name" value={form.agencyName} onChange={v => setF("agencyName", v)} full />
          <Field label="Address" value={form.address} onChange={v => setF("address", v)} full />
          <Field label="Phone" value={form.phone} onChange={v => setF("phone", v)} />
          <Field label="Mobile" value={form.mobile} onChange={v => setF("mobile", v)} />
          <Field label="Email" value={form.email} onChange={v => setF("email", v)} type="email" />
          <Field label="WhatsApp" value={form.whatsapp} onChange={v => setF("whatsapp", v)} />
          <Field label="Website" value={form.website} onChange={v => setF("website", v)} />
          <Field label="Tax ID / RC Number" value={form.taxId} onChange={v => setF("taxId", v)} />
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-slate-700">Business Hours</h3>
        </div>
        <div className="space-y-2">
          {HOURS.map((h, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700 w-48">{h.day}</span>
              {h.closed ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">Closed</span>
              ) : (
                <div className="flex items-center gap-3">
                  <input defaultValue={h.open} className="w-24 h-8 px-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  <span className="text-slate-400 text-xs">to</span>
                  <input defaultValue={h.close} className="w-24 h-8 px-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Locations */}
      <LocationsSection />

      {/* Currency */}
      <CurrencySection />

      {/* Language */}
      <LanguageSection />

      {/* Terms & Conditions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-slate-700">Terms & Conditions</h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">These terms are shown to clients during the booking process.</p>
        <textarea
          value={form.terms} onChange={e => setF("terms", e.target.value)} rows={10}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Branding */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-slate-700">Branding</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Agency Logo</label>
            <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-2">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs text-slate-400 font-medium">EliteRide</p>
              <p className="text-[11px] text-slate-400 mt-1">Click to upload new logo</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Brand Colors</label>
            <div className="space-y-3">
              {[{ label: "Primary Color", value: "#3E5F7D" }, { label: "Accent Color", value: "#D6A85C" }].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: value }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600">{label}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{value}</p>
                  </div>
                  <button className="h-7 px-3 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">Change</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
