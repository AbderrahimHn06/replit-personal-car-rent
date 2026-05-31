import { useState } from "react";
import { X, Search, Phone, Mail, MapPin, UserX, Key } from "lucide-react";
import { clients as allClients, DashboardClient } from "@/data/dashboardData";

type Tab = "all" | "online" | "walk-in";

export function ClientsSection() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DashboardClient | null>(null);

  const filtered = allClients.filter(c => {
    const tabMatch = tab === "all" || c.source === tab;
    const q = search.toLowerCase();
    const searchMatch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Clients</h2>
          <p className="text-xs text-slate-500 mt-0.5">{allClients.length} registered clients</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          {(["all", "online", "walk-in"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                tab === t ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t} ({t === "all" ? allClients.length : allClients.filter(c => c.source === t).length})
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full h-9 pl-9 pr-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">City</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Rentals</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">No clients found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                        <p className="text-[11px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden lg:table-cell">{c.city}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {c.totalRentals} rental{c.totalRentals !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${c.source === "online" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
                      {c.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors" title="View profile">
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Client Profile</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-base font-bold text-primary">{selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{selected.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${selected.source === "online" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
                      {selected.source}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {selected.totalRentals} rental{selected.totalRentals !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: Phone, label: "Phone", value: selected.phone },
                  { icon: Phone, label: "WhatsApp", value: selected.whatsapp },
                  { icon: Mail, label: "Email", value: selected.email },
                  { icon: MapPin, label: "City", value: selected.city },
                  { icon: Key, label: "License", value: selected.licenseNumber },
                  { icon: UserX, label: "Nationality", value: selected.nationality },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400 w-20 flex-shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                  <Key className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400 w-20">Member since</span>
                  <span className="text-xs font-semibold text-slate-700">{selected.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
