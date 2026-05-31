import { useState } from "react";
import { Save, Building2, Phone, Mail, MapPin, Clock, FileText, Palette } from "lucide-react";

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
  { day: "Saturday", open: "08:00", close: "18:00", closed: false },
  { day: "Sunday", open: "09:00", close: "14:00", closed: false },
  { day: "Public Holidays", open: "", close: "", closed: true },
];

function Field({ label, value, onChange, placeholder, type = "text", full = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );
}

export function SettingsSection() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Agency configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          <Save className="h-3.5 w-3.5" />
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
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                  Closed
                </span>
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

      {/* Terms & Conditions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-slate-700">Terms & Conditions</h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">These terms are shown to clients during the booking process.</p>
        <textarea
          value={form.terms}
          onChange={e => setF("terms", e.target.value)}
          rows={10}
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
          {/* Logo preview */}
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

          {/* Color scheme */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Brand Colors</label>
            <div className="space-y-3">
              {[
                { label: "Primary Color", value: "#3E5F7D" },
                { label: "Accent Color", value: "#D6A85C" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: value }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600">{label}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{value}</p>
                  </div>
                  <button className="h-7 px-3 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
                    Change
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
