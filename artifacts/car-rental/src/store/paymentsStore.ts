import { makeStore } from "./baseStore";
import { Payment, Money } from "./types";

const USD = (amount: number): Money => ({ amount, currencyCode: "USD" });

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    rentalId: "r-5",
    clientId: "cl-6", // Lamine Bouzidi
    amount: USD(315),
    paymentMethod: "Cash",
    paymentType: "Rental",
    createdAt: "2026-05-22T19:30:00Z"
  },
  {
    id: "pay-2",
    rentalId: "r-7",
    clientId: "cl-8", // Khalil Hadjadj
    amount: USD(120),
    paymentMethod: "Cash",
    paymentType: "Rental",
    createdAt: "2026-05-14T17:00:00Z"
  },
  {
    id: "pay-3",
    rentalId: "r-8",
    clientId: "cl-9", // Nadia Berkouk
    amount: USD(160),
    paymentMethod: "Credit Card",
    paymentType: "Rental",
    createdAt: "2026-05-05T18:00:00Z"
  },
  {
    id: "pay-4",
    rentalId: "r-9",
    clientId: "bc-1", // Reda Chaouch
    amount: USD(180),
    paymentMethod: "Cash",
    paymentType: "Rental",
    createdAt: "2026-02-05T18:00:00Z"
  },
  {
    id: "pay-5",
    rentalId: "r-10",
    clientId: "cl-3", // Sarah Johnson
    amount: USD(120),
    paymentMethod: "Credit Card",
    paymentType: "Rental",
    createdAt: "2026-04-24T16:00:00Z"
  },
  {
    id: "pay-6",
    rentalId: "r-1",
    clientId: "cl-2", // Youcef Mebarki (Active Rental payment)
    amount: USD(420),
    paymentMethod: "Cash",
    paymentType: "Rental",
    createdAt: "2026-06-01T09:00:00Z"
  }
];

export const paymentsStore = makeStore<Payment[]>("payments", INITIAL_PAYMENTS);

export function usePayments() {
  return paymentsStore.useValue();
}

export function getPayments() {
  return paymentsStore.getValue();
}

export function addPayment(p: Payment) {
  paymentsStore.setValue([p, ...paymentsStore.getValue()]);
}

export function removePayment(id: string) {
  paymentsStore.setValue(paymentsStore.getValue().filter(p => p.id !== id));
}
