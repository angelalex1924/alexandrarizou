'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Check, CheckCircle, Clock, Plus, Save, Sparkles, Snowflake, Star, Trash2, X } from 'lucide-react';
import { ClosureNotice, HolidaySchedule } from '@/hooks/useChristmasSchedule';

// Helper function to format date beautifully
const formatDateBeautiful = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('el-GR', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const normalizeClosureNotices = (items?: ClosureNotice[]) =>
  (items ?? []).map((item, index) => ({
    id: item?.id || `closure-${index}-${item?.from ?? ''}-${item?.to ?? ''}`,
    title: item?.title ?? '',
    from: item?.from ?? '',
    to: item?.to ?? '',
  }));

const createClosureNotice = (): ClosureNotice => ({
  id: `closure-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  from: '',
  to: '',
});

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
    { value: 'summer', label: '🏖️ Θερινό', icon: '🏖️' },
    { value: 'other', label: '📅 Άλλο', icon: '📅' }
  ];

  // Holiday theme helper
  const getHolidayTheme = (type: string) => {
    const themes: Record<string, { gradient: string; icon: string; description: string }> = {
      christmas: {
        gradient: 'from-[#7B1E28] via-[#351C29] to-[#0F4E45]',
        icon: '🎄',
        description: 'Ατμόσφαιρα champagne με navy & χρυσές λάμψεις.'
      },
      newyear: {
        gradient: 'from-[#0F172A] via-[#1F2937] to-[#C084FC]',
        icon: '🎆',
        description: 'Γιορτάστε τη νέα χρονιά μαζί μας!'
      },
      easter: {
        gradient: 'from-[#F9A8D4] via-[#FDF2F8] to-[#6EE7B7]',
        icon: '🐰',
        description: 'Χρόνια πολλά με ανοιξιάτικα χρώματα!'
      },
      summer: {
        gradient: 'from-[#0EA5E9] via-[#06B6D4] to-[#14B8A6]',
        icon: '🏖️',
        description: 'Καλοκαιρινές διακοπές και ειδικό πρόγραμμα'
      },
      other: {
        gradient: 'from-[#581C87] via-[#312E81] to-[#9D174D]',
        icon: '📅',
        description: 'Ειδικό ωράριο λειτουργίας'
      }
    };
    return themes[type] || themes.christmas;
  };

  const selectedTheme = selectedSchedule ? getHolidayTheme(selectedSchedule.type) : getHolidayTheme('christmas');

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

      const normalizedSchedules = loadedSchedules.map((schedule) => ({
        ...schedule,
        closureNotices: normalizeClosureNotices(schedule.closureNotices),
      }));

      setSchedules(normalizedSchedules);
      
      // Select the active schedule if exists
      const activeSchedule = normalizedSchedules.find(s => s.isActive);
      if (activeSchedule) {
        setSelectedSchedule({
          ...activeSchedule,
          showAnnouncement: activeSchedule.showAnnouncement ?? false,
          closureNotices: normalizeClosureNotices(activeSchedule.closureNotices),
        });
      } else if (normalizedSchedules.length > 0) {
        const firstSchedule = normalizedSchedules[0];
        setSelectedSchedule({
          ...firstSchedule,
          showAnnouncement: firstSchedule.showAnnouncement ?? false,
          closureNotices: normalizeClosureNotices(firstSchedule.closureNotices),
        });
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
      type: 'christmas' as 'christmas' | 'newyear' | 'easter' | 'other' | 'summer',
      isActive: false,
      showAnnouncement: false,
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
      },
      closureNotices: []
    };
    setSelectedSchedule(newSchedule);
    setIsCreating(true);
  };

  const addClosureNotice = () => {
    if (!selectedSchedule) return;
    const nextNotice = createClosureNotice();
    setSelectedSchedule({
      ...selectedSchedule,
      closureNotices: [...(selectedSchedule.closureNotices ?? []), nextNotice],
    });
  };

  const updateClosureNotice = (noticeId: string, field: keyof ClosureNotice, value: string) => {
    if (!selectedSchedule) return;
    setSelectedSchedule({
      ...selectedSchedule,
      closureNotices: (selectedSchedule.closureNotices ?? []).map((notice) =>
        notice.id === noticeId ? { ...notice, [field]: value } : notice
      ),
    });
  };

  const removeClosureNotice = (noticeId: string) => {
    if (!selectedSchedule) return;
    setSelectedSchedule({
      ...selectedSchedule,
      closureNotices: (selectedSchedule.closureNotices ?? []).filter((notice) => notice.id !== noticeId),
    });
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
        closureNotices: normalizeClosureNotices(selectedSchedule.closureNotices),
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
        const newSchedule = {
          ...selectedSchedule,
          id: docRef.id,
          showAnnouncement: selectedSchedule.showAnnouncement ?? false,
          closureNotices: normalizeClosureNotices(scheduleToSave.closureNotices),
        };
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
      <div className="rounded-2xl border-2 border-slate-200/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
        </div>
          <p className="text-slate-700 font-medium text-lg">Φόρτωση ωραρίων...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-200/60 bg-white/95 backdrop-blur-xl p-4 sm:p-5 md:p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500 to-green-500 rounded-xl shadow-lg">
              <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-0.5 w-6 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">Holiday Hours</p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">Ειδικά Ωράρια</h2>
              <p className="text-xs sm:text-sm text-slate-600">Διαχείριση χριστουγεννιάτικων και πρωτοχρονιάτικων ωραρίων</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {schedules.some(s => s.isActive) && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeactivateAll}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <X className="w-4 w-4 sm:h-5 sm:w-5" />
                <span>Απενεργοποίηση</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewSchedule}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 sm:h-5 sm:w-5" />
              <span>Νέο Ωράριο</span>
            </motion.button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 sm:p-4 rounded-xl border-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-md'
                : 'bg-rose-50 text-rose-800 border-rose-200 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          </motion.div>
        )}

        {/* Schedules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {schedules.map((schedule) => (
            <motion.div
              key={schedule.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                schedule.isActive
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-lg'
                  : 'border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 hover:border-slate-400 hover:shadow-lg'
              } ${selectedSchedule?.id === schedule.id ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl' : ''}`}
              onClick={() => {
                setSelectedSchedule({
                  ...schedule,
                  showAnnouncement: schedule.showAnnouncement ?? false,
                  closureNotices: normalizeClosureNotices(schedule.closureNotices),
                });
                setIsCreating(false);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl">
                      {schedule.type === 'christmas' && '🎄'}
                      {schedule.type === 'newyear' && '🎆'}
                      {schedule.type === 'easter' && '🐰'}
                      {schedule.type === 'summer' && '🏖️'}
                      {schedule.type === 'other' && '📅'}
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900">{schedule.name || 'Χωρίς όνομα'}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                    {scheduleTypes.find(t => t.value === schedule.type)?.label}
                  </p>
                </div>
                {schedule.isActive && (
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <Star className="w-4 w-4 sm:h-5 sm:w-5 text-emerald-600 fill-emerald-600" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetActive(schedule.id!);
                  }}
                  className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${
                    schedule.isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200'
                  }`}
                >
                  {schedule.isActive ? 'Ενεργό' : 'Ενεργοποίηση'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(schedule.id!);
                  }}
                  disabled={deleting === schedule.id}
                  className="rounded-lg bg-rose-50 hover:bg-rose-100 p-2 sm:p-2.5 text-rose-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {deleting === schedule.id ? (
                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Schedule Editor */}
      {selectedSchedule && (
        <div className="rounded-2xl border-2 border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Beautiful Header with Gradient and Tabs */}
          <div className={`bg-gradient-to-r ${selectedTheme.gradient} p-4 sm:p-5 md:p-6 text-white`}>
            <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] opacity-80 mb-2">now editing</p>
                <div className="mt-1 flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-black">
                  <span className="text-3xl sm:text-4xl">{selectedTheme.icon}</span>
                  <span>{scheduleTypes.find(t => t.value === selectedSchedule.type)?.label.replace(/^[^\s]+\s/, '') || 'Χριστούγεννα'}</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80 mt-2">{selectedTheme.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {scheduleTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSchedule((prev) => prev ? { ...prev, type: type.value as 'christmas' | 'newyear' | 'easter' | 'other' | 'summer' } : prev)}
                    className={`rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      selectedSchedule.type === type.value 
                        ? 'bg-white/90 text-slate-900 shadow-lg' 
                        : 'bg-white/20 text-white/80 hover:bg-white/40'
                    }`}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 space-y-6">

          {/* Schedule Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">
                Όνομα Ωραρίου *
              </label>
              <input
                type="text"
                value={selectedSchedule.name}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, name: e.target.value })}
                placeholder="π.χ. Χριστουγεννιάτικο Ωράριο 2024"
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base font-semibold text-slate-900"
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-slate-200/60 bg-slate-50/50 p-4">
                <label className="mb-2 block text-sm sm:text-base font-bold text-slate-900">Κατάσταση</label>
                <label className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSchedule.isActive}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, isActive: e.target.checked })}
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                  Ενεργό στο site
                </label>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">Αν ενεργοποιήσεις αυτό το ωράριο, όλα τα υπόλοιπα θα απενεργοποιηθούν.</p>
              </div>
              <div className="rounded-xl border-2 border-slate-200/60 bg-slate-50/50 p-4">
                <label className="mb-2 block text-sm sm:text-base font-bold text-slate-900">Announcement</label>
                <label className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSchedule.showAnnouncement ?? false}
                    onChange={(e) => setSelectedSchedule({ ...selectedSchedule, showAnnouncement: e.target.checked })}
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  Εμφάνιση Floating Announcement
                </label>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">Εμφάνιση floating announcement banner στην κορυφή της σελίδας.</p>
              </div>
            </div>
          </div>


          {/* Closure Notices */}
          <div className="mb-6 rounded-xl border-2 border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-800">Επιπλέον κλειστές περίοδοι</p>
                <p className="text-sm text-slate-500">
                  Ορίστε τις ημερομηνίες που θα παραμείνει κλειστό το σαλόνι (π.χ. θερινές διακοπές).
                </p>
              </div>
              <button
                type="button"
                onClick={addClosureNotice}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <Plus className="h-4 w-4" />
                Προσθήκη περιόδου
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(selectedSchedule.closureNotices ?? []).length === 0 && (
                <p className="text-sm text-slate-500">Δεν έχουν οριστεί περίοδοι κλεισίματος.</p>
              )}
              {(selectedSchedule.closureNotices ?? []).map((notice) => (
                <div key={notice.id} className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={notice.title}
                      onChange={(e) => updateClosureNotice(notice.id, 'title', e.target.value)}
                      placeholder="Τίτλος (π.χ. Θερινές Διακοπές)"
                      className="flex-1 rounded-lg border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:border-red-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeClosureNotice(notice.id)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:-translate-y-0.5 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Από</label>
                      <input
                        type="date"
                        value={notice.from}
                        onChange={(e) => updateClosureNotice(notice.id, 'from', e.target.value)}
                        className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 focus:border-red-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Έως</label>
                      <input
                        type="date"
                        value={notice.to}
                        onChange={(e) => updateClosureNotice(notice.id, 'to', e.target.value)}
                        className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 focus:border-red-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        </div>
      )}
    </div>
  );
}

