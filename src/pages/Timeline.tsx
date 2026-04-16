import { PatternDivider } from '~components/SharedLayout';
import { Briefcase, Trophy, Code, GraduationCap, Rocket, Star} from 'lucide-react';

interface Milestone {
    date: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    tags: string[];
    align: string;
}

const milestones: Milestone[] = [
    {
        date: "MAY 2026",
        title: "Master's Graduation @ ASU",
        desc: "Completing my Master's in Data Science, Analytics and Engineering at Arizona State University with a GPA of 3.78. Thesis focus on advanced ML and data engineering.",
        icon: <GraduationCap size={20} />,
        tags: ["Education", "ASU", "MSDSAE"],
        align: "right"
    },
    {
        date: "JAN 2026 - PRESENT",
        title: "LLM Council & Advanced ML Projects",
        desc: "Built multi-LLM council system with semantic similarity analysis and F1 race prediction with 95% confidence intervals using Monte Carlo dropout. Pushing boundaries of ensemble learning.",
        icon: <Rocket size={20} />,
        tags: ["ML", "Research", "LLMs"],
        align: "left"
    },
    {
        date: "FEB 2026",
        title: "AWS Certified Cloud Practitioner",
        desc: "Achieved AWS Certified Cloud Practitioner certification, demonstrating comprehensive knowledge of AWS cloud services, architecture, and best practices. Proficient in cloud infrastructure and deployment strategies.",
        icon: <Trophy size={20} />,
        tags: ["AWS", "Cloud", "Certification"],
        align: "right"
    },
    {
        date: "DEC 2025 - JAN 2026",
        title: "F1 Race Prediction with Feedback Loop",
        desc: "End-to-end fastF1 telemetry pipeline with uncertainty quantification. Monte Carlo dropout for 95% confidence intervals, post-race feedback loop for incremental retraining via experience replay.",
        icon: <Rocket size={20} />,
        tags: ["Forecasting", "Uncertainty", "AutoML"],
        align: "right"
    },
    {
        date: "JAN 2025 - MAY 2025",
        title: "Modeling S&P 500 with Linear Regression",
        desc: "Predictive statistical model on macroeconomic indicators (Treasury yields, oil prices) to detect financial risk patterns. Linear regression analysis using R, hypothesis testing, and regression evaluation.",
        icon: <Code size={20} />,
        tags: ["Statistics", "Finance", "R"],
        align: "left"
    },
    {
        date: "MAY 2025",
        title: "Forage Job Simulations Completed",
        desc: "Completed multiple Forage job simulations including Data Analysis, GenAI Powered Data Analytics, and Quantitative Research. Gained hands-on experience with industry-standard tools and practices across diverse data science domains.",
        icon: <Trophy size={20} />,
        tags: ["Forage", "Data Analysis", "Certification"],
        align: "right"
    },
    {
        date: "SEPT 2024 - JAN 2025",
        title: "3D Mesh Inpainting & Distributed Gaming",
        desc: "Hybrid 3D mesh inpainting system combining NeRF with diffusion models. Built distributed gaming platform using Flask, MongoDB, Docker, and Apache Spark for data science use cases.",
        icon: <Code size={20} />,
        tags: ["3D Vision", "FullStack", "Distributed Systems"],
        align: "right"
    },
    {
        date: "AUG 2024",
        title: "Joined ASU - Master's Program",
        desc: "Started pursuing Master's in Data Science, Analytics and Engineering at Arizona State University. Focused on machine learning, statistical modeling, and data engineering.",
        icon: <GraduationCap size={20} />,
        tags: ["Education", "ASU"],
        align: "left"
    },
    {
        date: "MAY 2024",
        title: "Bachelor's Graduation @ RNS",
        desc: "Completed Bachelor of Engineering in Computer Science from RNS Institute of Technology, VTU Board, Bangalore. Strong foundation in algorithms, systems, and software design.",
        icon: <Trophy size={20} />,
        tags: ["Education", "RNS", "RNSIT"],
        align: "right"
    },
    {
        date: "SEPT 2023 - MAR 2024",
        title: "Automatic Number Plate Detection System",
        desc: "Built end-to-end ANPR system using YOLOv8 for detection, EasyOCR for text extraction, and OpenCV for preprocessing. Real-time license plate recognition from live video streams.",
        icon: <Code size={20} />,
        tags: ["CV", "YOLOv8", "OpenCV"],
        align: "left"
    },
    {
        date: "MAR 2023 - JUNE 2023",
        title: "Catching Ball Game @ Vision Lab",
        desc: "Interactive OpenCV-based game with structured data logging from 100+ users. Improved engagement metrics by 40% and frame rate by 25% through algorithmic and rendering optimizations.",
        icon: <Code size={20} />,
        tags: ["OpenCV", "GameDev", "C"],
        align: "right"
    },
    {
        date: "JAN 2024 - FEB 2024",
        title: "Freelance Web Developer @ AKT Web",
        desc: "Revamped legacy retail frontend with React.js achieving 35% increase in engagement and 40% reduction in page load time with lazy loading optimization. Resolved 80% of issues within 24 hours.",
        icon: <Briefcase size={20} />,
        tags: ["React", "Frontend", "Performance"],
        align: "left"
    },
    {
        date: "SEPT 2022 - DEC 2022",
        title: "Railway Reservation System",
        desc: "Full-stack booking system with React, PHP, MySQL. Implemented secure admin/user authentication with role-based access, ticket management, and normalized database design for real-time seat tracking.",
        icon: <Code size={20} />,
        tags: ["FullStack", "React", "MySQL"],
        align: "right"
    },
    {
        date: "SEPT 2020",
        title: "Started Engineering @ RNS Institute",
        desc: "Began B.E. in Computer Science at RNS Institute of Technology, Bangalore. Foundation in algorithms, programming, and software engineering principles.",
        icon: <GraduationCap size={20} />,
        tags: ["Education", "RNS", "RNSIT"],
        align: "left"
    },
    {
        date: "ONGOING",
        title: "Competitive Programming & Open Source",
        desc: "Active on LeetCode solving advanced DSA problems and contributing to open source projects. Leveraging skills in system design, algorithms, and real-world engineering challenges.",
        icon: <Star size={20} />,
        tags: ["LeetCode", "DSA", "OpenSource"],
        align: "right"
    },
    {
        date: "CERTIFICATIONS",
        title: "EC-Council",
        desc: "Ethical Hacking Essential (EC-Council), Certified Network Defender (EC-Council), Computer Hacking Forensic Investigator (EC-Council). Comprehensive cybersecurity certifications covering ethical hacking, network defense, and digital forensics.",
        icon: <Trophy size={20} />,
        tags: ["EC-Council", "Cybersecurity", "Certification"],
        align: "left"
    }
];

interface TimelineItemProps {
    data: Milestone;
    index: number;
}

function TimelineItem({ data, index }: TimelineItemProps) {
    const isLeft = index % 2 === 0;

    return (
        <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-0 w-full relative ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} ${index > 0 ? 'md:-mt-24' : ''}`}>

            {/* Content Card - Responsive padding */}
            <div className={`w-full md:w-1/2 flex ${isLeft ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}>
                <div className="bg-zinc-900/40 border border-dashed border-zinc-800 p-4 sm:p-5 md:p-6 rounded-xl hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 w-full max-w-sm group relative">

                    {/* Connector Line (Mobile hidden, Desktop only) */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 border-t border-dashed border-zinc-700 ${isLeft ? '-right-12' : '-left-12'}`}></div>

                    <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-zinc-500 text-xs px-2 py-1 bg-zinc-950 rounded border border-zinc-800 whitespace-nowrap">
                            {data.date}
                        </span>
                        <div className="p-1.5 bg-zinc-950 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-blue-400 transition-colors flex-shrink-0">
                            {data.icon}
                        </div>
                    </div>
                    <h3 className="font-doto text-base sm:text-lg text-zinc-100 mb-2">{data.title}</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4">
                        {data.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag: string) => (
                            <span key={tag} className="text-[9px] sm:text-[10px] font-mono text-zinc-600 bg-zinc-950/50 px-1.5 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Node */}
            <div className="absolute left-3 sm:left-4 md:left-1/2 md:-translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-zinc-950 border border-dashed border-zinc-700 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-600 rounded-full"></div>
            </div>

            {/* Empty space for the other side */}
            <div className="hidden md:block w-1/2"></div>

            {/* Mobile Vertical Line Fix (hidden on desktop) */}
            <div className="absolute left-8 top-8 bottom-0 w-px border-l border-dashed border-zinc-800 md:hidden -z-10"></div>
        </div>
    );
};

export default function Timeline() {
    return (
        <div className="flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="reveal flex flex-col gap-2">
                <h1 className="font-doto text-4xl font-bold tracking-tight text-zinc-100 uppercase">
                    LEARNING LOG
                </h1>
                <p className="text-zinc-500 font-mono text-sm max-w-md">
                    A chronological log of my journey, milestones, and the dots I've connected along the way.
                </p>
            </div>

            <PatternDivider />

            <div className="relative flex flex-col gap-4 pb-12">
                {/* Center Vertical Line (Desktop) */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-zinc-800 -translate-x-1/2 md:-translate-x-px"></div>

                {milestones.map((item: Milestone, index: number) => (
                    <div key={`${item.date}-${item.title}`} className="reveal">
                        <TimelineItem data={item} index={index} />
                    </div>
                ))}
            </div>

            <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                // The journey is just getting started
            </div>
        </div>
    );
}
