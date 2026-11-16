'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveLivingCanvas from '@/components/InteractiveLivingCanvas';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Globe,
  MessageSquare,
  ShieldAlert,
  Award,
  BookOpen,
  Cpu,
  Layers,
  HeartPulse,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Users,
  Grid,
  X,
  Stethoscope,
  Lock,
  ArrowRight,
  Timer,
  Activity,
  Terminal,
  FileCode2,
  Flame,
  Info,
  Droplet,
  Heart,
  ShieldCheck,
  Building2,
  Smartphone,
  Eye,
  Microscope,
  Network,
  Scale,
  Hospital,
  Compass,
  Check,
} from 'lucide-react';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // 7-Minute Jury Pitch Timer
  const [timerSeconds, setTimerSeconds] = useState(420); // 7 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const isAr = language === 'ar';
  const totalSlides = 12;

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(420);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowGridDrawer(false);
        setShowNotes(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  // Real Team Members of Group 01 (Academic Students - No Roles)
  const teamMembers = [
    {
      nameAr: 'محمد قصي عبد الكريم',
      nameEn: 'Mohammed Qusai Abdul Karim',
      color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20',
      dotColor: 'bg-cyan-400',
    },
    {
      nameAr: 'أنور مرعي حسن',
      nameEn: 'Anwar Marei Hassan',
      color: 'border-teal-500/40 text-teal-300 bg-teal-950/20',
      dotColor: 'bg-teal-400',
    },
    {
      nameAr: 'عبد الباسط أحمد ناصر',
      nameEn: 'Abdul Basit Ahmed Nasser',
      color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20',
      dotColor: 'bg-emerald-400',
    },
    {
      nameAr: 'عبد الله دليل سالم',
      nameEn: 'Abdullah Dalil Salem',
      color: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/20',
      dotColor: 'bg-indigo-400',
    },
    {
      nameAr: 'حسن حامد حسن',
      nameEn: 'Hassan Hamid Hassan',
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/20',
      dotColor: 'bg-amber-400',
    },
  ];

  // 12 SLIDES CONTENT DEFINITIONS (Bilingual EN / AR)
  const slides = [
    // ==========================================
    // SLIDE 1: COVER & OFFICIAL IDENTITY
    // ==========================================
    {
      id: 1,
      badge: isAr ? 'المشروع الجامعي الرسمي • Group 01' : 'Official Academic Project • Group 01',
      title: isAr
        ? 'المساعد الطبي الذكي للتثقيف بمرض السكري من النوع الثاني'
        : 'Type 2 Diabetes Educational Assistant — Group 01',
      subtitle: isAr
        ? 'منظومة ذكاء اصطناعي سريرية رصينة مقيدة بـ 25 مصدراً دولياً معتمداً'
        : 'Evidence-Grounded Clinical AI Prototype for Patient Education & Misinformation Defense',
      speakerNotes: isAr
        ? 'نبدأ العرض بالترحيب بلجنة التحكيم الموقرة، والتعريف بالجامعة التقنية الشمالية وفريق Group 01، ثم إطلاق رسالة المشروع كحل تثقيفي سريري رصين.'
        : 'Welcome the examination committee, introduce Northern Technical University and team Group 01, establishing the clinical safety mission.',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto h-full px-2 py-4">
          {/* Top Academic Ribbon with University Crest Frame */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-5">
            {/* Prestigious University Crest Frame with 21st-century Floating Levitation */}
            <motion.div
              animate={{ y: [-5, 6, -5], rotate: [-0.6, 0.6, -0.6] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="relative group cursor-pointer"
            >
              <motion.div
                animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.5, 0.85, 0.5] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="absolute -inset-3 bg-gradient-to-tr from-amber-400/40 via-teal-500/40 to-cyan-400/40 rounded-3xl blur-xl pointer-events-none"
              />
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] p-2 flex flex-col items-center justify-center backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_45px_rgba(20,184,166,0.35)]">
                <img
                  src="/ntu-logo.png"
                  alt="Northern Technical University Crest"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(20,184,166,0.3)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* University & Group Details */}
            <div className="text-center sm:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wide mb-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'الجامعة التقنية الشمالية • Northern Technical University' : 'Northern Technical University • Group 01'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                {isAr ? 'مشروع مسابقة الذكاء الاصطناعي الأكاديمية' : 'Academic AI Project Competition'}
              </h3>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-teal-400 font-semibold font-mono">Group 01</span>
                <span>•</span>
                <span>{isAr ? 'العام الأكاديمي 2025 - 2026' : 'Academic Year 2025 - 2026'}</span>
              </p>
            </div>
          </div>

          {/* Bot Name & Official Identity Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 shadow-lg shadow-teal-500/10 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-extrabold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {isAr ? 'المساعد الطبي الذكي للتثقيف بمرض السكري من النوع الثاني' : 'Type 2 Diabetes Educational Assistant'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800">
              Group 01
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-teal-200 via-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-3 leading-tight max-w-4xl">
            {isAr
              ? 'المساعد الطبي الذكي للتثقيف بمرض السكري من النوع الثاني (Group 01)'
              : 'Type 2 Diabetes Educational Assistant — Group 01'}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-3xl mx-auto mb-6 font-light leading-relaxed">
            {isAr
              ? 'نظام ذكاء اصطناعي سريري هجين مقيد بنسبة 100% بـ 25 مصدراً طبياً عالمياً معتمداً، محصن ضد أخطاء الجرعات والتشخيص، ومبرمج لدعم المريض باللهجة الدارجة ورفع الوعي الصحي المجتمعي.'
              : 'Evidence-grounded dual-engine clinical AI prototype strictly bounded by 25 authoritative health organizations. Robust clinical boundaries, safe triage, and native dialect fluency.'}
          </p>

          {/* Student Names (Pure Names, No Roles) */}
          <div className="w-full max-w-4xl p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 px-1">
              <span className="text-xs uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isAr ? 'فريق العمل والطلبة الباحثين (Group 01):' : 'Project Researchers & Students (Group 01):'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {isAr ? 'الجامعة التقنية الشمالية • 2025 - 2026' : 'Northern Technical University • 2025 - 2026'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-start">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border ${member.color} hover:border-teal-400/60 transition-all duration-300 shadow-sm flex items-center gap-2`}
                >
                  <span className={`w-2 h-2 rounded-full ${member.dotColor} shrink-0`} />
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-slate-100">
                      {isAr ? member.nameAr : member.nameEn}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {isAr ? member.nameEn : member.nameAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 2: EPIDEMIOLOGICAL BURDEN & PROBLEM
    // ==========================================
    {
      id: 2,
      badge: isAr ? 'السياق والعبء الوبائي' : 'Epidemiological Burden',
      title: isAr
        ? 'عبء وباء السكري: تحدٍ صحي واقتصادي متسارع في العراق والعالم'
        : 'The Global & Regional Diabetes Epidemic Burden',
      subtitle: isAr
        ? 'أرقام انتشار متصاعدة، نصف الحالات غير مشخصة، ومضاعفات مدمرة تستنزف المنظومة الصحية'
        : 'Skyrocketing prevalence, delayed diagnosis windows, and severe multi-organ complications',
      speakerNotes: isAr
        ? 'نوضح للدكتور حجم المشكلة: أكثر من 537 مليون مصاب عالمياً، ومعدلات تفوق 14-17% في المنطقة، مع خطورة أن 50% من المرضى لا يعلمون بإصابتهم إلا بعد حدوث مضاعفات.'
        : 'Present key epidemiological figures: 537M global cases, 14-17% regional prevalence, and the silent 50% undiagnosed window.',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto h-full items-center">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-rose-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'أرقام الانتشار الكبرى' : 'Epidemic Scale'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? '537+ مليون مصاب عالمياً' : '537M+ Adults Globally'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'تسجل منطقة الشرق الأوسط والعراق واحدة من أعلى نسب الإصابة بالسكري من النوع الثاني (تتجاوز 14-17%) نتيجة تغير أنماط التغذية وقلة النشاط البدني والاستعداد الوراثي.'
                  : 'The Middle East and Iraq report one of the highest global prevalence rates (>14-17%) driven by rapid lifestyle changes and genetic susceptibility.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'توقعات بارتفاع إلى 783 مليون بحلول 2045' : 'Projected 783M cases by 2045 (IDF)'}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'القاتل الصامت' : 'Silent Window'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? '50% غير مشخصين مبكراً' : '50% Live Undiagnosed'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'يتطور المرض بصمت لسنوات دون أعراض حادة. يكتشف الكثيرون إصابتهم بالصدفة بعد أن تكون الأوعية الدموية الدقيقة قد بدأت بالتلف بالفعل في مرحلة ما قبل السكري.'
                  : 'Type 2 progresses quietly without acute symptoms. Half of patients remain undiagnosed until microvascular and macrovascular damage is already underway.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'تأخر تشخيصي يتراوح بين 4 إلى 7 سنوات' : 'Average 4-7 years diagnostic delay'}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/30">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'فاتورة المضاعفات' : 'Complications Toll'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? 'مضاعفات متعددة الأعضاء' : 'Multi-Organ Damage'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'إهمال السكر يؤدي إلى الفشل الكلوي (السبب الأول للغسيل الكلوي)، اعتلال الشبكية وفقدان البصر، البتر السكري للأطراف، ومضاعفات القلب والجلطات الدماغية.'
                  : 'Chronic hyperglycemia triggers diabetic nephropathy, retinopathy blindness, peripheral neuropathy amputations, and cardiovascular morbidity.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'التثقيف المبكر يمنع 80% من المضاعفات' : 'Education prevents 80% of complications'}</span>
            </div>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 3: PATHOPHYSIOLOGY OF TYPE 2 DIABETES
    // ==========================================
    {
      id: 3,
      badge: isAr ? 'الفسلجة الطبية وآلية المرض' : 'Pathophysiology of T2D',
      title: isAr
        ? 'الفسلجة السريرية: كيف تحدث مقاومة الإنسولين وإجهاد البنكرياس؟'
        : 'Clinical Pathophysiology: Insulin Resistance & Beta-Cell Failure',
      subtitle: isAr
        ? 'الفهم الطبي الرصين لآليات المرض الثلاث: مقاومة المستقبلات، إجهاد خلايا بيتا، وإنتاج الكبد المفرط'
        : 'The core triad: peripheral receptor resistance, pancreatic exhaustion, and hepatic dysregulation',
      speakerNotes: isAr
        ? 'هذا السلايد يبهر الأستاذ الطبيب: نوضح أن السكري النوع 2 ليس نقصاً أولياً في الإنسولين، بل مقاومة في العضلات والكبد تجبر البنكرياس على العمل المفرط حتى يتعب، ونقارنه بالنوع الأول المناعي.'
        : 'Impress the medical examiner by explaining that Type 2 starts with peripheral resistance and beta-cell compensatory hyperinsulinemia, unlike Type 1 autoimmune destruction.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          {/* 3 Mechanisms Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
                <Microscope className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
                Mechanism 01
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '1. مقاومة الإنسولين المحيطية' : '1. Insulin Resistance'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'تفقد خلايا العضلات والأنسجة الدهنية حساسيتها للإنسولين، فتغلق بوابات امتصاص الجلوكوز رغم وفرة الإنسولين في مجرى الدم.'
                  : 'Skeletal muscles and adipose tissue receptors lose insulin sensitivity, blocking glucose uptake despite circulating insulin.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                Mechanism 02
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '2. إجهاد خلايا بيتا بالبنكرياس' : '2. Beta-Cell Exhaustion'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'يعوض البنكرياس بضخ كميات مضاعفة من الإنسولين (فرط الإنسولين التعويضي)، ومع مرور السنوات تفقد خلايا بيتا كفاءتها وتتراجع قدرتها الإفرازية.'
                  : 'Pancreatic beta-cells overcompensate with hyperinsulinemia, leading to cellular stress, glucotoxicity, and progressive secretory decline.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                Mechanism 03
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '3. زيادة إنتاج الكبد للجلوكوز' : '3. Hepatic Glucose Output'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'يفقد الكبد إشارته الكابحة فيستمر في ضخ الجلوكوز إلى الدم حتى أثناء الصيام والنوم، وهو السبب الرئيسي لارتفاع السكر الصباحي.'
                  : 'The liver fails to sense insulin suppression, continuously pumping endogenous glucose into the bloodstream even during fasting.'}
              </p>
            </div>
          </div>

          {/* Type 1 vs Type 2 Comparison Pill */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="text-start">
              <h5 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-400" />
                <span>{isAr ? 'الفارق الجوهري بين السكري النوع 1 والنوع 2:' : 'Key Distinction: Type 1 vs Type 2'}</span>
              </h5>
              <p className="text-xs text-slate-300 mt-1 font-light">
                {isAr
                  ? 'النوع 1 تلف مناعي ذاتي مطلق لخلايا بيتا يتطلب إنسولين فوري، بينما النوع 2 اضطراب أيضي تدريجي يرتبط بنمط الحياة ومقاومة الإنسولين ويمكن السيطرة عليه بالحمية والرياضة والأدوية.'
                  : 'Type 1 is autoimmune destruction of beta-cells requiring lifelong insulin; Type 2 is a progressive metabolic lifestyle disorder manageable with diet, exercise, and oral agents.'}
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-800 text-xs font-mono font-bold shrink-0">
              {isAr ? 'مرض أيضي سلوكي' : 'Metabolic Etiology'}
            </span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 4: HEALTH LITERACY & MISINFORMATION
    // ==========================================
    {
      id: 4,
      badge: isAr ? 'فجوة التثقيف ومخاطر الخرافات' : 'Health Literacy & Myths',
      title: isAr
        ? 'فجوة الوعي الصحي: خطر الوصفات الشعبية وفخ الذكاء الاصطناعي العام'
        : 'Health Literacy Gap: Folk Remedy Risks & Generic AI Pitfalls',
      subtitle: isAr
        ? 'كيف يدفع المريض العراقي ثمن الشائعات من صحته؟ ولماذا تفشل نماذج الـ AI العامة في التثقيف؟'
        : 'Dangerous community misconceptions and why ungrounded LLMs hallucinate hazardous advice',
      speakerNotes: isAr
        ? 'نستعرض الواقع المجتمعي: خرافات شرب ماء البامية أو القرفة كبديل للإنسولين، وخرافة أن العسل والتمر لا يرفعان السكر، ومخاطر الشات بوت العام مثل ChatGPT الذي يختلق جرعات عشوائية دون فحص الكلى.'
        : 'Highlight real regional folk remedy myths (boiled okra, cinnamon replacing insulin, raw honey belief) and generic AI dangers (fabricating dosages without lab reviews).',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto h-full items-center">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-rose-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'خرافات متوارثة' : 'Folk Remedy Traps'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? '1. بدائل الأعشاب الزائفة' : '1. False Herbal Cures'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'انتشار معتقدات مضللة مثل: "منقوع البامية أو القرفة يغني عن الإنسولين والأدوية"، مما يدفع المريض لإيقاف علاجه والدخول في غيبوبة كيتونية حادة (DKA) مهددة للحياة.'
                  : 'Dangerous myths claim boiled okra water or cinnamon cure diabetes, causing patients to discontinue therapy and enter life-threatening DKA crises.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'سبب مباشر لانتكاسات الطوارئ' : 'Direct cause of acute ICU admissions'}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'مفهوم السكر الطبيعي' : 'Natural Sugar Fallacy'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? '2. خرافة التمر والعسل' : '2. Dates & Honey Myth'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'الاعتقاد السائد بأن "العسل الطبيعي أو التمر لا يرفعان السكر لأنهما طبيعيان". بينما علمياً كلاهما كربوهيدرات غنية بالجلوكوز والفركتوز ترفع السكر سريعاً وتتطلب حساباً دقيقاً.'
                  : 'The belief that natural honey and dates do not spike glucose. Physiologically, both are carbohydrate-dense sugars that drastically elevate glycemia.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'تصحيح علمي بدون حرمان كامل' : 'Evidence-based portion education'}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-500/40 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'هلوسة النماذج العامة' : 'LLM Hallucinations'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {isAr ? '3. مخاطر الـ AI العام' : '3. Generic AI Prescriptions'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'روبوتات الذكاء الاصطناعي العامة تختلق روابط إنترنت وهمية 404، وتجرؤ على تحديد جرعات أدوية عشوائية للمريض دون معرفة وظائف كليته، مما يشكل خطراً قانونياً وسريرياً جسيماً.'
                  : 'Generic chatbots fabricate non-existent URLs and attempt to prescribe pharmacological dosages without renal lab checks, creating severe medicolegal hazards.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'الحل: منظومة Group 01 المقيدة 100%' : 'Solution: Strict Grounded Group 01 AI'}</span>
            </div>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 5: 25 VERIFIED CLINICAL AUTHORITIES
    // ==========================================
    {
      id: 5,
      badge: isAr ? 'المرجعية العلمية المعتمدة' : 'Verified Clinical Authorities',
      title: isAr
        ? 'المرجعية العلمية: 25 مصدراً دولياً معتمداً عبر 5 ملفات معيارية'
        : '25 Official Clinical Authorities Across 5 Structured Modules',
      subtitle: isAr
        ? 'فحص مباشر لروابط أعلى المنظمات الصحية العالمية مع فهرس رقمي يمنع الروابط الوهمية تماماً'
        : 'Direct active live links from WHO, CDC, MedlinePlus (NIH), NHS UK, NIDDK, and ADA',
      speakerNotes: isAr
        ? 'نؤكد للجنة أن كافة معلومات البوت مستقاة من 25 مصدراً رسمياً خضعت للتحقق المباشر بروابط HTTP 200 OK، مقسمة على 5 ملفات معيارية مفهرسة برمجياً في verified_sources_index.json.'
        : 'Emphasize that 100% of educational content is indexed from 25 active clinical URLs (WHO, CDC, ADA, NIH, NHS, NIDDK) with zero broken 404 links.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          {/* 6 Major Organizations Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mb-4 text-center">
            {[
              { name: 'WHO', label: isAr ? 'منظمة الصحة العالمية' : 'World Health Org', count: '5 Sources', color: 'from-blue-500 to-cyan-400' },
              { name: 'CDC', label: isAr ? 'مراكز السيطرة الأمريكية' : 'CDC Atlanta', count: '6 Sources', color: 'from-teal-500 to-emerald-400' },
              { name: 'MedlinePlus', label: isAr ? 'المعاهد الوطنية NIH' : 'US National Library', count: '6 Sources', color: 'from-indigo-500 to-blue-400' },
              { name: 'NHS UK', label: isAr ? 'هيئة الصحة البريطانية' : 'UK Health Service', count: '4 Sources', color: 'from-sky-500 to-teal-400' },
              { name: 'NIDDK', label: isAr ? 'المعهد الوطني للسكري' : 'NIDDK (NIH)', count: 'Key Sources', color: 'from-purple-500 to-indigo-400' },
              { name: 'ADA', label: isAr ? 'الجمعية الأمريكية للسكري' : 'American Diabetes Ass.', count: '4 Sources', color: 'from-amber-500 to-rose-400' },
            ].map((org, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
                <span className={`text-base font-black bg-gradient-to-r ${org.color} bg-clip-text text-transparent block font-mono`}>
                  {org.name}
                </span>
                <p className="text-[11px] font-bold text-slate-200 mt-1 truncate">{org.label}</p>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono mt-1.5 inline-block border border-slate-700">
                  {org.count}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-teal-500/30 backdrop-blur-xl shadow-xl">
            <h4 className="text-xs uppercase tracking-widest text-teal-400 font-extrabold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isAr ? 'ملفات قاعدة المعرفة الخمسة المفهرسة برمجياً:' : '5 Knowledge Base Modules & Verification Index:'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-mono text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 25/25 HTTP 200 OK
              </span>
            </h4>

            {/* 5 Markdown Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3 text-center">
              {[
                { file: '01_basic_concepts', titleAr: 'المفاهيم وسكر الدم', titleEn: 'Concepts & Glucose' },
                { file: '02_symptoms_risks', titleAr: 'الأعراض وعوامل الخطر', titleEn: 'Symptoms & Risks' },
                { file: '03_prevention_care', titleAr: 'الوقاية وقاعدة ABCs', titleEn: 'Prevention & Care' },
                { file: '04_misconceptions', titleAr: 'تصحيح الخرافات الشائعة', titleEn: 'Myth Busting' },
                { file: '05_warning_safety', titleAr: 'علامات الخطر والأمان', titleEn: 'Emergency & Safety' },
              ].map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                  <span className="text-[10px] font-mono text-teal-400 block mb-0.5">Module 0{idx + 1}</span>
                  <p className="font-bold text-[11px] text-slate-100 truncate">{isAr ? m.titleAr : m.titleEn}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-light">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'فهرس verified_sources_index.json يضمن دقة الاقتباس السريري.' : 'verified_sources_index.json guarantees zero hallucinated links.'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'فلتر آلي في الباك إند يستبعد أي رابط خارجي غير معتمد.' : 'Backend citation sanitizer strips any unapproved external URL.'}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 6: THE GOLDEN WINDOW & DIABETES REMISSION
    // ==========================================
    {
      id: 6,
      badge: isAr ? 'النافذة الذهبية والهدأة السريرية' : 'The Golden Window & Remission',
      title: isAr
        ? 'النافذة الذهبية والهدأة السريرية: هل يمكن عكس السكري من النوع الثاني؟'
        : 'The Golden Window & Remission: Can Type 2 Diabetes Be Reversed?',
      subtitle: isAr
        ? 'أحدث ما توصلت إليه أبحاث ADA ودراسة DiRECT: استعادة كفاءة خلايا بيتا وعكس ما قبل السكري بنمط الحياة'
        : 'Groundbreaking ADA consensus & DiRECT trial evidence: beta-cell rest and reversing prediabetes without drugs',
      speakerNotes: isAr
        ? 'نشرح للدكتور أن السكري من النوع الثاني لم يعد حكماً أبدياً؛ فوفق دراسة DiRECT وتوافق ADA الحديث، فإن فقدان الوزن الصحي في أول 3-5 سنوات يمنح المريض فرصة الهدأة السريرية الكاملة والتحكم بالسكر بدون أي أدوية.'
        : 'Highlight that modern clinical guidelines (ADA 2024 & DiRECT trial) recognize Diabetes Remission (HbA1c <6.5% for >3 months without medication) through early lifestyle intervention and 10-15% weight loss.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Pillar 1: Prediabetes Reversal */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  100% Reversible
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                  {isAr ? '1. عكس ما قبل السكري' : '1. Reversing Prediabetes'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isAr
                    ? 'مرحلة ما قبل السكري (التراكمي 5.7% – 6.4%) قابلة للتراجع الكامل وتفادي التحول للسكري بنسبة 58% – 71% بنمط الحياة وتخفيف الوزن بنسبة 7%.'
                    : 'Prediabetes (A1C 5.7%-6.4%) is fully reversible. The DPP trial showed 58%-71% reduction in diabetes incidence through moderate lifestyle changes.'}
                </p>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800 mt-3 inline-block">
                {isAr ? 'فرصة وقاية ذهبية' : 'Golden Opportunity'}
              </span>
            </div>

            {/* Pillar 2: Diabetes Remission Concept */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-teal-500/40 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
                  Clinical Remission
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                  {isAr ? '2. مفهوم الهدأة السريرية' : '2. Diabetes Remission'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isAr
                    ? 'تعريف ADA الحديث: بقاء السكر التراكمي أقل من 6.5% لمدة 3 أشهر على الأقل دون أي دواء مخفض للسكر. لا نسميه "شفاءً دائماً" بل "هدأة" تتطلب الاستمرار في العادات الصحية.'
                    : 'ADA definition: Maintaining HbA1c <6.5% for at least 3 months without glucose-lowering medications. Termed "remission" as healthy habits must continue.'}
                </p>
              </div>
              <span className="text-[10px] text-teal-300 font-mono bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800 mt-3 inline-block">
                {isAr ? 'HbA1c < 6.5% بدون علاج' : 'HbA1c < 6.5% Drug-Free'}
              </span>
            </div>

            {/* Pillar 3: The Golden Window Mechanism */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/30">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  DiRECT Trial Evidence
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                  {isAr ? '3. استعادة خلايا بيتا' : '3. Beta-Cell Reactivation'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isAr
                    ? 'في السنوات الأولى من التشخيص، تكون خلايا بيتا خاملة ومجهدة وليست تالفة نهائياً. إنقاص 10% إلى 15% من وزن الجسم يزيل الدهون من الكبد والبنكرياس فتعود الخلايا لإفراز الإنسولين.'
                    : 'Early in diagnosis, beta-cells are stressed rather than permanently lost. Losing 10-15% body weight removes ectopic fat, awakening natural insulin secretion.'}
                </p>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800 mt-3 inline-block">
                {isAr ? 'السنوات 1 إلى 5 الذهبية' : 'Early 1-5 Years Window'}
              </span>
            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-start">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs sm:text-sm text-slate-100">
                  {isAr ? 'رسالة البوت التثقيفية: غرس الأمل العملي المبني على الدليل العلمي' : 'EduBot Mission: Evidence-Based Hope & Timely Action'}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isAr
                    ? 'يبث المساعد الطبي في نفس المريض الأمل الواقعي؛ فبدلاً من اليأس واعتبار المرض قيداً أبدياً، يرشده لاغتنام هذه النافذة الذهبية تحت إشراف طبيبه.'
                    : 'Transforms patient mindset from helpless despair to proactive empowerment, guiding them to seize the early reversible window with their physician.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-800 text-xs font-mono font-bold shrink-0">
              DiRECT & ADA 2024
            </span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 7: MEDICOLEGAL BOUNDARIES & ETHICS
    // ==========================================
    {
      id: 7,
      badge: isAr ? 'المسؤولية الأخلاقية والقانونية' : 'Medicolegal Boundaries',
      title: isAr
        ? 'المسؤولية الطبية: لماذا يرفض البوت قطعاً تحديد الجرعات والتشخيص؟'
        : 'Medicolegal Boundaries: Strict Refusal of Dosing & Diagnosis',
      subtitle: isAr
        ? 'حماية حياة المريض خط أحمر: اشتراط فحص وظائف الكلى (eGFR) والتكامل الآمن مع الطبيب المعالج'
        : 'Why AI must never dose or diagnose: renal safety clearance (eGFR) and ethical physician triage',
      speakerNotes: isAr
        ? 'أهم نقطة يحبها الأستاذ الطبيب: نوضح فلسفة السلامة؛ تحديد جرعة الميتفورمين أو الإنسولين يحتاج فحص كلى eGFR وإنزيمات كبد وتاريخ مريض كامل، لذا يرفض البوت قطعاً وصف أي جرعة ويحيل فوراً للطبيب.'
        : 'Medical examiners love this slide: explain that Metformin/insulin dosing demands renal clearance (eGFR) and hepatic panels; hence the bot strictly refuses prescription and enforces physician referral.',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto h-full items-center">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-2">
              {isAr ? '1. حظر وصف الجرعات وتعديلها' : '1. Absolute Dosing Refusal'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-light">
              {isAr
                ? 'رفض قاطع لتحديد عدد حبات الميتفورمين (كلوكوفاج) أو وحدات الإنسولين. جرعة الدواء تعتمد حتماً على فحص ترشيح الكلى (eGFR)، ووظائف الكبد، والحالة القلبية التي يحددها الطبيب فقط.'
                : 'Zero tolerance for medication dosing (Metformin pills, insulin units). Dosing strictly depends on glomerular filtration rate (eGFR) and hepatic function assessed solely by the physician.'}
            </p>
            <span className="text-[10px] text-rose-300 font-mono bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800 inline-block font-semibold">
              {isAr ? 'مبدأ الأمان: لا ضرر ولا ضرار' : 'Primum Non Nocere'}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-2">
              {isAr ? '2. رفض التشخيص السريري الفردي' : '2. Non-Diagnostic Triage'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-light">
              {isAr
                ? 'إذا أدخل المستخدم قراءة فحص (مثل: تراكمي 6.9% أو سكر 135)، يشرح البوت المعايير التثقيفية العامة، لكنه يرفض الجزم بالتشخيص الفردي، لأن التشخيص يتطلب تأكيداً مخبرياً مزدوجاً وتقييماً شاملاً.'
                : 'When given lab readings, the bot explains standard diagnostic thresholds but explicitly refrains from delivering a definitive personal diagnosis, directing the patient to clinic confirmation.'}
            </p>
            <span className="text-[10px] text-amber-300 font-mono bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800 inline-block font-semibold">
              {isAr ? 'تثقيف توجيهي وليس عيادة بديلة' : 'Supportive Health Triage'}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-teal-500/40 shadow-xl backdrop-blur-md">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-2">
              {isAr ? '3. حماية الخصوصية وكشف الطوارئ' : '3. Privacy & Emergency Alert'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-light">
              {isAr
                ? 'حجب فوري للبيانات الشخصية الحساسة (PII)، مع كاشف أوتوماتيكي لأعراض الخطر الشديدة (مثل علامات DKA أو هبوط السكر <70 ملغ) لإطلاق تنبيه فوري بالتوجه إلى الطوارئ.'
                : 'Automated suppression of personally identifiable info (PII), coupled with instant emergency triggers for severe hypoglycemia (<70 mg/dL) or DKA symptoms directing to hospital care.'}
            </p>
            <span className="text-[10px] text-teal-300 font-mono bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800 inline-block font-semibold">
              {isAr ? 'شريط علوي دائم وحماية PII' : 'Continuous Header & PII Guard'}
            </span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 8: TECHNICAL ARCHITECTURE & PIPELINE
    // ==========================================
    {
      id: 8,
      badge: isAr ? 'المعمارية البرمجية والهندسة' : 'Technical Architecture',
      title: isAr
        ? 'معمارية النظام: مسار معالجة هجين يجمع ذكاء Gemini ومحرك RAG المحلي'
        : 'Engineering Architecture: 4-Stage Resilient RAG Pipeline',
      subtitle: isAr
        ? 'بنية تحتية مرنة في Next.js 14 تضمن سرعة الاستجابة (<20ms) وعدم الانقطاع حتى عند بطء الشبكة'
        : 'Next.js App Router, prompt grounding, instant benchmark matching, and local offline failover',
      speakerNotes: isAr
        ? 'نشرح المعمارية التقنية: مسار المعالجة من 4 مراحل يبدأ بتطبيع النص وكشف الأمان، ثم المطابق فائق السرعة، ثم نموذج Gemini السحابي مع محرك RAG المحلي كصمام أمان عند بطء الإنترنت.'
        : 'Walk through the 4-stage pipeline: Text normalization and safety triage, instant benchmark matcher (<5ms), cloud Gemini 1.5, and the resilient offline local RAG failover.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          {/* Architecture Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center mb-4">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 relative shadow-lg">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block mb-1">Stage 01</span>
              <h5 className="font-extrabold text-xs sm:text-sm text-slate-100">{isAr ? 'التطبيع والأمان' : 'Normalization'}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{isAr ? 'تطبيع اللهجة، حظر الخصوصية PII، وكشف الطوارئ' : 'Arabic Normalizer & Emergency Detector'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/50 relative shadow-lg">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">Stage 02</span>
              <h5 className="font-extrabold text-xs sm:text-sm text-slate-100">{isAr ? 'المطابق السريع' : 'Instant Matcher'}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{isAr ? 'مطابقة الأسئلة القياسية في <5ms بدقة 100%' : 'Pre-cached benchmark index (<5ms latency)'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/50 relative shadow-lg">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">Stage 03 (Hybrid)</span>
              <h5 className="font-extrabold text-xs sm:text-sm text-slate-100">{isAr ? 'Gemini + RAG المحلي' : 'Gemini + Local RAG'}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{isAr ? 'توليد سحابي مقيد مع تحول فوري للمحرك المحلي' : 'Cloud generative LLM + 1.5s local failover'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/50 relative shadow-lg">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">Stage 04</span>
              <h5 className="font-extrabold text-xs sm:text-sm text-slate-100">{isAr ? 'فلترة وتدقيق المصادر' : 'Citation Sanitizer'}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{isAr ? 'مطابقة الروابط بالـ 25 مصدراً وحظر أي رابط وهمي' : 'Sanitizes citations against 25 active URLs'}</p>
            </div>
          </div>

          {/* Tech Stack Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/30 mb-3">
            <span className="text-xs uppercase font-extrabold text-teal-400 flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              {isAr ? 'حزمة التقنيات البرمجية المعتمدة للمشروع:' : 'Official Project Technology Stack:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono font-bold text-cyan-300 block">Next.js 14 App Router</span>
                <span className="text-[10px] text-slate-400">{isAr ? 'الواجهة ومسارات API' : 'Framework & Edge Routing'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono font-bold text-indigo-300 block">Google Gemini API</span>
                <span className="text-[10px] text-slate-400">{isAr ? 'النموذج السحابي المقيد' : 'Cloud Grounded LLM'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono font-bold text-emerald-300 block">Local Grounded RAG</span>
                <span className="text-[10px] text-slate-400">{isAr ? 'المحرك المحلي دون إنترنت' : 'Zero-Lag Offline Engine'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono font-bold text-amber-300 block">TypeScript + Tailwind</span>
                <span className="text-[10px] text-slate-400">{isAr ? 'الأمان البرمجي والسريري' : 'Type Safety & Clinical UI'}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-teal-400 font-bold block mb-0.5">
              {isAr ? '⚡ ميزة صمام الأمان المحلي (Failover Guarantee):' : '⚡ Local Failover Resilience:'}
            </strong>
            <span>
              {isAr
                ? 'إذا تعثر الاتصال السحابي بسبب بطء الشبكة المحلية، يتحول النظام فوراً إلى المحرك المحلي المدمج دون أي توقف، مما يضمن تقديم الإرشاد الطبي بدقة سريرية 100% دائماً.'
                : 'If cloud latency spikes, the orchestrator seamlessly transitions to the local deterministic RAG engine, ensuring zero service disruption.'}
            </span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 9: CULTURAL & IRAQI DIALECT INTELLIGENCE
    // ==========================================
    {
      id: 9,
      badge: isAr ? 'الذكاء الثقافي واللغوي المحلي' : 'Cultural & Dialect Intelligence',
      title: isAr
        ? 'الذكاء الاصطناعي في خدمة اللهجة العراقية والواقع الغذائي اليومي'
        : 'AI in Service of Iraqi Dialect & Everyday Dietary Habits',
      subtitle: isAr
        ? 'تحويل مصطلحات الشارع العراقي إلى توجيهات طبية مبسطة مفهومة للإنسان البسيط دون تعقيد'
        : 'Comprehending colloquial Iraqi expressions and bridging cultural foods with clinical guidelines',
      speakerNotes: isAr
        ? 'نوضح للدكتور كيف يفهم البوت اللهجة العراقية الشعبية: مصطلحات مثل تمن ومرگة، ريوك، چاي وتمر، شگد أمشي، ركفة، ويجيب بطريقة علمية لطيفة لا تشعر المريض بالحرمان.'
        : 'Showcase how the system decodes real colloquial Iraqi phrasing (timman w marga, reyoog, chai w tamur, shgad amshi) into patient-friendly evidence-based advice.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-start">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 uppercase border border-teal-500/30">
                {isAr ? 'الواقع الغذائي العراقي' : 'Iraqi Dietary Context'}
              </span>
              <p className="font-bold text-xs text-slate-100 mt-2 mb-1">
                &quot;عيني سكري صاعد ورا ما أكلت تمن ومرگة دسمة، شسوي؟&quot;
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr ? 'البوت يفهم أن (التمن والمرگة) وجبة غنية بالنشويات والدهون، فيوجه لشرب الماء، المشي الخفيف 20 دقيقة، وتطبيق طريقة الصحن في الوجبة القادمة.' : 'Recognizes rice and rich stew, prescribing immediate hydration, light 20-min walking, and plate portioning.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 uppercase border border-amber-500/30">
                {isAr ? 'الفطور الشعبي العراقي' : 'Traditional Breakfast'}
              </span>
              <p className="font-bold text-xs text-slate-100 mt-2 mb-1">
                &quot;شنو أحسن ريوك صحي ومناسب لمريض السكر؟&quot;
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr ? 'يقترح بدائل متوفرة في البيت العراقي: البيض المسلوق، الجبن قريش/قليل الدسم، الخيار والطماطم، وخبز الشعير أو النخالة بدلاً من الصمون الأبيض.' : 'Recommends accessible staples: boiled eggs, low-fat cottage cheese, fresh greens, and whole-wheat/barley flatbread.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 uppercase border border-cyan-500/30">
                {isAr ? 'عادات الشاي والضيافة' : 'Tea & Hospitality Customs'}
              </span>
              <p className="font-bold text-xs text-slate-100 mt-2 mb-1">
                &quot;أكدر أشرب چاي بدون شكر بس وياه تمر لو يأثر؟&quot;
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr ? 'يوضح علمياً أن التمرة الواحدة تحتوي على كربوهيدرات ترفع السكر، ويقدم نصيحة بالاعتدال (حبة واحدة إلى حبتين كحد أقصى ضمن الخطة اليومية).' : 'Explains carbohydrate content of dates scientifically, advising moderation (1-2 dates max) without total cultural isolation.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/30">
                {isAr ? 'النشاط البدني والحركة' : 'Physical Activity Guidance'}
              </span>
              <p className="font-bold text-xs text-slate-100 mt-2 mb-1">
                &quot;شگد لازم أمشي باليوم لمريض السكر؟&quot;
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr ? 'يقدم توصية CDC السريرية (30 دقيقة يومياً بمعدل 150 دقيقة أسبوعياً) مع توضيح أهمية المشي بعد الوجبات لتقليل الارتفاع المفاجئ للسكر.' : 'Converts clinical CDC guidelines into simple daily targets: 30 minutes brisk walking post-meals to blunt glycemic spikes.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-950/70 border border-teal-800 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الهدف: إزالة الحاجز النفسي واللغوي بين المريض والإرشاد الطبي المعتمد' : 'Bridging patient psychology and certified clinical guidance effortlessly'}</span>
            </span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 10: INTERACTIVE PATIENT ENABLEMENT TOOLS
    // ==========================================
    {
      id: 10,
      badge: isAr ? 'أدوات تمكين المريض وتوعيته' : 'Patient Enablement Tools',
      title: isAr
        ? 'أدوات تفاعلية مدمجة: محاكي قياس السكر ولوحة الشفافية الطبية'
        : 'Interactive Patient Enablement: Virtual Meter & Clinical Guidance',
      subtitle: isAr
        ? 'أدوات مساعدة تعود المريض على فهم أرقامه وتصنيفاتها وفق جمعية السكري الأمريكية (ADA)'
        : 'Empowering self-monitoring literacy with clinical threshold simulations and audit transparency',
      speakerNotes: isAr
        ? 'نشرح للدكتور فكرة الأدوات المدمجة: محاكي قياس السكر ليس مجرد شكل، بل أداة تثقيفية تتيح للمريض إدخال أرقامه (صائم، تراكمي، فاطر) ليتعلم فورياً هل رقمه طبيعي أم في نطاق السكري، مع زر استشارة البوت.'
        : 'Explain to the judges that the virtual glucometer is an educational literacy tool helping patients decode their glucose numbers according to ADA thresholds.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-xs shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100 mb-1.5">
                {isAr ? '1. محاكي قياس السكر الافتراضي' : '1. Virtual Glucometer'}
              </h4>
              <p className="text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'أداة تفاعلية تحاكي أجهزة الفحص المنزلية بـ 4 سياقات (صائم، بعد الأكل، عشوائي، تراكمي) لتدريب المريض على فهم قراءاته وتصنيفاتها المعتمدة.'
                  : 'Interactive tool simulating home meters across 4 contexts (Fasting, Postprandial, Random, HbA1c) to train patients on reading interpretation.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-xs shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100 mb-1.5">
                {isAr ? '2. التقييم اللوني المعتمد (ADA)' : '2. Dynamic ADA Status Badges'}
              </h4>
              <p className="text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'تلوين فوري للقراءة (أخضر لطبيعي، أصفر لما قبل السكري، أحمر لنطاق السكري) مع نصيحة فورية تنمي الوعي الذاتي لدى المريض وتزيل حيرته.'
                  : 'Color-coded triage badges (Green: Normal, Amber: Prediabetes, Rose: Diabetes) providing clear visual feedback based on ADA criteria.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-xs shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/30">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100 mb-1.5">
                {isAr ? '3. لوحة الشفافية وتصدير السجل' : '3. Transparency & Session Export'}
              </h4>
              <p className="text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'توثيق كامل لكافة المصادر الـ 25 وضوابط الأمان، مع إمكانية تصدير أسئلة المريض وإجابات البوت كتقرير Markdown لمشاركته مع الطبيب المعالج.'
                  : 'Audit modal detailing the 25 verified sources and safety guardrails, enabling patients to export their Q&A log for clinic consultation.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/90 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h5 className="font-extrabold text-sm text-slate-100 mb-1">
                {isAr ? 'التكامل السلس داخل الواجهة الرئيسية' : 'Seamless In-App Clinical Experience'}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'جميع هذه الأدوات مدمجة بأزرار سريعة في الشريط العلوي لتسهيل وصول المريض إليها دون تعقيد تقني.'
                  : 'All patient enablement modules are directly accessible via one-click header actions in the main chat application.'}
              </p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shrink-0 flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
            >
              <span>{isAr ? 'تجربة الأدوات في الشات' : 'Open in Live Chat'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 11: CLINICAL APPLICATION & COMMUNITY IMPACT
    // ==========================================
    {
      id: 11,
      badge: isAr ? 'التطبيق الميداني والأثر المجتمعي' : 'Clinical & Community Impact',
      title: isAr
        ? 'الأثر الميداني: كيف يخدم المشروع المراكز الصحية وعيادات السكري؟'
        : 'Healthcare Impact: Deployment in Clinics & Primary Care Centers',
      subtitle: isAr
        ? 'تخفيف العبء على الطبيب، تثقيف المرضى في قاعات الانتظار، ورفع مؤشرات الوعي الصحي الجامعي'
        : 'Relieving physician workload, educating patients during clinic triage, and university healthcare outreach',
      speakerNotes: isAr
        ? 'هنا نوضح للدكتور فائدة المشروع على أرض الواقع: كيف يوضع في شاشات غرف انتظار المراكز الصحية أو المركز الصحي بالجامعة التقنية الشمالية ليثقف المرضى ريثما يدخلون للطبيب، مما يوفر وقت الطبيب لشرح العلاج.'
        : 'Demonstrate real-world healthcare utility: deploying the bot on kiosks in waiting rooms at the university clinic and primary care centers to educate patients before seeing the physician.',
      render: () => (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-start">
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-teal-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
                <Hospital className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '1. شاشات قاعات الانتظار' : '1. Waiting Room Kiosks'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'تشغيل المنظومة على أجهزة لوحية (Tablets) أو شاشات في غرف انتظار المراكز الصحية لتثقيف المراجعين حول الغذاء وقراءة السكر قبل مقابلة الطبيب.'
                  : 'Deploying the assistant on tablets in clinic waiting rooms to educate patients on nutrition and self-care while awaiting consultation.'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/30">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '2. تخفيف العبء على الأطباء' : '2. Relieving Physician Burden'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'يقضي الطبيب وقتاً طويلاً في تكرار إرشادات الغذاء والرياضة. يتولى البوت هذا التثقيف الروتيني بدقة، ليتفرغ الطبيب للقرارات العلاجية الحرجة.'
                  : 'Physicians spend precious minutes repeating basic dietary rules. The bot handles routine education, freeing clinicians for critical pharmacotherapy decisions.'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/40 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-100 mb-1.5">
                {isAr ? '3. المبادرة الجامعية والمجتمعية' : '3. University Community Outreach'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {isAr
                  ? 'تفعيل المنظومة داخل المركز الصحي للجامعة التقنية الشمالية لخدمة آلاف الطلاب والموظفين في الكشف المبكر عن مرحلة ما قبل السكري والتوعية بالوقاية.'
                  : 'Implementing the tool at Northern Technical University health clinics to serve students and faculty with early screening awareness.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/80 border border-teal-500/30 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? 'حل رقمي عراقي منخفض التكلفة، عالي الكفاءة، وجاهز للربط الفوري مع المنظومة الصحية الجامعية.' : 'A low-cost, high-impact digital health solution ready for direct integration into university clinics.'}</span>
            </div>
            <span className="text-teal-400 font-mono font-bold shrink-0 hidden sm:inline">NTU Health Initiative</span>
          </div>
        </div>
      ),
    },

    // ==========================================
    // SLIDE 12: CONCLUSION, ROADMAP & COMMITTEE Q&A
    // ==========================================
    {
      id: 12,
      badge: isAr ? 'الخاتمة ومناقشة لجنة التحكيم' : 'Conclusion & Committee Q&A',
      title: isAr
        ? 'الخاتمة والتطلعات المستقبلية: منظومة متكاملة جاهزة للمناقشة'
        : 'Conclusion & Future Horizons: Ready for Committee Evaluation',
      subtitle: isAr
        ? 'الجامعة التقنية الشمالية (Northern Technical University) • Group 01'
        : 'Type 2 Diabetes Educational Assistant — Group 01',
      speakerNotes: isAr
        ? 'نختم العرض بتقديم أسمى آيات الشكر لأساتذة لجنة التحكيم، ونستعرض الآفاق المستقبلية (تطبيق الموبايل، وربط حساسات السكر المستمرة CGM)، ونرحب بكافة الأسئلة والملاحظات.'
        : 'Conclude with sincere gratitude to the honorable examination committee, outline the future roadmap (mobile app, CGM sensor IoT integration), and invite all questions.',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto h-full px-2 py-3">
          {/* Glowing Crest & Award Emblem */}
          <div className="relative mb-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-teal-500/30">
              <Award className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-100 mb-3">
            {isAr ? 'شكراً جزيلاً لحسن استماعكم واهتمامكم' : 'Thank You for Your Time & Attention'}
          </h2>

          {/* Academic Crest & Team Reminder Card (No Roles) */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 border border-teal-500/40 w-full max-w-2xl mb-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {isAr ? 'فريق العمل (Group 01) • الجامعة التقنية الشمالية:' : 'Team Members (Group 01) • Northern Technical University:'}
              </span>
              <span className="text-[11px] text-amber-300 font-mono font-bold">2025 - 2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-start">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${member.dotColor} shrink-0`} />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{isAr ? member.nameAr : member.nameEn}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{isAr ? member.nameEn : member.nameAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-teal-500/25"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? 'فتح الشات التفاعلي للاختبار' : 'Launch Interactive Live Chat'}</span>
            </Link>
            <button
              onClick={() => setCurrentSlide(0)}
              className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة العرض من البداية' : 'Restart Deck'}</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#060a12] to-[#03060a] text-slate-100 flex flex-col font-sans select-none overflow-hidden relative"
    >
      {/* 21st Interactive Living Canvas: 60FPS Native Constellation Particle Network with Cursor Spotlight & Click Shockwaves */}
      <InteractiveLivingCanvas />

      {/* Deep Cyber Aurora Meshes */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/6 w-[700px] h-[700px] bg-gradient-to-br from-teal-500/20 via-emerald-500/15 to-transparent rounded-full blur-[110px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.18, 0.92, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 right-1/6 w-[700px] h-[700px] bg-gradient-to-tl from-indigo-500/20 via-cyan-500/15 to-transparent rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [0.92, 1.12, 0.92],
          opacity: [0.10, 0.20, 0.10],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* Top Center Spotlight Beam from Stage Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-64 bg-gradient-to-b from-teal-400/20 via-cyan-400/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Crisp High-Tech Grid Pattern Overlay with Center Glow Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none z-0" />

      {/* TOP PRESENTATION BAR */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        {/* Left: Branding & Slide Counter */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-teal-400 transition-colors p-2 rounded-xl hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40"
            title={isAr ? 'العودة للمحادثة' : 'Back to Chat'}
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">{isAr ? 'الشات الحي' : 'Live Chat'}</span>
          </Link>

          <span className="h-4 w-px bg-slate-800" />

          {/* Slide Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-extrabold text-teal-400 bg-teal-950/70 border border-teal-800/80 px-2 py-0.5 rounded-lg shadow-inner">
              {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-300 font-semibold hidden md:inline truncate max-w-[240px]">
              {current.title}
            </span>
          </div>
        </div>

        {/* Center: Live 7-Minute Jury Pitch Timer & Slide Progress Pills */}
        <div className="flex items-center gap-3">
          {/* Pitch Timer */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800/90 px-3 py-1 rounded-xl text-xs font-mono shadow-inner">
            <Timer className={`w-3.5 h-3.5 ${timerSeconds < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`font-bold ${timerSeconds < 60 ? 'text-rose-400' : 'text-slate-200'}`}>
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
              title={isTimerRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="إعادة ضبط المؤقت (7 دقائق)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Slide Dots */}
          <div className="hidden lg:flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 bg-gradient-to-r from-teal-400 to-cyan-400 shadow-sm shadow-teal-400/50'
                    : 'w-2 bg-slate-800 hover:bg-slate-600'
                }`}
                title={`Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Controls & Options */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
              showNotes
                ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                : 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700/80 hover:bg-slate-700'
            }`}
            title={isAr ? 'ملاحظات الشرح للجنة' : 'Speaker Notes'}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'ملاحظات' : 'Notes'}</span>
          </button>

          {/* Thumbnails Grid Drawer Button */}
          <button
            onClick={() => setShowGridDrawer(true)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer border border-slate-700/80"
            title={isAr ? 'عرض كل السلايدات' : 'Slide Grid'}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'السلايدات' : 'Grid'}</span>
          </button>

          {/* Bilingual Toggle (EN / AR) */}
          <button
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'))}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-teal-300 bg-teal-950/70 border border-teal-800 hover:bg-teal-900 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
            title="Toggle Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* PROGRESS BAR (TOP EDGE) */}
      <div className="w-full h-1 bg-slate-900 overflow-hidden z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 shadow-sm shadow-teal-500/50"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* SPEAKER NOTES DRAWER (Collapsible) */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between z-20 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{isAr ? 'نقطة الشرح للجنة:' : 'Presenter Cue:'}</strong> {current.speakerNotes}
              </span>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="text-amber-400 hover:text-amber-200 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SLIDE STAGE */}
      <main className="flex-1 flex flex-col justify-between p-3 sm:p-6 lg:p-8 overflow-y-auto z-10 relative">
        {/* Slide Header Info (for slides 2-11) */}
        {currentSlide > 0 && currentSlide < 11 && (
          <div className="max-w-5xl w-full mx-auto mb-4 text-center shrink-0">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase tracking-widest inline-block mb-1.5 shadow-sm">
              {current.badge}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light max-w-2xl mx-auto leading-relaxed">
              {current.subtitle}
            </p>
          </div>
        )}

        {/* Dynamic Slide Content with Motion Slide Animation */}
        <div className="flex-1 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -14 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full h-full flex flex-col justify-center"
            >
              {current.render()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM NAVIGATION FOOTER */}
      <footer className="h-16 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between z-20 shrink-0">
        {/* Prev Button */}
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-slate-700/80"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'السابق' : 'Previous'}</span>
        </button>

        {/* Keyboard Shortcut Hints */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <span>[← / →] {isAr ? 'للتنقل' : 'Navigate'}</span>
          <span>[Space] {isAr ? 'التالي' : 'Next'}</span>
          <span>[F] {isAr ? 'ملء الشاشة' : 'Fullscreen'}</span>
          <span>[Esc] {isAr ? 'إغلاق القوائم' : 'Close Drawers'}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-1.5 px-5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-teal-500/25"
        >
          <span>{isAr ? 'التالي' : 'Next'}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </footer>

      {/* SLIDE GRID DRAWER (OVERLAY) */}
      <AnimatePresence>
        {showGridDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-teal-400" />
                  <h3 className="font-extrabold text-base text-slate-100">
                    {isAr ? 'فهرس شرائح العرض السريع (12 شريحة)' : 'Slide Overview (12 Slides)'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowGridDrawer(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Slide Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-y-auto p-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlide(idx);
                      setShowGridDrawer(false);
                    }}
                    className={`p-3 rounded-2xl text-start transition-all border cursor-pointer ${
                      idx === currentSlide
                        ? 'bg-teal-950/70 border-teal-500 text-teal-200 shadow-lg shadow-teal-500/20'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-teal-400 block mb-1 font-bold">
                      SLIDE {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h5 className="font-bold text-xs truncate text-slate-100">
                      {s.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {s.badge}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
