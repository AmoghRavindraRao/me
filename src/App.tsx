import { lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '~components/Sidebar';
import CustomCursor from '~components/CustomCursor';
import CommandPalette from '~components/CommandPalette';
import SuspenseLoader from '~components/SuspenseLoader';
import { BackToTop } from './components/BackToTop';
import { SnackbarProvider } from './providers/SnackbarProvider';
import {
  HomeSEO,
  AboutSEO,
  SkillSEO,
  BlogSEO,
  ToolboxSEO,
  TimelineSEO,
  BooksSEO,
  SnippetsSEO,
  NotFoundSEO
} from '~components/SEO';

// Eager load: Home (critical path)
import Home from '~pages/Home';

// Lazy load: Heavy/secondary pages for code splitting
const About = lazy(() => import('~pages/About'));
const Skills = lazy(() => import('~pages/Skill'));
const Blog = lazy(() => import('~pages/Blog'));
const BlogPost = lazy(() => import('~pages/BlogPost'));
const Toolbox = lazy(() => import('~pages/Toolbox'));
const Timeline = lazy(() => import('~pages/Timeline'));
const Books = lazy(() => import('~pages/Books'));
const Snippets = lazy(() => import('~pages/Snippets'));
const NotFound = lazy(() => import('~pages/NotFound'));


function App() {
  const location = useLocation();

  useEffect(() => {
    // Create grip cursor element
    if (!document.getElementById('grip-cursor')) {
      const cursor = document.createElement('div');
      cursor.id = 'grip-cursor';
      cursor.className = 'custom-cursor';
      cursor.style.left = '-9999px';
      cursor.style.top = '-9999px';
      document.body.appendChild(cursor);
    }

    // Scroll reveal animation - Re-initialize on route changes
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Give DOM time to update with new page content
    const timer = setTimeout(() => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        // Reset visibility for new page
        el.classList.remove('visible');
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => observer.unobserve(el));
    };
  }, [location]);

  return (
    <SnackbarProvider>
      <div className="relative min-h-screen text-zinc-900 font-sans selection:bg-zinc-300 selection:text-zinc-900 cursor-area">
          {/* Grip dots background */}
          <div className="fixed inset-0 pointer-events-none z-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundColor: 'var(--bg)'
          }}></div>

          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-zinc-100 focus:text-zinc-900 focus:border focus:border-zinc-400 focus:rounded-md focus:font-mono focus:text-sm"
          >
            Skip to content
          </a>

          {/* Global effects */}
          <CustomCursor />
          <CommandPalette />
          <div className="aura-overlay fixed inset-0 pointer-events-none z-50"></div>
          <div className="scanlines fixed inset-0 pointer-events-none z-40"></div>
          <BackToTop />

          {/* Original sidebar + content */}
          <Sidebar />

          <div className="flex justify-center items-start min-h-screen px-4 lg:px-8 py-8 pb-24 lg:pb-8 relative z-10 pt-20">
            <main id="main-content" className="w-full max-w-5xl">
              <div className="relative min-h-[85vh] px-4 sm:px-10 py-12">
                <SuspenseLoader>
                  <Routes>
                    <Route path="/" element={<><HomeSEO /><Home /></>} />
                    <Route path="/about" element={<><AboutSEO /><About /></>} />
                    <Route path="/skill" element={<><SkillSEO /><Skills /></>} />
                    <Route path="/blog" element={<><BlogSEO /><Blog /></>} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/toolbox" element={<><ToolboxSEO /><Toolbox /></>} />
                    <Route path="/timeline" element={<><TimelineSEO /><Timeline /></>} />
                    <Route path="/books" element={<><BooksSEO /><Books /></>} />
                    <Route path="/snippets" element={<><SnippetsSEO /><Snippets /></>} />
                    <Route path="*" element={<><NotFoundSEO /><NotFound /></>} />
                  </Routes>
                </SuspenseLoader>
              </div>

              <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                © 2026 AMOGH RAVINDRA RAO
              </div>
            </main>
          </div>
        </div>
      </SnackbarProvider>
  );
}

export default App;
