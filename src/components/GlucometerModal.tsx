'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Droplet,
  Send,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Zap,
  BatteryMedium,
  Clock,
  Database,
  ArrowRight,
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
  const [isReadingPulse, setIsReadingPulse] = useState<boolean>(false);

  if (!isOpen) return null;

  // Trigger simulated blood drop test
  const handleSimulateDrop = (targetVal?: number) => {
    setIsReadingPulse(true);
    setTimeout(() => {
      if (context === 'hba1c') {
        const val = targetVal !== undefined ? targetVal : +(Math.random() * (10.5 - 5.0) + 5.0).toFixed(1);
        setHba1cValue(val);
      } else {
        const val = targetVal !== undefined ? targetVal : Math.floor(Math.random() * (260 - 65) + 65);
        setGlucoseValue(val);
      }
      setIsReadingPulse(false);
    }, 400);
  };

  // Adjust values with stepper buttons
  const stepValue = (delta: number) => {
    if (context === 'hba1c') {
      setHba1cValue((prev) => Math.max(4.0, Math.min(14.0, +(prev + delta * 0.1).toFixed(1))));
    } else {
      setGlucoseValue((prev) => Math.max(30, Math.min(480, prev + delta)));
    }
  };

  // Clinical evaluation logic according to CDC & ADA standards
  const getGlucoseStatus = () => {
    if (context === 'hba1c') {
      if (hba1cValue < 5.7) {
        return {
          category: isAr ? 'طبيعي وسليم' : 'Normal',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)] border-emerald-500/40',
          textColor: 'text-emerald-400',
          gaugePercent: Math.min(100, Math.max(5, ((hba1cValue - 4) / 8) * 100)),
          desc: isAr
            ? 'مستوى سكر تراكمي طبيعي وصحي (أقل من 5.7%). استمر في الحفاظ على نمط حياة متوازن وغذاء قليل السكريات المكررة.'
            : 'Normal healthy HbA1c (<5.7%). Maintain regular physical activity and a balanced diet.',
          advice: isAr
            ? 'فحص دوري كل سنتين إلى 3 سنوات للأشخاص فوق عمر 35 سنة.'
            : 'Routine screening every 2 to 3 years for adults aged 35+.',
        };
      } else if (hba1cValue <= 6.4) {
        return {
          category: isAr ? 'مرحلة ما قبل السكري (Prediabetes)' : 'Prediabetes',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/40',
          textColor: 'text-amber-400',
          gaugePercent: Math.min(100, Math.max(5, ((hba1cValue - 4) / 8) * 100)),
          desc: isAr
            ? 'مرحلة إنذار مبكرة تشير لمقاومة الإنسولين (5.7% - 6.4%). يمكن عكس هذه المرحلة تماماً ومنع التحول إلى سكري دائم بإنقاص 5-7% من الوزن!'
            : 'Early warning stage (5.7% - 6.4%). Highly reversible through 5-7% weight reduction and active lifestyle.',
          advice: isAr
            ? 'تطبيق طريقة طبق السكري + 150 دقيقة مشي أسبوعياً وإعادة الفحص بعد 3-6 أشهر.'
            : 'Diabetes Plate Method + 150 min weekly walking + repeat test in 3-6 months.',
        };
      } else {
        return {
          category: isAr ? 'تشخيص داء السكري (Diabetes Range)' : 'Diabetes Diagnostic Range',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(244,63,94,0.3)] border-rose-500/40',
          textColor: 'text-rose-400',
          gaugePercent: Math.min(100, Math.max(5, ((hba1cValue - 4) / 8) * 100)),
          desc: isAr
            ? 'مستوى يطابق معايير تشخيص السكري (6.5% أو أعلى عند تأكيده بفحصين). الهدف العلاجي لمعظم البالغين تحت 7.0%.'
            : 'Diagnostic threshold (≥6.5% confirmed on two separate occasions). General adult target is <7.0%.',
          advice: isAr
            ? 'مراجعة الطبيب لوضع خطة علاجية مخصصة ومتابعة وظائف الكلى وفحص قاع العين السنوي.'
            : 'Physician consultation for medical therapy, nutrition plan, and annual microvascular screenings.',
        };
      }
    }

    // Blood Glucose Evaluation (Fasting vs Postprandial vs Random)
    if (glucoseValue < 70) {
      return {
        category: isAr ? '🚨 هبوط حاد في السكر (Hypoglycemia)' : '🚨 Acute Hypoglycemia',
        color: 'red',
        badgeBg: 'bg-rose-600/30 text-rose-200 border-rose-500 animate-pulse',
        lcdGlow: 'shadow-[0_0_45px_rgba(239,68,68,0.4)] border-rose-500 animate-pulse',
        textColor: 'text-rose-400',
        gaugePercent: 12,
        desc: isAr
          ? 'حالة هبوط طارئة تستلزم تدخلاً سريعاً فوراً (أقل من 70 ملغ/ديسيلتر) لمنع الإغماء واضطراب الوعي!'
          : 'Urgent low blood glucose (<70 mg/dL). Immediate fast-acting carbohydrate rescue required!',
        advice: isAr
          ? 'طبق قاعدة الـ 15 فوراً: تناول 15 غرام سكر سريع (نصف كوب عصير أو ملعقة عسل)، وانتظر 15 دقيقة ثم أعد قياس السكر.'
          : 'Apply Rule of 15 immediately: consume 15g fast carbs (half cup juice or honey), wait 15 min and re-check.',
      };
    }

    if (context === 'fasting') {
      if (glucoseValue <= 99) {
        return {
          category: isAr ? 'سكر صائم طبيعي ومثالي' : 'Normal Fasting Glucose',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)] border-emerald-500/40',
          textColor: 'text-emerald-400',
          gaugePercent: 32,
          desc: isAr
            ? 'قراءة سكر صائم ممتازة وسليمة (70 - 99 ملغ/ديسيلتر بعد صيام 8 ساعات كاملة).'
            : 'Optimal fasting glucose (70 - 99 mg/dL after 8 hours fast).',
          advice: isAr ? 'استمر في الحفاظ على هذا المستوى الصحي المتوازن.' : 'Keep up healthy nutrition and regular activity.',
        };
      } else if (glucoseValue <= 125) {
        return {
          category: isAr ? 'مرحلة ما قبل السكري (ضعف سكر الصيام)' : 'Impaired Fasting Glucose (Prediabetes)',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/40',
          textColor: 'text-amber-400',
          gaugePercent: 54,
          desc: isAr
            ? 'قراءة مرتفعة عن الطبيعي تشير لاضطراب أيضي مبكر ومقاومة إنسولين (100 - 125 ملغ/ديسيلتر).'
            : 'Elevated fasting reading (100 - 125 mg/dL) indicating insulin resistance.',
          advice: isAr
            ? 'تقليل النشويات المكررة في العشاء، وفحص السكر التراكمي لدى الطبيب، والمشي اليومي.'
            : 'Reduce refined evening carbs, get an HbA1c test, and start daily walking.',
        };
      } else if (glucoseValue < 300) {
        return {
          category: isAr ? 'مرتفع - مؤشر سريري للسكري' : 'Elevated - Diabetes Diagnostic Range',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(244,63,94,0.3)] border-rose-500/40',
          textColor: 'text-rose-400',
          gaugePercent: 78,
          desc: isAr
            ? 'قراءة صائم مرتفعة تبلغ 126 ملغ/ديسيلتر أو أكثر، تتطلب تأكيداً طبياً لوضع الخطة المناسبة.'
            : 'High fasting glucose (≥126 mg/dL) consistent with diabetes diagnostic criteria.',
          advice: isAr ? 'استشارة الطبيب لتقييم الحاجة للعلاج الدوائي وضبط الحمية.' : 'Consult a doctor for clinical diagnostic confirmation.',
        };
      } else {
        return {
          category: isAr ? '🚨 ارتفاع حرج وخطر حماض كيتوني DKA' : '🚨 Severe Hyperglycemia (DKA Risk)',
          color: 'red',
          badgeBg: 'bg-rose-700/40 text-rose-100 border-rose-500 animate-pulse',
          lcdGlow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)] border-rose-500 animate-pulse',
          textColor: 'text-rose-300',
          gaugePercent: 96,
          desc: isAr
            ? 'قراءة شديدة الارتفاع (300+ ملغ/ديسيلتر) قد تسبب الجفاف الشديد والحماض الكيتوني السكري!'
            : 'Severely elevated glucose (≥300 mg/dL). High risk of dehydration and DKA.',
          advice: isAr
            ? 'شرب الماء بكثرة، فحص الكيتونات، والتوجه فوراً للطوارئ في حال وجود غثيان أو قيء أو تسارع تنفس.'
            : 'Drink plenty of water, check ketones, and seek immediate emergency care if nausea or breathlessness occurs.',
        };
      }
    } else {
      // Postprandial (2 hours after meal) or Random
      if (glucoseValue < 140) {
        return {
          category: isAr ? 'طبيعي ومثالي بعد الأكل' : 'Normal Postprandial',
          color: 'emerald',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)] border-emerald-500/40',
          textColor: 'text-emerald-400',
          gaugePercent: 32,
          desc: isAr
            ? 'قراءة ممتازة بعد تناول الطعام بساعتين (أقل من 140 ملغ/ديسيلتر).'
            : 'Optimal 2-hour postprandial glucose (<140 mg/dL).',
          advice: isAr ? 'استجابة إنسولين صحية وخلايا بيتا بنكرياسية نشطة.' : 'Healthy metabolic response and active beta cells.',
        };
      } else if (glucoseValue <= 199) {
        return {
          category: isAr ? 'مرتفع بعد الأكل (ضعف تحمل الجلوكوز)' : 'Impaired Glucose Tolerance',
          color: 'amber',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/40',
          textColor: 'text-amber-400',
          gaugePercent: 60,
          desc: isAr
            ? 'ارتفاع طفيف بعد الوجبة (140 - 199 ملغ/ديسيلتر) يشير لبطء امتصاص الخلايا للجلوكوز.'
            : 'Elevated post-meal reading (140 - 199 mg/dL) showing mild glucose intolerance.',
          advice: isAr
            ? 'المشي 15 دقيقة بعد الغداء وتطبيق طريقة طبق السكري لتقليل قفزة الجلوكوز.'
            : 'Walk for 15 mins after meals and prioritize high-fiber vegetables.',
        };
      } else if (glucoseValue < 300) {
        return {
          category: isAr ? 'مرتفع - نطاق السكري بعد الأكل' : 'High Diabetic Postprandial',
          color: 'rose',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          lcdGlow: 'shadow-[0_0_35px_rgba(244,63,94,0.3)] border-rose-500/40',
          textColor: 'text-rose-400',
          gaugePercent: 82,
          desc: isAr
            ? 'قراءة مرتفعة تبلغ 200 ملغ/ديسيلتر أو أكثر بعد الأكل بساعتين.'
            : 'Post-meal glucose ≥200 mg/dL meeting clinical criteria for diabetes.',
          advice: isAr ? 'مراجعة الطبيب وتعديل النشويات في الوجبات وتجنب المشروبات السكرية.' : 'Doctor consultation recommended to evaluate medical therapy.',
        };
      } else {
        return {
          category: isAr ? '🚨 ارتفاع حرج وخطر حماض كيتوني DKA' : '🚨 Severe Hyperglycemia (DKA Risk)',
          color: 'red',
          badgeBg: 'bg-rose-700/40 text-rose-100 border-rose-500 animate-pulse',
          lcdGlow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)] border-rose-500 animate-pulse',
          textColor: 'text-rose-300',
          gaugePercent: 96,
          desc: isAr
            ? 'قراءة حادة الارتفاع تزيد عن 300 ملغ/ديسيلتر تتطلب تدخلاً طبياً عاجلاً.'
            : 'Critical glucose ≥300 mg/dL. Emergency DKA danger.',
          advice: isAr ? 'التوجه لقسم الطوارئ فوراً وعدم إهمال الحالة.' : 'Seek immediate emergency attention.',
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto relative"
      >
        {/* Top Metallic Trim & Sensor Port with Inserted Test Strip */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
              GLUCO-SMART PRO 2026
            </span>
          </div>

          {/* Test Strip Channel Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateDrop()}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title={isAr ? 'محاكاة وضع قطرة دم جديدة' : 'Simulate Blood Drop Sample'}
            >
              <Droplet className={`w-3.5 h-3.5 fill-rose-500 ${isReadingPulse ? 'animate-bounce' : ''}`} />
              <span>{isAr ? 'قطرة دم جديدة' : 'New Sample'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[82vh]">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            {[
              { id: 'fasting', label: isAr ? '🌅 صائم (8 ساعات)' : '🌅 Fasting (8h)' },
              { id: 'postprandial', label: isAr ? '🍽️ بعد الأكل (2h)' : '🍽️ Post-Meal (2h)' },
              { id: 'random', label: isAr ? '⏱️ قراءة عشوائية' : '⏱️ Random' },
              { id: 'hba1c', label: isAr ? '📊 التراكمي (%)' : '📊 HbA1c (%)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setContext(tab.id as TestContext)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                  context === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* REALISTIC MEDICAL GLUCOMETER LCD CHASSIS */}
          <div
            className={`relative p-5 sm:p-6 rounded-3xl bg-[#030712] border-2 transition-all duration-300 ${status.lcdGlow} flex flex-col items-center justify-center text-center overflow-hidden`}
          >
            {/* Top LCD Status Bar */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800/80 pb-2 mb-2">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-teal-400" />
                <span>MEM: 01/500</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>12:45 PM</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <BatteryMedium className="w-3.5 h-3.5" />
                <span>98%</span>
              </span>
            </div>

            {/* Test Strip Visual Port */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg bg-slate-900 border-x border-b border-teal-500/40 text-[9px] font-mono text-teal-300 font-bold tracking-widest flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span>SENSOR READY</span>
            </div>

            {/* Big Glowing Digital Reading */}
            <div className="my-2 flex items-baseline justify-center">
              <span
                className={`text-6xl sm:text-7xl font-black font-mono tracking-tighter ${status.textColor} transition-all duration-200`}
              >
                {context === 'hba1c' ? hba1cValue.toFixed(1) : glucoseValue}
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400 ms-2 font-extrabold uppercase">
                {context === 'hba1c' ? '%' : 'mg/dL'}
              </span>
            </div>

            {/* Instant Clinical Evaluation Badge */}
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition-all duration-200 shadow-sm ${status.badgeBg}`}
            >
              {status.category}
            </div>

            {/* Sub-label */}
            <div className="mt-3 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>
                {context === 'hba1c'
                  ? isAr ? 'فحص خضاب الدم السكري التراكمي' : 'Glycated Hemoglobin Test'
                  : context === 'fasting'
                  ? isAr ? 'فحص سكر الدم الصائم (8 ساعات)' : 'Fasting Blood Glucose'
                  : isAr ? 'فحص السكر بعد ساعتين من الوجبة' : 'Postprandial Blood Glucose'}
              </span>
            </div>
          </div>

          {/* VISUAL CLINICAL TARGET SPECTRUM GAUGE */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-rose-400 font-bold">{isAr ? 'هبوط (<70)' : 'Low (<70)'}</span>
              <span className="text-emerald-400 font-bold">{isAr ? 'طبيعي (70-99)' : 'Normal (70-99)'}</span>
              <span className="text-amber-400 font-bold">{isAr ? 'ما قبل السكري (100-125)' : 'Pre-DM (100-125)'}</span>
              <span className="text-rose-400 font-bold">{isAr ? 'سكري (≥126)' : 'Diabetes (≥126)'}</span>
            </div>

            {/* Gradient Bar with Animated Needle */}
            <div className="relative h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-emerald-400 via-amber-400 to-rose-600 overflow-hidden shadow-inner">
              <motion.div
                className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]"
                animate={{ left: `${status.gaugePercent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* STEPPERS & RANGE SLIDER CONTROLS */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>{isAr ? 'تعديل القراءة بدقة:' : 'Fine-Tune Reading:'}</span>
              <div className="flex items-center gap-1.5 font-mono">
                <button
                  onClick={() => stepValue(-5)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center font-black cursor-pointer transition-colors"
                  title="-5"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 font-bold text-teal-400 border border-slate-800 min-w-[70px] text-center">
                  {context === 'hba1c' ? `${hba1cValue.toFixed(1)} %` : `${glucoseValue} mg/dL`}
                </span>
                <button
                  onClick={() => stepValue(5)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center font-black cursor-pointer transition-colors"
                  title="+5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider */}
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
                max="420"
                step="1"
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            )}

            {/* Quick Benchmark Preset Chips */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                {isAr ? 'قراءات قياسية شائعة للتقييم السريري السريع:' : 'Standard Clinical Presets:'}
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

          {/* CLINICAL GUIDANCE & ADA RECOMMENDATIONS CARD */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs space-y-2">
            <p className="text-slate-200 leading-relaxed font-medium">
              {status.desc}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-slate-300">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-teal-400 font-bold">{isAr ? 'التوجيه السريري المعتمد: ' : 'Clinical Guidance: '}</strong>
                {status.advice}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 text-center sm:text-start">
            {isAr
              ? 'معايير الجمعية الأمريكية للسكري (ADA Standards of Care 2024 - 2026)'
              : 'Grounded in ADA & CDC clinical diagnostic criteria'}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
            <button
              onClick={handleAskBot}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md shadow-teal-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'استشارة البوت حول هذه النتيجة' : 'Ask Bot in Chat'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
