import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, User, Car, Key, MapPin, Wrench, CalendarCheck,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { useClients, useRentals, useActiveLocations, useFleet, useBookingRequests, useMaintenance } from "@/data/localStore";
import { useT } from "@/store/settingsStore";

type ResultType = "client" | "vehicle" | "rental" | "booking" | "location" | "maintenance";
type OpsTab = "bookings" | "offline" | "rentals";

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeCls?: string;
  Icon: React.ElementType;
  navSection: string;
  navTab?: OpsTab;
}

export interface GlobalSearchProps {
  onNavigate: (section: string, opsTab?: OpsTab) => void;
}

const STATUS_CLS: Record<string, string> = {
  available:    "bg-emerald-50 text-emerald-700",
  rented:       "bg-amber-50 text-amber-700",
  reserved:     "bg-indigo-50 text-indigo-700",
  maintenance:  "bg-red-50 text-red-700",
  active:       "bg-emerald-50 text-emerald-700",
  overdue:      "bg-red-50 text-red-700",
  completed:    "bg-slate-100 text-slate-500",
  blocked:      "bg-red-50 text-red-700",
  vip:          "bg-amber-50 text-amber-700",
  new:          "bg-sky-50 text-sky-700",
  confirmed:    "bg-emerald-50 text-emerald-700",
  contacted:    "bg-sky-50 text-sky-700",
  cancelled:    "bg-slate-100 text-slate-500",
  "due-soon":   "bg-amber-50 text-amber-700",
  "in-progress":"bg-sky-50 text-sky-700",
};

const GROUP_ORDER: ResultType[] = ["client", "vehicle", "rental", "booking", "location", "maintenance"];
const MAX = 4;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -8 },
};

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const t = useT();
  const [open,      setOpen]      = useState(false);
  const [query,     setQuery]     = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const clients   = useClients();
  const rentals   = useRentals();
  const locations = useActiveLocations();
  const fleet     = useFleet();
  const bookingRequests = useBookingRequests();
  const maintenance = useMaintenance();

  // Group config uses translated labels — built inside component so t() is available
  const GROUP_CFG: Record<ResultType, { label: string; Icon: React.ElementType; color: string }> = {
    client:      { label: t("search.group.clients"),     Icon: User,          color: "text-violet-600"  },
    vehicle:     { label: t("search.group.vehicles"),    Icon: Car,           color: "text-sky-600"     },
    rental:      { label: t("search.group.rentals"),     Icon: Key,           color: "text-emerald-600" },
    booking:     { label: t("search.group.bookings"),    Icon: CalendarCheck, color: "text-indigo-600"  },
    location:    { label: t("search.group.locations"),   Icon: MapPin,        color: "text-amber-600"   },
    maintenance: { label: t("search.group.maintenance"), Icon: Wrench,        color: "text-rose-600"    },
  };

  /* ── Ctrl / Cmd + K ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Lock scroll & auto-focus ── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveIdx(0);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Search ── */
  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const out: SearchResult[] = [];

    clients
      .filter(c => [c.name, c.phone, c.city, c.email ?? ""].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(c => out.push({
        type: "client", id: c.id,
        title: c.name, subtitle: `${c.phone}${c.city ? ` · ${c.city}` : ""}`,
        badge: c.status, badgeCls: STATUS_CLS[c.status] ?? "",
        Icon: User, navSection: "clients",
      }));

    fleet
      .filter(c => [c.brand, c.model, c.plate, c.type, c.color].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(c => out.push({
        type: "vehicle", id: c.id,
        title: `${c.brand} ${c.model}`, subtitle: `${c.plate} · ${c.type} · ${c.year}`,
        badge: c.status, badgeCls: STATUS_CLS[c.status] ?? "",
        Icon: Car, navSection: "fleet",
      }));

    rentals
      .filter(r => [r.reference, r.client, r.car, r.plate].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(r => out.push({
        type: "rental", id: r.id,
        title: r.reference, subtitle: `${r.client} · ${r.car}`,
        badge: r.status, badgeCls: STATUS_CLS[r.status] ?? "",
        Icon: Key, navSection: "operations", navTab: "rentals",
      }));

    bookingRequests
      .filter(b => [b.customer, b.car, b.phone].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(b => out.push({
        type: "booking", id: b.id,
        title: b.customer, subtitle: `${b.car} · ${b.pickupDate}`,
        badge: b.status, badgeCls: STATUS_CLS[b.status] ?? "",
        Icon: CalendarCheck, navSection: "operations", navTab: "bookings",
      }));

    locations
      .filter(l => [l.name, l.city, l.address].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(l => out.push({
        type: "location", id: l.id,
        title: l.name, subtitle: `${l.city} · ${l.address}`,
        Icon: MapPin, navSection: "settings",
      }));

    maintenance
      .filter(m => [m.car, m.plate, m.type, m.garage].some(v => v.toLowerCase().includes(q)))
      .slice(0, MAX)
      .forEach(m => out.push({
        type: "maintenance", id: m.id,
        title: m.car, subtitle: `${m.type} · ${m.garage}`,
        badge: m.status, badgeCls: STATUS_CLS[m.status] ?? "",
        Icon: Wrench, navSection: "maintenance",
      }));

    return out;
  }, [query, clients, rentals, locations, fleet, bookingRequests, maintenance]);

  const grouped = useMemo(() => {
    const g: Record<ResultType, SearchResult[]> = {
      client: [], vehicle: [], rental: [], booking: [], location: [], maintenance: [],
    };
    results.forEach(r => g[r.type].push(r));
    return g;
  }, [results]);

  function handleSelect(r: SearchResult) {
    onNavigate(r.navSection, r.navTab);
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[activeIdx]) handleSelect(results[activeIdx]);
    if (e.key === "Escape") setOpen(false);
  }

  const resultCountLabel = results.length > 0
    ? `${results.length} ${results.length !== 1 ? t("search.results") : t("search.result")}`
    : "";

  return (
    <>
      {/* ── Top-bar trigger (desktop) ── */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2.5 h-9 pl-3.5 pr-3 rounded-xl border border-slate-200 bg-slate-50/80 text-[12.5px] text-slate-400 hover:bg-white hover:border-slate-300 transition-all duration-200 w-[300px] lg:w-[360px] text-left cursor-pointer"
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="flex-1 truncate">{t("search.placeholder")}</span>
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200 text-[9px] font-bold text-slate-500 leading-none flex-shrink-0">
          ⌘K
        </span>
      </button>

      {/* ── Mobile icon ── */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-all duration-200 cursor-pointer"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* ── Command palette overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="search-overlay"
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setOpen(false)}
            />
            <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[8vh] pointer-events-none">
              <motion.div
                key="search-panel"
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[72vh] flex flex-col pointer-events-auto overflow-hidden border border-slate-200/80"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={e => e.stopPropagation()}
              >
                {/* Search field */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
                  <Search className="h-[18px] w-[18px] text-slate-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
                    onKeyDown={handleKey}
                    placeholder={t("search.inputPlaceholder")}
                    className="flex-1 text-[14.5px] text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                  />
                  {query ? (
                    <button
                      onClick={() => { setQuery(""); setActiveIdx(0); inputRef.current?.focus(); }}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <kbd className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400 leading-none">ESC</kbd>
                  )}
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto">
                  {!query && (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="text-[13.5px] font-semibold text-slate-500">{t("search.acrossTitle")}</p>
                      <p className="text-[12px] text-slate-400 mt-1.5 max-w-sm">
                        {t("search.acrossDesc")}
                      </p>
                      <div className="flex items-center gap-3 mt-5 flex-wrap justify-center">
                        {([
                          { icon: User,   labelKey: "search.group.clients"   },
                          { icon: Car,    labelKey: "search.group.vehicles"  },
                          { icon: Key,    labelKey: "search.group.rentals"   },
                          { icon: MapPin, labelKey: "search.group.locations" },
                        ] as const).map(({ icon: Icon, labelKey }) => (
                          <span key={labelKey} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[11.5px] font-medium text-slate-500">
                            <Icon className="h-3 w-3" /> {t(labelKey)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {query && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="text-[13.5px] font-semibold text-slate-500">{t("search.noResultsFor")} "{query}"</p>
                      <p className="text-[12px] text-slate-400 mt-1.5">{t("search.tryKeywords")}</p>
                    </div>
                  )}

                  {query && results.length > 0 && (
                    <div className="py-2">
                      {GROUP_ORDER.map(type => {
                        const group = grouped[type];
                        if (!group.length) return null;
                        const { label, Icon: GIcon, color } = GROUP_CFG[type];
                        return (
                          <div key={type} className="mb-1">
                            <div className="flex items-center gap-2 px-5 py-2">
                              <GIcon className={`h-3 w-3 ${color}`} />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                            </div>
                            {group.map(r => {
                              const flatIdx = results.indexOf(r);
                              const isActive = flatIdx === activeIdx;
                              return (
                                <button
                                  key={r.id}
                                  onMouseEnter={() => setActiveIdx(flatIdx)}
                                  onClick={() => handleSelect(r)}
                                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                                    isActive ? "bg-slate-100" : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                                    isActive ? "bg-[#1a2332]" : "bg-slate-100"
                                  }`}>
                                    <r.Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-800 leading-tight truncate">{r.title}</p>
                                    <p className="text-[11.5px] text-slate-400 truncate mt-0.5">{r.subtitle}</p>
                                  </div>
                                  {r.badge && (
                                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10.5px] font-semibold capitalize ${r.badgeCls}`}>
                                      {r.badge}
                                    </span>
                                  )}
                                  <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${isActive ? "text-slate-400" : "text-slate-200"}`} />
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-5 py-2.5 flex items-center gap-4 bg-slate-50/60 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[9.5px] font-bold text-slate-500">↑↓</kbd>
                    <span>{t("search.navigate")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[9.5px] font-bold text-slate-500">↵</kbd>
                    <span>{t("search.select")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[9.5px] font-bold text-slate-500">ESC</kbd>
                    <span>{t("search.close")}</span>
                  </div>
                  <div className="ml-auto text-[11px] text-slate-300">
                    {resultCountLabel}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
