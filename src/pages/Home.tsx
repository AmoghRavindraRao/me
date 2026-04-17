import { useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronDown, Linkedin, Briefcase, GraduationCap } from 'lucide-react';
import { PatternDivider, SectionTitle } from '~components/SharedLayout';
import ContributionGraph from '@/features/github/components/ContributionGraph';
import VisitorCounter from '~components/VisitorCounter';
import profileData from '../../profile.json';

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
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
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

interface ProjectCardProps {
    title: string;
    status: string;
    desc: string;
    technicalSummary: string[];
    tags: string[];
    href: string;
}

const ProjectCard = ({ title, status, desc, technicalSummary, tags, href }: ProjectCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="group block">
            <div className="border border-dashed border-zinc-300 rounded-lg p-1 bg-white/20 hover:bg-black/[0.02] hover:border-zinc-400 transition-all duration-300 flex flex-col h-auto">
                {/* Browser Mockup Header */}
                <div className="h-5 sm:h-6 border-b border-dashed border-zinc-300 flex items-center px-2 sm:px-3 gap-1 sm:gap-1.5 bg-zinc-100/20 rounded-t-lg">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-500/70 transition-colors"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/70 transition-colors"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500/70 transition-colors"></div>
                </div>

                <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3 md:gap-4 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-geist text-base sm:text-lg md:text-xl font-bold text-black group-hover:text-black transition-colors flex-1 line-clamp-2">
                            {title}
                        </h4>
                        <span className="text-[10px] sm:text-[12px] font-mono tracking-wider text-zinc-500 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-zinc-700/50 flex-shrink-0">
                            {status}
                        </span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed line-clamp-2 group-hover:text-zinc-800 transition-colors">
                        {desc}
                    </p>

                    {/* Technical Summary Section */}
                    <div className="flex flex-col gap-1.5">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="flex items-center gap-1 text-[10px] sm:text-[12px] font-mono text-zinc-600 hover:text-zinc-800 transition-colors font-semibold w-fit"
                        >
                            <span className={`inline-block transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                            <span>Technical Stack</span>
                        </button>

                        {isExpanded && (
                            <div className="flex flex-col gap-1 pl-3 border-l border-dashed border-zinc-300 mt-1">
                                {technicalSummary.map((item, idx) => (
                                    <p key={idx} className="text-[10px] sm:text-[12px] text-zinc-600 leading-relaxed font-mono">
                                        • {item}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 group/link"
                    >
                        <div className="flex gap-1 sm:gap-2">
                            {tags.slice(0, 3).map((tag: string, index: number) => (
                                <span key={`${tag}-${index}`} className="text-[11px] sm:text-[12px] font-mono text-zinc-600 group-hover/link:text-zinc-500 truncate">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <ExternalLink size={14} className="text-black group-hover/link:text-black transition-colors flex-shrink-0 sm:size-[16px]" />
                    </a>
                </div>
            </div>
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
                            Hi, I'm <span className="motion-safe:animate-pulse">👋</span>
                        </span>
                        <h1 className="font-doto text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black uppercase">
                            AMOGH
                        </h1>
                        <TypewriterEffect
                            words={["Based in Tempe, Arizona", "ML Engineer & Data Scientist", "ASU Masters Student"]}
                        />
                    </div>

                    {/* Social Links + Visitor Counter - Stacked */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <a href="https://github.com/AmoghRavindraRao" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-zinc-700 text-black hover:bg-zinc-800 transition-colors">
                                <Github size={18} className="sm:size-[20px] md:size-[22px]" />
                            </a>
                            <a href="https://linkedin.com/in/amoghrrao03" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-zinc-700 text-black hover:bg-zinc-800 transition-colors">
                                <Linkedin size={18} className="sm:size-[20px] md:size-[22px]" />
                            </a>
                        </div>
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
                        grade="GPA: 3.78"
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

            {/* PROJECTS SECTION - Grid 2 columns */}
            <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8">
                <SectionTitle title="PROJECTS" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {[
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
                            title: "F1 Race Prediction with Feedback",
                            status: "ML / DATA",
                            desc: "End-to-end race prediction pipeline with uncertainty quantification using Monte Carlo Dropout. Implements post-race feedback loop and experience replay for continuous improvement.",
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
                            key: "3d-inpainting",
                            title: "3D Mesh Inpainting with NeRF",
                            status: "RESEARCH",
                            desc: "Advanced 3D reconstruction using Neural Radiance Fields and diffusion models for intelligent mesh inpainting. Combines state-of-the-art generative AI with computer vision.",
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
                            key: "llm-fundamentals",
                            title: "LLM Fundamentals Learning",
                            status: "ML / EDUCATION",
                            desc: "Comprehensive collection of Jupyter notebooks exploring LLM architectures, fine-tuning techniques, and practical implementations. Educational resource for deep learning concepts.",
                            technicalSummary: [
                                "Transformer architecture implementation from scratch using PyTorch",
                                "Attention mechanisms: self-attention, multi-head attention, cross-attention",
                                "Fine-tuning techniques: LoRA, QLoRA, and full parameter tuning",
                                "Tokenization and embedding strategies for NLP tasks",
                                "Practical examples with HuggingFace Transformers library"
                            ],
                            tags: ['PyTorch', 'Transformers', 'NLP'],
                            href: "https://github.com/AmoghRavindraRao/LLM_Basics"
                        }
                    ].map((project) => (
                        <ProjectCard
                            key={project.key}
                            title={project.title}
                            status={project.status}
                            desc={project.desc}
                            technicalSummary={project.technicalSummary}
                            tags={project.tags}
                            href={project.href}
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
