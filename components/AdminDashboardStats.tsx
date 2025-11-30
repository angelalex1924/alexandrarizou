'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  FileText, 
  Star, 
  Bell, 
  TrendingUp, 
  Download, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PegasusSignature from '@/components/PegasusSignature';

interface AdminDashboardStatsProps {
  className?: string;
}

export default function AdminDashboardStats({ className }: AdminDashboardStatsProps) {
  const [stats, setStats] = useState({
    subscribers: 0,
    templates: 0,
    reviews: 0,
    announcements: 0,
    loading: true
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch subscribers
        const subscribersSnapshot = await getDocs(collection(db, 'newsletter_subscribers'));
        
        // Fetch templates (assuming they're stored in Firestore)
        const templatesSnapshot = await getDocs(collection(db, 'emailTemplates'));
        
        // Fetch announcements
        const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
        
        setStats({
          subscribers: subscribersSnapshot.size,
          templates: templatesSnapshot.size,
          reviews: 0, // This would need to be fetched from your reviews collection
          announcements: announcementsSnapshot.size,
          loading: false
        });
        setLastUpdated(new Date());
        setSystemStatus('healthy');
      } catch (error) {
        console.error('Error fetching stats:', error);
        setSystemStatus('error');
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async (type: string) => {
    try {
      // Export functionality would go here
      alert(`Exporting ${type} data...`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const statCards = [
    {
      label: 'Συνδρομητές',
      value: stats.subscribers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => {}
    },
    {
      label: 'Templates',
      value: stats.templates,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => {}
    },
    {
      label: 'Reviews',
      value: stats.reviews,
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      onClick: () => {}
    },
    {
      label: 'Ανακοινώσεις',
      value: stats.announcements,
      icon: Bell,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      onClick: () => {}
    },
  ];

  return (
    <div className={className}>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
                 <motion.div
                   whileHover={{ y: -2 }}
                   className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700/50 p-6 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-200"
                 >
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex-1">
                       <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{stat.label}</p>
                       <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                         {stats.loading ? (
                           <span className="inline-block h-10 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                         ) : (
                           stat.value
                         )}
                       </p>
                     </div>
                     <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                       <Icon className={`w-6 h-6`} style={{ 
                         background: stat.color === 'from-blue-500 to-cyan-500' 
                           ? 'linear-gradient(to bottom right, #3b82f6, #06b6d4)'
                           : stat.color === 'from-purple-500 to-pink-500'
                           ? 'linear-gradient(to bottom right, #a855f7, #ec4899)'
                           : stat.color === 'from-amber-500 to-orange-500'
                           ? 'linear-gradient(to bottom right, #f59e0b, #f97316)'
                           : 'linear-gradient(to bottom right, #6366f1, #3b82f6)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         backgroundClip: 'text'
                       }} />
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className={`h-1.5 flex-1 rounded-full bg-gray-100 dark:bg-slate-700 mr-3`}>
                       <div className={`h-full rounded-full bg-gradient-to-r ${stat.color}`} style={{ width: '100%' }} />
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                       systemStatus === 'healthy' ? 'bg-emerald-500' :
                       systemStatus === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                     }`} />
              </div>
                 </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative bg-gradient-to-br from-white/90 via-blue-50/50 to-indigo-50/50 dark:from-slate-800/90 dark:via-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-blue-200/50 dark:border-slate-700/50 p-6 shadow-xl overflow-hidden"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Κατάσταση Συστήματος</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">System Health Monitor</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Status Items */}
          <div className="relative space-y-4 mb-4">
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl border border-blue-100/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Σύνδεση</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Ενεργό</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl border border-blue-100/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Βάση Δεδομένων</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Συνδεδεμένο</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl border border-blue-100/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Τελευταία Ενημέρωση</span>
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {lastUpdated.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

          {/* Pegasus Signature Footer */}
          <div className="relative flex items-center justify-center pt-4 border-t border-blue-200/50 dark:border-slate-700/50">
            <PegasusSignature className="opacity-70" />
          </div>
        </motion.div>

        {/* Quick Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-gradient-to-br from-white/90 via-indigo-50/50 to-purple-50/50 dark:from-slate-800/90 dark:via-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-indigo-200/50 dark:border-slate-700/50 p-6 shadow-xl overflow-hidden"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
           <div className="relative flex items-center gap-3 mb-5">
             <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
               <Download className="w-5 h-5 text-white" />
             </div>
             <div className="flex-1">
               <div className="flex items-center gap-2">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Εξαγωγή Δεδομένων</h3>
                 <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                   Coming Soon
                 </span>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400">Export Data</p>
             </div>
           </div>
          <div className="relative grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('subscribers')}
              className="flex flex-col items-center gap-2.5 p-4 bg-white/70 dark:bg-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-700/70 rounded-xl border border-blue-200/50 dark:border-slate-600/50 hover:border-blue-300/70 dark:hover:border-slate-500/70 transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Συνδρομητές</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('templates')}
              className="flex flex-col items-center gap-2.5 p-4 bg-white/70 dark:bg-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-700/70 rounded-xl border border-purple-200/50 dark:border-slate-600/50 hover:border-purple-300/70 dark:hover:border-slate-500/70 transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Templates</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('announcements')}
              className="flex flex-col items-center gap-2.5 p-4 bg-white/70 dark:bg-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-700/70 rounded-xl border border-indigo-200/50 dark:border-slate-600/50 hover:border-indigo-300/70 dark:hover:border-slate-500/70 transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ανακοινώσεις</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('all')}
              className="flex flex-col items-center gap-2.5 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-slate-300/70 dark:hover:border-slate-500/70 transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-lg">
                <Download className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Όλα</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative bg-gradient-to-br from-white/90 via-green-50/50 to-emerald-50/50 dark:from-slate-800/90 dark:via-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-green-200/50 dark:border-slate-700/50 p-6 shadow-xl overflow-hidden"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        
        <div className="relative flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Πρόσφατη Δραστηριότητα</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recent Activity</p>
          </div>
        </div>
        <div className="relative space-y-3">
          <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-slate-700/40 rounded-xl border border-green-100/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-700/60 transition-colors">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Σύστημα ενεργό</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Όλα τα συστήματα λειτουργούν κανονικά</p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{new Date().toLocaleDateString('el-GR')}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-slate-700/40 rounded-xl border border-blue-100/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-700/60 transition-colors">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Στατιστικά ενημερώθηκαν</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Τελευταία ενημέρωση: {lastUpdated.toLocaleTimeString('el-GR')}</p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{new Date().toLocaleDateString('el-GR')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


