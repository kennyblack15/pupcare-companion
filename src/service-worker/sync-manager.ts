/// <reference lib="webworker" />
import { type SyncEvent } from '../types/service-worker';

// Queue for storing offline actions
const actionQueue = new Map();

// Register background sync
export async function registerSync(tag: string, data: any): Promise<void> {
  try {
    // Store the action in IndexedDB for later sync
    await saveToIndexedDB(tag, data);
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    } else {
      // Fallback for browsers that don't support background sync
      await processSync(tag);
    }
  } catch (error) {
    console.error('Error registering sync:', error);
    throw error;
  }
}

// Process sync events
export async function processSync(tag: string): Promise<void> {
  try {
    const data = await getFromIndexedDB(tag);
    if (!data) return;

    switch (tag) {
      case 'sync-medications':
        await syncMedications(data);
        break;
      case 'sync-health-records':
        await syncHealthRecords(data);
        break;
      case 'sync-grooming-tasks':
        await syncGroomingTasks(data);
        break;
      default:
        console.warn('Unknown sync tag:', tag);
    }

    // Clear the synced data from IndexedDB
    await clearFromIndexedDB(tag);
  } catch (error) {
    console.error('Sync processing failed:', error);
    throw error;
  }
}

// Sync medications
async function syncMedications(data: any): Promise<void> {
  try {
    const response = await fetch('/api/sync-medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Medication sync failed');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error;
  }
}

// Sync health records
async function syncHealthRecords(data: any): Promise<void> {
  try {
    const response = await fetch('/api/sync-health-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Health records sync failed');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error;
  }
}

// Sync grooming tasks
async function syncGroomingTasks(data: any): Promise<void> {
  try {
    const response = await fetch('/api/sync-grooming-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Grooming tasks sync failed');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error;
  }
}

// IndexedDB operations
async function saveToIndexedDB(tag: string, data: any): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('syncStore', 'readwrite');
  const store = tx.objectStore('syncStore');
  await store.put({ tag, data, timestamp: Date.now() });
  await tx.complete;
}

async function getFromIndexedDB(tag: string): Promise<any> {
  const db = await openDB();
  const tx = db.transaction('syncStore', 'readonly');
  const store = tx.objectStore('syncStore');
  return store.get(tag);
}

async function clearFromIndexedDB(tag: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('syncStore', 'readwrite');
  const store = tx.objectStore('syncStore');
  await store.delete(tag);
  await tx.complete;
}

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PawCareSync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('syncStore')) {
        db.createObjectStore('syncStore', { keyPath: 'tag' });
      }
    };
  });
}