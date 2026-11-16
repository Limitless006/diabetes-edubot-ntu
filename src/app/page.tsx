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
  Maximize2,
  Droplet,
} from 'lucide-react';

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReferencePanel, setShowReferencePanel] = useState(true);
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);
  const [showBenchmarkDrawer, setShowBenchmarkDrawer] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showGlucometerModal, setShowGlucometerModal] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAr = language === 'ar';

  // Read saved theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('diabetes_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
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
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* 2. MAIN BODY LAYOUT */}
      <main
        className={`flex-1 w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5 transition-all ${
          isPresentationMode ? 'max-w-4xl' : 'max-w-7xl'
        }`}
      >
        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden min-h-[620px] max-h-[calc(100vh-130px)] transition-all">
          {/* Quick Header Bar inside Chat in Presentation Mode */}
          {isPresentationMode && (
            <div className="px-5 py-2.5 bg-teal-50 dark:bg-teal-950/60 border-b border-teal-100 dark:border-teal-900/60 flex items-center justify-between text-xs">
              <span className="font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {isAr
                    ? 'وضع العرض التقديمي (7-Min Presentation Focus)'
                    : 'Live Presentation Mode'}
                </span>
              </span>
              <button
                onClick={() => setShowBenchmarkDrawer(true)}
                className="text-teal-700 dark:text-teal-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>{isAr ? 'فتح الأسئلة الـ 15' : 'Open 15 Questions'}</span>
              </button>
            </div>
          )}

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 flex flex-col">
            {/* Clean Hero Welcome Screen when chat is empty */}
            {messages.length === 0 ? (
              <WelcomeHero
                language={language}
                onSelectPrompt={(p) => handleSendMessage(p)}
                onOpenBenchmark={() => setShowBenchmarkDrawer(true)}
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
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-2xl rounded-bl-xs text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
                  <span>
                    {isAr
                      ? 'جاري استرجاع المعرفة السريرية الموثقة...'
                      : 'Retrieving verified clinical knowledge...'}
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xs focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 transition-all p-1.5 sm:p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAr
                    ? 'اكتب سؤالك هنا عن سكر الدم، التغذية والوجبات، أو الأعراض...'
                    : 'Ask any question about Type 2 Diabetes here...'
                }
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent resize-none border-0 focus:ring-0 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 p-2 max-h-32 min-h-[38px] outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
                title={isAr ? 'إرسال' : 'Send'}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                )}
              </motion.button>
            </div>

            {/* Input Bar Helper Footer */}
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">
                  {isAr
                    ? 'إجابات موثقة رسمياً خالية من الهلوسة'
                    : 'Officially verified clinical AI'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 ms-2">
                <button
                  onClick={() => setShowGlucometerModal(true)}
                  className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <Droplet className="w-3 h-3 fill-rose-500" />
                  <span>{isAr ? 'جهاز السكر' : 'Glucometer'}</span>
                </button>
                <button
                  onClick={() => setShowBenchmarkDrawer(true)}
                  className="hover:text-teal-700 dark:hover:text-teal-300 font-semibold flex items-center gap-1 text-teal-600 dark:text-teal-400 cursor-pointer"
                >
                  <ListOrdered className="w-3 h-3" />
                  <span>{isAr ? 'الأسئلة الـ 15' : '15 Qs'}</span>
                </button>
                <button
                  onClick={() => setShowTransparencyModal(true)}
                  className="hover:text-teal-700 dark:hover:text-teal-300 underline flex items-center gap-1 cursor-pointer"
                >
                  <FileCheck className="w-3 h-3 text-slate-400" />
                  <span>{isAr ? 'تصدير' : 'Export'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Reference Panel (Collapsible Sidebar - Hidden in Presentation Mode) */}
        {!isPresentationMode && showReferencePanel && (
          <ReferencePanel
            language={language}
            onClose={() => setShowReferencePanel(false)}
          />
        )}
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
    </div>
  );
}
