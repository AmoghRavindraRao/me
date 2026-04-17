import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.getElementById('grip-cursor');
    
    // Check if desktop - be more lenient with detection for production
    const isDesktop = window.innerWidth >= 768;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (isDesktop && hasHover) {
      document.body.classList.add('cursor-area');

      const moveCursor = (e: MouseEvent) => {
        if (cursor) {
          cursor.style.left = (e.clientX - 12) + 'px';
          cursor.style.top = (e.clientY - 12) + 'px';
          cursor.style.visibility = 'visible';
        }
      };

      const addHoverEffect = () => {
        cursor?.classList.add('hovering');
      };

      const removeHoverEffect = () => {
        cursor?.classList.remove('hovering');
      };

      // Show cursor on mouse enter window
      const showCursor = () => {
        if (cursor) cursor.style.visibility = 'visible';
      };

      // Hide cursor when leaving window
      const hideCursor = () => {
        if (cursor) cursor.style.visibility = 'hidden';
      };

      document.addEventListener('mousemove', moveCursor);
      document.addEventListener('mouseenter', showCursor);
      document.addEventListener('mouseleave', hideCursor);

      // Add hover effect to interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .service-card, .nav-link');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverEffect);
        el.addEventListener('mouseleave', removeHoverEffect);
      });

      return () => {
        document.removeEventListener('mousemove', moveCursor);
        document.removeEventListener('mouseenter', showCursor);
        document.removeEventListener('mouseleave', hideCursor);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', addHoverEffect);
          el.removeEventListener('mouseleave', removeHoverEffect);
        });
      };
    }
  }, []);

  return null;
};

export default CustomCursor;
