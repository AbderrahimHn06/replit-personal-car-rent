# EliteRide Car Rental

A premium car rental management system for agencies — manage fleet, clients, bookings, availability, maintenance, and settings from one dashboard.

## Run & Operate

- `PORT=22460 BASE_PATH=/ pnpm --filter @workspace/car-rental run dev` — run the frontend (workflow: "Start application")
- Frontend-only app — no backend/API server needed for the current build

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- UI: Lucide icons, custom components (no component library)
- State: module-level reactive store (localStore.ts) — no Redux/Context needed
- Data: mock data only (dashboardData.ts + localStore.ts)

## Where things live

- `artifacts/car-rental/src/` — all frontend source
- `artifacts/car-rental/src/data/dashboardData.ts` — source of truth for all types and mock data (FleetCar, DashboardClient, DashboardRental, etc.)
- `artifacts/car-rental/src/data/localStore.ts` — shared reactive state for locations and rentals (module-level mutable arrays + React hooks)
- `artifacts/car-rental/src/pages/Dashboard.tsx` — top-level layout + section routing (internal state, no URL routing)
- `artifacts/car-rental/src/pages/dashboard/` — one file per dashboard section

## Architecture decisions

- **No URL routing for sections** — Dashboard.tsx uses `useState` + conditional rendering. Navigation is sidebar-driven.
- **Shared reactive state without Context** — `localStore.ts` uses module-level mutable arrays + Set of listener functions + custom hooks (useState tick pattern). Works across hot reloads.
- **Frontend-only** — no API calls, no DB. All data lives in `dashboardData.ts` (static) and `localStore.ts` (mutable at runtime).
- **Locations flow** — Settings manages `AgencyLocation[]` via localStore. Availability and CreateRentalModal read `useActiveLocations()` from the same store, so adding locations in Settings immediately shows up in dropdowns.
- **VehicleFormFields shared component** — both AddVehicleModal and EditVehicleModal in Fleet.tsx reuse the same form fields component to avoid duplication.

## Product

- **Overview** — KPI summary, recent activity, alerts
- **Rentals** — booking requests (online), walk-in rentals, full rental lifecycle management
- **Fleet** — vehicle cards/list, per-car schedule calendar, full Add/Edit vehicle modals (30+ fields: pricing, docs, maintenance, VIN, etc.)
- **Availability** — date/time + location search, availability grid, Book button → CreateRentalModal (client dropdown, location dropdowns, deposit, notes)
- **Clients** — premium CRM: KPI cards, tabs (All/Online/Walk-in/VIP/Blocked), table with trust bar, ClientDrawer (Overview/History/Docs/Notes/Payments)
- **Maintenance** — maintenance schedule and status
- **Alerts** — operational alerts with severity
- **Reports** — revenue and fleet analytics
- **Settings** — agency info, business hours, Locations management (add/edit/disable/delete), terms & conditions, branding

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- App runs on port **22460** (not 5000). Workflow: `PORT=22460 BASE_PATH=/ pnpm --filter @workspace/car-rental run dev`
- `localStore.ts` must be imported for any reactive state — don't import directly from `dashboardData.ts` for mutable data
- `FleetCar.doors` is required (not optional) — always include it in new car objects
- `ClientStatus` includes `"new" | "vip"` in addition to `"active" | "blocked"`
