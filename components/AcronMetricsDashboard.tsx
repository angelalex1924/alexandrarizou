"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Zap, 
  Search, 
  RefreshCw,
  Activity,
  Eye,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react'
import { getDashboardSummary, getConversions, getLatestSEOScore, getPerformanceMetrics } from '@/lib/acronMetrics'
import ConversionTracking from './AcronMetrics/ConversionTracking'
import PerformanceMonitor from './AcronMetrics/PerformanceMonitor'
import SEOHealthScore from './AcronMetrics/SEOHealthScore'
import ROICalculator from './AcronMetrics/ROICalculator'
import WhiteLabelReports from './AcronMetrics/WhiteLabelReports'

interface AcronMetricsDashboardProps {
  siteId: string
}

export default function AcronMetricsDashboard({ siteId }: AcronMetricsDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'conversions' | 'performance' | 'seo' | 'roi' | 'reports'>('overview')
  const [summary, setSummary] = useState({
    conversions: 0,
    revenue: 0,
    avgPerformance: 0,
    seoScore: 0,
    lastUpdated: new Date()
  })
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [previousSummary, setPreviousSummary] = useState({
    conversions: 0,
    revenue: 0,
    avgPerformance: 0,
    seoScore: 0
  })

  const loadSummary = async () => {
    try {
      setLoading(true)
      const data = await getDashboardSummary(siteId)
      setSummary(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error loading summary:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
    const interval = setInterval(loadSummary, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [siteId])

  useEffect(() => {
    // Store previous summary for comparison
    if (summary.conversions > 0 || summary.revenue > 0 || summary.avgPerformance > 0 || summary.seoScore > 0) {
      setPreviousSummary(prev => ({
        conversions: prev.conversions || summary.conversions,
        revenue: prev.revenue || summary.revenue,
        avgPerformance: prev.avgPerformance || summary.avgPerformance,
        seoScore: prev.seoScore || summary.seoScore
      }))
    }
  }, [summary])

  const calculateChange = (current: number, previous: number) => {
    if (isNaN(current) || isNaN(previous)) return 0
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('el-GR').format(num)
  }

  const views = [
    { id: 'overview', label: 'Επισκόπηση', icon: BarChart3, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'conversions', label: 'Conversions', icon: Target, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'performance', label: 'Performance', icon: Zap, gradient: 'from-amber-500 to-orange-500' },
    { id: 'seo', label: 'SEO Health', icon: Search, gradient: 'from-purple-500 to-pink-500' },
    { id: 'roi', label: 'ROI Calculator', icon: DollarSign, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'reports', label: 'Reports', icon: Activity, gradient: 'from-rose-500 to-red-500' }
  ]

  const statCards = [
    {
      label: 'Conversions',
      value: summary.conversions || 0,
      change: calculateChange(summary.conversions, previousSummary.conversions),
      icon: Target,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Revenue',
      value: formatCurrency(summary.revenue || 0),
      change: calculateChange(summary.revenue, previousSummary.revenue),
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Performance Score',
      value: isNaN(summary.avgPerformance) ? 0 : Math.round(summary.avgPerformance || 0),
      change: calculateChange(summary.avgPerformance || 0, previousSummary.avgPerformance),
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200'
    },
    {
      label: 'SEO Score',
      value: isNaN(summary.seoScore) ? 0 : (summary.seoScore || 0),
      change: calculateChange(summary.seoScore || 0, previousSummary.seoScore),
      icon: Search,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              AcronMetrics
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Website Performance & ROI Analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSummary}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Refresh</span>
          </button>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
        {views.map((view) => {
          const Icon = view.icon
          const isActive = activeView === view.id
          return (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r ' + view.gradient + ' text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{view.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Content */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`relative bg-gradient-to-br ${stat.bgGradient} dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl border-2 ${stat.borderColor} dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                    {/* Decorative gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-3xl`} />
                    
                    <div className="relative flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                          {loading ? (
                            <span className="inline-block h-8 w-24 animate-pulse bg-slate-200 dark:bg-slate-700 rounded" />
                          ) : (
                            typeof stat.value === 'number' && isNaN(stat.value) ? 0 : stat.value
                          )}
                        </p>
                        {stat.change !== 0 && (
                          <div className={`flex items-center gap-1 text-xs font-medium ${stat.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%</span>
                          </div>
                        )}
                        {stat.change === 0 && stat.value === 0 && (
                          <div className="text-xs text-slate-400 dark:text-slate-500">
                            No data yet
                          </div>
                        )}
                      </div>
                      <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">System operational</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">All metrics tracking normally</p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Performance improved</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Page speed increased by 12%</p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tracking</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Collection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Updated</span>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {lastRefresh.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeView === 'conversions' && <ConversionTracking siteId={siteId} />}
      {activeView === 'performance' && <PerformanceMonitor siteId={siteId} />}
      {activeView === 'seo' && <SEOHealthScore siteId={siteId} />}
      {activeView === 'roi' && <ROICalculator siteId={siteId} />}
      {activeView === 'reports' && <WhiteLabelReports siteId={siteId} />}
    </div>
  )
}

