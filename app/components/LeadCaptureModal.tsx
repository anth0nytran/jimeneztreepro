'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Mock hooks since lib/analytics is missing
const useFormTracker = (_a: string, _b: string) => ({
    trackFormStart: () => { },
    trackFormSubmit: () => { }
});
const useDemoTracker = () => ({
    trackLeadCaptured: () => { }
});

interface LeadCaptureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accent: string;
    businessName: string;
    serviceLabel: string;
    ctaLabel: string;
}

export function LeadCaptureModal({
    open,
    onOpenChange,
    accent,
    businessName,
    serviceLabel,
    ctaLabel,
}: LeadCaptureModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const { trackFormStart, trackFormSubmit } = useFormTracker('lead_capture', 'demo');
    const { trackLeadCaptured } = useDemoTracker();
    const closeModal = () => {
        setSubmitted(false);
        onOpenChange(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        trackFormSubmit();
        trackLeadCaptured();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                        className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header - Fixed to top of modal */}
                        <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-white shrink-0">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{ctaLabel}</h2>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Requesting {serviceLabel} with {businessName}</p>
                            </div>
                            <button onClick={closeModal} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {submitted ? (
                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Request Received!</h3>
                                    <p className="mt-2 text-sm text-slate-600 max-w-[250px] mx-auto leading-relaxed">
                                        Thanks for reaching out. One of our specialists will be in touch shortly to confirm details.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-6 w-full rounded-lg py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form className="grid gap-5" onSubmit={handleSubmit}>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            onFocus={trackFormStart}
                                            className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
                                            placeholder="Alex Carter"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
                                            placeholder="alex@email.com"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
                                            placeholder="(713) 555-0176"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Project Details</label>
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none resize-none transition-all"
                                            placeholder="I'm interested in..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 p-3 text-[10px] font-medium text-blue-600/70 border border-blue-100/50">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Your information is secure and never shared.</span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-2 w-full rounded-lg py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        style={{ backgroundColor: accent }}
                                    >
                                        Get Free Quote
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
