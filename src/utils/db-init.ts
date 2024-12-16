interface IDBDatabase {
  objectStoreNames: DOMStringList;
  createObjectStore(name: string, options?: IDBObjectStoreParameters): IDBObjectStore;
  transaction(storeNames: string | string[], mode?: IDBTransactionMode): IDBTransaction;
}

const DB_NAME = 'pawcare-db';
const DB_VERSION = 2; // Increment version to trigger upgrade

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

      if (!db.objectStoreNames.contains('shared_content')) {
        db.createObjectStore('shared_content', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
      }
    };
  });
}