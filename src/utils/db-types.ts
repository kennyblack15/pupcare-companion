export interface SyncRecord {
  id: string;
  data: any;
  synced: boolean;
}

export interface DBSchema {
  health_records: SyncRecord[];
  medications: SyncRecord[];
}

export interface SyncManager {
  sync: (tag: string) => Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    sync?: SyncManager;
  }

  interface SyncEvent extends Event {
    tag: string;
    waitUntil(promise: Promise<void>): void;
  }
}