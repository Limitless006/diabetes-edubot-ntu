'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Heart,
  Eye,
  Footprints,
  Info,
  ExternalLink,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ReferencePanelProps {
  language: 'ar' | 'en';
  isOpen?: boolean;
  onClose?: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({
  language,
  isOpen = true,
  onClose,
}) => {
  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Sliding Drawer Container */}
        <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex`}>
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden text-sm"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
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

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Diagnostic Thresholds Card */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isAr ? 'مستويات السكر التراكمي والصائم' : 'A1C & Fasting Glucose'}
                </h3>

                <div className="space-y-2">
                  {/* Normal */}
                  <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 mb-1">
                        {isAr ? 'طبيعي (Normal)' : 'Normal'}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {isAr ? 'الصائم: أقل من 100 ملغ/ديسيلتر' : 'Fasting: < 100 mg/dL'}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                      &lt; 5.7%
                    </span>
                  </div>

                  {/* Prediabetes */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 mb-1">
                        {isAr ? 'مرحلة ما قبل السكري (Prediabetes)' : 'Prediabetes'}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {isAr ? 'الصائم: 100 - 125 ملغ/ديسيلتر' : 'Fasting: 100 - 125 mg/dL'}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 font-mono">
                      5.7% - 6.4%
                    </span>
                  </div>

                  {/* Diabetes */}
                  <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 mb-1">
                        {isAr ? 'تشخيص السكري (Diabetes)' : 'Diabetes'}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {isAr ? 'الصائم: 126 ملغ/ديسيلتر أو أكثر' : 'Fasting: ≥ 126 mg/dL'}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 font-mono">
                      ≥ 6.5%
                    </span>
                  </div>
                </div>
              </div>

              {/* ABCs of Diabetes */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 space-y-2">
                <h3 className="text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{isAr ? 'قاعدة ABCs لإدارة السكري' : 'The ABCs of Diabetes'}</span>
                </h3>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <li><strong>A - A1C:</strong> {isAr ? 'التراكمي (الهدف غالباً أقل من 7%)' : 'HbA1c test (often < 7%)'}</li>
                  <li><strong>B - Blood Pressure:</strong> {isAr ? 'ضغط الدم (أقل من 130/80)' : 'Blood Pressure (< 130/80)'}</li>
                  <li><strong>C - Cholesterol:</strong> {isAr ? 'الكولسترول والدهون الصحية' : 'Cholesterol control'}</li>
                  <li><strong>s - Stop Smoking:</strong> {isAr ? 'الإقلاع التام عن التدخين' : 'Smoking cessation'}</li>
                </ul>
              </div>

              {/* Complications Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isAr ? 'فحوصات الوقاية السنوية' : 'Annual Preventive Screenings'}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isAr ? 'فحص قاع العين' : 'Dilated Eye Exam'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isAr ? 'فحص القدمين اليومي' : 'Comprehensive Foot Exam'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{isAr ? 'صحة القلب والشرايين' : 'Cardiovascular Health'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{isAr ? 'وظائف الكلى والزلال' : 'Kidney Function & eGFR'}</span>
                  </div>
                </div>
              </div>

              {/* 25 Trusted Clinical Sources */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isAr ? '25 مرجعاً طبياً عالمياً معتمداً:' : '25 Authoritative Sources:'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  ADA Standards of Care 2024, WHO Guidelines, CDC Diabetes Toolkit, MedlinePlus NIH, NHS UK, IDF Clinical Guides, Mayo Clinic.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
