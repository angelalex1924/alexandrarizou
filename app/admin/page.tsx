"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSignInPage } from '@/components/ui/admin-sign-in';
import { motion } from 'framer-motion';
import { LogOut, Settings, Users, Calendar, BarChart3, Shield, Home, Mail, FileText, Star, Snowflake, ArrowRight } from 'lucide-react';
import NewsletterDashboard from '@/components/NewsletterDashboard';
import TemplateEditor from '@/components/TemplateEditor';
import ReviewEmailForm from '@/components/ReviewEmailForm';
import TemplateEmailSender from '@/components/TemplateEmailSender';
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';
import PegasusSignature from '@/components/PegasusSignature';
import { AcronFlowNowLogo } from '@/components/acronflow-now-icon';
import { AcronFlowLogo } from '@/components/acronflow-crm-logo';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, name: string} | null>(null);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminSignInPage heroImageSrc="/assets/logo.png" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image 
                src="/assets/logo.png" 
                alt="Logo" 
                width={120}
                height={32}
                className="h-6 sm:h-8 w-auto"
              />
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-slate-800 hidden sm:block">Admin Panel</span>
              <span className="ml-2 sm:ml-3 text-lg font-bold text-slate-800 sm:hidden">Admin</span>
            </div>
            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-700 font-medium text-sm sm:text-base hidden sm:block">{user.email}</span>
                <span className="text-slate-700 font-medium text-sm sm:hidden">{user.email?.split('@')[0]}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Αποσύνδεση</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Καλώς ήρθατε, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Διαχειριστείτε το salon σας από αυτό το admin panel
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

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1 bg-white/80 backdrop-blur-xl rounded-xl p-1 border border-white/20 shadow-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'newsletter'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Newsletter</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'templates'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </button>
            <button
              onClick={() => setActiveTab('template-emails')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'template-emails'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Template Emails</span>
            </button>
            <button
              onClick={() => setActiveTab('christmas-schedule')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'christmas-schedule'
                  ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              <span>Ειδικά Ωράρια</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/80 backdrop-blur-xl rounded-xl p-2 border border-white/20 shadow-lg">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'newsletter'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs font-medium">Newsletter</span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'templates'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs font-medium">Templates</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'reviews'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="text-xs font-medium">Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('template-emails')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 col-span-2 sm:col-span-1 ${
                  activeTab === 'template-emails'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs font-medium">Template Emails</span>
              </button>
              <button
                onClick={() => setActiveTab('christmas-schedule')}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 col-span-2 sm:col-span-1 ${
                  activeTab === 'christmas-schedule'
                    ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Snowflake className="w-5 h-5" />
                <span className="text-xs font-medium">Ειδικά Ωράρια</span>
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
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 sm:mt-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Γρήγορες Ενέργειες</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button 
                  onClick={() => window.open('/booking', '_blank')}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium text-slate-700 text-sm sm:text-base">Νέο Ραντεβού</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('newsletter')}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-medium text-slate-700 text-sm sm:text-base">Newsletter</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('templates')}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="font-medium text-slate-700 text-sm sm:text-base">Templates</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <span className="font-medium text-slate-700 text-sm sm:text-base">Reviews</span>
                </button>
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
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Email Templates</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2">Welcome Email</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Welcome new subscribers</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'welcome', name: 'Welcome Email' });
                      setShowTemplateEditor(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                  >
                    Edit Template
                  </button>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2">Promotion Email</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Promotional offers</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'promotion', name: 'Promotion Email' });
                      setShowTemplateEditor(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Template
                  </button>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2">Event Email</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Special events</p>
                  <button
                    onClick={() => {
                      setSelectedTemplate({ id: 'event', name: 'Event Email' });
                      setShowTemplateEditor(true);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Template
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Review Request System</h2>
              
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Send Review Request</h3>
                <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Send review requests to customers who are not subscribed to the newsletter.
                </p>
                
                <button
                  onClick={() => {
                    console.log('Button clicked, setting showReviewEmailForm to true');
                    setShowReviewEmailForm(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Review Request</span>
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-2">Review Link</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Customers will be redirected to this Google review link:
                </p>
                <code className="bg-white px-3 py-2 rounded border text-sm text-slate-800 block">
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
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Template Email System</h2>
              
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Send Pre-made Email Templates</h3>
                <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Στείλτε έτοιμα email templates για εορτές, προσφορές και ειδικές περιστάσεις.
                </p>
                
                <button
                  onClick={() => setShowTemplateEmailSender(true)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Template Email</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">🎄 Χριστούγεννα 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Χριστουγεννιάτικο email με ευχές και προσφορές</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">🐣 Πάσχα 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Πασχαλινό email με ευχές και προσφορές</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">☀️ Καλοκαιρινή Προσφορά</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Καλοκαιρινή προσφορά με εκπτώσεις</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Προσφορές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">🎊 Πρωτοχρονιά 2024</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Πρωτοχρονιάτικο email με ευχές και νέες προσφορές</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Εορτές</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">💕 Αγίου Βαλεντίνου</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">Αγίου Βαλεντίνου email με ειδικές προσφορές</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Εορτές</span>
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

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Επιστροφή στην Αρχική</span>
          </button>
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
          onClose={() => setShowTemplateEmailSender(false)}
        />
      )}
    </div>
  );
}

