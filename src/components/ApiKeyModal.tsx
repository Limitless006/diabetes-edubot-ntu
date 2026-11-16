'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, X, Check, ExternalLink, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveKey,
  currentKey,
}) => {
  const isAr = language === 'ar';
  const [keyInput, setKeyInput] = useState(currentKey);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setKeyInput(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    setKeyInput('');
    onSaveKey('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-start space-y-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {isAr ? 'إعدادات مفتاح Google Gemini' : 'Google Gemini API Key'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'اختياري: لتفعيل ذكاء Gemini السحابي المباشر أو استخدام المحرك المحلي'
                  : 'Optional: Enable live cloud Gemini AI or keep local RAG'}
              </p>
            </div>
          </div>

          {/* Mode Indicator */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'حالة المحرك النشط:' : 'Active Engine Status:'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                currentKey
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
              }`}>
                {currentKey ? (isAr ? 'Gemini 2.5 Flash سحابي ⚡' : 'Gemini Cloud ⚡') : (isAr ? 'محرك RAG المحلي الموثق 🛡️' : 'Local Grounded RAG 🛡️')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'إذا لم يتوفر مفتاح API، يعمل التطبيق تلقائياً عبر محرك البحث الدلالي المحلي المستند للمصادر الرسمية لمنع أي انقطاع.'
                : 'If no API key is provided, the app uses the resilient local semantic RAG engine.'}
            </p>
          </div>

          {/* Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'الصق مفتاح Gemini API هنا:' : 'Paste Gemini API Key:'}
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none font-mono text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Get Key Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>{isAr ? 'الحصول على مفتاح مجاني من Google AI Studio' : 'Get free API key from Google AI Studio'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {currentKey && (
              <button
                onClick={handleRemove}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'حذف المفتاح' : 'Remove'}</span>
              </button>
            )}

            <div className="flex items-center gap-2 ms-auto">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-200" /> : <Sparkles className="w-4 h-4" />}
                <span>{isSaved ? (isAr ? 'تم الحفظ!' : 'Saved!') : (isAr ? 'حفظ وتفعيل' : 'Save & Enable')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
