'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface QuickPromptCardsProps {
  language: 'ar' | 'en';
  onSelectPrompt: (promptText: string) => void;
}

export const QuickPromptCards: React.FC<QuickPromptCardsProps> = ({
  language,
  onSelectPrompt,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const topics = [
    {
      id: 'glucose',
      icon: Activity,
      color: 'from-teal-500/10 to-emerald-500/10 dark:from-teal-950/40 dark:to-emerald-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300',
      iconColor: 'text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900',
      title: isAr ? 'سكر الدم والتراكمي (HbA1c)' : 'Blood Glucose & HbA1c',
      desc: isAr
        ? 'ما هي القيم الطبيعية لفحص التراكمي والسكر الصائم، وما دلالاتها؟'
        : 'What are normal HbA1c and fasting blood sugar levels and ranges?',
      prompt: isAr
        ? 'ما هو فحص السكر التراكمي (HbA1c)، وما هي القيم الطبيعية ومستويات ما قبل السكري والسكري؟'
        : 'What is the HbA1c test, and what are the normal, prediabetes, and diabetes ranges?',
    },
    {
      id: 'symptoms',
      icon: AlertTriangle,
      color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
      iconColor: 'text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900',
      title: isAr ? 'الأعراض وعوامل الخطر' : 'Symptoms & Risk Factors',
      desc: isAr
        ? 'كيف تظهر أعراض السكري ببطء ومن هم الأشخاص الأكثر عرضة للإصابة؟'
        : 'How do gradual symptoms develop, and who is at higher risk?',
      prompt: isAr
        ? 'ما هي الأعراض الشائعة للسكري من النوع الثاني، ومن هم الأشخاص الأكثر عرضة للإصابة به؟'
        : 'What are the common symptoms of Type 2 diabetes, and who is at highest risk?',
    },
    {
      id: 'prevention',
      icon: HeartPulse,
      color: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-950/40 dark:to-cyan-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
      iconColor: 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900',
      title: isAr ? 'الوقاية وقاعدة ABCs' : 'Prevention & Self-Care',
      desc: isAr
        ? 'الخطوات العملية المثبتة لتغيير نمط الحياة، التغذية، والرعاية الذاتية.'
        : 'Proven lifestyle changes, nutrition, and daily self-care management.',
      prompt: isAr
        ? 'ما هي الخطوات العملية المثبتة للوقاية من السكري من النوع الثاني، وما هي قاعدة الـ ABCs؟'
        : 'What proven lifestyle steps help prevent Type 2 diabetes, and what are the ABCs?',
    },
    {
      id: 'myths',
      icon: HelpCircle,
      color: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300',
      iconColor: 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900',
      title: isAr ? 'تصحيح الخرافات الشائعة' : 'Myths vs. Medical Facts',
      desc: isAr
        ? 'هل أكل السكر وحده هو السبب، وهل الأعشاب قادرة على شفاء السكري؟'
        : 'Does sugar alone cause diabetes, and can herbs cure it permanently?',
      prompt: isAr
        ? 'هل تناول السكر وحده هو المسبب للسكري، وهل يمكن علاج السكري نهائياً بالأعشاب الطبيعية؟'
        : 'Does eating sugar directly cause Type 2 diabetes, and can natural herbs cure it permanently?',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {topics.map((t, idx) => {
        const Icon = t.icon;
        return (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(t.prompt)}
            className={`p-3.5 rounded-2xl border text-start transition-all bg-gradient-to-br ${t.color} flex items-start gap-3 group shadow-2xs`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  {t.title}
                </span>
                <ArrowIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {t.desc}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
