import { useState, useEffect } from "react";
import { DashboardRental, rentals as initialRentals, DashboardClient, clients as initialClients } from "./dashboardData";

/* ─── Agency Locations ─────────────────────────────────────────── */
export interface AgencyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  notes: string;
  isActive: boolean;
}

const INITIAL_LOCATIONS: AgencyLocation[] = [
  { id: "loc-1", name: "Oran Airport", address: "Ahmed Ben Bella Airport, Es Senia", city: "Oran", notes: "Terminal 1 arrivals hall", isActive: true },
  { id: "loc-2", name: "Oran City Center", address: "Place du 1er Novembre, Oran", city: "Oran", notes: "", isActive: true },
  { id: "loc-3", name: "Agency Main Office", address: "Rue Ahmed Zabana, Oran 31000", city: "Oran", notes: "Main office, free parking available", isActive: true },
  { id: "loc-4", name: "Es Senia", address: "Es Senia District, Oran", city: "Oran", notes: "", isActive: true },
  { id: "loc-5", name: "Ahmed Ben Bella Airport", address: "Es Senia International, Oran", city: "Oran", notes: "International terminal", isActive: false },
];

let _locations: AgencyLocation[] = [...INITIAL_LOCATIONS];
const _locListeners = new Set<() => void>();
function notifyLocations() { _locListeners.forEach(fn => fn()); }

export function useLocations(): AgencyLocation[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _locListeners.add(refresh);
    return () => { _locListeners.delete(refresh); };
  }, []);
  return _locations;
}

export function useActiveLocations(): AgencyLocation[] {
  const all = useLocations();
  return all.filter(l => l.isActive);
}

export function addLocation(l: AgencyLocation): void { _locations = [..._locations, l]; notifyLocations(); }
export function updateLocation(l: AgencyLocation): void { _locations = _locations.map(x => x.id === l.id ? l : x); notifyLocations(); }
export function removeLocation(id: string): void { _locations = _locations.filter(x => x.id !== id); notifyLocations(); }

/* ─── Rentals ──────────────────────────────────────────────────── */
let _rentals: DashboardRental[] = [...initialRentals];
const _rentalListeners = new Set<() => void>();
function notifyRentals() { _rentalListeners.forEach(fn => fn()); }

export function useRentals(): DashboardRental[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _rentalListeners.add(refresh);
    return () => { _rentalListeners.delete(refresh); };
  }, []);
  return _rentals;
}

export function getRentals(): DashboardRental[] { return _rentals; }

export function addRental(r: DashboardRental): void {
  _rentals = [r, ..._rentals];
  notifyRentals();
}

export function updateRental(id: string, changes: Partial<DashboardRental>): void {
  _rentals = _rentals.map(r => r.id === id ? { ...r, ...changes } : r);
  notifyRentals();
}

/* ─── Clients ──────────────────────────────────────────────────── */
let _clients: DashboardClient[] = [...initialClients];
const _clientListeners = new Set<() => void>();
function notifyClients() { _clientListeners.forEach(fn => fn()); }

export function useClients(): DashboardClient[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _clientListeners.add(refresh);
    return () => { _clientListeners.delete(refresh); };
  }, []);
  return _clients;
}

export function getClients(): DashboardClient[] { return _clients; }

export function addClientToStore(c: DashboardClient): void {
  _clients = [c, ..._clients];
  notifyClients();
}

export function updateClientInStore(c: DashboardClient): void {
  _clients = _clients.map(x => x.id === c.id ? c : x);
  notifyClients();
}

export function removeClientFromStore(id: string): void {
  _clients = _clients.filter(x => x.id !== id);
  notifyClients();
}
