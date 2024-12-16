import { DBRecord } from './types';

class SyncManager {
  private dbName = 'pawcare-offline-store';
  private version = 1;

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        ['health_records', 'medications', 'grooming_tasks'].forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
    });
  }

  async addToQueue(storeName: string, data: any): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    const record: DBRecord = {
      id: crypto.randomUUID(),
      synced: false,
      data
    };

    return new Promise((resolve, reject) => {
      const request = store.add(record);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  }

  async getUnsynced(storeName: string): Promise<DBRecord[]> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const records = request.result.filter(record => !record.synced);
        resolve(records);
      };

      tx.oncomplete = () => db.close();
    });
  }

  async markSynced(storeName: string, id: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const record = request.result;
        record.synced = true;
        store.put(record);
      };

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  }
}

export const syncManager = new SyncManager();