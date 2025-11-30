'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Mail, 
  FileText, 
  Star, 
  Snowflake, 
  Bell,
  ChevronRight,
  Search,
  Settings,
  User,
  Home,
  Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PegasusSignature from '@/components/PegasusSignature';
import { AcronFlowNowIcon } from '@/components/acronflow-now-icon';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string; // Optional external link
}

interface AdminNavbarProps {
  user: {
    email: string | null;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  navItems: NavItem[];
  logo?: string;
  brandName?: string;
}

export default function AdminNavbar({
  user,
  activeTab,
  onTabChange,
  onLogout,
  navItems,
  logo,
  brandName = 'Admin Panel'
}: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar - Floating Glass Design */}
      <nav className={`
        fixed top-4 left-4 right-4 z-50
        bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl
        border border-white/30 dark:border-slate-700/30
        rounded-2xl shadow-2xl
        transition-all duration-300
        ${scrolled ? 'shadow-2xl bg-white/40 dark:bg-slate-900/40' : 'shadow-xl'}
      `}>
        <div className="px-4 sm:px-5 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            {/* Left: Logo & Brand */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="currentColor" className="text-slate-700 dark:text-slate-300">
                    <g fill="currentColor">
                      <path d="M26 14c0 6.627-5.373 12-12 12S2 20.627 2 14S7.373 2 14 2s12 5.373 12 12Z" opacity=".2"/>
                      <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h11.308a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5Zm0-4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5Zm0 8a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5Zm0 4a.5.5 0 0 1 .5-.5h11.308a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5Z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" clipRule="evenodd"/>
                    </g>
                  </svg>
                )}
              </button>
              
              {/* Shop Logo */}
              {logo && (
                <img
                  src={logo}
                  alt={brandName}
                  className="h-6 sm:h-8 w-auto flex-shrink-0"
                />
              )}
              
              {/* Pegasus Signature */}
              <div className="hidden sm:flex items-center gap-2">
                <PegasusSignature className="opacity-80" />
              </div>
            </div>

            {/* Center: Desktop Navigation - All Items (AcronFlow CRM Style) */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center mx-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                // Extract color from gradient string (e.g., "from-blue-600" -> "blue")
                const colorMatch = item.color.match(/from-(\w+)-/);
                const colorName = colorMatch ? colorMatch[1] : 'blue';
                const colorClasses = {
                  blue: {
                    text: 'text-blue-600 dark:text-blue-400',
                    iconBg: 'bg-blue-500/10',
                    iconBgActive: 'bg-blue-500/15',
                    border: 'border-blue-300/60',
                    ring: 'ring-blue-500/20',
                  },
                  green: {
                    text: 'text-green-600 dark:text-green-400',
                    iconBg: 'bg-green-500/10',
                    iconBgActive: 'bg-green-500/15',
                    border: 'border-green-300/60',
                    ring: 'ring-green-500/20',
                  },
                  purple: {
                    text: 'text-purple-600 dark:text-purple-400',
                    iconBg: 'bg-purple-500/10',
                    iconBgActive: 'bg-purple-500/15',
                    border: 'border-purple-300/60',
                    ring: 'ring-purple-500/20',
                  },
                  indigo: {
                    text: 'text-indigo-600 dark:text-indigo-400',
                    iconBg: 'bg-indigo-500/10',
                    iconBgActive: 'bg-indigo-500/15',
                    border: 'border-indigo-300/60',
                    ring: 'ring-indigo-500/20',
                  },
                  amber: {
                    text: 'text-amber-600 dark:text-amber-400',
                    iconBg: 'bg-amber-500/10',
                    iconBgActive: 'bg-amber-500/15',
                    border: 'border-amber-300/60',
                    ring: 'ring-amber-500/20',
                  },
                  red: {
                    text: 'text-red-600 dark:text-red-400',
                    iconBg: 'bg-red-500/10',
                    iconBgActive: 'bg-red-500/15',
                    border: 'border-red-300/60',
                    ring: 'ring-red-500/20',
                  },
                };
                const colors = colorClasses[colorName as keyof typeof colorClasses] || colorClasses.blue;
                
                // Handle external links
                if (item.href) {
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        transition-all duration-200 whitespace-nowrap
                        text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-white/5 border-gray-200/40 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/10
                        backdrop-blur-xl border ring-0 shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                      `}
                    >
                      <div className={`
                        relative flex items-center justify-center rounded-full transition-colors duration-200
                        w-5 h-5 text-[#63DB00]
                        bg-[#63DB00]/10 group-hover:bg-[#63DB00]/15
                      `}>
                        {item.id === 'appointments' ? (
                          <AcronFlowNowIcon size={14} className="text-[#63DB00]" />
                        ) : (
                          <Icon className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span className="text-[12px] font-medium">{item.label}</span>
                    </motion.a>
                  );
                }
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? `${colors.text} bg-white/40 dark:bg-white/10 ${colors.border} ${colors.ring} shadow-[0_6px_16px_rgba(0,0,0,0.12)]` 
                        : 'text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-white/5 border-gray-200/40 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/10'
                      }
                      backdrop-blur-xl border ring-0 shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                    `}
                  >
                    <div className={`
                      relative flex items-center justify-center rounded-full transition-colors duration-200
                      w-5 h-5 ${colors.text}
                      ${isActive ? colors.iconBgActive : colors.iconBg}
                      ${!isActive && 'group-hover:bg-opacity-15'}
                    `}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[12px] font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right: User Menu & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Button (Desktop) */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-gray-200/40 dark:border-white/5 backdrop-blur-xl shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* User Avatar & Menu - AcronFlow CRM Style */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-white/30 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 border border-gray-200/40 dark:border-white/5 backdrop-blur-xl shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold">
                          {user.email?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Crown Badge - Owner Role */}
                    <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 rounded-full p-[2px] ring-1 shadow-sm transform -rotate-12 bg-gradient-to-br from-amber-200/70 via-amber-300/70 to-yellow-400/70 ring-amber-300/50" aria-label="owner badge">
                      <div className="relative flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-50/60">
                        <span className="absolute inset-0 rounded-full blur-[2px] bg-amber-300/40"></span>
                        <Crown className="relative w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-600" strokeWidth={2.2} />
                      </div>
                    </div>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white dark:border-zinc-900 animate-pulse"></div>
                  </div>
                  
                  <div className="hidden sm:block text-left min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px] lg:max-w-[150px]">
                      {user.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] lg:max-w-[150px]">
                      {user.email || ''}
                    </p>
                  </div>
                  <ChevronRight 
                    className={`h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform ${isUserMenuOpen ? 'rotate-90' : ''}`}
                  />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                         className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-2xl border border-white/30 dark:border-slate-700/30 shadow-2xl z-50 overflow-hidden"
                       >
                        <div className="p-2">
                          <div className="px-3 py-2 mb-2 border-b border-slate-200">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              router.push('/');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                          >
                            <Home className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">Go to Website</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                          >
                            <Settings className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">Settings</span>
                          </button>
                          
                          <div className="my-2 border-t border-slate-200" />
                          
                          <button
                            onClick={() => {
                              onLogout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-semibold">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-r border-white/30 dark:border-slate-700/30 shadow-2xl z-50 lg:hidden overflow-y-auto"
             >
              <div className="flex flex-col h-full">
                 {/* Mobile Header */}
                 <div className="p-4 sm:p-5 border-b border-white/30 dark:border-slate-700/30">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                       {logo && (
                         <img
                           src={logo}
                           alt={brandName}
                           className="h-8 w-auto"
                         />
                       )}
                       <PegasusSignature className="opacity-80" />
                     </div>
                     <button
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="p-2 rounded-xl hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
                     >
                       <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                     </button>
                   </div>
                 </div>

                {/* Mobile Navigation */}
                <div className="flex-1 p-4 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    // Extract color from gradient string (e.g., "from-blue-600" -> "blue")
                    const colorMatch = item.color.match(/from-(\w+)-/);
                    const colorName = colorMatch ? colorMatch[1] : 'blue';
                    const colorClasses = {
                      blue: {
                        text: 'text-blue-600 dark:text-blue-400',
                        iconBg: 'bg-blue-500/10',
                        iconBgActive: 'bg-blue-500/15',
                        border: 'border-blue-300/60',
                        ring: 'ring-blue-500/20',
                      },
                      green: {
                        text: 'text-green-600 dark:text-green-400',
                        iconBg: 'bg-green-500/10',
                        iconBgActive: 'bg-green-500/15',
                        border: 'border-green-300/60',
                        ring: 'ring-green-500/20',
                      },
                      purple: {
                        text: 'text-purple-600 dark:text-purple-400',
                        iconBg: 'bg-purple-500/10',
                        iconBgActive: 'bg-purple-500/15',
                        border: 'border-purple-300/60',
                        ring: 'ring-purple-500/20',
                      },
                      indigo: {
                        text: 'text-indigo-600 dark:text-indigo-400',
                        iconBg: 'bg-indigo-500/10',
                        iconBgActive: 'bg-indigo-500/15',
                        border: 'border-indigo-300/60',
                        ring: 'ring-indigo-500/20',
                      },
                      amber: {
                        text: 'text-amber-600 dark:text-amber-400',
                        iconBg: 'bg-amber-500/10',
                        iconBgActive: 'bg-amber-500/15',
                        border: 'border-amber-300/60',
                        ring: 'ring-amber-500/20',
                      },
                      red: {
                        text: 'text-red-600 dark:text-red-400',
                        iconBg: 'bg-red-500/10',
                        iconBgActive: 'bg-red-500/15',
                        border: 'border-red-300/60',
                        ring: 'ring-red-500/20',
                      },
                    };
                    const colors = colorClasses[colorName as keyof typeof colorClasses] || colorClasses.blue;

                    // Handle external links in mobile
                    if (item.href) {
                      return (
                        <motion.a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-full font-medium text-sm
                            transition-all duration-200 min-h-[60px]
                            bg-white/30 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 border border-gray-200/40 dark:border-white/5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                            backdrop-blur-xl shadow-[0_1px_1px_rgba(0,0,0,0.06)]
                          `}
                        >
                          <div className={`
                            relative flex items-center justify-center rounded-full transition-colors duration-200
                            w-7 h-7 bg-[#63DB00]/10
                          `}>
                            {item.id === 'appointments' ? (
                              <AcronFlowNowIcon size={16} className="text-[#63DB00]" />
                            ) : (
                              <Icon className="h-4 w-4 text-[#63DB00]" />
                            )}
                          </div>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </motion.a>
                      );
                    }
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-full font-medium text-sm
                          transition-all duration-200 min-h-[60px]
                          ${isActive 
                            ? `${colors.text} bg-white/40 dark:bg-white/10 ${colors.border} ${colors.ring} shadow-[0_6px_16px_rgba(0,0,0,0.12)]` 
                            : 'text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-white/5 border-gray-200/40 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/10'
                          }
                          backdrop-blur-xl border ring-0 shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                        `}
                      >
                        <div className={`
                          relative flex items-center justify-center rounded-full transition-colors duration-200
                          w-7 h-7 ${colors.text}
                          ${isActive ? colors.iconBgActive : colors.iconBg}
                        `}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && <ChevronRight className={`h-4 w-4 ${colors.text}`} />}
                      </motion.button>
                    );
                  })}
                </div>

                 {/* Mobile Footer */}
                 <div className="p-4 border-t border-white/30 dark:border-slate-700/30">
                   <div className="flex items-center gap-3 mb-4 p-3 bg-white/30 dark:bg-white/5 rounded-full border border-gray-200/40 dark:border-white/5 backdrop-blur-xl">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                       <span className="text-white text-sm font-bold">
                         {user.email?.charAt(0).toUpperCase() || 'A'}
                       </span>
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email?.split('@')[0] || 'Admin'}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || ''}</p>
                     </div>
                   </div>
                   <button
                     onClick={() => {
                       onLogout();
                       setIsMobileMenuOpen(false);
                     }}
                     className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-900/40 border border-red-200/40 dark:border-red-800/40 text-red-700 dark:text-red-300 rounded-full font-medium transition-all duration-200 backdrop-blur-xl shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
                   >
                     <LogOut className="h-5 w-5" />
                     <span>Logout</span>
                   </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed floating navbar */}
      <div className="h-16 sm:h-18 md:h-20" />
    </>
  );
}

