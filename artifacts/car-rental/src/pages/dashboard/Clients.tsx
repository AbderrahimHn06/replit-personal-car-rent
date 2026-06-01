import { useState, useMemo } from "react";
import {
  X, Search, Phone, Mail, MapPin, Key, Star, Shield, Clock,
  Plus, Edit2, Ban, FileText, MessageSquare, CreditCard,
  TrendingUp, Users, Globe, Car, AlertTriangle, CheckCircle,
  ChevronRight, Calendar, Hash,
} from "lucide-react";
import { clients as allClients, rentals, DashboardClient, ClientStatus } from "@/data/dashboardData";

/* ─── Helpers ──────────────────────────────────────────────────── */
function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type ClientTab = "all" | "online" | "walk-in" | "blocked" | "vip";

const STATUS_CFG: Record<ClientStatus, { label: string; cls: string }> = {
  active:  { label: "Active",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  blocked: { label: "Blocked", cls: "bg-red-50 text-red-700 border-red-200"             },
  new:     { label: "New",     cls: "bg-sky-50 text-sky-700 border-sky-200"              },
  vip:     { label: "VIP",     cls: "bg-amber-50 text-amber-700 border-amber-200"        },
};

function StatusBadge({ s }: { s: ClientStatus }) {
  const { label, cls } = STATUS_CFG[s];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>{label}</span>;
}

function TrustBar({ score }: { score: number }) {
  const color = score >= 85 ? "bg-emerald-500" : score >= 65 ? "bg-amber-400" : "bg-red-400";
  const label = score >= 85 ? "text-emerald-700" : score >= 65 ? "text-amber-700" : "text-red-600";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold ${label}`}>{score}</span>
    </div>
  );
}

/* ─── KPI Cards ────────────────────────────────────────────────── */
function KpiCards({ list }: { list: DashboardClient[] }) {
  const total   = list.length;
  const online  = list.filter(c => c.source === "online").length;
  const walkin  = list.filter(c => c.source === "walk-in").length;
  const repeat  = list.filter(c => c.totalRentals > 2).length;
  const blocked = list.filter(c => c.status === "blocked").length;
  const active  = list.filter(c => (c.activeRentals ?? 0) > 0).length;

  const kpis = [
    { label: "Total Clients",     value: total,   icon: Users,        color: "text-slate-700",   bg: "bg-slate-100",   trend: "+2 this month"    },
    { label: "Online",            value: online,  icon: Globe,        color: "text-indigo-600",  bg: "bg-indigo-50",   trend: "Registered online" },
    { label: "Walk-in",           value: walkin,  icon: Users,        color: "text-teal-600",    bg: "bg-teal-50",     trend: "In-person clients" },
    { label: "Repeat Clients",    value: repeat,  icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50",  trend: "More than 2 rentals"},
    { label: "Blocked",           value: blocked, icon: Ban,          color: "text-red-600",     bg: "bg-red-50",      trend: "Restricted access" },
    { label: "Active Rentals",    value: active,  icon: Car,          color: "text-violet-600",  bg: "bg-violet-50",   trend: "Currently renting" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map(({ label, value, icon: Icon, color, bg, trend }) => (
        <div key={label} className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className={`text-[22px] font-bold ${color} leading-none`}>{value}</p>
          <p className="text-[11.5px] font-semibold text-slate-600 mt-1">{label}</p>
          <p className="text-[10.5px] text-slate-400 mt-0.5">{trend}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Client Detail Drawer ─────────────────────────────────────── */
function ClientDrawer({ client, onClose }: { client: DashboardClient; onClose: () => void }) {
  const [section, setSection] = useState<"overview" | "history" | "docs" | "notes" | "payments">("overview");

  const clientRentals = rentals.filter(r => r.client === client.name).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const avatarCls = avatarColor(client.name);

  const RENTAL_STATUS_CLS: Record<string, string> = {
    active:    "bg-emerald-50 text-emerald-700",
    reserved:  "bg-indigo-50 text-indigo-700",
    overdue:   "bg-red-50 text-red-700",
    completed: "bg-slate-100 text-slate-500",
  };

  const DOCS = [
    { name: "Driver's License", number: client.licenseNumber, expiry: client.licenseExpiry, icon: Key        },
    { name: "National ID",      number: client.idNumber ?? "—", expiry: "—",                icon: FileText   },
    { name: "Passport",         number: client.nationality === "Algerian" ? "N/A" : "On file", expiry: "—",  icon: Globe      },
  ];

  const inpCls = "w-7 h-7 flex items-center justify-center rounded-lg";
  const navCls = (s: typeof section) =>
    `px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${section === s ? "bg-[#1a2332] text-white" : "text-slate-500 hover:bg-slate-100"}`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Profile Header */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1a2332] to-[#243044] px-6 py-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold flex-shrink-0 ${avatarCls} ring-2 ring-white/20`}>
                  {initials(client.name)}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white leading-tight">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StatusBadge s={client.status} />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/10 text-white/80 border border-white/20">
                      {client.source}
                    </span>
                    {client.nationality !== "Algerian" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/10 text-white/80 border border-white/20">
                        {client.nationality}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors flex-shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Trust score */}
            {client.trustScore !== undefined && (
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Trust Score</p>
                  <p className="text-[12px] font-bold text-white">{client.trustScore}/100</p>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${client.trustScore >= 85 ? "bg-emerald-400" : client.trustScore >= 65 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${client.trustScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Rentals",   value: client.totalRentals },
                { label: "Spend",     value: `$${client.totalSpend ?? 0}` },
                { label: "Late",      value: client.lateReturns ?? 0 },
                { label: "Damages",   value: client.damages ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[15px] font-bold text-white leading-none">{value}</p>
                  <p className="text-[10px] text-white/60 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50 overflow-x-auto">
            {[
              { label: "Create Rental", icon: Car,          cls: "bg-[#1a2332] text-white hover:bg-[#243044]" },
              { label: "Edit",          icon: Edit2,        cls: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
              { label: client.status === "blocked" ? "Unblock" : "Block", icon: Ban, cls: client.status === "blocked" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-600" },
              { label: "Add Note",      icon: MessageSquare, cls: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
            ].map(({ label, icon: Icon, cls }) => (
              <button key={label} className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 ${cls}`}>
                <Icon className="h-3.5 w-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Section Nav */}
          <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto">
            {(["overview","history","docs","notes","payments"] as const).map(s => (
              <button key={s} onClick={() => setSection(s)} className={navCls(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Overview ── */}
          {section === "overview" && (
            <>
              {/* Identity & Contact */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Identity & Contact</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Phone",       value: client.phone,         icon: Phone   },
                    { label: "WhatsApp",    value: client.whatsapp,      icon: Phone   },
                    { label: "Email",       value: client.email,         icon: Mail    },
                    { label: "City",        value: client.city,          icon: MapPin  },
                    { label: "License",     value: client.licenseNumber, icon: Key     },
                    { label: "Nationality", value: client.nationality,   icon: Globe   },
                    { label: "ID Number",   value: client.idNumber ?? "—", icon: Hash  },
                    { label: "Member Since",value: fmtDate(client.joinedDate), icon: Calendar },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      </div>
                      <p className="text-[12.5px] font-semibold text-slate-700 truncate">{value}</p>
                    </div>
                  ))}
                </div>
                {client.address && (
                  <div className="mt-2 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</p>
                    </div>
                    <p className="text-[12.5px] font-semibold text-slate-700">{client.address}</p>
                  </div>
                )}
              </div>

              {/* Rental Summary */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Rental Summary</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Total Rentals",     value: client.totalRentals,                      color: "text-[#1a2332]" },
                    { label: "Active Rentals",    value: client.activeRentals ?? 0,                 color: "text-emerald-600" },
                    { label: "Completed",         value: client.completedRentals ?? client.totalRentals, color: "text-slate-600" },
                    { label: "Cancelled",         value: client.cancelledRentals ?? 0,              color: "text-red-500" },
                    { label: "Total Spend",       value: `$${client.totalSpend ?? 0}`,              color: "text-emerald-700" },
                    { label: "Last Rental",       value: client.lastRentalDate ? fmtDate(client.lastRentalDate) : "—", color: "text-slate-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                      <p className={`text-[15px] font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust & Risk */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Trust & Risk</p>
                <div className="space-y-2">
                  {client.trustScore !== undefined && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-semibold text-slate-700">Trust Score</p>
                        <span className={`text-[12px] font-bold ${client.trustScore >= 85 ? "text-emerald-600" : client.trustScore >= 65 ? "text-amber-600" : "text-red-600"}`}>{client.trustScore}/100</span>
                      </div>
                      <TrustBar score={client.trustScore} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl px-3.5 py-3 border ${(client.lateReturns ?? 0) > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Late Returns</p>
                      <p className={`text-[15px] font-bold ${(client.lateReturns ?? 0) > 0 ? "text-amber-600" : "text-slate-700"}`}>{client.lateReturns ?? 0}</p>
                    </div>
                    <div className={`rounded-xl px-3.5 py-3 border ${(client.damages ?? 0) > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Damage Events</p>
                      <p className={`text-[15px] font-bold ${(client.damages ?? 0) > 0 ? "text-red-600" : "text-slate-700"}`}>{client.damages ?? 0}</p>
                    </div>
                  </div>
                  {client.blockedReason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ban className="h-3.5 w-3.5 text-red-500" />
                        <p className="text-[11.5px] font-bold text-red-700">Blocked Reason</p>
                      </div>
                      <p className="text-[12px] text-red-600">{client.blockedReason}</p>
                    </div>
                  )}
                  {client.warningNotes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <p className="text-[11.5px] font-bold text-amber-700">Warning</p>
                      </div>
                      <p className="text-[12px] text-amber-700">{client.warningNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Rental History ── */}
          {section === "history" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Rental History · {clientRentals.length} rental{clientRentals.length !== 1 ? "s" : ""}
              </p>
              {clientRentals.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                  <Car className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-slate-400">No rental history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {clientRentals.map(r => (
                    <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[13px] font-bold text-[#1a2332]">{r.car}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{r.plate} · {r.reference}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold ${RENTAL_STATUS_CLS[r.status] ?? "bg-slate-100 text-slate-500"} capitalize`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11.5px] text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(r.startDate)} → {fmtDate(r.endDate)}</span>
                        <span className="font-semibold text-slate-700">${r.totalPrice}</span>
                      </div>
                      {r.pickupLocation && (
                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{r.pickupLocation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Documents ── */}
          {section === "docs" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Documents</p>
              <div className="space-y-3">
                {DOCS.map(({ name, number, expiry, icon: Icon }) => (
                  <div key={name} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800">{name}</p>
                      <p className="text-[11.5px] text-slate-400 font-mono">{number}</p>
                      {expiry && expiry !== "—" && <p className="text-[11px] text-slate-400 mt-0.5">Expires: {fmtDate(expiry)}</p>}
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle className="h-3 w-3" /> On file
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notes ── */}
          {section === "notes" && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes & Observations</p>
              {client.internalNotes && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                    <p className="text-[11.5px] font-bold text-blue-700 uppercase tracking-wide">Internal Note</p>
                  </div>
                  <p className="text-[13px] text-blue-800">{client.internalNotes}</p>
                </div>
              )}
              {client.warningNotes && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <p className="text-[11.5px] font-bold text-amber-700 uppercase tracking-wide">Warning</p>
                  </div>
                  <p className="text-[13px] text-amber-800">{client.warningNotes}</p>
                </div>
              )}
              {!client.internalNotes && !client.warningNotes && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                  <MessageSquare className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-slate-400">No notes yet</p>
                </div>
              )}
              <button className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-[12px] font-semibold text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add Note
              </button>
            </div>
          )}

          {/* ── Payments ── */}
          {section === "payments" && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment & Deposit Info</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Spend",       value: `$${client.totalSpend ?? 0}`,          color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
                  { label: "Deposit Held",       value: `$${client.depositHeld ?? 0}`,         color: "text-amber-700",   bg: "bg-amber-50 border-amber-100"     },
                  { label: "Deposit Returned",   value: `$${client.depositReturned ?? 0}`,     color: "text-slate-700",   bg: "bg-slate-50 border-slate-100"     },
                  { label: "Pending Balance",    value: `$${client.pendingBalance ?? 0}`,      color: (client.pendingBalance ?? 0) > 0 ? "text-red-600" : "text-slate-700", bg: (client.pendingBalance ?? 0) > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100" },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                    <p className={`text-[20px] font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {clientRentals.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Payment History</p>
                  <div className="space-y-2">
                    {clientRentals.slice(0, 5).map(r => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-700">{r.car}</p>
                          <p className="text-[11px] text-slate-400">{fmtDate(r.startDate)} · {r.reference}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[13px] font-bold text-slate-800">${r.totalPrice}</p>
                          <p className="text-[10.5px] text-slate-400">Deposit: ${r.deposit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ─── Main Clients Section ─────────────────────────────────────── */
export function ClientsSection() {
  const [tab,      setTab]      = useState<ClientTab>("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<DashboardClient | null>(null);
  const [localClients] = useState<DashboardClient[]>(allClients);

  const filtered = useMemo(() => {
    return localClients.filter(c => {
      const tabMatch =
        tab === "all"     ? true :
        tab === "blocked" ? c.status === "blocked" :
        tab === "vip"     ? c.status === "vip" || c.totalRentals > 4 :
        tab === "online"  ? c.source === "online" :
        tab === "walk-in" ? c.source === "walk-in" : true;
      const q = search.toLowerCase();
      const searchMatch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.licenseNumber.toLowerCase().includes(q);
      return tabMatch && searchMatch;
    });
  }, [localClients, tab, search]);

  const tabs: { id: ClientTab; label: string; count: number }[] = [
    { id: "all",     label: "All",      count: localClients.length },
    { id: "online",  label: "Online",   count: localClients.filter(c => c.source === "online").length },
    { id: "walk-in", label: "Walk-in",  count: localClients.filter(c => c.source === "walk-in").length },
    { id: "vip",     label: "VIP / Repeat", count: localClients.filter(c => c.status === "vip" || c.totalRentals > 4).length },
    { id: "blocked", label: "Blocked",  count: localClients.filter(c => c.status === "blocked").length },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">Clients</h2>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Manage customer profiles, history, documents, and trust status</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Name, phone, city, license…"
                className="pl-10 pr-4 h-10 w-56 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-sm transition"
              />
            </div>
            <button className="h-10 px-5 flex items-center gap-2 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors">
              <Plus className="h-4 w-4" /> Add Client
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards list={localClients} />
      </div>

      {/* Tabs */}
      <div className="px-6 sm:px-8 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                tab === id
                  ? "bg-[#1a2332] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">City</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Rentals</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Last Rental</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Trust</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center">
                      <Users className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-[13px] text-slate-400 font-medium">No clients found</p>
                    </td>
                  </tr>
                ) : filtered.map(c => {
                  const avatarCls = avatarColor(c.name);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[12px] font-bold ${avatarCls}`}>
                            {initials(c.name)}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-800">{c.name}</p>
                            <p className="text-[11px] text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[12.5px] text-slate-600 hidden md:table-cell whitespace-nowrap">{c.phone}</td>
                      <td className="px-4 py-3.5 text-[12.5px] text-slate-600 hidden lg:table-cell">{c.city}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11.5px] font-semibold">
                          {c.totalRentals}×
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-slate-400 hidden xl:table-cell">
                        {c.lastRentalDate ? fmtDate(c.lastRentalDate) : "—"}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        {c.trustScore !== undefined ? (
                          <div className="w-24">
                            <TrustBar score={c.trustScore} />
                          </div>
                        ) : <span className="text-slate-300 text-[12px]">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge s={c.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 text-[11.5px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#1a2332] transition-colors"
                        >
                          View <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[12px] text-slate-400">Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{localClients.length}</span> clients</p>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <span>{localClients.filter(c => c.status === "vip").length} VIP</span>
                <span className="text-slate-200">·</span>
                <span>{localClients.filter(c => (c.activeRentals ?? 0) > 0).length} active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && <ClientDrawer client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
