"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Shield, Lock, UserCheck, Fingerprint, Globe, Key, Eye as EyeIcon, ArrowRight, Zap, Sparkles, Cpu, Smartphone, Laptop, Cloud, Database, ChevronRight, ChevronLeft, X, Home, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcronWebIDLogo } from '@/components/acronweb-id-logo';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface AdminSignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-400/50 focus-within:bg-white/20 focus-within:shadow-lg focus-within:shadow-blue-500/25">
    {children}
  </div>
);

// Enhanced AcronWeb ID Banner Component
const EnhancedAcronWebIDBanner = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isAutoRotating) {
      timerId = setInterval(() => {
        setActiveCardIndex((prev) => (prev + 1) % securityCards.length);
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isAutoRotating]);

  const handleCardHover = () => {
    setIsAutoRotating(false);
  };

  const handleCardLeave = () => {
    setIsAutoRotating(true);
  };

  const securityCards = [
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Ασφαλής Πιστοποίηση",
      description: "Πρωτόκολλα ασφαλείας στρατιωτικού επιπέδου",
      color: "from-[#0fad93] to-[#40B3A2]",
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: "Κρυπτογράφηση End-to-End",
      description: "Τα δεδομένα σας κρυπτογραφούνται σε κάθε βήμα",
      color: "from-[#56dc21] to-[#60f000]",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-white" />,
      title: "Επαλήθευση Ταυτότητας",
      description: "Διαδικασία επαλήθευσης πολλαπλών βημάτων",
      color: "from-[#ff605c] to-[#ff8c89]",
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-white" />,
      title: "Υποστήριξη Βιομετρικών",
      description: "Χρησιμοποιήστε δακτυλικό αποτύπωμα ή πρόσωπο",
      color: "from-[#ffbd44] to-[#ffda8a]",
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Παγκόσμια Πρόσβαση",
      description: "Πρόσβαση με ασφάλεια από παντού",
      color: "from-[#0fad93] to-[#56dc21]",
    },
    {
      icon: <Key className="w-6 h-6 text-white" />,
      title: "Σύνδεση Χωρίς Κωδικό",
      description: "Σύγχρονη πιστοποίηση χωρίς κωδικούς",
      color: "from-[#9333ea] to-[#a855f7]",
    },
  ];

  const handlePrevCard = () => {
    setIsAutoRotating(false);
    setActiveCardIndex((prev) => (prev - 1 + securityCards.length) % securityCards.length);
  };

  const handleNextCard = () => {
    setIsAutoRotating(false);
    setActiveCardIndex((prev) => (prev + 1) % securityCards.length);
  };

  const handleCardClick = (index: number) => {
    setActiveCardIndex(index);
    setIsAutoRotating(false);
  };

  return (
    <div
      className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex flex-col items-center justify-center overflow-hidden rounded-3xl"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#0fad93]/10 to-[#56dc21]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#ffbd44]/10 to-[#ff605c]/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#9333ea]/10 to-[#a855f7]/10 blur-3xl animate-pulse"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-full border-2 border-[#0fad93]/20 animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-20 h-20 rounded-full border-2 border-[#56dc21]/20 animate-[spin_20s_linear_infinite_reverse]"></div>
        <div className="absolute top-[60%] left-[30%] w-12 h-12 rounded-full border-2 border-[#9333ea]/20 animate-[spin_25s_linear_infinite]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-[30%] right-[20%] w-4 h-4 rounded-full bg-gradient-to-r from-[#0fad93] to-[#56dc21] opacity-70 blur-sm animate-pulse"></div>
        <div className="absolute bottom-[35%] left-[25%] w-6 h-6 rounded-full bg-gradient-to-r from-[#ffbd44] to-[#ff605c] opacity-70 blur-sm animate-pulse"></div>
        <div className="absolute top-[20%] left-[40%] w-3 h-3 rounded-full bg-gradient-to-r from-[#9333ea] to-[#a855f7] opacity-70 blur-sm animate-pulse"></div>
      </div>

      {/* Animated gradient rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#0fad93]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-8 rounded-full border-4 border-[#56dc21]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        <div className="absolute inset-16 rounded-full border-4 border-[#ffbd44]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* AcronWeb ID Logo - Enhanced */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <AcronWebIDLogo size="lg" showDescription={true} isGreek={true} />
          </div>
        </motion.div>

        {/* 3D Security Cards Stack */}
        <div className="relative w-full max-w-md h-[200px] flex items-center justify-center z-10 mb-8">
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-[#0fad93]/30 to-[#56dc21]/30 blur-3xl animate-pulse"></div>

          <div className="relative flex items-center justify-center">
            {securityCards.map((card, index) => {
              const isActive = index === activeCardIndex;
              const distance = Math.abs(index - activeCardIndex);
              const zIndex = isActive ? 0 : -distance * 15;
              const direction = index > activeCardIndex ? 1 : -1;
              const xOffset = isActive ? 0 : direction * (distance * 30);
              const yOffset = isActive ? 0 : direction * (distance * 10);
              const scale = isActive ? 1 : 1 - distance * 0.08;
              const opacity = isActive ? 1 : 1 - distance * 0.15;

              return (
                <motion.div
                  key={index}
                  className={`absolute w-[200px] h-[120px] rounded-2xl bg-gradient-to-br ${card.color} shadow-xl backdrop-blur-sm p-4 flex flex-col justify-between cursor-pointer`}
                  style={{
                    zIndex: securityCards.length - Math.abs(index - activeCardIndex),
                    transform: `translate3d(${xOffset}px, ${yOffset}px, ${zIndex}px) scale(${scale})`,
                    opacity: opacity,
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                  onClick={() => handleCardClick(index)}
                  onMouseEnter={handleCardHover}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      {card.icon}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm">{card.title}</h3>
                    {index === activeCardIndex && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-white/80 text-xs mt-1"
                      >
                        {card.description}
                      </motion.p>
                    )}
                    <div className="mt-2 w-12 h-0.5 bg-white/50 rounded-full"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Card navigation controls */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
            <button
              onClick={() => setActiveCardIndex((prev) => (prev - 1 + securityCards.length) % securityCards.length)}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <div className="flex gap-1">
              {securityCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeCardIndex ? "bg-gradient-to-r from-[#0fad93] to-[#56dc21]" : "bg-gray-300/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveCardIndex((prev) => (prev + 1) % securityCards.length)}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            {
              icon: <Zap className="w-5 h-5 text-[#0fad93]" />,
              title: "Άμεση Πρόσβαση",
              description: "Σύνδεση σε δευτερόλεπτα"
            },
            {
              icon: <Sparkles className="w-5 h-5 text-[#56dc21]" />,
              title: "Έξυπνη Ασφάλεια",
              description: "Προστασία με τεχνητή νοημοσύνη"
            },
            {
              icon: <Cpu className="w-5 h-5 text-[#ff605c]" />,
              title: "Έτοιμο για API",
              description: "Φιλικό προς προγραμματιστές"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -2, background: "rgba(255, 255, 255, 0.15)" }}
            >
              <div className="flex justify-center mb-2">{feature.icon}</div>
              <h4 className="text-sm font-semibold text-gray-800 mb-1">{feature.title}</h4>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating badges */}
      <motion.div
        className="absolute top-[10%] right-[10%] px-3 py-1 rounded-full bg-gradient-to-r from-[#0fad93]/80 to-[#56dc21]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Ασφαλές & Γρήγορο
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] left-[10%] px-3 py-1 rounded-full bg-gradient-to-r from-[#ffbd44]/80 to-[#ff605c]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Έτοιμο για Επιχείρηση
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[15%] px-3 py-1 rounded-full bg-gradient-to-r from-[#9333ea]/80 to-[#a855f7]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Cross-Platform
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const AdminSignInPage: React.FC<AdminSignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Καλώς ήρθατε</span>,
  description = "Συνδεθείτε για να αποκτήσετε πρόσβαση στο admin panel",
  heroImageSrc = "/assets/logo.png",
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Σφάλμα κατά την είσοδο');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <motion.button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-slate-700 hover:text-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">Επιστροφή στην Αρχική</span>
        </motion.button>
      </div>

      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-start md:items-center justify-center p-4 md:p-8 pt-8 md:pt-8 relative">
        <div className="w-full max-w-lg">
          <div className="flex flex-col gap-4 md:gap-8">
            {/* Logo - IMPRESSIVE & DOMINANT */}
            <div className="flex justify-center mb-4 md:mb-8">
              <div className="md:scale-[2.5] scale-[1.5] transform-gpu">
                <img 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
            
            <h1 
              className="welcome-title text-4xl md:text-6xl font-light leading-tight text-slate-600" 
              style={{ 
                fontFamily: 'Milker, Impact, Arial Black, Helvetica Neue, Arial, sans-serif !important',
                fontWeight: '300'
              }}
            >
              Καλώς ήρθατε στο Admin Panel
            </h1>
            
            {/* Subtle calm accent */}
            <motion.div
              className="mt-4 w-16 h-0.5 bg-gradient-to-r from-slate-300 to-transparent rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
            />
            <p className="animate-element animate-delay-200 text-slate-500 text-sm md:text-lg font-normal leading-relaxed">
              Συνδεθείτε για να αποκτήσετε πρόσβαση στο admin panel
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="animate-element animate-delay-300">
                <label className="text-base font-semibold text-slate-700 mb-3 block">Διεύθυνση Email</label>
                <GlassInputWrapper>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Εισάγετε το email σας" 
                    className="w-full bg-transparent text-base p-3 md:p-5 rounded-2xl focus:outline-none placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-base font-semibold text-slate-700">Κωδικός Πρόσβασης</label>
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Εισάγετε τον κωδικό σας" 
                      className="w-full bg-transparent text-base p-3 md:p-5 pr-14 rounded-2xl focus:outline-none placeholder:text-slate-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                      {showPassword ? <EyeOff className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" /> : <Eye className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 md:py-5 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-base md:text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
              </button>
            </form>

            {/* Mobile Powered by AcronWeb ID - Below Login Button */}
            <div className="mt-6 flex justify-center items-center gap-3 md:hidden">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/30 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Powered by</span>
                  <AcronWebIDLogo size="sm" showDescription={false} isGreek={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right column: Enhanced AcronWeb ID Banner */}
      <section className="hidden md:block flex-1 relative p-4">
        {/* Enhanced AcronWeb ID Banner */}
        <div className="absolute inset-4 flex items-center justify-center">
          <EnhancedAcronWebIDBanner />
        </div>
      </section>
    </div>
  );
};
