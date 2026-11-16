'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Activity,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import benchmarkData from '@/../knowledge_base/qa_benchmark.json';

interface BenchmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onSelectQuestion: (questionText: string) => void;
}

export const BenchmarkDrawer: React.FC<BenchmarkDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onSelectQuestion,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label_ar: 'الكل (15 سؤال)', label_en: 'All (15 Qs)', icon: HelpCircle },
    { id: 'Basic Concept', label_ar: 'المفاهيم وسكر الدم', label_en: 'Concepts & Glucose', icon: Activity },
    { id: 'Symptoms', label_ar: 'الأعراض وعوامل الخطر', label_en: 'Symptoms & Risk', icon: AlertTriangle },
    { id: 'Prevention', label_ar: 'الوقاية وقاعدة ABCs', label_en: 'Prevention & ABCs', icon: HeartPulse },
    { id: 'Misconceptions', label_ar: 'تصحيح الخرافات', label_en: 'Myths vs Facts', icon: Sparkles },
    { id: 'Medical Safety', label_ar: 'الأمان الطبي والطوارئ', label_en: 'Safety & Emergency', icon: ShieldCheck },
  ];

  const filteredQuestions = benchmarkData.filter((q) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      q.category === selectedCategory ||
      (selectedCategory === 'Basic Concept' && (q.category === 'Basic Concept' || q.category === 'Blood Glucose')) ||
      (selectedCategory === 'Symptoms' && (q.category === 'Symptoms' || q.category === 'Risk Factors' || q.category === 'Complications')) ||
      (selectedCategory === 'Prevention' && (q.category === 'Prevention' || q.category === 'Self-Care Education')) ||
      (selectedCategory === 'Medical Safety' && (q.category === 'Medical Safety' || q.category === 'Warning Signs' || q.category === 'Out-of-Scope' || q.category === 'Uncertainty & Privacy'));

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      q.question_ar.toLowerCase().includes(query) ||
      q.question_en.toLowerCase().includes(query) ||
      q.category_ar.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Sliding Drawer Container */}
          <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex`}>
            <motion.div
              initial={{ x: isAr ? '-100%' : '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isAr ? '-100%' : '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-2xl bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                        {isAr ? 'بنك الأسئلة الـ 15 المعتمد' : 'Official 15 Benchmark Questions'}
                      </h2>
                      <span className="px-2 py-0.5 text-xs font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-700">
                        15/15 Pass
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? 'تغطية الفئات الخمس لاختبار الدكتور مع إمكانية التشغيل الحي الفوري'
                        : 'Covering all 5 evaluation categories with instant live test execution'}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? 'ابحث في الأسئلة الـ 15 بالكلمات المفتاحية (عربي أو إنجليزي)...'
                        : 'Search benchmark questions by keyword...'
                    }
                    className="w-full ps-9 pe-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute end-3 text-xs text-slate-400 hover:text-slate-600"
                    >
                      {isAr ? 'مسح' : 'Clear'}
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isActive = selectedCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 font-medium transition-all ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{isAr ? c.label_ar : c.label_en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-sm font-medium">
                      {isAr ? 'لم يتم العثور على أسئلة مطابقة للبحث' : 'No questions match your query'}
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[11px] font-bold flex items-center justify-center font-mono">
                            {q.id.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {isAr ? q.category_ar : q.category}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{q.bot_result || 'Correct'}</span>
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-relaxed mb-1">
                        {q.question_ar}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
                        {q.question_en}
                      </p>

                      {/* Sources and Action Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/60">
                        {/* Sources */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            {isAr ? 'المصادر:' : 'Sources:'}
                          </span>
                          {q.sources.map((s: any, sIdx: number) => (
                            <a
                              key={sIdx}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-teal-700 dark:text-teal-300 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
                            >
                              <span>{s.name}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>

                        {/* RUN IN CHAT BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            onSelectQuestion(q.question_ar);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{isAr ? 'تجربة السؤال لايف' : 'Run in Chat'}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
                <span>{isAr ? 'سجل الأسئلة المعتمد للمسابقة (Stage A & Stage B)' : 'Official Competition Q&A Log'}</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">15 Questions Ready</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
