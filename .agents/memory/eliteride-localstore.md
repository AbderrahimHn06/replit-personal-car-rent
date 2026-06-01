---
name: EliteRide local store pattern
description: How shared reactive state works in this frontend-only app without Redux/Context
---

# Pattern: module-level reactive store

`artifacts/car-rental/src/data/localStore.ts` holds locations and rentals as plain mutable arrays at module scope. Components subscribe via custom hooks.

```ts
let _arr: T[] = [...initial];
const _listeners = new Set<() => void>();

export function useArr(): T[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const refresh = () => tick(t => t + 1);
    _listeners.add(refresh);
    return () => { _listeners.delete(refresh); };
  }, []);
  return _arr;
}

export function mutate(...) { _arr = ...; _listeners.forEach(fn => fn()); }
```

**Why:** Frontend-only mock app; no need for Context provider boilerplate. Works across hot reloads since module state persists in the Vite dev server process.

**How to apply:** Any time two or more sections need to share mutable state (locations, rentals), add it to localStore.ts using this pattern.
