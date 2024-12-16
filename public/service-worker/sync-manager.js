class SyncManager {
  constructor() {
    this.dbName = 'pawcare-offline-store';
    this.version = 1;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        ['health_records', 'medications', 'grooming_tasks', 'dogs'].forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
    });
  }

  async addToQueue(storeName, data) {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    const record = {
      id: crypto.randomUUID(),
      synced: false,
      data,
      timestamp: new Date().toISOString()
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

  async getUnsynced(storeName) {
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

  async markSynced(storeName, id) {
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

const syncManager = new SyncManager();

async function syncData(storeName) {
  const records = await syncManager.getUnsynced(storeName);
  
  for (const record of records) {
    try {
      const response = await fetch(`/api/${storeName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record.data)
      });

      if (response.ok) {
        await syncManager.markSynced(storeName, record.id);
      }
    } catch (error) {
      console.error(`Sync failed for ${storeName}:`, error);
    }
  }
}