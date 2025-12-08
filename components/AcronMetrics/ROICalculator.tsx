"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calculator,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { getROIData, getConversions, ROIData } from '@/lib/acronMetrics'

interface ROICalculatorProps {
  siteId: string
}

export default function ROICalculator({ siteId }: ROICalculatorProps) {
  const [roiData, setRoiData] = useState<ROIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [customCost, setCustomCost] = useState(0)

  useEffect(() => {
    const loadROIData = async () => {
      try {
        setLoading(true)
        const data = await getROIData(siteId, selectedPeriod)
        if (data) {
          setRoiData({ ...data, cost: customCost || data.cost })
        }
      } catch (error) {
        console.error('Error loading ROI data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadROIData()
  }, [siteId, selectedPeriod, customCost])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('el-GR').format(num)
  }

  const netProfit = roiData ? roiData.revenue - roiData.cost : 0
  const roiPercentage = roiData && roiData.cost > 0 ? ((roiData.revenue - roiData.cost) / roiData.cost) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Main ROI Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold opacity-90 mb-2">Return on Investment</p>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="w-32 h-12 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <>
                  <p className="text-5xl font-bold">{roiPercentage.toFixed(1)}%</p>
                  {roiPercentage >= 0 ? (
                    <ArrowUpRight className="w-8 h-8" />
                  ) : (
                    <ArrowDownRight className="w-8 h-8" />
                  )}
                </>
              )}
            </div>
            <p className="text-sm opacity-80 mt-2">
              {selectedPeriod === 'daily' ? 'Today' :
               selectedPeriod === 'weekly' ? 'This Week' :
               selectedPeriod === 'monthly' ? 'This Month' : 'This Year'}
            </p>
          </div>
          <div className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Calculator className="w-12 h-12" />
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly' }
          ].map((period) => (
            <motion.button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedPeriod === period.id
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-emerald-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Revenue</p>
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : formatCurrency(roiData?.revenue || 0)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>From {roiData?.conversions || 0} conversions</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-rose-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Cost</p>
            <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mb-2">
            <input
              type="number"
              value={customCost || roiData?.cost || 0}
              onChange={(e) => setCustomCost(Number(e.target.value))}
              className="text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none w-full"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Edit to calculate custom ROI</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-blue-200 dark:border-slate-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Net Profit</p>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {loading ? '...' : formatCurrency(netProfit)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400">
            {netProfit >= 0 ? (
              <>
                <ArrowUpRight className="w-3 h-3" />
                <span>Positive return</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3 h-3" />
                <span>Negative return</span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* ROI Breakdown */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">ROI Breakdown</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Total Conversions</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedPeriod === 'daily' ? 'Today' :
                 selectedPeriod === 'weekly' ? 'This week' :
                 selectedPeriod === 'monthly' ? 'This month' : 'This year'}
              </p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : formatNumber(roiData?.conversions || 0)}
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Average Value per Conversion</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Revenue / Conversions</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading || !roiData || roiData.conversions === 0 ? '...' : formatCurrency(roiData.revenue / roiData.conversions)}
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">ROI Percentage</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {roiData && roiData.cost > 0 ? '((Revenue - Cost) / Cost) × 100' : 'Set cost to calculate'}
              </p>
            </div>
            <p className={`text-2xl font-bold ${roiPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {loading || !roiData || roiData.cost === 0 ? '...' : `${roiPercentage.toFixed(1)}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Insight */}
      {roiData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border-2 ${
            roiPercentage >= 0
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {roiPercentage >= 0 ? (
              <TrendingUp className={`w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1`} />
            ) : (
              <TrendingDown className={`w-6 h-6 text-rose-600 dark:text-rose-400 mt-1`} />
            )}
            <div>
              <p className={`font-bold text-lg mb-1 ${
                roiPercentage >= 0
                  ? 'text-emerald-900 dark:text-emerald-200'
                  : 'text-rose-900 dark:text-rose-200'
              }`}>
                {roiPercentage >= 0 ? 'Positive ROI!' : 'Negative ROI'}
              </p>
              <p className={`text-sm ${
                roiPercentage >= 0
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-700 dark:text-rose-300'
              }`}>
                {roiPercentage >= 0
                  ? `Your website generated ${formatCurrency(netProfit)} in profit after costs. Great performance!`
                  : `Your costs exceed revenue. Consider optimizing your marketing spend or improving conversion rates.`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

