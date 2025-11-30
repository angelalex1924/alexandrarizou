import { collection, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, query, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

export interface PageView {
  path: string
  timestamp: Date
  userAgent?: string
  referrer?: string
}

export type TimePeriod = 'today' | 'week' | 'month' | '3months' | 'all'

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  popularPages: Array<{ path: string; views: number }>
  todayViews: number
  todayUnique: number
  periodViews: number
  periodUnique: number
  period: TimePeriod
}

// Track page view
export async function trackPageView(path: string, userAgent?: string, referrer?: string) {
  try {
    // Skip admin pages
    if (path.startsWith('/admin') || path.includes('/admin')) {
      return
    }

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const pageViewRef = doc(db, 'analytics', 'pageViews')
    const dailyRef = doc(db, 'analytics', `daily_${today}`)
    const pageStatsRef = doc(db, 'analytics', `pages_${path.replace(/\//g, '_')}`)

    // Update total page views
    const pageViewDoc = await getDoc(pageViewRef)
    if (pageViewDoc.exists()) {
      await updateDoc(pageViewRef, {
        total: increment(1),
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(pageViewRef, {
        total: 1,
        lastUpdated: serverTimestamp()
      })
    }

    // Update daily stats
    const dailyDoc = await getDoc(dailyRef)
    if (dailyDoc.exists()) {
      await updateDoc(dailyRef, {
        views: increment(1),
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(dailyRef, {
        date: today,
        views: 1,
        lastUpdated: serverTimestamp()
      })
    }

    // Update page-specific stats
    const pageStatsDoc = await getDoc(pageStatsRef)
    if (pageStatsDoc.exists()) {
      await updateDoc(pageStatsRef, {
        views: increment(1),
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(pageStatsRef, {
        path: path,
        views: 1,
        lastUpdated: serverTimestamp()
      })
    }

    // Track unique visitors (using localStorage + Firestore)
    const visitorId = getOrCreateVisitorId()
    const visitorRef = doc(db, 'analytics', `visitors_${today}`)
    const visitorDoc = await getDoc(visitorRef)
    
    if (!visitorDoc.exists()) {
      await setDoc(visitorRef, {
        date: today,
        visitors: [visitorId],
        count: 1,
        lastUpdated: serverTimestamp()
      })
    } else {
      const data = visitorDoc.data()
      if (!data.visitors || !data.visitors.includes(visitorId)) {
        await updateDoc(visitorRef, {
          visitors: [...(data.visitors || []), visitorId],
          count: (data.visitors?.length || 0) + 1,
          lastUpdated: serverTimestamp()
        })
      }
    }

    // Track unique visitor for this page
    const pageVisitorRef = doc(db, 'analytics', `pageVisitors_${path.replace(/\//g, '_')}`)
    const pageVisitorDoc = await getDoc(pageVisitorRef)
    
    if (!pageVisitorDoc.exists()) {
      await setDoc(pageVisitorRef, {
        path: path,
        visitors: [visitorId],
        count: 1,
        lastUpdated: serverTimestamp()
      })
    } else {
      const data = pageVisitorDoc.data()
      if (!data.visitors || !data.visitors.includes(visitorId)) {
        await updateDoc(pageVisitorRef, {
          visitors: [...(data.visitors || []), visitorId],
          count: (data.visitors?.length || 0) + 1,
          lastUpdated: serverTimestamp()
        })
      }
    }

  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Get or create visitor ID from localStorage
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

// Get date range for time period
function getDateRange(period: TimePeriod): { start: Date; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date()
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      start.setHours(0, 0, 0, 0)
      break
    case '3months':
      start.setMonth(start.getMonth() - 3)
      start.setHours(0, 0, 0, 0)
      break
    case 'all':
      start.setFullYear(2020, 0, 1) // Very old date
      break
  }
  
  return { start, end }
}

// Get analytics data
export async function getAnalyticsData(period: TimePeriod = 'all'): Promise<AnalyticsData> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { start, end } = getDateRange(period)
    
    // Get total views (all time)
    const pageViewRef = doc(db, 'analytics', 'pageViews')
    const pageViewDoc = await getDoc(pageViewRef)
    const totalViews = pageViewDoc.exists() ? (pageViewDoc.data().total || 0) : 0

    // Get today's views
    const dailyRef = doc(db, 'analytics', `daily_${today}`)
    const dailyDoc = await getDoc(dailyRef)
    const todayViews = dailyDoc.exists() ? (dailyDoc.data().views || 0) : 0

    // Get today's unique visitors
    const visitorRef = doc(db, 'analytics', `visitors_${today}`)
    const visitorDoc = await getDoc(visitorRef)
    const todayUnique = visitorDoc.exists() ? (visitorDoc.data().count || 0) : 0

    // Get period views and unique visitors
    const analyticsRef = collection(db, 'analytics')
    const allDocs = await getDocs(analyticsRef)
    
    let periodViews = 0
    const periodVisitors = new Set<string>()
    const dateRange = getDateRange(period)
    
    // Calculate period stats from daily records
    allDocs.docs.forEach(doc => {
      const docId = doc.id
      const data = doc.data()
      
      // Daily views
      if (docId.startsWith('daily_')) {
        const dateStr = docId.replace('daily_', '')
        const docDate = new Date(dateStr + 'T00:00:00')
        if (docDate >= dateRange.start && docDate <= dateRange.end) {
          periodViews += data.views || 0
        }
      }
      
      // Daily visitors
      if (docId.startsWith('visitors_')) {
        const dateStr = docId.replace('visitors_', '')
        const docDate = new Date(dateStr + 'T00:00:00')
        if (docDate >= dateRange.start && docDate <= dateRange.end) {
          const visitors = data.visitors || []
          visitors.forEach((v: string) => periodVisitors.add(v))
        }
      }
    })
    
    const periodUnique = periodVisitors.size

    // Get all unique visitors (all time)
    const allVisitors = new Set<string>()
    allDocs.docs.forEach(doc => {
      if (doc.id.startsWith('visitors_')) {
        const visitors = doc.data().visitors || []
        visitors.forEach((v: string) => allVisitors.add(v))
      }
    })
    const uniqueVisitors = allVisitors.size

    // Get popular pages (all time for now, can be filtered by period later)
    const popularPages: Array<{ path: string; views: number }> = []
    
    allDocs.docs.forEach(doc => {
      if (doc.id.startsWith('pages_')) {
        const data = doc.data()
        if (data.path && data.views) {
          popularPages.push({
            path: data.path,
            views: data.views
          })
        }
      }
    })

    // Sort and limit to top 10
    popularPages.sort((a, b) => b.views - a.views)
    const topPages = popularPages.slice(0, 10)

    return {
      totalViews,
      uniqueVisitors,
      popularPages: topPages,
      todayViews,
      todayUnique,
      periodViews,
      periodUnique,
      period
    }
  } catch (error) {
    console.error('Error getting analytics data:', error)
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      popularPages: [],
      todayViews: 0,
      todayUnique: 0,
      periodViews: 0,
      periodUnique: 0,
      period
    }
  }
}

