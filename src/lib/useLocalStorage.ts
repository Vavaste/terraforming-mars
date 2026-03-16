"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, [key]);

  const setAndPersist = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore quota errors
        }
        return resolved;
      });
    },
    [key]
  );

  // Return default until loaded to avoid hydration mismatch
  if (!loaded) return [defaultValue, setAndPersist];
  return [value, setAndPersist];
}
