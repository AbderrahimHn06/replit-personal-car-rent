import { makeStore } from "./baseStore";
import { Alert } from "./types";
import { alerts as initialAlerts } from "@/data/dashboardData";

export const alertStore = makeStore<Alert[]>("alerts", [...initialAlerts] as any);

export function useAlerts() {
  return alertStore.useValue();
}

export function getAlerts() {
  return alertStore.getValue();
}

export function addAlert(a: Alert) {
  alertStore.setValue([a, ...alertStore.getValue()]);
}

export function removeAlert(id: string) {
  alertStore.setValue(alertStore.getValue().filter(a => a.id !== id));
}

export function removeAlertByRelatedId(relatedId: string) {
  alertStore.setValue(alertStore.getValue().filter(a => a.relatedId !== relatedId));
}

export function dismissAllAlerts() {
  alertStore.setValue([]);
}
