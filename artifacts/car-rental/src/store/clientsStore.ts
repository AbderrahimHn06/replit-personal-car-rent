import { makeStore } from "./baseStore";
import { Client, ClientStatus, Money } from "./types";
import { clients as initialClients, blockedClients as initialBlockedClients } from "@/data/dashboardData";

const USD = (amount: number): Money => ({ amount, currencyCode: "USD" });

export const INITIAL_CLIENTS: Client[] = [
  ...initialClients.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    whatsapp: c.whatsapp,
    email: c.email,
    city: c.city,
    address: c.address,
    nationality: c.nationality,
    idNumber: c.idNumber,
    licenseNumber: c.licenseNumber,
    licenseExpiry: c.licenseExpiry,
    source: c.source,
    status: c.status as ClientStatus,
    joinedDate: c.joinedDate,
    totalRentals: c.totalRentals,
    activeRentals: c.activeRentals || 0,
    completedRentals: c.completedRentals || 0,
    cancelledRentals: c.cancelledRentals || 0,
    totalSpend: USD(c.totalSpend || 0),
    lastRentalDate: c.lastRentalDate,
    trustScore: c.trustScore || 75,
    lateReturns: c.lateReturns || 0,
    damages: c.damages || 0,
    depositHeld: USD(c.depositHeld || 0),
    depositReturned: USD(c.depositReturned || 0),
    pendingBalance: USD(c.pendingBalance || 0),
    internalNotes: c.internalNotes,
    warningNotes: c.warningNotes,
    dateOfBirth: c.dateOfBirth,
  })),
  ...initialBlockedClients.map(bc => ({
    id: bc.id,
    name: bc.name,
    phone: bc.phone,
    whatsapp: bc.phone,
    email: "",
    city: "Oran",
    address: "",
    nationality: "Algerian",
    idNumber: "",
    licenseNumber: "N/A",
    licenseExpiry: "",
    source: "walk-in" as const,
    status: "blocked" as const,
    joinedDate: bc.blockedDate,
    totalRentals: bc.totalRentals,
    activeRentals: 0,
    completedRentals: bc.totalRentals,
    cancelledRentals: 0,
    totalSpend: USD(0),
    lastRentalDate: undefined,
    trustScore: 30,
    lateReturns: 0,
    damages: 0,
    depositHeld: USD(0),
    depositReturned: USD(0),
    pendingBalance: USD(0),
    blockedReason: bc.reason,
    blockedRentalRef: bc.relatedRental,
    internalNotes: "",
    warningNotes: "",
  }))
];

export const clientStore = makeStore<Client[]>("clients", INITIAL_CLIENTS);

export function useClients() {
  return clientStore.useValue();
}

export function getClients() {
  return clientStore.getValue();
}

export function addClientToStore(c: Client) {
  clientStore.setValue([c, ...clientStore.getValue()]);
}

export function updateClientInStore(c: Client) {
  clientStore.setValue(clientStore.getValue().map(x => x.id === c.id ? c : x));
}

export function removeClientFromStore(id: string) {
  clientStore.setValue(clientStore.getValue().filter(x => x.id !== id));
}

// Blocked client mappings for backwards compatibility
export function useBlockedClients() {
  const clients = useClients();
  return clients
    .filter(c => c.status === "blocked")
    .map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      reason: c.blockedReason || "No reason specified",
      blockedDate: c.joinedDate || new Date().toISOString().split("T")[0],
      totalRentals: c.totalRentals,
      relatedRental: c.blockedRentalRef || "N/A",
    }));
}

export function getBlockedClients() {
  return clientStore.getValue()
    .filter(c => c.status === "blocked")
    .map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      reason: c.blockedReason || "No reason specified",
      blockedDate: c.joinedDate || new Date().toISOString().split("T")[0],
      totalRentals: c.totalRentals,
      relatedRental: c.blockedRentalRef || "N/A",
    }));
}

export function addBlockedClient(bc: { id: string; name: string; phone: string; reason: string; blockedDate: string; totalRentals: number; relatedRental: string }) {
  const existing = clientStore.getValue().find(c => c.id === bc.id || c.phone === bc.phone);
  if (existing) {
    updateClientInStore({
      ...existing,
      status: "blocked",
      blockedReason: bc.reason,
      joinedDate: bc.blockedDate,
      totalRentals: bc.totalRentals,
      blockedRentalRef: bc.relatedRental,
    });
  } else {
    const newClient: Client = {
      id: bc.id,
      name: bc.name,
      phone: bc.phone,
      whatsapp: bc.phone,
      email: "",
      city: "Oran",
      address: "",
      nationality: "Algerian",
      licenseNumber: "N/A",
      source: "walk-in",
      status: "blocked",
      joinedDate: bc.blockedDate,
      totalRentals: bc.totalRentals,
      activeRentals: 0,
      completedRentals: bc.totalRentals,
      cancelledRentals: 0,
      totalSpend: USD(0),
      depositHeld: USD(0),
      depositReturned: USD(0),
      pendingBalance: USD(0),
      trustScore: 30,
      lateReturns: 0,
      damages: 0,
      blockedReason: bc.reason,
      blockedRentalRef: bc.relatedRental,
    };
    addClientToStore(newClient);
  }
}

export function removeBlockedClient(id: string) {
  const existing = clientStore.getValue().find(c => c.id === id);
  if (existing) {
    updateClientInStore({
      ...existing,
      status: "active",
      blockedReason: undefined,
      blockedRentalRef: undefined,
    });
  }
}
