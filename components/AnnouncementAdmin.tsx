'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Bell, Save, Plus, Trash2, X, AlertCircle, Info, CheckCircle, AlertTriangle, Megaphone, Calendar, Globe } from 'lucide-react';
import type { Announcement, AnnouncementType, AnnouncementPriority } from '@/types/announcements';

const announcementTypes: { value: AnnouncementType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'info', label: 'Πληροφορία', icon: <Info className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'warning', label: 'Προειδοποίηση', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: 'success', label: 'Επιτυχία', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'error', label: 'Σφάλμα', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-500' },
  { value: 'announcement', label: 'Ανακοίνωση', icon: <Megaphone className="w-4 h-4" />, color: 'bg-purple-500' },
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Φόρτωση...</p>
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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Ανακοινώσεις
                <span className="text-xl">📢</span>
              </h2>
              <p className="text-slate-600 text-sm">Διαχείριση ανακοινώσεων και ειδοποιήσεων</p>
            </div>
          </div>
          <button
            onClick={createNewAnnouncement}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Νέα Ανακοίνωση</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Λίστα Ανακοινώσεων</h3>
          {announcements.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Δεν υπάρχουν ανακοινώσεις</p>
            </div>
          ) : (
            announcements.map((announcement) => {
              const typeConfig = announcementTypes.find(t => t.value === announcement.type);
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAnnouncement?.id === announcement.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white/80 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setIsCreating(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${typeConfig?.color || 'bg-slate-400'} text-white`}>
                        {typeConfig?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{announcement.title.el}</h4>
                        <p className="text-xs text-slate-500">{announcement.title.en}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (announcement.id) handleDelete(announcement.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                      disabled={deleting === announcement.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        announcement.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {announcement.isActive ? 'Ενεργή' : 'Ανενεργή'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        priorities.find(p => p.value === announcement.priority)?.color || 'bg-slate-400'
                      } text-white`}
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
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {isCreating ? 'Νέα Ανακοίνωση' : 'Επεξεργασία Ανακοίνωσης'}
                </h3>
                {!isCreating && (
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(null);
                      setIsCreating(false);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                )}
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Τύπος</label>
                <div className="grid grid-cols-5 gap-2">
                  {announcementTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setSelectedAnnouncement({ ...selectedAnnouncement, type: type.value })
                      }
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedAnnouncement.type === type.value
                          ? `border-${type.color.split('-')[1]}-500 ${type.color} text-white shadow-lg`
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {type.icon}
                        <span className="text-xs font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Προτεραιότητα</label>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      onClick={() =>
                        setSelectedAnnouncement({ ...selectedAnnouncement, priority: priority.value })
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedAnnouncement.priority === priority.value
                          ? `${priority.color} text-white shadow-lg`
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Τίτλος (Ελληνικά)</label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title.el}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        title: { ...selectedAnnouncement.title, el: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ελληνικός τίτλος"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title.en}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        title: { ...selectedAnnouncement.title, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="English title"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Μήνυμα (Ελληνικά)</label>
                  <textarea
                    value={selectedAnnouncement.message.el}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        message: { ...selectedAnnouncement.message, el: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ελληνικό μήνυμα"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message (English)</label>
                  <textarea
                    value={selectedAnnouncement.message.en}
                    onChange={(e) =>
                      setSelectedAnnouncement({
                        ...selectedAnnouncement,
                        message: { ...selectedAnnouncement.message, en: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="English message"
                  />
                </div>
              </div>

              {/* Link (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Link URL (Προαιρετικό)</label>
                  <input
                    type="url"
                    value={selectedAnnouncement.linkUrl || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, linkUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Link Text</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={selectedAnnouncement.linkText?.el || ''}
                      onChange={(e) =>
                        setSelectedAnnouncement({
                          ...selectedAnnouncement,
                          linkText: { ...selectedAnnouncement.linkText || { el: '', en: '' }, el: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="EN"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ημερομηνία Έναρξης (Προαιρετικό)
                  </label>
                  <input
                    type="date"
                    value={selectedAnnouncement.startDate || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ημερομηνία Λήξης (Προαιρετικό)
                  </label>
                  <input
                    type="date"
                    value={selectedAnnouncement.endDate || ''}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Target Pages */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Σελίδες Εμφάνισης (Αφήστε κενό για όλες)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={targetPageInput}
                    onChange={(e) => setTargetPageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTargetPage()}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/, /services, /about..."
                  />
                  <button
                    onClick={addTargetPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Προσθήκη
                  </button>
                </div>
                {selectedAnnouncement.targetPages && selectedAnnouncement.targetPages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.targetPages.map((page) => (
                      <span
                        key={page}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm flex items-center gap-2"
                      >
                        {page}
                        <button
                          onClick={() => removeTargetPage(page)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAnnouncement.isActive}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Ενεργή</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAnnouncement.isDismissible}
                    onChange={(e) =>
                      setSelectedAnnouncement({ ...selectedAnnouncement, isDismissible: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Κλείσιμο από χρήστη</span>
                </label>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Αποθήκευση...' : 'Αποθήκευση'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Επιλέξτε μια ανακοίνωση για επεξεργασία</p>
              <button
                onClick={createNewAnnouncement}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Δημιουργία Νέας
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

