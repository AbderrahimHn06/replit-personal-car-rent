import { makeStore } from "./baseStore";
import { BookingRequest, RequestStatus, Rental, Money } from "./types";
import { bookingRequests as initialBookingRequests } from "@/data/dashboardData";
import { addRental } from "./rentalsStore";
import { getFleet, updateVehicleStatus } from "./fleetStore";
import { addActivityItem } from "./recentActivityStore";
import { addNotification } from "./notificationsStore";
import { removeAlertByRelatedId } from "./alertsStore";

export const bookingsStore = makeStore<BookingRequest[]>("bookings", [...initialBookingRequests]);

export function useBookingRequests() {
  return bookingsStore.useValue();
}

export function getBookingRequests() {
  return bookingsStore.getValue();
}

export function addBookingRequest(r: BookingRequest) {
  bookingsStore.setValue([r, ...bookingsStore.getValue()]);
}

export function updateBookingRequest(id: string, changes: Partial<BookingRequest>) {
  const bookings = bookingsStore.getValue();
  const req = bookings.find(b => b.id === id);
  if (!req) return;

  const updatedReq = { ...req, ...changes };
  bookingsStore.setValue(bookings.map(b => b.id === id ? updatedReq : b));

  if (changes.status === "confirmed") {
    const fleetCars = getFleet();
    const matchedCar = fleetCars.find(c =>
      `${c.brand} ${c.model}`.toLowerCase().includes(req.car.toLowerCase()) &&
      c.status === "available"
    ) || fleetCars.find(c =>
      `${c.brand} ${c.model}`.toLowerCase().includes(req.car.toLowerCase())
    );

    const dayCount = Math.max(1, Math.ceil((new Date(req.returnDate).getTime() - new Date(req.pickupDate).getTime()) / 86400000));
    
    // Monetary calculations
    const priceAmount = matchedCar ? matchedCar.pricePerDay.amount * dayCount : 150 * dayCount;
    const currency = matchedCar ? matchedCar.pricePerDay.currencyCode : "USD";
    
    const totalPrice: Money = { amount: priceAmount, currencyCode: currency };
    const deposit: Money = matchedCar ? matchedCar.depositAmount : { amount: 100, currencyCode: "USD" };

    const ref = `RNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    
    const newRental: Rental = {
      id: `r-${Date.now()}`,
      reference: ref,
      client: req.customer,
      clientPhone: req.phone,
      car: req.car,
      plate: matchedCar ? matchedCar.plate : "PENDING",
      startDate: req.pickupDate,
      endDate: req.returnDate,
      totalPrice,
      deposit,
      status: "reserved",
      source: req.source,
      pickupLocation: req.pickupLocation,
      returnLocation: req.returnLocation,
      driverLicense: "DL-PENDING",
      notes: req.notes,
      vehicleId: matchedCar?.id,
      clientId: req.clientId,
    };

    addRental(newRental);
    removeAlertByRelatedId(id);
  } else if (changes.status === "cancelled") {
    removeAlertByRelatedId(id);
    addActivityItem({
      id: `act-${Date.now()}`,
      type: "booking",
      title: "Booking Cancelled",
      description: `${req.customer} cancelled reservation request for ${req.car}`,
      time: "Just now",
      icon: "❌",
    });
  }
}

export function removeBookingRequest(id: string) {
  bookingsStore.setValue(bookingsStore.getValue().filter(b => b.id !== id));
}
