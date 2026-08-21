export interface SafeStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

class MemoryStorage implements SafeStorageAdapter {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

export function createSafeStorage(): SafeStorageAdapter {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return {
        getItem: (k) => window.localStorage.getItem(k),
        setItem: (k, v) => window.localStorage.setItem(k, v),
        removeItem: (k) => window.localStorage.removeItem(k),
        clear: () => window.localStorage.clear(),
      };
    }
  } catch {
    // Fall back to in-memory storage if localStorage is unavailable
  }
  return new MemoryStorage();
}

export const safeStorage = createSafeStorage();
