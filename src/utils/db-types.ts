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
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    sync?: SyncManager;
  }
}