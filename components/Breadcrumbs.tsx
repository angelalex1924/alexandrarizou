'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/lib/i18n-routes';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// SVG Icons Components - Same as Navigation
const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ServicesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path d="M26 14c0 6.627-5.373 12-12 12S2 20.627 2 14S7.373 2 14 2s12 5.373 12 12Z" opacity=".2"/>
      <path fillRule="evenodd" d="M8.5 11.5a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm0 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" clipRule="evenodd"/>
      <path d="M19.978 18.782a.5.5 0 0 1-.697.718l-8.876-8.627a.5.5 0 1 1 .697-.717l8.876 8.626Z"/>
      <path d="M10.146 16.146a.5.5 0 0 0 .708.708l9-9a.5.5 0 0 0-.708-.708l-9 9Z"/>
      <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" clipRule="evenodd"/>
    </g>
  </svg>
);

const GalleryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path d="M18 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
      <path fillRule="evenodd" d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.088c0 1.909 0 3.471-.104 4.743c-.104 1.28-.317 2.347-.795 3.235c-.21.391-.47.742-.785 1.057c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.793-.793-1.203-1.78-1.42-3.006c-.215-1.203-.254-2.7-.262-4.558c-.002-.473-.002-.973-.002-1.501v-.058c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19Zm-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386c0 .529 0 1.026.002 1.495c.008 1.874.05 3.246.238 4.303c.184 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.21-.21.381-.442.524-.707c.332-.616.523-1.44.621-2.645c.098-1.205.099-2.707.099-4.653c0-2.378-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176Z" clipRule="evenodd"/>
      <path d="m20.607 19.146l-2.83-2.547a3 3 0 0 0-3.732-.225l-.299.21a2 2 0 0 1-2.564-.222l-4.29-4.29a2.3 2.3 0 0 0-3.14-.104l-1.002.876l.002.65c.008 1.875.05 3.247.238 4.304c.185 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.087-.002 5.387-.176c1.278-.172 2.049-.5 2.618-1.069a2.995 2.995 0 0 0 .602-.859Z" opacity=".4"/>
    </g>
  </svg>
);

const AboutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path fillRule="evenodd" d="M13.5 26C20.404 26 26 20.404 26 13.5S20.404 1 13.5 1S1 6.596 1 13.5S6.596 26 13.5 26Zm0-2C19.299 24 24 19.299 24 13.5S19.299 3 13.5 3S3 7.701 3 13.5S7.701 24 13.5 24Z" clipRule="evenodd" opacity=".2"/>
      <g opacity=".2">
        <path d="M15.739 20.213a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
        <path fillRule="evenodd" d="M13.71 8.765c-.67 0-1.245.2-1.65.486c-.39.276-.583.597-.639.874a1.45 1.45 0 0 1-2.842-.574c.227-1.126.925-2.045 1.809-2.67c.92-.65 2.086-1.016 3.322-1.016c2.557 0 5.208 1.71 5.208 4.456c0 1.59-.945 2.876-2.169 3.626a1.45 1.45 0 1 1-1.514-2.474c.57-.349.783-.794.783-1.152c0-.574-.715-1.556-2.308-1.556Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M13.71 12.63c.8 0 1.45.648 1.45 1.45v1.502a1.45 1.45 0 1 1-2.9 0V14.08c0-.8.649-1.45 1.45-1.45Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M17.239 11.966a1.45 1.45 0 0 1-.5 1.99l-2.284 1.367a1.45 1.45 0 0 1-1.49-2.488l2.285-1.368a1.45 1.45 0 0 1 1.989.5Z" clipRule="evenodd"/>
      </g>
      <path d="M14 19.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0Z"/>
      <path fillRule="evenodd" d="M12.71 7.065c-.807 0-1.524.24-2.053.614c-.51.36-.825.826-.922 1.308a.75.75 0 1 1-1.47-.297c.186-.922.762-1.696 1.526-2.236c.796-.562 1.82-.89 2.919-.89c2.325 0 4.508 1.535 4.508 3.757c0 1.292-.768 2.376-1.834 3.029a.75.75 0 0 1-.784-1.28c.729-.446 1.118-1.093 1.118-1.749c0-1.099-1.182-2.256-3.008-2.256Zm0 5.265a.75.75 0 0 1 .75.75v1.502a.75.75 0 1 1-1.5 0V13.08a.75.75 0 0 1 .75-.75Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M15.638 11.326a.75.75 0 0 1-.258 1.029l-2.285 1.368a.75.75 0 1 1-.77-1.287l2.285-1.368a.75.75 0 0 1 1.028.258Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" clipRule="evenodd"/>
    </g>
  </svg>
);

const ContactIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M7.5 12.5h1m2.5 0h1m2.5 0h1m-8 3h1m2.5 0h1m2.5 0h1m-8 3h1m2.5 0h1m2.5 0h1m4-6v8.387l-8 1.613l-8-1.613V12.5m10-6l2 3H19L22.5 6L19 2.5H4L.5 6L4 9.5h3.5l2-3z"/>
  </svg>
);

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const currentLang = language || 'el';

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { 
        label: t('nav.home') || 'Αρχική', 
        href: getLocalizedPath('/', currentLang as 'el' | 'en'),
        icon: HomeIcon
      }
    ];

    // Map paths to breadcrumb labels and icons
    const pathMap: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
      '/services': { label: t('nav.services') || 'Υπηρεσίες', icon: ServicesIcon },
      '/ypiresies': { label: t('nav.services') || 'Υπηρεσίες', icon: ServicesIcon },
      '/gallery': { label: t('nav.gallery') || 'Γκαλερί', icon: GalleryIcon },
      '/galeri': { label: t('nav.gallery') || 'Γκαλερί', icon: GalleryIcon },
      '/about': { label: t('nav.about') || 'Σχετικά', icon: AboutIcon },
      '/sxetika': { label: t('nav.about') || 'Σχετικά', icon: AboutIcon },
      '/contact': { label: t('nav.contact') || 'Επικοινωνία', icon: ContactIcon },
      '/epikoinonia': { label: t('nav.contact') || 'Επικοινωνία', icon: ContactIcon },
      '/privacy': { label: t('nav.privacy') || 'Απορρήτου', icon: AboutIcon },
      '/apokrypsia': { label: t('nav.privacy') || 'Απορρήτου', icon: AboutIcon },
      '/terms': { label: t('nav.terms') || 'Όροι', icon: AboutIcon },
      '/oroi': { label: t('nav.terms') || 'Όροι', icon: AboutIcon },
    };

    // Get base path (remove /en prefix if exists)
    const basePath = pathname.startsWith('/en') ? pathname.replace('/en', '') : pathname;
    
    if (basePath !== '/' && pathMap[basePath]) {
      items.push({
        label: pathMap[basePath].label,
        href: getLocalizedPath(basePath, currentLang as 'el' | 'en'),
        icon: pathMap[basePath].icon
      });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="relative w-full pt-28 md:pt-36 pb-6"
    >
      <div className="container-custom max-w-7xl mx-auto px-4 md:px-8">
        <ol className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    className={cn(
                      "w-3.5 h-3.5 md:w-4 md:h-4 mx-1.5 md:mx-2",
                      "text-primary/40 dark:text-primary/50",
                      "transition-colors duration-200"
                    )} 
                  />
                )}
                {isLast ? (
                  <span 
                    className={cn(
                      "inline-flex items-center gap-1.5 md:gap-2",
                      "px-3 md:px-4 py-1.5 md:py-2",
                      "rounded-lg md:rounded-xl",
                      "bg-primary/10 dark:bg-primary/15",
                      "backdrop-blur-sm",
                      "border border-primary/20 dark:border-primary/25",
                      "shadow-sm",
                      "font-medium text-sm md:text-base",
                      "text-primary dark:text-primary/90",
                      "font-junicode",
                      "tracking-wide"
                    )}
                    aria-current="page"
                  >
                    {item.icon && (
                      <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    )}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 md:gap-2",
                      "px-3 md:px-4 py-1.5 md:py-2",
                      "rounded-lg md:rounded-xl",
                      "bg-muted/50 dark:bg-muted/30",
                      "backdrop-blur-sm",
                      "border border-border/50 dark:border-border/40",
                      "shadow-sm hover:shadow-md",
                      "text-sm md:text-base",
                      "text-muted-foreground/80 dark:text-muted-foreground/70",
                      "hover:text-primary dark:hover:text-primary/90",
                      "hover:bg-primary/5 dark:hover:bg-primary/10",
                      "hover:border-primary/30 dark:hover:border-primary/40",
                      "transition-all duration-300 ease-out",
                      "font-medium tracking-wide",
                      "font-junicode"
                    )}
                  >
                    {item.icon && (
                      <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    )}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

