import { makeStore } from "./baseStore";
import { Rental, RentalStatus, Money } from "./types";
import { rentals as initialRentals, clients as rawClients, fleet as rawFleet } from "@/data/dashboardData";
import { updateVehicleStatus } from "./fleetStore";
import { getClients, updateClientInStore, addClientToStore } from "./clientsStore";
import { addActivityItem } from "./recentActivityStore";
import { addNotification } from "./notificationsStore";
import { removeAlertByRelatedId } from "./alertsStore";
import { addPayment } from "./paymentsStore";

const USD = (amount: number): Money => ({ amount, currencyCode: "USD" });

export const INITIAL_RENTALS: Rental[] = initialRentals.map(r => {
  const car = rawFleet.find(c => c.plate === r.plate);
  const client = rawClients.find(cl => cl.phone === r.clientPhone || cl.name.toLowerCase() === r.client.toLowerCase());
  return {
    id: r.id,
    reference: r.reference,
    clientId: client?.id,
    vehicleId: car?.id,
    client: r.client,
    clientPhone: r.clientPhone,
    car: r.car,
    plate: r.plate,
    startDate: r.startDate,
    endDate: r.endDate,
    totalPrice: USD(r.totalPrice),
    deposit: USD(r.deposit),
    status: r.status as RentalStatus,
    source: r.source,
    pickupLocation: r.pickupLocation,
    returnLocation: r.returnLocation,
    driverLicense: r.driverLicense,
    notes: r.notes,
  };
});

export const rentalStore = makeStore<Rental[]>("rentals", INITIAL_RENTALS);

export function useRentals() {
  return rentalStore.useValue();
}

export function getRentals() {
  return rentalStore.getValue();
}

export function addRental(r: Rental) {
  const rentals = rentalStore.getValue();
  rentalStore.setValue([r, ...rentals]);

  // Sync vehicle status
  let nextStatus: "available" | "reserved" | "rented" | "maintenance" = "available";
  if (r.status === "active" || r.status === "overdue") nextStatus = "rented";
  else if (r.status === "reserved") nextStatus = "reserved";
  else if (r.status === "completed") nextStatus = "available";
  
  if (r.vehicleId) {
    updateVehicleStatus(r.vehicleId, nextStatus);
  } else if (r.plate) {
    updateVehicleStatus(r.plate, nextStatus);
  }

  // Update client statistics
  const clients = getClients();
  const client = clients.find(c => c.id === r.clientId || c.phone === r.clientPhone || c.name.toLowerCase() === r.client.toLowerCase());

  if (client) {
    updateClientInStore({
      ...client,
      totalRentals: client.totalRentals + 1,
      activeRentals: client.activeRentals + (r.status === "active" || r.status === "overdue" ? 1 : 0),
      totalSpend: { amount: client.totalSpend.amount + r.totalPrice.amount, currencyCode: client.totalSpend.currencyCode },
      depositHeld: { amount: client.depositHeld.amount + (r.status !== "completed" ? r.deposit.amount : 0), currencyCode: client.depositHeld.currencyCode },
      lastRentalDate: r.startDate,
    });
  } else {
    const newClient = {
      id: r.clientId || `cl-${Date.now()}`,
      name: r.client,
      phone: r.clientPhone,
      whatsapp: r.clientPhone,
      email: "",
      city: "Oran",
      address: "",
      nationality: "Algerian",
      licenseNumber: r.driverLicense,
      source: r.source,
      status: "active" as const,
      joinedDate: new Date().toISOString().split("T")[0],
      totalRentals: 1,
      activeRentals: r.status === "active" || r.status === "overdue" ? 1 : 0,
      completedRentals: r.status === "completed" ? 1 : 0,
      cancelledRentals: 0,
      totalSpend: r.totalPrice,
      depositHeld: r.status !== "completed" ? r.deposit : USD(0),
      depositReturned: r.status === "completed" ? r.deposit : USD(0),
      pendingBalance: USD(0),
      lastRentalDate: r.startDate,
      trustScore: 75,
      lateReturns: 0,
      damages: 0,
    };
    addClientToStore(newClient);
  }

  // Log activity
  addActivityItem({
    id: `act-${Date.now()}`,
    type: "rental",
    title: r.status === "active" ? "Rental Started" : "Booking Confirmed",
    description: `${r.client} — ${r.car} (${r.reference})`,
    time: "Just now",
    icon: r.status === "active" ? "🔑" : "✅",
  });

  // Record payment if active immediately (e.g. walk-in)
  if (r.status === "active" || r.status === "overdue") {
    addPayment({
      id: `pay-${Date.now()}-rental`,
      rentalId: r.id,
      clientId: r.clientId || r.clientPhone,
      amount: r.totalPrice,
      paymentMethod: r.source === "walk-in" ? "Cash" : "Credit Card",
      paymentType: "Rental",
      createdAt: new Date().toISOString(),
    });
  }

  // Push notification
  addNotification({
    id: `n-${Date.now()}`,
    title: r.status === "active" ? "Rental Started" : "Booking Confirmed",
    message: `${r.client} — ${r.car} (${r.reference})`,
    time: "Just now",
    read: false,
    type: "rental",
  });
}

export function updateRental(id: string, changes: Partial<Rental>) {
  const rentals = rentalStore.getValue();
  const rental = rentals.find(r => r.id === id);
  if (!rental) return;

  const updatedRental = { ...rental, ...changes };
  rentalStore.setValue(rentals.map(r => r.id === id ? updatedRental : r));

  if (changes.status) {
    let nextVehicleStatus: "available" | "reserved" | "rented" | "maintenance" = "available";
    if (changes.status === "active" || changes.status === "overdue") nextVehicleStatus = "rented";
    else if (changes.status === "reserved") nextVehicleStatus = "reserved";
    else if (changes.status === "completed") nextVehicleStatus = "available";

    if (updatedRental.vehicleId) {
      updateVehicleStatus(updatedRental.vehicleId, nextVehicleStatus);
    } else if (updatedRental.plate) {
      updateVehicleStatus(updatedRental.plate, nextVehicleStatus);
    }

    const client = getClients().find(c => c.id === updatedRental.clientId || c.phone === updatedRental.clientPhone);
    
    if (changes.status === "completed") {
      if (client) {
        updateClientInStore({
          ...client,
          activeRentals: Math.max(0, client.activeRentals - 1),
          completedRentals: client.completedRentals + 1,
          depositHeld: { amount: Math.max(0, client.depositHeld.amount - updatedRental.deposit.amount), currencyCode: client.depositHeld.currencyCode },
          depositReturned: { amount: client.depositReturned.amount + updatedRental.deposit.amount, currencyCode: client.depositReturned.currencyCode },
        });
      }

      // Add completed payment for the rental amount if not already paid
      addPayment({
        id: `pay-${Date.now()}-rental-completion`,
        rentalId: updatedRental.id,
        clientId: updatedRental.clientId || updatedRental.clientPhone,
        amount: updatedRental.totalPrice,
        paymentMethod: "Cash",
        paymentType: "Rental",
        createdAt: new Date().toISOString(),
      });

      // Record deposit refund payment
      if (updatedRental.deposit.amount > 0) {
        addPayment({
          id: `pay-${Date.now()}-deposit-release`,
          rentalId: updatedRental.id,
          clientId: updatedRental.clientId || updatedRental.clientPhone,
          amount: { amount: -updatedRental.deposit.amount, currencyCode: updatedRental.deposit.currencyCode },
          paymentMethod: "Cash",
          paymentType: "Deposit",
          createdAt: new Date().toISOString(),
        });
      }

      addActivityItem({
        id: `act-${Date.now()}`,
        type: "return",
        title: "Rental Returned",
        description: `${updatedRental.client} returned ${updatedRental.car} — ${updatedRental.reference}`,
        time: "Just now",
        icon: "🏁",
      });

      addNotification({
        id: `n-${Date.now()}`,
        title: "Rental Completed",
        message: `${updatedRental.client} returned ${updatedRental.car} — ${updatedRental.reference}`,
        time: "Just now",
        read: false,
        type: "rental",
      });

      removeAlertByRelatedId(id);
    }
  }
}
