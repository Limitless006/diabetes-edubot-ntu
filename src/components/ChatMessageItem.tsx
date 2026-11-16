'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Bot,
  AlertOctagon,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Volume2,
  VolumeX,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

export interface MessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  is_emergency?: boolean;
  is_out_of_scope?: boolean;
  has_pii?: boolean;
  citations?: Array<{
    organization: string;
    title: string;
    url: string;
  }>;
  follow_ups?: string[];
  timestamp?: string;
}

interface ChatMessageItemProps {
  message: MessageProps;
  language: 'ar' | 'en';
  isLatestAssistant?: boolean;
  onSelectFollowUp: (followUpText: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  language,
  isLatestAssistant = false,
  onSelectFollowUp,
}) => {
  const isAr = language === 'ar';
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCitations, setShowCitations] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown for speech synthesis
    const cleanText = message.content
      .replace(/[#\*`_>]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Structured Markdown Parser for Clean Readability
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3 (###)
      if (trimmed.startsWith('### ')) {
        return (
          <h4
            key={idx}
            className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mt-3 mb-1.5 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            <span>{trimmed.replace(/^###\s*/, '')}</span>
          </h4>
        );
      }

      // Heading 2 (##)
      if (trimmed.startsWith('## ')) {
        return (
          <h3
            key={idx}
            className="font-extrabold text-teal-800 dark:text-teal-300 text-base sm:text-lg mt-4 mb-2 pb-1 border-b border-slate-100 dark:border-slate-800"
          >
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }

      // Divider (---)
      if (trimmed === '---') {
        return (
          <hr
            key={idx}
            className="my-3 border-slate-200/80 dark:border-slate-700/60"
          />
        );
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        return (
          <blockquote
            key={idx}
            className="my-2.5 p-3 bg-teal-50/70 dark:bg-teal-950/40 border-r-3 rtl:border-r-3 ltr:border-l-3 border-teal-500 rounded-xl text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed"
          >
            {trimmed.replace(/^>\s*/, '')}
          </blockquote>
        );
      }

      // Bullet list item (* or -)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
        return (
          <li
            key={idx}
            className="ms-4 list-disc text-slate-700 dark:text-slate-300 my-1 leading-relaxed text-xs sm:text-sm"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(bulletText),
              }}
            />
          </li>
        );
      }

      // Numbered list item (1. ...)
      if (/^\d+\.\s+/.test(trimmed)) {
        const numText = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <li
            key={idx}
            className="ms-4 list-decimal text-slate-700 dark:text-slate-300 my-1 leading-relaxed text-xs sm:text-sm"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(numText),
              }}
            />
          </li>
        );
      }

      // Empty line spacing
      if (trimmed === '') {
        return <div key={idx} className="h-1.5" />;
      }

      // Normal paragraph
      return (
        <p
          key={idx}
          className="my-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm"
        >
          <span
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
          />
        </p>
      );
    });
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-teal-800 dark:text-teal-300 font-mono text-xs border border-slate-200/80 dark:border-slate-600">$1</code>'
      )
      .replace(
        /\*(.*?)\*/g,
        '<em class="italic text-slate-800 dark:text-slate-200">$1</em>'
      );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 w-full my-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-2xs mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble/Card */}
      <div
        className={`max-w-[92%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 shadow-2xs transition-all ${
          isUser
            ? 'bg-teal-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-bl-xs'
        }`}
      >
        {/* User Content */}
        {isUser ? (
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        ) : (
          <div className="space-y-2.5">
            {/* 1. URGENT EMERGENCY ALERT BANNER */}
            {message.is_emergency && (
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-100 flex items-start gap-2 shadow-2xs"
              >
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs">
                  <strong className="font-extrabold block text-rose-800 dark:text-rose-200 mb-0.5">
                    {isAr
                      ? '🚨 تحذير طبي طارئ (Immediate Emergency Alert)'
                      : '🚨 Urgent Emergency Alert'}
                  </strong>
                  <span>
                    {isAr
                      ? 'الأعراض المذكورة قد تدل على مضاعفات حادة تهدد الحياة (مثل DKA أو هبوط حاد). يرجى التوجه فوراً لقسم الطوارئ أو الاتصال بالإسعاف (911 / 997 / 112).'
                      : 'Symptoms may indicate acute life-threatening emergencies. Seek emergency care immediately!'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. PII / PRIVACY ALERT BANNER */}
            {message.has_pii && (
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {isAr
                    ? 'تم حجب بيانات الهوية الشخصية للحفاظ على خصوصيتك.'
                    : 'Personal data was sanitized for privacy.'}
                </span>
              </div>
            )}

            {/* 3. ASSISTANT MESSAGE CONTENT */}
            <div className="text-xs sm:text-sm">
              {renderFormattedContent(message.content)}
            </div>

            {/* 4. COLLAPSIBLE VERIFIED CITATIONS ACCORDION */}
            {message.citations && message.citations.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowCitations(!showCitations)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-500 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300 bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>
                    {isAr
                      ? `📚 ${message.citations.length} مصادر رسمية معتمدة`
                      : `📚 ${message.citations.length} Verified Sources`}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      showCitations ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showCitations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-1.5 pt-2"
                    >
                      {message.citations.map((c, i) => (
                        <a
                          key={i}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-bold shrink-0">
                              {c.organization}
                            </span>
                            <span className="truncate font-medium">
                              {c.title}
                            </span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600 shrink-0 ms-2" />
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 5. CONTEXTUAL FOLLOW-UP CHIPS (ONLY SHOWN FOR LATEST ASSISTANT MESSAGE) */}
            {isLatestAssistant &&
              message.follow_ups &&
              message.follow_ups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80"
                >
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>
                      {isAr ? 'أسئلة متابعة مقترحة:' : 'Suggested Follow-ups:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {message.follow_ups.map((fu, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => onSelectFollowUp(fu)}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200/90 dark:border-slate-700 hover:border-teal-300 text-slate-600 dark:text-slate-300 transition-all cursor-pointer font-medium text-start"
                      >
                        {fu}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* 6. ACTION BAR (LISTEN & COPY) */}
            <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-slate-100/80 dark:border-slate-800/60 text-slate-400">
              <button
                onClick={handleSpeak}
                className="flex items-center gap-1 text-[11px] hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                title={
                  isAr
                    ? isSpeaking
                      ? 'إيقاف القراءة'
                      : 'استمع للإجابة'
                    : 'Listen'
                }
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-rose-500">
                      {isAr ? 'إيقاف' : 'Stop'}
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استماع' : 'Listen'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                title={isAr ? 'نسخ النص' : 'Copy'}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">
                      {isAr ? 'تم النسخ' : 'Copied'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-700 dark:bg-slate-600 flex items-center justify-center text-white shrink-0 shadow-2xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
