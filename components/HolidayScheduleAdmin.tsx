'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, Clock, Save, Sparkles, Snowflake, Check, Plus, Trash2, Star, X } from 'lucide-react';
import { HolidaySchedule } from '@/hooks/useChristmasSchedule';

// Helper function to format date beautifully
const formatDateBeautiful = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('el-GR', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

export default function HolidayScheduleAdmin() {
  const [schedules, setSchedules] = useState<HolidaySchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<HolidaySchedule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
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

  const scheduleTypes = [
    { value: 'christmas', label: '🎄 Χριστουγεννιάτικο', icon: '🎄' },
    { value: 'newyear', label: '🎆 Πρωτοχρονιάτικο', icon: '🎆' },
    { value: 'easter', label: '🐰 Πασχαλινό', icon: '🐰' },
    { value: 'other', label: '📅 Άλλο', icon: '📅' }
  ];

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const schedulesRef = collection(db, 'holiday_schedules');
      const q = query(schedulesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const loadedSchedules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HolidaySchedule[];

      setSchedules(loadedSchedules);
      
      // Select the active schedule if exists
      const activeSchedule = loadedSchedules.find(s => s.isActive);
      if (activeSchedule) {
        setSelectedSchedule(activeSchedule);
      } else if (loadedSchedules.length > 0) {
        setSelectedSchedule(loadedSchedules[0]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      setMessage({ type: 'error', text: 'Σφάλμα φόρτωσης ωραρίων' });
    } finally {
      setLoading(false);
    }
  };

  const createNewSchedule = () => {
    const newSchedule: HolidaySchedule = {
      name: '',
      type: 'christmas' as 'christmas' | 'newyear' | 'easter' | 'other',
      isActive: false,
      isClosed: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
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
    setSelectedSchedule(newSchedule);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!selectedSchedule) return;

    try {
      setSaving(true);
      setMessage(null);

      if (!selectedSchedule.name.trim()) {
        setMessage({ type: 'error', text: 'Παρακαλώ εισάγετε όνομα για το ωράριο' });
        setSaving(false);
        return;
      }

      const scheduleToSave: Omit<HolidaySchedule, 'id'> = {
        ...selectedSchedule,
        updatedAt: serverTimestamp()
      };

      // If this schedule is being set as active, deactivate all others first
      if (selectedSchedule.isActive) {
        const batch = writeBatch(db);
        schedules.forEach(s => {
          if (s.id && s.isActive && s.id !== selectedSchedule.id) {
            const scheduleRef = doc(db, 'holiday_schedules', s.id);
            batch.update(scheduleRef, { isActive: false });
          }
        });
        await batch.commit();
      }

      if (isCreating) {
        // Create new schedule
        scheduleToSave.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'holiday_schedules'), scheduleToSave);
        setMessage({ type: 'success', text: 'Το ωράριο δημιουργήθηκε με επιτυχία! 🎄' });
        setIsCreating(false);
        await loadSchedules();
        // Select the newly created schedule
        const newSchedule = { ...selectedSchedule, id: docRef.id };
        setSelectedSchedule(newSchedule);
      } else if (selectedSchedule.id) {
        // Update existing schedule
        const scheduleRef = doc(db, 'holiday_schedules', selectedSchedule.id);
        await updateDoc(scheduleRef, scheduleToSave);
        setMessage({ type: 'success', text: 'Το ωράριο αποθηκεύτηκε με επιτυχία! 🎄' });
        await loadSchedules();
      }

      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setMessage({ type: 'error', text: 'Σφάλμα αποθήκευσης. Παρακαλώ δοκιμάστε ξανά.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ωράριο;')) {
      return;
    }

    try {
      setDeleting(scheduleId);
      const scheduleRef = doc(db, 'holiday_schedules', scheduleId);
      await deleteDoc(scheduleRef);
      
      setMessage({ type: 'success', text: 'Το ωράριο διαγράφηκε με επιτυχία!' });
      await loadSchedules();
      
      if (selectedSchedule?.id === scheduleId) {
        setSelectedSchedule(null);
        setIsCreating(false);
      }
      
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setMessage({ type: 'error', text: 'Σφάλμα διαγραφής. Παρακαλώ δοκιμάστε ξανά.' });
    } finally {
      setDeleting(null);
    }
  };

  const handleSetActive = async (scheduleId: string) => {
    try {
      // Deactivate all schedules first
      const batch = writeBatch(db);
      schedules.forEach(s => {
        if (s.id) {
          const scheduleRef = doc(db, 'holiday_schedules', s.id);
          batch.update(scheduleRef, { isActive: s.id === scheduleId });
        }
      });
      await batch.commit();
      
      await loadSchedules();
      setMessage({ type: 'success', text: 'Το ωράριο ενεργοποιήθηκε!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error setting active schedule:', error);
      setMessage({ type: 'error', text: 'Σφάλμα ενεργοποίησης. Παρακαλώ δοκιμάστε ξανά.' });
    }
  };

  const handleDeactivateAll = async () => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να απενεργοποιήσετε το ειδικό ωράριο;')) {
      return;
    }

    try {
      const batch = writeBatch(db);
      schedules.forEach(s => {
        if (s.id && s.isActive) {
          const scheduleRef = doc(db, 'holiday_schedules', s.id);
          batch.update(scheduleRef, { isActive: false });
        }
      });
      await batch.commit();
      
      await loadSchedules();
      setMessage({ type: 'success', text: 'Το ειδικό ωράριο απενεργοποιήθηκε!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deactivating schedules:', error);
      setMessage({ type: 'error', text: 'Σφάλμα απενεργοποίησης. Παρακαλώ δοκιμάστε ξανά.' });
    }
  };

  const updateSchedule = (day: string, hours: string) => {
    if (!selectedSchedule) return;
    setSelectedSchedule({
      ...selectedSchedule,
      schedule: {
        ...selectedSchedule.schedule,
        [day]: hours
      }
    });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-green-500 rounded-xl shadow-lg">
              <Snowflake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Ειδικά Ωράρια
                <span className="text-xl">🎄</span>
              </h2>
              <p className="text-slate-600 text-sm">Διαχείριση χριστουγεννιάτικων και πρωτοχρονιάτικων ωραρίων</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {schedules.some(s => s.isActive) && (
              <button
                onClick={handleDeactivateAll}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <X className="w-5 h-5" />
                <span>Απενεργοποίηση</span>
              </button>
            )}
            <button
              onClick={createNewSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Νέο Ωράριο</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-xl ${
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

        {/* Schedules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                schedule.isActive
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              } ${selectedSchedule?.id === schedule.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => {
                setSelectedSchedule({ ...schedule }); // Create a copy to avoid direct mutation
                setIsCreating(false);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {schedule.type === 'christmas' && <span>🎄</span>}
                    {schedule.type === 'newyear' && <span>🎆</span>}
                    {schedule.type === 'easter' && <span>🐰</span>}
                    {schedule.type === 'other' && <span>📅</span>}
                    <h3 className="font-bold text-slate-800">{schedule.name || 'Χωρίς όνομα'}</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    {scheduleTypes.find(t => t.value === schedule.type)?.label}
                  </p>
                </div>
                {schedule.isActive && (
                  <Star className="w-5 h-5 text-green-600 fill-green-600" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetActive(schedule.id!);
                  }}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    schedule.isActive
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {schedule.isActive ? 'Ενεργό' : 'Ενεργοποίηση'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(schedule.id!);
                  }}
                  disabled={deleting === schedule.id}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all disabled:opacity-50"
                >
                  {deleting === schedule.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Editor */}
      {selectedSchedule && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {isCreating ? 'Δημιουργία Νέου Ωραρίου' : 'Επεξεργασία Ωραρίου'}
              </h3>
              <p className="text-slate-600 text-sm">Ρυθμίστε το ωράριο</p>
            </div>
            {!isCreating && (
              <button
                onClick={() => {
                  setSelectedSchedule(null);
                  setIsCreating(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>

          {/* Schedule Name and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Όνομα Ωραρίου *
              </label>
              <input
                type="text"
                value={selectedSchedule.name}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, name: e.target.value })}
                placeholder="π.χ. Χριστουγεννιάτικο Ωράριο 2024"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Τύπος Ωραρίου
              </label>
              <select
                value={selectedSchedule.type}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, type: e.target.value as 'christmas' | 'newyear' | 'easter' | 'other' })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-slate-700"
              >
                {scheduleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 via-white to-red-50 rounded-xl border-2 border-green-200 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedSchedule.isActive}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, isActive: e.target.checked })}
                  className="w-6 h-6 text-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <span className="font-bold text-slate-800 text-lg block mb-1">
                  Ενεργοποίηση Ωραρίου
                </span>
                <p className="text-sm text-slate-600">
                  Το ωράριο θα εμφανίζεται αυτόματα στο site
                </p>
              </div>
            </label>
          </div>

          {/* Schedule Inputs */}
          <div className="mb-6">
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
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSchedule.isClosed?.[day.key as keyof typeof selectedSchedule.isClosed] || false}
                        onChange={(e) => {
                          setSelectedSchedule({
                            ...selectedSchedule,
                            isClosed: {
                              ...selectedSchedule.isClosed,
                              [day.key]: e.target.checked
                            }
                          });
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
                      value={selectedSchedule.dates?.[day.key as keyof typeof selectedSchedule.dates] || ''}
                      onChange={(e) => {
                        setSelectedSchedule({
                          ...selectedSchedule,
                          dates: {
                            ...selectedSchedule.dates,
                            [day.key]: e.target.value
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                    {selectedSchedule.dates?.[day.key as keyof typeof selectedSchedule.dates] && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        📅 {formatDateBeautiful(selectedSchedule.dates[day.key as keyof typeof selectedSchedule.dates]!)}
                      </p>
                    )}
                  </div>
                  
                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {timePresets.slice(0, 3).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => applyPreset(day.key, preset)}
                        className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                          selectedSchedule.schedule[day.key as keyof typeof selectedSchedule.schedule] === preset
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
                    value={selectedSchedule.schedule[day.key as keyof typeof selectedSchedule.schedule] || ''}
                    onChange={(e) => updateSchedule(day.key, e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                  />
                </motion.div>
              ))}
            </div>
          </div>

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
                  <span>{isCreating ? 'Δημιουργία Ωραρίου' : 'Αποθήκευση Ωραρίου'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

