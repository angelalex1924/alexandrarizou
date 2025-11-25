'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, Clock, Save, Sparkles, Snowflake, Check } from 'lucide-react';
import { ChristmasSchedule } from '@/hooks/useChristmasSchedule';

// Helper function to format date beautifully
const formatDateBeautiful = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('el-GR', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

export default function ChristmasScheduleAdmin() {
  const [schedule, setSchedule] = useState<ChristmasSchedule>({
    name: 'Χριστουγεννιάτικο Ωράριο',
    type: 'christmas',
    isActive: false,
    enabled: false,
    isClosed: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    startDate: '',
    endDate: '',
    schedule: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    dates: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const days = [
    { key: 'monday', label: 'Δευτέρα', labelEn: 'Monday', icon: '1️⃣' },
    { key: 'tuesday', label: 'Τρίτη', labelEn: 'Tuesday', icon: '2️⃣' },
    { key: 'wednesday', label: 'Τετάρτη', labelEn: 'Wednesday', icon: '3️⃣' },
    { key: 'thursday', label: 'Πέμπτη', labelEn: 'Thursday', icon: '4️⃣' },
    { key: 'friday', label: 'Παρασκευή', labelEn: 'Friday', icon: '5️⃣' },
    { key: 'saturday', label: 'Σάββατο', labelEn: 'Saturday', icon: '6️⃣' },
    { key: 'sunday', label: 'Κυριακή', labelEn: 'Sunday', icon: '7️⃣' }
  ] as const;

  const timePresets = [
    '10:00-18:00',
    '10:00-20:00',
    '10:00-19:00',
    '09:00-17:00',
    'Κλειστά'
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const scheduleRef = doc(db, 'settings', 'christmasSchedule');
      const docSnapshot = await getDoc(scheduleRef);
      
      if (docSnapshot.exists()) {
        setSchedule(docSnapshot.data() as ChristmasSchedule);
      } else {
        const defaultSchedule: ChristmasSchedule = {
          name: 'Χριστουγεννιάτικο Ωράριο',
          type: 'christmas',
          isActive: false,
          enabled: false,
          isClosed: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
          },
          startDate: '',
          endDate: '',
          schedule: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          },
          dates: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          }
        };
        setSchedule(defaultSchedule);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      setMessage({ type: 'error', text: 'Σφάλμα φόρτωσης ωραρίου' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      if (schedule.enabled && (!schedule.startDate || !schedule.endDate)) {
        setMessage({ type: 'error', text: 'Παρακαλώ επιλέξτε ημερομηνίες έναρξης και λήξης' });
        setSaving(false);
        return;
      }

      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      if (endDate < startDate) {
        setMessage({ type: 'error', text: 'Η ημερομηνία λήξης πρέπει να είναι μετά την έναρξη' });
        setSaving(false);
        return;
      }

      const now = new Date();
      const isActive = schedule.enabled && now >= startDate && now <= endDate;

      const scheduleToSave: ChristmasSchedule = {
        ...schedule,
        isActive,
        updatedAt: serverTimestamp()
      };

      const scheduleRef = doc(db, 'settings', 'christmasSchedule');
      await setDoc(scheduleRef, scheduleToSave);

      setMessage({ type: 'success', text: 'Το χριστουγεννιάτικο ωράριο αποθηκεύτηκε με επιτυχία! 🎄' });
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setMessage({ type: 'error', text: 'Σφάλμα αποθήκευσης. Παρακαλώ δοκιμάστε ξανά.' });
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = (day: string, hours: string) => {
    setSchedule(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: hours
      }
    }));
  };

  const applyPreset = (day: string, preset: string) => {
    updateSchedule(day, preset);
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
        <div className="p-3 bg-gradient-to-br from-red-500 to-green-500 rounded-xl shadow-lg">
          <Snowflake className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Χριστουγεννιάτικο Ωράριο
            <span className="text-xl">🎄</span>
          </h2>
          <p className="text-slate-600 text-sm">Ρυθμίστε το ωράριο για τις γιορτές</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-2 border-green-300'
              : 'bg-red-50 text-red-800 border-2 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' && <Check className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        </motion.div>
      )}

      {/* Enable Toggle - Better Design */}
      <div className="mb-6 p-5 bg-gradient-to-r from-red-50 via-white to-green-50 rounded-xl border-2 border-red-200 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) => setSchedule(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-6 h-6 text-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <span className="font-bold text-slate-800 text-lg block mb-1">
              Ενεργοποίηση Χριστουγεννιάτικου Ωραρίου
            </span>
            <p className="text-sm text-slate-600">
              Το ωράριο θα εμφανίζεται αυτόματα κατά την επιλεγμένη περίοδο
            </p>
          </div>
        </label>
      </div>

      {/* Date Range - Beautiful Format */}
      {schedule.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-base">
              <Calendar className="w-5 h-5 text-red-500" />
              Ημερομηνία Έναρξης
            </label>
            <input
              type="date"
              value={schedule.startDate}
              onChange={(e) => setSchedule(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-slate-700"
            />
            {schedule.startDate && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                📅 {formatDateBeautiful(schedule.startDate)}
              </p>
            )}
          </div>

          <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-base">
              <Calendar className="w-5 h-5 text-green-500" />
              Ημερομηνία Λήξης
            </label>
            <input
              type="date"
              value={schedule.endDate}
              onChange={(e) => setSchedule(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-slate-700"
            />
            {schedule.endDate && (
              <p className="mt-2 text-sm font-semibold text-green-600">
                📅 {formatDateBeautiful(schedule.endDate)}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Schedule Inputs - Compact Grid */}
      {schedule.enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            Ωράριο ανά Ημέρα
          </h3>
          
          {/* Time Presets */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Γρήγορα Presets:</p>
            <div className="flex flex-wrap gap-2">
              {timePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    // Apply to all days except Sunday
                    days.forEach(day => {
                      if (day.key !== 'sunday') {
                        applyPreset(day.key, preset);
                      }
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {days.map((day, index) => (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border-2 border-slate-200 hover:border-red-300 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{day.icon}</span>
                  <label className="font-bold text-slate-700 flex-1">
                    {day.label}
                  </label>
                  {/* Is Closed Checkbox for this day */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.isClosed?.[day.key as keyof typeof schedule.isClosed] || false}
                      onChange={(e) => {
                        setSchedule(prev => ({
                          ...prev,
                          isClosed: {
                            ...prev.isClosed,
                            [day.key]: e.target.checked
                          }
                        }));
                      }}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-red-600">Κλειστά</span>
                  </label>
                </div>
                
                {/* Date Input */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Ημερομηνία (προαιρετικό):</label>
                  <input
                    type="date"
                    value={schedule.dates?.[day.key as keyof typeof schedule.dates] || ''}
                    onChange={(e) => {
                      setSchedule(prev => ({
                        ...prev,
                        dates: {
                          ...prev.dates,
                          [day.key]: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                  />
                  {schedule.dates?.[day.key as keyof typeof schedule.dates] && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      📅 {formatDateBeautiful(schedule.dates[day.key as keyof typeof schedule.dates]!)}
                    </p>
                  )}
                </div>
                
                {/* Preset Buttons for this day */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {timePresets.slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(day.key, preset)}
                      className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                        schedule.schedule[day.key as keyof typeof schedule.schedule] === preset
                          ? 'bg-red-100 border-red-400 text-red-700'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <input
                  type="text"
                  placeholder={day.key === 'sunday' ? 'Κλειστά' : 'π.χ. 10:00-18:00'}
                  value={schedule.schedule[day.key as keyof typeof schedule.schedule] || ''}
                  onChange={(e) => updateSchedule(day.key, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status Indicator - Beautiful */}
      {schedule.enabled && schedule.startDate && schedule.endDate && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-800">Κατάσταση</span>
          </div>
          {schedule.isActive ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-green-700 font-bold">
                Το χριστουγεννιάτικο ωράριο είναι <span className="text-lg">ενεργό</span> τώρα!
              </p>
            </div>
          ) : (
            <div>
              <p className="text-slate-700 font-medium mb-1">
                ⏳ Το χριστουγεννιάτικο ωράριο θα ενεργοποιηθεί:
              </p>
              <p className="text-slate-600 text-sm">
                <strong>Από:</strong> {formatDateBeautiful(schedule.startDate)}
              </p>
              <p className="text-slate-600 text-sm">
                <strong>Έως:</strong> {formatDateBeautiful(schedule.endDate)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-green-600 hover:from-red-700 hover:via-red-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Αποθήκευση...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Αποθήκευση Ωραρίου</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
