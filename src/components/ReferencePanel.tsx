'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  AlertCircle,
  Heart,
  Eye,
  Footprints,
  Info,
  ExternalLink,
} from 'lucide-react';

interface ReferencePanelProps {
  language: 'ar' | 'en';
  onClose?: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <motion.aside
      initial={{ opacity: 0, x: isAr ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 h-fit text-sm transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
            {isAr ? 'دليل قراءات سكر الدم المرجعي' : 'Blood Glucose Reference Guide'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isAr ? 'معايير CDC وADA الرسمية (تثقيفي فقط)' : 'Official CDC & ADA Criteria (Educational)'}
          </p>
        </div>
      </div>

      {/* Diagnostic Thresholds Card */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {isAr ? 'مستويات السكر التراكمي والصائم' : 'A1C & Fasting Glucose'}
        </h3>

        <div className="space-y-2">
          {/* Normal */}
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start justify-between">
            <div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 mb-1">
                {isAr ? 'طبيعي (Normal)' : 'Normal'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {isAr ? 'الصائم: أقل من 100 ملغ/ديسيلتر' : 'Fasting: < 100 mg/dL'}
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
              &lt; 5.7%
            </span>
          </div>

          {/* Prediabetes */}
          <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-start justify-between">
            <div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 mb-1">
                {isAr ? 'ما قبل السكري (Prediabetes)' : 'Prediabetes'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {isAr ? 'الصائم: 100 – 125 ملغ/ديسيلتر' : 'Fasting: 100 – 125 mg/dL'}
              </p>
            </div>
            <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 font-mono">
              5.7% – 6.4%
            </span>
          </div>

          {/* Diabetes */}
          <div className="p-2.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 flex items-start justify-between">
            <div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 mb-1">
                {isAr ? 'السكري (Diabetes)' : 'Diabetes'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {isAr ? 'الصائم: 126 ملغ/ديسيلتر فأعلى' : 'Fasting: ≥ 126 mg/dL'}
              </p>
            </div>
            <span className="text-xs font-extrabold text-rose-800 dark:text-rose-300 font-mono">
              ≥ 6.5%
            </span>
          </div>
        </div>
      </div>

      {/* The ABCs of Diabetes */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>{isAr ? 'قاعدة الـ ABCs للرعاية الذاتية' : 'The ABCs of Diabetes'}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
            <span className="font-bold text-teal-700 dark:text-teal-400 block">A: A1C</span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">
              {isAr ? 'الهدف غالباً < 7%' : 'Goal: < 7.0%'}
            </span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
            <span className="font-bold text-teal-700 dark:text-teal-400 block">B: Blood Pressure</span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">
              {isAr ? 'غالباً < 130/80' : 'Goal: < 130/80'}
            </span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
            <span className="font-bold text-teal-700 dark:text-teal-400 block">C: Cholesterol</span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">
              {isAr ? 'ضبط الدهون والـ LDL' : 'LDL Management'}
            </span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
            <span className="font-bold text-teal-700 dark:text-teal-400 block">S: Stop Smoking</span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">
              {isAr ? 'امتناع تام عن التبغ' : 'Zero Tobacco'}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Routine Checks */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {isAr ? 'فحوصات وقائية دورية' : 'Preventative Checks'}
        </h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
          <li className="flex items-center gap-2">
            <Footprints className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{isAr ? 'فحص يومي للقدمين والتجفيف بين الأصابع' : 'Daily foot inspection & drying toes'}</span>
          </li>
          <li className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{isAr ? 'فحص سنوي موسع لقاع العين (الشبكية)' : 'Annual dilated eye exam (retina)'}</span>
          </li>
          <li className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{isAr ? 'فحص وظائف الكلى (الزلال التراكمي UACR)' : 'Annual kidney microalbumin check'}</span>
          </li>
        </ul>
      </div>

      {/* Non-Diagnostic Clinical Disclaimer */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          {isAr
            ? 'هذه القيم إرشادية وتثقيفية فقط. لا يمكن استخدامها لتشخيص حالتك أو تعديل الأدوية دون استشارة طبيبك المعالج.'
            : 'Reference thresholds for education only. A licensed healthcare provider must evaluate and interpret personal lab results.'}
        </span>
      </div>

      {/* Official Link */}
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href="https://www.cdc.gov/diabetes/diabetes-testing/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/60 hover:bg-teal-100/60 dark:hover:bg-teal-900 border border-teal-200/60 dark:border-teal-700 rounded-xl transition-colors font-medium shadow-2xs"
      >
        <span>{isAr ? 'دليل فحوصات CDC الرسمي' : 'Official CDC Testing Guide'}</span>
        <ExternalLink className="w-3 h-3" />
      </motion.a>
    </motion.aside>
  );
};
