/// <reference lib="webworker" />

interface SyncEvent extends Event {
  tag: string;
  waitUntil(promise: Promise<any>): void;
}

export async function syncMedications(): Promise<void> {
  try {
    const response = await fetch('/api/sync-medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Medication sync failed');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}