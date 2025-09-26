'use client'

import { ConnectionStatus, WebhookEvent } from '@/app/types'
import { EventStatistics } from '@/server/routers/webhooks'
import { trpc } from '@/trpc/client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface EventsProviderProps {
  children: ReactNode;
}

export interface GetEventStats {
  data: EventStatistics | undefined;
  isLoading: boolean;
  error: unknown | null;
}

interface EventsCtxValues {
  events: WebhookEvent[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  eventStats: GetEventStats;
  selectedRepo: string;
  repositories: string[];
  onSelectRepo: (v: string) => void;
  isLoading: boolean;
}
const EventsCtx = createContext<EventsCtxValues | null>(null)

const EventsCtxProvider = ({ children }: EventsProviderProps) => {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting')

  const [eventStats, setEventStats] = useState<GetEventStats>({
    data: {
      total: 0,
      valid: 0,
      invalid: 0,
      recentHour: 0,
      dailyTotal: 0,
      eventTypes: {},
      successRate: 0,
    },
    isLoading: false,
  } as GetEventStats)

  const { data, isLoading, error } = trpc.getStats.useQuery()

  useEffect(() => {
    if (events && !isLoading) {
      setEventStats({ data, isLoading, error })
    }
  }, [events, data, isLoading, error])

  const [selectedRepo, setSelectedRepo] = useState<string>('')

  // Get unique repositories
  const repositories = useMemo(
    () => Array.from(new Set(events?.map((event) => event.repository) ?? [])),
    [events]
  )

  const onSelectRepo = useCallback((v: string) => {
    setSelectedRepo(v)
  }, [])

  useEffect(() => {
    const eventSource = new EventSource('/api/webhooks/events')

    eventSource.onopen = () => {
      setConnectionStatus('connected')
    }

    eventSource.onmessage = (event) => {
      try {
        const newEvents: WebhookEvent[] = JSON.parse(event.data)
        setEvents(newEvents)
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = () => {
      setConnectionStatus('disconnected')
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const value = useMemo(
    () => ({
      events,
      connectionStatus,
      eventStats,
      onSelectRepo,
      selectedRepo,
      repositories,
      isLoading: eventStats.isLoading,
    }),
    [
      events,
      connectionStatus,
      eventStats,
      onSelectRepo,
      selectedRepo,
      repositories,
    ]
  )
  return <EventsCtx value={value}>{children}</EventsCtx>
}

const useEventsCtx = () => {
  const ctx = useContext(EventsCtx)
  if (!ctx) throw new Error('EventsCtxProvider is missing')
  return ctx
}

export { EventsCtx, EventsCtxProvider, useEventsCtx }
