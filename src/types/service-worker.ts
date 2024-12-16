export interface SyncEvent extends Event {
  tag: string;
  waitUntil(promise: Promise<any>): void;
}

export interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  };
}

export interface SyncableRecord {
  id: string;
  synced: boolean;
  data: any;
}