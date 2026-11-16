'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Activity,
  Globe,
  RotateCcw,
  BookOpen,
  ListOrdered,
  Moon,
  Sun,
  Tv,
  Droplet,
  FileCheck,
} from 'lucide-react';

interface HeaderProps {
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenTransparency: () => void;
  onOpenBenchmarkDrawer: () => void;
  onOpenGlucometer?: () => void;
  onToggleReferencePanel: () => void;
  onOpenClearModal: () => void;
  showReferencePanel: boolean;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenTransparency,
  onOpenBenchmarkDrawer,
  onOpenGlucometer,
  onToggleReferencePanel,
  onOpenClearModal,
  showReferencePanel,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & University Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* University Crest / Medical Pulse Avatar */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0 transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {isAr ? 'مساعد السكري التثقيفي' : 'Type 2 Diabetes Assistant'}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-full border border-teal-500/25">
                  Group 01
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs">
                {isAr
                  ? 'الجامعة التقنية الشمالية • موثق بـ 25 مصدراً دولياً'
                  : 'Northern Technical University • 25 Sources'}
              </p>
            </div>
          </Link>

          {/* Clinical Safety Badge */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{isAr ? 'موثوق سريرياً • 25 مصدراً' : 'Evidence-Grounded • 25 Sources'}</span>
          </div>
        </div>

        {/* Right: Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 🌟 12 SLIDES PRESENTATION DECK LINK */}
          <Link
            href="/presentation"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border border-indigo-300/80 dark:border-indigo-700/80 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all shadow-xs"
            title={isAr ? 'عرض سلايدات المشروع للجنة التحكيم (12 سلايد)' : 'Open 12-Slide Presentation Deck'}
          >
            <Tv className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden xs:inline">{isAr ? 'السلايدات' : 'Slides'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 font-mono">12</span>
          </Link>

          {/* 🌟 15 BENCHMARK QUESTIONS DRAWER BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenBenchmarkDrawer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-xl border border-teal-500/40 bg-teal-500/10 text-teal-800 dark:text-teal-200 hover:bg-teal-500/20 transition-all shadow-xs cursor-pointer"
            title={isAr ? 'عرض الأسئلة الـ 15 المعتمدة للتقييم' : 'View 15 Benchmark Questions'}
          >
            <ListOrdered className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">{isAr ? 'الأسئلة الـ 15' : '15 Questions'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </motion.button>

          {/* 🩸 Interactive Virtual Glucometer Button */}
          {onOpenGlucometer && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenGlucometer}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-all shadow-xs cursor-pointer"
              title={isAr ? 'محاكي جهاز قياس السكر التفاعلي' : 'Interactive Blood Glucose Meter'}
            >
              <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="hidden sm:inline">{isAr ? 'جهاز السكر' : 'Meter'}</span>
            </motion.button>
          )}

          {/* Reference Guide Drawer Toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleReferencePanel}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            title={isAr ? 'دليل قراءات سكر الدم المرجعي' : 'Glucose Reference'}
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">{isAr ? 'الدليل' : 'Reference'}</span>
          </motion.button>

          {/* Export / Transparency */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTransparency}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isAr ? 'تقرير المحادثة والتصدير' : 'Export & Audit'}
          >
            <FileCheck className="w-4 h-4" />
          </motion.button>

          {/* Clear Chat Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenClearModal}
            className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isAr ? 'بدء محادثة جديدة' : 'Clear Chat'}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </motion.button>

          {/* Dark / Light Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
