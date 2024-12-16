import { type ServiceWorkerRegistrationWithSync, type SyncableRecord } from '../types/service-worker';
import { initDB } from './db-init';

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
    request.onsuccess = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if ('sync' in registration) {
            await (registration as ServiceWorkerRegistrationWithSync).sync.register(`sync-${storeName}`);
          } else {
            console.warn('Background Sync not supported in this browser');
          }
        } catch (error) {
          console.error('Error registering sync:', error);
        }
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