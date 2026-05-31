import { useState } from "react";
import { X, Phone, Mail, MapPin, Calendar, MessageSquare, CheckCircle, XCircle, Eye } from "lucide-react";
import { bookingRequests, BookingRequest, RequestStatus } from "@/data/dashboardData";
import { Booking } from "@/data/mockData";

const FILTERS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

function statusBadge(status: RequestStatus) {
  const styles: Record<RequestStatus, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function sourceBadge(source: string) {
  const styles: Record<string, string> = {
    online: "bg-indigo-50 text-indigo-600",
    phone: "bg-purple-50 text-purple-600",
    "walk-in": "bg-teal-50 text-teal-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[source] || "bg-slate-100 text-slate-600"}`}>
      {source}
    </span>
  );
}

export function BookingRequests({ bookings }: { bookings: Booking[] }) {
  const [requests, setRequests] = useState<BookingRequest[]>(bookingRequests);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [selected, setSelected] = useState<BookingRequest | null>(null);

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const counts: Record<string, number> = {
    all: requests.length,
    new: requests.filter(r => r.status === "new").length,
    contacted: requests.filter(r => r.status === "contacted").length,
    confirmed: requests.filter(r => r.status === "confirmed").length,
    cancelled: requests.filter(r => r.status === "cancelled").length,
  };

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Online Booking Requests</h2>
          <p className="text-xs text-slate-500 mt-0.5">Requests submitted via the website</p>
        </div>
      </div>

      {/* Filter chips */}
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
            {counts[value] > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === value ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Car</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Dates</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Source</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No requests found</td></tr>
              ) : filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800 text-xs">{req.customer}</div>
                    <div className="text-[11px] text-slate-400 hidden sm:block">{req.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap">{req.phone}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 font-medium whitespace-nowrap">{req.car}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell whitespace-nowrap">
                    {req.pickupDate} → {req.returnDate}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden xl:table-cell max-w-[150px] truncate">{req.pickupLocation}</td>
                  <td className="px-4 py-3">{statusBadge(req.status)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{sourceBadge(req.source)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelected(req)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {req.status === "new" && (
                        <button
                          onClick={() => updateStatus(req.id, "contacted")}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                          title="Mark as contacted"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {(req.status === "new" || req.status === "contacted") && (
                        <button
                          onClick={() => updateStatus(req.id, "confirmed")}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">Booking Request — {selected.id}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submitted {selected.submittedAt}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Status + Source */}
              <div className="flex items-center gap-3">
                {statusBadge(selected.status)}
                {sourceBadge(selected.source)}
              </div>

              {/* Customer info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</h4>
                <p className="font-bold text-slate-800">{selected.customer}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {selected.email}
                </div>
              </div>

              {/* Rental details */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Rental Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Vehicle</p>
                    <p className="text-sm font-semibold text-slate-700">{selected.car}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Duration</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {Math.ceil((new Date(selected.returnDate).getTime() - new Date(selected.pickupDate).getTime()) / 86400000)} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {selected.pickupDate} → {selected.returnDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {selected.pickupLocation}
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                    <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Notes</h4>
                  </div>
                  <p className="text-sm text-amber-800">{selected.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selected.status === "new" && (
                  <button
                    onClick={() => updateStatus(selected.id, "contacted")}
                    className="flex-1 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-3.5 w-3.5" /> Mark Contacted
                  </button>
                )}
                {(selected.status === "new" || selected.status === "contacted") && (
                  <button
                    onClick={() => updateStatus(selected.id, "confirmed")}
                    className="flex-1 h-9 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Confirm Booking
                  </button>
                )}
                {selected.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(selected.id, "cancelled")}
                    className="h-9 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
