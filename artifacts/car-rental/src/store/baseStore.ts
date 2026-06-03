import { useState, useEffect } from "react";

const STORE_VERSION = "v1";

export function makeStore<T>(key: string, initial: T) {
  let _value = initial;

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(`eliteride_${STORE_VERSION}_${key}`);
      if (saved !== null) {
        _value = JSON.parse(saved);
      } else {
        localStorage.setItem(`eliteride_${STORE_VERSION}_${key}`, JSON.stringify(initial));
      }
    } catch (e) {
      console.error(`Failed to hydrate store for key ${key}:`, e);
    }
  }

  const _listeners = new Set<() => void>();

  function notify() {
    _listeners.forEach(fn => fn());
  }

  function useValue(): T {
    const [, tick] = useState(0);
    useEffect(() => {
      const refresh = () => tick(t => t + 1);
      _listeners.add(refresh);
      return () => {
        _listeners.delete(refresh);
      };
    }, []);
    return _value;
  }

  function getValue(): T {
    return _value;
  }

  function setValue(next: T) {
    _value = next;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`eliteride_${STORE_VERSION}_${key}`, JSON.stringify(next));
      } catch (e) {
        console.error(`Failed to save store for key ${key}:`, e);
      }
    }
    notify();
  }

  return { useValue, getValue, setValue, notify };
}
