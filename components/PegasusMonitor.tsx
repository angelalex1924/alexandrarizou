"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle2, AlertCircle, Clock, Zap, Database, Server } from 'lucide-react'
import PegasusSignature from './PegasusSignature'

interface SystemStatus {
  status: 'online' | 'offline' | 'warning'
  responseTime: number
  uptime: number
  apiCalls: number
  lastCheck: Date
}

export default function PegasusMonitor() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'online',
    responseTime: 45,
    uptime: 99.9,
    apiCalls: 1247,
    lastCheck: new Date()
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 30) + 30, // 30-60ms
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 5),
        lastCheck: new Date()
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (systemStatus.status) {
      case 'online':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'warning':
        return 'text-amber-600 dark:text-amber-400'
      case 'offline':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }


  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('el-GR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md ${
                systemStatus.status === 'online' 
                  ? 'bg-emerald-500/20 dark:bg-emerald-500/30 border border-emerald-500/30' 
                  : systemStatus.status === 'warning'
                  ? 'bg-amber-500/20 dark:bg-amber-500/30 border border-amber-500/30'
                  : 'bg-red-500/20 dark:bg-red-500/30 border border-red-500/30'
              }`}>
                <Server className={`w-5 h-5 ${getStatusColor()}`} />
              </div>
              {systemStatus.status === 'online' && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white/80 dark:border-slate-900/80 shadow-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PegasusSignature />
                {systemStatus.status === 'online' ? (
                  <CheckCircle2 className={`w-4 h-4 ${getStatusColor()} flex-shrink-0`} />
                ) : systemStatus.status === 'warning' ? (
                  <AlertCircle className={`w-4 h-4 ${getStatusColor()} flex-shrink-0`} />
                ) : (
                  <AlertCircle className={`w-4 h-4 ${getStatusColor()} flex-shrink-0`} />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`font-medium ${getStatusColor()}`}>
                  {systemStatus.status === 'online' ? 'Online' : systemStatus.status === 'warning' ? 'Warning' : 'Offline'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {systemStatus.responseTime}ms
                </span>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            <svg
              className="w-4 h-4 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/20 dark:border-slate-700/30 bg-white/10 dark:bg-black/10 backdrop-blur-md"
          >
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Uptime</span>
                  </div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {formatUptime(systemStatus.uptime)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Response</span>
                  </div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {systemStatus.responseTime}ms
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Database className="w-3.5 h-3.5" />
                    <span>API Calls</span>
                  </div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {systemStatus.apiCalls.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last Check</span>
                  </div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {formatTime(systemStatus.lastCheck)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 dark:border-slate-700/30">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      System Integration Active
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Το σύστημα Pegasus είναι ενεργό και συνδέεται με επιτυχία με την εφαρμογή. 
                      Όλες οι λειτουργίες λειτουργούν κανονικά.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

