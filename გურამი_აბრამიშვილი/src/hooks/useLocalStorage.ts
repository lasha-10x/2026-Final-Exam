import { useCallback, useEffect, useMemo, useState } from "react";
import { StorageService } from "@/models/StorageService";

// useState that survives page reloads. `guard` validates whatever was stored.
export function useLocalStorage<T>(
  key: string,
  initial: T,
  guard: (value: unknown) => value is T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const storage = useMemo(() => new StorageService<T>(key, guard), [key, guard]);
  const [value, setValue] = useState<T>(() => storage.get() ?? initial);

  useEffect(() => {
    storage.set(value);
  }, [storage, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), []);
  return [value, update];
}
