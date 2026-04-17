import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const WORKER_URL = import.meta.env.VITE_VIEW_COUNTER_URL ?? 'https://view-counter.amoghraor.workers.dev';

const DEFAULT_VISITOR_COUNT = '1240'; // fallback when API is unavailable

interface ViewResponse {
  views: number;
  timestamp: number;
  cached?: boolean;
}

/**
 * Real-time visitor counter using Cloudflare KV + Workers
 * Tracks actual page views with rate limiting
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    // Increase timeout significantly - the worker can be slow on first request
    // Use 30 seconds for now, will be shorter in production
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const fetchViews = async () => {
      try {
        console.log('VisitorCounter: Starting fetch with WORKER_URL:', WORKER_URL);
        const hasIncremented = sessionStorage.getItem('view-incremented');
        
        if (!hasIncremented) {
          console.log('VisitorCounter: First visit - incrementing view');
          const incrementRes = await fetch(`${WORKER_URL}/api/views/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
          });
          
          console.log('VisitorCounter: Increment response:', incrementRes.status);
          if (incrementRes.ok) {
            const data: ViewResponse = await incrementRes.json();
            console.log('VisitorCounter: Increment successful, views:', data.views);
            setCount(data.views);
            setError(false); // Clear error on success
            sessionStorage.setItem('view-incremented', 'true');
          } else {
            throw new Error(`Failed to increment: ${incrementRes.status}`);
          }
        } else {
          console.log('VisitorCounter: Returning visitor - fetching current view count');
          const getRes = await fetch(`${WORKER_URL}/api/views`, {
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
          });
          
          console.log('VisitorCounter: Get response:', getRes.status);
          if (getRes.ok) {
            const data: ViewResponse = await getRes.json();
            console.log('VisitorCounter: Fetch successful, views:', data.views);
            setCount(data.views);
            setError(false); // Clear error on success
          } else {
            throw new Error(`Failed to fetch: ${getRes.status}`);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('VisitorCounter: Request aborted (likely timeout)');
        } else {
          console.error('View counter error:', err);
        }
        setError(true);
        const stored = localStorage.getItem('portfolio-visits') || DEFAULT_VISITOR_COUNT;
        setCount(parseInt(stored, 10));
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchViews();
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const formatCount = (num: number | null) => {
    if (num === null) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 border border-dashed border-zinc-800 bg-black/10 rounded-sm">
      <Eye size={12} className="text-black sm:size-[14px]" />
      <span className="font-mono text-[10px] sm:text-[11px] text-black">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          <>
            {formatCount(count)} views
            {error && <span className="text-zinc-700 ml-1">(cached)</span>}
          </>
        )}
      </span>
    </div>
  );
}
