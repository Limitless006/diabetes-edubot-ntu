'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Activity,
  Globe,
  Info,
  RotateCcw,
  BookOpen,
  ListOrdered,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Tv,
  Droplet,
} from 'lucide-react';

interface HeaderProps {
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenTransparency: () => void;
  onOpenBenchmarkDrawer: () => void;
  onOpenGlucometer?: () => void;
  onOpenApiKeyModal?: () => void;
  hasApiKey?: boolean;
  onToggleReferencePanel: () => void;
  onOpenClearModal: () => void;
  showReferencePanel: boolean;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenTransparency,
  onOpenBenchmarkDrawer,
  onOpenGlucometer,
  onOpenApiKeyModal,
  hasApiKey,
  onToggleReferencePanel,
  onOpenClearModal,
  showReferencePanel,
  isPresentationMode,
  onTogglePresentationMode,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm transition-colors">
      {/* 1. PERSISTENT MEDICAL SAFETY BANNER */}
      {!isPresentationMode && (
        <div className="bg-amber-500 text-white px-3 py-1.5 text-xs sm:text-sm font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-100" />
              <span>
                {isAr ? (
                  <>
                    <strong className="font-bold">تنبيه طبي وأمان الخصوصية:</strong> هذا النظام هو نموذج تثقيفي تجريبي لمسابقة جامعية — ليس بديلاً عن التشخيص الطبي أو خدمات الطوارئ. يُرجى عدم إدخال أي أسماء حقيقية للمرضى أو أرقام هواتف أو تقارير خاصة.
                  </>
                ) : (
                  <>
                    <strong className="font-bold">Medical & Privacy Notice:</strong> Educational prototype for academic competition only — Not a clinical diagnostic or emergency service. Do not enter real patient names, phone numbers, or private records.
                  </>
                )}
              </span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 bg-amber-600/60 rounded text-[11px] font-mono tracking-wider">
              Group 01 • T2D
            </span>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo & Clinical Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0"
          >
            <Activity className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                {isAr ? 'مساعد السكري التثقيفي' : 'Type 2 Diabetes Assistant'}
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 rounded-md border border-teal-200 dark:border-teal-700">
                Group 01
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {isAr
                ? 'مدعوم بقاعدة معرفة سريرية موثقة من WHO وCDC وMedlinePlus وNHS'
                : 'Evidence-based clinical education grounded in WHO, CDC, MedlinePlus & NHS'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 🌟 12 SLIDES PRESENTATION DECK LINK */}
          <Link
            href="/presentation"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all shadow-xs"
            title={isAr ? 'عرض سلايدات المشروع للجنة التحكيم (12 سلايد)' : 'Open 12-Slide Presentation Deck'}
          >
            <Tv className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden xs:inline">{isAr ? 'السلايدات' : 'Slides'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 font-mono">12</span>
          </Link>

          {/* 🌟 15 BENCHMARK QUESTIONS DRAWER BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenBenchmarkDrawer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900 transition-all shadow-xs"
            title={isAr ? 'عرض الأسئلة الـ 15 المعتمدة' : 'View 15 Benchmark Questions'}
          >
            <ListOrdered className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden xs:inline">{isAr ? 'الأسئلة الـ 15' : '15 Questions'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </motion.button>

          {/* Reference Guide Toggle */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleReferencePanel}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border transition-colors ${
              showReferencePanel
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-teal-700 dark:text-teal-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
            title={isAr ? 'دليل قراءات السكر' : 'Glucose Reference'}
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{isAr ? 'دليل القراءات' : 'Reference'}</span>
          </motion.button>

          {/* 🩸 Interactive Virtual Glucometer Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenGlucometer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900 transition-all shadow-xs cursor-pointer"
            title={isAr ? 'محاكي جهاز قياس السكر التفاعلي' : 'Interactive Blood Glucose Meter'}
          >
            <Droplet className="w-4 h-4 text-rose-600 dark:text-rose-400 fill-rose-500" />
            <span className="hidden xs:inline">{isAr ? 'جهاز السكر' : 'Glucometer'}</span>
          </motion.button>

          {/* Presentation Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onTogglePresentationMode}
            className={`p-2 rounded-xl border transition-colors ${
              isPresentationMode
                ? 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isAr ? (isPresentationMode ? 'إنهاء وضع العرض' : 'وضع العرض التقديمي للدكتور') : 'Presentation Mode'}
          >
            {isPresentationMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>

          {/* Dark / Light Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </motion.button>

          {/* About & AI Transparency Drawer Trigger */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTransparency}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title={isAr ? 'شفافية الذكاء الاصطناعي والمصادر' : 'AI Transparency'}
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>{isAr ? 'الشفافية' : 'Transparency'}</span>
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </motion.button>

          {/* Reset / Clear Chat Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenClearModal}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
            title={isAr ? 'بدء محادثة جديدة' : 'New Chat'}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
