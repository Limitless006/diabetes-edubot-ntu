'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, Download, X } from 'lucide-react';

interface ClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: () => void;
  onExportFirst: () => void;
  language: 'ar' | 'en';
  messageCount: number;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  isOpen,
  onClose,
  onConfirmClear,
  onExportFirst,
  language,
  messageCount,
}) => {
  const isAr = language === 'ar';

  if (!isOpen) return null;

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
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-start space-y-4"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Icon */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {isAr ? 'بدء محادثة جديدة وحذف السجل؟' : 'Start New Chat & Clear History?'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isAr
                  ? `سيتم مسح جميع الرسائل الحالية (${messageCount} رسالة). يمكنك تصدير سجل الجلسة أولاً كملف Markdown للاحتفاظ به قبل المسح.`
                  : `This will clear all current messages (${messageCount} messages). You can export the session to Markdown first before resetting.`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5 justify-end">
            {/* Export First Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onExportFirst();
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>{isAr ? 'تصدير السجل أولاً' : 'Export First'}</span>
            </motion.button>

            {/* Cancel */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              {isAr ? 'تراجع' : 'Cancel'}
            </motion.button>

            {/* Confirm Clear */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onConfirmClear();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isAr ? 'نعم، مسح المحادثة' : 'Yes, Clear Chat'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
