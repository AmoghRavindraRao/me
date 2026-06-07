import { useMemo, useState, useEffect, useRef } from 'react';
import { Bot, ExternalLink, X } from 'lucide-react';

const CHATBOT_UI_URL = import.meta.env.VITE_CHATBOT_UI_URL ?? 'http://localhost:7860';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [embedMode, setEmbedMode] = useState<'iframe' | 'gradio'>('iframe');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // attempt to load gradio and decide embed mode
  useGradioEmbed(containerRef, CHATBOT_UI_URL, setEmbedMode);

  // when Gradio becomes available, inject the <gradio-app> element into the container
  useEffect(() => {
    if (embedMode !== 'gradio' || !containerRef.current) return;
    try {
      containerRef.current.innerHTML = `<gradio-app src="${CHATBOT_UI_URL}" style="height:100%;width:100%;display:block"></gradio-app>`;
    } catch (_e) {
      // fallback to iframe if injection fails
      setTimeout(() => setEmbedMode('iframe'));
    }
  }, [embedMode]);

  const panelTitle = useMemo(() => 'Career Strategy Assistant', []);

  return (
    <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-3">
      {/* Always render the chatbot container (hidden until opened) for background preload */}
      <section
        className={`w-[min(92vw,420px)] h-[min(72vh,640px)] max-h-[calc(100vh-7rem)] overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white/95 text-black shadow-2xl shadow-black/10 backdrop-blur-xl ${isOpen ? 'block' : 'hidden'}`}
        aria-label={panelTitle}
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
            <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Chat with Me
              <span className="ml-3 inline-flex items-center gap-2 rounded-full bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-300">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${embedMode === 'gradio' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  aria-hidden={true}
                />
                <span>{embedMode === 'gradio' ? 'Gradio embed' : 'iframe'}</span>
              </span>
            </div>
            <h2 className="mt-1 truncate text-sm font-semibold text-black">
              Chat with Me
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={CHATBOT_UI_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-black/70 transition-colors hover:border-zinc-400 hover:text-black"
              aria-label="Open chatbot in a new tab"
              title="Open chatbot in a new tab"
            >
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-black/70 transition-colors hover:border-zinc-400 hover:text-black"
              aria-label="Close chatbot"
              title="Close chatbot"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="relative h-[calc(100%-57px)] bg-zinc-50">
          {embedMode === 'gradio' ? (
            <div ref={containerRef} className="h-full w-full bg-white" />
          ) : (
            <iframe
              src={CHATBOT_UI_URL}
              title="Career Strategy Assistant"
              className="h-full w-full bg-white"
              allow="clipboard-read; clipboard-write; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-white/95 text-black shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-zinc-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        title={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <Bot size={18} className="transition-transform duration-300 group-hover:scale-110" />
      </button>
    </div>
  );
}

// Try to load Gradio's web component and fall back to iframe when unavailable.
// This runs client-side only.
function useGradioEmbed(
  containerRef: React.RefObject<HTMLDivElement | null>,
  src: string,
  setEmbed: React.Dispatch<React.SetStateAction<'gradio' | 'iframe'>>,
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trySetMode = () => {
      try {
        if (window.customElements && window.customElements.get('gradio-app')) {
          setEmbed('gradio');
          return true;
        }
      } catch (_e) {
        // ignore
      }
      return false;
    };

    if (trySetMode()) return;

    const existing = document.querySelector('script[data-gradio-embed]');
    if (!existing) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://gradio.s3-us-west-2.amazonaws.com/6.14.0/gradio.js';
      s.setAttribute('data-gradio-embed', '1');
      s.onload = () => {
        // small delay to let customElements register
        setTimeout(() => {
          if (!trySetMode()) setEmbed('iframe');
        }, 50);
      };
      s.onerror = () => setEmbed('iframe');
      document.head.appendChild(s);
    } else {
      // already present; wait briefly
      setTimeout(() => {
        if (!trySetMode()) setEmbed('iframe');
      }, 50);
    }

    // when gradio becomes available, inject the element into container
    const observer = new MutationObserver(() => {
      if (window.customElements && window.customElements.get('gradio-app')) {
        setEmbed('gradio');
      }
    });
    observer.observe(document.head || document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef, src, setEmbed]);
}

// Hook usage inside module scope to avoid lint complaints; exported component will call it.
// Wire it up by calling inside the component via a separate effect.
// We add a small effect to inject the `<gradio-app>` when embedMode changes to 'gradio'.
// (Note: kept outside main component to keep file structure clear.)
