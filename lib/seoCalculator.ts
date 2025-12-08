import { saveSEOScore } from './acronMetrics'

export interface SEOAnalysis {
  metaTags: number
  headings: number
  images: number
  links: number
  speed: number
  mobile: number
  overall: number
}

export async function calculateSEOScore(siteId: string): Promise<SEOAnalysis> {
  if (typeof window === 'undefined') {
    return {
      metaTags: 0,
      headings: 0,
      images: 0,
      links: 0,
      speed: 0,
      mobile: 0,
      overall: 0
    }
  }

  const analysis: SEOAnalysis = {
    metaTags: 0,
    headings: 0,
    images: 0,
    links: 0,
    speed: 0,
    mobile: 0,
    overall: 0
  }

  // 1. Meta Tags Analysis
  const title = document.querySelector('title')?.textContent || ''
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
  const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || ''

  let metaScore = 0
  if (title && title.length >= 30 && title.length <= 60) metaScore += 20
  else if (title) metaScore += 10
  if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) metaScore += 20
  else if (metaDescription) metaScore += 10
  if (ogTitle) metaScore += 15
  if (ogDescription) metaScore += 15
  if (metaKeywords) metaScore += 10
  metaScore += 10 // Base score
  analysis.metaTags = Math.min(100, metaScore)

  // 2. Headings Analysis
  const h1Count = document.querySelectorAll('h1').length
  const h2Count = document.querySelectorAll('h2').length
  const h3Count = document.querySelectorAll('h3').length
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  let headingScore = 0
  if (h1Count === 1) headingScore += 30 // Should have exactly one H1
  else if (h1Count > 1) headingScore += 10 // Multiple H1s is bad
  if (h2Count > 0) headingScore += 20
  if (h3Count > 0) headingScore += 15
  if (headings.length >= 3) headingScore += 25 // Good structure
  analysis.headings = Math.min(100, headingScore)

  // 3. Images Analysis
  const images = document.querySelectorAll('img')
  let imagesWithAlt = 0
  let imagesOptimized = 0
  
  images.forEach(img => {
    if (img.getAttribute('alt')) imagesWithAlt++
    if (img.complete && img.naturalWidth > 0) imagesOptimized++
  })

  const totalImages = images.length
  if (totalImages === 0) {
    analysis.images = 50 // No images is neutral
  } else {
    const altPercentage = (imagesWithAlt / totalImages) * 100
    const optimizedPercentage = (imagesOptimized / totalImages) * 100
    analysis.images = Math.round((altPercentage * 0.7) + (optimizedPercentage * 0.3))
  }

  // 4. Links Analysis
  const allLinks = document.querySelectorAll('a')
  const internalLinks = Array.from(allLinks).filter(link => {
    const href = link.getAttribute('href')
    return href && (href.startsWith('/') || href.includes(window.location.hostname))
  }).length
  const externalLinks = allLinks.length - internalLinks

  let linkScore = 0
  if (allLinks.length > 0) {
    const internalRatio = internalLinks / allLinks.length
    linkScore += Math.min(50, internalRatio * 50) // Internal links are good
    linkScore += Math.min(30, (externalLinks > 0 ? 30 : 0)) // Some external links are good
    linkScore += Math.min(20, (allLinks.length >= 5 ? 20 : allLinks.length * 4)) // Enough links
  }
  analysis.links = Math.min(100, linkScore)

  // 5. Speed Analysis (from Performance API)
  let speedScore = 50 // Default
  try {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (perfData) {
      const loadTime = perfData.loadEventEnd - perfData.fetchStart
      if (loadTime < 2000) speedScore = 100
      else if (loadTime < 3000) speedScore = 80
      else if (loadTime < 5000) speedScore = 60
      else if (loadTime < 8000) speedScore = 40
      else speedScore = 20
    }
  } catch (e) {
    // Performance API not available
  }
  analysis.speed = speedScore

  // 6. Mobile Analysis
  const viewport = document.querySelector('meta[name="viewport"]')
  const hasViewport = !!viewport
  const isResponsive = window.innerWidth < 768 ? 
    (document.documentElement.scrollWidth <= window.innerWidth * 1.1) : true

  let mobileScore = 0
  if (hasViewport) mobileScore += 40
  if (isResponsive) mobileScore += 40
  if (document.querySelector('link[rel="apple-touch-icon"]')) mobileScore += 10
  if (document.querySelector('meta[name="theme-color"]')) mobileScore += 10
  analysis.mobile = Math.min(100, mobileScore)

  // Calculate overall score
  analysis.overall = Math.round(
    (analysis.metaTags * 0.25) +
    (analysis.headings * 0.15) +
    (analysis.images * 0.15) +
    (analysis.links * 0.15) +
    (analysis.speed * 0.20) +
    (analysis.mobile * 0.10)
  )

  // Save to Firestore
  try {
    await saveSEOScore({
      siteId,
      score: analysis.overall,
      factors: {
        metaTags: analysis.metaTags,
        headings: analysis.headings,
        images: analysis.images,
        links: analysis.links,
        speed: analysis.speed,
        mobile: analysis.mobile
      }
    })
  } catch (error) {
    console.error('Error saving SEO score:', error)
  }

  return analysis
}

