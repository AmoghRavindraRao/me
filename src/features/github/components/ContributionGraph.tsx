import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useGithubContributions } from '@/features/github/hooks/useGithubContributions';
import { useLeetCodeStats } from '@/features/leetcode/hooks/useLeetCodeStats';

// Types for contribution data
interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ContributionWeek {
    days: ContributionDay[];
}

interface MonthLabel {
    weekIndex: number;
    month: string;
}

// GitHub Contribution Graph
const ContributionGraph = () => {
    const [hoveredDay, setHoveredDay] = useState<(ContributionDay & { x: number; y: number }) | null>(null);
    const [activeTab, setActiveTab] = useState<'github' | 'leetcode'>('github');
    const svgContainerRef = useRef<HTMLDivElement>(null);

    const { data: githubData, isLoading: githubLoading } = useGithubContributions();
    const { data: leetcodeData, isLoading: leetcodeLoading, error: leetcodeError } = useLeetCodeStats();

    // Handle mouse move for tooltip positioning - only update when hovering
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setHoveredDay((prev) => 
            prev ? { 
                ...prev, 
                x: e.clientX, 
                y: e.clientY
            } : null
        );
    }, []);

    // Debug logging
    useEffect(() => {
        console.log('GitHub Data:', githubData);
        console.log('LeetCode Data:', leetcodeData);
        console.log('LeetCode Error:', leetcodeError);
        console.log('Active Tab:', activeTab);
    }, [githubData, leetcodeData, leetcodeError, activeTab]);

    // Premium Monochrome Palette
    const levels = useMemo(() =>
        ['rgba(39, 39, 42, 0.4)', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'],
    []);

    const getLevel = useCallback((count: number): number => {
        // Adaptive levels to handle both GitHub (0-50+) and LeetCode (0-20+) ranges
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 7) return 2;
        if (count <= 12) return 3;
        return 4;
    }, []);

    const processContributions = useCallback((platformData: { contributions?: Array<{ date: string; count: number }> } | null): { weeks: ContributionWeek[]; monthLabels: MonthLabel[] } => {
        if (!platformData) return { weeks: [], monthLabels: [] };

        const contribMap: Record<string, number> = {};
        const contributions = platformData.contributions || [];

        contributions.forEach((day) => {
            contribMap[day.date] = day.count;
        });

        const today = new Date();
        const weeks: ContributionWeek[] = [];
        const monthLabels: MonthLabel[] = [];
        let lastMonth = -1;

        // Create 53 weeks to ensure coverage of a full year (364 days + current partial week)
        for (let w = 0; w < 53; w++) {
            const week: ContributionDay[] = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                // Calculate date backwards from today
                date.setDate(date.getDate() - ((52 - w) * 7 + (6 - d)));
                const dateStr = date.toISOString().split('T')[0];
                const count = contribMap[dateStr] || 0;
                week.push({ date: dateStr, count, level: getLevel(count) });

                // If Sunday (first day of week), check if we should add a month label
                if (d === 0) {
                    const month = date.getMonth();
                    if (month !== lastMonth) {
                        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
                        monthLabels.push({ weekIndex: w, month: monthName });
                        lastMonth = month;
                    }
                }
            }
            weeks.push({ days: week });
        }

        return { weeks, monthLabels };
    }, [getLevel]);

    // Prepare platform-specific data and stats
    const currentStats = useMemo(() => ({
        label: activeTab === 'github' ? 'Contributions (GitHub)' : 'Problems Solved (LeetCode)',
        value: activeTab === 'github' ? githubData?.totalContributions || 0 : leetcodeData?.solvedProblem || 0
    }), [githubData, leetcodeData, activeTab]);

    const getPlatformData = useCallback(() => {
        if (activeTab === 'github') {
            return githubData;
        }
        return leetcodeData;
    }, [activeTab, githubData, leetcodeData]);

    const isLoading = activeTab === 'github' ? githubLoading : leetcodeLoading;

    const { weeks, monthLabels } = useMemo(() => processContributions(getPlatformData()), [getPlatformData, processContributions]);

    return (
        <section className="flex flex-col gap-4 relative">
            {/* Platform Tabs */}
            <div className="flex gap-2 border-b border-zinc-800/50">
                <button
                    onClick={() => setActiveTab('github')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'github'
                            ? 'text-zinc-100 border-b-2 border-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-400'
                    }`}
                >
                    GitHub
                </button>
                <button
                    onClick={() => setActiveTab('leetcode')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'leetcode'
                            ? 'text-zinc-100 border-b-2 border-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-400'
                    }`}
                >
                    LeetCode
                </button>
            </div>

            {/* Calendar Container - Scrollable on mobile */}
            <div 
                ref={svgContainerRef}
                onMouseMove={handleMouseMove}
                className="relative border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-xl p-4 overflow-x-auto group"
            >
                {/* Month Labels */}
                <div className="relative h-6 mb-1">
                    <svg viewBox={`0 0 ${53 * 13} 15`} className="w-full min-w-[689px] h-full block">
                        {monthLabels.map((m) => (
                            <text
                                key={`${m.weekIndex}-${m.month}`}
                                x={m.weekIndex * 13}
                                y="12"
                                className="text-[10px] font-mono fill-zinc-500 font-medium"
                            >
                                {m.month}
                            </text>
                        ))}
                    </svg>
                </div>

                {/* Heatmap Grid */}
                {isLoading ? (
                    <div className="h-[91px] min-w-[689px] flex items-center justify-center">
                        <div className="flex gap-[3px]">
                            {Array.from({ length: 53 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-[3px]">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <div key={j} className="w-[10px] h-[10px] rounded-[2.5px] bg-zinc-800/60 animate-pulse" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : weeks.length === 0 ? (
                    <div className="h-[100px] flex items-center justify-center text-xs font-mono text-zinc-600">
                        Unable to load data
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <svg viewBox={`0 0 ${53 * 13} ${7 * 13}`} className="w-full min-w-[689px] h-auto block select-none">
                            {weeks.map((week, w) => (
                                <g key={w} transform={`translate(${w * 13}, 0)`}>
                                    {week.days.map((day, d) => (
                                        <rect
                                            key={day.date}
                                            x="0"
                                            y={d * 13}
                                            width="10"
                                            height="10"
                                            fill={levels[day.level]}
                                            rx="2.5"
                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                            onMouseEnter={(e: React.MouseEvent<SVGRectElement>) => {
                                                setHoveredDay({
                                                    ...day,
                                                    x: e.clientX,
                                                    y: e.clientY
                                                });
                                            }}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        />
                                    ))}
                                </g>
                            ))}
                        </svg>
                    </div>
                )}

                {/* Legend */}
                {/* Footer: Stats & Legend */}
                <div className="flex items-end justify-between mt-2">
                    {/* Stats Display (Left) */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-doto text-black tracking-tight">
                            {(currentStats.value ?? '-').toLocaleString()}
                        </span>

                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider ml-1">
                            {currentStats.label}
                        </span>
                    </div>

                    {/* Legend (Right) */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-600">Less</span>
                        {levels.map((color, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        ))}
                        <span className="text-[10px] font-mono text-zinc-600">More</span>
                    </div>
                </div>

                {/* Custom Floating Tooltip */}
                {hoveredDay && (
                    <div
                        className="fixed z-50 pointer-events-none bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded shadow-xl whitespace-nowrap"
                        style={{ 
                            left: `${hoveredDay.x + 12}px`, 
                            top: `${hoveredDay.y - 40}px`
                        }}
                    >
                        <div className="font-semibold">
                            {hoveredDay.count} {activeTab === 'github' ? 'contributions' : 'problems'}
                        </div>
                        <div className="text-zinc-500 text-[10px] uppercase font-mono">
                            {new Date(hoveredDay.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContributionGraph;
