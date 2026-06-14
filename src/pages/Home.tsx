import { useState, useEffect } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ChevronDown, Linkedin, Briefcase, GraduationCap, BookOpen, GitBranch, Target, FileText } from 'lucide-react';
import { PatternDivider, SectionTitle } from '~components/SharedLayout';
import ContributionGraph from '@/features/github/components/ContributionGraph';
import VisitorCounter from '~components/VisitorCounter';
import profileData from '../data/profileData';

import logoIITH from '~assets/logos/asu.png';
import logoRNSIT from '~assets/logos/rnsit.png';

// ==================== HELPER COMPONENTS ====================

interface EducationItemProps {
    school: string;
    degree: string;
    period: string;
    grade: string;
    logo?: string;
    courses?: Record<string, string[]>;
}

const EducationItem = ({ school, degree, period, grade, logo, courses = {} }: EducationItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Get total course count from object
    const totalCourses = Object.values(courses).flat().length;
    const hasCategories = typeof courses === 'object' && !Array.isArray(courses);

    return (
        <div className="flex gap-2 sm:gap-3 md:gap-4 group">
            {/* Left Icon Box */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${school} courses`}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded border border-dashed transition-all duration-300 overflow-hidden ${isOpen ? 'border-zinc-400 bg-zinc-100' : 'border-zinc-300 bg-white/50 hover:border-zinc-400'}`}
                >
                    {logo ? (
                        <img src={logo} alt={school} className="w-full h-full object-cover opacity-90" />
                    ) : (
                        <GraduationCap size={14} className="text-zinc-600 sm:size-[16px]" />
                    )}
                </button>
                <div className={`w-px flex-1 border-l border-dashed transition-colors duration-300 my-1.5 sm:my-2 ${isOpen ? 'border-zinc-700' : 'border-zinc-900'}`} />
            </div>

            <div className="flex-1 pb-1 sm:pb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    className="w-full text-left"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-1">
                        <h4 className={`font-mono text-sm sm:text-base font-bold transition-colors text-black`}>
                            {school}
                        </h4>
                        <span className="font-mono text-xs sm:text-sm text-zinc-600 tabular-nums">{period}</span>
                    </div>
                    <div className="text-sm sm:text-base text-blue-400 font-mono mt-0.5">{degree}</div>
                    <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-dashed border-zinc-300 bg-zinc-200/30 text-[10px] sm:text-[11px] font-mono text-zinc-600">
                            <span>{grade}</span>
                        </span>
                        {totalCourses > 0 && (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] font-mono text-zinc-600 hover:text-zinc-800 transition-colors">
                                <ChevronDown size={10} className="transition-transform duration-300 sm:size-[12px]" style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                                {isOpen ? 'Hide' : 'Show'} Courses ({totalCourses})
                            </span>
                        )}
                    </div>
                </button>

                {/* Expandable Courses - Categorized */}
                {totalCourses > 0 && (
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-2 sm:gap-3">
                                {hasCategories && Object.entries(courses).map(([category, courseList]) => (
                                    <div key={category} className="flex flex-col gap-1 sm:gap-2">
                                        <h5 className="font-mono text-[8px] sm:text-[10px] text-black uppercase tracking-wider border-b border-dashed border-zinc-300 pb-0.5 sm:pb-1">
                                            {category}
                                        </h5>
                                        <div className="flex flex-wrap gap-1">
                                            {courseList.map((course: string) => (
                                                <span
                                                    key={course}
                                                    className="font-mono text-[10px] sm:text-[12px] text-black px-1.5 py-0.5 sm:px-2 sm:py-1 bg-zinc-200/10 border border-zinc-300/50 rounded hover:border-zinc-400 hover:text-black transition-colors"
                                                >
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface TypewriterEffectProps {
    words: string[];
}

const TypewriterEffect = ({ words }: TypewriterEffectProps) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    // Typing logic
    useEffect(() => {
        if (subIndex === words[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 1000); // Wait before deleting
            return;
        }

        if (subIndex === 0 && reverse) {
            const timeout = setTimeout(() => {
                setReverse(false);
                setIndex((prev) => (prev + 1) % words.length);
            }, 0);

            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <div className="h-5 sm:h-6 md:h-7 flex items-center">
            <span className="font-mono text-zinc-600 text-xs sm:text-sm md:text-base">
                {words[index].substring(0, subIndex)}
            </span>
            <span className="w-[2px] h-4 ml-1 bg-blue-500 motion-safe:animate-pulse"></span>
        </div>
    );
};

interface ProjectItem {
    key: string;
    title: string;
    status: string;
    desc: string;
    technicalSummary: string[];
    tags: string[];
    href: string;
}

const PROJECTS: ProjectItem[] = [
    {
        key: "hallucination-stress-test",
        title: "LLM Hallucination Stress-Test Bench",
        status: "ML RESEARCH & EVALUATION",
        desc: "End-to-end adversarial stress-testing toolkit for LLMs, combining a FLAN-T5 prompt generator, DeBERTa-v3 NLI-based hallucination detector, and FAISS-backed fact verifier to systematically surface and measure model hallucinations.",
        technicalSummary: [
            "FLAN-T5 adversarial prompt generator fine-tuned with LoRA (PEFT) and optional PPO reward loop via TRL",
            "DeBERTa-v3-large NLI classifier scoring premise-claim pairs across entailment, neutral, and contradiction",
            "Multi-dataset interleaving strategy across FEVER, MultiNLI, ANLI, HaluEval, and TruthfulQA with configurable sampling weights",
            "spaCy + FAISS fact verifier for atomic claim decomposition and knowledge base retrieval",
            "Stress-test harness tracking hallucination rate, mean NLI confidence, pairwise BLEU diversity, and worst-case pairs per domain"
        ],
        tags: ['Python', 'PyTorch', 'Transformers', 'PEFT', 'DeBERTa', 'FLAN-T5', 'FAISS', 'FastAPI'],
        href: "https://github.com/AmoghRavindraRao/hallucination-stress-test-bench"
    },
    {
        key: "wafer-defect-semi-supervised",
        title: "Semiconductor Wafer Defect Detection",
        status: "INDUSTRIAL ML",
        desc: "Semi-supervised learning pipeline for semiconductor wafer defect classification using contrastive learning, pseudo-labeling, and test-time augmentation.",
        technicalSummary: [
            "Two-stage semi-supervised pipeline with contrastive loss and pseudo-labeling",
            "SmallViT model with TTA-averaged embeddings and FAISS indexing",
            "Monte Carlo Dropout for uncertainty quantification",
            "Temperature calibration via LBFGS for reliable confidence scores",
            "95%+ precision thresholds with multi-view agreement checks"
        ],
        tags: ['PyTorch', 'FAISS', 'Semi-supervised Learning'],
        href: "https://github.com/AmoghRavindraRao/Semiconductor-Wafer-Defect-Detection"
    },
    {
        key: "llm-council",
        title: "LLM Council with Similarity Analysis",
        status: "AI / BACKEND",
        desc: "Multi-LLM council system with parallel queries, anonymous peer evaluation, and semantic similarity analysis. Features FastAPI + React interface with streaming visualization.",
        technicalSummary: [
            "FastAPI backend with async task orchestration for parallel LLM queries",
            "Semantic similarity analysis using embeddings (OpenAI/HuggingFace)",
            "Streaming responses with WebSocket support for real-time visualization",
            "React frontend with interactive evaluation interface",
            "Docker containerization for scalable deployment"
        ],
        tags: ['FastAPI', 'React', 'LLM'],
        href: "https://github.com/AmoghRavindraRao/LLM-Council"
    },
    {
        key: "f1-prediction",
        title: "F1 Race Prediction with Feedback Loop",
        status: "ML / DATA",
        desc: "End-to-end F1 race outcome prediction pipeline with uncertainty quantification and a post-race incremental retraining loop.",
        technicalSummary: [
            "PyTorch neural networks with Monte Carlo Dropout for uncertainty estimation",
            "FastF1 telemetry data pipeline with real-time preprocessing",
            "95% confidence intervals using Bayesian neural networks",
            "Experience replay mechanism for incremental model retraining",
            "Post-race feedback loop for continuous model improvement"
        ],
        tags: ['PyTorch', 'FastF1', 'ML'],
        href: "https://github.com/AmoghRavindraRao/2024_F1_Prediction"
    },
    {
        key: "diabetes-dashboard",
        title: "Healthcare Utilization and Diabetes Outcomes Dashboard",
        status: "DATA VISUALIZATION",
        desc: "Interactive Tableau dashboard exploring 101,766 inpatient diabetes care records across 130 U.S. hospitals, designed as a decision-support tool for administrators, clinicians, and researchers.",
        technicalSummary: [
            "Analysis of 101,766 inpatient encounters with 50 demographic and clinical attributes",
            "15 interconnected Tableau visualizations with calculated fields",
            "Interactive filters for race, gender, age, admission type, and readmission status",
            "Dynamic drill-downs for patient-level insights and top-N diagnosis filtering",
            "Readmission pattern identification and medication disparity analysis"
        ],
        tags: ['Tableau', 'Python', 'Data Analysis'],
        href: "https://github.com/AmoghRavindraRao/diabetes-dashboard-tableau"
    },
    {
        key: "3d-inpainting",
        title: "Hybrid Inpainting Data Analysis for 3D Meshes",
        status: "RESEARCH",
        desc: "Hybrid 3D mesh inpainting system combining diffusion models with Neural Radiance Fields for high-accuracy mesh restoration.",
        technicalSummary: [
            "Neural Radiance Fields (NeRF) for implicit 3D scene representation",
            "Diffusion models for generative 3D inpainting",
            "PyTorch with custom CUDA kernels for volumetric rendering",
            "Multi-view image processing and 3D mesh reconstruction",
            "Hybrid approach combining NeRF latent spaces with diffusion for inpainting"
        ],
        tags: ['NeRF', 'Diffusion', 'PyTorch'],
        href: "https://github.com/AmoghRavindraRao/3D-Mesh-Inpainting-with-NerF---Diffusion"
    },
    {
        key: "sp500-regression",
        title: "Modeling the S&P 500 with Linear Regression",
        status: "DATA SCIENCE",
        desc: "Predictive regression model on macroeconomic indicators to detect financial risk patterns and anomalies in S&P 500 returns.",
        technicalSummary: [
            "Linear regression models on macroeconomic features (Treasury yields, oil prices)",
            "Statistical hypothesis testing and feature significance analysis",
            "Model evaluation via R-squared, RMSE, and residual diagnostics",
            "Risk pattern detection and anomaly identification",
            "Insights into model limitations for non-linear dynamics in financial markets"
        ],
        tags: ['R', 'Statistics', 'Finance'],
        href: "#"
    },
    {
        key: "gaming-platform",
        title: "Distributed Online Gaming Platform",
        status: "FULL-STACK",
        desc: "Dockerized microservices gaming platform with Flask and MongoDB, supporting data science use cases via BSON gameplay datasets.",
        technicalSummary: [
            "Microservices architecture with Flask APIs",
            "MongoDB for scalable gameplay data storage",
            "Docker containerization for reproducible deployments",
            "BSON dataset processing for data science pipelines",
            "Optimized schema design for query performance"
        ],
        tags: ['Flask', 'MongoDB', 'Docker'],
        href: "#"
    },
    {
        key: "anpr-system",
        title: "Automatic Number Plate Detection",
        status: "COMPUTER VISION",
        desc: "Real-time Automatic Number Plate Recognition system using YOLOv8 for detection and EasyOCR for text extraction from license plates.",
        technicalSummary: [
            "YOLOv8 for vehicle and license plate detection",
            "EasyOCR for multi-script text recognition",
            "Real-time video stream processing pipeline",
            "OpenCV preprocessing for enhanced detection accuracy",
            "End-to-end integration of detection and OCR components"
        ],
        tags: ['YOLOv8', 'OCR', 'OpenCV'],
        href: "#"
    },
    {
        key: "catching-ball-game",
        title: "Catching Ball Game",
        status: "COMPUTER VISION",
        desc: "Interactive computer vision game with structured data logging and performance-optimized rendering.",
        technicalSummary: [
            "OpenCV for real-time video capture and object detection",
            "Structured data logging from 100+ users for behavior analysis",
            "Scoring algorithms with engagement optimization (40% improvement)",
            "Rendering efficiency enhancements (25% frame rate boost)",
            "Performance-driven computation and optimization"
        ],
        tags: ['OpenCV', 'C', 'Computer Vision'],
        href: "https://github.com/AmoghRavindraRao/Catch-the-ball"
    },
    {
        key: "railway-system",
        title: "Railway Reservation System",
        status: "FULL-STACK",
        desc: "Full-stack railway booking system with ticket booking, cancellation, admin role-based access, and normalized MySQL schema.",
        technicalSummary: [
            "React frontend with intuitive booking interface",
            "PHP backend with secure authentication",
            "MySQL relational database with normalized schema",
            "Real-time seat tracking and availability management",
            "Role-based access control for admin/user operations"
        ],
        tags: ['React', 'PHP', 'MySQL'],
        href: "https://github.com/AmoghRavindraRao/Railway-Reservation"
    }
];

interface ProjectCardProps extends Omit<ProjectItem, 'key'> {
    index: number;
}

const ProjectCard = ({ title, status, desc, technicalSummary, tags, href, index }: ProjectCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const revealStyle = {
        transitionDelay: `${Math.min(index * 90, 720)}ms`
    } as CSSProperties;

    const tiltStyle = {
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`
    } as CSSProperties;

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        setTilt({
            x: Number((-y * 8).toFixed(2)),
            y: Number((x * 8).toFixed(2))
        });
    };

    const handlePointerLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const hasProjectLink = href !== '#';

    return (
        <div
            className={`project-reveal reveal block ${index % 2 === 1 ? 'sm:mt-8' : ''}`}
            style={revealStyle}
        >
            <article
                className="project-tilt-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white/70 shadow-sm shadow-black/5 backdrop-blur-sm"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={tiltStyle}
            >
                <div className="project-card-content p-4 sm:p-5 md:p-6 flex flex-col gap-2 sm:gap-3 md:gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                        <span className="w-fit rounded border border-dashed border-zinc-300 bg-white/60 px-2 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                            {status}
                        </span>
                        <h4 className="font-geist text-base sm:text-lg md:text-xl font-bold text-black group-hover:text-black transition-colors flex-1 line-clamp-2">
                            {title}
                        </h4>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed group-hover:text-zinc-800 transition-colors">
                        {desc}
                    </p>

                    <div className="flex flex-col gap-1.5">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="flex w-fit items-center gap-1 text-[10px] sm:text-[12px] font-mono text-zinc-600 hover:text-zinc-800 transition-colors font-semibold"
                            aria-expanded={isExpanded}
                        >
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            <span>Technical Stack</span>
                        </button>

                        <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                            <div className="overflow-hidden">
                                <div className="flex flex-col gap-1 pl-3 border-l border-dashed border-zinc-300">
                                    {technicalSummary.map((item, idx) => (
                                        <p key={idx} className="flex gap-2 text-[10px] sm:text-[12px] text-zinc-600 leading-relaxed font-mono">
                                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-500" />
                                            <span>{item}</span>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-1.5 sm:pt-2">
                        <div className="flex min-w-0 flex-wrap gap-1 sm:gap-2">
                            {tags.slice(0, 3).map((tag: string, index: number) => (
                                <span key={`${tag}-${index}`} className="text-[11px] sm:text-[12px] font-mono text-zinc-600 truncate">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {hasProjectLink ? (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex flex-shrink-0 items-center gap-1 rounded border border-dashed border-zinc-300 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:border-zinc-500 hover:bg-zinc-100"
                            >
                                Open
                                <ExternalLink size={13} className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                            </a>
                        ) : (
                            <span className="flex-shrink-0 rounded border border-dashed border-zinc-300 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                Soon
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
};

interface CertificationCardProps {
    name: string;
    issuer: string;
    verify_url: string;
}

const CertificationCard = ({ name, issuer, verify_url }: CertificationCardProps) => (
    <a
        href={verify_url || '#'}
        target={verify_url ? '_blank' : 'self'}
        rel={verify_url ? 'noopener noreferrer' : ''}
        className={`group block ${verify_url ? 'cursor-pointer' : 'cursor-default'}`}
    >
        <div className="border border-dashed border-zinc-300 rounded-lg p-3 sm:p-4 bg-white/20 hover:bg-black/[0.02] hover:border-zinc-400 transition-all duration-300">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h4 className="font-geist text-sm sm:text-base font-bold text-black group-hover:text-black transition-colors">
                        {name}
                    </h4>
                    {issuer && (
                        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                            {issuer}
                        </p>
                    )}
                </div>
                {verify_url && (
                    <ExternalLink size={16} className="text-black group-hover:text-black transition-colors flex-shrink-0 mt-1" />
                )}
            </div>
        </div>
    </a>
);

interface ExperienceItemProps {
    title: string;
    company: string;
    dates: string;
    bullets: string[];
}

const ExperienceItem = ({ title, company, dates, bullets }: ExperienceItemProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex gap-2 sm:gap-3 md:gap-4 group">
            {/* Left Icon Box */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${company} details`}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded border border-dashed transition-all duration-300 overflow-hidden flex-shrink-0 ${isOpen ? 'border-zinc-400 bg-zinc-100' : 'border-zinc-300 bg-white hover:border-zinc-400'}`}
                >
                    <Briefcase size={14} className={`${isOpen ? 'text-zinc-800' : 'text-zinc-600'} sm:size-[16px]`} />
                </button>
                <div className={`w-px flex-1 border-l border-dashed transition-colors duration-300 my-1.5 sm:my-2 ${isOpen ? 'border-zinc-700' : 'border-zinc-900'}`} />
            </div>

            <div className="flex-1 pb-1 sm:pb-2 min-w-0">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    className="w-full text-left"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-1">
                        <h4 className={`font-mono text-sm sm:text-base font-bold transition-colors text-black truncate`}>
                            {title}
                        </h4>
                        <span className="font-mono text-xs sm:text-sm text-zinc-600 tabular-nums flex-shrink-0">{dates}</span>
                    </div>
                    <div className="text-sm sm:text-base text-blue-400 font-mono mt-0.5 truncate">{company}</div>
                </button>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <ul className="flex flex-col gap-1 sm:gap-1.5 mb-2 sm:mb-4 list-none">
                            {bullets.map((bullet: string) => (
                                <li key={bullet} className="font-mono text-black text-[12px] sm:text-[13px] leading-relaxed flex items-start gap-1.5 sm:gap-2">
                                    <span className="mt-1 min-w-[2.5px] min-h-[2.5px] w-[2.5px] h-[2.5px] bg-black rounded-full block flex-shrink-0"></span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExperienceSection = () => {
    return (
        <section className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <SectionTitle title="EXPERIENCE" />
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
                {profileData.work_experience.map((exp) => (
                    <ExperienceItem
                        key={`${exp.company}`}
                        title={exp.title}
                        company={exp.company}
                        dates={exp.dates}
                        bullets={exp.bullets}
                    />
                ))}
            </div>
        </section>
    );
};

// ==================== MAIN COMPONENT ====================

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* HERO SECTION - Updated to match uploaded image & requests */}
            <section className="reveal flex flex-col gap-3 sm:gap-4 md:gap-5 pt-2 sm:pt-3 md:pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <span className="font-mono text-black text-xs sm:text-sm flex items-center gap-2">
                            Hi, I'm
                        </span>
                        <h1 className="font-doto text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black uppercase">
                            AMOGH
                        </h1>
                        <TypewriterEffect
                            words={["Based in Tempe, Arizona", "ML Engineer & Data Scientist", "ASU Masters Student"]}
                        />
                    </div>

                    {/* Social Links + Visitor Counter - Stacked */}
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <a href="https://github.com/AmoghRavindraRao" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-zinc-700 text-black hover:bg-zinc-800 transition-colors">
                                <Github size={18} className="sm:size-[20px] md:size-[22px]" />
                            </a>
                            <a href="https://linkedin.com/in/amoghrrao03" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-zinc-700 text-black hover:bg-zinc-800 transition-colors">
                                <Linkedin size={18} className="sm:size-[20px] md:size-[22px]" />
                            </a>
                        </div>
                        <Link
                            to="/resume"
                            aria-label="View resume"
                            className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-zinc-800 bg-black/10 px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-black transition-colors hover:bg-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
                        >
                            <FileText size={12} className="text-black sm:size-[14px]" />
                            Resume
                        </Link>
                        <VisitorCounter />
                    </div>
                </div>
            </section>

            {/* PATTERN DIVIDER - After Hero */}
            <PatternDivider />

            {/* CONTRIBUTION GRAPH */}
            <ContributionGraph />

            {/* PATTERN DIVIDER - After Contribution Graph */}
            <PatternDivider />

            {/* EDUCATION SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="EDUCATION" />
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
                    <EducationItem
                        school="Arizona State University"
                        degree="Masters in Data Science, Analytics and Engineering"
                        period="2024 - 2026"
                        grade="GPA: 3.77"
                        logo={logoIITH}
                        courses={{
                            "Computer Science": [
                                "Distributed Database Systems",
                                "Multimedia Data Processing"
                            ],
                            "AI & Machine Learning": [
                                "Machine Learning",
                                "Data Mining"
                            ],
                            "Data Science & Analytics": [
                                "Programming Data-Driven Optimization",
                                "Data Visualization & Reporting for Data",
                                "Data Science Capstone"
                            ],
                            "Statistics": [
                                "Statistics for Data Analysis",
                                "Applied Regression Analysis"
                            ],
                            "Cybersecurity": [
                                "Information Assurance & Security"
                            ]
                        }}
                    />
                    <EducationItem
                        school="RNS Institute of Technology, VTU Board"
                        degree="Bachelor of Engineering in Computer Science"
                        period="2020 - 2024"
                        grade="GPA: 3.82"
                        logo={logoRNSIT}
                        courses={{
                            "Mathematics and Basic Sciences": [
                                "Calculus and Linear Algebra",
                                "Engineering Physics",
                                "Engineering Chemistry",
                                "Advanced Calculus and Numerical Methods",
                                "Transform Calculus, Fourier Series & Numerical Techniques",
                                "Complex Analysis, Probability & Statistical Methods"
                            ],
                            "Core Computer Science Foundations": [
                                "Data Structures and Applications",
                                "Design and Analysis of Algorithms",
                                "Computer Organization",
                                "Operating Systems",
                                "Automata Theory and Computability",
                                "System Software and Compilers"
                            ],
                            "Programming and Software Development": [
                                "C Programming for Problem Solving",
                                "Application Development using Python",
                                "Unix Programming",
                                "Web Technology and its Applications",
                                "Mobile Application Development"
                            ],
                            "Computer Systems, Networks, and Security": [
                                "Basic Electrical Engineering",
                                "Microcontroller and Embedded Systems",
                                "Data Communication",
                                "Computer Networks and Security",
                                "System Software Laboratory",
                                "Computer Network Laboratory"
                            ],
                            "Databases, Data and Cloud": [
                                "Database Management Systems",
                                "DBMS Laboratory with mini project",
                                "Cloud Computing and its Applications"
                            ],
                            "Graphics, Visualization, and HCI": [
                                "Computer Graphics and Visualization",
                                "Computer Graphics Laboratory with mini project",
                                "Engineering Graphics"
                            ],
                            "Software Engineering, Management, and Professional Practice": [
                                "Software Engineering",
                                "Management and Entrepreneurship for IT Industry",
                                "Constitution of India, Professional Ethics & Cyber Law",
                                "Environmental Studies"
                            ],
                            "Electronics, Electrical, and Mechanical Foundations": [
                                "Basic Electronics",
                                "Analog and Digital Electronics",
                                "Elements of Mechanical Engineering",
                                "Elements of Civil Engineering & Mechanics",
                                "Non-Conventional Energy Sources"
                            ]
                        }}
                    />
                </div>
            </section>

            {/* PATTERN DIVIDER - After Education */}
            <PatternDivider />

            {/* CERTIFICATIONS SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="CERTIFICATIONS" />
                <div className="flex flex-col gap-3">
                    <CertificationCard name="AWS Certified Cloud Practitioner" issuer="" verify_url="https://cp.certmetrics.com/amazon/en/public/verify/credential/736c4d104fb04f98bff4d84d311a5b65" />
                    <CertificationCard name="Data Analysis Job Simulation" issuer="Forage" verify_url="https://www.linkedin.com/posts/amoghrrao03_forage-certificate-ugcPost-7339414759320014849-QVDp?utm_source=share&utm_medium=member_desktop&rcm=ACoAADdLpZQBp7tN_y__Q-5_bA0swwVtpVch05Q" />
                    <CertificationCard name="GenAI Powered Data Analytics" issuer="Forage" verify_url="https://www.linkedin.com/posts/amoghrrao03_forage-certificate-ugcPost-7341273253585264640-6ojC?utm_source=share&utm_medium=member_desktop&rcm=ACoAADdLpZQBp7tN_y__Q-5_bA0swwVtpVch05Q" />
                    <CertificationCard name="Quantitative Research Job Simulation" issuer="Forage" verify_url="https://www.linkedin.com/posts/amoghrrao03_forage-certificate-activity-7348101994152136705-_5TC" />
                    <CertificationCard name="Ethical Hacking Essential" issuer="EC-Council" verify_url="" />
                </div>
            </section>

            {/* PATTERN DIVIDER - After Certifications */}
            <PatternDivider />

            {/* INDIVIDUAL LEARNING SECTION */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="INDIVIDUAL LEARNING" />
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                    <article className="rounded-lg border border-dashed border-zinc-300 bg-white/35 p-4 transition-all duration-300 hover:border-zinc-400 hover:bg-white/45 sm:p-6 md:p-8">
                        <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="inline-flex items-center gap-2 rounded border border-dashed border-zinc-300 bg-white/35 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black sm:text-xs">
                                <BookOpen size={14} />
                                Currently Working On
                            </span>
                            <span className="inline-flex items-center gap-2 rounded border border-dashed border-zinc-300 bg-white/35 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black sm:text-xs">
                                <Target size={14} />
                                Agentic AI
                            </span>
                        </div>

                        <h3 className="mb-4 font-doto text-3xl font-bold uppercase leading-tight text-black sm:text-4xl">
                            Agentic AI Engineering
                        </h3>
                        <p className="max-w-4xl text-sm leading-7 text-zinc-700 sm:text-base">
                            I am currently learning how to design, evaluate, and ship agentic AI systems through the Udemy course "The Complete Agentic AI Engineering Course." I am translating the course into hands-on notes, experiments, and implementation logs in my AgenticAI repository.
                        </p>

                        <div className="my-6 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                            {[
                                "Agent workflows",
                                "Tool use",
                                "Planning loops",
                                "Memory patterns",
                                "Multi-agent systems",
                                "Evaluation",
                                "Guardrails",
                                "Production orchestration"
                            ].map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded border border-dashed border-zinc-300 bg-white/35 px-3 py-2 font-mono text-xs text-black transition-colors hover:border-zinc-400 hover:bg-white/50"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a
                                href="https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/learn/lecture/49770893?start=165#overview"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-zinc-300 bg-white/45 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:border-zinc-500 hover:bg-white/65"
                            >
                                <BookOpen size={16} />
                                Udemy Course
                                <ExternalLink size={14} />
                            </a>
                            <a
                                href="https://github.com/AmoghRavindraRao/AgenticAI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-zinc-300 bg-white/45 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:border-zinc-500 hover:bg-white/65"
                            >
                                <GitBranch size={16} />
                                Learning Repo
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </article>

                    <article className="rounded-lg border border-dashed border-zinc-300 bg-white/35 p-4 transition-all duration-300 hover:border-zinc-400 hover:bg-white/45 sm:p-6 md:p-8">
                        <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="inline-flex items-center gap-2 rounded border border-dashed border-zinc-300 bg-white/35 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black sm:text-xs">
                                <Target size={14} />
                                Completed
                            </span>
                            <span className="inline-flex items-center gap-2 rounded border border-dashed border-zinc-300 bg-white/35 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black sm:text-xs">
                                LLM Fundamentals
                            </span>
                        </div>

                        <h3 className="mb-4 font-doto text-3xl font-bold uppercase leading-tight text-black sm:text-4xl">
                            From Learning Track to Evaluation Project
                        </h3>
                        <p className="max-w-4xl text-sm leading-7 text-zinc-700 sm:text-base">
                            The LLM fundamentals learning journey is complete. I converted the study work into the LLM Hallucination Stress-Test Bench, an adversarial evaluation toolkit for surfacing hallucinations with prompt generation, NLI scoring, and retrieval-backed fact checks.
                        </p>

                        <div className="my-6 border-l border-dashed border-zinc-400 pl-4">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                                Resulting Project
                            </span>
                            <h4 className="mt-2 text-lg font-bold text-black">
                                LLM Hallucination Stress-Test Bench
                            </h4>
                            <p className="mt-1 text-sm text-zinc-600">
                                Now highlighted as the opening project in the project section below.
                            </p>
                        </div>

                        <a
                            href="https://github.com/AmoghRavindraRao/hallucination-stress-test-bench"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded border border-dashed border-zinc-300 bg-white/45 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:border-zinc-500 hover:bg-white/65"
                        >
                            <GitBranch size={16} />
                            View Completed Project
                            <ExternalLink size={14} />
                        </a>
                    </article>
                </div>
            </section>

            {/* PATTERN DIVIDER - Before Projects */}
            <PatternDivider />

            {/* PROJECTS SECTION - staggered, tilt-enabled cards */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <div className="flex items-center justify-between gap-3">
                    <SectionTitle title="PROJECTS" />
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-600">
                        {PROJECTS.length} selected
                    </span>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
                    {PROJECTS.map(({ key, ...project }, index) => (
                        <ProjectCard
                            key={key}
                            {...project}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* PATTERN DIVIDER - After Projects */}
            <PatternDivider />

            {/* EXPERIENCE SECTION - With Toggle Filter */}
            <ExperienceSection />
        </div>
    );
};

// PatternDivider and SectionTitle are now in ~components/SharedLayout.tsx
// Re-export for backward compatibility (though all imports should use SharedLayout directly)
export { PatternDivider, SectionTitle } from '~components/SharedLayout';

export default Home;
