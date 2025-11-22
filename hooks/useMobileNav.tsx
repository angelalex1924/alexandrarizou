import { useState, useEffect, useRef } from "react";

/**
 * Hook για τη διαχείριση του mobile navigation menu
 * Εξασφαλίζει ότι το menu είναι πλήρως ανεξάρτητο από το περιεχόμενο της σελίδας
 */
export const useMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const scrollPositionRef = useRef(0);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Αποθήκευση και αποκλεισμός scroll όταν ανοίγει το menu - Optimized to prevent flickering
  useEffect(() => {
    if (isOpen) {
      // Αποθήκευση της τρέχουσας θέσης scroll
      scrollPositionRef.current = 
        window.scrollY || 
        window.pageYOffset || 
        document.documentElement.scrollTop;

      // Αποκλεισμός scroll με requestAnimationFrame για smooth transition
      const lockScroll = () => {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        
        // Αποκλεισμός iOS bounce
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.position = 'relative';
      };
      
      // Use double RAF for smoother transition
      requestAnimationFrame(() => {
        requestAnimationFrame(lockScroll);
      });
    } else {
      // Επαναφορά scroll position - Optimized
      const unlockScroll = () => {
        const scrollY = scrollPositionRef.current;
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
        
        // Επαναφορά scroll position μετά την επαναφορά των styles
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollY,
            behavior: 'auto'
          });
        });
      };
      
      requestAnimationFrame(() => {
        requestAnimationFrame(unlockScroll);
      });
    }
    
    return () => {
      // Cleanup on unmount
      if (!isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
      }
    };
  }, [isOpen]);

  // Διαχείριση rendering και visibility του menu
  useEffect(() => {
    if (isOpen) {
      // Καθαρισμός timer αν υπάρχει
      if (menuCloseTimer.current) {
        clearTimeout(menuCloseTimer.current);
        menuCloseTimer.current = null;
      }
      
      // Smooth rendering με requestAnimationFrame
      requestAnimationFrame(() => {
        setIsMenuRendered(true);
        // Μικρή καθυστέρηση για να εξασφαλιστεί ότι το DOM είναι έτοιμο
        requestAnimationFrame(() => {
          setIsMenuVisible(true);
        });
      });
    } else {
      setIsMenuVisible(false);
      menuCloseTimer.current = setTimeout(() => {
        setIsMenuRendered(false);
        menuCloseTimer.current = null;
      }, 300); // Match transition duration
    }

    return () => {
      if (menuCloseTimer.current) {
        clearTimeout(menuCloseTimer.current);
        menuCloseTimer.current = null;
      }
    };
  }, [isOpen]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    isMenuRendered,
    isMenuVisible,
    openMenu,
    closeMenu,
    toggleMenu,
    setIsOpen
  };
};

