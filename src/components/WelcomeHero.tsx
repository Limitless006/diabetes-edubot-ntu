'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Utensils,
  Activity,
  Apple,
  Moon,
  ListOrdered,
  ShieldAlert,
} from 'lucide-react';

interface WelcomeHeroProps {
  language: 'ar' | 'en';
  onSelectPrompt: (promptText: string) => void;
  onOpenBenchmark: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  language,
  onSelectPrompt,
  onOpenBenchmark,
}) => {
  const isAr = language === 'ar';

  const quickPrompts = isAr
    ? [
        {
          icon: <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          title: 'طريقة طبق السكري والوجبات',
          subtitle: 'كيف تقسم الصحن بين الخضار والبروتين والنشويات؟',
          query: 'ما هي طريقة طبق السكري المتوازن في التغذية؟',
        },
        {
          icon: <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
          title: 'فحص السكر التراكمي (HbA1c)',
          subtitle: 'ما هي الأرقام الطبيعية ومرحلة ما قبل السكري؟',
          query: 'ما هو فحص السكر التراكمي (HbA1c) وما دلالات أرقامه؟',
        },
        {
          icon: <Apple className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          title: 'خرافة التمر والعسل الطبيعي',
          subtitle: 'هل السكر الطبيعي يرفع سكر الدم وكم الكمية؟',
          query: 'هل التمر والعسل مسموح لمريض السكري وكم حبة؟',
        },
        {
          icon: <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
          title: 'الخمول بعد الأكل وظاهرة الفجر',
          subtitle: 'تفسير النعاس بعد الغداء وارتفاع سكر الصباح',
          query: 'ليش احس بخمول ونعاس ورا الغدا وما هي ظاهرة الفجر؟',
        },
      ]
    : [
        {
          icon: <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          title: 'Diabetes Plate Method',
          subtitle: 'How to divide non-starchy veggies, protein & carbs',
          query: 'What is the Diabetes Plate Method for meal planning?',
        },
        {
          icon: <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
          title: 'HbA1c Testing & Targets',
          subtitle: 'Normal, prediabetes and diabetic target ranges',
          query: 'What is the HbA1c test and its target ranges?',
        },
        {
          icon: <Apple className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          title: 'Natural Sugar & Fruit Myths',
          subtitle: 'Do dates and honey spike blood glucose?',
          query: 'Can a person with diabetes eat dates and natural honey?',
        },
        {
          icon: <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
          title: 'Postprandial Lethargy & Dawn Effect',
          subtitle: 'Why tiredness happens after meals & morning spikes',
          query: 'Why do I feel tired after lunch and what is the dawn phenomenon?',
        },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto my-auto py-8 sm:py-12 px-4 text-center"
    >
      {/* Bot Icon with Glow */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-xl" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-7 h-7" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-2">
        {isAr
          ? 'المساعد الذكي للتثقيف بمرض السكري'
          : 'Type 2 Diabetes Educational Assistant'}
      </h2>

      {/* Clean Subtitle */}
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
        {isAr
          ? 'معلومات طبية سريرية موثقة مستندة حصراً إلى 25 مصدراً عالمياً معتمداً (WHO, CDC, ADA, NIH, NHS) للإجابة على جميع استفساراتك وتغذيتك.'
          : 'Clinical, zero-hallucination educational guidance strictly grounded in 25 verified sources from WHO, CDC, ADA, and NIH.'}
      </p>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-start">
        {quickPrompts.map((p, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelectPrompt(p.query)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/70 dark:bg-slate-800/60 dark:hover:bg-teal-950/40 border border-slate-200/80 hover:border-teal-300 dark:border-slate-700/80 dark:hover:border-teal-700/80 transition-all flex items-start gap-2.5 cursor-pointer shadow-2xs group"
          >
            <div className="p-2 rounded-xl bg-white dark:bg-slate-700/70 shadow-2xs group-hover:scale-105 transition-transform shrink-0 mt-0.5">
              {p.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                {p.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {p.subtitle}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Benchmark Button & Disclaimer */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onOpenBenchmark}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-200/80 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition-all shadow-2xs cursor-pointer"
        >
          <ListOrdered className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>
            {isAr
              ? 'استعراض الأسئلة الـ 15 المعتمدة للتقييم'
              : 'Browse All 15 Verified Benchmark Questions'}
          </span>
        </button>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {isAr
              ? 'نظام تثقيفي تعليمي لا يقدم تشخيصاً شخصياً ولا يحدد جرعات علاجية.'
              : 'Educational prototype only; does not provide clinical diagnosis or dosing.'}
          </span>
        </p>
      </div>
    </motion.div>
  );
};
