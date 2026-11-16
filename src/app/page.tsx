'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/components/Header';
import { ReferencePanel } from '@/components/ReferencePanel';
import { WelcomeHero } from '@/components/WelcomeHero';
import { ChatMessageItem, MessageProps } from '@/components/ChatMessageItem';
import { TransparencyModal } from '@/components/TransparencyModal';
import { BenchmarkDrawer } from '@/components/BenchmarkDrawer';
import { ClearChatModal } from '@/components/ClearChatModal';
import { GlucometerModal } from '@/components/GlucometerModal';
import {
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileCheck,
  ListOrdered,
  Droplet,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);
  const [showBenchmarkDrawer, setShowBenchmarkDrawer] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showGlucometerModal, setShowGlucometerModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAr = language === 'ar';

  // Read saved theme from localStorage (default to dark for cyber medical look)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('diabetes_theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(true);
      }
    }
  }, []);

  // Synchronize HTML language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Synchronize Dark Mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('diabetes_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('diabetes_theme', 'light');
    }
  }, [isDarkMode]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: MessageProps = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      const botMessage: MessageProps = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        is_emergency: data.is_emergency,
        is_out_of_scope: data.is_out_of_scope,
        has_pii: data.has_pii,
        citations: data.citations,
        follow_ups: data.follow_ups,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: MessageProps = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          isAr
            ? '⚠️ عذراً، حدث خطأ أثناء معالجة الطلب. يرجى إعادة المحاولة أو التحقق من الاتصال.'
            : '⚠️ Sorry, an error occurred while processing your query. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmClearChat = () => {
    setMessages([]);
    setInput('');
  };

  // Identify the latest assistant message so only it displays follow-up chips
  const lastAssistantMessageId = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')?.id;

  // Starter Suggestion Pills (Rendered only on empty state)
  const starterSuggestions = isAr
    ? [
        { label: '🥗 طريقة طبق السكري المتوازن', query: 'ما هي طريقة طبق السكري المتوازن في التغذية؟' },
        { label: '📊 فحص السكر التراكمي (HbA1c)', query: 'ما هو فحص السكر التراكمي (HbA1c) وما دلالات أرقامه؟' },
        { label: '🍯 خرافة التمر والعسل الطبيعي', query: 'هل التمر والعسل مسموح لمريض السكري وكم حبة؟' },
        { label: '🌅 الخمول بعد الأكل وظاهرة الفجر', query: 'ليش احس بخمول ونعاس ورا الغدا وما هي ظاهرة الفجر؟' },
        { label: '⚡ قاعدة 15-15 لعلاج هبوط السكر', query: 'كيف أتصرف عند هبوط السكر المفاجئ وما هي قاعدة 15-15؟' },
      ]
    : [
        { label: '🥗 Diabetes Plate Method', query: 'What is the Diabetes Plate Method for meal planning?' },
        { label: '📊 HbA1c Testing & Targets', query: 'What is the HbA1c test and its target ranges?' },
        { label: '🍯 Natural Honey & Dates Myth', query: 'Can a person with diabetes eat dates and natural honey?' },
        { label: '🌅 Post-Meal Fatigue & Dawn Spike', query: 'Why do I feel tired after lunch and what is the dawn phenomenon?' },
        { label: '⚡ Rule of 15 for Hypoglycemia', query: 'How to manage sudden low blood sugar and what is the 15-15 rule?' },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-slate-50 to-slate-100 dark:from-teal-950/20 dark:via-slate-950 dark:to-[#03060a] text-slate-900 dark:text-slate-100 font-sans transition-colors relative overflow-x-hidden">
      {/* Subtle Aurora Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HEADER */}
      <Header
        language={language}
        onToggleLanguage={() =>
          setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'))
        }
        onOpenTransparency={() => setShowTransparencyModal(true)}
        onOpenBenchmarkDrawer={() => setShowBenchmarkDrawer(true)}
        onOpenGlucometer={() => setShowGlucometerModal(true)}
        onToggleReferencePanel={() => setShowReferencePanel((prev) => !prev)}
        onOpenClearModal={() => setShowClearModal(true)}
        showReferencePanel={showReferencePanel}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* 2. MAIN EXPANSIVE CHAT STAGE (Full Width, Centered, Luxurious) */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col justify-between transition-all z-10">
        <section className="flex-1 flex flex-col bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden min-h-[640px] max-h-[calc(100vh-125px)] transition-all">
          {/* Chat Messages / Welcome Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 flex flex-col">
            {messages.length === 0 ? (
              <WelcomeHero
                language={language}
                onOpenBenchmark={() => setShowBenchmarkDrawer(true)}
                onOpenGlucometer={() => setShowGlucometerModal(true)}
              />
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    language={language}
                    isLatestAssistant={msg.id === lastAssistantMessageId}
                    onSelectFollowUp={(fu) => handleSendMessage(fu)}
                  />
                ))}
              </AnimatePresence>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 my-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl rounded-bl-xs text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
                  <span className="font-medium">
                    {isAr
                      ? 'جاري استرجاع المعرفة السريرية الموثقة من 25 مصدراً دولياً...'
                      : 'Retrieving verified clinical evidence from 25 global sources...'}
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills (Shown gracefully above input dock on empty chat) */}
          {messages.length === 0 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-extrabold shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'أسئلة سريعة مقترحة:' : 'Quick Prompts:'}</span>
                </span>
                {starterSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200/80 dark:border-slate-700/70 hover:border-teal-400 transition-all font-medium text-xs cursor-pointer shadow-2xs flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Floating Input Dock */}
          <div className="p-3 sm:p-5 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <div className="relative flex items-center bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl shadow-md focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 sm:p-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAr
                    ? 'اكتب سؤالك هنا عن سكر الدم، الوجبات، الأعراض، أو اسأل باللهجة العراقية...'
                    : 'Ask anything about Type 2 Diabetes, symptoms, nutrition, or glucose...'
                }
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent resize-none border-0 focus:ring-0 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 p-2 max-h-32 min-h-[42px] outline-none leading-relaxed"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all shadow-md shadow-teal-500/25 cursor-pointer"
                title={isAr ? 'إرسال' : 'Send'}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                )}
              </motion.button>
            </div>

            {/* Input Dock Helper Footer (Clean & Prominent Direct Access) */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 px-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">
                  {isAr
                    ? 'إجابات سريرية رصينة مقيدة بـ 25 مصدراً دولياً'
                    : 'Evidence-grounded clinical AI bounded by 25 sources'}
                </span>
              </div>

              {/* Direct Quick Shortcuts */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowGlucometerModal(true)}
                  className="hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center gap-1 text-rose-600 dark:text-rose-400 cursor-pointer transition-colors"
                >
                  <Droplet className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{isAr ? 'محاكي جهاز السكر' : 'Glucometer'}</span>
                </button>

                <button
                  onClick={() => setShowBenchmarkDrawer(true)}
                  className="hover:text-teal-700 dark:hover:text-teal-300 font-bold flex items-center gap-1 text-teal-600 dark:text-teal-400 cursor-pointer transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{isAr ? 'الأسئلة الـ 15 المعتمدة' : '15 Qs'}</span>
                </button>

                <button
                  onClick={() => setShowReferencePanel(true)}
                  className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'دليل القراءات' : 'Reference'}</span>
                </button>

                <button
                  onClick={() => setShowTransparencyModal(true)}
                  className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'تصدير' : 'Export'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. BENCHMARK 15 QUESTIONS DRAWER */}
      <BenchmarkDrawer
        isOpen={showBenchmarkDrawer}
        onClose={() => setShowBenchmarkDrawer(false)}
        language={language}
        onSelectQuestion={(qText) => handleSendMessage(qText)}
      />

      {/* 4. CLEAR CHAT CONFIRMATION MODAL */}
      <ClearChatModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirmClear={handleConfirmClearChat}
        onExportFirst={() => {
          setShowClearModal(false);
          setShowTransparencyModal(true);
        }}
        language={language}
        messageCount={messages.length}
      />

      {/* 5. INTERACTIVE GLUCOMETER SIMULATOR MODAL */}
      <GlucometerModal
        isOpen={showGlucometerModal}
        onClose={() => setShowGlucometerModal(false)}
        language={language}
        onConsultBot={(query) => handleSendMessage(query)}
      />

      {/* 6. TRANSPARENCY & SESSION EXPORT MODAL */}
      <TransparencyModal
        isOpen={showTransparencyModal}
        onClose={() => setShowTransparencyModal(false)}
        language={language}
        messages={messages}
      />

      {/* 7. REFERENCE PANEL SLIDE-OVER DRAWER */}
      <ReferencePanel
        isOpen={showReferencePanel}
        onClose={() => setShowReferencePanel(false)}
        language={language}
      />
    </div>
  );
}
