const etagStore = new Map<string, string>();

export const etagAdapter = {
  get(url: string): string | undefined {
    return etagStore.get(url);
  },
  set(url: string, etag: string): void {
    if (etag) {
      etagStore.set(url, etag);
    }
  },
  remove(url: string): void {
    etagStore.delete(url);
  },
  clear(): void {
    etagStore.clear();
  },
};
