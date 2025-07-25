'use client'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { ROUTER_EVENTS, routerEventSource } from '@/lib/useRouter'

/**
 * Custom Link component that emits BEFORE_NAVIGATION events
 * to maintain consistency with router.push behavior
 */
const Link = ({ href, replace = false, onClick, children, ...props }) => {
    const pathname = usePathname()

    const handleClick = useCallback((event) => {
        // Only emit event for internal navigation (href starting with '/' or relative)
        if (typeof href === 'string' && (href.startsWith('/') || !href.includes('://'))) {
            // Emit BEFORE_NAVIGATION event to match router.push behavior
            routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION, {
                type: replace ? 'replace' : 'push',
                href,
                from: pathname,
                source: 'Link'
            })
        }

        // Call original onClick if provided
        if (onClick) {
            onClick(event)
        }
    }, [href, replace, pathname, onClick])

    return (
        <NextLink href={href} replace={replace} onClick={handleClick} {...props}>
            {children}
        </NextLink>
    )
}

export default Link