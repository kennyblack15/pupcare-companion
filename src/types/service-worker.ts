export interface SyncEvent extends Event {
  tag: string;
  waitUntil(promise: Promise<void>): void;
}

export interface SyncManager {
  register(tag: string): Promise<void>;
}

export interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: SyncManager;
}

export interface SyncableRecord {
  id: string;
  synced: boolean;
  data: any;
}