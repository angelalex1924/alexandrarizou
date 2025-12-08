"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  RefreshCw,
  FileText,
  Image,
  Link,
  Gauge,
  Smartphone,
  Tag
} from 'lucide-react'
import { getLatestSEOScore, SEOScore } from '@/lib/acronMetrics'
import { calculateSEOScore } from '@/lib/seoCalculator'

interface SEOHealthScoreProps {
  siteId: string
}

export default function SEOHealthScore({ siteId }: SEOHealthScoreProps) {
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSEOScore = async () => {
      try {
        setLoading(true)
        // First try to get existing score
        let data = await getLatestSEOScore(siteId)
        
        // If no score exists or it's older than 1 hour, calculate new one
        if (!data || (data.timestamp instanceof Date && 
            Date.now() - data.timestamp.getTime() > 3600000)) {
          // Calculate new SEO score
          const analysis = await calculateSEOScore(siteId)
          // Get the newly saved score
          data = await getLatestSEOScore(siteId)
        }
        
        setSeoScore(data)
      } catch (error) {
        console.error('Error loading SEO score:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSEOScore()
    const interval = setInterval(loadSEOScore, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [siteId])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'emerald'
    if (score >= 60) return 'amber'
    return 'rose'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Improvement'
    return 'Poor'
  }

  const scoreColor = seoScore ? getScoreColor(seoScore.score) : 'slate'
  const scoreLabel = seoScore ? getScoreLabel(seoScore.score) : (loading ? 'Calculating...' : 'No data')

  const seoFactors = [
    { key: 'metaTags', label: 'Meta Tags', icon: Tag, description: 'Title, description, and meta tags' },
    { key: 'headings', label: 'Headings', icon: FileText, description: 'H1-H6 structure' },
    { key: 'images', label: 'Images', icon: Image, description: 'Alt text and optimization' },
    { key: 'links', label: 'Links', icon: Link, description: 'Internal and external links' },
    { key: 'speed', label: 'Speed', icon: Gauge, description: 'Page load performance' },
    { key: 'mobile', label: 'Mobile', icon: Smartphone, description: 'Mobile responsiveness' }
  ]

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-${scoreColor}-50 via-${scoreColor}-100 to-${scoreColor}-200 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border-2 border-${scoreColor}-300 dark:border-slate-700 p-8 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">SEO Health Score</p>
            <div className="flex items-baseline gap-3">
              {loading ? (
                <div className="w-24 h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ) : (
                <>
                  <p className={`text-6xl font-bold text-${scoreColor}-600 dark:text-${scoreColor}-400`}>
                    {seoScore?.score || 0}
                  </p>
                  <p className="text-2xl font-semibold text-slate-500 dark:text-slate-400">/100</p>
                </>
              )}
            </div>
            <p className={`text-lg font-semibold text-${scoreColor}-700 dark:text-${scoreColor}-300 mt-2`}>
              {scoreLabel}
            </p>
          </div>
          <div className={`p-6 bg-${scoreColor}-500 rounded-2xl shadow-lg`}>
            <Search className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Circular Progress */}
        {!loading && seoScore && (
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={`text-${scoreColor}-500`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: seoScore.score / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-4xl font-bold text-${scoreColor}-600 dark:text-${scoreColor}-400`}>
                  {seoScore.score}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* SEO Factors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seoFactors.map((factor, index) => {
          const Icon = factor.icon
          const score = seoScore?.factors[factor.key as keyof typeof seoScore.factors] || 0
          const factorColor = getScoreColor(score)
          
          return (
            <motion.div
              key={factor.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 text-${factorColor}-600 dark:text-${factorColor}-400`} />
                    <p className="font-semibold text-slate-900 dark:text-white">{factor.label}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{factor.description}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold text-${factorColor}-600 dark:text-${factorColor}-400`}>
                      {loading ? '...' : score}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">/100</p>
                  </div>
                </div>
                <div className={`p-2 bg-${factorColor}-100 dark:bg-${factorColor}-900/30 rounded-lg`}>
                  {score >= 80 ? (
                    <CheckCircle2 className={`w-5 h-5 text-${factorColor}-600 dark:text-${factorColor}-400`} />
                  ) : score >= 60 ? (
                    <AlertCircle className={`w-5 h-5 text-${factorColor}-600 dark:text-${factorColor}-400`} />
                  ) : (
                    <XCircle className={`w-5 h-5 text-${factorColor}-600 dark:text-${factorColor}-400`} />
                  )}
                </div>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r from-${factorColor}-500 to-${factorColor}-600 rounded-full`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">SEO Recommendations</h3>
        </div>
        <div className="space-y-3">
          {seoScore && seoScore.factors.metaTags < 80 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">Improve Meta Tags</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Ensure all pages have unique title tags and meta descriptions</p>
              </div>
            </div>
          )}
          {seoScore && seoScore.factors.speed < 80 && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">Optimize Page Speed</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Reduce image sizes and enable caching to improve load times</p>
              </div>
            </div>
          )}
          {seoScore && seoScore.factors.images < 80 && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-200">Add Alt Text to Images</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">All images should have descriptive alt attributes</p>
              </div>
            </div>
          )}
          {(!seoScore || seoScore.score >= 80) && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">Great SEO Health!</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Your website is performing well. Keep monitoring and optimizing.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

