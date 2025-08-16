import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing timeouts with automatic cleanup
 * Prevents memory leaks by ensuring all timeouts are cleared on unmount
 */
export function useTimeoutCleanup() {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = global.setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);
    
    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  const clearTimeout = useCallback((timeout: NodeJS.Timeout) => {
    global.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => global.clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  return {
    setTimeout,
    clearTimeout,
    clearAllTimeouts,
    activeTimeouts: timeoutsRef.current.size
  };
}

/**
 * Custom hook for managing a single timeout with automatic cleanup
 * Useful for simple timeout scenarios like showing temporary feedback
 */
export function useSingleTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = global.setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);

    return timeoutRef.current;
  }, []);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      global.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    setTimeout,
    clearTimeout,
    isActive: timeoutRef.current !== null
  };
}
