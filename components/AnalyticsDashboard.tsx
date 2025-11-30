"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Eye, Users, TrendingUp, Globe, RefreshCw } from 'lucide-react'
import { getAnalyticsData, AnalyticsData, TimePeriod } from '@/lib/analytics'

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getAnalyticsData(selectedPeriod)
      setAnalytics(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000)
    return () => clearInterval(interval)
  }, [selectedPeriod])

  if (loading && !analytics) {
    return (
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-slate-600 dark:text-slate-400">Φόρτωση analytics...</span>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('el-GR').format(num)
  }

  const getPageName = (path: string) => {
    if (path === '/') return 'Αρχική Σελίδα'
    if (path === '/services') return 'Υπηρεσίες'
    if (path === '/about') return 'Σχετικά'
    if (path === '/contact') return 'Επικοινωνία'
    if (path === '/gallery') return 'Gallery'
    return path.replace('/', '').charAt(0).toUpperCase() + path.replace('/', '').slice(1)
  }

  const periodLabels: Record<TimePeriod, string> = {
    today: 'Σήμερα',
    week: 'Βδομάδα',
    month: 'Μήνας',
    '3months': '3 Μήνες',
    all: 'Όλα'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-xl backdrop-blur-sm border border-blue-500/30">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              Analytics & Statistics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {lastRefresh.toLocaleTimeString('el-GR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg p-1 border border-slate-200/40 dark:border-slate-700/40 flex-wrap">
            {(['today', 'week', 'month', '3months', 'all'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-white/5'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
          <button
            onClick={loadAnalytics}
            className="p-2 hover:bg-white/20 dark:hover:bg-white/5 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg backdrop-blur-sm border border-blue-500/30">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Page Views</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {formatNumber(analytics?.totalViews || 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-lg backdrop-blur-sm border border-emerald-500/30">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Unique Visitors</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {formatNumber(analytics?.uniqueVisitors || 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-amber-500/20 dark:bg-amber-500/30 rounded-lg backdrop-blur-sm border border-amber-500/30">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            {selectedPeriod === 'all' ? 'Συνολικά' : periodLabels[selectedPeriod]} Views
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {formatNumber(selectedPeriod === 'all' ? (analytics?.totalViews || 0) : (analytics?.periodViews || 0))}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg backdrop-blur-sm border border-purple-500/30">
              <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            {selectedPeriod === 'all' ? 'Συνολικά' : periodLabels[selectedPeriod]} Unique
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {formatNumber(selectedPeriod === 'all' ? (analytics?.uniqueVisitors || 0) : (analytics?.periodUnique || 0))}
          </p>
        </motion.div>
      </div>

      {/* Popular Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Popular Pages</h3>
        </div>
        
        {analytics?.popularPages && analytics.popularPages.length > 0 ? (
          <div className="space-y-3">
            {analytics.popularPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {getPageName(page.path)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {page.path}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatNumber(page.views)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">views</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Δεν υπάρχουν δεδομένα ακόμα
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

