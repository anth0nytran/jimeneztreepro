'use client';

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, Star, Menu, X, Award, Clock, Check, ClipboardList, Hammer, ArrowRight } from 'lucide-react';
import NextImage from 'next/image';

import { ProjectCard } from './components/ProjectCard';

// Inline configuration for standalone usage
const config = {
  businessName: 'Jimenez Tree Pro',
  businessOwner: 'Jose Castillo',
  city: 'Kingwood, TX',
  address: '4102 Valley Haven Dr, Kingwood, TX 77339',
  phone: '(713) 283-8138',
  primaryService: 'Siding Replacement & Repair',
  services: ['Roofing Services', 'Professional Painting', 'Window Replacement'],
  rating: 5.0,
  reviewCount: 50,
  yearsInBusiness: 15,
  ctaPrimary: 'Request a Quote',

  // Theme: Premium Craftsmanship - Navy & Deep Bronze
  theme: {
    isDark: false,
    colors: {
      pageBg: '#f8fafc', // Slate-50: Subtle off-white for depth
      cardBg: '#ffffff', // Pure white for crisp cards
      surfaceBg: '#f1f5f9', // Slate-100: Distinct section background
      textPrimary: '#1e293b', // Slate-800: Softer than pure black
      textSecondary: '#475569', // Slate-600
      textMuted: '#94a3b8', // Slate-400
      border: '#e2e8f0', // Slate-200: Subtle borders
      borderLight: '#f8fafc',
      darkBg: '#0f172a', // Slate-900: Rich dark background
      darkText: '#f8fafc',
      darkTextMuted: '#cbd5e1',
    }
  },

  // Primary: Elite Navy (Trust, Authority, Professionalism)
  accent: {
    name: 'Elite Navy',
    hex: '#1e3a8a', // Blue-900
    hoverHex: '#172554' // Blue-950
  },

  // Action: Artisan Bronze (Quality, warmth, attention)
  action: {
    hex: '#ea580c', // Orange-600 (Darker, richer than safety orange)
    hoverHex: '#c2410c' // Orange-700
  },

  // Secondary Color for strong headers/branding (Navy Blue)
  secondary: {
    hex: '#1e3a8a', // Blue-900
  },

  imagePlaceholders: [
    { label: 'Before Photo', hint: 'Old siding or roof damage' },
    { label: 'After Photo', hint: 'Fresh paint or new windows' },
    { label: 'Crew Photo', hint: 'Jose and team onsite' },
  ],

  testimonials: [
    {
      quote: "Jimenez Tree Pro replaced all of the siding and rotted wood on the exterior of my two story home... From the promptness of Jose to meet with us and provide a quote, to the beautiful finished appearance... We get so many complements on our home!",
      name: 'Jane Verkerk',
      highlight: 'They added the small professional touches that made a siding job a work of art!',
      reviewCount: 6,
    },
    {
      quote: "Arrived on time daily, cleaned up each day, and completed a two-week siding and trim replacement project beautifully. Highly recommend.",
      name: 'Lisa H.',
      highlight: 'Completed a two-week siding and trim replacement project beautifully',
      reviewCount: 2,
    },
    {
      quote: "Very responsive with great communication and scheduling. The crew arrived on time and completed high-quality repairs including wood rot issues, exterior trim replacement, and painting to match. Highly professional work.",
      name: 'Cole S.',
      highlight: 'Completed high-quality repairs including wood rot issues',
      reviewCount: 4,
    },
    {
      quote: "The company arrived promptly, completed siding and eave repairs, painted to match the house color, and exceeded my expectations. Pricing was fair and the area was cleaned thoroughly. Highly recommended and will call again.",
      name: 'Karen C.',
      highlight: 'Exceeded my expectations',
      reviewCount: 5,
    },
    {
      quote: "Clear estimate, great communication, timely work, and excellent cleanup. Repairs took three days and the house looks great. Highly recommend.",
      name: 'Diane W.',
      highlight: 'Repairs took three days and the house looks great',
      reviewCount: 3,
    },
    {
      quote: "Great communication, daily cleanup, flexible with changes, and excellent workmanship. Will hire again despite being booked out.",
      name: 'John H.',
      highlight: 'Excellent workmanship',
      reviewCount: 8,
    },
    {
      quote: "Highly recommend. Siding replacement was beautiful with outstanding attention to detail and workmanship.",
      name: 'Jane G.',
      highlight: 'Siding replacement was beautiful',
      reviewCount: 2,
    },
    {
      quote: "CanΓÇÖt say enough about Elite Home Repair... Within a minute, Jose was contacting me... The guys came out riding early... Side wall of my house matched up the exact color Scheme... It is as if my side wall to my house was never missing... Highly recommend Jose and his crew.",
      name: 'Terrance Matthews',
      highlight: 'It is as if my side wall to my house was never missing',
      reviewCount: 6,
      photos: 3,
    },
    {
      quote: "Fast response and excellent work. The crew cleaned up everything when finished and completed repairs very quickly. Superb job.",
      name: 'Sherry M.',
      highlight: 'Fast response and excellent work',
      reviewCount: 1,
    },
    {
      quote: "Went above and beyond to address minor issues. Very hardworking and affable, and even showed me how to handle some things myself to save money.",
      name: 'Ben K.',
      highlight: 'Went above and beyond to address minor issues',
      reviewCount: 3,
    },
    {
      quote: "Quick response and great results. The work looks like new. Would definitely hire again.",
      name: 'Neil D.',
      highlight: 'The work looks like new',
      reviewCount: 2,
    },
    {
      quote: "Honest and trustworthy. Did an excellent job and would highly recommend.",
      name: 'Terry B.',
      highlight: 'Honest and trustworthy',
      reviewCount: 4,
    },
    {
      quote: "They completed unfinished work left by someone else and did a great job. Will definitely hire again.",
      name: 'Toni T.',
      highlight: 'Completed unfinished work left by someone else',
      reviewCount: 1,
    },
    {
      quote: "Great job fixing my siding issue. Fair pricing, quick turnaround, and excellent service all around.",
      name: 'Miguel D.',
      highlight: 'Fair pricing, quick turnaround',
      reviewCount: 5,
    },
    {
      quote: "Delivered as promised. Excellent work repainting the entire exterior of the house and replacing rotted wood.",
      name: 'Robert C.',
      highlight: 'Delivered as promised',
      reviewCount: 2,
    },
    {
      quote: "Work was completed well and on schedule.",
      name: 'Glenn M.',
      highlight: 'Completed well and on schedule',
      reviewCount: 1,
    },
    {
      quote: "Fast, high-quality work. Will definitely use again and recommend to others.",
      name: 'Jeff H.',
      highlight: 'Fast, high-quality work',
      reviewCount: 3,
    },
    {
      quote: "Easy to work with, stayed on schedule from estimate through completion, handled all requests, and delivered quality work at a reasonable cost.",
      name: 'Renee C.',
      highlight: 'Delivered quality work at a reasonable cost',
      reviewCount: 4,
    },
    {
      quote: "Removed and replaced rotted crown molding efficiently. Work was completed on time and the area was cleaned thoroughly. Would hire again.",
      name: 'Carolyn E.',
      highlight: 'Removed and replaced rotted crown molding efficiently',
      reviewCount: 2,
    },
    {
      quote: "A little expensive, but the quality of work made it worth it. Would definitely hire again.",
      name: 'Paul W.',
      highlight: 'Quality of work made it worth it',
      reviewCount: 6,
    },
    {
      quote: "Very professional and accommodating, even with changes and special requests.",
      name: 'Calma J.',
      highlight: 'Very professional and accommodating',
      reviewCount: 1,
    },
    {
      quote: "Excellent siding repairs. Professional, friendly, and highly recommended for home improvement needs.",
      name: 'Bryan J.',
      highlight: 'Excellent siding repairs',
      reviewCount: 3,
    },
    {
      quote: "True professional. Competitive pricing, fast completion, and quality work worth the cost. Highly recommend for siding replacement.",
      name: 'Jeffrey S.',
      highlight: 'Quality work worth the cost',
      reviewCount: 5,
    },
    {
      quote: "Completed the job in two days as promised, cleaned the site, and made sure everything was done to satisfaction.",
      name: 'Richard R.',
      highlight: 'Completed the job in two days as promised',
      reviewCount: 2,
    },
    {
      quote: "On time, polite, professional, efficient. Everything you want with a crew. Great job! Good price! I'll definitely use Jimenez Tree Pro again! (Repaired, replaced and painted my facia boards for the whole house in one day)",
      name: 'Russell Dozier',
      highlight: 'On time, polite, professional, efficient',
      localGuide: true,
      reviewCount: 19,
      photos: 3,
    },
    {
      quote: "Reasonable price. I contacted Jimenez Tree Pro to inquire about a window repair. Jose responded the same day... He and his crew came the following week and completed the job in less than 2 hours.",
      name: 'Rebecca Havely',
      highlight: 'Completed the job in less than 2 hours',
      reviewCount: 6,
      photos: 9,
    },
    {
      quote: "This is 2nd time we brought them back to work on our house they are fast & remarkable of how well they work... Workers are very polite and alert to not leaving any mess behind... We Will be bringing them back again for more projects",
      name: 'Sherry Murray',
      highlight: 'Workers are very polite and alert to not leaving any mess behind',
      reviewCount: 4,
    },
    {
      quote: "Great price. I contacted the company I used to replace the siding on my home because there were a couple of things that needed attention. Jose came out and took care of the problem... I am satisfied and would recommend them to my friends and neighbors.",
      name: 'Ben Knowles',
      highlight: 'Of particular concern was whether they would honor their warranty and they did!',
      reviewCount: 1,
    },
    {
      quote: "Jose did a great job! I have used his services several times and, as always, he is very professional and does a great job. I recommend him!",
      name: 'Carlos Sierra',
      highlight: 'Reasonable price',
      reviewCount: 7,
    },
    {
      quote: "Jose did a great job and was able to accommodate my time crunch",
      name: 'Valorie Tolle',
      highlight: 'Able to accommodate my time crunch',
      reviewCount: 5,
      photos: 1,
    },
    {
      quote: "Great, quick, professional, affordable. Repaired siding.",
      name: 'Alexandra Stevens',
      highlight: 'Great, quick, professional, affordable.',
      reviewCount: 4,
    },
  ],

  faqs: [
    {
      q: 'Do you offer free estimates?',
      a: 'Yes! We provide 100% free, detailed written estimates for all services including siding, roofing, and painting.',
    },
    {
      q: 'What areas do you serve?',
      a: 'Our main hub is Kingwood, and we also help homeowners in Humble, The Woodlands, Houston, Spring, Atascocita, Porter, Conroe, Tomball, Katy, Sugar Land, and Cypress.',
    },
    {
      q: 'Are you insured?',
      a: 'Absolutely. Jimenez Tree Pro is fully insured for your protection and ours. reliability is our priority.',
    },
    {
      q: 'What types of siding do you install?',
      a: 'We specialize in Hardie plank (fiber cement), vinyl, and wood siding installation and repair.',
    },
    {
      q: 'Can you help with insurance claims for roof damage?',
      a: 'Yes, we have experience working with insurance companies to help you get the repairs you deserve after storm damage.',
    },
    {
      q: 'Do you paint interiors or just exteriors?',
      a: 'We do both! From full exterior makeovers to detailed interior painting, our team handles it all.',
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

export default function EliteHomeRepairs() {
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
  const [reviewPage, setReviewPage] = useState(0);
  const reviewsPerPage = 6;
  const totalReviewPages = Math.ceil(config.testimonials.length / reviewsPerPage);

  const nextReviewPage = () => setReviewPage((p) => (p + 1) % totalReviewPages);
  const prevReviewPage = () => setReviewPage((p) => (p - 1 + totalReviewPages) % totalReviewPages);

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
    const email = String(formData.get('email') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const honeypot = String(formData.get('website') || '').trim();

    if (honeypot) {
      form.reset();
      setPhoneValue('');
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
    'Fast response + quick scheduling',
    'Clear, written estimates',
    '15+ years of home repair experience',
    'Fully insured for your peace of mind',
  ];
  const recentJobs = [
    {
      title: 'Siding Replacement',
      location: 'Spring',
      duration: '4 Days',
      result: 'Complete siding renovation caused by weather damage',
      beforeImage: '/images/project_showcase/before_1.png',
      afterImage: '/images/project_showcase/after_1.png',
      alt: 'Siding replacement project'
    },
    {
      title: 'Siding & Window Replacement',
      location: 'Kingwood',
      duration: '1 Week',
      result: 'Full exterior upgrade with energy-efficient windows',
      beforeImage: '/images/project_showcase/before_2.png',
      afterImage: '/images/project_showcase/after_2.png',
      alt: 'Siding and window replacement'
    },
    {
      title: 'Roof Replacement',
      location: 'Roman Forest',
      duration: '3 Days',
      result: 'Complete roof replacement with premium shingles',
      beforeImage: '/images/project_showcase/before_3.png',
      afterImage: '/images/project_showcase/after_3.png',
      alt: 'Roof replacement project'
    },
    {
      title: 'Siding Replacement',
      location: 'Galveston',
      duration: '5 Days',
      result: 'Weather-resistant siding installation for coastal home',
      beforeImage: '/images/project_showcase/before_4.png',
      afterImage: '/images/project_showcase/after_5.png', // Note: keep original image mapping if possible, before_4/after_5 was in original code
      alt: 'Coastal siding replacement'
    },
    {
      title: 'Roof Replacement',
      location: 'Magnolia',
      duration: '2 Days',
      result: 'High-quality roof installation and weatherproofing',
      beforeImage: '/images/project_showcase/before_5.png',
      afterImage: '/images/project_showcase/after_4.png', // Note: keep original image mapping, before_5/after_4 was in original code
      alt: 'Residential roof replacement'
    },
  ];

  const allServices = [
    {
      name: config.services[0], // Roofing
      image: '/images/service-roofing.png',
      desc: 'Expert roof inspections, repairs, and full replacements. We handle storm damage claims and ensure your home is watertight.',
      alt: 'Professional roofing services'
    },
    {
      name: config.primaryService, // Siding
      image: '/images/service-siding.png',
      desc: 'Premium siding installation including Hardie plank and vinyl. Protect your home and boost curb appeal with durable materials.',
      alt: 'Siding installation and repair'
    },
    {
      name: config.services[1], // Painting
      image: '/images/service-painting.png',
      desc: 'Interior and exterior painting services. meticulous prep work and high-quality paints for a flawless, long-lasting finish.',
      alt: 'Professional painting services'
    },
    {
      name: config.services[2], // Windows
      image: '/images/service-windows.png',
      desc: 'Energy-efficient window replacement and installation. Improve insulation and modernize your home look.',
      alt: 'Window replacement services'
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
    <div id="top" className="elite-site relative" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          HEADER - Transparent over hero, solid on scroll
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
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
                <span style={{ color: scrolled ? accent : 'white' }}>ELITE</span>
                <span className="ml-1.5" style={{ color: scrolled ? action : 'white' }}>HOME REPAIRS</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: scrolled ? t.textMuted : 'rgba(255,255,255,0.7)' }}>Mon-Sat 7AM-8PM</div>
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

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          HERO - Full Background with Quote Form
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <section className="relative min-h-[105vh] flex flex-col overflow-hidden -mt-[72px] pt-[72px]" style={{ minHeight: '108vh' }}>
        {/* Changed background to something more fence/construction related or generic structure */}
        <div className="absolute inset-0" aria-hidden="true">
          <NextImage
            src="/images/hero-bg.webp"
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
                <h1 className="text-5xl font-black leading-[1.05] tracking-normal text-white md:text-6xl lg:text-7xl uppercase">
                  {config.businessName}
                </h1>
                <p className="text-xl font-bold uppercase tracking-widest" style={{ color: action /* Orange highlight */ }}>
                  Trusted Home Repairs for Kingwood Homeowners
                </p>
                <p className="text-lg leading-relaxed text-slate-300 max-w-lg">
                  Protect your home with reliable siding, roofing, painting, and window work.<br />
                  Clear estimates. Clean job sites. {years}+ years of experience.
                </p>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div><div className="text-4xl font-black text-white tracking-wide">Mon-Sat</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">7AM-8PM</div></div>
                <div><div className="text-4xl font-black tracking-wide" style={{ color: action }}>{ratingText}</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">Star Rating</div></div>
                <div><div className="text-4xl font-black text-white tracking-wide">{years}+</div><div className="text-xs font-bold uppercase tracking-widest text-slate-400">Years Exp</div></div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><ShieldCheck className="h-5 w-5" style={{ color: accent }} />Licensed & Insured</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Award className="h-5 w-5" style={{ color: accent }} />Quality Craftsmanship</div>
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
                      placeholder="(713) 555-0123"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
                      pattern="\(\d{3}\) \d{3}-\d{4}"
                      title="Please enter a valid 10-digit phone number"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 invalid:border-red-300 focus:invalid:border-red-400"
                  />
                </div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Service Needed *</label><select required name="service" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm bg-white text-slate-900"><option value="">Select a service...</option>{[config.primaryService, ...services].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1">Project Details</label><textarea name="message" rows={3} placeholder="Describe your project (e.g. Siding replacement, roof leak...)" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 resize-none" /></div>
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

      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 30s linear infinite; }` }} />

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          ORIGINAL SECTIONS BELOW (Stats, Why Us, Services, etc.)
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}

      {/* Services - Clean card list */}
      <section id="services" className="py-24 scroll-mt-20" style={{ backgroundColor: '#eff6ff' /* Blue-50 subtle tint */, borderTop: `1px solid ${t.border}` }}>
        <div className={shellClass}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-8" style={{ backgroundColor: action /* Orange for pop */ }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Our Capabilities</p>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color: t.textPrimary }}>Our Services</h2>
            </div>
            <p className="text-sm font-medium font-mono border-l-2 pl-4 py-1 max-w-sm" style={{ color: t.textSecondary, borderColor: action }}>
              Full licensed professionals serving {config.city}.<br />Same-week availability for new clients.
            </p>
          </div>
          <motion.div variants={staggerSoft} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allServices.map((service, i) => (
              <motion.div key={service.name} className="group flex flex-col justify-between overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}` }}>
                {/* Service Image Area */}
                <div className="aspect-[16/9] w-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
                  <NextImage
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/15 to-transparent" />

                  {/* Overlay title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/35 to-transparent">
                    <span className="text-xs font-mono font-bold text-white/90">SERVICE 0{i + 1}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 leading-tight" style={{ color: t.textPrimary }}>{service.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: t.textSecondary }}>{service.desc}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t" style={{ borderColor: t.border }}>
                    <button type="button" className="w-full py-2 text-xs font-black uppercase tracking-widest flex items-center justify-between group-hover:gap-4 transition-all" style={{ color: action }} onClick={scrollToQuote}>
                      <span>Get Quote</span>
                      <span>ΓåÆ</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us - Premium Quality Focus */}
      <section id="why-us" className="relative scroll-mt-20 overflow-hidden">
        {/* Top Transition - Industrial Arc (seamless from Services) */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-24 z-20 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full text-blue-50 fill-current" style={{ color: '#eff6ff' }}>
            <path d="M0,0 L1440,0 L1440,40 Q720,120 0,40 Z" />
          </svg>
        </div>

        <div className="absolute inset-0" aria-hidden="true">
          <NextImage
            src="/images/whyustest.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.80) 100%)' }} />

        <div className="relative pt-32 pb-48 md:pb-64 z-10">
          <div className={shellClass}>
            {/* Split Panel Spec Sheet - Industrial Card */}
            {/* Split Panel Spec Sheet - Industrial Card - Moved Down */}
            <div className="relative mt-12 md:mt-20 rounded-none border-2 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row isolate">
              {/* Left Side - Specs & Text */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-1 w-8 bg-orange-500" />
                  <span className="text-xs font-mono text-orange-500 font-bold tracking-widest uppercase">Specification Sheet</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-8">
                  Built on Trust. <br />
                  <span className="text-slate-500">Driven by Quality.</span>
                </h2>

                <div className="space-y-0 border-t border-slate-800">
                  {benefits.map((benefit, i) => (
                    <div key={benefit} className="flex items-center justify-between py-4 border-b border-slate-800 group hover:bg-white/5 transition-colors px-2 -mx-2">
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-wide group-hover:text-white transition-colors">{benefit}</span>
                      <Check className="h-4 w-4 text-orange-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 flex gap-8">
                  <div>
                    <div className="text-3xl font-black text-white leading-none">100%</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase mt-1">Written Estimates</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white leading-none">{years}+</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase mt-1">Years Experience</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image Panel */}
              <div className="relative md:w-1/2 min-h-[400px] md:min-h-full border-t-2 md:border-t-0 md:border-l-2 border-slate-700">
                <NextImage
                  src="/images/whyus_popout.webp"
                  alt="Elite craftsmanship detail"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-[30%] sepia-[10%] opacity-80 mix-blend-overlay md:mix-blend-normal"
                />
                <div className="absolute inset-0 bg-slate-900/30 md:bg-transparent" />

                {/* Quote Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 text-orange-500 fill-orange-500" />)}
                  </div>
                  <p className="text-lg text-white font-medium italic leading-relaxed font-mono">
                    &ldquo;We use the best materials and expert crews. Your home renovation adds lasting value.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Transition - Industrial Chamfer (Inverse) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 z-20 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
            <path d="M0,120 L1440,120 L1440,80 Q720,0 0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Guarantee - Industrial Stamp (Overlapping) */}
      <section className="relative z-30 -mt-32 pb-12">
        <div className={shellClass}>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-l-8 border-slate-900 bg-white p-10 md:p-12 shadow-2xl shadow-slate-900/20">
            <div className="shrink-0 p-5 bg-slate-100 rounded-lg">
              <ShieldCheck className="w-10 h-10 text-slate-900" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black uppercase text-slate-900 mb-3 tracking-tight">The Elite Quality Promise</h3>
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                If you aren&apos;t completely satisfied with our craftsmanship, we will make it right. <span className="text-slate-900 font-bold">No exceptions.</span>
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button type="button" onClick={scrollToQuote} className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white text-sm font-black uppercase tracking-widest px-10 py-5 transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-600/30">
                Get Your Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase - Carousel Style */}
      <section id="work" className="pb-24 pt-12 overflow-hidden" style={{ backgroundColor: t.surfaceBg }}>
        <div className={shellClass}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60" style={{ color: t.textPrimary }}>Our Portfolio</p>
              <h2 className="text-4xl font-black md:text-5xl" style={{ color: t.textPrimary }}>Project Showcase</h2>
            </div>

            <div className="hidden md:flex gap-2">
              <div className="h-1 w-20 rounded-full opacity-20" style={{ backgroundColor: t.textPrimary }} />
              <div className="h-1 w-4 rounded-full" style={{ backgroundColor: action }} />
            </div>
          </div>

          {/* Snap Scroll Container - Optimized with Next.js Image */}
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

      {/* Reviews - Dark Google Themed Section */}
      <section id="proof" className="relative py-24 overflow-hidden" style={{ borderTop: `4px solid ${accent}`, borderBottom: `4px solid ${accent}` }}>
        <div className="absolute inset-0" aria-hidden="true">
          <NextImage
            src="/images/reviews_background.png"
            alt="Luxury home exterior background"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={reviewPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {config.testimonials.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage).map((testimonial, idx) => (
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
                            {testimonial.localGuide && 'Local Guide ΓÇó '}
                            {testimonial.reviewCount || 1} reviews
                            {testimonial.photos ? ` ΓÇó ${testimonial.photos} photos` : ''}
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
                    <p className="text-sm text-slate-200 leading-relaxed mb-4 font-medium relative z-10 line-clamp-6">&ldquo;{testimonial.quote}&rdquo;</p>

                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/10 relative z-10">
                      {['Professionalism', 'Punctuality', 'Quality', 'Value'].slice(0, 2 + (idx % 3)).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-white/90 uppercase tracking-wide bg-gradient-to-r from-white/10 to-transparent px-2 py-1 rounded border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevReviewPage}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous reviews"
              >
                <ArrowRight className="h-6 w-6 rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalReviewPages }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${i === reviewPage ? 'bg-white w-4' : 'bg-white/30'}`}
                  />
                ))}
              </div>
              <button
                onClick={nextReviewPage}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next reviews"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a href="https://share.google/E7Sq2Rf1n6Afv6HJJ" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-lg font-black uppercase tracking-wide hover:scale-105 transition-transform shadow-lg">
              <GoogleLogo className="h-5 w-5" />
              Read all reviews
            </a>
          </div>
        </div>
      </section>

      {/* Process - Professional Steps */}
      <section className="py-24 relative" style={{ backgroundColor: t.surfaceBg }}>
        <div className={shellClass}>
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black md:text-5xl mb-6 tracking-tight" style={{ color: t.textPrimary }}>Our Simple Process</h2>
            <p className="text-lg font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: t.textSecondary }}>
              From estimate to installation, we make it seamless.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = [ClipboardList, Hammer, Check][index];
              return (
                <div key={step.title} className="relative group">
                  <div className="relative z-10 bg-white p-10 h-full shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-slate-900 hover:border-orange-500">
                    <div className="flex items-center justify-between mb-8">
                      {/* Icon */}
                      <div className="flex items-center justify-center h-16 w-16 bg-slate-50 rounded-none text-slate-900 border border-slate-100 group-hover:bg-orange-50 transition-colors">
                        <Icon className="h-8 w-8 text-slate-700 group-hover:text-orange-600 transition-colors" />
                      </div>
                      {/* Number */}
                      <span className="text-6xl font-black opacity-5 font-sans text-slate-900 group-hover:opacity-10 transition-opacity">0{index + 1}</span>
                    </div>

                    <h3 className="text-xl font-black mb-4 uppercase tracking-tight" style={{ color: t.textPrimary }}>{step.title}</h3>
                    <p className="text-base font-medium leading-relaxed text-slate-600">{step.body}</p>
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
              <h2 className="text-2xl font-bold md:text-3xl" style={{ color: t.textPrimary }}>FAQ</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: t.textMuted }}>Still have questions? Call us directly.</p>
              <a href={`tel:${cleanPhone}`} className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]" style={{ backgroundColor: action, boxShadow: `0 4px 12px ${action}30` }}><Phone className="h-4 w-4" />{config.phone}</a>
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
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl text-white">Get Your Free Home Repair Estimate</h2>
            <p className="mt-4 text-xl font-bold text-white">Protect your home with durable, high-quality work</p>
            <p className="mt-2 text-base font-medium text-white/90">Serving homeowners in Kingwood, Humble, The Woodlands, Spring, Atascocita, and Houston</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-shrink-0">
            <button type="button" className="rounded px-8 py-4 text-base font-black shadow-xl uppercase tracking-wide transition-all hover:scale-105" style={{ backgroundColor: 'white', color: accent }} onClick={scrollToQuote}>{config.ctaPrimary}</button>
            <a href={`tel:${cleanPhone}`} className="inline-flex items-center justify-center gap-2 rounded px-8 py-4 text-base font-black uppercase tracking-wide transition-all hover:bg-white/10" style={{ border: `3px solid white`, color: 'white' }}><Phone className="h-5 w-5" />{config.phone}</a>
          </div>
        </div>
      </section>

      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          FOOTER - Industrial Blueprint Style
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
          FOOTER - Premium Architectural Style ("The Estate")
      ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
      <footer className="bg-slate-950 text-slate-300 py-20 border-t border-slate-900 font-sans">
        <div className={shellClass}>
          <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">

            {/* COL 1: IDENTITY & TRUST */}
            <div className="space-y-6">
              <NextImage
                src="/tree_pro/tree_logo.svg"
                alt={config.businessName}
                width={160}
                height={40}
                unoptimized
                className="h-10 w-auto opacity-90"
              />
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                Setting the standard for home renovation in Kingwood. We replace average with exceptional.
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />)}</div>
                  <span>Top Rated Local Pro</span>
                </div>
              </div>
            </div>

            {/* COL 2: CORE EXPERTISE */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Expertise</h4>
              <ul className="space-y-3 text-sm">
                {[
                  'Roofing Systems',
                  'Siding Replacement',
                  'Exterior Painting',
                  'Window Installation',
                  'Custom Patios',
                  'Gutters & Drainage',
                ].map(item => (
                  <li key={item}>
                    <a href="#services" className="hover:text-amber-500 transition-colors flex items-center gap-2 group">
                      <span className="h-px w-0 bg-amber-500 group-hover:w-3 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COL 3: SERVICE AREA */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Service Area</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-200 block mb-1">Kingwood (HQ)</strong>
                    Humble, Atascocita, Porter - fast help for siding and exterior repairs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-200 block mb-1">The Woodlands</strong>
                    Spring, Conroe, Tomball - trusted roofing, painting, and window updates.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-200 block mb-1">Greater Houston</strong>
                    Houston, Katy, Sugar Land, Cypress - dependable repairs that protect home value.
                  </span>
                </li>
              </ul>
            </div>

            {/* COL 4: ACTION */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Contact</h4>
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Speak with an expert</p>
                <a href={`tel:${cleanPhone}`} className="block text-2xl font-bold text-white mb-6 hover:text-amber-500 transition-colors">{config.phone}</a>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{config.address}</p>

                <button
                  onClick={scrollToQuote}
                  className="w-full py-3 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded transition-all hover:bg-amber-500 hover:text-white"
                >
                  Request Quote
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-4 text-center">
                Response within 15 minutes during business hours.
              </p>
            </div>

          </div>

          <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} {config.businessName}. All rights reserved.</p>
            <p className="flex items-center gap-4">
              <span className="text-slate-500">Website by <a href="https://quicklaunchweb.us" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">QuickLaunchWeb</a></span>
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
        <div className="mx-auto flex max-w-md gap-3 rounded p-3 shadow-2xl" style={{ backgroundColor: t.cardBg, border: `3px solid ${accent}` }}>
          <a href={`tel:${cleanPhone}`} className="flex flex-1 items-center justify-center gap-2 rounded px-3 py-3 text-sm font-black uppercase tracking-wide transition-all" style={{ border: `2px solid ${t.border}`, color: t.textPrimary }}><Phone className="h-4 w-4" />Call</a>
          <button type="button" className="flex-1 rounded px-3 py-3 text-sm font-black text-white uppercase tracking-wide shadow-lg transition-all" style={{ backgroundColor: accent }} onClick={scrollToQuote}>Get Quote</button>
        </div>
      </div>

      {/* Lightbox Modal - Optimized */}


    </div>
  );
}

