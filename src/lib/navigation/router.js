import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useMemo, useCallback } from 'react'

// Custom event names for navigation lifecycle
export const ROUTER_EVENTS = {
    BEFORE_NAVIGATION: 'router:beforeNavigation',
    AFTER_NAVIGATION: 'router:afterNavigation',
    POPSTATE: 'router:popstate'
}

// Observable Router Event Emitter
class RouterEventEmitter {
    constructor() {
        this.listeners = new Map()
    }

    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set())
        }
        this.listeners.get(eventType).add(callback)

        // Return unsubscribe function
        return () => {
            const eventListeners = this.listeners.get(eventType)
            if (eventListeners) {
                eventListeners.delete(callback)
                if (eventListeners.size === 0) {
                    this.listeners.delete(eventType)
                }
            }
        }
    }

    emit(eventType, data = {}) {
        const eventListeners = this.listeners.get(eventType)
        if (eventListeners) {
            const eventData = { ...data, timestamp: Date.now() }
            eventListeners.forEach(callback => {
                try {
                    callback(eventData)
                } catch (error) {
                    console.error(`Error in router event listener for ${eventType}:`, error)
                }
            })
        }
    }

    hasListeners(eventType) {
        return this.listeners.has(eventType) && this.listeners.get(eventType).size > 0
    }

    clear() {
        this.listeners.clear()
    }
}

// Global router event emitter instance
const routerEventSource = new RouterEventEmitter()

// Export for use by custom Link component
export { routerEventSource }

// Custom hook that wraps Next.js router with navigation events (idempotent)
export function useRouter() {
    const nextRouter = useNextRouter()
    const pathname = usePathname()

    // Emit after navigation event when pathname changes (skip initial load)
    const isInitialLoadRef = useRef(true)

    useEffect(() => {
        if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false
            return
        }

        routerEventSource.emit(ROUTER_EVENTS.AFTER_NAVIGATION, {
            pathname
        })
    }, [pathname])

    // Return enhanced router with original Next.js methods plus custom ones
    return useMemo(() => {
        const push = (href, options = {}) => {
            routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION, {
                type: 'push',
                href,
                from: pathname,
                options
            })

            return nextRouter.push(href, options)
        }

        const replace = (href, options = {}) => {
            routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION, {
                type: 'replace',
                href,
                from: pathname,
                options
            })

            return nextRouter.replace(href, options)
        }

        const back = () => {
            routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION, {
                type: 'back',
                from: pathname
            })

            return nextRouter.back()
        }

        const forward = () => {
            routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION, {
                type: 'forward',
                from: pathname
            })

            return nextRouter.forward()
        }

        return {
            ...nextRouter,
            push,
            replace,
            back,
            forward,
            pathname
        }
    }, [nextRouter, pathname])
}

// Hook for handling router events and popstate
export function useRouterEvents(eventName, callback) {

    useEffect(() => {
        let unsubscribePopState = null
        // Handle popstate events specifically
        if (eventName === ROUTER_EVENTS.POPSTATE || eventName === ROUTER_EVENTS.BEFORE_NAVIGATION) {
            const handlePopState = (event) => {
                callback({
                    state: event.state,
                    timestamp: Date.now()
                })
            }

            window.addEventListener('popstate', handlePopState)
            unsubscribePopState = () => window.removeEventListener('popstate', handlePopState)
        }

        // Handle other router events through observable emitter
        const unsubscribeRouter = routerEventSource.subscribe(eventName, callback)
        return () => {
            if (unsubscribePopState) {
                unsubscribePopState()
            }
            if (unsubscribeRouter) {
                unsubscribeRouter()
            }
        }
    }, [eventName, callback])
}