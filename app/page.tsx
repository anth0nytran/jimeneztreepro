'use client';

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, Star, Menu, X, Award, Clock, Check, ClipboardList, Hammer, ArrowRight } from 'lucide-react';
import NextImage from 'next/image';

import { ProjectCard } from './components/ProjectCard';

// Inline configuration for standalone usage
const config = {
  businessName: 'Jimenez Tree Pro',
  businessOwner: 'Jimenez Family',
  city: 'Pasadena, TX',
  address: 'Pasadena, TX - Serving the Greater Houston Area',
  phone: '(281) 924-7955',
  primaryService: 'Emergency & Large Tree Removal',
  services: ['Large Tree Trimming & Structural Pruning', 'Storm Damage Cleanup & Debris Hauling', 'Stump Grinding'],
  rating: 5.0,
  reviewCount: 50,
  yearsInBusiness: 25,
  ctaPrimary: 'Request a Quote',

  // Theme: Clean & Bold Tree Service
  theme: {
    isDark: false,
    colors: {
      pageBg: '#ffffff',
      cardBg: '#ffffff',
      surfaceBg: '#f3f4f6', // Gray-100
      textPrimary: '#111827', // Gray-900
      textSecondary: '#4b5563', // Gray-600
      textMuted: '#9ca3af', // Gray-400
      border: '#e5e7eb', // Gray-200
      borderLight: '#f9fafb',
      darkBg: '#1f2937', // Gray-800
      darkText: '#f9fafb',
      darkTextMuted: '#d1d5db',
    }
  },

  // Primary: Bold Orange (Energy, Trust, Warmth)
  accent: {
    name: 'Tree Orange',
    hex: '#ea580c', // Orange-600
    hoverHex: '#c2410c' // Orange-700
  },

  // Action: Artisan Bronze (Quality, warmth, attention)
  action: {
    hex: '#ea580c', // Orange-600 (Darker, richer than safety orange)
    hoverHex: '#c2410c' // Orange-700
  },

  // Secondary Color for headers (Dark Charcoal)
  secondary: {
    hex: '#374151', // Gray-700
  },

  imagePlaceholders: [
    { label: 'Before Photo', hint: 'Overgrown tree or storm damage' },
    { label: 'After Photo', hint: 'Clean removal or trimmed tree' },
    { label: 'Crew Photo', hint: 'Jimenez team onsite' },
  ],

  testimonials: [
    {
      quote: "Jimenez Tree Service did an amazing job trimming my tree. I highly recommend them for their detail and care.",
      name: "Violetta Negrete",
      highlight: "Amazing job trimming my tree",
      reviewCount: 1,
      localGuide: false,
      photos: 1,
    },
    {
      quote: "Jimenez Tree Services are very professional. I was quoted a great price, they were on time, and they did an awesome job. I would definitely hire them again in the future.",
      name: "Joycelyn Rodriguez Sanes",
      highlight: "Quoted a great price",
      reviewCount: 3,
      localGuide: false,
    },
    {
      quote: "They did an amazing job with my tree removal and stump grinding. The crew was on time, professional, and left everything super clean. I also had them trim my other trees and they look great! Highly recommend.",
      name: "Isury Watson",
      highlight: "Left everything super clean",
      reviewCount: 1,
      localGuide: false,
    },
    {
      quote: "Jimenez's services really did an extraordinary job for me. I can sincerely recommend them for their excellent work and professionalism.",
      name: "Patricia Rodriguez",
      highlight: "Extraordinary job",
      reviewCount: 1,
      localGuide: false,
    },
    {
      quote: "Jimenez Tree Service takes care of all our properties. Highly recommend their consistent quality.",
      name: "Christopher Celona",
      highlight: "High recommend",
      reviewCount: 2,
      localGuide: false,
    },
    {
      quote: "I'm so impressed with Jimenez Tree Service. I highly recommend them to anyone needing reliable tree work.",
      name: "Jimenez Electrical",
      highlight: "Impressed with Jimenez Tree Service",
      reviewCount: 2,
      localGuide: false,
    },
  ],

  faqs: [
    {
      q: 'Do you offer free estimates?',
      a: 'Yes! We provide 100% free estimates for all tree services including removal, trimming, stump grinding, and storm cleanup.',
    },
    {
      q: 'What areas do you serve?',
      a: 'Our main hub is Pasadena, and we serve homeowners across the Greater Houston area including Pearland, Friendswood, League City, Clear Lake, Deer Park, La Porte, Baytown, and Houston.',
    },
    {
      q: 'Are you insured?',
      a: 'Absolutely. Jimenez Tree Pro is fully insured for your protection and ours. Safety is our top priority on every job.',
    },
    {
      q: 'How long does a tree removal take?',
      a: 'Most residential tree removals are completed in one day. Larger or more complex jobs may take 2-3 days. We always provide a timeline upfront.',
    },
    {
      q: 'Do you grind stumps after removal?',
      a: 'Yes! We offer stump grinding as part of our tree removal service or as a standalone service. We grind stumps below grade so you can replant or landscape over the area.',
    },
    {
      q: 'Do you handle emergency storm damage?',
      a: 'Yes, we offer 24/7 emergency tree removal for storm damage. Call us anytime and we will respond as quickly as possible to secure your property.',
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
// Add types to config... or just assume for now.
// Extending config type implicitly for this file.

export default function JimenezTreeProPage() {
  const accent = config.accent.hex;
  const action = config.action.hex;
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
  const [formTimestamp] = useState(() => Date.now().toString());
  const [phoneValue, setPhoneValue] = useState('');
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  // Format phone as (XXX) XXX-XXXX
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

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

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setFormStatus('sending');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const zipCode = String(formData.get('zipCode') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const honeypot = String(formData.get('website') || '').trim();

    if (honeypot) {
      form.reset();
      setPhoneValue('');
      setFormStatus('success');
      return;
    }

    if (!name || !phone || !address || !zipCode || !service) {
      setFormStatus('error');
      setFormError('Please provide your name, phone, address, zip code, and service needed.');
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
      setPhoneValue('');
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
    '24/7 emergency response + same-day service',
    'Free estimates — honest, upfront pricing',
    '25+ years of tree service experience',
    'Fully insured & safety-focused crews',
  ];
  const recentJobs = [
    {
      title: 'Precision Tree Trimming',
      location: 'Pasadena',
      beforeImage: '/tree_pro/gallery/2.jpg',
      alt: 'Precision Tree Trimming'
    },
    {
      title: 'Safe Tree Pruning',
      location: 'Houston',
      beforeImage: '/tree_pro/gallery/3.jpg',
      alt: 'Safe Tree Pruning'
    },
    {
      title: 'Hazardous Tree Removal',
      location: 'Pearland',
      beforeImage: '/tree_pro/gallery/4.jpg',
      alt: 'Hazardous Tree Removal'
    },
    {
      title: 'Residential Tree Care',
      location: 'League City',
      beforeImage: '/tree_pro/gallery/5.jpg',
      alt: 'Residential Tree Care'
    },
    {
      title: 'Hurricane Tree Preparation',
      location: 'Deer Park',
      beforeImage: '/tree_pro/gallery/hurricane prep.jpg',
      alt: 'Hurricane Tree Preparation'
    },
  ];

  const allServices = [
    {
      name: 'Emergency & Large Tree Removal',
      image: '/tree_pro/emergency_service.png',
      desc: 'Safe removal for hazardous, dead, storm-damaged, and overgrown trees near homes, fences, roofs, and driveways.',
      bestFor: 'Leaning trees, split trunks, root-lifted trees, and immediate safety risks.',
      bullets: [
        'Controlled dismantling and rigging for tight spaces',
        'Full debris haul-off and clean site before we leave',
        '24/7 emergency response after major storms',
      ],
      turnaround: 'Most removals: 1 day',
      alt: 'Emergency large tree removal service',
    },
    {
      name: 'Large Tree Trimming & Structural Pruning',
      image: '/tree_pro/large_tree_Service.png',
      desc: 'Professional pruning that improves tree health, reduces storm risk, and keeps branches clear of structures and power lines.',
      bestFor: 'Overhanging limbs, canopy balancing, deadwood removal, and long-term tree health.',
      bullets: [
        'Crown reduction and structural shaping',
        'Dead limb and hazard branch removal',
        'Property-safe cuts that preserve appearance',
      ],
      turnaround: 'Typical visit: same day',
      alt: 'Large tree trimming and structural pruning',
    },
    {
      name: 'Storm Damage Cleanup & Debris Hauling',
      image: '/tree_pro/storm_cleanup.png',
      desc: 'Fast cleanup for fallen trees, broken limbs, and storm debris so your property is safe, accessible, and secure again.',
      bestFor: 'Post-storm hazards, blocked driveways, fence damage, and urgent cleanup.',
      bullets: [
        'Priority dispatch for urgent storm calls',
        'Hazard clearing around home access points',
        'Complete branch, limb, and debris removal',
      ],
      turnaround: 'Emergency response available',
      alt: 'Storm damage cleanup and debris hauling',
    },
    {
      name: 'Stump Grinding',
      image: '/tree_pro/stump repair.png',
      desc: 'We grind stumps below grade so you can reclaim yard space, remove tripping hazards, and prep for landscaping.',
      bestFor: 'Leftover stumps after removals, lawn restoration, and new landscape projects.',
      bullets: [
        'Below-grade grinding for cleaner finish',
        'Surface root reduction where feasible',
        'Optional cleanup and haul-off of grindings',
      ],
      turnaround: 'Most stumps: same day',
      alt: 'Stump grinding and stump removal service',
    },
  ];

  const steps = [
    { title: 'Quick Call or Text', body: 'Tell us what is going on and share a few photos. We respond fast and schedule your visit.' },
    { title: 'On-Site Safety Plan', body: 'We inspect the trees, explain the safest approach, and provide a clear written estimate.' },
    { title: 'Professional Work + Cleanup', body: 'Our crew completes the job safely and leaves your yard clean and ready to use.' },
  ];

  const serviceAreaCities = [
    'Pasadena',
    'Houston',
    'Pearland',
    'Friendswood',
    'League City',
    'Clear Lake',
    'Deer Park',
    'La Porte',
    'Baytown',
  ];
  const businessPhoneE164 = '+18329667045';
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Residential Tree Services',
    serviceType: 'Tree removal, tree trimming, stump grinding, storm cleanup, debris hauling',
    provider: {
      '@type': 'LocalBusiness',
      name: config.businessName,
      telephone: businessPhoneE164,
      url: 'https://jimeneztreepro.com',
    },
    areaServed: serviceAreaCities.map((city) => ({ '@type': 'City', name: city })),
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: businessPhoneE164,
        contactType: 'customer service',
      },
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jimeneztreepro.com/',
      },
    ],
  };

  const reviewCardBg = isDark ? t.cardBg : 'rgba(255,255,255,0.95)';
  const reviewCardBorder = isDark ? t.border : 'rgba(255,255,255,0.3)';
  const promiseBg = isDark ? t.surfaceBg : t.cardBg;
  const promiseDivider = isDark ? t.borderLight : t.border;

  return (
    <div id="top" className="jimenez-site relative" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• 
          HEADER - Sticky Announcement Bar + Nav
      â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•  */}
      <header className="fixed top-0 w-full z-50 flex flex-col font-sans transition-all duration-300">

        {/* Scrolling Announcement Bar */}
        <div className="relative overflow-hidden py-2.5" style={{ backgroundColor: '#dc2626' }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Content Container 1 */}
            <div className="flex items-center gap-16 px-8">
              {[...Array(2)].flatMap(() => [
                `24/7 EMERGENCY TREE SERVICES AVAILABLE`,
                `HAZARDOUS LIMB REMOVAL`,
                `CALL (281) 924-7955 FOR IMMEDIATE ASSISTANCE`,
                `STORM DAMAGE CLEANUP TEAM STANDING BY`,
                `DO NOT RISK YOUR SAFETY - LET THE PROS HANDLE IT`
              ]).map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[13px] font-black uppercase tracking-widest text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            {/* Content Container 2 (Duplicate for loop) */}
            <div className="flex items-center gap-16 px-8">
              {[...Array(2)].flatMap(() => [
                `⚠️ 24/7 EMERGENCY TREE SERVICES AVAILABLE`,
                `HAZARDOUS LIMB REMOVAL`,
                `CALL (281) 924-7955 FOR IMMEDIATE ASSISTANCE`,
                `STORM DAMAGE CLEANUP TEAM STANDING BY`,
                `DO NOT RISK YOUR SAFETY - LET THE PROS HANDLE IT`
              ]).map((text, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-3 text-[13px] font-black uppercase tracking-widest text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="w-full transition-all duration-300"
          style={{
            backgroundColor: scrolled ? `${t.cardBg}f8` : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? `1px solid ${t.border}` : 'none',
          }}
        >
          <div className={`${shellClass} flex items-center justify-between py-2`}>
            <a href="#top" className="flex items-center gap-2 md:gap-3">
              <NextImage
                src="/tree_pro/tree_logo.svg"
                alt={config.businessName}
                width={220}
                height={64}
                priority
                unoptimized
                className="h-16 w-auto object-contain"
              />
              <div>
                <div className="brand-display text-lg font-black uppercase tracking-tight leading-none">
                  <span style={{ color: scrolled ? accent : 'white' }}>JIMENEZ</span>
                  <span className="ml-1.5" style={{ color: scrolled ? action : 'white' }}>TREE PRO</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: scrolled ? t.textMuted : 'rgba(255,255,255,0.7)' }}>24/7 Emergency Service</div>
              </div>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-semibold transition-colors" style={{ color: scrolled ? t.textSecondary : 'rgba(255,255,255,0.85)' }}>{link.label}</a>
              ))}
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <a href={`tel:${cleanPhone}`} className="flex items-center gap-2 text-sm font-bold" style={{ color: scrolled ? t.textPrimary : 'white' }}><Phone className="h-4 w-4" />{config.phone}</a>
              <button onClick={scrollToQuote} className="px-5 py-2.5 text-sm font-bold text-white rounded transition-colors hover:shadow-lg hover:brightness-110" style={{ backgroundColor: action }}>{config.ctaPrimary}</button>
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
                  <button onClick={() => { scrollToQuote(); setMobileMenuOpen(false); }} className="mt-2 py-3 text-white font-bold rounded hover:brightness-110" style={{ backgroundColor: action }}>{config.ctaPrimary}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO - Full Background with Quote Form
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative min-h-[105vh] flex flex-col overflow-hidden -mt-[72px] pt-[120px]" style={{ minHeight: '108vh' }}>
        {/* Changed background to something more fence/construction related or generic structure */}
        <div className="absolute inset-0" aria-hidden="true">
          <NextImage
            src="/tree_pro/home_3.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.75) 100%)' }} />

        <div className={`${shellClass} relative z-10 pt-32 pb-12 lg:py-0 flex-1 lg:flex lg:items-center`}>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center w-full pb-20 lg:pb-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Top Rated Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: accent }}>
                <div className="flex">{[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />)}</div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Top Rated in {config.city}</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl font-black leading-[1.05] tracking-normal text-white md:text-5xl lg:text-6xl uppercase">
                  Tree Service in Pasadena & Houston, TX
                </h1>
                <p className="text-xl font-bold uppercase tracking-widest" style={{ color: action }}>
                  Trusted Experts for Emergency Tree Removal &amp; Same-Day Hauling
                </p>
                <p className="text-lg leading-relaxed text-slate-300 max-w-lg">
                  <span className="font-semibold text-white">{config.businessName}</span> helps homeowners across Pasadena and the Greater Houston area.<br />
                  Expert tree removal, trimming, stump grinding, and storm cleanup.<br />
                  Free estimates. Clean job sites. {years}+ years of experience.
                </p>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div><div className="text-4xl font-black text-white tracking-wide">24/7</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">Emergency Service</div></div>
                <div><div className="text-4xl font-black tracking-wide" style={{ color: action }}>{ratingText}</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">Star Rating</div></div>
                <div><div className="text-4xl font-black text-white tracking-wide">{years}+</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">Years Exp</div></div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><ShieldCheck className="h-5 w-5" style={{ color: accent }} />Licensed & Insured</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Award className="h-5 w-5" style={{ color: accent }} />Expert Tree Care</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Clock className="h-5 w-5" style={{ color: accent }} />Fast Response</div>
              </div>
            </motion.div>

            {/* Quote Form */}
            <motion.div id="quote-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl p-8 shadow-xl bg-white border-t-4" style={{ borderColor: action }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900">Get Your Free Estimate</h2>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mb-6 font-medium">No obligation. 100% Secure.</p>
              <form className="space-y-4" action="/api/lead" method="POST" onSubmit={handleLeadSubmit}>
                {/* Honeypot fields - invisible to users, bots fill these */}
                <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="text" name="company_url" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="text" name="fax" style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="text" name="address2" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {/* Time-based validation - timestamp when form rendered */}
                <input type="hidden" name="_ts" value={formTimestamp} />
                <input type="hidden" name="page" value={pageUrl} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      pattern="[A-Za-z\s\-']{2,50}"
                      title="Letters, spaces, and hyphens only (2-50 characters)"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="(832) 555-0123"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
                      pattern="\(\d{3}\) \d{3}-\d{4}"
                      title="Please enter a valid 10-digit phone number"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Address *</label>
                    <input
                      required
                      name="address"
                      type="text"
                      placeholder="Street Address"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code *</label>
                    <input
                      required
                      name="zipCode"
                      type="text"
                      placeholder="e.g. 77502"
                      pattern="\d{5}"
                      title="Please enter a valid 5-digit zip code"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                    />
                  </div>
                </div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Service Needed *</label><select required name="service" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm bg-white text-slate-900"><option value="">Select a service...</option>{[config.primaryService, ...services].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Project Details</label><textarea name="message" rows={3} placeholder="Describe your project (e.g. Tree removal, storm damage cleanup...)" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 resize-none" /></div>
                <button type="submit" disabled={formStatus === 'sending'} className="w-full rounded-lg py-4 text-base font-bold text-white shadow-lg disabled:opacity-70 transition-all hover:scale-[1.02] hover:shadow-orange-500/20" style={{ backgroundColor: action }}>
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
                <span className="text-sm font-bold text-slate-900">{ratingText}</span><span className="text-slate-300">|</span><span className="text-sm font-medium text-slate-500">{reviewCount}+ Google Reviews</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling Reviews Ticker - Liquid Glass Effect */}
        <div className="absolute bottom-0 left-0 right-0 z-20 w-full backdrop-blur-lg py-3 overflow-hidden border-t border-white/20 shadow-lg" style={{ backgroundColor: `${accent}40` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" /> {/* Gloss sheen */}
          <div className="flex animate-marquee whitespace-nowrap relative z-10">
            {config.testimonials.concat(config.testimonials).map((review, i) => (
              <div key={i} className="mx-8 flex items-center gap-3">
                <div className="flex">{[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-3 w-3 fill-yellow-400 text-yellow-400 drop-shadow-sm" />)}</div>
                <span className="text-sm font-medium text-white drop-shadow-md">&ldquo;{review.highlight || review.quote}&rdquo;</span>
                <span className="text-sm text-white/90 font-medium drop-shadow-md">- {review.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* marquee animation defined in globals.css */}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ORIGINAL SECTIONS BELOW (Stats, Why Us, Services, etc.)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* Local SEO Service-Area Content */}
      <section className="pt-8 pb-4" style={{ backgroundColor: '#ffffff' }}>
        <div className={shellClass}>
          <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: t.border, backgroundColor: '#fff' }}>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl" style={{ color: t.textPrimary }}>
              Tree Removal & Tree Trimming in Pasadena, Houston, and Nearby Cities
            </h2>
            <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: t.textSecondary }}>
              We provide residential tree service in Pasadena, Houston, Pearland, Friendswood, League City, Clear Lake, Deer Park, La Porte, and Baytown.
              Whether you need emergency tree removal, dangerous limb removal, stump grinding, or full debris hauling, we provide fast scheduling and clean job sites.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: t.textMuted }}>
              Common service-area searches we cover include: tree service Pasadena TX, tree removal Pasadena TX, tree trimming Houston TX, emergency tree service Houston, and stump grinding near Pasadena.
            </p>
          </div>
        </div>
      </section>
      {/* Services */}
      <section id="services" className="relative pt-20 pb-28 scroll-mt-20 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
        {/* Large Faint Tree Silhouette Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/4" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: '#166534' }}>
            <path d="M50 100 V 50 M50 50 L 20 20 M50 50 L 80 20 M50 70 L 20 50 M50 70 L 80 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <circle cx="50" cy="30" r="25" fill="currentColor" opacity="0.6" />
            <circle cx="25" cy="45" r="20" fill="currentColor" opacity="0.6" />
            <circle cx="75" cy="45" r="20" fill="currentColor" opacity="0.6" />
            <circle cx="50" cy="15" r="15" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Leaves */}
        <div className="absolute top-20 left-10 w-16 h-16 opacity-[0.05] rotate-45 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: accent }}><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>
        </div>
        <div className="absolute bottom-40 right-20 w-24 h-24 opacity-[0.04] -rotate-12 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#166534' }}><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>
        </div>

        <div className={`${shellClass} relative z-10`}>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>Our Expertise</p>
            <h2 className="text-3xl font-black md:text-4xl lg:text-5xl tracking-tight" style={{ color: t.textPrimary }}>Professional Tree Services</h2>
            <p className="mt-4 text-base md:text-lg max-w-3xl mx-auto" style={{ color: t.textSecondary }}>
              Trusted experts serving {config.city} and the Greater Houston area. Same-day emergency response. Free estimates on every job.
            </p>
          </div>

          <motion.div variants={staggerSoft} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.15 }} className="grid gap-8 lg:grid-cols-2">
            {allServices.map((service) => (
              <motion.article key={service.name} variants={fadeInUp} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ borderTop: `4px solid ${accent}` }}>
                <div className="aspect-[16/10] w-full relative overflow-hidden">
                  <NextImage
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <h3 className="text-xl md:text-2xl font-black leading-tight text-white drop-shadow-md">{service.name}</h3>
                    <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white bg-black/45 border border-white/25">
                      {service.turnaround}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
                  <p className="text-base leading-relaxed" style={{ color: t.textSecondary }}>{service.desc}</p>
                  <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                    <span className="font-bold" style={{ color: t.textPrimary }}>Best for:</span> {service.bestFor}
                  </p>
                  <ul className="space-y-2">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm" style={{ color: t.textSecondary }}>
                        <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: accent }} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3 border-t" style={{ borderColor: t.border }}>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.textMuted }}>
                      Professional on-site assessment included
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Need Help Choosing - Accent Section */}
          <div className="mt-10 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden" style={{ backgroundColor: accent }}>
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white/90 mb-2">Need Help Choosing the Right Service?</p>
                <p className="text-lg font-medium text-white max-w-xl leading-relaxed">Tell us what you are dealing with and we will recommend the safest, most cost-effective approach.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
                <button type="button" className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105" style={{ backgroundColor: 'white', color: accent }} onClick={scrollToQuote}>
                  Request Estimate
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all border-2 border-white/30 hover:bg-white/10 text-white"
                >
                  <Phone className="h-4 w-4" />
                  {config.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="relative scroll-mt-20 py-28 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0" aria-hidden="true">
          <NextImage src="/tree_pro/trust_us.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/75" />

        <div className={`${shellClass} relative z-10`}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <NextImage
                    src="/tree_pro/done_right.jpg"
                    alt="Jimenez Tree Pro crew working"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-3xl font-black text-white">{years}+</div>
                      <div className="text-xs text-gray-300 font-medium">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white">24/7</div>
                      <div className="text-xs text-gray-300 font-medium">Emergency Service</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white">{config.rating}</div>
                      <div className="text-xs text-gray-300 font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" /> Google Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative accent behind image */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10" style={{ border: `2px solid ${accent}`, opacity: 0.2 }} />
            </div>

            {/* Right - Content */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>Why Jimenez Tree Pro</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
                Done Right. Done Safely.
              </h2>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-6 text-slate-400">
                Done Today.
              </h3>
              <p className="text-base mb-10 leading-relaxed max-w-lg text-slate-300">
                We are for the homeowner who wants it done right, done safely, and done today. From a single trim to a full removal, you get honest pricing, expert crews, and a yard left cleaner than we found it.
              </p>

              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm transition-all hover:bg-white/15" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: `4px solid ${accent}` }}>
                    <Check className="h-5 w-5 shrink-0" style={{ color: accent }} />
                    <span className="text-sm font-semibold text-white">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
                <button type="button" onClick={scrollToQuote} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white font-black uppercase tracking-wide text-sm transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/30 w-full sm:w-auto" style={{ backgroundColor: accent }}>
                  Request Free Estimate
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a href={`tel:${cleanPhone}`} className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-black uppercase tracking-wide text-white border-2 border-slate-600 hover:border-orange-500 hover:text-orange-500 transition-all w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  {config.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Bar - Long Orange Bar */}
      <section className="py-10 relative z-20" style={{ backgroundColor: accent }}>
        <div className={shellClass}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <ShieldCheck className="h-10 w-10 text-white shrink-0" />
            <p className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none">
              If you aren&apos;t completely satisfied with our craftsmanship, we will make it right. No exceptions.
            </p>
          </div>
        </div>
      </section>

      {/* Process - Professional Steps */}
      <section className="relative overflow-hidden pt-24 pb-28" style={{ backgroundColor: '#ffffff' }}>
        <div className="absolute inset-x-0 top-0 h-16" style={{ background: `linear-gradient(180deg, ${accent}1f 0%, rgba(255,255,255,0) 100%)` }} />
        <div className="absolute top-0 left-0 w-[520px] h-[520px] opacity-[0.18] pointer-events-none -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <svg viewBox="0 0 400 400" fill="none" stroke="#cbd5e1" strokeWidth="1">
            <circle cx="200" cy="200" r="45" /><circle cx="200" cy="200" r="85" /><circle cx="200" cy="200" r="130" /><circle cx="200" cy="200" r="180" />
          </svg>
        </div>

        <div className={`${shellClass} relative z-10`}>
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>How It Works</p>
            <h2 className="text-4xl font-black md:text-5xl tracking-tight" style={{ color: t.textPrimary }}>Clear Process. Clean Results.</h2>
            <p className="mt-4 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: t.textSecondary }}>
              From first call to final cleanup, every step is designed to keep your property safe and your schedule moving.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = [ClipboardList, Hammer, Check][index];
              return (
                <article key={step.title} className="group rounded-2xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: t.border }}>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border transition-colors" style={{ borderColor: `${accent}44`, backgroundColor: `${accent}12`, color: accent }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: t.textMuted }}>Step 0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight" style={{ color: t.textPrimary }}>{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: t.textSecondary }}>{step.body}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0,70 C180,120 360,10 540,52 C720,94 900,14 1080,52 C1260,90 1360,65 1440,78 L1440,120 L0,120 Z" fill="#faf8f5" />
          </svg>
        </div>
      </section>



      {/* Project Showcase */}
      <section id="work" className="pb-24 pt-12 overflow-hidden" style={{ backgroundColor: '#faf8f5' }}>
        <div className={shellClass}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60" style={{ color: t.textPrimary }}>Our Portfolio</p>
              <h2 className="text-4xl font-black md:text-5xl" style={{ color: t.textPrimary }}>Recent Projects</h2>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="h-1 w-20 rounded-full opacity-20" style={{ backgroundColor: t.textPrimary }} />
              <div className="h-1 w-4 rounded-full" style={{ backgroundColor: action }} />
            </div>
          </div>
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-8 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
            {recentJobs.map((job, i) => (
              <ProjectCard
                key={`${job.title}-${i}`}
                {...job}
                accentColor={accent}
                actionColor={action}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="proof" className="relative py-24 overflow-hidden" style={{ borderTop: `4px solid ${accent}`, borderBottom: `4px solid ${accent}` }}>
        <div className="absolute inset-0" aria-hidden="true">
          <NextImage
            src="/tree_pro/home_1.png"
            alt="Customer Reviews Background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/80" />

        <div className={`${shellClass} relative z-10`}>
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <GoogleLogo className="h-5 w-5" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-white font-bold ml-1.5 pt-0.5">{ratingText}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Customer Reviews</h2>
            <p className="text-slate-400 text-lg max-w-2xl">See what your neighbors in {config.city} are saying about our work.</p>
          </div>

          <div className="relative">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {config.testimonials.map((testimonial, idx) => (
                <div key={`${testimonial.name}-${idx}`} className="flex flex-col h-[22rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl shadow-2xl border-t-4 hover:-translate-y-1 transition-transform duration-300 border-x border-b border-white/5 relative group" style={{ borderTopColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'][idx % 4] }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg" style={{ backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][idx % 5] }}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{testimonial.name}</div>
                        <div className="text-xs text-white/60">
                          {testimonial.localGuide && 'Local Guide • '}
                          {testimonial.reviewCount || 1} reviews
                        </div>
                      </div>
                    </div>
                    <GoogleLogo className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="flex gap-1 mb-3 relative z-10">
                    {[0, 1, 2, 3, 4].map(i => (
                      <Star key={i} className="h-4 w-4 drop-shadow-sm text-[#FBBC05] fill-[#FBBC05]" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-4 font-medium relative z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 scroll-mt-20" style={{ borderTop: `3px solid ${t.border}`, backgroundColor: '#fff' }}>
        <div className={shellClass}>
          <div className="grid gap-10 md:grid-cols-[0.4fr_0.6fr] md:items-start">
            <div className="md:sticky md:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>FAQ</p>
              <h2 className="text-2xl font-bold md:text-3xl" style={{ color: t.textPrimary }}>Common Questions</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: t.textMuted }}>Still have questions? Call us directly.</p>
              <a href={`tel:${cleanPhone}`} className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]" style={{ backgroundColor: action, boxShadow: `0 4px 12px ${action}30` }}><Phone className="h-4 w-4" />{config.phone}</a>
            </div>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <details key={faq.q} className="group rounded-xl transition-all open:shadow-md" style={{ backgroundColor: '#f8fafc', border: `1px solid ${t.border}` }} open={i === 0}>
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
      <section id="home-cta" className="py-16" style={{ backgroundColor: accent }}>
        <div className={`${shellClass} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Get Your Free Tree Service Estimate
            </h2>
            <p className="mt-3 text-lg font-semibold text-white/95">
              Removal, trimming, storm cleanup, and stump grinding done safely and professionally.
            </p>
            <p className="mt-2 text-sm font-medium text-white/85 md:text-base">
              Serving Pasadena, Houston, Pearland, Friendswood, League City, and nearby communities.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-shrink-0">
            <button
              type="button"
              className="rounded-lg px-8 py-4 text-base font-black uppercase tracking-wide shadow-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: 'white', color: accent }}
              onClick={scrollToQuote}
            >
              {config.ctaPrimary}
            </button>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-base font-black uppercase tracking-wide text-white transition-all hover:bg-white/10"
              style={{ border: '2px solid white' }}
            >
              <Phone className="h-5 w-5" />
              {config.phone}
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 font-sans text-slate-300" style={{ backgroundColor: '#0b0f19' }}>
        {/* Top Orange Line */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />

        <div className={shellClass}>
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">

            {/* COL 1: IDENTITY & TRUST */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <NextImage
                  src="/tree_pro/tree_logo.svg"
                  alt={config.businessName}
                  width={180}
                  height={45}
                  unoptimized
                  className="h-12 w-auto brightness-0 invert opacity-90"
                />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                Setting the standard for tree care in Pasadena and the Greater Houston Area. Expert service, honest pricing, and safety first.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-emerald-500">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span>Top Rated Local Pro</span>
                </div>
              </div>
            </div>

            {/* COL 2: CORE EXPERTISE */}
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Expertise</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                {[
                  'Tree Removal',
                  'Tree Trimming',
                  'Stump Grinding',
                  'Storm Cleanup',
                  'Debris Hauling',
                  'Land Clearing',
                ].map(item => (
                  <li key={item}>
                    <a href="#services" className="group flex items-center gap-2 transition-colors hover:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-orange-500" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COL 3: SERVICE AREA */}
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Service Area</h4>
              <ul className="space-y-5 text-sm text-slate-400">
                <li className="relative pl-5">
                  <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  <strong className="block text-white mb-1">Pasadena (HQ)</strong>
                  <span className="text-xs leading-relaxed block opacity-80">Serving all neighborhoods including Golden Acres, Vista Villas, and Parkview.</span>
                </li>
                <li className="relative pl-5">
                  <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <strong className="block text-slate-200 mb-1">Greater Houston</strong>
                  <span className="text-xs leading-relaxed block opacity-80">Pearland, Friendswood, League City, Clear Lake, Deer Park, La Porte, Baytown.</span>
                </li>
              </ul>
            </div>

            {/* COL 4: ACTION */}
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Contact Us</h4>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Speak with an expert</p>
                <a href={`tel:${cleanPhone}`} className="mb-6 block text-2xl font-black text-white transition-colors hover:text-orange-500">{config.phone}</a>

                <button
                  onClick={scrollToQuote}
                  className="group w-full rounded-xl py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: accent }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Request Quote
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
              <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-slate-600 font-bold">
                24/7 Service
              </p>
            </div>

          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 text-xs font-medium text-slate-600 md:flex-row">
            <p>&copy; {new Date().getFullYear()} {config.businessName}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                Website by <a href="https://quicklaunchweb.us" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition-colors">QuickLaunchWeb</a>
              </span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
        <div className="mx-auto flex max-w-md gap-3 rounded-lg p-3 shadow-2xl backdrop-blur-md" style={{ backgroundColor: '#0f172a', border: `1px solid ${accent}` }}>
          <a href={`tel:${cleanPhone}`} className="flex flex-1 items-center justify-center gap-2 rounded px-3 py-3 text-sm font-black uppercase tracking-wide transition-all hover:bg-white/5 text-white"><Phone className="h-4 w-4 text-orange-500" />Call</a>
          <button type="button" className="flex-1 rounded px-3 py-3 text-sm font-black text-white uppercase tracking-wide shadow-lg transition-all" style={{ backgroundColor: accent }} onClick={scrollToQuote}>Get Quote</button>
        </div>
      </div>

      {/* Lightbox Modal - Optimized */}


    </div>
  );
}

