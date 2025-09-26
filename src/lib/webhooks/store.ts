import { WebhookEvent } from '@/app/types'

// lib/webhook-store.ts
class WebhookStore {
  private events: WebhookEvent[] = []
  private listeners: Set<(events: WebhookEvent[]) => void> = new Set()

  addEvent (event: WebhookEvent): void {
    this.events.unshift(event) // Add to beginning

    // Keep only last 50 events
    if (this.events.length > 50) {
      this.events = this.events.slice(0, 50)
    }

    this.notifyListeners()
  }

  getEvents (): WebhookEvent[] {
    return [...this.events]
  }

  subscribe (listener: (events: WebhookEvent[]) => void): () => void {
    this.listeners.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners (): void {
    this.listeners.forEach((listener) => listener(this.getEvents()))
  }
}

export const webhookStore = new WebhookStore()
