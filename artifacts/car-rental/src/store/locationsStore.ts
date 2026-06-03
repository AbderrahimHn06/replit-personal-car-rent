import { makeStore } from "./baseStore";
import { Location } from "./types";

export const INITIAL_LOCATIONS: Location[] = [
  { id: "loc-1", name: "Oran Airport", address: "Ahmed Ben Bella Airport, Es Senia", city: "Oran", notes: "Terminal 1 arrivals hall", isActive: true },
  { id: "loc-2", name: "Oran City Center", address: "Place du 1er Novembre, Oran", city: "Oran", notes: "", isActive: true },
  { id: "loc-3", name: "Agency Main Office", address: "Rue Ahmed Zabana, Oran 31000", city: "Oran", notes: "Main office, free parking available", isActive: true },
  { id: "loc-4", name: "Es Senia", address: "Es Senia District, Oran", city: "Oran", notes: "", isActive: true },
  { id: "loc-5", name: "Ahmed Ben Bella Airport", address: "Es Senia International, Oran", city: "Oran", notes: "International terminal", isActive: false },
];

export const locStore = makeStore<Location[]>("locations", INITIAL_LOCATIONS);

export function useLocations() {
  return locStore.useValue();
}

export function getLocations() {
  return locStore.getValue();
}

export function useActiveLocations() {
  return useLocations().filter(l => l.isActive);
}

export function addLocation(l: Location) {
  locStore.setValue([...locStore.getValue(), l]);
}

export function updateLocation(l: Location) {
  locStore.setValue(locStore.getValue().map(x => x.id === l.id ? l : x));
}

export function removeLocation(id: string) {
  locStore.setValue(locStore.getValue().filter(x => x.id !== id));
}
