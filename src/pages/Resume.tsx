import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import { PatternDivider, SectionTitle } from '~components/SharedLayout';

const RESUME_PDF = '/resume-data-analyst.pdf';
const RESUME_DOWNLOAD_NAME = 'Amogh_Ravindra_Rao_Resume_Data_Analyst.pdf';
const RESUME_PREVIEW_PAGES = ['/resume-preview-page-1.png'];

export default function Resume() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SectionTitle title="RESUME" />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-zinc-300 bg-white/70 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black transition-colors hover:border-zinc-500 hover:bg-white"
                    >
                        <ArrowLeft size={14} />
                        Home
                    </Link>
                    <a
                        href={RESUME_PDF}
                        download={RESUME_DOWNLOAD_NAME}
                        className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-zinc-800 bg-black px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800"
                    >
                        <Download size={14} />
                        Download Resume
                    </a>
                </div>
            </div>

            <div className="rounded-lg border border-dashed border-zinc-300 bg-white/55 p-3 shadow-sm shadow-black/5 backdrop-blur-sm sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-zinc-300 pb-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">
                        <FileText size={14} />
                        Amogh Ravindra Rao
                    </span>
                    <a
                        href={RESUME_PDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 transition-colors hover:text-black"
                    >
                        Open PDF
                        <ExternalLink size={12} />
                    </a>
                </div>

                <div className="flex flex-col items-center gap-4 rounded border border-dashed border-zinc-300 bg-zinc-100 p-2 sm:p-4">
                    {RESUME_PREVIEW_PAGES.map((pageSrc, index) => (
                        <img
                            key={pageSrc}
                            src={pageSrc}
                            alt={`Resume page ${index + 1}`}
                            className="w-full max-w-4xl rounded-sm border border-zinc-200 bg-white shadow-sm shadow-black/10"
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    ))}
                </div>
            </div>

            <a
                href={RESUME_PDF}
                download={RESUME_DOWNLOAD_NAME}
                className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-zinc-800 bg-black px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800"
            >
                <Download size={15} />
                Download a Copy
            </a>

            <PatternDivider />
        </div>
    );
}
