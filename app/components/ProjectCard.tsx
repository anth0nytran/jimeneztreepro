'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface ProjectCardProps {
    title: string;
    location: string;
    beforeImage: string;
    afterImage: string;
    alt: string;
    accentColor: string;
    actionColor: string;
}

export function ProjectCard({
    title,
    location,
    beforeImage,
    afterImage,
    alt,
    accentColor,
    actionColor,
}: ProjectCardProps) {
    const [showAfter, setShowAfter] = useState(true);

    return (
        <div className="snap-center shrink-0 w-[85vw] md:w-auto flex flex-col group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
            {/* Image Container */}
            <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                {/* Before Image - Always present, essentially the "background" */}
                <div className="absolute inset-0">
                    <NextImage
                        src={beforeImage}
                        alt={`Before - ${alt}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* After Image - Layered on top, toggles opacity */}
                <div
                    className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                    style={{ opacity: showAfter ? 1 : 0 }}
                >
                    <NextImage
                        src={afterImage}
                        alt={`After - ${alt}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Toggle Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowAfter(!showAfter);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: showAfter ? 'white' : actionColor,
                            color: showAfter ? 'black' : 'white',
                        }}
                    >
                        <ArrowLeftRight className="w-3 h-3" />
                        {showAfter ? 'View Before' : 'View After'}
                    </button>
                </div>

                {/* State Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <span
                        className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-colors duration-300"
                        style={{ backgroundColor: showAfter ? accentColor : '#64748b' }}
                    >
                        {showAfter ? 'After Results' : 'Before Work'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
                <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-blue-900 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {location}
                        </span>
                    </div>
                </div>

                {/* Minimal indicator */}
                <div className="mt-4 h-1 w-8 rounded-full" style={{ backgroundColor: actionColor, opacity: 0.3 }} />
            </div>
        </div>
    );
}
