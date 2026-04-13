import { Link } from 'react-router-dom';
import { Mail, Calendar, Terminal } from 'lucide-react';
import me from '../assets/me.jpg';
import { PatternDivider, SectionTitle } from '~components/SharedLayout';

export default function About() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 relative z-20 bg-white/[0.02]">

            {/* Visually-hidden H1 for SEO */}
            <h1 className="sr-only">About Amogh Ravindra Rao — ML Engineer</h1>

            {/* IDENTITY SECTION - Hero-like introduction */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
                    {/* Image Frame - Responsive */}
                    <div className="relative shrink-0 group/frame">
                        {/* Corner Markers */}
                        <div className="absolute -inset-2 sm:-inset-3 transition-all duration-500 group-hover/frame:scale-105">
                            <div className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 border-zinc-600 opacity-40 transition-opacity top-0 left-0 border-t border-l group-hover/frame:border-zinc-400"></div>
                            <div className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 border-zinc-600 opacity-40 transition-opacity top-0 right-0 border-t border-r group-hover/frame:border-zinc-400"></div>
                            <div className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 border-zinc-600 opacity-40 transition-opacity bottom-0 left-0 border-b border-l group-hover/frame:border-zinc-400"></div>
                            <div className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 border-zinc-600 opacity-40 transition-opacity bottom-0 right-0 border-b border-r group-hover/frame:border-zinc-400"></div>
                        </div>

                        {/* Image */}
                        <div className="relative size-[120px] sm:size-[140px] md:size-[160px] overflow-hidden transition-all duration-700 border border-zinc-300 group-hover/frame:border-zinc-400">
                            <img
                                src={me}
                                alt="Amogh Ravindra Rao"
                                className="absolute inset-0 w-full h-full object-cover group-hover/frame:grayscale transition-all duration-500"
                            />
                        </div>

                        {/* Label */}
                        <div className="absolute -bottom-6 sm:-bottom-7 left-0 w-full text-center">
                            <span className="text-[7px] sm:text-[8px] font-mono text-zinc-600 uppercase tracking-[0.15em] group-hover/frame:text-zinc-800 transition-colors">
                                Figure // Identity
                            </span>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="flex-1 w-full mt-2 sm:mt-0">
                        <div className="group/panel relative z-10 border border-dashed border-zinc-300 bg-white/50 transition-all hover:border-zinc-400 overflow-hidden">
                            {/* Corners */}
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-r border-black transition-colors group-hover/panel:border-zinc-400"></div>
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-l border-black transition-colors group-hover/panel:border-zinc-400"></div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-dashed border-black bg-zinc-100/20">
                                <div className="flex gap-1">
                                    <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-700"></div>
                                    <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-700"></div>
                                    <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-800"></div>
                                </div>
                            </div>

                            {/* Data */}
                            <div className="flex flex-col">
                                <InfoRow index="00" label="Name" value="Amogh Ravindra Rao" />
                                <InfoRow index="01" label="Age" value="24" />
                                <InfoRow index="02" label="Location" value="Tempe, AZ" />
                                <InfoRow index="03" label="Role" value="ML Engineer / Data Scientist" />
                                <InfoRow index="04" label="Status" value="Open to Work" isStatus />
                            </div>

                            {/* Grid overlay */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PATTERN DIVIDER */}
            <PatternDivider />

            {/* ABOUT SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="ABOUT" />

                {/* Bio Panel */}
                <div className="group relative z-10 border border-dashed border-zinc-300 bg-white/50 p-3 sm:p-4 md:p-5 transition-all hover:border-zinc-400 overflow-hidden">
                    {/* Corners */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-r border-zinc-600 transition-colors group-hover:border-zinc-400"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-l border-zinc-600 transition-colors group-hover:border-zinc-400"></div>

                    {/* Decorative dashes */}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
                        <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-600 group-hover:bg-zinc-400 transition-colors"></div>
                        <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-600 group-hover:bg-zinc-400 transition-colors"></div>
                        <div className="w-1 h-0.5 sm:w-1.5 sm:h-0.5 bg-zinc-800"></div>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-black leading-relaxed font-mono">
                        I'm passionate about building intelligent systems that solve real-world problems. Currently pursuing my Master's in Data Science at Arizona State University with a GPA of 3.78. My journey spans from competitive programming to machine learning, with hands-on experience in end-to-end ML pipelines, from F1 race prediction with Monte Carlo uncertainty quantification to multi-LLM council systems with semantic analysis. I love exploring new technologies, contributing to open-source projects, and diving deep into system design. Always learning, always building.
                    </p>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </section>

            {/* PATTERN DIVIDER */}
            <PatternDivider />

            {/* CONNECT SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="CONNECT" />

                {/* Connect Container */}
                <div className="group relative z-10 border border-dashed border-zinc-300 bg-white/50 overflow-hidden">
                    {/* Corners */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-r border-zinc-600 transition-colors group-hover:border-zinc-400"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-l border-zinc-600 transition-colors group-hover:border-zinc-400"></div>

                    {/* Quick Links - 3 columns grid */}
                    <div className="grid grid-cols-3 gap-0 divide-x divide-zinc-300/50">
                        {/* Email */}
                        <a href="mailto:amoghravindrarao@gmail.com" className="group/item relative flex flex-col items-center gap-2 px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 hover:bg-white/[0.04] transition-colors duration-300">
                            <Mail size={18} className="text-black sm:size-[20px] group-hover/item:scale-110 transition-transform duration-300" />
                            <div className="text-center">
                                <p className="font-mono text-xs sm:text-sm text-black group-hover/item:text-black transition-colors font-bold">Email</p>
                                <p className="text-[8px] sm:text-[9px] text-zinc-600 group-hover/item:text-zinc-800 transition-colors mt-0.5">Get in touch</p>
                            </div>
                        </a>

                        {/* Toolbox */}
                        <Link to="/toolbox" className="group/item relative flex flex-col items-center gap-2 px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 hover:bg-white/[0.04] transition-colors duration-300">
                            <Terminal size={18} className="text-black sm:size-[20px] group-hover/item:scale-110 transition-transform duration-300" />
                            <div className="text-center">
                                <p className="font-mono text-xs sm:text-sm text-black group-hover/item:text-black transition-colors font-bold">Toolbox</p>
                                <p className="text-[8px] sm:text-[9px] text-zinc-600 group-hover/item:text-zinc-800 transition-colors mt-0.5">Tech & tools</p>
                            </div>
                        </Link>

                        {/* Timeline */}
                        <Link to="/timeline" className="group/item relative flex flex-col items-center gap-2 px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 hover:bg-white/[0.04] transition-colors duration-300">
                            <Calendar size={18} className="text-black sm:size-[20px] group-hover/item:scale-110 transition-transform duration-300" />
                            <div className="text-center">
                                <p className="font-mono text-xs sm:text-sm text-black group-hover/item:text-black transition-colors font-bold">Timeline</p>
                                <p className="text-[8px] sm:text-[9px] text-zinc-600 group-hover/item:text-zinc-800 transition-colors mt-0.5">My journey</p>
                            </div>
                        </Link>
                    </div>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </section>

            {/* PATTERN DIVIDER */}
            <PatternDivider />

            {/* HOBBIES & INTERESTS SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="HOBBIES & INTERESTS" />

                <div className="relative z-10 border border-dashed border-zinc-300 bg-white/50 overflow-hidden">
                    <div className="flex flex-col divide-y divide-zinc-300/50">
                        <HobbyItem index="01" title="Competitive Programming" desc="Solving algorithmic challenges on Codeforces and LeetCode." />
                        <HobbyItem index="02" title="Open Source" desc="Contributing to tools and frameworks that power the web." />
                        <HobbyItem index="03" title="System Design" desc="Designing scalable architectures and distributed systems." />
                        <HobbyItem index="04" title="Reading Tech Blogs" desc="Staying updated with the latest in software engineering." />
                    </div>
                </div>
            </section>

        </div>
    );
}

/* --- COMPONENTS --- */

interface InfoRowProps {
    index: string;
    label: string;
    value: string;
    isStatus?: boolean;
}

function InfoRow({ index, label, value, isStatus }: InfoRowProps) {
    return (
        <div className={`group flex items-center justify-between py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 ${isStatus ? '' : 'border-b border-zinc-200/30'} hover:bg-white/[0.04] transition-all duration-300 relative`}>
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-400/80 to-zinc-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Label Section */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Index */}
                <span className="font-mono text-[10px] sm:text-[11px] text-zinc-700 group-hover:text-black transition-colors duration-300 tracking-widest opacity-70 group-hover:opacity-100 font-semibold">{index}</span>

                {/* Label */}
                <span className="text-[12px] sm:text-[13px] font-mono text-zinc-700 uppercase tracking-[0.12em] sm:tracking-[0.15em] min-w-[50px] sm:min-w-[65px] group-hover:text-black transition-colors duration-300 font-bold">{label}</span>
            </div>

            {/* Value Section */}
            {isStatus ? (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white/[0.03] border border-zinc-300/40 group-hover:border-zinc-400/60 group-hover:bg-white/[0.06] transition-all duration-300">
                    <span className="relative flex h-1.5 w-1.5 sm:h-1.75 sm:w-1.75">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400/80"></span>
                        <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-sm sm:text-base text-zinc-700 group-hover:text-black transition-colors duration-300 font-semibold">{value}</span>
                </div>
            ) : (
                <span className="font-mono text-sm sm:text-base text-zinc-700 group-hover:text-black transition-colors duration-300 font-semibold text-right flex-1 pl-4">{value}</span>
            )}
        </div>
    );
}

interface HobbyItemProps {
    index: string;
    title: string;
    desc: string;
}

function HobbyItem({ index, title, desc }: HobbyItemProps) {
    return (
        <div className="group px-3 sm:px-4 md:px-5 py-2 sm:py-3 hover:bg-white/[0.02] transition-colors relative">
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-400/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start gap-2 sm:gap-3">
                <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 group-hover:text-zinc-800 transition-colors mt-0.5 shrink-0">{index}</span>
                <div className="flex-1 min-w-0">
                    <h4 className="font-mono text-xs sm:text-sm text-black group-hover:text-black transition-colors font-medium">{title}</h4>
                    <p className="font-mono text-[9px] sm:text-[11px] text-zinc-600 group-hover:text-zinc-800 mt-0.5 leading-relaxed transition-colors">{desc}</p>
                </div>
            </div>
        </div>
    );
}
