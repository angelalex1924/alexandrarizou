"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    // Skip admin pages
    if (pathname?.startsWith('/admin') || pathname?.includes('/admin')) {
      return
    }

    // Track page view
    const path = pathname || '/'
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined

    // Small delay to ensure page is loaded
    const timer = setTimeout(() => {
      trackPageView(path, userAgent, referrer)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

