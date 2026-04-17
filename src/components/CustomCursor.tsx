import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    // Only initialize on desktop (not mobile/tablet)
    if (window.innerWidth < 768) {
      return;
    }

    // Wait a tick to ensure cursor element exists
    requestAnimationFrame(() => {
      const cursor = document.getElementById('grip-cursor');
      
      if (!cursor) {
        console.warn('CustomCursor: grip-cursor element not found');
        return;
      }

      // Enable custom cursor
      document.body.classList.add('cursor-area');
      console.log('CustomCursor: Enabled');

      const moveCursor = (e: MouseEvent) => {
        cursor.style.left = (e.clientX - 12) + 'px';
        cursor.style.top = (e.clientY - 12) + 'px';
      };

      const addHoverEffect = () => {
        cursor.classList.add('hovering');
      };

      const removeHoverEffect = () => {
        cursor.classList.remove('hovering');
      };

      // Add mousemove listener directly to document
      document.addEventListener('mousemove', moveCursor, { passive: true });

      // Add hover effect to interactive elements
      const interactiveSelectors = 'a, button, input, textarea, .project-card, .service-card, .nav-link, [role="button"]';
      const interactiveElements = document.querySelectorAll(interactiveSelectors);
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverEffect);
        el.addEventListener('mouseleave', removeHoverEffect);
      });

      // Use MutationObserver to add hover effect to dynamically added elements
      const observer = new MutationObserver(() => {
        const newElements = document.querySelectorAll(interactiveSelectors);
        newElements.forEach(el => {
          // Only add if not already listening
          if (!el.dataset.hoverListening) {
            el.addEventListener('mouseenter', addHoverEffect);
            el.addEventListener('mouseleave', removeHoverEffect);
            el.dataset.hoverListening = 'true';
          }
        });
      });

      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });

      return () => {
        document.removeEventListener('mousemove', moveCursor);
        observer.disconnect();
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', addHoverEffect);
          el.removeEventListener('mouseleave', removeHoverEffect);
        });
      };
    });
  }, []);

  return null;
};

export default CustomCursor;
