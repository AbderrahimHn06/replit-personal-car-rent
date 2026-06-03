import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, Phone, Mail, MapPin, Key, Star, Shield, Clock,
  Plus, Edit2, Ban, FileText, MessageSquare, CreditCard,
  TrendingUp, Users, Globe, Car, AlertTriangle, CheckCircle,
  ChevronRight, Calendar, Hash, Trash2, CheckCircle2,
} from "lucide-react";
import { rentals, DashboardClient, ClientStatus } from "@/data/dashboardData";
import { useClients, addClientToStore, updateClientInStore, removeClientFromStore, addRental, useT } from "@/data/localStore";
import { RentalCreationModal } from "./RentalCreationModal";

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

const STATUS_CLS: Record<ClientStatus, string> = {
  active:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  new:     "bg-sky-50 text-sky-700 border-sky-200",
  vip:     "bg-amber-50 text-amber-700 border-amber-200",
};

function StatusBadge({ s }: { s: ClientStatus }) {
  const t = useT();
  const labelKey = s === "active" ? "status.active" : s === "blocked" ? "action.block" : s === "new" ? "filter.new" : "status.vip";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_CLS[s]}`}>{t(labelKey as any)}</span>;
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
  const t = useT();
  const total   = list.length;
  const online  = list.filter(c => c.source === "online").length;
  const walkin  = list.filter(c => c.source === "walk-in").length;
  const repeat  = list.filter(c => c.totalRentals > 2).length;
  const blocked = list.filter(c => c.status === "blocked").length;
  const active  = list.filter(c => (c.activeRentals ?? 0) > 0).length;

  const kpis = [
    { label: t("kpi.totalClients"),   value: total,   icon: Users,        color: "text-slate-700",   bg: "bg-slate-100",   trend: t("kpi.sub.online")    },
    { label: t("kpi.online"),         value: online,  icon: Globe,        color: "text-indigo-600",  bg: "bg-indigo-50",   trend: t("booking.source.website") },
    { label: t("booking.source.walkin"), value: walkin, icon: Users,     color: "text-teal-600",    bg: "bg-teal-50",     trend: t("kpi.sub.walkin") },
    { label: t("kpi.repeatClients"),  value: repeat,  icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50",  trend: t("kpi.sub.repeat") },
    { label: t("action.block"),       value: blocked, icon: Ban,          color: "text-red-600",     bg: "bg-red-50",      trend: t("kpi.sub.restrictedFromRenting") },
    { label: t("kpi.activeRentals"),  value: active,  icon: Car,          color: "text-violet-600",  bg: "bg-violet-50",   trend: t("kpi.sub.currentlyRenting") },
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
  const t = useT();
  const [section,         setSection]         = useState<"overview" | "history" | "docs" | "notes" | "payments">("overview");
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [editOpen,        setEditOpen]        = useState(false);
  const [blockOpen,       setBlockOpen]       = useState(false);
  const [noteOpen,        setNoteOpen]        = useState(false);
  const [blockReason,     setBlockReason]     = useState("");
  const [noteText,        setNoteText]        = useState("");

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] bg-white shadow-2xl flex flex-col overflow-hidden">

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
                  <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">{t("table.trust")}</p>
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
                { label: t("nav.rentals"),      value: client.totalRentals },
                { label: t("table.total"),       value: `$${client.totalSpend ?? 0}` },
                { label: t("drawer.late"),       value: client.lateReturns ?? 0 },
                { label: t("drawer.damages"),    value: client.damages ?? 0 },
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
            <button
              onClick={() => setShowRentalModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 bg-[#1a2332] text-white hover:bg-[#243044]"
            >
              <Car className="h-3.5 w-3.5" /> {t("action.newRental")}
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="h-3.5 w-3.5" /> {t("action.edit")}
            </button>
            <button
              onClick={() => setBlockOpen(true)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 ${
                client.status === "blocked"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
              }`}
            >
              <Ban className="h-3.5 w-3.5" /> {client.status === "blocked" ? t("action.unblock") : t("action.block")}
            </button>
            <button
              onClick={() => setNoteOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <MessageSquare className="h-3.5 w-3.5" /> {t("drawer.addNote")}
            </button>
          </div>

          {/* Section Nav */}
          <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto">
            {([
              { id: "overview", label: t("drawer.overview") },
              { id: "history",  label: t("drawer.history")  },
              { id: "docs",     label: t("drawer.docs")     },
              { id: "notes",    label: t("drawer.notes")    },
              { id: "payments", label: t("drawer.payments") },
            ] as const).map(({ id, label }) => (
              <button key={id} onClick={() => setSection(id)} className={navCls(id)}>
                {label}
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.identityContact")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t("table.phone"),         value: client.phone,         icon: Phone   },
                    { label: "WhatsApp",               value: client.whatsapp,      icon: Phone   },
                    { label: t("form.email"),          value: client.email,         icon: Mail    },
                    { label: t("table.city"),          value: client.city,          icon: MapPin  },
                    { label: t("drawer.license"),      value: client.licenseNumber, icon: Key     },
                    { label: t("drawer.nationality"),  value: client.nationality,   icon: Globe   },
                    { label: t("drawer.idNumber"),     value: client.idNumber ?? "—", icon: Hash  },
                    { label: t("drawer.memberSince"),  value: fmtDate(client.joinedDate), icon: Calendar },
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
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("settings.address")}</p>
                    </div>
                    <p className="text-[12.5px] font-semibold text-slate-700">{client.address}</p>
                  </div>
                )}
              </div>

              {/* Rental Summary */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.rentalSummary")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t("kpi.totalClients").replace("clients","").trim() + " " + t("nav.rentals"), value: client.totalRentals,                      color: "text-[#1a2332]" },
                    { label: t("kpi.activeRentals"),    value: client.activeRentals ?? 0,                 color: "text-emerald-600" },
                    { label: t("filter.completed"),     value: client.completedRentals ?? client.totalRentals, color: "text-slate-600" },
                    { label: t("filter.cancelled"),     value: client.cancelledRentals ?? 0,              color: "text-red-500" },
                    { label: t("drawer.totalSpend"),    value: `$${client.totalSpend ?? 0}`,              color: "text-emerald-700" },
                    { label: t("table.lastRental"),     value: client.lastRentalDate ? fmtDate(client.lastRentalDate) : "—", color: "text-slate-600" },
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.trustRisk")}</p>
                <div className="space-y-2">
                  {client.trustScore !== undefined && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-semibold text-slate-700">{t("table.trust")}</p>
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
              <button
                onClick={() => setNoteOpen(true)}
                className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-[12px] font-semibold text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-colors flex items-center justify-center gap-2"
              >
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
      </motion.aside>

      {/* ── Block / Unblock Modal ── */}
      {blockOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" onClick={() => setBlockOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h4 className="text-[16px] font-bold text-[#1a2332] mb-2">
                {client.status === "blocked" ? "Unblock Client" : "Block Client"}
              </h4>
              <p className="text-[13px] text-slate-500 mb-4">
                {client.status === "blocked"
                  ? `Restore ${client.name}'s ability to book rentals.`
                  : `Prevent ${client.name} from booking rentals.`}
              </p>
              {client.status !== "blocked" && (
                <div className="mb-4">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Reason <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition bg-white"
                    rows={2}
                    placeholder="e.g. Did not return vehicle, fraudulent documents…"
                    value={blockReason}
                    onChange={e => setBlockReason(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const updated: DashboardClient = {
                      ...client,
                      status: client.status === "blocked" ? ("active" as ClientStatus) : ("blocked" as ClientStatus),
                      blockedReason: client.status !== "blocked" ? blockReason || undefined : undefined,
                    };
                    updateClientInStore(updated);
                    setBlockOpen(false);
                    setBlockReason("");
                  }}
                  className={`flex-1 h-10 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                    client.status === "blocked"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {client.status === "blocked" ? "Yes, Unblock" : "Block Client"}
                </button>
                <button
                  onClick={() => { setBlockOpen(false); setBlockReason(""); }}
                  className="px-5 h-10 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* ── Add Note Modal ── */}
      {noteOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" onClick={() => setNoteOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h4 className="text-[16px] font-bold text-[#1a2332] mb-4">Add Note</h4>
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Internal Note</label>
                <textarea
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white"
                  rows={3}
                  placeholder="Staff-only observation…"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!noteText.trim()) return;
                    const stamp = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                    const newLine = `[${stamp}] ${noteText.trim()}`;
                    const combined = client.internalNotes ? `${client.internalNotes}\n${newLine}` : newLine;
                    updateClientInStore({ ...client, internalNotes: combined });
                    setNoteOpen(false);
                    setNoteText("");
                    setSection("notes");
                  }}
                  disabled={!noteText.trim()}
                  className="flex-1 h-10 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] disabled:opacity-40 transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => { setNoteOpen(false); setNoteText(""); }}
                  className="px-5 h-10 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* ── Edit Client Modal ── */}
      {editOpen && (
        <ClientModal
          initial={client}
          onSave={updated => {
            updateClientInStore(updated);
            setEditOpen(false);
          }}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* ── Create Rental Modal ── */}
      {showRentalModal && (
        <RentalCreationModal
          prefilledClient={client}
          onClose={() => setShowRentalModal(false)}
          onCreated={rental => {
            addRental(rental);
            setShowRentalModal(false);
          }}
        />
      )}
    </>
  );
}

/* ─── Client Modal (Add / Edit) ────────────────────────────────── */
interface ClientFormState {
  name: string; phone: string; whatsapp: string; email: string;
  city: string; address: string; licenseNumber: string;
  licenseExpiry: string; idNumber: string; dateOfBirth: string;
  source: "online" | "walk-in"; status: ClientStatus;
  internalNotes: string; warningNotes: string;
}

const BLANK_CLIENT_FORM: ClientFormState = {
  name: "", phone: "", whatsapp: "", email: "", city: "", address: "",
  licenseNumber: "", licenseExpiry: "", idNumber: "", dateOfBirth: "",
  source: "walk-in", status: "active", internalNotes: "", warningNotes: "",
};

function ClientModal({ initial, onSave, onClose }: {
  initial?: DashboardClient | null;
  onSave: (c: DashboardClient) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<ClientFormState>(initial ? {
    name: initial.name, phone: initial.phone, whatsapp: initial.whatsapp ?? "",
    email: initial.email ?? "", city: initial.city ?? "", address: initial.address ?? "",
    licenseNumber: initial.licenseNumber ?? "", licenseExpiry: initial.licenseExpiry ?? "",
    idNumber: initial.idNumber ?? "", dateOfBirth: initial.dateOfBirth ?? "",
    source: initial.source as "online" | "walk-in", status: initial.status,
    internalNotes: initial.internalNotes ?? "", warningNotes: initial.warningNotes ?? "",
  } : BLANK_CLIENT_FORM);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [docFiles, setDocFiles] = useState<{ license: File | null; passport: File | null; nationalId: File | null }>({
    license: null, passport: null, nationalId: null,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const set = <K extends keyof ClientFormState>(k: K, v: ClientFormState[K]) =>
    setF(p => ({ ...p, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!f.name.trim())  e.name  = "Full name is required";
    if (!f.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const client: DashboardClient = {
      ...(initial ?? {}),
      id:            initial?.id ?? `cl-${Date.now()}`,
      name:          f.name.trim(),
      phone:         f.phone.trim(),
      whatsapp:      f.whatsapp || f.phone.trim(),
      email:         f.email,
      city:          f.city,
      address:       f.address,
      nationality:   initial?.nationality ?? "Algerian",
      licenseNumber: f.licenseNumber,
      licenseExpiry: f.licenseExpiry,
      idNumber:      f.idNumber,
      dateOfBirth:   f.dateOfBirth,
      source:        f.source,
      status:        f.status,
      joinedDate:    initial?.joinedDate ?? new Date().toISOString().split("T")[0],
      totalRentals:      initial?.totalRentals      ?? 0,
      activeRentals:     initial?.activeRentals     ?? 0,
      completedRentals:  initial?.completedRentals  ?? 0,
      cancelledRentals:  initial?.cancelledRentals  ?? 0,
      totalSpend:        initial?.totalSpend        ?? 0,
      depositHeld:       initial?.depositHeld       ?? 0,
      trustScore:        initial?.trustScore        ?? 75,
      internalNotes: f.internalNotes,
      warningNotes:  f.warningNotes,
    };
    onSave(client);
  }

  const inp = (k: string) =>
    `w-full h-10 rounded-xl border px-3.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition ${errors[k] ? "border-red-300 bg-red-50/40" : "border-slate-200"}`;

  const isEdit = !!initial;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="text-[18px] font-bold text-[#1a2332]">{isEdit ? "Edit Client" : "Add Client"}</h3>
              <p className="text-[12.5px] text-slate-400 mt-0.5">{isEdit ? `Editing ${initial!.name}` : "Create a new client profile"}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

            {/* Basic Info */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Basic Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input className={inp("name")} placeholder="e.g. Ahmed Benali" value={f.name} onChange={e => set("name", e.target.value)} />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                  <input className={inp("phone")} placeholder="0661 xxx xxx" value={f.phone} onChange={e => set("phone", e.target.value)} />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">WhatsApp Number</label>
                  <input className={inp("")} placeholder="Same as phone if blank" value={f.whatsapp} onChange={e => set("whatsapp", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Email Address</label>
                  <input className={inp("")} placeholder="client@email.com" type="email" value={f.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">City</label>
                  <input className={inp("")} placeholder="Oran" value={f.city} onChange={e => set("city", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Address</label>
                  <input className={inp("")} placeholder="Street address" value={f.address} onChange={e => set("address", e.target.value)} />
                </div>
              </div>
            </section>

            {/* Identity */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Identity Documents</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Driver License Number</label>
                  <input className={inp("")} placeholder="DL-31-xxxx" value={f.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">License Expiry Date</label>
                  <input type="date" className={inp("")} value={f.licenseExpiry} onChange={e => set("licenseExpiry", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">National ID Number</label>
                  <input className={inp("")} placeholder="ID number" value={f.idNumber} onChange={e => set("idNumber", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Date of Birth</label>
                  <input type="date" className={inp("")} value={f.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
                </div>
              </div>
            </section>

            {/* Status */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Client Status</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-slate-600 mb-2">Client Type</p>
                  <div className="flex gap-2">
                    {(["walk-in", "online"] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => set("source", v)}
                        className={`flex-1 h-9 rounded-xl text-[12.5px] font-semibold border transition-all ${f.source === v ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                      >
                        {v === "walk-in" ? "Walk-in" : "Online"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-slate-600 mb-2">Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["active", "vip", "blocked"] as ClientStatus[]).map(v => (
                      <button
                        key={v}
                        onClick={() => set("status", v)}
                        className={`flex-1 h-9 rounded-xl text-[12.5px] font-semibold border transition-all capitalize ${f.status === v ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Notes</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Internal Notes</label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition bg-white"
                    rows={2}
                    placeholder="Internal remarks for staff…"
                    value={f.internalNotes}
                    onChange={e => set("internalNotes", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                    Warning Notes <span className="text-slate-300 font-normal">(shown as alert)</span>
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition"
                    rows={2}
                    placeholder="Any warnings or risk flags…"
                    value={f.warningNotes}
                    onChange={e => set("warningNotes", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Document Uploads</p>
              <p className="text-[11.5px] text-slate-400 mb-4">Attach scans or photos — stored in this session only.</p>
              <div className="space-y-2.5">
                {([
                  { key: "license" as const,    label: "Driver's License" },
                  { key: "passport" as const,   label: "Passport" },
                  { key: "nationalId" as const, label: "National ID / CIN" },
                ] as const).map(({ key, label }) => {
                  const file = docFiles[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        file ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${file ? "bg-emerald-100" : "bg-white border border-slate-200"}`}>
                        <FileText className={`h-4 w-4 ${file ? "text-emerald-600" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] font-semibold leading-tight ${file ? "text-emerald-800" : "text-slate-600"}`}>{label}</p>
                        {file ? (
                          <p className="text-[11px] text-emerald-600 truncate">{file.name} &middot; {(file.size / 1024).toFixed(0)} KB</p>
                        ) : (
                          <p className="text-[11px] text-slate-400">No file selected</p>
                        )}
                      </div>
                      {file ? (
                        <button
                          type="button"
                          onClick={() => setDocFiles(p => ({ ...p, [key]: null }))}
                          className="flex-shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : (
                        <label className="flex-shrink-0 h-8 px-3 rounded-lg bg-white border border-slate-200 text-[11.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            className="sr-only"
                            onChange={e => {
                              const picked = e.target.files?.[0];
                              if (picked) setDocFiles(p => ({ ...p, [key]: picked }));
                              e.target.value = "";
                            }}
                          />
                          Browse
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="border-t border-slate-100 px-7 py-5 flex gap-3 flex-shrink-0">
            <button
              onClick={handleSave}
              className="flex-1 h-11 bg-[#1a2332] text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#243044] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Create Client"}
            </button>
            <button onClick={onClose} className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[13.5px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─── Main Clients Section ─────────────────────────────────────── */
export function ClientsSection() {
  const [tab,           setTab]           = useState<ClientTab>("all");
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState<DashboardClient | null>(null);
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [editingClient, setEditingClient] = useState<DashboardClient | null>(null);
  const [deleteId,      setDeleteId]      = useState<string | null>(null);
  const [toast,         setToast]         = useState<string | null>(null);
  const localClients = useClients();

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

  const t = useT();

  const tabs: { id: ClientTab; label: string; count: number }[] = [
    { id: "all",     label: t("filter.all"),          count: localClients.length },
    { id: "online",  label: t("kpi.online"),           count: localClients.filter(c => c.source === "online").length },
    { id: "walk-in", label: t("booking.source.walkin"), count: localClients.filter(c => c.source === "walk-in").length },
    { id: "vip",     label: t("status.vip"),           count: localClients.filter(c => c.status === "vip" || c.totalRentals > 4).length },
    { id: "blocked", label: t("section.blocked.title"), count: localClients.filter(c => c.status === "blocked").length },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">{t("nav.clients")}</h2>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">{t("clients.subtitle")}</p>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="h-10 px-5 flex items-center gap-2 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> {t("action.addClient")}
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
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("table.client")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">{t("table.phone")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t("table.city")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">{t("nav.rentals")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">{t("table.lastRental")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t("table.trust")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("table.status")}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("table.actions")}</th>
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
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelected(c)}
                            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 text-[11.5px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#1a2332] transition-colors"
                          >
                            View <ChevronRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setEditingClient(c)}
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-[#1a2332] transition-colors"
                            title="Edit client"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          {deleteId === c.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { removeClientFromStore(c.id); setDeleteId(null); setToast(`${c.name} removed`); }}
                                className="h-7 px-2 rounded-lg bg-red-50 border border-red-200 text-[11px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(c.id)}
                              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                              title="Delete client"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
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
      <AnimatePresence>
        {selected && <ClientDrawer key="client-drawer" client={localClients.find(c => c.id === selected.id) ?? selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <ClientModal
            key="add-client"
            onSave={c => {
              addClientToStore(c);
              setShowAddModal(false);
              setToast(`${c.name} added successfully`);
            }}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {editingClient && (
          <ClientModal
            key="edit-client"
            initial={editingClient}
            onSave={c => {
              updateClientInStore(c);
              setEditingClient(null);
              if (selected?.id === c.id) setSelected(c);
              setToast(`${c.name} updated`);
            }}
            onClose={() => setEditingClient(null)}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-[13.5px] font-semibold">{toast}</p>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
