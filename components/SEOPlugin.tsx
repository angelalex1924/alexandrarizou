'use client';

import { useEffect } from 'react';

interface SEOPluginProps {
  pageType?: 'home' | 'services' | 'about' | 'contact' | 'gallery';
}

/**
 * SEOPlugin Component
 * 
 * IMPORTANT: This component does NOT render any visible content.
 * It exists as a placeholder for potential future SEO metadata injection.
 * 
 * If you see keywords appearing on the page, there's a bug elsewhere in the codebase.
 * 
 * The keywords are handled via:
 * - Structured data in app/layout.tsx (JSON-LD scripts)
 * - Metadata in Next.js metadata API
 * - NOT through this component
 */
export default function SEOPlugin({ pageType = 'home' }: SEOPluginProps) {
  // CRITICAL: This component must NEVER render any content
  // It's a no-op component that exists only for potential future use
  
  useEffect(() => {
    // Safety check: if keywords somehow appear in DOM, remove them immediately
    if (typeof window !== 'undefined') {
      const removeKeywordDumps = () => {
        // Find and remove any divs with sr-only that contain keyword dumps
        const allDivs = document.querySelectorAll('div.sr-only, div[aria-hidden="true"]');
        allDivs.forEach((div) => {
          const text = div.textContent || '';
          // Check if this div contains a large keyword dump
          const keywordPattern = /(γυναικείο κούρεμα|alexandrarizoucoiffure\.gr|βαφή μαλλιών|ombre hair).{0,50}(γυναικείο κούρεμα|alexandrarizoucoiffure\.gr|βαφή μαλλιών|ombre hair)/;
          
          if (keywordPattern.test(text)) {
            const keywordCount = (text.match(/γυναικείο κούρεμα|alexandrarizoucoiffure\.gr|βαφή μαλλιών|ombre hair/g) || []).length;
            if (keywordCount > 10) {
              console.warn('⚠️ SEOPlugin: Removing visible keyword dump from DOM');
              div.remove();
            }
          }
        });
      };

      // Run immediately
      removeKeywordDumps();

      // Also check periodically
      const checkInterval = setInterval(() => {
        removeKeywordDumps();
      }, 2000); // Check every 2 seconds
      
      return () => clearInterval(checkInterval);
    }
  }, []);

  // ALWAYS return null - this component should never render anything
  return null;
}
