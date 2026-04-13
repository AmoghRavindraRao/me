import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, User, Code, FileText, Github, Linkedin, Mail, ExternalLink, History, MessageSquare } from 'lucide-react';

interface Action {
    id: string;
    title: string;
    icon: React.ReactNode;
    shortcut?: string;
    perform: () => void;
}

// Module-level constant — static actions that don't depend on navigate.
// Created once at module load time, never recreated.
const STATIC_ACTIONS: Action[] = [
    {
        id: 'resume',
        title: 'Download Resume',
        icon: <FileText size={16} className="sm:size-[18px]" />,
        perform: () => window.open('/Amogh_Rao_Resume.pdf', '_blank', 'noopener,noreferrer')
    },
    {
        id: 'github',
        title: 'GitHub',
        icon: <Github size={16} className="sm:size-[18px]" />,
        perform: () => window.open('https://github.com/AmoghRavindraRao', '_blank', 'noopener,noreferrer')
    },
    {
        id: 'linkedin',
        title: 'LinkedIn',
        icon: <Linkedin size={16} className="sm:size-[18px]" />,
        perform: () => window.open('https://linkedin.com/in/amogh-r-rao03', '_blank', 'noopener,noreferrer')
    },
    {
        id: 'email',
        title: 'Send Email',
        icon: <Mail size={16} className="sm:size-[18px]" />,
        perform: () => { window.location.href = 'mailto:amoghravindrarao@gmail.com'; }
    },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Only navigate-dependent actions live in useMemo.
    // STATIC_ACTIONS are appended from the module-level constant.
    const actions: Action[] = useMemo(() => [
        {
            id: 'home',
            title: 'Home',
            icon: <Home size={16} className="sm:size-[18px]" />,
            shortcut: 'H',
            perform: () => navigate('/')
        },
        {
            id: 'about',
            title: 'About',
            icon: <User size={16} className="sm:size-[18px]" />,
            shortcut: 'A',
            perform: () => navigate('/about')
        },
        {
            id: 'skills',
            title: 'Skills',
            icon: <Code size={16} className="sm:size-[18px]" />,
            shortcut: 'S',
            perform: () => navigate('/skill')
        },
        {
            id: 'toolbox',
            title: 'My Toolbox',
            icon: <Code size={16} className="sm:size-[18px]" />,
            shortcut: 'T',
            perform: () => navigate('/toolbox')
        },
        {
            id: 'timeline',
            title: 'Learning Log',
            icon: <History size={16} className="sm:size-[18px]" />,
            shortcut: 'L',
            perform: () => navigate('/timeline')
        },
        {
            id: 'chat',
            title: 'Chat with Amogh',
            icon: <MessageSquare size={18} />,
            perform: () => navigate('/chat')
        },
        ...STATIC_ACTIONS,
    ], [navigate]);

    const filteredActions = actions.filter(action =>
        action.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            const timeoutId = setTimeout(() => inputRef.current?.focus(), 10);
            setQuery('');
            setActiveIndex(0);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    const execute = (action: Action) => {
        setIsOpen(false);
        action.perform();
    };

    const handleInputKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredActions[activeIndex]) {
                execute(filteredActions[activeIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-3 sm:px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className="relative w-full max-w-lg bg-[#ffffff] border border-dashed border-zinc-300 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onKeyDown={(e) => {
                    if (e.key === 'Tab' && modalRef.current) {
                        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                            'button, input, a[href], [tabindex]:not([tabindex="-1"])'
                        );
                        const first = focusable[0];
                        const last = focusable[focusable.length - 1];
                        if (e.shiftKey) {
                            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                        } else {
                            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                        }
                    }
                }}
            >
                {/* Search Bar */}
                <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 border-b border-dashed border-zinc-300">
                    <Search size={14} className="text-zinc-600 mr-2 sm:mr-3 flex-shrink-0 sm:size-[18px]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command..."
                        className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder-zinc-600 text-sm sm:text-base font-mono h-5 sm:h-6"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setActiveIndex(0);
                        }}
                        onKeyDown={handleInputKey}
                    />
                    <div className="text-[8px] sm:text-[10px] font-mono text-zinc-600 border border-zinc-300 rounded px-1 sm:px-1.5 py-0.5 bg-zinc-100 flex-shrink-0">
                        ESC
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[40vh] sm:max-h-[300px] overflow-y-auto py-1 sm:py-2">
                    {filteredActions.length === 0 ? (
                        <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-zinc-600 text-sm sm:text-base font-mono">
                            No results found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0.5 sm:gap-1 px-1 sm:px-2">
                            {filteredActions.map((action, index) => (
                                <button
                                    key={action.id}
                                    onClick={() => execute(action)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`flex items-center justify-between w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition-colors ${index === activeIndex
                                        ? 'bg-zinc-200/80 text-zinc-900'
                                        : 'text-zinc-600 hover:text-zinc-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <span className={`flex-shrink-0 ${index === activeIndex ? 'text-zinc-900' : 'text-zinc-600'}`}>
                                            {action.icon}
                                        </span>
                                        <span className="text-sm sm:text-base font-medium truncate">{action.title}</span>
                                    </div>
                                    {action.shortcut && (
                                        <span className={`text-[8px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.5 rounded border flex-shrink-0 ${index === activeIndex
                                            ? 'border-zinc-400 text-zinc-800'
                                            : 'border-zinc-300 text-zinc-600'
                                            }`}>
                                            {action.shortcut}
                                        </span>
                                    )}
                                    {!action.shortcut && (
                                        <ExternalLink size={10} className={`opacity-0 sm:size-[12px] ${index === activeIndex ? 'opacity-50' : ''}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center text-[8px] sm:text-[10px] text-zinc-600 font-mono gap-2">
                    <div className="flex gap-1.5 sm:gap-3 flex-wrap">
                        <span>↑↓ to navigate</span>
                        <span className="hidden sm:inline">↵ to select</span>
                    </div>
                    <span className="flex-shrink-0">Portfolio v1.0</span>
                </div>
            </div>
        </div>
    );
}
