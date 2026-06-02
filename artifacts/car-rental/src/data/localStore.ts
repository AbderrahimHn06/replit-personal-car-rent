import { useState, useEffect } from "react";
import { DashboardRental, rentals as initialRentals, DashboardClient, clients as initialClients, FleetCar } from "./dashboardData";

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

/* ─── Currency Settings ────────────────────────────────────────── */
export type CurrencyCode = "DZD" | "USD" | "EUR";
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = { DZD: "DA", USD: "$", EUR: "€" };
export const CURRENCY_NAMES: Record<CurrencyCode, string> = { DZD: "Algerian Dinar (DZD)", USD: "US Dollar (USD)", EUR: "Euro (EUR)" };
export const CURRENCY_RATES: Record<CurrencyCode, number> = { DZD: 135, USD: 1, EUR: 0.92 };

export interface CurrencySettings {
  mainCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
}

let _currencySettings: CurrencySettings = {
  mainCurrency: "DZD",
  supportedCurrencies: ["DZD", "USD", "EUR"],
};
const _currencyListeners = new Set<() => void>();
function notifyCurrency() { _currencyListeners.forEach(fn => fn()); }

export function useCurrencySettings(): CurrencySettings {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _currencyListeners.add(refresh);
    return () => { _currencyListeners.delete(refresh); };
  }, []);
  return _currencySettings;
}

export function updateCurrencySettings(s: Partial<CurrencySettings>): void {
  _currencySettings = { ..._currencySettings, ...s };
  notifyCurrency();
}

export function getCarPriceInCurrency(car: FleetCar, currency: CurrencyCode): number {
  const p = car.prices?.[currency];
  if (p != null) return p;
  return Math.round(car.pricePerDay * CURRENCY_RATES[currency]);
}

/* ─── Language Settings ────────────────────────────────────────── */
export type LanguageCode = "fr" | "en" | "ar";
export const LANGUAGE_NAMES: Record<LanguageCode, string> = { fr: "Français", en: "English", ar: "العربية" };

export interface LanguageSettings {
  mainLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
}

let _languageSettings: LanguageSettings = {
  mainLanguage: "fr",
  supportedLanguages: ["fr", "en", "ar"],
};
const _langListeners = new Set<() => void>();
function notifyLanguage() { _langListeners.forEach(fn => fn()); }

export function useLanguageSettings(): LanguageSettings {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _langListeners.add(refresh);
    return () => { _langListeners.delete(refresh); };
  }, []);
  return _languageSettings;
}

export function updateLanguageSettings(s: Partial<LanguageSettings>): void {
  _languageSettings = { ..._languageSettings, ...s };
  notifyLanguage();
}

/* ─── Notifications ────────────────────────────────────────────── */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "rental" | "booking" | "alert" | "client" | "maintenance";
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n-1", title: "Rental Overdue", message: "Fatima Ziani — Kia Picanto overdue since 31 May", time: "2 hours ago", read: false, type: "alert" },
  { id: "n-2", title: "New Booking Request", message: "Aissa Rahmani — Hyundai Tucson, 14–18 Jun", time: "4 hours ago", read: false, type: "booking" },
  { id: "n-3", title: "New Booking Request", message: "Nadia Berkouk — Renault Clio 5, 8–12 Jun", time: "5 hours ago", read: false, type: "booking" },
  { id: "n-4", title: "Rental Confirmed", message: "Karima Benali picked up Peugeot 208 — RNT-2026-0069", time: "Yesterday", read: true, type: "rental" },
  { id: "n-5", title: "Vehicle Needs Attention", message: "Mercedes C-Class — AC compressor replacement in progress", time: "Yesterday", read: true, type: "maintenance" },
  { id: "n-6", title: "Client Blocked Alert", message: "Reda Chaouch attempted to book — access denied", time: "2 days ago", read: true, type: "alert" },
  { id: "n-7", title: "Rental Completed", message: "Sarah Johnson returned Dacia Duster on time", time: "3 days ago", read: true, type: "rental" },
];

let _notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];
const _notifListeners = new Set<() => void>();
function notifyNotifications() { _notifListeners.forEach(fn => fn()); }

export function useNotifications(): AppNotification[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _notifListeners.add(refresh);
    return () => { _notifListeners.delete(refresh); };
  }, []);
  return _notifications;
}

export function markNotificationRead(id: string): void {
  _notifications = _notifications.map(n => n.id === id ? { ...n, read: true } : n);
  notifyNotifications();
}

export function markAllNotificationsRead(): void {
  _notifications = _notifications.map(n => ({ ...n, read: true }));
  notifyNotifications();
}
