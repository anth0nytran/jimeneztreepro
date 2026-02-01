'use client';

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, Star, Menu, X, Award, Clock, Check, ClipboardList, Hammer, ArrowRight } from 'lucide-react';

import { ComparisonSlider } from './components/ComparisonSlider';
import { ImagePlaceholder } from './components/ImagePlaceholder';

// Inline configuration for standalone usage
const config = {
  businessName: '3D Fence & Welding',
  city: 'Houston, TX',
  phone: '(281) 748-1111',
  primaryService: 'Fence Installation & Custom Gates',
  services: ['Automatic Driveway Gates', 'Electric Gate Openers', 'Commercial & Residential Welding', 'Fence Repair & Maintenance'],
  rating: 5.0,
  reviewCount: 48,
  yearsInBusiness: 15,
  ctaPrimary: 'Get a Free Estimate',

  // Theme: Clean Modern
  theme: {
    isDark: false,
    colors: {
      pageBg: '#f4f6f8',
      cardBg: '#ffffff',
      surfaceBg: '#edf1f5',
      textPrimary: '#1c232d',
      textSecondary: '#4b5a6b',
      textMuted: '#8a98a8',
      border: '#dde4ec',
      borderLight: '#eef2f6',
      darkBg: '#121821',
      darkText: '#f8fafc',
      darkTextMuted: '#9aa7b5',
    }
  },

  // Accent: Amber
  accent: {
    name: 'Amber',
    hex: '#f59e0b',
    hoverHex: '#d97706'
  },

  imagePlaceholders: [
    { label: 'Before Photo', hint: 'Old fence or empty lot' },
    { label: 'After Photo', hint: 'New cedar or iron install' },
    { label: 'Crew Photo', hint: 'Fabrication or install team' },
  ],

  testimonials: [
    {
      quote: 'I had an excellent experience with David. His team was professional from start to finish, providing a clear estimate, answering all my questions, and completing the project on schedule. The workmanship is top-notch, and the finished fence looks outstanding. I appreciate their attention to detail and the pride they take in their work. I would gladly recommend them to anyone in need of a quality fence.',
      name: 'Gustavo Dominguez',
      highlight: 'Workmanship is top-notch, and the finished fence looks outstanding.',
    },
    {
      quote: 'They do great work and on time. David the owner walked us through the whole process and the project came out great. Highly recommended',
      name: 'Mike Ta',
      highlight: 'They do great work and on time. Highly recommended.',
    },
    {
      quote: 'David and crew were very pleasant to work with. He gave me a very fair quote and worked all day until he finished the job, which was just too difficult for me to handle. I will be calling him again for more jobs.',
      name: 'Jim',
      highlight: 'Gave me a very fair quote and worked all day until he finished the job.',
    },
    {
      quote: 'I contacted 3D Fence & Welding for a basic fence estimate, and during our conversation I learned they also offered welding services. I asked if they could create doggie windows for my pittie. David and crew went above and beyond, transforming a simple project into a beautifully crafted cedar wood fence with high-quality welded dog windows. The workmanship is excellent, and the customer service stood out most of all. David truly listened to my vision and brought it to life. Highly recommend and my pittie is happy too 🙂',
      name: 'Samantha Rodriguez',
      highlight: 'Beautifully crafted cedar wood fence with high-quality welded dog windows.',
    },
    {
      quote: 'Great and quality work. When we called back for addressing issue, David came and fix them.',
      name: 'Astra Code',
      highlight: 'Great and quality work.',
    },
    {
      quote: 'very good communication and does good work.',
      name: 'Rene Ortiz',
      highlight: 'Very good communication and does good work.',
    },
  ],

  faqs: [
    {
      q: 'How much does a new fence cost? Do you provide free estimates?',
      a: 'We provide 100% free, detailed written estimates. Pricing depends on materials and footage, but we offer widespread options from budget-friendly pine to premium cedar and iron.',
    },
    {
      q: 'Do you service my neighborhood in Houston?',
      a: 'We serve all of Houston and surrounding areas including Katy, The Woodlands, Sugar Land, and Cypress for both residential and commercial projects.',
    },
    {
      q: 'Can you add an automatic opener to my existing driveway gate?',
      a: 'Yes, we specialize in retrofitting existing gates with LiftMaster operators and solar-powered access systems, as long as the gate structure is sound.',
    },
    {
      q: 'What is better for privacy: Cedar wood or Wrought Iron?',
      a: 'For privacy, Cedar is superior as it creates a solid visual barrier. Wrought iron is best for security and curb appeal without blocking the view.',
    },
    {
      q: 'How fast can you get the job done?',
      a: 'Most residential projects are completed in 1-3 days depending on linear footage and complexity. We provide a specific timeline with every estimate.',
    },
    {
      q: 'Do you handle the HOA paperwork and City Permits for me?',
      a: 'Yes. We provide all necessary specs, drawings, and photos for your HOA application. We also handle city permitting for projects that require it.',
    },
    {
      q: 'My fence is leaning—do you do repairs or just new installs?',
      a: 'We offer comprehensive repair services including storm damage fixes, gate adjustments, post replacement, and rot board repair for wood, iron, and chain link fences.',
    },
  ],
};

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const fadeInSoft = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const staggerSoft = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function ThreeDFencing() {
  const accent = config.accent.hex;
  const t = config.theme.colors;
  const isDark = config.theme.isDark;
  const cleanPhone = useMemo(() => config.phone.replace(/\D/g, ''), []);
  const services = config.services;
  const ratingText = config.rating ? config.rating.toFixed(1) : '5.0';
  const reviewCount = config.reviewCount ?? 50;
  const years = config.yearsInBusiness ?? 15;
  const shellClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:max-w-[1400px] 2xl:px-16';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  // Smooth scroll to the quote form in the hero section
  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote-form');
    if (quoteSection) {
      const yOffset = -100; // Offset to account for sticky header if needed, or just breathing room
      const y = quoteSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setFormStatus('sending');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const honeypot = String(formData.get('website') || '').trim();

    if (honeypot) {
      form.reset();
      setFormStatus('success');
      return;
    }

    if (!name || !phone || !email || !service) {
      setFormStatus('error');
      setFormError('Please provide your name, phone, email, and service needed.');
      return;
    }

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        setFormStatus('error');
        setFormError(payload?.error || 'Something went wrong. Please try again.');
        return;
      }

      form.reset();
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
      setFormError('Something went wrong. Please try again.');
    }
  };

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Our Work', href: '#work' },
    { label: 'Reviews', href: '#proof' },
    { label: 'FAQ', href: '#faq' },
  ];

  const benefits = [
    'Fast response + quick scheduling',
    'Clear, written estimates',
    '15+ years hands-on experience',
    'Fully insured for your peace of mind',
  ];
  const recentJobs = [
    { title: 'Cedar Privacy Fence', meta: 'Houston  -  2 days', result: '300ft with rot board for maximum durability', image: '/images/project-cedar.png', alt: 'New cedar privacy fence installation in Houston' },
    { title: 'Custom Wrought Iron Gate', meta: 'Katy  -  1 week', result: 'Custom fabricated & professionally installed', image: '/images/project-gate-2.png', alt: 'Custom wrought iron driveway gate in Katy' },
    { title: 'LiftMaster Operator Install', meta: 'The Woodlands  -  4 hours', result: 'Solar powered automatic gate system', image: '/images/project-liftmaster.png', alt: 'LiftMaster automatic gate opener installation in The Woodlands' },
  ];

  const allServices = [
    {
      name: config.primaryService,
      image: '/images/service-fence.png',
      desc: 'Expert installation of cedar, chain link, and iron fencing for Houston homes and businesses. We build durable, secure, and beautiful boundaries.',
      alt: 'Professional fence installation services'
    },
    {
      name: config.services[0],
      image: '/images/service-gate.png',
      desc: 'Custom-built driveway gates designed for security and curb appeal. Available in wrought iron, wood, and modern metal styles.',
      alt: 'Custom driveway gate fabrication'
    },
    {
      name: config.services[1],
      image: '/images/service-access.png',
      desc: 'Professional installation of LiftMaster electric gate openers and smart access control systems for seamless entry.',
      alt: 'Automatic gate opener installation'
    },
    {
      name: config.services[2],
      image: '/images/comm.JPG',
      desc: 'Mobile welding and shop fabrication for custom gates, railings, and structural repairs. High-quality craftsmanship on every weld.',
      alt: 'Professional welding and fabrication services'
    },
    {
      name: config.services[3],
      image: '/images/fence_repair.JPG',
      desc: 'Fast, reliable repair services for leaning fences, broken gates, and malfunctioning openers to keep your property secure.',
      alt: 'Fence and gate repair services'
    },
  ];

  const steps = [
    { title: 'Request a Quote', body: 'Call, text, or use our form. We respond fast to schedule a time.' },
    { title: 'Walkthrough & Estimate', body: 'We measure, discuss options, and give you a clear price.' },
    { title: 'Installation', body: 'We schedule quickly and get the job done right with quality craftsmanship.' },
  ];

  const reviewCardBg = isDark ? t.cardBg : 'rgba(255,255,255,0.95)';
  const reviewCardBorder = isDark ? t.border : 'rgba(255,255,255,0.3)';
  const promiseBg = isDark ? t.surfaceBg : t.cardBg;
  const promiseDivider = isDark ? t.borderLight : t.border;

  return (
    <div className="relative" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER - Transparent over hero, solid on scroll
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? `${t.cardBg}f8` : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${t.border}` : 'none',
        }}
      >
        <div className={`${shellClass} flex items-center justify-between py-2`}>
          <a href="#" className="flex items-center">
            <img src="/images/reallogo.svg" alt={config.businessName} className="h-20 w-auto object-contain -my-3 -mr-10 translate-y-2" />
            <div>
              <span className="text-lg font-bold uppercase tracking-tight" style={{ color: scrolled ? t.textPrimary : 'white' }}>{config.businessName}</span>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: scrolled ? t.textMuted : 'rgba(255,255,255,0.7)' }}>Open 24 Hours</div>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-semibold transition-colors" style={{ color: scrolled ? t.textSecondary : 'rgba(255,255,255,0.85)' }}>{link.label}</a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a href={`tel:${cleanPhone}`} className="flex items-center gap-2 text-sm font-bold" style={{ color: scrolled ? t.textPrimary : 'white' }}><Phone className="h-4 w-4" />{config.phone}</a>
            <button onClick={scrollToQuote} className="px-5 py-2.5 text-sm font-bold text-white rounded" style={{ backgroundColor: accent }}>{config.ctaPrimary}</button>
          </div>

          <button className="md:hidden" style={{ color: scrolled ? t.textPrimary : 'white' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t px-6 py-4" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
              <div className="flex flex-col gap-3">
                {navLinks.map(l => <a key={l.href} href={l.href} className="py-2 font-semibold" style={{ color: t.textPrimary }} onClick={() => setMobileMenuOpen(false)}>{l.label}</a>)}
                <button onClick={() => { scrollToQuote(); setMobileMenuOpen(false); }} className="mt-2 py-3 text-white font-bold rounded" style={{ backgroundColor: accent }}>{config.ctaPrimary}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO - Full Background with Quote Form
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] overflow-hidden -mt-[72px] pt-[72px]">
        {/* Changed background to something more fence/construction related or generic structure */}
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/hero-bg.png)', backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.75) 100%)' }} />

        <div className={`${shellClass} relative z-10 py-20 lg:py-28`}>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Top Rated Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2" style={{ backgroundColor: accent }}>
                <div className="flex">{[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-4 w-4 fill-white text-white" />)}</div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">Top Rated in {config.city}</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl uppercase">
                  {config.businessName}
                </h1>
                <p className="text-xl font-bold uppercase tracking-wider" style={{ color: accent }}>
                  Professional Fence Installation & Custom Gate Fabrication
                </p>
                <p className="text-lg leading-relaxed text-slate-300 max-w-lg">
                  Fast response. Quick scheduling. High-quality craftsmanship.<br />
                  {years}+ years experience. Fully insured.
                </p>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div><div className="text-4xl font-black text-white">24/7</div><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability</div></div>
                <div><div className="text-4xl font-black" style={{ color: accent }}>{ratingText}</div><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Star Rating</div></div>
                <div><div className="text-4xl font-black text-white">{years}+</div><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Years Exp</div></div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><ShieldCheck className="h-5 w-5" style={{ color: accent }} />Licensed & Insured</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Award className="h-5 w-5" style={{ color: accent }} />Quality Craftsmanship</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Clock className="h-5 w-5" style={{ color: accent }} />Fast Response</div>
              </div>
            </motion.div>

            {/* Quote Form */}
            <motion.div id="quote-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl p-8 shadow-xl bg-white border-t-4" style={{ borderColor: accent }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900">Get Your Free Estimate</h2>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mb-6 font-medium">No obligation. 100% Secure.</p>
              <form className="space-y-4" action="/api/lead" method="POST" onSubmit={handleLeadSubmit}>
                <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="hidden" name="page" value={pageUrl} />
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label><input required name="name" type="text" placeholder="Your Name" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900" /></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label><input required name="phone" type="tel" placeholder="(281) 555-0123" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900" /></div>
                </div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label><input required name="email" type="email" placeholder="you@email.com" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900" /></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Service Needed *</label><select required name="service" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm bg-white text-slate-900"><option value="">Select a service...</option>{[config.primaryService, ...services].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Project Details</label><textarea name="message" rows={3} placeholder="Describe your project (e.g. 50ft cedar fence)..." className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 resize-none" /></div>
                <button type="submit" disabled={formStatus === 'sending'} className="w-full rounded-lg py-4 text-base font-bold text-white shadow-lg disabled:opacity-70" style={{ backgroundColor: accent }}>
                  {formStatus === 'sending' ? 'Sending...' : 'Request Free Estimate'}
                </button>
                {formStatus === 'success' && (
                  <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    Thanks! We received your request and will reach out shortly.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {formError || 'Something went wrong. Please try again.'}
                  </div>
                )}
              </form>
              <div className="mt-6 flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                <div className="flex">{[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <span className="text-sm font-bold text-slate-900">{ratingText}</span><span className="text-slate-300">|</span><span className="text-sm font-medium text-slate-500">{reviewCount}+ Jobs Done</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling Reviews Ticker - Liquid Glass Effect */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-lg py-3 overflow-hidden border-t border-white/20 shadow-lg z-20" style={{ backgroundColor: `${accent}40` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" /> {/* Gloss sheen */}
          <div className="flex animate-marquee whitespace-nowrap relative z-10">
            {config.testimonials.concat(config.testimonials).map((review, i) => (
              <div key={i} className="mx-8 flex items-center gap-3">
                <div className="flex">{[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-3 w-3 fill-yellow-400 text-yellow-400 drop-shadow-sm" />)}</div>
                <span className="text-sm font-medium text-white drop-shadow-md">"{review.highlight || review.quote}"</span>
                <span className="text-sm text-white/90 font-medium drop-shadow-md">- {review.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 30s linear infinite; }` }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          ORIGINAL SECTIONS BELOW (Stats, Why Us, Services, etc.)
      ═══════════════════════════════════════════════════════════════════════ */}

      {/* Services - Clean card list */}
      <section id="services" className="py-20 scroll-mt-20" style={{ backgroundColor: t.surfaceBg, borderTop: `1px solid ${t.border}` }}>
        <div className={shellClass}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-8" style={{ backgroundColor: accent }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textMuted }}>Our Capabilities</p>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color: t.textPrimary }}>Professional Fence & Gate Services in {config.city}</h2>
            </div>
            <p className="text-sm font-medium font-mono border-l-2 pl-4 py-1 max-w-sm" style={{ color: t.textSecondary, borderColor: accent }}>
              Full licensed professionals serving {config.city}.<br />Same-week availability for new clients.
            </p>
          </div>
          <motion.div variants={staggerSoft} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allServices.map((service, i) => (
              <motion.div key={service.name} className="group flex flex-col justify-between overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}` }}>
                {/* Service Image Area */}
                <div className="aspect-[16/9] w-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={service.image} alt={service.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

                  {/* Overlay title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-xs font-mono font-bold text-white opacity-80">SERVICE 0{i + 1}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 leading-tight" style={{ color: t.textPrimary }}>{service.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: t.textSecondary }}>{service.desc}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t" style={{ borderColor: t.border }}>
                    <button type="button" className="w-full py-2 text-xs font-black uppercase tracking-widest flex items-center justify-between group-hover:gap-4 transition-all" style={{ color: accent }} onClick={scrollToQuote}>
                      <span>Get Quote</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us - Clean with flow line */}
      <section id="why-us" className="relative scroll-mt-20 overflow-hidden" style={{ borderTop: `4px solid ${accent}`, borderBottom: `4px solid ${accent}` }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/why-us-bg.png)', backgroundAttachment: 'fixed', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.88) 100%)' }} />
        <div className="relative py-16 z-10">
          <div className={shellClass}>
            <div className="grid gap-16 md:grid-cols-2 md:items-start" style={{ alignItems: 'center' }}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border-l-4" style={{ borderColor: accent, backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Why Choose Us</p>
                </div>
                <h2 className="text-3xl font-black text-white md:text-5xl leading-[1.1] uppercase tracking-tight">Direct Answers.<br />Fast Scheduling.<br />No Pressure.</h2>
                <div className="mt-10 space-y-px bg-white/10 border border-white/10">
                  {benefits.map((benefit, i) => (
                    <div key={benefit} className="flex items-center gap-4 p-5 bg-black/40 backdrop-blur-sm group hover:bg-white/5 transition-colors">
                      <div className="flex bg-white/10 h-8 w-8 shrink-0 items-center justify-center font-mono text-sm font-bold text-white/50 group-hover:bg-white group-hover:text-black transition-colors">0{i + 1}</div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide pt-0.5">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Cleaner, Open Layout */}
              <div className="pl-4 border-l-2 md:pl-10" style={{ borderColor: accent }}>
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2">Our Standard</h3>
                  <p className="text-white/60 font-medium">We don't just quote the job. We verify the scope, confirm the schedule, and guarantee the result.</p>
                </div>

                <div className="space-y-8">
                  {[{ label: 'Response Speed', value: 'Fast', desc: 'Quick scheduling' }, { label: 'Estimates', value: 'Always Written', desc: 'Detailed PDF breakdown' }, { label: 'Site Safety', value: '100% Insured', desc: 'Liability & Workers Comp' }].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-end justify-between mb-2 border-b border-white/10 pb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">{item.label}</span>
                        <span className="text-xl font-black font-mono" style={{ color: accent }}>{item.value}</span>
                      </div>
                      <div className="text-right text-xs font-bold text-white/40 uppercase">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded bg-white/5 border border-white/10">
                  <ShieldCheck className="h-5 w-5" style={{ color: accent }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Quality Materials & Craftsmanship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section - Better flow, full width accent */}
      <section className="py-16 text-white" style={{ backgroundColor: accent }}>
        <div className={shellClass}>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 bg-white/20 p-6 rounded-full">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">100% Satisfaction Guarantee</h3>
              <p className="text-lg font-medium text-white/90 max-w-2xl">
                We're committed to quality. If you're not happy with our work, we'll make it right - no questions asked.
                Backed by {years}+ years of service in {config.city}.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button type="button" onClick={scrollToQuote} className="bg-white text-black rounded px-8 py-4 text-sm font-black shadow-xl uppercase tracking-wide hover:scale-105 transition-transform">
                Get Guaranteed Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase - Carousel Style */}
      <section id="work" className="py-16 overflow-hidden" style={{ backgroundColor: t.surfaceBg }}>
        <div className={shellClass}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60" style={{ color: t.textPrimary }}>Our Portfolio</p>
              <h2 className="text-3xl font-black md:text-4xl" style={{ color: t.textPrimary }}>Project Showcase</h2>
            </div>

            <div className="hidden md:flex gap-2">
              <div className="h-1 w-20 rounded-full opacity-20" style={{ backgroundColor: t.textPrimary }} />
              <div className="h-1 w-4 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          </div>

          {/* Snap Scroll Container */}
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-6 snap-x md:grid md:grid-cols-3 md:overflow-visible">
            {/* Hardcoded visual placeholders mixed with data */}
            <div className="snap-center shrink-0 w-[85vw] md:w-auto flex flex-col group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-[4/3] bg-slate-200 relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(/images/project-gate.png)` }} />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wide">Before / After</div>
              </div>
              <div className="p-6 bg-white flex-1 border-t-4" style={{ borderColor: accent }}>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Gate Installation</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Custom Iron Gate</h3>
                <p className="text-sm text-slate-600">Designed, fabricated and installed a custom wrought iron driveway gate with automatic opener.</p>
              </div>
            </div>

            {recentJobs.map((job, i) => (
              <div key={job.title} className="snap-center shrink-0 w-[85vw] md:w-auto flex flex-col group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="aspect-[4/3] relative bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={job.image} alt={job.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-white font-bold text-sm flex items-center gap-2"><Check className="h-4 w-4" style={{ color: accent }} /> Verified Job</span>
                  </div>
                </div>
                <div className="p-6 bg-white flex-1 border-t-0">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{job.meta.split('-')[0]}</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{job.title}</h3>
                  <p className="text-sm text-slate-600">{job.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews - Dark Google Themed Section */}
      <section id="proof" className="relative py-24 overflow-hidden" style={{ borderTop: `4px solid ${accent}`, borderBottom: `4px solid ${accent}` }}>
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/images/reviews-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />

        <div className={`${shellClass} relative z-10`}>
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <GoogleLogo className="h-5 w-5" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-white font-bold ml-1.5 pt-0.5">{ratingText}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Client Reviews</h2>
            <p className="text-slate-400 text-lg max-w-2xl">See what your neighbors in {config.city} are saying about our work.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...config.testimonials, ...config.testimonials].slice(0, 6).map((testimonial, idx) => (
              <div key={`${testimonial.name}-${idx}`} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl shadow-2xl border-t-4 hover:-translate-y-1 transition-transform duration-300 border-x border-b border-white/5 relative group" style={{ borderTopColor: idx % 2 === 0 ? '#4285F4' : '#34A853' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg" style={{ backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][idx % 5] }}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-white/60">Local Guide • {1 + idx} reviews</div>
                    </div>
                  </div>
                  <GoogleLogo className="h-5 w-5 opacity-80" />
                </div>
                <div className="flex gap-1 mb-3 relative z-10">
                  {[0, 1, 2, 3, 4].map(i => (
                    <Star key={i} className="h-4 w-4 drop-shadow-sm text-[#FBBC05] fill-[#FBBC05]" />
                  ))}
                  <span className="text-xs text-white/50 ml-2 mt-0.5 font-medium tracking-wide">{idx === 0 ? 'a week ago' : idx === 1 ? 'a month ago' : '2 months ago'}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed mb-4 font-medium relative z-10">"{testimonial.quote}"</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/10 relative z-10">
                  {['Professionalism', 'Punctuality', 'Quality', 'Value'].slice(0, 2 + (idx % 3)).map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-white/90 uppercase tracking-wide bg-gradient-to-r from-white/10 to-transparent px-2 py-1 rounded border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="https://share.google/ZKEcTBNdQ3BLhJSDe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-lg font-black uppercase tracking-wide hover:scale-105 transition-transform shadow-lg">
              <GoogleLogo className="h-5 w-5" />
              Read all reviews
            </a>
          </div>
        </div>
      </section>

      {/* Process - Industrial Style */}
      <section className="py-20 relative bg-zinc-50 border-b border-zinc-200">
        <div className={shellClass}>
          <div className="mb-16 text-center">
            <div className="inline-block border-b-4 border-zinc-900 pb-2 mb-4">
              <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 md:text-4xl">How We Operate</h2>
            </div>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto">Precision planning. Expert execution. Zero mess left behind.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-zinc-200 z-0" />

            {steps.map((step, index) => {
              const Icon = [ClipboardList, Hammer, Check][index];
              return (
                <div key={step.title} className="relative group">
                  {/* Card */}
                  <div className="relative z-10 bg-white border-4 border-zinc-900 p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                    {/* Number Badge */}
                    <div className="absolute -top-6 -left-4 text-white font-black text-xl h-12 w-12 flex items-center justify-center border-4 border-white shadow-lg" style={{ backgroundColor: accent }}>
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="mb-6 inline-flex items-center justify-center h-16 w-16 bg-white rounded-full border-2 relative" style={{ borderColor: accent }}>
                      <Icon className="h-8 w-8" style={{ color: accent }} />
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-zinc-900 leading-none">{step.title}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{step.body}</p>

                    {/* Arrow for Industrial Feel */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-10 transform -translate-y-1/2 z-20">
                        <ArrowRight className="h-8 w-8 text-zinc-300 -ml-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 scroll-mt-20" style={{ borderTop: `3px solid ${t.border}`, backgroundColor: t.surfaceBg }}>
        <div className={shellClass}>
          <div className="grid gap-10 md:grid-cols-[0.4fr_0.6fr] md:items-start">
            <div className="md:sticky md:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>FAQ</p>
              <h2 className="text-2xl font-bold md:text-3xl" style={{ color: t.textPrimary }}>Quick answers before you book.</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: t.textMuted }}>Still have questions? Call us directly.</p>
              <a href={`tel:${cleanPhone}`} className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]" style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}30` }}><Phone className="h-4 w-4" />{config.phone}</a>
            </div>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <details key={faq.q} className="group rounded-xl transition-all open:shadow-md" style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}` }} open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-semibold transition-colors" style={{ color: t.textPrimary }}>
                    {faq.q}
                    <span className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-open:rotate-45" style={{ backgroundColor: `${accent}15`, color: accent }}><span className="text-base leading-none font-medium">+</span></span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: t.textSecondary }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="home-cta" className="py-16 border-t-3" style={{ borderColor: accent, backgroundColor: accent }}>
        <div className={`${shellClass} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl text-white">Ready to Start?</h2>
            <p className="mt-4 text-xl font-bold text-white">Free estimate - Custom Designs - Durable Results</p>
            <p className="mt-2 text-base font-medium text-white/90">Serving {config.city} and surrounding areas</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-shrink-0">
            <button type="button" className="rounded px-8 py-4 text-base font-black shadow-xl uppercase tracking-wide transition-all hover:scale-105" style={{ backgroundColor: 'white', color: accent }} onClick={scrollToQuote}>{config.ctaPrimary}</button>
            <a href={`tel:${cleanPhone}`} className="inline-flex items-center justify-center gap-2 rounded px-8 py-4 text-base font-black uppercase tracking-wide transition-all hover:bg-white/10" style={{ border: `3px solid white`, color: 'white' }}><Phone className="h-5 w-5" />{config.phone}</a>
          </div>
        </div>
      </section>

      <footer className="py-8 mt-12" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className={`${shellClass} flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left`}>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-bold" style={{ color: t.textPrimary }}>
              <span>{config.businessName}</span>
              <span className="opacity-30">|</span>
              <span>(281) 748-1111</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-lg opacity-60" style={{ color: t.textMuted }}>
              Proudly serving Houston, Katy, The Woodlands, Sugar Land, Cypress, Missouri City, Richmond, and surrounding areas in Texas.
            </p>
          </div>

          <a href="https://quicklaunchweb.us" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-wider" style={{ color: t.textSecondary }}>
            Website by QuickLaunchWeb
          </a>

        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
        <div className="mx-auto flex max-w-md gap-3 rounded p-3 shadow-2xl" style={{ backgroundColor: t.cardBg, border: `3px solid ${accent}` }}>
          <a href={`tel:${cleanPhone}`} className="flex flex-1 items-center justify-center gap-2 rounded px-3 py-3 text-sm font-black uppercase tracking-wide transition-all" style={{ border: `2px solid ${t.border}`, color: t.textPrimary }}><Phone className="h-4 w-4" />Call</a>
          <button type="button" className="flex-1 rounded px-3 py-3 text-sm font-black text-white uppercase tracking-wide shadow-lg transition-all" style={{ backgroundColor: accent }} onClick={scrollToQuote}>Get Quote</button>
        </div>
      </div>

    </div>
  );
}
