---
name: EliteRide port & routing
description: App runs on 22460; no URL routing — sections use internal state
---

# Setup facts

- Workflow: `PORT=22460 BASE_PATH=/ pnpm --filter @workspace/car-rental run dev`
- `Dashboard.tsx` renders sections with `useState<Section>` + conditional rendering — no wouter/react-router for dashboard sections
- New sections: add to `Section` type union, add to `NAV_GROUPS` array, add conditional render in the main content area

**Why:** Simpler than URL routing for an internal dashboard. No deep linking needed.
