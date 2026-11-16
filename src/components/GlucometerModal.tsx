'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Droplet,
  Send,
  Info,
} from 'lucide-react';

interface GlucometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onConsultBot: (query: string) => void;
}

type TestContext = 'fasting' | 'postprandial' | 'random' | 'hba1c';

export const GlucometerModal: React.FC<GlucometerModalProps> = ({
  isOpen,
  onClose,
  language,
  onConsultBot,
}) => {
  const isAr = language === 'ar';

  const [context, setContext] = useState<TestContext>('fasting');
  const [glucoseValue, setGlucoseValue] = useState<number>(105);
  const [hba1cValue, setHba1cValue] = useState<number>(6.2);

  if (!isOpen) return null;

  // Clinical evaluation logic according to CDC & ADA standards
  const getGlucoseStatus = () => {
    if (context === 'hba1c') {
      if (hba1cValue < 5.7) {
        return {
          category: isAr ? 'طبيعي وسليم' : 'Normal',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: isAr
            ? 'مستوى سكر تراكمي طبيعي وصحي (أقل من 5.7%). استمر في الحفاظ على نمط حياة متوازن.'
            : 'Normal healthy range (<5.7%). Maintain regular physical activity and balanced diet.',
          advice: isAr
            ? 'فحص دوري كل سنتين إلى 3 سنوات.'
            : 'Routine screening every 2 to 3 years.',
        };
      } else if (hba1cValue <= 6.4) {
        return {
          category: isAr ? 'مرحلة ما قبل السكري (Prediabetes)' : 'Prediabetes',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: isAr
            ? 'مرحلة إنذار مبكرة تشير لمقاومة الإنسولين (5.7% - 6.4%). يمكن عكس هذه المرحلة تماماً بإنقاص 5-7% من الوزن وممارسة الرياضة!'
            : 'Early warning stage (5.7% - 6.4%). Highly reversible through 5-7% weight reduction and lifestyle changes.',
          advice: isAr
            ? 'طريقة طبق السكري + 150 دقيقة مشي أسبوعياً ومراجعة الطبيب.'
            : 'Plate method + 150 min weekly walking + clinical follow-up.',
        };
      } else {
        return {
          category: isAr ? 'تشخيص داء السكري (Diabetes Range)' : 'Diabetes Diagnostic Range',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: isAr
            ? 'مستوى يطابق معايير تشخيص السكري (6.5% أو أعلى في فحصين منفصلين). الهدف العلاجي لمعظم البالغين تحت 7.0%.'
            : 'Diagnostic threshold (≥6.5% confirmed by two tests). Target for most adults is <7.0%.',
          advice: isAr
            ? 'مراجعة الطبيب لوضع خطة علاجية مخصصة وفحص وظائف الكلى والعين.'
            : 'Mandatory clinical consultation for personalized management plan.',
        };
      }
    }

    // Blood Glucose Evaluation (Fasting vs Postprandial vs Random)
    if (glucoseValue < 70) {
      return {
        category: isAr ? '🚨 هبوط حاد في السكر (Hypoglycemia)' : '🚨 Acute Hypoglycemia',
        color: 'red',
        badgeBg: 'bg-rose-600/30 text-rose-200 border-rose-500 animate-pulse',
        desc: isAr
          ? 'حالة هبوط طارئة تستلزم إسعافاً سريعاً فوراً (أقل من 70 ملغ/ديسيلتر) لمنع فقدان الوعي!'
          : 'Urgent low blood glucose (<70 mg/dL). Immediate fast-acting carbs required!',
        advice: isAr
          ? 'طبق قاعدة الـ 15 فوراً: تناول 15 غرام سكر سريع (نصف كوب عصير أو ملعقة عسل)، وانتظر 15 دقيقة ثم قس السكر ثانية.'
          : 'Apply Rule of 15 immediately: 15g fast sugar (half cup juice or honey), wait 15 min and re-check.',
      };
    }

    if (context === 'fasting') {
      if (glucoseValue <= 99) {
        return {
          category: isAr ? 'سكر صائم طبيعي' : 'Normal Fasting Glucose',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: isAr
            ? 'قراءة سكر صائم ممتازة وسليمة (70 - 99 ملغ/ديسيلتر بعد صيام 8 ساعات).'
            : 'Optimal fasting glucose (70 - 99 mg/dL after 8 hours fast).',
          advice: isAr ? 'استمر في الحفاظ على هذا المستوى الصحي.' : 'Keep up healthy nutrition and sleep habits.',
        };
      } else if (glucoseValue <= 125) {
        return {
          category: isAr ? 'مرحلة ما قبل السكري (ضعف سكر الصيام)' : 'Impaired Fasting Glucose (Prediabetes)',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: isAr
            ? 'قراءة مرتفعة عن الطبيعي تشير لاضطراب أيضي مبكر (100 - 125 ملغ/ديسيلتر).'
            : 'Elevated fasting reading (100 - 125 mg/dL) indicating insulin resistance.',
          advice: isAr
            ? 'تقليل النشويات المكررة في العشاء، وفحص السكر التراكمي لدى الطبيب.'
            : 'Reduce dinner carbs, get an HbA1c test, and start light exercise.',
        };
      } else if (glucoseValue < 300) {
        return {
          category: isAr ? 'مرتفع - مؤشر للإصابة بالسكري' : 'Elevated - Diabetes Diagnostic Range',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: isAr
            ? 'قراءة صائم مرتفعة تبلغ 126 ملغ/ديسيلتر أو أكثر، تتطلب تقييماً سريرياً.'
            : 'High fasting glucose (≥126 mg/dL) consistent with diabetes diagnosis criteria.',
          advice: isAr ? 'استشارة الطبيب لتقييم الحاجة للعلاج الدوائي ونمط الحياة.' : 'Consult a doctor for clinical workup.',
        };
      } else {
        return {
          category: isAr ? '🚨 ارتفاع حرج وخطر حماض كيتوني DKA' : '🚨 Severe Hyperglycemia (DKA Risk)',
          color: 'red',
          badgeBg: 'bg-rose-700/40 text-rose-100 border-rose-500 animate-pulse',
          desc: isAr
            ? 'قراءة شديدة الارتفاع (300+ ملغ/ديسيلتر) قد تسبب الجفاف الشديد والحماض الكيتوني السكري!'
            : 'Severely elevated glucose (≥300 mg/dL). High risk of dehydration and DKA.',
          advice: isAr
            ? 'شرب الماء بكثرة، فحص الكيتونات، والتوجه فوراً للطوارئ إذا رافقها قيء أو ضيق تنفس.'
            : 'Drink water, check ketones, seek immediate emergency care if nausea/breathlessness.',
        };
      }
    } else {
      // Postprandial (2 hours after meal) or Random
      if (glucoseValue < 140) {
        return {
          category: isAr ? 'طبيعي بعد الأكل' : 'Normal Postprandial',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: isAr
            ? 'قراءة ممتازة بعد تناول الطعام بساعتين (أقل من 140 ملغ/ديسيلتر).'
            : 'Optimal 2-hour postprandial glucose (<140 mg/dL).',
          advice: isAr ? 'استجابة إنسولين صحية وخلايا بيتا نشطة.' : 'Healthy metabolic response.',
        };
      } else if (glucoseValue <= 199) {
        return {
          category: isAr ? 'مرتفع بعد الأكل (عدم تحمل الجلوكوز)' : 'Impaired Glucose Tolerance',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: isAr
            ? 'ارتفاع طفيف بعد الوجبة (140 - 199 ملغ/ديسيلتر) يشير لبطء امتصاص الخلايا للجلوكوز.'
            : 'Elevated post-meal reading (140 - 199 mg/dL) showing mild glucose intolerance.',
          advice: isAr
            ? 'المشي 15 دقيقة بعد الغداء وتطبيق طريقة طبق السكري لتقليل قفزة الجلوكوز.'
            : 'Walk for 15 mins after meals and prioritize fiber-rich foods.',
        };
      } else if (glucoseValue < 300) {
        return {
          category: isAr ? 'مرتفع - نطاق السكري بعد الأكل' : 'High Diabetic Postprandial',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: isAr
            ? 'قراءة مرتفعة تبلغ 200 ملغ/ديسيلتر أو أكثر بعد الأكل بساعتين.'
            : 'Post-meal glucose ≥200 mg/dL meeting clinical criteria for diabetes.',
          advice: isAr ? 'مراجعة الطبيب وتعديل النشويات في الوجبات.' : 'Doctor consultation recommended.',
        };
      } else {
        return {
          category: isAr ? '🚨 ارتفاع حرج وخطر حماض كيتوني DKA' : '🚨 Severe Hyperglycemia (DKA Risk)',
          color: 'red',
          badgeBg: 'bg-rose-700/40 text-rose-100 border-rose-500 animate-pulse',
          desc: isAr
            ? 'قراءة حادة الارتفاع تزيد عن 300 ملغ/ديسيلتر.'
            : 'Critical glucose ≥300 mg/dL. Emergency DKA danger.',
          advice: isAr ? 'التوجه لقسم الطوارئ فوراً.' : 'Seek immediate emergency attention.',
        };
      }
    }
  };

  const status = getGlucoseStatus();

  // Send query directly to chat
  const handleAskBot = () => {
    let queryText = '';
    if (context === 'hba1c') {
      queryText = isAr
        ? `سويت فحص سكر تراكمي (HbA1c) وطلعت النتيجة ${hba1cValue}%، شنو يعني هذا الرقم وما هو التوجيه الطبي؟`
        : `My HbA1c lab test result is ${hba1cValue}%. What does this reading indicate and what are the recommended next steps?`;
    } else {
      const ctxLabel =
        context === 'fasting'
          ? isAr ? 'صائم' : 'fasting'
          : context === 'postprandial'
          ? isAr ? 'بعد الأكل بساعتين' : '2 hours after eating'
          : isAr ? 'عشوائي' : 'random';

      queryText = isAr
        ? `قست السكر بجهاز الفحص وطلعت القراءة ${glucoseValue} ملغ/ديسيلتر (${ctxLabel})، شنو تقييم هذه النتيجة؟`
        : `I checked my blood glucose on my meter and it is ${glucoseValue} mg/dL (${ctxLabel}). What is the clinical interpretation?`;
    }

    onConsultBot(queryText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Droplet className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                <span>{isAr ? 'محاكي جهاز قياس السكر الذكي' : 'Interactive Smart Glucometer'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">
                  Sim 2026
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'اختبر أي قراءة واحصل على التقييم السريري الفوري المعتمد من ADA و CDC'
                  : 'Simulate any reading with instant clinical evaluation based on ADA & CDC standards'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'fasting', label: isAr ? '🌅 صائم (8 ساعات)' : '🌅 Fasting (8h)' },
              { id: 'postprandial', label: isAr ? '🍽️ بعد الأكل (ساعتين)' : '🍽️ Post-Meal (2h)' },
              { id: 'random', label: isAr ? '⏱️ قراءة عشوائية' : '⏱️ Random' },
              { id: 'hba1c', label: isAr ? '📊 السكر التراكمي (%)' : '📊 HbA1c (%)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setContext(tab.id as TestContext)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                  context === tab.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* GLUCOMETER LCD CHASSIS (Medical Device Screen) */}
          <div className="relative p-6 rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-inner flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Ambient sensor glow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-teal-500/40" />

            {/* Test strip indicator */}
            <div className="absolute top-0 right-8 px-2 py-0.5 rounded-b-md bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
              STRIP OK
            </div>

            {/* Digital LCD Value */}
            <div className="my-2">
              <span className="text-5xl sm:text-7xl font-extrabold font-mono tracking-tight text-teal-400 drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]">
                {context === 'hba1c' ? hba1cValue.toFixed(1) : glucoseValue}
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400 ms-2 font-bold uppercase">
                {context === 'hba1c' ? '%' : 'mg/dL'}
              </span>
            </div>

            {/* Instant Clinical Evaluation Badge */}
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${status.badgeBg}`}
            >
              {status.category}
            </div>

            {/* Device Footer status line */}
            <div className="mt-3 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {context === 'hba1c'
                  ? isAr ? 'فحص الهيموجلوبين التراكمي' : 'Glycated Hemoglobin Test'
                  : context === 'fasting'
                  ? isAr ? 'فحص سكر الدم الصائم' : 'Fasting Blood Glucose'
                  : isAr ? 'فحص السكر بعد الوجبة' : 'Postprandial Blood Glucose'}
              </span>
            </div>
          </div>

          {/* Slider & Quick Preset Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{isAr ? 'ضبط القراءة يدوياً:' : 'Adjust Reading Slider:'}</span>
              <span className="font-mono text-teal-400">
                {context === 'hba1c' ? `${hba1cValue.toFixed(1)} %` : `${glucoseValue} mg/dL`}
              </span>
            </div>

            {context === 'hba1c' ? (
              <input
                type="range"
                min="4.5"
                max="13.0"
                step="0.1"
                value={hba1cValue}
                onChange={(e) => setHba1cValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            ) : (
              <input
                type="range"
                min="40"
                max="450"
                step="1"
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            )}

            {/* Quick Benchmark Preset Chips */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                {isAr ? 'قراءات نموذجية شائعة للتجربة السريعة:' : 'Quick Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {context === 'hba1c' ? (
                  <>
                    <button
                      onClick={() => setHba1cValue(5.4)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      5.4% (طبيعي)
                    </button>
                    <button
                      onClick={() => setHba1cValue(6.1)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      6.1% (ما قبل السكري)
                    </button>
                    <button
                      onClick={() => setHba1cValue(7.2)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      7.2% (هدف علاجي)
                    </button>
                    <button
                      onClick={() => setHba1cValue(9.5)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      9.5% (غير منضبط)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setGlucoseValue(55)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-950/40 text-rose-300 border border-rose-800/80 hover:bg-rose-900 cursor-pointer"
                    >
                      55 (هبوط 🚨)
                    </button>
                    <button
                      onClick={() => setGlucoseValue(92)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      92 (صائم سليم)
                    </button>
                    <button
                      onClick={() => setGlucoseValue(115)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      115 (ما قبل السكري)
                    </button>
                    <button
                      onClick={() => setGlucoseValue(175)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      175 (بعد الأكل)
                    </button>
                    <button
                      onClick={() => setGlucoseValue(340)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-950/60 text-red-200 border border-red-800 hover:bg-red-900 cursor-pointer"
                    >
                      340 (حرج DKA 🚨)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Insights Card */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-xs space-y-2">
            <p className="text-slate-200 leading-relaxed font-medium">
              {status.desc}
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-slate-300">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-teal-400 font-bold">{isAr ? 'التوجيه السريري: ' : 'Guidance: '}</strong>
                {status.advice}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 text-center sm:text-start">
            {isAr
              ? 'مستند لمعايير الجمعية الأمريكية للسكري (ADA 2026)'
              : 'Grounded in ADA & CDC clinical diagnostic guidelines'}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
            <button
              onClick={handleAskBot}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'اسأل البوت عن هذه النتيجة' : 'Ask Bot in Chat'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
