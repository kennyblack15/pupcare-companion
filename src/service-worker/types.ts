export interface SyncEvent extends Event {
  tag: string;
  waitUntil(promise: Promise<void>): void;
}

export interface DBRecord {
  id: string;
  synced: boolean;
  data: any;
}

export interface IDBTransactionWithPromise extends IDBTransaction {
  complete(): Promise<void>;
}