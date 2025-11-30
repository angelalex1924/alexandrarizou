"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSignInPage } from '@/components/ui/admin-sign-in';
import { motion } from 'framer-motion';
import { LogOut, Settings, Users, Calendar, BarChart3, Shield, Home, Mail, FileText, Star, Snowflake, ArrowRight, Bell, Activity } from 'lucide-react';
import NewsletterDashboard from '@/components/NewsletterDashboard';
import TemplateEditor from '@/components/TemplateEditor';
import ReviewEmailForm from '@/components/ReviewEmailForm';
import TemplateEmailSender from '@/components/TemplateEmailSender';
import SavedTemplatesList from '@/components/SavedTemplatesList';
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';
import AnnouncementAdmin from '@/components/AnnouncementAdmin';
import PegasusSignature from '@/components/PegasusSignature';
import PegasusMonitor from '@/components/PegasusMonitor';
import { AcronFlowNowLogo, AcronFlowNowIcon } from '@/components/acronflow-now-icon';
import { AcronFlowLogo } from '@/components/acronflow-crm-logo';
import AdminNavbar from '@/components/AdminNavbar';
import AdminDashboardStats from '@/components/AdminDashboardStats';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, name: string, baseTemplateId?: string, [key: string]: any} | null>(null);
  const [savedTemplateData, setSavedTemplateData] = useState<any>(null);
  const [selectedTemplateForSend, setSelectedTemplateForSend] = useState<any>(null);
  const [showReviewEmailForm, setShowReviewEmailForm] = useState(false);
  const [showTemplateEmailSender, setShowTemplateEmailSender] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
        </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-700 font-medium text-lg"
          >
            Φόρτωση...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AdminSignInPage heroImageSrc="/assets/logo.png" />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-600 via-blue-700 to-blue-800' },
    { id: 'appointments', label: 'Ραντεβού', icon: AcronFlowNowIcon, color: 'from-green-500 to-emerald-500', href: 'https://www.crm.acronweb.com/dashboard/appointments' },
    { id: 'analytics', label: 'Analytics', icon: Activity, color: 'from-cyan-600 via-cyan-700 to-cyan-800' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, color: 'from-green-600 via-green-700 to-green-800' },
    { id: 'templates', label: 'Templates', icon: FileText, color: 'from-purple-600 via-purple-700 to-purple-800' },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'from-amber-600 via-amber-700 to-amber-800' },
    { id: 'template-emails', label: 'Template Emails', icon: Mail, color: 'from-indigo-600 via-indigo-700 to-indigo-800' },
    { id: 'christmas-schedule', label: 'Ειδικά Ωράρια', icon: Snowflake, color: 'from-red-600 via-green-600 to-emerald-700' },
    { id: 'announcements', label: 'Ανακοινώσεις', icon: Bell, color: 'from-blue-600 to-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Admin Navbar */}
      <AdminNavbar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        navItems={navItems}
        logo="/assets/logo.png"
        brandName="Alexandra Rizou Admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent leading-tight">
              Καλώς ήρθατε, <span className="text-blue-600">{user.email?.split('@')[0]}</span>!
          </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            Διαχειριστείτε το salon σας από αυτό το admin panel. Έχετε πλήρη έλεγχο σε όλες τις λειτουργίες.
          </p>
        </motion.div>

        {/* AcronFlow CRM Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 sm:mb-8"
        >
          <a
            href="https://www.crm.acronweb.com/dashboard/appointments"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative backdrop-blur-xl bg-gradient-to-r from-[#63DB00]/10 via-[#4CAF50]/10 to-[#7DE000]/10 dark:from-[#63DB00]/20 dark:via-[#4CAF50]/20 dark:to-[#7DE000]/20 border border-[#63DB00]/30 dark:border-[#4CAF50]/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#63DB00]/5 via-[#4CAF50]/5 to-[#7DE000]/5 dark:from-[#63DB00]/10 dark:via-[#4CAF50]/10 dark:to-[#7DE000]/10 group-hover:from-[#63DB00]/10 group-hover:via-[#4CAF50]/10 group-hover:to-[#7DE000]/10 transition-all duration-300"></div>
              
              <div className="relative px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left side - Logo and Text */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <AcronFlowNowLogo 
                        iconSize={20}
                        textSize="text-sm"
                        className="group-hover:scale-105 transition-transform duration-300"
                        horizontal={false}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-1 group-hover:text-[#63DB00] dark:group-hover:text-[#4CAF50] transition-colors duration-300">
                        Διαχείριση Ραντεβού
                      </h3>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 flex items-center gap-2 flex-wrap">
                        <span>Διαχειριστείτε όλα τα ραντεβού σας από το</span>
                        <AcronFlowLogo 
                          size="sm"
                          className="inline-flex"
                          variant="horizontal"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Button */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#63DB00] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#63DB00] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <span className="text-sm font-medium">Άνοιγμα</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Mobile Navigation (Legacy - can be removed if not needed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6 md:mb-8 lg:hidden"
        >
          <div className="lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border-2 border-slate-200/60 shadow-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg scale-[1.03] ring-2 ring-blue-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] ${
                  activeTab === 'newsletter'
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg scale-[1.03] ring-2 ring-blue-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Newsletter</span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] ${
                  activeTab === 'templates'
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg scale-[1.03] ring-2 ring-blue-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Templates</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg scale-[1.03] ring-2 ring-blue-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <Star className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('template-emails')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] col-span-2 sm:col-span-1 ${
                  activeTab === 'template-emails'
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg scale-[1.03] ring-2 ring-blue-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Template Emails</span>
              </button>
              <button
                onClick={() => setActiveTab('christmas-schedule')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] col-span-2 sm:col-span-1 ${
                  activeTab === 'christmas-schedule'
                    ? 'bg-gradient-to-br from-red-600 to-green-600 text-white shadow-lg scale-[1.03] ring-2 ring-green-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <Snowflake className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Ειδικά Ωράρια</span>
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`flex flex-col items-center justify-center space-y-2 px-3 py-4 sm:py-5 rounded-xl transition-all duration-300 touch-manipulation min-h-[90px] sm:min-h-[100px] col-span-2 sm:col-span-1 ${
                  activeTab === 'announcements'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.03] ring-2 ring-indigo-300/50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 active:scale-[0.97] bg-white border border-slate-200/50'
                }`}
              >
                <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-bold leading-tight text-center">Ανακοινώσεις</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Dashboard Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Στατιστικά & Επισκόπηση</h2>
              </div>
              <AdminDashboardStats />
            </motion.div>

            {/* Analytics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <AnalyticsDashboard />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 sm:mt-8 md:mt-10"
            >
              <div className="flex items-center gap-3 mb-5 sm:mb-6 md:mb-8">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Γρήγορες Ενέργειες</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open('/booking', '_blank')}
                  className="group flex flex-col items-start space-y-3 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-2xl hover:border-blue-300/70 transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-base sm:text-lg block mb-1">Νέο Ραντεβού</span>
                    <span className="text-xs sm:text-sm text-slate-500">Δημιουργήστε νέο ραντεβού</span>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('newsletter')}
                  className="group flex flex-col items-start space-y-3 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-white to-green-50/50 backdrop-blur-xl rounded-2xl border-2 border-green-200/50 shadow-lg hover:shadow-2xl hover:border-green-300/70 transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-base sm:text-lg block mb-1">Newsletter</span>
                    <span className="text-xs sm:text-sm text-slate-500">Διαχείριση newsletter</span>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('templates')}
                  className="group flex flex-col items-start space-y-3 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-xl rounded-2xl border-2 border-purple-200/50 shadow-lg hover:shadow-2xl hover:border-purple-300/70 transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-base sm:text-lg block mb-1">Templates</span>
                    <span className="text-xs sm:text-sm text-slate-500">Email templates</span>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('reviews')}
                  className="group flex flex-col items-start space-y-3 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-xl rounded-2xl border-2 border-orange-200/50 shadow-lg hover:shadow-2xl hover:border-orange-300/70 transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                      <Star className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-base sm:text-lg block mb-1">Reviews</span>
                    <span className="text-xs sm:text-sm text-slate-500">Διαχείριση reviews</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'newsletter' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NewsletterDashboard />
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {!showTemplateEditor ? (
              <div className="space-y-6">
                {/* Saved Templates Section */}
                <SavedTemplatesList onSelectTemplate={(template) => {
                  setSelectedTemplate({ id: template.id, name: template.name, ...template });
                  setSavedTemplateData(template);
                  setShowTemplateEditor(true);
                }} onSendTemplate={(template) => {
                  setSelectedTemplateForSend(template);
                  setShowTemplateEmailSender(true);
                }} />
                
                {/* Base Templates Section */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-7 border-2 border-slate-200/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 md:mb-8">
                    <div className="h-0.5 w-8 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Base Email Templates</h2>
                  </div>
              
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Email</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Welcome Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Welcome new subscribers</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'welcome', name: 'Welcome Email' });
                      setShowTemplateEditor(true);
                    }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    Edit Template
                  </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Promo</span>
                </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Promotion Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Promotional offers</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'promotion', name: 'Promotion Email' });
                      setShowTemplateEditor(true);
                    }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    Edit Template
                  </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Event</span>
                </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Event Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Special events</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'event', name: 'Event Email' });
                      setShowTemplateEditor(true);
                    }}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Review</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Review Request</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Request customer reviews</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'review', name: 'Review Request' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Mail className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Holiday</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Christmas Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Christmas greetings</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'christmas', name: 'Christmas Email' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Holiday</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">New Year Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">New Year greetings</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'newyear', name: 'New Year Email' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Mail className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Holiday</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Easter Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Easter greetings</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'easter', name: 'Easter Email' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-sky-100 rounded-lg">
                          <Mail className="w-5 h-5 text-sky-600" />
                        </div>
                        <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">Season</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Summer Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Summer greetings</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'summer', name: 'Summer Email' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        Edit Template
                      </button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Mail className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Season</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Autumn Email</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Autumn greetings</p>
                      <button
                        onClick={() => {
                          setSelectedTemplate({ id: 'autumn', name: 'Autumn Email' });
                          setShowTemplateEditor(true);
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    Edit Template
                  </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/95 backdrop-blur-xl rounded-2xl p-4 border-2 border-slate-200/60 shadow-xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowTemplateEditor(false);
                        setSelectedTemplate(null);
                        setSavedTemplateData(null);
                      }}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Template Editor</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTemplate?.name}</p>
                    </div>
                  </div>
                </div>
                {selectedTemplate && (
                  <TemplateEditor
                    templateId={selectedTemplate.baseTemplateId || selectedTemplate.id}
                    templateName={selectedTemplate.name}
                    savedTemplate={savedTemplateData || (selectedTemplate.id !== selectedTemplate.baseTemplateId ? selectedTemplate : undefined)}
                    onSave={(customization) => {
                      console.log('Template saved:', customization);
                      setShowTemplateEditor(false);
                      setSelectedTemplate(null);
                      setSavedTemplateData(null);
                    }}
                    onPreview={(customization) => {
                      console.log('Template preview:', customization);
                    }}
                    onClose={() => {
                      setShowTemplateEditor(false);
                      setSelectedTemplate(null);
                      setSavedTemplateData(null);
                    }}
                  />
                )}
            </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <AnalyticsDashboard />
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200/50 shadow-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6">Review Request System</h2>
              
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 md:mb-4">Send Review Request</h3>
                <p className="text-slate-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  Send review requests to customers who are not subscribed to the newsletter.
                </p>
                
                <button
                  onClick={() => {
                    console.log('Button clicked, setting showReviewEmailForm to true');
                    setShowReviewEmailForm(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg touch-manipulation w-full sm:w-auto"
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Review Request</span>
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">Review Link</h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">
                  Customers will be redirected to this Google review link:
                </p>
                <code className="bg-white px-2.5 sm:px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 block break-all overflow-x-auto">
                  https://share.google/NTHvLOlobEIU7Ajm4
                </code>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'template-emails' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200/50 shadow-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6">Template Email System</h2>
              
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 md:mb-4">Send Pre-made Email Templates</h3>
                <p className="text-slate-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  Στείλτε έτοιμα email templates για εορτές, προσφορές και ειδικές περιστάσεις.
                </p>
                
                <button
                  onClick={() => setShowTemplateEmailSender(true)}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg touch-manipulation w-full sm:w-auto"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Template Email</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 md:p-4 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">🎄 Χριστούγεννα 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">Χριστουγεννιάτικο email με ευχές και προσφορές</p>
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 md:p-4 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">🐣 Πάσχα 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">Πασχαλινό email με ευχές και προσφορές</p>
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 md:p-4 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">☀️ Καλοκαιρινή Προσφορά</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">Καλοκαιρινή προσφορά με εκπτώσεις</p>
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Προσφορές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 md:p-4 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">🎊 Πρωτοχρονιά 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">Πρωτοχρονιάτικο email με ευχές και νέες προσφορές</p>
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 md:p-4 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-1.5 sm:mb-2 text-sm sm:text-base">💕 Αγίου Βαλεντίνου</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">Αγίου Βαλεντίνου email με ειδικές προσφορές</p>
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Εορτές</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'christmas-schedule' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <HolidayScheduleAdmin />
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnnouncementAdmin />
          </motion.div>
        )}

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="group flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 active:from-blue-800 active:via-blue-900 active:to-indigo-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl touch-manipulation w-full sm:w-auto text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Επιστροφή στην Αρχική</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Footer Section with ACRONWEB and Pegasus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium flex-wrap">
            {/* ACRONWEB text - exact same as Footer */}
            <span className="acronweb-text-footer">
              <span 
                className="acron-text-footer font-bold tracking-tight" 
                style={{ 
                  fontFamily: "'Quizlo', 'Paytone One', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                  display: "inline-block",
                  verticalAlign: "baseline",
                }}
              >
                ACRON
              </span>
              <span 
                className="web-text-footer"
                style={{ 
                  fontFamily: "'Geogola', 'Gegola DEMO', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                  display: "inline-block",
                  verticalAlign: "baseline",
                }}
              >
                WEB
              </span>
            </span>
            {/* PegasusSignature with QurovademoBold font */}
            <PegasusSignature />
          </div>
          
          {/* Pegasus System Monitor */}
          <PegasusMonitor />
        </motion.div>
      </main>

      {/* Template Editor Modal */}
      {showTemplateEditor && selectedTemplate && (
        <TemplateEditor
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
          onSave={(customization) => {
            console.log('Template saved:', customization);
            setShowTemplateEditor(false);
            setSelectedTemplate(null);
          }}
          onPreview={(customization) => {
            console.log('Template preview:', customization);
          }}
          onClose={() => {
            setShowTemplateEditor(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Review Email Form Modal */}
      {showReviewEmailForm && (
        <>
          {console.log('showReviewEmailForm is true, rendering modal')}
          <ReviewEmailForm
            onClose={() => {
              console.log('Closing modal');
              setShowReviewEmailForm(false);
            }}
          />
        </>
      )}

      {/* Template Email Sender Modal */}
      {showTemplateEmailSender && (
        <TemplateEmailSender
          onClose={() => {
            setShowTemplateEmailSender(false);
            setSelectedTemplateForSend(null);
          }}
          preSelectedTemplate={selectedTemplateForSend}
        />
      )}
    </div>
  );
}

