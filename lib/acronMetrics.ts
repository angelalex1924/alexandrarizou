import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export interface ConversionEvent {
  id?: string
  siteId: string
  type: 'booking' | 'contact_form' | 'phone_call' | 'newsletter' | 'review' | 'custom'
  value: number // €
  timestamp: Date | Timestamp
  source: 'organic' | 'direct' | 'social' | 'paid' | 'referral'
  page: string
  userAgent?: string
  sessionId?: string
  metadata?: Record<string, any>
}

export interface PerformanceMetric {
  id?: string
  siteId: string
  metric: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'uptime'
  value: number
  timestamp: Date | Timestamp
  page: string
  device: 'mobile' | 'desktop' | 'tablet'
}

export interface SEOScore {
  id?: string
  siteId: string
  score: number // 0-100
  factors: {
    metaTags: number
    headings: number
    images: number
    links: number
    speed: number
    mobile: number
  }
  timestamp: Date | Timestamp
}

export interface ROIData {
  siteId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  revenue: number
  conversions: number
  cost: number
  roi: number // percentage
  timestamp: Date | Timestamp
}

// Track conversion event
export async function trackConversion(event: Omit<ConversionEvent, 'id' | 'timestamp'>) {
  try {
    const conversionRef = doc(collection(db, 'acronMetrics', event.siteId, 'conversions'))
    await setDoc(conversionRef, {
      ...event,
      timestamp: serverTimestamp()
    })
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const dailyRef = doc(db, 'acronMetrics', event.siteId, 'analytics', `daily_${today}`)
    const dailyDoc = await getDoc(dailyRef)
    
    if (dailyDoc.exists()) {
      await updateDoc(dailyRef, {
        conversions: increment(1),
        revenue: increment(event.value),
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(dailyRef, {
        date: today,
        conversions: 1,
        revenue: event.value,
        lastUpdated: serverTimestamp()
      })
    }
    
    return conversionRef.id
  } catch (error) {
    console.error('Error tracking conversion:', error)
    throw error
  }
}

// Track performance metric
export async function trackPerformance(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) {
  try {
    const perfRef = doc(collection(db, 'acronMetrics', metric.siteId, 'performance'))
    await setDoc(perfRef, {
      ...metric,
      timestamp: serverTimestamp()
    })
    
    // Update latest metric
    const latestRef = doc(db, 'acronMetrics', metric.siteId, 'analytics', `latest_${metric.metric}`)
    await setDoc(latestRef, {
      value: metric.value,
      page: metric.page,
      device: metric.device,
      timestamp: serverTimestamp()
    })
    
    return perfRef.id
  } catch (error) {
    console.error('Error tracking performance:', error)
    throw error
  }
}

// Save SEO score
export async function saveSEOScore(score: Omit<SEOScore, 'id' | 'timestamp'>) {
  try {
    const seoRef = doc(collection(db, 'acronMetrics', score.siteId, 'seo'))
    await setDoc(seoRef, {
      ...score,
      timestamp: serverTimestamp()
    })
    
    // Update latest score
    const latestRef = doc(db, 'acronMetrics', score.siteId, 'analytics', 'latest_seo')
    await setDoc(latestRef, {
      score: score.score,
      factors: score.factors,
      timestamp: serverTimestamp()
    })
    
    return seoRef.id
  } catch (error) {
    console.error('Error saving SEO score:', error)
    throw error
  }
}

// Get conversions for period
export async function getConversions(
  siteId: string, 
  period: 'today' | 'week' | 'month' | '3months' | 'all' = 'month'
): Promise<ConversionEvent[]> {
  try {
    const conversionsRef = collection(db, 'acronMetrics', siteId, 'conversions')
    let q = query(conversionsRef, orderBy('timestamp', 'desc'))
    
    if (period !== 'all') {
      const now = new Date()
      const startDate = new Date()
      
      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          startDate.setMonth(now.getMonth() - 3)
          break
      }
      
      q = query(
        conversionsRef, 
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'desc'),
        limit(1000)
      )
    } else {
      q = query(conversionsRef, orderBy('timestamp', 'desc'), limit(1000))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    } as ConversionEvent))
  } catch (error) {
    console.error('Error getting conversions:', error)
    return []
  }
}

// Get performance metrics
export async function getPerformanceMetrics(
  siteId: string,
  metric?: PerformanceMetric['metric']
): Promise<PerformanceMetric[]> {
  try {
    const perfRef = collection(db, 'acronMetrics', siteId, 'performance')
    let q = query(perfRef, orderBy('timestamp', 'desc'), limit(100))
    
    if (metric) {
      q = query(
        perfRef,
        where('metric', '==', metric),
        orderBy('timestamp', 'desc'),
        limit(100)
      )
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    } as PerformanceMetric))
  } catch (error) {
    console.error('Error getting performance metrics:', error)
    return []
  }
}

// Get latest SEO score
export async function getLatestSEOScore(siteId: string): Promise<SEOScore | null> {
  try {
    const latestRef = doc(db, 'acronMetrics', siteId, 'analytics', 'latest_seo')
    const docSnap = await getDoc(latestRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        siteId,
        score: data.score,
        factors: data.factors,
        timestamp: data.timestamp?.toDate() || new Date()
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting SEO score:', error)
    return null
  }
}

// Get ROI data
export async function getROIData(
  siteId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
): Promise<ROIData | null> {
  try {
    const conversions = await getConversions(siteId, period === 'daily' ? 'today' : period === 'weekly' ? 'week' : 'month')
    
    const revenue = conversions.reduce((sum, c) => sum + c.value, 0)
    const conversionsCount = conversions.length
    
    // Calculate ROI (simplified - you'd need actual cost data)
    const cost = 0 // This would come from your cost tracking
    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0
    
    return {
      siteId,
      period,
      revenue,
      conversions: conversionsCount,
      cost,
      roi,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error getting ROI data:', error)
    return null
  }
}

// Get dashboard summary
export async function getDashboardSummary(siteId: string) {
  try {
    const [conversions, performance, seoScore] = await Promise.all([
      getConversions(siteId, 'month'),
      getPerformanceMetrics(siteId),
      getLatestSEOScore(siteId)
    ])
    
    const revenue = conversions.reduce((sum, c) => sum + c.value, 0)
    const avgPerformance = performance.length > 0
      ? performance.reduce((sum, p) => sum + p.value, 0) / performance.length
      : 0
    
    return {
      conversions: conversions.length,
      revenue,
      avgPerformance,
      seoScore: seoScore?.score || 0,
      lastUpdated: new Date()
    }
  } catch (error) {
    console.error('Error getting dashboard summary:', error)
    return {
      conversions: 0,
      revenue: 0,
      avgPerformance: 0,
      seoScore: 0,
      lastUpdated: new Date()
    }
  }
}

