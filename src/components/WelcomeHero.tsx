'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ListOrdered,
  Droplet,
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  MessageSquare,
} from 'lucide-react';

interface WelcomeHeroProps {
  language: 'ar' | 'en';
  onOpenBenchmark: () => void;
  onOpenGlucometer: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  language,
  onOpenBenchmark,
  onOpenGlucometer,
}) => {
  const isAr = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto my-auto py-8 sm:py-12 px-3 text-center flex flex-col items-center justify-center"
    >
      {/* 3D Floating University Crest Emblem */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-0.8, 0.8, -0.8] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        className="relative mb-5 group cursor-pointer"
      >
        <motion.div
          animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute -inset-3 bg-gradient-to-tr from-amber-400/35 via-teal-500/35 to-cyan-400/35 rounded-3xl blur-xl pointer-events-none"
        />
        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.25)] p-2 flex flex-col items-center justify-center backdrop-blur-xl transition-all duration-300 group-hover:scale-105">
          <img
            src="/ntu-logo.png"
            alt="Northern Technical University Crest"
            className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(20,184,166,0.3)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </motion.div>

      {/* University & Group Ribbon */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 tracking-wide mb-3">
        <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
        <span>{isAr ? 'الجامعة التقنية الشمالية • Northern Technical University' : 'Northern Technical University • Group 01'}</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-200">
          Group 01
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-3 leading-snug">
        {isAr
          ? 'المساعد الطبي الذكي للتثقيف بمرض السكري'
          : 'Type 2 Diabetes Educational Assistant'}
      </h2>

      {/* Clinical Subtitle */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 font-light">
        {isAr
          ? 'منظومة ذكاء اصطناعي سريرية رصينة مقيدة بـ 25 مصدراً دولياً معتمداً (WHO, CDC, ADA, NIH, NHS)، محصنة بنسبة 100% ضد الهلوسة الطبية ومبرمجة للإجابة عن أسئلتك بالفصحى واللهجة العراقية الدارجة بأعلى معايير الأمان.'
          : 'Clinical, zero-hallucination AI system strictly bounded by 25 authoritative health organizations. Ready to answer your glucose, diet, and clinical questions in Standard Arabic and Iraqi dialect.'}
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {/* 15 Benchmark Questions Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenBenchmark}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
        >
          <ListOrdered className="w-4 h-4" />
          <span>{isAr ? 'فتح الأسئلة الـ 15 المعتمدة للتقييم' : 'Open 15 Benchmark Questions'}</span>
        </motion.button>

        {/* Glucometer Simulator Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenGlucometer}
          className="px-5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>{isAr ? 'تجربة محاكي جهاز قياس السكر' : 'Interactive Glucometer Simulator'}</span>
        </motion.button>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          <span>{isAr ? 'صفر هلوسة طبية' : 'Zero Hallucination'}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isAr ? '25 مصدراً دولياً' : '25 Global Sources'}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
          <span>{isAr ? 'طلاقة باللهجة العراقية' : 'Native Iraqi Dialect'}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>{isAr ? 'حماية الخصوصية 100%' : '100% Privacy Guarded'}</span>
        </span>
      </div>
    </motion.div>
  );
};
