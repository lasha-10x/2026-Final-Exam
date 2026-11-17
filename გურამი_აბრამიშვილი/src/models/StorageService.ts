// The single gateway to localStorage. Reads are validated by a type guard because JSON has no types.
export class StorageService<T> {
  constructor(
    private readonly key: string,
    private readonly guard: (value: unknown) => value is T,
  ) {}

  get(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return this.guard(parsed) ? parsed : null;
    } catch {
      // Corrupted JSON or storage disabled: behave as if nothing was stored.
      return null;
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode: the app keeps working without persistence.
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }
}
