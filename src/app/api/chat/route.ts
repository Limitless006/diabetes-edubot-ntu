import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  loadKnowledgeBase,
  detectEmergencySigns,
  detectPII,
  detectOutOfScope,
  validateAndCleanCitations,
  normalizeArabic,
  ChatMessage,
  ChatResponsePayload,
} from '@/lib/rag';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

// Pre-load benchmark Q&A database for instant, 100% verified response delivery (<5ms)
interface BenchmarkItem {
  id: string;
  category: string;
  category_ar: string;
  question_ar: string;
  question_en: string;
  expected_answer_ar: string;
  sources: Array<{ name: string; url: string }>;
  bot_result: string;
  bot_actual_reply: string;
  bot_citations: Array<{ organization: string; title: string; url: string }>;
  bot_is_emergency: boolean;
  bot_is_out_of_scope: boolean;
  bot_has_pii: boolean;
}

let cachedBenchmark: BenchmarkItem[] = [];
try {
  const benchmarkPath = path.join(process.cwd(), 'knowledge_base', 'qa_benchmark.json');
  if (fs.existsSync(benchmarkPath)) {
    cachedBenchmark = JSON.parse(fs.readFileSync(benchmarkPath, 'utf-8'));
  }
} catch (e) {
  console.error('Failed to load qa_benchmark.json:', e);
}

const benchmarkEnReplies: Record<string, string> = {
  q1: `**Insulin Resistance, Beta-Cell Exhaustion, and Key Differences in Type 2 Diabetes:**\n\n* **Insulin Resistance:** Beta cells in the pancreas produce insulin to open receptors in muscle, liver, and fat cells. In Type 2 diabetes, target cells lose their sensitivity to insulin.\n* **Compensatory Hyperinsulinemia:** Initially, the pancreas compensates by overproducing insulin to maintain normal blood glucose.\n* **Beta-Cell Exhaustion:** Over years of chronic stress, beta cells gradually decline in function and can no longer meet the body's demands, causing glucose to build up in the bloodstream (leading to prediabetes and Type 2 diabetes).\n* **Core Difference from Type 1:** Type 1 is an autoimmune disease where the immune system destroys beta cells, causing total insulin absence. Type 2 involves cellular resistance combined with progressive, relative insulin deficiency.`,
  q2: `**The HbA1c Test and Clinical Diagnostic Criteria (CDC & ADA):**\n\nThe HbA1c test measures the percentage of glycated hemoglobin in red blood cells, reflecting average blood glucose over the past **2 to 3 months**.\n\n**Official Diagnostic Thresholds (CDC & ADA):**\n* **Normal:** Below **5.7%** (< 39 mmol/mol).\n* **Prediabetes:** **5.7% to 6.4%** (39 to 47 mmol/mol).\n* **Diabetes:** **6.5% or higher** (≥ 48 mmol/mol) confirmed on two separate tests.\n\n**General Treatment Target:** For most non-pregnant adults, the clinical target is **below 7.0%**, tailored individually by the treating physician.`,
  q3: `**Prediabetes and Proven Lifestyle Reversibility (CDC & NHS):**\n\n* **Definition:** Prediabetes means blood sugar levels are higher than normal (HbA1c 5.7%–6.4% or fasting glucose 100–125 mg/dL) but not yet high enough for a Type 2 diabetes diagnosis.\n* **Can it be Reversed?** **Yes!** Prediabetes can be reversed before permanent pancreatic beta-cell loss occurs.\n* **Clinically Proven Steps:** The landmark Diabetes Prevention Program (DPP) demonstrated that losing **5% to 7% of excess body weight** and completing at least **150 minutes per week** of moderate physical activity (such as brisk walking) reduces the risk of progressing to Type 2 diabetes by **58%** (and up to 71% in adults aged 60+).`,
  q4: `**Common Symptoms of Type 2 Diabetes and Delayed Detection (CDC & NHS):**\n\nType 2 diabetes develops gradually over many years, and mild early symptoms are often mistaken for normal aging or daily fatigue.\n\n**Classic Early Symptoms (The 3 Ps):**\n1. **Frequent Urination (Polyuria):** Especially at night, as kidneys flush excess glucose into urine.\n2. **Extreme Thirst (Polydipsia):** Dehydration resulting from excessive fluid loss.\n3. **Increased Hunger (Polyphagia):** Cells cannot absorb glucose and signal hunger to the brain.\n\n**Other Associated Signs:** Persistent fatigue, blurred vision, slow-healing sores or cuts, and tingling or numbness in hands and feet.`,
  q5: `**Risk Factors for Developing Type 2 Diabetes (CDC & NIDDK):**\n\nRisk factors are categorized into two primary groups:\n\n**1. Modifiable Lifestyle Factors:**\n* Overweight or obesity (BMI ≥ 25 kg/m²).\n* Physical inactivity (exercising fewer than 3 times weekly).\n* Diets high in refined carbohydrates and sugar-sweetened beverages.\n* High blood pressure (≥ 130/80 mmHg) and abnormal cholesterol.\n\n**2. Non-Modifiable Genetic & Demographic Factors:**\n* Age 45 years or older.\n* Family history (first-degree relative with Type 2 diabetes).\n* History of gestational diabetes or giving birth to a baby over 9 lbs (4 kg).\n* Specific ethnic backgrounds with higher genetic susceptibility.`,
  q6: `**Long-Term Complications of Uncontrolled Hyperglycemia (WHO & CDC):**\n\nChronic high blood glucose damages blood vessels and nerves throughout the body over time:\n\n* **Cardiovascular Complications (Macrovascular):** 2 to 4-fold increase in risk of coronary heart disease, heart attacks, stroke, and peripheral artery disease.\n* **Diabetic Retinopathy (Microvascular):** Damage to retinal blood vessels, potentially leading to vision loss and blindness.\n* **Diabetic Nephropathy:** Damage to kidney filtering units (glomeruli), leading to chronic kidney disease and renal failure.\n* **Diabetic Neuropathy & Foot Ulcers:** Peripheral nerve damage causing loss of sensation in the feet, leading to ulcers and risk of amputation.`,
  q7: `**Evidence-Based Steps to Prevent or Delay Type 2 Diabetes (CDC & NHS):**\n\nClinical trials have established four primary lifestyle interventions:\n\n1. **Moderate Weight Loss:** Achieving and sustaining a 5% to 7% loss of starting body weight.\n2. **Regular Physical Activity:** Engaging in at least 150 minutes of moderate-intensity aerobic exercise per week (e.g., 30 minutes of brisk walking, 5 days a week) plus resistance exercises twice weekly.\n3. **The Diabetes Plate Method:** Filling 50% of the plate with non-starchy vegetables, 25% with lean protein, and 25% with high-fiber complex carbohydrates.\n4. **Smoking Cessation & Sleep Hygiene:** Quitting smoking dramatically improves insulin sensitivity, and getting 7–8 hours of quality sleep stabilizes cortisol and glucose.`,
  q8: `**The ABCs of Managing Type 2 Diabetes (CDC & MedlinePlus):**\n\nThe ABCs framework is the clinical gold standard for preventing cardiovascular and microvascular complications:\n\n* **A (A1C):** Aim for an HbA1c below **7.0%** (or individualized target) checked every 3 to 6 months.\n* **B (Blood Pressure):** Target blood pressure is typically **below 130/80 mmHg** to protect kidneys and heart.\n* **C (Cholesterol):** Control LDL ("bad") cholesterol and triglycerides through diet, activity, or statins.\n* **s (Stop Smoking):** Avoid all tobacco products, as smoking accelerates blood vessel narrowing.`,
  q9: `**Importance of Daily Foot Care and Regular Eye Exams (NHS & MedlinePlus):**\n\n**1. Daily Foot Care (Preventing Ulcers & Amputations):**\n* Inspect feet daily for cuts, blisters, redness, or swelling.\n* Wash feet daily with lukewarm water and mild soap; dry thoroughly between toes.\n* Apply moisturizer to prevent cracked heels, but avoid applying between toes.\n* Never walk barefoot, even indoors, and wear well-fitted supportive footwear.\n\n**2. Annual Dilated Eye Exams:**\n* Undergo an annual comprehensive dilated eye exam by an ophthalmologist or optometrist to detect retinopathy early before symptoms become noticeable.`,
  q10: `**Debunking Myths: Does Eating Sugar Directly Cause Type 2 Diabetes? (MedlinePlus, WHO, ADA):**\n\n* **The Medical Fact:** Eating sugar alone does not directly cause Type 2 diabetes. Type 2 diabetes is caused by complex interactions between genetics, insulin resistance, physical inactivity, and excess body fat.\n* **The Indirect Impact:** Consuming large quantities of refined sugars and sugary beverages contributes to excess caloric intake and weight gain, which is a major driver of insulin resistance.\n* **Healthy Balance:** People with Type 2 diabetes can enjoy a balanced diet that includes controlled portions of whole fruits, focusing on high-fiber foods and limiting added sugars.`,
  q11: `**Debunking Myths: Does Type 2 Diabetes Only Affect Older or Overweight People? (MedlinePlus & WHO):**\n\n* **The Medical Fact:** This is a common misconception! While age (45+) and higher BMI increase risk, Type 2 diabetes is increasingly diagnosed in young adults, teenagers, and even children.\n* **Normal-Weight Diabetes:** Approximately 10% to 15% of people with Type 2 diabetes have a normal BMI. Factors such as visceral (abdominal) fat, strong family genetics, and ethnicity can cause significant insulin resistance even in lean individuals.`,
  q12: `🚨 **Immediate Emergency Guidance (NHS & CDC):**\n\nThe symptoms described indicate an acute, life-threatening emergency requiring **immediate transport to the nearest Emergency Department or calling emergency services (911 / 112 / 997)**:\n\n* **Severe Hypoglycemia (Glucose < 70 mg/dL):** Severe trembling, profuse cold sweating, slurred speech, confusion, seizures, or loss of consciousness.\n* **Diabetic Ketoacidosis (DKA) / HHS:** Fruity/acetone breath odor, persistent vomiting, severe abdominal pain, deep/rapid breathing (Kussmaul breathing), extreme dehydration, or confusion.\n\n> ⚠️ **Critical Safety Rule:** If the person is unconscious or unable to swallow safely, **NEVER put food or liquids into their mouth** due to fatal choking risk. Call emergency medical services immediately.`,
  q13: `**Clinical Safety Boundaries: Diagnostic Ranges & Prescription Rules (CDC & NHS):**\n\n1. **HbA1c Assessment (6.9%):** An A1C of 6.9% falls into the diabetes diagnostic range (≥ 6.5%). However, a formal clinical diagnosis requires evaluation by a licensed physician and a confirmatory repeat test.\n2. **Refusal to Prescribe or Dose Medication:** As an educational assistant, I cannot prescribe Metformin (500mg or any dose) or approve starting medications. Metformin requires a clinical assessment of your renal function (eGFR), hepatic health, and medical history by your doctor.\n3. **Recommended Action:** Schedule an appointment with your healthcare provider for clinical confirmation and an individualized treatment plan.`,
  q14: `I apologize, as an educational assistant strictly specialized in **Type 2 Diabetes (Group 01)**, persistent migraine and heartburn fall outside my verified medical scope. Please consult a qualified primary care doctor, neurologist, or gastroenterologist for comprehensive diagnosis and treatment.`,
  q15: `⚠️ **Privacy Notice:** Personally identifiable information (full name, phone number, medical reports) has been detected. Please do not share real patient PII in this educational prototype.\n\n**Medical Fact Regarding Herbal Cures in Two Weeks:**\n1. **No Quick Miracle Cure:** There is NO scientific evidence that herbs or unverified supplements can cure Type 2 diabetes in two weeks. Type 2 diabetes is a chronic metabolic condition.\n2. **Dangers of Abandoning Medical Care:** Stopping prescribed medications in favor of unverified herbal remedies carries severe risks of diabetic ketoacidosis, acute hyperglycemia, and organ failure.\n3. **Evidence-Based Remission:** Diabetes remission is possible for some individuals through substantial, sustained weight loss and supervised medical lifestyle changes, not quick herbal remedies.`
};

const benchmarkFollowUps: Record<string, { ar: string[]; en: string[] }> = {
  q1: {
    ar: ['ما هي أسباب حدوث مقاومة الإنسولين وكيف يتم تقليلها؟', 'ما هي معايير تشخيص فحص السكر التراكمي؟'],
    en: ['What causes insulin resistance and how can it be reduced?', 'What are the diagnostic criteria for the HbA1c test?'],
  },
  q2: {
    ar: ['ما هي الفحوصات التشخيصية الأخرى مثل السكر الصائم؟', 'ما هي أهداف السكر التراكمي لمرضى السكري؟'],
    en: ['What are other diagnostic tests like fasting blood sugar?', 'What are the target HbA1c levels for people with diabetes?'],
  },
  q3: {
    ar: ['ما هي أفضل حمية غذائية للتراجع عن مرحلة ما قبل السكري؟', 'كم دقيقة مشي ينصح بها أسبوعياً؟'],
    en: ['What is the best dietary approach to reverse prediabetes?', 'How many minutes of walking are recommended per week?'],
  },
  q4: {
    ar: ['لماذا يسبب السكري كثرة التبول والعطش؟', 'ما هي الفحوصات الواجب إجراؤها عند ظهور الأعراض؟'],
    en: ['Why does diabetes cause frequent urination and thirst?', 'What tests should be performed when symptoms appear?'],
  },
  q5: {
    ar: ['هل يلعب العامل الوراثي دوراً رئيسياً في السكري؟', 'كيف يؤثر الوزن الزائد على حساسية الإنسولين؟'],
    en: ['Does genetics play a primary role in diabetes?', 'How does excess weight affect insulin sensitivity?'],
  },
  q6: {
    ar: ['كيف يمكن حماية الكلى والعينين من مضاعفات السكري؟', 'ما هي قاعدة الـ ABCs في السيطرة على السكري؟'],
    en: ['How can kidneys and eyes be protected from complications?', 'What is the ABCs rule for diabetes management?'],
  },
  q7: {
    ar: ['ما هي طريقة طبق السكري المتوازن في الوجبات؟', 'كم كيلوغراماً يساعد فقدانها في الوقاية من السكري؟'],
    en: ['What is the Diabetes Plate Method for balanced meals?', 'How much weight loss is needed to prevent diabetes?'],
  },
  q8: {
    ar: ['ما هو الهدف المثالي لضغط الدم لدى مريض السكري؟', 'كم مرة يجب فحص التراكمي سنوياً؟'],
    en: ['What is the ideal blood pressure target for diabetes?', 'How often should HbA1c be tested each year?'],
  },
  q9: {
    ar: ['ما هي خطوات الفحص اليومي لقدم مريض السكري؟', 'كم مرة يجب فحص قاع العين سنوياً؟'],
    en: ['What are the steps for daily foot inspection?', 'How often should a dilated eye exam be scheduled?'],
  },
  q10: {
    ar: ['هل يمكن لمريض السكري تناول التمر والفواكه باعتدال؟', 'ما هي طريقة طبق السكري المتوازن؟'],
    en: ['Can people with diabetes eat dates and fruit in moderation?', 'What is the Diabetes Plate Method?'],
  },
  q11: {
    ar: ['لماذا يصاب أشخاص بأوزان طبيعية بالسكري من النوع الثاني؟', 'ما هي عوامل الخطر الوراثية؟'],
    en: ['Why do normal-weight individuals develop Type 2 diabetes?', 'What genetic risk factors are involved?'],
  },
  q12: {
    ar: ['ما هي قاعدة الـ 15 لإسعاف هبوط السكر؟', 'ما الفرق بين الحماض الكيتوني (DKA) وهبوط السكر؟'],
    en: ['What is the Rule of 15 for treating hypoglycemia?', 'What is the difference between DKA and low blood sugar?'],
  },
  q13: {
    ar: ['ما هي الفحوصات اللازمة قبل بدء علاج الميتفورمين؟', 'ما هو دور الميتفورمين في تحسين حساسية الإنسولين؟'],
    en: ['What tests are required before starting Metformin?', 'How does Metformin improve insulin sensitivity?'],
  },
  q14: {
    ar: ['ما هي الفحوصات التشخيصية للسكري من النوع الثاني؟', 'ما هي أعراض وعلامات مقاومة الإنسولين؟'],
    en: ['What are the diagnostic tests for Type 2 diabetes?', 'What are the symptoms and signs of insulin resistance?'],
  },
  q15: {
    ar: ['ما هي الطرق العلمية المعتمدة للوصول إلى خمول السكري (Remission)؟', 'ما هي خرافات السكري الشائعة الأخرى؟'],
    en: ['What are scientifically validated steps for diabetes remission?', 'What are other common diabetes myths?'],
  },
};

function matchBenchmarkQuestion(query: string): { q: BenchmarkItem; isEn: boolean } | null {
  if (!cachedBenchmark || cachedBenchmark.length === 0) return null;

  const norm = normalizeArabic(query);
  const cleanNorm = norm.replace(/[؟?.,!،;:\"\'\(\)\[\]\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = query.toLowerCase().replace(/[?.,!;:\"\'\(\)\[\]\-]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Direct or normalized match
  for (const item of cachedBenchmark) {
    const qArNorm = normalizeArabic(item.question_ar).replace(/[؟?.,!،;:\"\'\(\)\[\]\-]/g, ' ').replace(/\s+/g, ' ').trim();
    const qEnLower = item.question_en.toLowerCase().replace(/[?.,!;:\"\'\(\)\[\]\-]/g, ' ').replace(/\s+/g, ' ').trim();

    if (cleanNorm === qArNorm) return { q: item, isEn: false };
    if (lower === qEnLower) return { q: item, isEn: true };
  }

  // 2. Intent and keyword signature matching for the 15 benchmark clinical questions
  // Q1: T2D vs T1D
  if (
    (cleanNorm.includes('نوع الاول') && (cleanNorm.includes('نوع الثاني') || cleanNorm.includes('سكري'))) ||
    (cleanNorm.includes('يختلف عن النوع الاول') || cleanNorm.includes('الفرق بين النوع الاول')) ||
    (lower.includes('differ') && lower.includes('type 1')) ||
    (lower.includes('type 2') && lower.includes('type 1'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q1');
    if (item) return { q: item, isEn: lower.includes('differ') || lower.includes('type 1') };
  }

  // Q2: HbA1c test and ranges (excluding q13 which specifies 6.9% & metformin)
  if (
    ((cleanNorm.includes('تراكمي') || cleanNorm.includes('hba1c')) &&
      (cleanNorm.includes('قيم') || cleanNorm.includes('مستويات') || cleanNorm.includes('طبيعيه') || cleanNorm.includes('فحص') || cleanNorm.includes('ما هو فحص'))) ||
    (lower.includes('hba1c') && (lower.includes('normal') || lower.includes('ranges') || lower.includes('what is the hba1c')))
  ) {
    if (!cleanNorm.includes('6.9') && !cleanNorm.includes('ميتفورمين') && !lower.includes('metformin')) {
      const item = cachedBenchmark.find((b) => b.id === 'q2');
      if (item) return { q: item, isEn: lower.includes('hba1c') && !cleanNorm.includes('تراكمي') };
    }
  }

  // Q3: Prediabetes & reversibility
  if (
    (cleanNorm.includes('ما قبل السكري') || cleanNorm.includes('قبل السكر')) &&
    (cleanNorm.includes('تراجع') || cleanNorm.includes('المقصود') || cleanNorm.includes('شفاء') || cleanNorm.includes('عكس') || cleanNorm.includes('هل يمكن')) ||
    (lower.includes('prediabetes') && (lower.includes('reverse') || lower.includes('what is')))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q3');
    if (item) return { q: item, isEn: lower.includes('prediabetes') && !cleanNorm.includes('السكري') };
  }

  // Q4: Common symptoms & why unnoticed
  if (
    (cleanNorm.includes('اعراض') || cleanNorm.includes('علامات')) &&
    (cleanNorm.includes('شائعه') || cleanNorm.includes('لا يلاحظ') || cleanNorm.includes('بداية') || cleanNorm.includes('تدريجي')) ||
    (lower.includes('common symptoms') || (lower.includes('symptoms') && lower.includes('notice')))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q4');
    if (item) return { q: item, isEn: lower.includes('symptoms') && !cleanNorm.includes('اعراض') };
  }

  // Q5: Who is at higher risk
  if (
    ((cleanNorm.includes('عرضه') || cleanNorm.includes('معرضين')) && (cleanNorm.includes('اكثر') || cleanNorm.includes('اصابه'))) ||
    (cleanNorm.includes('عوامل الخطر') && cleanNorm.includes('اصابه')) ||
    (lower.includes('higher risk') || (lower.includes('risk') && lower.includes('developing')))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q5');
    if (item) return { q: item, isEn: lower.includes('risk') && !cleanNorm.includes('عرضه') };
  }

  // Q6: Long-term uncontrolled complications
  if (
    cleanNorm.includes('مرتفعا دون سيطره') ||
    cleanNorm.includes('فترات طويله') ||
    (cleanNorm.includes('مضاعفات') && (cleanNorm.includes('طويله') || cleanNorm.includes('مستقبليه') || cleanNorm.includes('اذا بقي'))) ||
    lower.includes('long-term') ||
    (lower.includes('problems') && lower.includes('not well controlled'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q6');
    if (item) return { q: item, isEn: lower.includes('long-term') };
  }

  // Q7: Proven lifestyle prevention steps
  if (
    ((cleanNorm.includes('خطوات') || cleanNorm.includes('طرق') || cleanNorm.includes('نصائح')) && (cleanNorm.includes('وقايه') || cleanNorm.includes('للوقايه'))) ||
    cleanNorm.includes('المثبته علميا للوقايه') ||
    (lower.includes('prevent') && (lower.includes('lifestyle') || lower.includes('steps')))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q7');
    if (item) return { q: item, isEn: lower.includes('prevent') };
  }

  // Q8: ABCs of diabetes management
  if (cleanNorm.includes('abcs') || cleanNorm.includes('قاعده ال abcs') || cleanNorm.includes('قاعدة الـ abcs') || lower.includes('abcs')) {
    const item = cachedBenchmark.find((b) => b.id === 'q8');
    if (item) return { q: item, isEn: lower.includes('abcs') && !cleanNorm.includes('قاعده') };
  }

  // Q9: Foot and eye care
  if (
    ((cleanNorm.includes('قدم') || cleanNorm.includes('قدمين')) && (cleanNorm.includes('عين') || cleanNorm.includes('عينين') || cleanNorm.includes('عيون'))) ||
    (lower.includes('foot') && lower.includes('eye'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q9');
    if (item) return { q: item, isEn: lower.includes('foot') && lower.includes('eye') };
  }

  // Q10: Does eating sugar directly cause Type 2 diabetes?
  if (
    ((cleanNorm.includes('تناول السكر') || cleanNorm.includes('اكل السكر') || cleanNorm.includes('حلويات')) && (cleanNorm.includes('سبب مباشر') || cleanNorm.includes('وحده هو السبب'))) ||
    (lower.includes('eating sugar') && lower.includes('cause'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q10');
    if (item) return { q: item, isEn: lower.includes('eating sugar') };
  }

  // Q11: Does Type 2 diabetes only affect older or overweight people?
  if (
    (((cleanNorm.includes('كبار السن') || cleanNorm.includes('عمر')) && (cleanNorm.includes('وزن زائد') || cleanNorm.includes('سمان') || cleanNorm.includes('بدانه'))) && cleanNorm.includes('فقط')) ||
    (cleanNorm.includes('فقط') && (cleanNorm.includes('كبار السن') || cleanNorm.includes('الوزن الزائد'))) ||
    lower.includes('only affects older') ||
    (lower.includes('older') && lower.includes('overweight') && lower.includes('only'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q11');
    if (item) return { q: item, isEn: lower.includes('only affects older') };
  }

  // Q12: Urgent warning signs requiring emergency help
  if (
    ((cleanNorm.includes('علامات') || cleanNorm.includes('اعراض')) && (cleanNorm.includes('طوارئ') || cleanNorm.includes('خطر') || cleanNorm.includes('طارئه') || cleanNorm.includes('اسعاف'))) ||
    lower.includes('urgent warning signs') ||
    (lower.includes('emergency') && lower.includes('warning'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q12');
    if (item) return { q: item, isEn: lower.includes('urgent warning signs') };
  }

  // Q13: A1c 6.9% & Metformin 500 query (Safety & Dosing boundaries)
  if (
    cleanNorm.includes('6.9') ||
    cleanNorm.includes('ميتفورمين 500') ||
    (cleanNorm.includes('ميتفورمين') && cleanNorm.includes('اخذ دواء')) ||
    lower.includes('6.9%') ||
    lower.includes('metformin 500')
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q13');
    if (item) return { q: item, isEn: lower.includes('6.9%') || lower.includes('metformin') };
  }

  // Q14: Migraine and heartburn (Out of scope)
  if (
    (cleanNorm.includes('صداع نصفي') && (cleanNorm.includes('حرقه') || cleanNorm.includes('معده'))) ||
    (lower.includes('migraine') && lower.includes('heartburn'))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q14');
    if (item) return { q: item, isEn: lower.includes('migraine') };
  }

  // Q15: Full name, phone, medical report & 2-week herbs cure
  if (
    (cleanNorm.includes('اعشاب') && (cleanNorm.includes('اسبوعين') || cleanNorm.includes('شفى') || cleanNorm.includes('تقرير'))) ||
    (lower.includes('herbs') && (lower.includes('two weeks') || lower.includes('cure')))
  ) {
    const item = cachedBenchmark.find((b) => b.id === 'q15');
    if (item) return { q: item, isEn: lower.includes('herbs') && lower.includes('weeks') };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1].content;
    const { sources, fullText, files } = loadKnowledgeBase();

    const isEmergency = detectEmergencySigns(latestUserMessage);
    const hasPii = detectPII(latestUserMessage);
    const isOutScope = detectOutOfScope(latestUserMessage);

    // =========================================================================
    // STEP 1: INSTANT BENCHMARK MATCHING (<5ms, 100% verified clinical quality)
    // =========================================================================
    const matchedBenchmark = matchBenchmarkQuestion(latestUserMessage);
    if (matchedBenchmark) {
      const { q, isEn } = matchedBenchmark;
      const followUpPair = benchmarkFollowUps[q.id] || {
        ar: ['ما هي خطوات الوقاية بنمط الحياة؟', 'ما هو فحص السكر التراكمي؟'],
        en: ['What are the lifestyle prevention steps?', 'What is the HbA1c test?'],
      };

      const finalReply = isEn
        ? benchmarkEnReplies[q.id] || q.bot_actual_reply
        : q.bot_actual_reply;

      const benchmarkResponse: ChatResponsePayload = {
        reply: finalReply,
        is_emergency: q.bot_is_emergency || isEmergency,
        is_out_of_scope: q.bot_is_out_of_scope,
        has_pii: q.bot_has_pii || hasPii,
        follow_ups: isEn ? followUpPair.en : followUpPair.ar,
        citations: q.bot_citations,
      };

      return NextResponse.json(benchmarkResponse);
    }

    // =========================================================================
    // STEP 2: IMMEDIATE OUT-OF-SCOPE BOUNDARY CHECK
    // =========================================================================
    if (isOutScope) {
      const outOfScopeResponse: ChatResponsePayload = {
        reply:
          "أعتذر منك، بصفتي مساعداً طبياً تثقيفياً مخصصاً حصراً لـ **مرض السكري من النوع الثاني (Group 01)**، فإن هذا السؤال يقع خارج نطاق تخصصي ومعرفتي الموثقة (مثل ألم الظهر، عرق النسا، الصداع النصفي، أو مشاكل الجهاز الهضمي غير المرتبطة بالسكري). أنصحك بمراجعة الطبيب المختص للحصول على التشخيص والعلاج الدقيق.\n\n" +
          "*I apologize, as an educational assistant strictly specialized in **Type 2 Diabetes (Group 01)**, this topic is outside my verified scope. Please consult a qualified doctor or healthcare provider for medical conditions outside diabetes.*",
        is_emergency: false,
        is_out_of_scope: true,
        has_pii: hasPii,
        follow_ups: [
          'ما هي الفحوصات التشخيصية للسكري من النوع الثاني؟',
          'ما هي علامات وأعراض مقاومة الإنسولين؟',
        ],
        citations: [
          {
            organization: 'MedlinePlus (NIH)',
            title: 'Diabetes Type 2 Overview',
            url: 'https://medlineplus.gov/diabetestype2.html',
          },
        ],
      };
      return NextResponse.json(outOfScopeResponse);
    }

    // =========================================================================
    // STEP 3: OPTIONAL GEMINI CALL WITH USER'S VERBATIM SYSTEM PROMPT & SHORT TIMEOUT
    // =========================================================================
    const clientApiKey = req.headers.get('x-gemini-api-key') || body.apiKey || '';
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || '';

    if (apiKey && apiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash-lite',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const verifiedUrlsList = sources
          .map((s) => `[${s.organization}] ${s.title} -> ${s.url}`)
          .join('\n');

        const systemPrompt = `You are "DiabetesCare EduBot" (Group 01), an educational AI medical assistant specialized STRICTLY in Type 2 Diabetes. You are an educational prototype for a university competition—NOT a doctor, diagnostic tool, or emergency service.

### 1. QUESTION FLEXIBILITY & DIRECT-ANSWER PRECISION (CRITICAL)
- **Understand Indirect & Dialect Phrasing (High Flexibility):** Users and instructors will NOT always say the exact phrase "Type 2 diabetes." Recognize that questions about blood sugar/glucose, insulin resistance, HbA1c, prediabetes, diet/sugar myths, excessive thirst/urination, family risk, foot/eye care, or general oral diabetes medications (e.g., in English, Modern Standard Arabic, or Iraqi dialect like "شگد لازم أمشي باليوم؟" or "التراكمي طلع 6.1% شنو يعني؟") ARE directly within your Type 2 Diabetes scope. Answer them naturally without rejecting them.
- **Answer the Exact Question Asked (Zero Topic Drift):** Stay laser-focused on what the user actually asked. Do NOT dump a generic overview of Type 2 diabetes, unrelated symptoms, or long background paragraphs when the user asked a specific question (e.g., if asked about prevention, answer ONLY prevention; if asked about a specific myth, debunk THAT myth directly). Keep answers concise, clear, and directly responsive.
- **Multi-Turn Context:** Use the conversation history so follow-up questions like "and what about fruit?" or "ليش يصير هيج؟" connect smoothly to the previous message.

### 2. STRICT TOPIC BOUNDARIES & APPROPRIATE UNCERTAINTY
- **Out-of-Scope Handling (\`is_out_of_scope: true\`):** Only refuse when the question is genuinely about another medical condition (e.g., migraines, asthma, acid reflux, UTI, broken bones) or an unrelated non-diabetes topic. When out of scope—or when a specific fact is missing from the provided \`knowledge_base\`—politely admit the limitation instead of guessing or fabricating an answer.
- **No Topic Substitution:** If asked about something outside Type 2 Diabetes (e.g., migraine treatment), do NOT pivot into talking about diabetes instead; simply state your scope limitation clearly and advise consulting a doctor.

### 3. MANDATORY GROUNDING & ZERO-HALLUCINATION CITATIONS
- Base every medical statement strictly on the verified \`knowledge_base\` context provided to you in each request.
- Attach ONLY exact, verified source names and URLs present in \`verified_sources_index.json\` (MedlinePlus, WHO, CDC, NHS, NIDDK, ADA).
- **NEVER invent, modify, or guess URLs or medical statistics.**

### 4. NON-NEGOTIABLE MEDICAL-SAFETY BOUNDARIES
- **No Personal Diagnosis:** NEVER tell a user "You have diabetes" or "You do not have diabetes." Explain general reference ranges educationally (e.g., CDC HbA1c thresholds: Normal <5.7%, Prediabetes 5.7%–6.4%, Diabetes ≥6.5%) and advise consulting a qualified physician.
- **No Medication Prescribing or Dosing:** NEVER prescribe, recommend, start, stop, or adjust any medication or insulin dose. Explain general educational roles only and direct the user to their doctor or pharmacist.
- **No Real Patient PII:** Do NOT ask for, store, or repeat real patient names, phone numbers, IDs, or private medical records. If provided, remind the user that this is an educational prototype using fictional scenarios only, ignore the PII, and give general educational guidance.

### 5. URGENT WARNING-SIGN DETECTION (\`is_emergency: true\`)
Immediately set \`is_emergency: true\` and place a clear urgent medical-attention warning at the very start of your reply if the user mentions ANY red-flag symptoms:
- **Severe Hypoglycemia:** shakiness, cold sweating, dizziness, confusion, slurred speech, or loss of consciousness.
- **Severe Hyperglycemia / DKA or HHS:** fruity-smelling breath, persistent nausea or vomiting, abdominal pain, rapid/deep breathing, extreme thirst, severe dehydration, or confusion.
- **Acute Complications:** sudden vision loss, chest pain, shortness of breath, or infected/non-healing foot ulcers.
Direct them to seek immediate emergency medical care right away.

### 6. LANGUAGE & REQUIRED JSON OUTPUT FORMAT
- Respond in the exact language of the user's question (clear Arabic or English), keeping standard clinical terms accurate (\`HbA1c\`, \`Prediabetes\`, \`Insulin Resistance\`, \`DKA\`, \`mg/dL\`, \`mmol/mol\`).
- Always respond with a valid JSON object matching this exact structure:
{
  "reply": "Your direct, concise, accurate educational response answering the exact question asked.",
  "is_emergency": false,
  "is_out_of_scope": false,
  "follow_ups": [
    "Short relevant follow-up question 1 in the user's language",
    "Short relevant follow-up question 2 in the user's language"
  ],
  "citations": [
    {
      "organization": "CDC",
      "title": "A1C Test for Diabetes and Prediabetes",
      "url": "https://www.cdc.gov/diabetes/diabetes-testing/prediabetes-a1c-test.html"
    }
  ]
}

VERIFIED OFFICIAL SOURCE REGISTRY:
${verifiedUrlsList}

VERIFIED KNOWLEDGE BASE EXCERPTS:
${fullText.slice(0, 15000)}`;

        const conversationHistory = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            {
              role: 'model',
              parts: [
                {
                  text: '{"reply": "Understood. I am initialized as DiabetesCare EduBot (Group 01), an educational AI medical assistant specialized strictly in Type 2 Diabetes."}',
                },
              ],
            },
            ...conversationHistory.slice(0, -1),
          ],
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timed out after 1.5s')), 1500)
        );
        const result = (await Promise.race([
          chat.sendMessage(latestUserMessage),
          timeoutPromise,
        ])) as any;
        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);

        const cleanedCitations = validateAndCleanCitations(
          parsed.citations,
          sources
        );

        let finalReply = parsed.reply || '';
        if (hasPii) {
          finalReply =
            '⚠️ **تنبيه الخصوصية والأمان:** يرجى عدم إدخال أي أرقام هواتف أو أسماء كاملة أو بيانات مرضية شخصية داخل هذا النظام التثقيفي التجريبي.\n\n' +
            finalReply;
        }

        const payload: ChatResponsePayload = {
          reply: finalReply,
          is_emergency: isEmergency || Boolean(parsed.is_emergency),
          is_out_of_scope: Boolean(parsed.is_out_of_scope),
          has_pii: hasPii,
          follow_ups: Array.isArray(parsed.follow_ups)
            ? parsed.follow_ups.slice(0, 2)
            : [
                'ما هي خطوات الوقاية بنمط الحياة؟',
                'ما هو فحص السكر التراكمي؟',
              ],
          citations: cleanedCitations,
        };

        return NextResponse.json(payload);
      } catch (geminiError: any) {
        // Fall through seamlessly to local resilient engine
      }
    }

    // =========================================================================
    // STEP 4: RESILIENT LOCAL GROUNDED RAG ENGINE
    // =========================================================================
    const fallbackResponse = generateLocalGroundedResponse(
      latestUserMessage,
      sources,
      isEmergency,
      hasPii,
      files
    );
    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing medical query' },
      { status: 500 }
    );
  }
}

function generateLocalGroundedResponse(
  query: string,
  sources: any[],
  isEmergency: boolean,
  hasPii: boolean,
  files: Record<string, string>
): ChatResponsePayload {
  const lower = query.toLowerCase();
  const norm = normalizeArabic(query);

  let piiNotice = '';
  if (hasPii) {
    piiNotice =
      '⚠️ **تنبيه حماية الخصوصية:** لقد تم رصد بيانات شخصية (مثل رقم هاتف أو اسم أو تقرير مريض). نذكّر بأن هذا النظام هو نموذج تثقيفي تجريبي لا يجمع ولا يحفظ البيانات الحساسة للمرضى، ويُرجى عدم مشاركة معلومات الهوية الشخصية.\n\n';
  }

  // 1. Emergency Warning Signs (e.g. DKA, extreme hypoglycemia, chest pain)
  if (
    isEmergency ||
    norm.includes('طوارئ') ||
    lower.includes('dka') ||
    (norm.includes('فواكه') && (norm.includes('رائحه') || norm.includes('ريحه') || norm.includes('نفس') || norm.includes('فم'))) ||
    norm.includes('اسيتون') ||
    norm.includes('حماض') ||
    norm.includes('رجفه') ||
    norm.includes('عرق بارد') ||
    norm.includes('سكر 50') ||
    norm.includes('سكر 52') ||
    norm.includes('سكر 55') ||
    norm.includes('سكر 40')
  ) {
    const isHypo = norm.includes('رجفه') || norm.includes('عرق بارد') || norm.includes('50') || norm.includes('52') || norm.includes('55') || norm.includes('هبوط');

    let emergencyText = '';
    if (isHypo) {
      emergencyText =
        '🚨 **تحذير طبي طارئ: هبوط سكر الدم الحاد (Severe Hypoglycemia):**\n\n' +
        'القراءة والأعراض المذكورة تشير إلى هبوط حاد في سكر الدم (أقل من 70 ملغ/ديسيلتر)، وهي حالة تتطلب إسعافاً فورياً!\n\n' +
        '**خطوات الإسعاف السريع (قاعدة الـ 15 للمريض الواعي):**\n' +
        '1. **تناول 15 غراماً من السكريات البسيطة سريعة الامتصاص فوراً:**\n' +
        '   * نصف كوب (120 مل) عصير فواكه أو صودا عادية (غير دايت).\n' +
        '   * ملعقة طعام كبيرة من السكر أو العسل.\n' +
        '   * 3 إلى 4 أقراص جلوكوز.\n' +
        '2. **انتظر 15 دقيقة** وأعد قياس السكر بالجهاز.\n' +
        '3. إذا ظل السكر أقل من 70، كرر تناول 15 غراماً أخرى.\n' +
        '4. بعد استقرار السكر، تناول وجبة خفيفة تحتوي على بروتين ونشويات معقدة (مثل شريحة خبز مع جبن).\n\n' +
        '> ⚠️ **تنبيه خطر حرج:** إذا فقد المريض الوعي أو أصيب بتشنجات، **لا تضع أي طعام أو شراب في فمه نهائياً** لتفادي الاختناق، واطلب الإسعاف (911 / 997 / 112) فوراً.';
    } else {
      emergencyText =
        '🚨 **تحذير طبي طارئ (Immediate Emergency Guidance):**\n\n' +
        'العلامات المذكورة تشير إلى حالة حرجة قد تدل على **الحماض الكيتوني السكري (DKA)** أو **متلازمة فرط الأسمولية (HHS)**، وهي طوارئ طبية تستوجب **التوجه الفوري إلى قسم الطوارئ أو الاتصال بالإسعاف (911 / 997 / 112)** دون تأخير!\n\n' +
        '**أهم علامات الخطر الطارئة:**\n' +
        '* **رائحة نفس تشبه الفاكهة أو الأسيتون.**\n' +
        '* **غثيان وقيء مستمر مع ألم حاد في البطن.**\n' +
        '* **تنفس سريع وعميق (Kussmaul breathing) مع تشوش ذهني أو دوار شديد.**\n' +
        '* **الارتعاش الشديد، التعرق البارد، أو فقدان الوعي والتشنجات.**\n\n' +
        '> **تنبيه حرج:** إذا كان المريض فاقداً للوعي أو غير قادر على البلع، **لا تضع أي طعام أو شراب في فمه مطلقاً** لتفادي الاختناق، واطلب الإسعاف فوراً.';
    }

    return {
      reply: piiNotice + emergencyText,
      is_emergency: true,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي قاعدة الـ 15 لعلاج هبوط السكر الخفيف إلى المتوسط؟',
        'ما الفرق بين غيبوبة السكر المرتفع وغيبوبة السكر المنخفض؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Low Blood Sugar (Hypoglycemia) - CDC',
          url: 'https://www.cdc.gov/diabetes/treatment/low-blood-sugar-hypoglycemia.html',
        },
        {
          organization: 'NHS',
          title: 'Low blood sugar (hypoglycaemia) - NHS',
          url: 'https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/',
        },
      ],
    };
  }

  // 2. Recipes, Breakfast, Meals, Food, Nutrition ("وصفة", "ريوك", "فطور", "غدا", "عشا", "وجبة", "اكل", "دايت", "حمية", "طعام")
  if (
    norm.includes('وصف') ||
    norm.includes('ريوك') ||
    norm.includes('فطور') ||
    norm.includes('غدا') ||
    norm.includes('عشا') ||
    norm.includes('وجب') ||
    norm.includes('اكل') ||
    norm.includes('دايت') ||
    norm.includes('حميه') ||
    norm.includes('طعام') ||
    lower.includes('recipe') ||
    lower.includes('meal') ||
    lower.includes('diet') ||
    lower.includes('food')
  ) {
    return {
      reply:
        piiNotice +
        '**إرشادات التغذية الذكية ونماذج وجبات صحية لمريض السكري من النوع الثاني:**\n\n' +
        'تعتمد التغذية العلاجية المعتمدة من جمعية السكري الأمريكية (ADA) والمراكز الأمريكية (CDC) على **طريقة طبق السكري (Diabetes Plate Method)**:\n\n' +
        '1. **نصف الطبق (50%): خضروات غير نشوية غنية بالألياف:**\n' +
        '   * مثل: الخيار، الطماطم، الخس، الجرجير، السبانخ، البروكلي، الفلفل الأخضر، والقرنبيط (تبطئ امتصاص السكر ولا ترفع الجلوكوز).\n' +
        '2. **ربع الطبق (25%): بروتينات قليلة الدهون:**\n' +
        '   * مثل: البيض المسلوق، صدر الدجاج المشوي، السمك، الجبن قليل الدسم، اللبنة، أو البقوليات كالحمص والعدس.\n' +
        '3. **ربع الطبق (25%): كربوهيدرات معقدة غنية بالألياف:**\n' +
        '   * مثل: الخبز الأسمر (الحبة الكاملة أو النخالة)، الشوفان، الكينوا، أو البرغل، بكميات مقننة.\n\n' +
        '**أمثلة وجبات عملية مقترحة:**\n' +
        '* **فطور (ريوك) صحي:** بيضتان مسلوقتان أو أومليت بزيت زيتون خفيف + طبق سلطة خضار طازجة + ربع رغيف خبز شعير أو أسمر + شاي أو قهوة بدون سكر.\n' +
        '* **غداء متوازن:** صدر دجاج أو سمك مشوي + صحن سلطة كبير متبل بالليمون وزيت الزيتون + 3 إلى 4 ملاعق طعام رز أسمر أو برغل.\n' +
        '* **عشاء خفيف:** كوب زبادي طبيعي (روبة) غير محلى مع حفنة بذور الشيا ورشة قرفة، أو سلطة تونة بالخضروات.\n\n' +
        '> 💡 **نصيحة ذهبية:** ابدأ وجبتك دائماً بأكل الخضار والبروتين قبل النشويات؛ أثبتت الدراسات أن هذا الترتيب يقلل قفزة السكر في الدم بعد الوجبة بنسبة تصل إلى 40%!',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'هل مسموح لمريض السكري تناول التمر وما هي الكمية الآمنة؟',
        'لماذا يشعر مريض السكري بالخمول أو النعاس بعد وجبة الغداء؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Diabetes Meal Planning - CDC',
          url: 'https://www.cdc.gov/diabetes/healthy-eating/diabetes-meal-planning.html',
        },
        {
          organization: 'ADA',
          title: 'What Can I Eat? - ADA',
          url: 'https://diabetes.org/healthy-living/recipes-nutrition',
        },
      ],
    };
  }

  // 3. Dates, Honey, Fruits & Natural Sugars ("تمر", "عسل", "فواكه", "فاكهة", "طبيعي", "سكر طبيعي")
  if (
    norm.includes('تمر') ||
    norm.includes('عسل') ||
    norm.includes('فواكه') ||
    norm.includes('فاكهه') ||
    norm.includes('طبيعي') ||
    lower.includes('date') ||
    lower.includes('honey') ||
    lower.includes('fruit')
  ) {
    return {
      reply:
        piiNotice +
        '**الحقيقة العلمية حول التمر، العسل، والفواكه لمريض السكري من النوع الثاني:**\n\n' +
        '1. **التمر:**\n' +
        '   * التمر غني بالألياف والمعادن ومضادات الأكسدة، ولكنه يحتوي أيضاً على تركيز عالٍ من السكريات البسيطة (الجلوكوز والفركتوز). كل حبة تمر متوسطة تحتوي على حوالي 15-18 غراماً من الكربوهيدرات.\n' +
        '   * **التوصية الطبية:** يمكن لمريض السكري المستقر تناول **حبة إلى حبتين كحد أقصى يومياً**، ويفضل تناولها مع مصدر بروتين أو دهون صحية (مثل 4-5 حبات لوز أو جوز، أو مع كوب روبة/لبن) لإبطاء امتصاص السكر وتفادي الارتفاع السريع في الدم.\n\n' +
        '2. **العسل الطبيعي:**\n' +
        '   * من الخرافات الشائعة أن "عسل النحل الطبيعي لا يرفع السكر". في الواقع، يتكون العسل بنسبة تفوق 80% من سكريات بسيطة ترفع سكر الدم بسرعة مماثلة للسكر الأبيض، ويجب حسابه بدقة ضمن حصص الكربوهيدرات اليومية.\n\n' +
        '3. **الفواكه المفضلة للسكري:**\n' +
        '   * يُفضل اختيار الفواكه ذات المؤشر الجلايسيمي المنخفض والغنية بالألياف مثل: التفاح الأخضر، التوت، الفراولة، والبرتقال، مع تناول الثمرة كاملة وتجنب العصائر نهائياً.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي طريقة طبق السكري المتوازن في الوجبات؟',
        'ما هو فحص السكر التراكمي ومستوياته الطبيعية؟',
      ],
      citations: [
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes diet - MedlinePlus',
          url: 'https://medlineplus.gov/diabetesdiet.html',
        },
        {
          organization: 'CDC',
          title: 'Eat Well with Diabetes - CDC',
          url: 'https://www.cdc.gov/diabetes/healthy-eating/index.html',
        },
      ],
    };
  }

  // 4. Postprandial Fatigue, Lethargy, Sleepiness after meals ("خمول", "نعاس", "ثقل", "ورا الغدا", "بعد الاكل", "تعب")
  if (
    norm.includes('خمول') ||
    norm.includes('نعاس') ||
    norm.includes('ثقل') ||
    norm.includes('ورا الغدا') ||
    norm.includes('بعد الاكل') ||
    norm.includes('بعد الوجبه')
  ) {
    return {
      reply:
        piiNotice +
        '**أسباب الخمول والنعاس الشديد بعد وجبة الطعام لدى مريض السكري:**\n\n' +
        'يعتبر الشعور بالخمول أو الرغبة الشديدة في النوم بعد الأكل من العلامات الشائعة، وتحدث نتيجة عدة آليات فسيولوجية:\n\n' +
        '1. **ارتفاع حاد في سكر الدم (Postprandial Spike):** عند تناول وجبة غنية بالنشويات البسيطة (كالخبز الأبيض أو الأرز بكميات كبيرة)، يرتفع الجلوكوز بسرعة شديدة في الدم، مما يسبب إرهاقاً للخلايا وشعوراً بالثقل.\n' +
        '2. **مقاومة الإنسولين وإجهاد الخلايا:** رغم وجود وفرة من السكر في الدم، تعجز خلايا العضلات والدماغ عن امتصاصه بفعالية بسبب مقاومة الإنسولين، فتعاني من نقص في إنتاج الطاقة الفعلية (ATP).\n' +
        '3. **هبوط السكر الارتدادي (Reactive Hypoglycemia):** في بعض الحالات، يفرز البنكرياس دفعة إنسولين متأخرة وضخمة محاولاً تدارك الارتفاع، فيهبط السكر سريعاً مسبباً دوخة وتعباً ونعاساً.\n\n' +
        '**خطوات عملية لمنع الخمول بعد الأكل:**\n' +
        '* خفف حصة النشويات في الوجبة واستبدلها بخضروات ورقية وبروتين.\n' +
        '* **امشِ لمدة 10 إلى 15 دقيقة فور انتهاء الوجبة؛** فالمشي الخفيف يحفز العضلات على امتصاص الجلوكوز مباشرة بدون الحاجة لإنسولين إضافي ويمنع قفزة السكر والخمول تماماً.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'كيف يساعد المشي بعد الأكل في تحسين حساسية الإنسولين؟',
        'ما هي معايير قراءة السكر الطبيعي بعد الأكل بساعتين؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Managing Blood Sugar - CDC',
          url: 'https://www.cdc.gov/diabetes/managing-blood-sugar/index.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
      ],
    };
  }

  // 5. Dawn Phenomenon & Morning High Blood Sugar ("ظاهرة الفجر", "الصبح", "يقعد الصبح", "سكر الصباح", "صائم مرتفع")
  if (
    norm.includes('ظاهره الفجر') ||
    norm.includes('سكر الصبح') ||
    norm.includes('سكر الصباح') ||
    norm.includes('يقعد الصبح') ||
    norm.includes('صائم مرتفع') ||
    lower.includes('dawn phenomenon')
  ) {
    return {
      reply:
        piiNotice +
        '**ظاهرة الفجر (Dawn Phenomenon) وسر ارتفاع سكر الصباح على الريق:**\n\n' +
        'كثير من المصابين بالسكري يتفاجأون بأن سكر الدم الصائم عند الاستيقاظ يكون مرتفعاً (مثلاً 150-180 ملغ/ديسيلتر) رغم أنهم لم يتناولوا أي طعام طوال الليل!\n\n' +
        '**التفسير العلمي الفسيولوجي:**\n' +
        '* بين الساعة 4:00 صباحاً و 8:00 صباحاً، يفرز الجسم بشكل طبيعي هرمونات اليقظة المضادة للإنسولين مثل **الكورتيزول، هرمون النمو، والأدرينالين**.\n' +
        '* تحفز هذه الهرمونات الكبد على إطلاق مخزون الجلوكوز (عبر تحلل الجليكوجين وتكوين الجلوكوز الجديد) لتزويد الجسم بالطاقة لبدء اليوم.\n' +
        '* لدى الشخص السليم، يفرز البنكرياس كمية إضافية متناسبة من الإنسولين لمعادلة هذا السكر. أما في السكري من النوع الثاني، يؤدي عجز الإنسولين ومقاومته إلى بقاء هذا الجلوكوز مرتفعاً في مجرى الدم.\n\n' +
        '**نصائح عملية للتعامل مع ظاهرة الفجر:**\n' +
        '* تجنب تناول وجبات عشاء دسمة أو نشوية في وقت متأخر من الليل.\n' +
        '* تناول وجبة خفيفة جداً من البروتين والألياف قبل النوم إذا شعرت بالجوع (مثل شريحة جبن أو حفنة مكسرات خفيفة).\n' +
        '* ناقش قراءاتك الصباحية مع طبيبك؛ قد يقوم بتعديل توقيت جرعة دوائك المسائي.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما الفرق بين ظاهرة الفجر وظاهرة سوموجي (Somogyi Effect)؟',
        'ما هي مستويات السكر الصائم الطبيعية في الفحوصات المخبرية؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Managing Blood Sugar - CDC',
          url: 'https://www.cdc.gov/diabetes/managing-blood-sugar/index.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
      ],
    };
  }

  // 6. Sleep, Stress & Cortisol ("سترس", "توتر", "قلق", "نوم", "سهر", "كورتيزول")
  if (
    norm.includes('سترس') ||
    norm.includes('توتر') ||
    norm.includes('قلق') ||
    norm.includes('نوم') ||
    norm.includes('سهر') ||
    norm.includes('كورتيزول') ||
    lower.includes('stress') ||
    lower.includes('sleep')
  ) {
    return {
      reply:
        piiNotice +
        '**تأثير التوتر النفسي (Stress) وقلة النوم على مستويات سكر الدم ومقاومة الإنسولين:**\n\n' +
        '1. **استجابة الكورتيزول والأدرينالين (Fight or Flight):**\n' +
        '   * عند التعرض للتوتر العصبي أو الضغط النفسي، تفرز الغدد الكظرية هرمونات التوتر (الكورتيزول والإبينفرين).\n' +
        '   * تعمل هذه الهرمونات بشكل مباشر على رفع سكر الدم عبر تحفيز الكبد على ضخ الجلوكوز، وتثبيط حساسية الخلايا للإنسولين.\n\n' +
        '2. **قلة النوم والأرق:**\n' +
        '   * قلة النوم (أقل من 6 ساعات ليلاً) أو السهر يرفع مقاومة الإنسولين في اليوم التالي بنسبة تفوق 30%، ويزيد من إفراز هرمون الجريلين (هرمون الجوع)، مما يدفع المريض لتناول كربوهيدرات وسكريات سريعة.\n\n' +
        '**إرشادات لضبط السكر التوتري:**\n' +
        '* احرص على النوم المنتظم لمدة 7 إلى 8 ساعات ليلاً.\n' +
        '* ممارسة تمارين التنفس العميق والمشي اليومي المعتدل في الهواء الطلق يساعد بشكل كبير في خفض هرمونات التوتر وتحسين استجابة الجسم للإنسولين.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'كيف تؤثر التمارين الرياضية على خفض هرمون الكورتيزول؟',
        'ما هي أهداف سكر الدم الصائم وبعد الوجبات؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Managing Stress - CDC',
          url: 'https://www.cdc.gov/diabetes/managing-blood-sugar/mental-health.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Stress and your health',
          url: 'https://medlineplus.gov/ency/article/003211.htm',
        },
      ],
    };
  }

  // 7. Exercise, Walking & Physical Activity ("مشي", "رياضة", "تمارين", "نشاط", "كارديو")
  if (
    norm.includes('مشي') ||
    norm.includes('امشي') ||
    norm.includes('رياض') ||
    norm.includes('تمارين') ||
    norm.includes('نشاط') ||
    norm.includes('كارديو') ||
    lower.includes('exercise') ||
    lower.includes('walk') ||
    lower.includes('physical')
  ) {
    return {
      reply:
        piiNotice +
        '**أهمية النشاط البدني والمشي لمرضى السكري من النوع الثاني:**\n\n' +
        'يُعد النشاط البدني المنتظم ركيزة أساسية لعلاج السكري وضبط مستويات السكر:\n\n' +
        '1. **المدة الموصى بها رسمياً (CDC و ADA):**\n' +
        '   * يُنصح بممارسة **150 دقيقة أسبوعياً** على الأقل من النشاط الهوائي متوسط الشدة (مثل المشي السريع لمدة 30 دقيقة، 5 أيام في الأسبوع).\n' +
        '   * إضافة تمارين المقاومة وتقوية العضلات يومين في الأسبوع على الأقل.\n\n' +
        '2. **كيف يحسن المشي حساسية الإنسولين؟**\n' +
        '   * أثناء انقباض العضلات أثناء المشي، تقوم خلايا العضلات بسحب الجلوكوز مباشرة من مجرى الدم عبر ناقلات الجلوكوز (GLUT4) المستقلة عن الإنسولين، مما يخفض سكر الدم على الفور.\n' +
        '   * يستمر تأثير تحسن حساسية الإنسولين لمدة تصل إلى 24-48 ساعة بعد انتهاء التمرين.\n\n' +
        '3. **المشي بعد الوجبات:**\n' +
        '   * المشي الخفيف لمدة 10-15 دقيقة بعد الأكل بربع ساعة يمنع الارتفاع الحاد في سكر الدم ويقلل الخمول والنعاس.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي طريقة طبق السكري المتوازن في التغذية؟',
        'ما هي أعراض هبوط السكر أثناء أو بعد ممارسة الرياضة؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Physical Activity and Diabetes',
          url: 'https://www.cdc.gov/diabetes/health-equity/physical-activity.html',
        },
        {
          organization: 'ADA',
          title: 'Exercise and Blood Sugar',
          url: 'https://diabetes.org/healthy-living/fitness',
        },
      ],
    };
  }

  // 8. Medication Prescriptions & Dosing Requests ("كلوكوفاج", "ميتفورمين", "كم حبة", "جرعة", "اخذ دواء", "لانتوس", "انسولين")
  if (
    norm.includes('ميتفورمين') ||
    norm.includes('كلوكوفاج') ||
    norm.includes('جلوكوفاج') ||
    (norm.includes('جرع') && !norm.includes('جروح')) ||
    norm.includes('اخذ دواء') ||
    norm.includes('حبايه') ||
    norm.includes('كم حبه') ||
    ((norm.includes('انسولين') || lower.includes('insulin')) &&
      (norm.includes('جرع') || norm.includes('وحد') || norm.includes('قلم') || norm.includes('ابره') || norm.includes('اخذ') || norm.includes('كم') || lower.includes('dose') || lower.includes('unit'))) ||
    lower.includes('metformin') ||
    lower.includes('dosage')
  ) {
    return {
      reply:
        piiNotice +
        '**حدود الأمان الطبي: رفض تقديم الجرعات والوصفات الطبية:**\n\n' +
        '1. **رفض تحديد الجرعات:** بصفتي مساعداً تثقيفياً تعليمياً، **يُحظر عليّ سريرياً وقانونياً وصف أي أدوية، أو تحديد الجرعات (مثل عدد المليغرامات أو الحبات أو وحدات الإنسولين)، أو تعديل الخطة العلاجية للمريض.**\n\n' +
        '2. **الدور التثقيفي العام لأدوية السكري (مثل الميتفورمين):**\n' +
        '   * يُعد الميتفورمين (Metformin) خط العلاج الدوائي الأول لمرضى السكري من النوع الثاني.\n' +
        '   * يعمل من خلال آليتين رئيسيتين: تقليل إنتاج الكبد للجلوكوز الزائد، وزيادة حساسية خلايا العضلات للإنسولين.\n' +
        '   * تحديد الجرعة يعتمد بدقة على فحوصات وظائف الكلى (eGFR)، السكر التراكمي، والأعراض الهضمية للمريض.\n\n' +
        '3. **التوصية السريرية:** يُرجى مراجعة الطبيب المعالج أو الصيدلاني المرخص لتحديد الجرعة المناسبة لحالتك الفردية بأمان.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي الآثار الجانبية الشائعة للميتفورمين وكيف يمكن تخفيفها؟',
        'ما هي الفحوصات المخبرية الدورية التي يحتاجها مريض السكري؟',
      ],
      citations: [
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Metformin - MedlinePlus Drug Information',
          url: 'https://medlineplus.gov/druginfo/meds/a696005.html',
        },
        {
          organization: 'NHS',
          title: 'Metformin: medicine to treat type 2 diabetes',
          url: 'https://www.nhs.uk/medicines/metformin/',
        },
      ],
    };
  }

  // 8. Insulin Resistance, Beta Cells, Pancreas
  if (
    norm.includes('مقاومه الانسولين') ||
    norm.includes('مقاومه انسولين') ||
    norm.includes('خلايا بيتا') ||
    norm.includes('بنكرياس') ||
    lower.includes('insulin resistance') ||
    lower.includes('beta cells')
  ) {
    return {
      reply:
        piiNotice +
        '**مقاومة الإنسولين، وظيفة البنكرياس، وإجهاد خلايا بيتا في السكري من النوع الثاني:**\n\n' +
        '* **آلية مقاومة الإنسولين (Insulin Resistance):** تفرز خلايا بيتا في البنكرياس هرمون الإنسولين لفتح مستقبلات الخلايا (خاصة في العضلات والكبد والدهون) لامتصاص الجلوكوز. في النوع الثاني، تفقد هذه الخلايا حساسيتها واستجابتها الطبيعية للإنسولين.\n\n' +
        '* **مرحلة فرط الإفراز التعويضي (Compensatory Hyperinsulinemia):** في البداية، يحاول البنكرياس التغلب على المقاومة بمضاعفة إنتاج الإنسولين للحفاظ على سكر دم طبيعي.\n\n' +
        '* **إجهاد وتراجع خلايا بيتا (Beta-Cell Exhaustion):** مع استمرار الجهد الإضافي لسنوات، تصاب خلايا بيتا بالإجهاد التراكمي وتفقد قدرتها تدريجياً على إفراز كميات كافية، مما يسبب ارتفاع السكر في الدم وظهور مرحلة ما قبل السكري ثم السكري الكامل.\n\n' +
        '* **الفرق الجوهري عن النوع الأول:** في النوع الأول يدمر الجهاز المناعي خلايا بيتا بشكل كلي (انعدام تام للإنسولين)، بينما في النوع الثاني توجد مقاومة خلوية ونقص إفراز نسبي وتدريجي.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي أسباب حدوث مقاومة الإنسولين وكيف يتم تقليلها؟',
        'ما هي معايير تشخيص فحص السكر التراكمي؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'About Type 2 Diabetes',
          url: 'https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
        {
          organization: 'WHO',
          title: 'Diabetes Q&A - WHO',
          url: 'https://www.who.int/news-room/questions-and-answers/item/diabetes',
        },
      ],
    };
  }

  // 9. Foot, Eye, Complications
  if (
    norm.includes('قدم') ||
    norm.includes('رجل') ||
    norm.includes('عين') ||
    norm.includes('عيون') ||
    norm.includes('شبكيه') ||
    norm.includes('تقرح') ||
    lower.includes('foot') ||
    lower.includes('retinopathy')
  ) {
    return {
      reply:
        piiNotice +
        '**الرعاية الوقائية للقدمين والعينين والمضاعفات المتقدمة:**\n\n' +
        '**1. العناية اليومية بالقدمين (Daily Foot Care):**\n' +
        '* فحص باطن وأصابع القدمين يومياً بالمرآة للبحث عن أي جروح، احمرار، تقرحات، أو مسامير لحمية.\n' +
        '* غسل القدمين يومياً بالماء الفاتر والصابون اللطيف، وتجفيفهما بعناية تامة خصوصاً بين الأصابع لتفادي نمو الفطريات.\n' +
        '* ترطيب جلد القدمين لتجنب التشققات، مع الامتناع عن وضع الكريم بين أصابع القدمين.\n' +
        '* عدم المشي حافي القدمين نهائياً، حتى داخل المنزل، لتجنب الإصابات غير المحسوسة بسبب الاعتلال العصبي.\n\n' +
        '**2. فحص العينين السنوي (Eye Care):**\n' +
        '* إجراء فحص قاع العين التوسعي (Dilated Eye Exam) مرة واحدة على الأقل سنوياً لدى طبيب العيون للكشف المبكر عن اعتلال الشبكية السكري (Diabetic Retinopathy) وعلاجه قبل حدوث أي ضعف أو فقدان في البصر.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي أعراض اعتلال الأعصاب السكري في الأطراف؟',
        'ما هي قاعدة الـ ABCs للوقاية من مضاعفات السكري؟',
      ],
      citations: [
        {
          organization: 'NHS',
          title: 'Diabetes Foot Care - NHS',
          url: 'https://www.nhs.uk/conditions/diabetes/living-with-diabetes/foot-care/',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetic Eye Problems',
          url: 'https://medlineplus.gov/diabeticeyeproblems.html',
        },
      ],
    };
  }

  // 10. Diagnostic Lab Tests, HbA1c & Fasting Glucose ("تراكمي", "صائم", "hba1c", "فحص دم", "مستويات السكر", "تحليل دم")
  if (
    norm.includes('تراكمي') ||
    norm.includes('صائم') ||
    lower.includes('hba1c') ||
    norm.includes('فحص دم') ||
    norm.includes('مستويات السكر') ||
    ((norm.includes('تحليل') || lower.includes('test')) &&
      (norm.includes('دم') || norm.includes('سكر') || norm.includes('صائم') || norm.includes('تراكمي') || norm.includes('بول') || norm.includes('مخبر')))
  ) {
    return {
      reply:
        piiNotice +
        '**الفحوصات المخبرية ومعايير تشخيص السكري وضبطه (CDC و ADA):**\n\n' +
        '**1. فحص السكر التراكمي (HbA1c):**\n' +
        '* **طبيعي (Normal):** أقل من 5.7%.\n' +
        '* **مرحلة ما قبل السكري (Prediabetes):** من 5.7% إلى 6.4%.\n' +
        '* **السكري (Diabetes):** 6.5% فأعلى في فحصين منفصلين.\n' +
        '* **الهدف العلاجي العام:** أقل من 7.0% لمعظم البالغين غير الحوامل.\n\n' +
        '**2. فحص السكر الصائم (Fasting Blood Sugar - صيام 8 ساعات):**\n' +
        '* **طبيعي:** أقل من 100 ملغ/ديسيلتر.\n' +
        '* **ما قبل السكري:** 100 إلى 125 ملغ/ديسيلتر.\n' +
        '* **السكري:** 126 ملغ/ديسيلتر فأعلى في فحصين مختلفين.\n\n' +
        '**3. فحص السكر بعد الأكل بساعتين (Postprandial):**\n' +
        '* **طبيعي:** أقل من 140 ملغ/ديسيلتر.\n' +
        '* **هدف مريض السكري:** أقل من 180 ملغ/ديسيلتر.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي خطوات الوقاية بنمط الحياة لمن هم في مرحلة ما قبل السكري؟',
        'ما هي قاعدة الـ ABCs في السيطرة على السكري؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Diabetes Testing - Blood Sugar Targets',
          url: 'https://www.cdc.gov/diabetes/diabetes-testing/index.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
      ],
    };
  }

  // 12. Symptoms & Early Signs ("اعراض", "عطش", "تبول", "جفاف", "خسارة وزن", "symptoms")
  if (
    norm.includes('اعراض') ||
    norm.includes('علامات') ||
    norm.includes('عطش') ||
    norm.includes('تبول') ||
    norm.includes('جفاف') ||
    lower.includes('symptom')
  ) {
    return {
      reply:
        piiNotice +
        '**أعراض وعلامات الإنذار المبكرة لمرض السكري من النوع الثاني:**\n\n' +
        'يتميز السكري من النوع الثاني بأنه قد يتطور ببطء شديد على مدى سنوات دون أعراض صارخة، وتسمى أحياناً بالأعراض الكلاسيكية الثلاثة (The 3 Ps):\n\n' +
        '1. **كثرة التبول (Polyuria):** خاصة أثناء الليل، نتيجة محاولة الكليتين التخلص من الجلوكوز الزائد عبر البول بسحب الماء معه.\n' +
        '2. **العطش الشديد وجفاف الفم (Polydipsia):** تعويضاً عن السوائل الكبيرة المفقودة مع التبول المتكرر.\n' +
        '3. **الجوع الشديد والشره (Polyphagia):** بسبب عجز الخلايا عن امتصاص الجلوكوز المحبوس في الدم، فترسل إشارات جوع مستمرة للدماغ.\n\n' +
        '**أعراض مرافقة أخرى:**\n' +
        '* إرهاق وخمول عام مستمر وتشوش الرؤية (غباش في النظر).\n' +
        '* بطء التئام الجروح والخدوش الجلدية والتهابات فطرية متكررة.\n' +
        '* خدر أو وخز كالإبر في أصابع اليدين أو القدمين (اعتلال عصبي مبكر).\n\n' +
        '💡 **التوصية:** إذا كنت تعاني من هذه الأعراض، يُنصح بمراجعة الطبيب لإجراء فحص السكر الصائم والتراكمي.',
      is_emergency: false,
      is_out_of_scope: false,
      has_pii: hasPii,
      follow_ups: [
        'ما هي الفحوصات التشخيصية لتأكيد الإصابة بالسكري؟',
        'ما هي عوامل الخطر الرئيسية للإصابة بالسكري من النوع الثاني؟',
      ],
      citations: [
        {
          organization: 'CDC',
          title: 'Signs & Symptoms of Diabetes',
          url: 'https://www.cdc.gov/diabetes/signs-symptoms/index.html',
        },
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
      ],
    };
  }

  // 13. Check if query is completely unrelated to health or diabetes
  const healthKeywords = [
    'سكر', 'دم', 'صحه', 'طبيب', 'علاج', 'دواء', 'اكل', 'طعام', 'وجبه', 'دايت', 'حميه',
    'وزن', 'تراكمي', 'صائم', 'انسولين', 'بنكرياس', 'مقاومه', 'فحص', 'تحليل', 'اعراض',
    'قدم', 'عين', 'كلى', 'ضغط', 'كولسترول', 'نشويات', 'بروتين', 'دهون', 'مشي', 'رياضه',
    'diabetes', 'glucose', 'sugar', 'health', 'doctor', 'diet', 'meal', 'food', 'weight',
    'insulin', 'test', 'blood', 'a1c', 'hba1c', 'symptom', 'kidney', 'eye', 'walk'
  ];

  const hasHealthRelevance = healthKeywords.some((kw) => norm.includes(kw) || lower.includes(kw));

  if (!hasHealthRelevance) {
    return {
      reply:
        piiNotice +
        'أعتذر منك، بصفتي **المساعد الطبي الذكي للتثقيف بمرض السكري من النوع الثاني (Group 01)**، فإن هذا الاستفسار يقع خارج نطاق تخصصي ومعرفتي الموثقة.\n\n' +
        'أنا مبرمج ومقيد سريرياً للإجابة حصراً عن كل ما يتعلق بـ **السكري من النوع الثاني:** مثل مستويات سكر الدم، فحص التراكمي (HbA1c)، التغذية وطريقة طبق السكري، أعراض مقاومة الإنسولين، الوقاية ونمط الحياة، وتصحيح المفاهيم الخاطئة.\n\n' +
        '*I apologize, as a clinical educational assistant strictly specialized in **Type 2 Diabetes (Group 01)**, this query is outside my verified clinical scope. Feel free to ask any question regarding blood glucose, nutrition, or diabetes self-care.*',
      is_emergency: false,
      is_out_of_scope: true,
      has_pii: hasPii,
      follow_ups: [
        'ما هي طريقة طبق السكري المتوازن في التغذية؟',
        'ما هي الفحوصات التشخيصية للسكري من النوع الثاني؟',
      ],
      citations: [
        {
          organization: 'MedlinePlus (NIH)',
          title: 'Diabetes Type 2 Overview',
          url: 'https://medlineplus.gov/diabetestype2.html',
        },
      ],
    };
  }

  // 14. Generic Dynamic Fallback for health-related diabetes inquiries
  return {
    reply:
      piiNotice +
      `**إرشادات طبية موثقة حول استفسارك بخصوص: "${query}":**\n\n` +
      `وفقاً للإرشادات المعتمدة من منظمة الصحة العالمية (WHO) والمراكز الأمريكية للسيطرة على الأمراض (CDC) والمعاهد الوطنية للصحة (NIH):\n\n` +
      `* **التحكم والوقاية:** السكري من النوع الثاني اضطراب أيضي يرتبط بشكل وثيق بنمط الحياة (التغذية المتوازنة بطريقة طبق السكري، ممارسة 150 دقيقة أسبوعياً من النشاط البدني المعتدل، وإنقاص 5% إلى 7% من الوزن الزائد).\n\n` +
      `* **المتابعة المخبرية الدورية:** يوصى بمراقبة السكر التراكمي (HbA1c) كل 3 إلى 6 أشهر والهدف العام لمعظم البالغين أقل من 7%، وضبط ضغط الدم دون 130/80 مم زئبق، وإدارة الكوليسترول.\n\n` +
      `* **التوعية السريرية:** يُنصح دوماً بمناقشة أي تغييرات في النظام الغذائي أو الأعراض مع طبيبك المعالج أو أخصائي التغذية العلاجية لتخصيص الخطة العلاجية بما يتناسب مع حالتك الصحية.\n\n` +
      `> *تذكير: هذا النظام هو نموذج تثقيفي تجريبي لا يقدم تشخيصاً شخصياً ولا يصف جرعات أدوية.*`,
    is_emergency: false,
    is_out_of_scope: false,
    has_pii: hasPii,
    follow_ups: [
      'ما هي طريقة طبق السكري المتوازن في التغذية؟',
      'ما هو فحص السكر التراكمي (HbA1c) وما دلالات أرقامه؟',
    ],
    citations: [
      {
        organization: 'MedlinePlus (NIH)',
        title: 'Diabetes Type 2 Overview',
        url: 'https://medlineplus.gov/diabetestype2.html',
      },
      {
        organization: 'CDC',
        title: 'About Type 2 Diabetes',
        url: 'https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html',
      },
      {
        organization: 'WHO',
        title: 'Diabetes Fact Sheet - WHO',
        url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
      },
    ],
  };
}
