import { SectionTitle, PatternDivider } from '~components/SharedLayout';
import { Code, Terminal, Monitor, Cpu, Database, Cloud, Layout, Box } from 'lucide-react';

interface ToolItemProps {
    name: string;
    description: string;
    icon: React.ReactNode;
    tag?: string;
}

function ToolItem({ name, description, icon, tag }: ToolItemProps) {
    return (
        <div className="group relative border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4 md:p-5 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300">
            <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-100 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {icon}
                </div>
                {tag && (
                    <span className="text-[9px] sm:text-[10px] font-mono border border-zinc-800 bg-zinc-950/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-zinc-500 uppercase whitespace-nowrap">
                        {tag}
                    </span>
                )}
            </div>
            <h3 className="font-doto text-base sm:text-lg text-zinc-100 mb-1 line-clamp-2">{name}</h3>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}

export default function Toolbox() {
    return (
        <div className="flex flex-col animate-in fade-in duration-500">
            {/* Header - Responsive Typography */}
            <div className="reveal flex flex-col gap-2 pt-2 sm:pt-4 px-0">
                <h1 className="font-doto text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 uppercase">
                    MY TOOLBOX
                </h1>
                <p className="text-zinc-500 font-mono text-xs sm:text-sm max-w-md">
                    The software and hardware that powers my daily workflow.
                    &ldquo;Use what you know, but know what you use.&rdquo;
                </p>
            </div>

            <PatternDivider />

            {/* Software & SaaS */}
            <section className="reveal flex flex-col gap-4 sm:gap-6">
                <SectionTitle title="SOFTWARE & SAAS" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <ToolItem
                        name="VS Code"
                        description="Lightweight, powerful editor for web development. Extensions ecosystem makes it my go-to for most coding tasks."
                        icon={<Code size={24} />}
                        tag="Editor"
                    />
                    <ToolItem
                        name="Git"
                        description="Version control system for tracking code changes and collaborating on projects. Essential for any developer workflow."
                        icon={<Terminal size={24} />}
                        tag="VCS"
                    />
                    <ToolItem
                        name="Docker"
                        description="Containerization platform for ensuring consistency across environments. Standardizes deployments from dev to production."
                        icon={<Box size={24} />}
                        tag="DevOps"
                    />
                    <ToolItem
                        name="Google Cloud Platform"
                        description="Cloud services for compute, storage, and ML workloads. Integrates seamlessly with my data science pipeline."
                        icon={<Cloud size={24} />}
                        tag="Cloud"
                    />
                    <ToolItem
                        name="Google Workspace"
                        description="Productivity suite for collaboration. Gmail, Drive, Docs, and Sheets power my daily communication and organization."
                        icon={<Layout size={24} />}
                        tag="Productivity"
                    />
                    <ToolItem
                        name="Microsoft Office Suite"
                        description="Professional office applications for advanced document creation, spreadsheets, and presentations."
                        icon={<Code size={24} />}
                        tag="Productivity"
                    />
                    <ToolItem
                        name="Slack"
                        description="Team communication and collaboration platform. Keeps conversations organized and discussions searchable."
                        icon={<Terminal size={24} />}
                        tag="Communication"
                    />
                    <ToolItem
                        name="Zoom"
                        description="Video conferencing tool for remote meetings, presentations, and team synchronization."
                        icon={<Monitor size={24} />}
                        tag="Communication"
                    />
                    <ToolItem
                        name="Canva"
                        description="Design tool for creating visual content. Simplifies graphic design without requiring specialized design skills."
                        icon={<Layout size={24} />}
                        tag="Design"
                    />
                </div>
            </section>

            <PatternDivider />

            {/* Tech Stack */}
            <section className="reveal flex flex-col gap-4 sm:gap-6">
                <SectionTitle title="TECH STACK" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <ToolItem
                        name="Languages"
                        description="Python, Java, C, C++, JavaScript, SQL, HTML/CSS, R - Versatile programming across multiple paradigms."
                        icon={<Code size={24} />}
                        tag="Programming"
                    />
                    <ToolItem
                        name="Frontend Frameworks"
                        description="React and Material-UI for building interactive, responsive user interfaces with component-based architecture."
                        icon={<Layout size={24} />}
                        tag="Frontend"
                    />
                    <ToolItem
                        name="Backend Frameworks"
                        description="Node.js with Express, Flask, and FastAPI for building scalable REST APIs and web services."
                        icon={<Cpu size={24} />}
                        tag="Backend"
                    />
                    <ToolItem
                        name="Databases"
                        description="PostgreSQL for relational data, MongoDB for NoSQL, MySQL for traditional databases. Optimized for different use cases."
                        icon={<Database size={24} />}
                        tag="Database"
                    />
                    <ToolItem
                        name="Machine Learning"
                        description="PyTorch, scikit-learn for modeling. YOLOv8, EasyOCR, OpenCV for computer vision. NeRF and Monte Carlo Dropout for advanced techniques."
                        icon={<Cpu size={24} />}
                        tag="ML/AI"
                    />
                    <ToolItem
                        name="Data & Analytics"
                        description="Apache Spark for distributed processing, Power BI for visualization. Transform raw data into actionable insights."
                        icon={<Database size={24} />}
                        tag="Data"
                    />
                </div>
            </section>

            <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                // More tools added as I learn them
            </div>
        </div>
    );
}
