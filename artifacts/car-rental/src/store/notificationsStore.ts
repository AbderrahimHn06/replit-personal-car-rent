import { makeStore } from "./baseStore";
import { Notification } from "./types";

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n-1", title: "Rental Overdue", message: "Fatima Ziani — Kia Picanto overdue since 31 May", time: "2 hours ago", read: false, type: "alert" },
  { id: "n-2", title: "New Booking Request", message: "Aissa Rahmani — Hyundai Tucson, 14–18 Jun", time: "4 hours ago", read: false, type: "booking" },
  { id: "n-3", title: "New Booking Request", message: "Nadia Berkouk — Renault Clio 5, 8–12 Jun", time: "5 hours ago", read: false, type: "booking" },
  { id: "n-4", title: "Rental Confirmed", message: "Karima Benali picked up Peugeot 208 — RNT-2026-0069", time: "Yesterday", read: true, type: "rental" },
  { id: "n-5", title: "Vehicle Needs Attention", message: "Mercedes C-Class — AC compressor replacement in progress", time: "Yesterday", read: true, type: "maintenance" },
  { id: "n-6", title: "Client Blocked Alert", message: "Reda Chaouch attempted to book — access denied", time: "2 days ago", read: true, type: "alert" },
  { id: "n-7", title: "Rental Completed", message: "Sarah Johnson returned Dacia Duster on time", time: "3 days ago", read: true, type: "rental" },
];

export const notifStore = makeStore<Notification[]>("notifications", INITIAL_NOTIFICATIONS);

export function useNotifications() {
  return notifStore.useValue();
}

export function getNotifications() {
  return notifStore.getValue();
}

export function addNotification(n: Notification) {
  notifStore.setValue([n, ...notifStore.getValue()]);
}

export function markNotificationRead(id: string) {
  notifStore.setValue(notifStore.getValue().map(n => n.id === id ? { ...n, read: true } : n));
}

export function markAllNotificationsRead() {
  notifStore.setValue(notifStore.getValue().map(n => ({ ...n, read: true })));
}
