const DB_NAME = 'pawcare-db';
const DB_VERSION = 1;

interface SyncableRecord {
  id: string;
  synced: boolean;
  data: any;
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('health_records')) {
        db.createObjectStore('health_records', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('medications')) {
        db.createObjectStore('medications', { keyPath: 'id' });
      }
    };
  });
}

export async function addToSyncQueue(storeName: string, data: any): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const record: SyncableRecord = {
      id: crypto.randomUUID(),
      synced: false,
      data
    };
    
    const request = store.add(record);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Request background sync
      if ('serviceWorker' in navigator && 'sync' in registration) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register(`sync-${storeName}`);
        });
      }
      resolve();
    };
  });
}

export async function getUnsyncedRecords(storeName: string): Promise<SyncableRecord[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const records = request.result.filter(record => !record.synced);
      resolve(records);
    };
  });
}

export async function markAsSynced(storeName: string, id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const record = request.result;
      record.synced = true;
      store.put(record);
      resolve();
    };
  });
}