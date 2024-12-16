declare const self: ServiceWorkerGlobalScope;

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