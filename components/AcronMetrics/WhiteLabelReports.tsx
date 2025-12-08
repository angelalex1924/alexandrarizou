"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Mail,
  Calendar,
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface WhiteLabelReportsProps {
  siteId: string
}

export default function WhiteLabelReports({ siteId }: WhiteLabelReportsProps) {
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'custom'>('monthly')
  const [includeBranding, setIncludeBranding] = useState(true)

  const handleGenerateReport = async () => {
    // This would generate a PDF report
    alert('Report generation coming soon!')
  }

  const handleExportPDF = () => {
    alert('PDF export coming soon!')
  }

  const handleEmailReport = () => {
    alert('Email report coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">White-Label Reports</h3>
            <p className="text-sm opacity-90">Generate professional reports for your clients</p>
          </div>
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
            <FileText className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Settings */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Report Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'custom', label: 'Custom' }
                ].map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setReportType(type.id as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      reportType === type.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview & Summary' },
                  { id: 'conversions', label: 'Conversion Tracking' },
                  { id: 'performance', label: 'Performance Metrics' },
                  { id: 'seo', label: 'SEO Health Score' },
                  { id: 'roi', label: 'ROI Analysis' }
                ].map((section) => (
                  <label key={section.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={includeBranding}
                  onChange={(e) => setIncludeBranding(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Custom Branding</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Preview</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-indigo-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-900 dark:text-white">Report Title</p>
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {reportType === 'monthly' ? 'Monthly Performance Report' :
                 reportType === 'weekly' ? 'Weekly Performance Report' : 'Custom Performance Report'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">📊 Overview & Summary</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">🎯 Conversion Tracking</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">⚡ Performance Metrics</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">🔍 SEO Health Score</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">💰 ROI Analysis</p>
              </div>
            </div>

            {includeBranding && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Custom Branding Included</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          onClick={handleGenerateReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <FileText className="w-5 h-5" />
          <span>Generate Report</span>
        </motion.button>

        <motion.button
          onClick={handleExportPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </motion.button>

        <motion.button
          onClick={handleEmailReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <Mail className="w-5 h-5" />
          <span>Email Report</span>
        </motion.button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Reports</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Monthly Report - November 2024</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Generated 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No other reports yet. Generate your first report!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

