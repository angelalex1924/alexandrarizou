'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Bell, Save, Plus, Trash2, X, AlertCircle, Info, CheckCircle, AlertTriangle, Megaphone, Calendar, Globe } from 'lucide-react';
import type { Announcement, AnnouncementType, AnnouncementPriority } from '@/types/announcements';

// Offer Icon Component for Alexandra Rizou
const OfferIconAlexandra = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path fillRule="evenodd" d="M10.594 2.319a3.261 3.261 0 0 1 2.812 0c.387.185.74.487 1.231.905l.078.066c.238.203.313.265.389.316c.193.13.41.219.637.264c.09.018.187.027.499.051l.101.008c.642.051 1.106.088 1.51.23a3.27 3.27 0 0 1 1.99 1.99c.142.404.178.868.23 1.51l.008.101c.024.312.033.41.051.499c.045.228.135.445.264.638c.051.075.113.15.316.388l.066.078c.419.49.72.844.905 1.23c.425.89.425 1.924 0 2.813c-.184.387-.486.74-.905 1.231l-.066.078a4.758 4.758 0 0 0-.316.389c-.13.193-.219.41-.264.637c-.018.09-.026.187-.051.499l-.009.101c-.05.642-.087 1.106-.23 1.51a3.26 3.26 0 0 1-1.989 1.99c-.404.142-.868.178-1.51.23l-.101.008a4.757 4.757 0 0 0-.499.051a1.755 1.755 0 0 0-.637.264a4.83 4.83 0 0 0-.39.316l-.077.066c-.49.419-.844.72-1.23.905a3.261 3.261 0 0 1-2.813 0c-.387-.184-.74-.486-1.231-.905a95.175 95.175 0 0 0-.078-.066a4.779 4.779 0 0 0-.388-.316a1.746 1.746 0 0 0-.638-.264a4.759 4.759 0 0 0-.499-.051l-.101-.009c-.642-.05-1.106-.087-1.51-.23a3.261 3.261 0 0 1-1.99-1.989c-.142-.404-.179-.868-.23-1.51l-.008-.101a4.76 4.76 0 0 0-.051-.499a1.756 1.756 0 0 0-.264-.637a4.74 4.74 0 0 0-.316-.39l-.066-.077c-.418-.49-.72-.844-.905-1.23a3.261 3.261 0 0 1 0-2.813c.185-.387.487-.74.905-1.231l.066-.078a4.76 4.76 0 0 0 .316-.388c.13-.193.219-.41.264-.638c.018-.09.027-.187.051-.499l.008-.101c.051-.642.088-1.106.23-1.51a3.261 3.261 0 0 1 1.99-1.99c.404-.142.868-.179 1.51-.23l.101-.008a4.47 4.47 0 0 0 .499-.051c.228-.045.445-.135.638-.264c.075-.051.15-.113.388-.316l.078-.066c.49-.418.844-.72 1.23-.905Zm2.163 1.358a1.756 1.756 0 0 0-1.514 0c-.185.088-.38.247-.981.758l-.03.025c-.197.168-.34.291-.497.396c-.359.24-.761.407-1.185.49c-.185.037-.373.052-.632.073l-.038.003c-.787.063-1.036.089-1.23.157c-.5.177-.894.57-1.07 1.071c-.07.194-.095.443-.158 1.23l-.003.038c-.02.259-.036.447-.072.632c-.084.424-.25.826-.49 1.185c-.106.157-.229.3-.397.498l-.025.029c-.511.6-.67.796-.758.98a1.756 1.756 0 0 0 0 1.515c.088.185.247.38.758.981l.025.03c.168.197.291.34.396.497c.24.359.407.761.49 1.184c.037.186.052.374.073.633l.003.038c.063.787.089 1.036.157 1.23c.177.5.57.894 1.071 1.07c.194.07.443.095 1.23.158l.038.003c.259.02.447.036.632.072c.424.084.826.25 1.185.49c.157.106.3.229.498.397l.029.025c.6.511.796.67.98.758a1.756 1.756 0 0 0 1.515 0c.185-.088.38-.247.981-.758l.03-.025c.197-.168.34-.291.497-.396a3.26 3.26 0 0 1 1.184-.49a5.53 5.53 0 0 1 .633-.073l.038-.003c.787-.063 1.036-.089 1.23-.157c.5-.177.894-.57 1.07-1.071c.07-.194.095-.444.158-1.23l.003-.038a5.53 5.53 0 0 1 .072-.633c.084-.423.25-.825.49-1.184c.106-.157.229-.3.397-.498l.025-.029c.511-.6.67-.796.758-.98a1.756 1.756 0 0 0 0-1.515c-.088-.185-.247-.38-.758-.981l-.025-.03c-.168-.197-.291-.34-.396-.497a3.262 3.262 0 0 1-.49-1.185a5.531 5.531 0 0 1-.073-.632l-.003-.038c-.063-.787-.089-1.036-.157-1.23c-.177-.5-.57-.894-1.071-1.07c-.194-.07-.444-.095-1.23-.158l-.038-.003a5.568 5.568 0 0 1-.633-.072a3.262 3.262 0 0 1-1.184-.49c-.157-.106-.3-.229-.498-.397l-.029-.025c-.6-.511-.796-.67-.98-.758Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M15.543 8.457a.753.753 0 0 1 0 1.065l-6.021 6.02a.753.753 0 0 1-1.065-1.064l6.021-6.02a.753.753 0 0 1 1.065 0Z" clipRule="evenodd"/>
      <path d="M15.512 14.509a1.004 1.004 0 1 1-2.007 0a1.004 1.004 0 0 1 2.007 0Zm-5.017-5.018a1.004 1.004 0 1 1-2.007 0a1.004 1.004 0 0 1 2.007 0Z"/>
    </g>
  </svg>
);

const announcementTypes: { value: AnnouncementType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'info', label: 'Πληροφορία', icon: <Info className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'warning', label: 'Προειδοποίηση', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: 'success', label: 'Επιτυχία', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'error', label: 'Σφάλμα', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-500' },
  { value: 'announcement', label: 'Ανακοίνωση', icon: <Megaphone className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: 'offer', label: 'Προσφορά', icon: <OfferIconAlexandra className="w-5 h-5" />, color: 'bg-amber-500' },
];

const priorities: { value: AnnouncementPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Χαμηλή', color: 'bg-slate-400' },
  { value: 'medium', label: 'Μέτρια', color: 'bg-blue-500' },
  { value: 'high', label: 'Υψηλή', color: 'bg-red-500' },
];

const createBlankAnnouncement = (): Announcement => ({
  title: { el: '', en: '' },
  message: { el: '', en: '' },
  type: 'info',
  priority: 'medium',
  isActive: false,
  isDismissible: true,
  startDate: '',
  endDate: '',
  targetPages: [],
  linkUrl: '',
  linkText: { el: '', en: '' },
});

export default function AnnouncementAdmin() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [targetPageInput, setTargetPageInput] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const announcementsRef = collection(db, 'announcements');
      const q = query(announcementsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const loadedAnnouncements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Announcement[];

      setAnnouncements(loadedAnnouncements);
      
      if (loadedAnnouncements.length > 0 && !selectedAnnouncement) {
        setSelectedAnnouncement(loadedAnnouncements[0]);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setMessage({ type: 'error', text: 'Σφάλμα φόρτωσης ανακοινώσεων' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (nextMessage: typeof message) => {
    setMessage(nextMessage);
    setTimeout(() => setMessage(null), 3000);
  };

  const createNewAnnouncement = () => {
    setSelectedAnnouncement(createBlankAnnouncement());
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!selectedAnnouncement) return;

    if (!selectedAnnouncement.title.el || !selectedAnnouncement.title.en) {
      showMessage({ type: 'error', text: 'Παρακαλώ συμπληρώστε τον τίτλο' });
      return;
    }

    if (!selectedAnnouncement.message.el || !selectedAnnouncement.message.en) {
      showMessage({ type: 'error', text: 'Παρακαλώ συμπληρώστε το μήνυμα' });
      return;
    }

    try {
      setSaving(true);
      const announcementData = {
        ...selectedAnnouncement,
        updatedAt: serverTimestamp(),
      };

      if (isCreating) {
        await addDoc(collection(db, 'announcements'), {
          ...announcementData,
          createdAt: serverTimestamp(),
        });
        showMessage({ type: 'success', text: 'Η ανακοίνωση δημιουργήθηκε επιτυχώς!' });
      } else {
        if (!selectedAnnouncement.id) return;
        await updateDoc(doc(db, 'announcements', selectedAnnouncement.id), announcementData);
        showMessage({ type: 'success', text: 'Η ανακοίνωση ενημερώθηκε επιτυχώς!' });
      }

      setIsCreating(false);
      await loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      showMessage({ type: 'error', text: 'Σφάλμα αποθήκευσης ανακοίνωσης' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ανακοίνωση;')) return;

    try {
      setDeleting(id);
      await deleteDoc(doc(db, 'announcements', id));
      showMessage({ type: 'success', text: 'Η ανακοίνωση διαγράφηκε επιτυχώς!' });
      
      if (selectedAnnouncement?.id === id) {
        setSelectedAnnouncement(null);
        setIsCreating(false);
      }
      
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showMessage({ type: 'error', text: 'Σφάλμα διαγραφής ανακοίνωσης' });
    } finally {
      setDeleting(null);
    }
  };

  const addTargetPage = () => {
    if (!targetPageInput.trim() || !selectedAnnouncement) return;
    const pages = selectedAnnouncement.targetPages || [];
    if (!pages.includes(targetPageInput.trim())) {
      setSelectedAnnouncement({
        ...selectedAnnouncement,
        targetPages: [...pages, targetPageInput.trim()],
      });
    }
    setTargetPageInput('');
  };

  const removeTargetPage = (page: string) => {
    if (!selectedAnnouncement) return;
    setSelectedAnnouncement({
      ...selectedAnnouncement,
      targetPages: (selectedAnnouncement.targetPages || []).filter(p => p !== page),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
          </div>
          <p className="text-slate-700 font-medium text-lg">Φόρτωση...</p>
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
            <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-0.5 w-6 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">Announcements</p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">Ανακοινώσεις</h2>
              <p className="text-xs sm:text-sm text-slate-600">Διαχείριση ανακοινώσεων και ειδοποιήσεων</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewAnnouncement}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Νέα Ανακοίνωση</span>
          </motion.button>
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
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-600" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Announcements List */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <div className="h-0.5 w-6 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Λίστα Ανακοινώσεων</h3>
          </div>
          {announcements.length === 0 ? (
            <div className="rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 text-center shadow-md">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Δεν υπάρχουν ανακοινώσεις</p>
            </div>
          ) : (
            announcements.map((announcement) => {
              const typeConfig = announcementTypes.find(t => t.value === announcement.type);
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedAnnouncement?.id === announcement.id
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-xl ring-2 ring-blue-500 ring-offset-2'
                      : 'border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 hover:border-blue-400 hover:shadow-lg'
                  }`}
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setIsCreating(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${typeConfig?.color || 'bg-slate-400'} text-white shadow-md flex-shrink-0`}>
                        {typeConfig?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1 truncate">{announcement.title.el}</h4>
                        <p className="text-xs text-slate-500 truncate">{announcement.title.en}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (announcement.id) handleDelete(announcement.id);
                      }}
                      className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={deleting === announcement.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 ${
                        announcement.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {announcement.isActive ? 'Ενεργή' : 'Ανενεργή'}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${
                        priorities.find(p => p.value === announcement.priority)?.color || 'bg-slate-400'
                      } shadow-sm`}
                    >
                      {priorities.find(p => p.value === announcement.priority)?.label}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          {selectedAnnouncement ? (
            <div className="rounded-2xl border-2 border-slate-200/60 bg-white/95 backdrop-blur-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl space-y-6 sm:space-y-7 md:space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-0.5 w-6 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                  {isCreating ? 'Νέα Ανακοίνωση' : 'Επεξεργασία Ανακοίνωσης'}
                </h3>
                </div>
                {!isCreating && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedAnnouncement(null);
                      setIsCreating(false);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </motion.button>
                )}
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4">Τύπος</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {announcementTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setSelectedAnnouncement({ ...selectedAnnouncement, type: type.value })
                      }
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedAnnouncement.type === type.value
                          ? `${type.color} text-white border-transparent shadow-lg ring-2 ring-offset-2 ring-slate-300`
                          : 'border-slate-200/60 bg-white hover:border-slate-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                        <div className={selectedAnnouncement.type === type.value ? 'scale-110' : ''}>
                        {type.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-bold">{type.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4">Προτεραιότητα</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {priorities.map((priority) => (
                    <motion.button
                      key={priority.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setSelectedAnnouncement({ ...selectedAnnouncement, priority: priority.value })
                      }
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 ${
                        selectedAnnouncement.priority === priority.value
                          ? `${priority.color} text-white shadow-lg ring-2 ring-offset-2 ring-slate-300`
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                      }`}
                    >
                      {priority.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Τίτλος (Ελληνικά)</label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title.el}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        title: { ...selectedAnnouncement.title, el: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="Ελληνικός τίτλος"
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Title (English)</label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title.en}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        title: { ...selectedAnnouncement.title, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="English title"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Μήνυμα (Ελληνικά)</label>
                  <textarea
                    value={selectedAnnouncement.message.el}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        message: { ...selectedAnnouncement.message, el: e.target.value },
                      })
                    }
                    rows={5}
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base resize-none"
                    placeholder="Ελληνικό μήνυμα"
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Message (English)</label>
                  <textarea
                    value={selectedAnnouncement.message.en}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        message: { ...selectedAnnouncement.message, en: e.target.value },
                      })
                    }
                    rows={5}
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base resize-none"
                    placeholder="English message"
                  />
                </div>
              </div>

              {/* Link (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Link URL (Προαιρετικό)</label>
                  <input
                    type="url"
                    value={selectedAnnouncement.linkUrl || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, linkUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Link Text</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={selectedAnnouncement.linkText?.el || ''}
                      onChange={(e) =>
                        setSelectedAnnouncement({
                          ...selectedAnnouncement,
                          linkText: { ...selectedAnnouncement.linkText || { el: '', en: '' }, el: e.target.value },
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="EL"
                    />
                    <input
                      type="text"
                      value={selectedAnnouncement.linkText?.en || ''}
                      onChange={(e) =>
                        setSelectedAnnouncement({
                          ...selectedAnnouncement,
                          linkText: { ...selectedAnnouncement.linkText || { el: '', en: '' }, en: e.target.value },
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="EN"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Ημερομηνία Έναρξης (Προαιρετικό)
                  </label>
                  <input
                    type="date"
                    value={selectedAnnouncement.startDate || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Ημερομηνία Λήξης (Προαιρετικό)
                  </label>
                  <input
                    type="date"
                    value={selectedAnnouncement.endDate || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Target Pages */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Σελίδες Εμφάνισης (Αφήστε κενό για όλες)
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
                  <input
                    type="text"
                    value={targetPageInput}
                    onChange={(e) => setTargetPageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTargetPage()}
                    className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="/, /services, /about..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addTargetPage}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-bold text-sm sm:text-base shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Προσθήκη
                  </motion.button>
                </div>
                {selectedAnnouncement.targetPages && selectedAnnouncement.targetPages.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {selectedAnnouncement.targetPages.map((page) => (
                      <motion.span
                        key={page}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200/60 text-blue-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
                      >
                        {page}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeTargetPage(page)}
                          className="hover:text-red-600 transition-colors focus:outline-none"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAnnouncement.isActive}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, isActive: e.target.checked })
                    }
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rounded border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Ενεργή</span>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAnnouncement.isDismissible}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, isDismissible: e.target.checked })
                    }
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rounded border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Κλείσιμο από χρήστη</span>
                </label>
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-slate-200/60">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Αποθήκευση...</span>
                    </>
                  ) : (
                    <>
                  <Save className="w-5 h-5" />
                      <span>Αποθήκευση</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12 text-center shadow-md">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Bell className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-700 mb-6 font-bold text-base sm:text-lg">Επιλέξτε μια ανακοίνωση για επεξεργασία</p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewAnnouncement}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Δημιουργία Νέας
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

