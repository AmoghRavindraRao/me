interface SectionTitleProps {
    title: string;
}

export const SectionTitle = ({ title }: SectionTitleProps) => (
    <h3 className="font-mono text-black text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-zinc-400 rounded-sm"></span>
        {title}
    </h3>
);

// Horizontal Pattern Divider - matches bilal.works exactly - Responsive
export const PatternDivider = () => (
    <div className="relative h-6 sm:h-7 md:h-8 my-6 sm:my-7 md:my-8"></div>
);
