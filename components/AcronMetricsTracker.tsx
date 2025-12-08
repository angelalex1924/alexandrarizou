"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackConversion, trackPerformance } from '@/lib/acronMetrics'

interface AcronMetricsTrackerProps {
  siteId: string
}

export default function AcronMetricsTracker({ siteId }: AcronMetricsTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view (handled by existing analytics)
    // This component is for additional conversion/performance tracking

    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            trackPerformance({
              siteId,
              metric: 'LCP',
              value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
              page: pathname || '/',
              device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
            }).catch(console.error)
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }

      // Track First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            trackPerformance({
              siteId,
              metric: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              page: pathname || '/',
              device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
            }).catch(console.error)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported
      }

      // Track Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          
          // Report CLS when page is unloaded
          window.addEventListener('beforeunload', () => {
            if (clsValue > 0) {
              trackPerformance({
                siteId,
                metric: 'CLS',
                value: Math.round(clsValue * 1000) / 1000,
                page: pathname || '/',
                device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
              }).catch(console.error)
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }

      // Track First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            trackPerformance({
              siteId,
              metric: 'FCP',
              value: Math.round(entry.renderTime || entry.loadTime),
              page: pathname || '/',
              device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
            }).catch(console.error)
          })
        })
        fcpObserver.observe({ entryTypes: ['paint'] })
      } catch (e) {
        // FCP not supported
      }

      // Track Time to First Byte (TTFB)
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart
          trackPerformance({
            siteId,
            metric: 'TTFB',
            value: Math.round(ttfb),
            page: pathname || '/',
            device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
          }).catch(console.error)
        }
      } catch (e) {
        // TTFB tracking failed
      }
    }
  }, [pathname, siteId])

  // Helper function to track conversions from anywhere in the app
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Make trackConversion available globally for easy access
      ;(window as any).acronMetricsTrackConversion = async (event: {
        type: string
        value: number
        source?: string
        metadata?: Record<string, any>
      }) => {
        try {
          await trackConversion({
            siteId,
            type: event.type as any,
            value: event.value,
            source: (event.source as any) || 'direct',
            page: pathname || '/',
            userAgent: navigator.userAgent,
            metadata: event.metadata
          })
        } catch (error) {
          console.error('Error tracking conversion:', error)
        }
      }
    }
  }, [siteId, pathname])

  return null // This component doesn't render anything
}

