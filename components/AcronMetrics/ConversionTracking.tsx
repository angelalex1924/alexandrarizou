"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  FileText,
  Star
} from 'lucide-react'
import { getConversions, ConversionEvent } from '@/lib/acronMetrics'

interface ConversionTrackingProps {
  siteId: string
}

export default function ConversionTracking({ siteId }: ConversionTrackingProps) {
  const [conversions, setConversions] = useState<ConversionEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | '3months' | 'all'>('month')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    const loadConversions = async () => {
      try {
        setLoading(true)
        const data = await getConversions(siteId, selectedPeriod)
        setConversions(data)
      } catch (error) {
        console.error('Error loading conversions:', error)
      } finally {
        setLoading(false)
      }
    }
    loadConversions()
  }, [siteId, selectedPeriod])

  const filteredConversions = selectedType === 'all' 
    ? conversions 
    : conversions.filter(c => c.type === selectedType)

  const totalRevenue = filteredConversions.reduce((sum, c) => sum + c.value, 0)
  const totalConversions = filteredConversions.length
  const avgValue = totalConversions > 0 ? totalRevenue / totalConversions : 0

  const conversionTypes = [
    { id: 'all', label: 'Όλα', icon: Target, color: 'blue' },
    { id: 'booking', label: 'Bookings', icon: Calendar, color: 'emerald' },
    { id: 'contact_form', label: 'Contact Forms', icon: FileText, color: 'purple' },
    { id: 'phone_call', label: 'Phone Calls', icon: Phone, color: 'amber' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, color: 'indigo' },
    { id: 'review', label: 'Reviews', icon: Star, color: 'rose' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('el-GR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTypeIcon = (type: string) => {
    const typeMap: Record<string, any> = {
      booking: Calendar,
      contact_form: FileText,
      phone_call: Phone,
      newsletter: Mail,
      review: Star
    }
    return typeMap[type] || Target
  }

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      booking: 'emerald',
      contact_form: 'purple',
      phone_call: 'amber',
      newsletter: 'indigo',
      review: 'rose'
    }
    return colorMap[type] || 'blue'
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-emerald-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Conversions</p>
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : totalConversions}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12% vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-blue-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8% vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-purple-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Avg. Value</p>
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : formatCurrency(avgValue)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 dark:text-purple-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+5% vs last period</span>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 dark:text-white"
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="3months">3 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {conversionTypes.map((type) => {
            const Icon = type.icon
            const isActive = selectedType === type.id
            return (
              <motion.button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 text-white shadow-lg`
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{type.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Conversions List */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conversion History</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
            <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Export</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredConversions.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No conversions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversions.slice(0, 50).map((conversion, index) => {
              const Icon = getTypeIcon(conversion.type)
              const color = getTypeColor(conversion.type)
              return (
                <motion.div
                  key={conversion.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 bg-gradient-to-r from-${color}-50/50 to-transparent dark:from-slate-700/50 dark:to-transparent rounded-xl border border-${color}-200/50 dark:border-slate-600 hover:shadow-md transition-all`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl`}>
                      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white capitalize">
                        {conversion.type.replace('_', ' ')}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{conversion.page}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{conversion.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(conversion.value)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(conversion.timestamp instanceof Date ? conversion.timestamp : conversion.timestamp.toDate())}
                      </p>
                    </div>
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

