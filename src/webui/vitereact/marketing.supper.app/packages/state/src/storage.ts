import { safeStorage } from '@enterprise/config';

export const statePersistence = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const raw = safeStorage.getItem(`ep_${key}`);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      safeStorage.setItem(`ep_${key}`, JSON.stringify(value));
    } catch {
      // safe fallback
    }
  },
  remove(key: string): void {
    try {
      safeStorage.removeItem(`ep_${key}`);
    } catch {
      // safe fallback
    }
  },
};
