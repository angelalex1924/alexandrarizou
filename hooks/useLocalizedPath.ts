import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/lib/i18n-routes';

/**
 * Hook to get localized paths based on current language
 */
export function useLocalizedPath() {
  const { language } = useLanguage();
  
  return (path: string) => getLocalizedPath(path, language as 'el' | 'en');
}

