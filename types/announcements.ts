export type AnnouncementType = 'info' | 'warning' | 'success' | 'error' | 'announcement' | 'offer';

export type AnnouncementPriority = 'low' | 'medium' | 'high';

export interface Announcement {
  id?: string;
  title: {
    el: string;
    en: string;
  };
  message: {
    el: string;
    en: string;
  };
  type: AnnouncementType;
  priority: AnnouncementPriority;
  isActive: boolean;
  isDismissible: boolean;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  targetPages?: string[]; // Array of route paths (e.g., ['/', '/services'])
  linkUrl?: string; // Optional link URL
  linkText?: {
    el: string;
    en: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

