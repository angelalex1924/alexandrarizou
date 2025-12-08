"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Activity, 
  Gauge, 
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { getPerformanceMetrics, PerformanceMetric } from '@/lib/acronMetrics'

interface PerformanceMonitorProps {
  siteId: string
}

export default function PerformanceMonitor({ siteId }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('all')
  const [selectedDevice, setSelectedDevice] = useState<string>('all')

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true)
        const data = await getPerformanceMetrics(siteId, selectedMetric as any)
        setMetrics(data)
      } catch (error) {
        console.error('Error loading metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [siteId, selectedMetric])

  const filteredMetrics = selectedDevice === 'all'
    ? metrics
    : metrics.filter(m => m.device === selectedDevice)

  const latestMetrics = {
    LCP: filteredMetrics.find(m => m.metric === 'LCP')?.value,
    FID: filteredMetrics.find(m => m.metric === 'FID')?.value,
    CLS: filteredMetrics.find(m => m.metric === 'CLS')?.value,
    FCP: filteredMetrics.find(m => m.metric === 'FCP')?.value,
    TTFB: filteredMetrics.find(m => m.metric === 'TTFB')?.value,
    uptime: filteredMetrics.find(m => m.metric === 'uptime')?.value
  }

  const getMetricStatus = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return { status: 'good', color: 'emerald' }

    if (value <= threshold.good) return { status: 'good', color: 'emerald' }
    if (value <= threshold.needsImprovement) return { status: 'warning', color: 'amber' }
    return { status: 'poor', color: 'rose' }
  }

  const formatMetric = (metric: string, value: number) => {
    if (metric === 'uptime') return `${value.toFixed(2)}%`
    if (metric === 'CLS') return value.toFixed(3)
    if (metric === 'FID') return `${value.toFixed(0)}ms`
    return `${value.toFixed(0)}ms`
  }

  const metricCards = [
    { key: 'LCP', label: 'Largest Contentful Paint', icon: Gauge, description: 'Loading performance' },
    { key: 'FID', label: 'First Input Delay', icon: Zap, description: 'Interactivity' },
    { key: 'CLS', label: 'Cumulative Layout Shift', icon: Activity, description: 'Visual stability' },
    { key: 'FCP', label: 'First Contentful Paint', icon: Clock, description: 'Perceived load speed' },
    { key: 'TTFB', label: 'Time to First Byte', icon: TrendingUp, description: 'Server response time' },
    { key: 'uptime', label: 'Uptime', icon: CheckCircle2, description: 'Availability' }
  ]

  return (
    <div className="space-y-6">
      {/* Uptime Banner */}
      {latestMetrics.uptime !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold opacity-90 mb-1">System Uptime</p>
              <p className="text-4xl font-bold">{latestMetrics.uptime.toFixed(2)}%</p>
              <p className="text-sm opacity-80 mt-1">Last 30 days</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.filter(m => m.key !== 'uptime').map((metric, index) => {
          const Icon = metric.icon
          const value = latestMetrics[metric.key as keyof typeof latestMetrics]
          if (value === undefined) return null // Don't render if no data
          const status = getMetricStatus(metric.key, value)
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-2 border-${status.color}-200 dark:border-slate-700 p-6 shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 text-${status.color}-600 dark:text-${status.color}-400`} />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{metric.label}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{metric.description}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? '...' : (value !== undefined ? formatMetric(metric.key, value) : 'N/A')}
                  </p>
                </div>
                <div className={`p-2 bg-${status.color}-100 dark:bg-${status.color}-900/30 rounded-lg`}>
                  {status.status === 'good' ? (
                    <CheckCircle2 className={`w-5 h-5 text-${status.color}-600 dark:text-${status.color}-400`} />
                  ) : (
                    <AlertCircle className={`w-5 h-5 text-${status.color}-600 dark:text-${status.color}-400`} />
                  )}
                </div>
              </div>
              <div className={`h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (value / 5000) * 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r from-${status.color}-500 to-${status.color}-600 rounded-full`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Metric:</span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">All Metrics</option>
            <option value="LCP">LCP</option>
            <option value="FID">FID</option>
            <option value="CLS">CLS</option>
            <option value="FCP">FCP</option>
            <option value="TTFB">TTFB</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Devices', icon: Monitor },
            { id: 'desktop', label: 'Desktop', icon: Monitor },
            { id: 'mobile', label: 'Mobile', icon: Smartphone },
            { id: 'tablet', label: 'Tablet', icon: Tablet }
          ].map((device) => {
            const Icon = device.icon
            const isActive = selectedDevice === device.id
            return (
              <motion.button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{device.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Performance History */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Performance History</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMetrics.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No performance data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMetrics.slice(0, 20).map((metric, index) => {
              const status = getMetricStatus(metric.metric, metric.value)
              return (
                <motion.div
                  key={metric.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 bg-${status.color}-100 dark:bg-${status.color}-900/30 rounded-lg`}>
                      <Zap className={`w-4 h-4 text-${status.color}-600 dark:text-${status.color}-400`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{metric.metric}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {metric.page} • {metric.device}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {formatMetric(metric.metric, metric.value)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {status.status}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

