'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Cpu,
  Shield,
  Database,
  Download,
  Check,
  FileCheck,
  ExternalLink,
  Layers,
  Terminal,
} from 'lucide-react';
import { MessageProps } from './ChatMessageItem';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  messages: MessageProps[];
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({
  isOpen,
  onClose,
  language,
  messages,
}) => {
  const isAr = language === 'ar';
  const [copiedExport, setCopiedExport] = useState(false);
  const [activeTab, setActiveTab] = useState<'stack' | 'safety' | 'sources' | 'export'>('stack');

  if (!isOpen) return null;

  const generateMarkdownExport = () => {
    let md = `# سجل جلسة اختبار الشات بوت الطبي (Live Test Session Log)\n`;
    md += `**المشروع:** المساعد الذكي للتثقيف بمرض السكري من النوع الثاني (Group 01 — Type 2 Diabetes)\n`;
    md += `**تاريخ الجلسة:** ${new Date().toLocaleString()}\n`;
    md += `**النموذج ومحرك المعرفة:** Google Antigravity + Next.js App Router + Google Gemini API + Local Grounded RAG\n\n`;
    md += `| NO. | نوع الرسالة (Role) | نص السؤال أو الرد (Content) | المصادر المعتمدة والروابط (Verified Sources) |\n`;
    md += `| :---: | :--- | :--- | :--- |\n`;

    let questionIndex = 1;
    for (const msg of messages) {
      if (msg.role === 'user') {
        const cleanUser = msg.content.replace(/\|/g, '\\|').replace(/\n/g, ' ');
        md += `| **Q${questionIndex}** | **STUDENT QUESTION** | ${cleanUser} | — |\n`;
      } else {
        const cleanBot = msg.content.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
        const sourcesText = msg.citations && msg.citations.length > 0
          ? msg.citations.map((c) => `[${c.organization}](${c.url})`).join(' · ')
          : 'Grounded Knowledge Base (Group 01)';
        md += `| **A${questionIndex}** | **BOT RESPONSE** | ${cleanBot} | ${sourcesText} |\n`;
        questionIndex++;
      }
    }

    return md;
  };

  const handleCopyExport = () => {
    const md = generateMarkdownExport();
    navigator.clipboard.writeText(md);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const handleDownloadExport = () => {
    const md = generateMarkdownExport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `diabetes_group01_test_session_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifiedSources = [
    { org: 'MedlinePlus (NIH)', title: 'Diabetes Type 2 Overview', url: 'https://medlineplus.gov/diabetestype2.html' },
    { org: 'MedlinePlus (NIH)', title: 'Type 2 diabetes - Medical Encyclopedia', url: 'https://medlineplus.gov/ency/article/000313.htm' },
    { org: 'MedlinePlus (NIH)', title: 'Hemoglobin A1C (HbA1c) Test', url: 'https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/' },
    { org: 'MedlinePlus (NIH)', title: 'Type 2 diabetes - self-care', url: 'https://medlineplus.gov/ency/patientinstructions/000328.htm' },
    { org: 'World Health Organization (WHO)', title: 'Diabetes Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes' },
    { org: 'World Health Organization (WHO)', title: 'Diabetes Q&A', url: 'https://www.who.int/news-room/questions-and-answers/item/diabetes' },
    { org: 'CDC', title: 'About Type 2 Diabetes', url: 'https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html' },
    { org: 'CDC', title: 'Symptoms of Diabetes', url: 'https://www.cdc.gov/diabetes/signs-symptoms/index.html' },
    { org: 'CDC', title: 'Diabetes Risk Factors', url: 'https://www.cdc.gov/diabetes/risk-factors/index.html' },
    { org: 'CDC', title: 'Prediabetes – Prevent Type 2 Diabetes', url: 'https://www.cdc.gov/diabetes/prevention-type-2/prediabetes-prevent-type-2.html' },
    { org: 'CDC', title: 'Stop Diabetes Complications (ABCs)', url: 'https://www.cdc.gov/diabetes/prevention-type-2/stop-diabetes-complications.html' },
    { org: 'NHS', title: 'Type 2 diabetes Overview', url: 'https://www.nhs.uk/conditions/type-2-diabetes/' },
    { org: 'NHS', title: 'Symptoms of type 2 diabetes', url: 'https://www.nhs.uk/conditions/type-2-diabetes/symptoms/' },
    { org: 'NHS', title: 'Diabetic ketoacidosis (DKA)', url: 'https://www.nhs.uk/conditions/diabetic-ketoacidosis/' },
    { org: 'NIDDK (NIH)', title: 'Risk Factors for Type 2 Diabetes', url: 'https://www.niddk.nih.gov/health-information/diabetes/overview/risk-factors-type-2-diabetes' },
    { org: 'ADA', title: 'Understanding Type 2 Diabetes', url: 'https://diabetes.org/about-diabetes/type-2' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {isAr ? 'لوحة الشفافية التقنية والطبية (AI Transparency)' : 'Technical & Medical AI Transparency'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'توثيق المعايير، النموذج، وقاعدة المعرفة لعرض الدكتور' : 'Documentation of stack, safety boundaries, and knowledge base'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 px-6 gap-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('stack')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'stack'
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isAr ? 'البنية التقنية' : 'Tech Stack'}</span>
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'safety'
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{isAr ? 'ضوابط الأمان' : 'Safety Rules'}</span>
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'sources'
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{isAr ? 'المصادر المعتمدة' : 'Verified Sources'}</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'export'
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>{isAr ? 'تصدير سجل الأسئلة' : 'Session Export'}</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
            {/* Tab 1: Tech Stack */}
            {activeTab === 'stack' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  <h3 className="font-bold text-teal-900 dark:text-teal-200 mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{isAr ? 'الهندسة البرمجية ومحرك الذكاء الاصطناعي:' : 'Architecture & AI Engine:'}</span>
                  </h3>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li>• <strong>Framework:</strong> Next.js 14 (App Router) + TypeScript + Tailwind CSS + Motion.</li>
                    <li>• <strong>AI Engine:</strong> Google Gemini API with full multi-turn conversational history.</li>
                    <li>• <strong>Knowledge Grounding (RAG):</strong> Dynamic local retrieval from <code>knowledge_base/</code> (5 structured markdown documents and 25 verified URLs in <code>verified_sources_index.json</code>).</li>
                    <li>• <strong>Zero Hallucination Citation Filter:</strong> Programmatic validation on backend stripping any citation URL not pre-indexed.</li>
                    <li>• <strong>Offline/Resilient Fallback:</strong> Automatic local semantic grounded answering engine guaranteeing 100% uptime during live offline presentations.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Safety Rules */}
            {activeTab === 'safety' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{isAr ? 'الحدود الطبية وقواعد السلامة الخمس:' : 'Core Clinical Safety Boundaries:'}</span>
                  </h3>
                  <div className="space-y-2">
                    <p>1. <strong>نموذج تثقيفي تجريبي:</strong> التنبيه الدائم بأن النظام مخصص للتثقيف الأكاديمي وليس جهازاً طبياً معتمداً.</p>
                    <p>2. <strong>حظر التشخيص الشخصي:</strong> لا يقوم البوت بتأكيد أو نفي إصابة أي مستخدم بل يشرح النطاقات العامة ويوجهه للطبيب.</p>
                    <p>3. <strong>حظر وصف وتعديل الجرعات:</strong> الامتناع الصارم عن تحديد مليغرامات الأدوية (مثل الميتفورمين) أو وحدات الإنسولين.</p>
                    <p>4. <strong>كاشف الطوارئ وعلامات الخطر:</strong> رصد فوري لأعراض DKA وهبوط السكر الشديد وألم الصدر مع إطلاق إنذار أحمر لمراجعة الطوارئ.</p>
                    <p>5. <strong>الاعتراف بحدود المعرفة والخصوصية:</strong> رفض الأسئلة الخارجة عن التخصص (كالصداع وحموضة المعدة) وحجب بيانات الهوية الشخصية.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Sources */}
            {activeTab === 'sources' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {isAr
                    ? 'قائمة بالروابط المعتمدة الرسمية المأخوذة من مسابقة السكري (المخزنة محلياً في verified_sources_index.json):'
                    : 'Official authoritative sources indexed locally in verified_sources_index.json:'}
                </p>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {verifiedSources.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between hover:bg-teal-50/50 dark:hover:bg-teal-950/40 hover:border-teal-200 transition-colors"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 block">
                          {s.org}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{s.title}</span>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-teal-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Session Export */}
            {activeTab === 'export' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm block">
                      {isAr ? 'تصدير جدول سجل الأسئلة (Q&A Log)' : 'Export Q&A Log Table'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? `تم تسجيل ${messages.filter((m) => m.role === 'user').length} أسئلة في هذه الجلسة.`
                        : `${messages.filter((m) => m.role === 'user').length} questions recorded in this session.`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCopyExport}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{copiedExport ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الجدول' : 'Copy Table')}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleDownloadExport}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحميل ملف .md' : 'Download .md'}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="bg-slate-900 text-slate-100 p-3 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60">
                  <pre>{generateMarkdownExport()}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500">
            <span>Type 2 Diabetes Chatbot — Group 01</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
