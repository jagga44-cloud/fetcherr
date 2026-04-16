// Shared mutable sync state — updated by runSync(), read by the UI

export let lastSyncAt: string | null = null
export let nextSyncAt: string | null = null

export function markSyncComplete() {
  lastSyncAt  = new Date().toISOString()
  nextSyncAt  = new Date(Date.now() + 60 * 60 * 1000).toISOString()
}
