import { makeStore } from "./baseStore";
import { MaintenanceRecord, Money } from "./types";
import { maintenance as initialMaintenance, fleet as rawFleet } from "@/data/dashboardData";
import { updateVehicleStatus } from "./fleetStore";
import { removeAlertByRelatedId } from "./alertsStore";

const USD = (amount: number): Money => ({ amount, currencyCode: "USD" });

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = initialMaintenance.map(m => {
  const car = rawFleet.find(c => c.plate === m.plate);
  return {
    id: m.id,
    car: m.car,
    plate: m.plate,
    vehicleId: car?.id,
    type: m.type,
    status: m.status as any,
    scheduledDate: m.scheduledDate,
    completedDate: m.completedDate,
    nextServiceDate: m.nextServiceDate,
    notes: m.notes,
    mileage: m.mileage,
    garage: m.garage,
    estimatedCost: USD(m.estimatedCost),
  };
});

export const maintenanceStore = makeStore<MaintenanceRecord[]>("maintenance", INITIAL_MAINTENANCE);

export function useMaintenance() {
  return maintenanceStore.useValue();
}

export function getMaintenance() {
  return maintenanceStore.getValue();
}

export function addMaintenanceItem(m: MaintenanceRecord) {
  const records = maintenanceStore.getValue();
  maintenanceStore.setValue([m, ...records]);

  if (m.status === "in-progress") {
    if (m.vehicleId) updateVehicleStatus(m.vehicleId, "maintenance");
    else if (m.plate) updateVehicleStatus(m.plate, "maintenance");
  }
}

export function updateMaintenanceItem(id: string, changes: Partial<MaintenanceRecord>) {
  const records = maintenanceStore.getValue();
  const next = records.map(m => m.id === id ? { ...m, ...changes } : m);
  maintenanceStore.setValue(next);

  const updated = next.find(m => m.id === id);
  if (updated && changes.status === "completed") {
    if (updated.vehicleId) updateVehicleStatus(updated.vehicleId, "available");
    else if (updated.plate) updateVehicleStatus(updated.plate, "available");
    removeAlertByRelatedId(id);
  } else if (updated && changes.status === "in-progress") {
    if (updated.vehicleId) updateVehicleStatus(updated.vehicleId, "maintenance");
    else if (updated.plate) updateVehicleStatus(updated.plate, "maintenance");
  }
}

export function removeMaintenanceItem(id: string) {
  maintenanceStore.setValue(maintenanceStore.getValue().filter(m => m.id !== id));
}
