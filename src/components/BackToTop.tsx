import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-8 z-[90] p-2 bg-zinc-100/80 backdrop-blur-md border border-dashed border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-colors rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={14} />
    </button>
  );
}
