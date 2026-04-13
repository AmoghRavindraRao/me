import { PatternDivider } from '~components/SharedLayout';

// Skills data organized by category
const skillCategories = [
    {
        title: "CORE LANGUAGES",
        skills: [
            { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
            { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
            { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
        ]
    },
    {
        title: "FRONTEND STACK",
        skills: [
            { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
            { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        ]
    },
    {
        title: "BACKEND STACK",
        skills: [
            { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
            { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
        ]
    },
    {
        title: "DATABASE & ACCESS",
        skills: [
            { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        ]
    },
    {
        title: "INFRA & TOOLS",
        skills: [
            { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
            { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
            { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
            { name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
        ]
    },
    {
        title: "ML & AI",
        skills: [
            { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
            { name: "scikit-learn", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sklearn/sklearn-original.svg" },
            { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
            { name: "YOLOv8", icon: "https://via.placeholder.com/48?text=YOLO" },
            { name: "EasyOCR", icon: "https://via.placeholder.com/48?text=OCR" },
            { name: "NeRF", icon: "https://via.placeholder.com/48?text=NeRF" },
        ]
    },
    {
        title: "DATA & ANALYTICS",
        skills: [
            { name: "Apache Spark", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg" },
            { name: "Power BI", icon: "https://via.placeholder.com/48?text=PowerBI" },
            { name: "Pandas", icon: "https://via.placeholder.com/48?text=Pandas" },
            { name: "NumPy", icon: "https://via.placeholder.com/48?text=NumPy" },
            { name: "Jupyter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
        ]
    },
    {
        title: "PRODUCTIVITY",
        skills: [
            { name: "Google Workspace", icon: "https://via.placeholder.com/48?text=Google" },
            { name: "Microsoft Office", icon: "https://via.placeholder.com/48?text=Office" },
            { name: "Slack", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
            { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            { name: "Canva", icon: "https://via.placeholder.com/48?text=Canva" },
        ]
    }
];

export default function Skill() {
    return (
        <div className="relative z-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:gap-4 pt-2 sm:pt-3 md:pt-4 pb-4 sm:pb-6 md:pb-8 space-y-4">
                <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">
                    Skills & Technologies
                </h1>
                <p className="text-black font-mono text-xs sm:text-sm leading-relaxed border-dashed border-l border-zinc-300 pl-3 sm:pl-4 py-2 sm:py-3 max-w-2xl">
                    A comprehensive list of technologies, tools, and frameworks I use to build scalable software solutions.
                </p>
            </div>

            {/* Categories */}
            {skillCategories.map((category) => (
                <div key={category.title}>
                    <PatternDivider />
                    <section className="reveal flex flex-col gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 md:py-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-1.5 bg-zinc-600"></div>
                            <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-300">
                                {category.title}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                            {category.skills.map((skill: { name: string; icon: string }) => (
                                <SkillCard key={skill.name} name={skill.name} icon={skill.icon} />
                            ))}
                        </div>
                    </section>
                </div>
            ))}
            <PatternDivider />
        </div>
    );
}

interface SkillCardProps {
    name: string;
    icon: string;
}

function SkillCard({ name, icon }: SkillCardProps) {
    return (
        <div className="group relative flex flex-col items-center justify-center p-1.5 sm:p-2 md:p-2 border border-zinc-900 border-dashed bg-black/10 transition-all hover:bg-white/[0.02] hover:border-zinc-800 aspect-square overflow-hidden">
            {/* Corner markers */}
            <div className="absolute top-0 right-0 w-1 h-1 sm:w-1.5 sm:h-1.5 border-t border-r border-zinc-600 opacity-50 group-hover:opacity-100 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-1 h-1 sm:w-1.5 sm:h-1.5 border-b border-l border-zinc-600 opacity-50 group-hover:opacity-100 transition-all"></div>

            {/* Decorative dashes - Hidden on mobile */}
            <div className="hidden sm:flex absolute top-1.5 right-1.5 flex-col gap-0.5 opacity-40">
                <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400"></div>
                <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400"></div>
                <div className="w-1.5 h-0.5 bg-zinc-800"></div>
            </div>

            {/* Icon */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-all duration-300 filter grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100">
                <img src={icon} alt={name} className="w-full h-full" />
            </div>

            {/* Label */}
            <div className="relative z-10 flex flex-col items-center gap-0.5 px-1">
                <span className="font-mono text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.05em] sm:tracking-[0.1em] text-zinc-400 group-hover:text-white transition-colors font-semibold text-center leading-tight line-clamp-2">
                    {name}
                </span>
            </div>

            {/* Grid pattern overlay - Smaller on mobile */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:8px_8px] sm:[background-size:12px_12px] pointer-events-none"></div>
        </div>
    );
}
