import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.getElementById('grip-cursor');
    
    // Check if desktop
    if (window.matchMedia('(min-width: 768px)').matches && window.matchMedia('(hover: hover)').matches) {
      document.body.classList.add('cursor-area');

      const moveCursor = (e: MouseEvent) => {
        if (cursor) {
          cursor.style.left = e.clientX - 10 + 'px';
          cursor.style.top = e.clientY - 10 + 'px';
        }
      };

      const addHoverEffect = () => {
        cursor?.classList.add('hovering');
      };

      const removeHoverEffect = () => {
        cursor?.classList.remove('hovering');
      };

      document.addEventListener('mousemove', moveCursor);

      // Add hover effect to interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .service-card, .nav-link');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverEffect);
        el.addEventListener('mouseleave', removeHoverEffect);
      });

      return () => {
        document.removeEventListener('mousemove', moveCursor);
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
