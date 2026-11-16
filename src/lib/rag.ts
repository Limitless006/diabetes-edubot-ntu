import fs from 'fs';
import path from 'path';

export interface VerifiedSource {
  id: string;
  organization: string;
  title: string;
  url: string;
  topic_category: string;
  key_verified_facts: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponsePayload {
  reply: string;
  is_emergency: boolean;
  is_out_of_scope: boolean;
  has_pii?: boolean;
  follow_ups: string[];
  citations: Array<{
    organization: string;
    title: string;
    url: string;
  }>;
}

let cachedSources: VerifiedSource[] | null = null;
let cachedKnowledgeText: string | null = null;
let cachedMarkdownMap: Record<string, string> | null = null;

export function loadKnowledgeBase() {
  if (cachedSources && cachedKnowledgeText && cachedMarkdownMap) {
    return {
      sources: cachedSources,
      fullText: cachedKnowledgeText,
      files: cachedMarkdownMap,
    };
  }

  const kbDir = path.join(process.cwd(), 'knowledge_base');

  try {
    const indexPath = path.join(kbDir, 'verified_sources_index.json');
    if (fs.existsSync(indexPath)) {
      const indexRaw = fs.readFileSync(indexPath, 'utf-8');
      cachedSources = JSON.parse(indexRaw);
    } else {
      cachedSources = [];
    }

    const mdFiles = [
      '01_basic_concepts_and_blood_glucose.md',
      '02_symptoms_and_risk_factors.md',
      '03_prevention_and_self_care.md',
      '04_misconceptions_and_myths.md',
      '05_warning_signs_and_safety_boundaries.md',
    ];

    cachedMarkdownMap = {};
    let combined = '';

    for (const file of mdFiles) {
      const filePath = path.join(kbDir, file);
      if (fs.existsSync(filePath)) {
        const text = fs.readFileSync(filePath, 'utf-8');
        cachedMarkdownMap[file] = text;
        combined += `\n\n--- DOCUMENT: ${file} ---\n\n${text}`;
      }
    }

    cachedKnowledgeText = combined;

    return {
      sources: cachedSources || [],
      fullText: cachedKnowledgeText,
      files: cachedMarkdownMap,
    };
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return {
      sources: [],
      fullText: '',
      files: {},
    };
  }
}

export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, ''); // strip Arabic vowels/tashkeel
}

export function detectEmergencySigns(text: string): boolean {
  const norm = normalizeArabic(text);
  const emergencyKeywords = [
    'fruity breath', 'acetone breath', 'رائحه فواكه', 'ريحه فواكه', 'نفس فواكه', 'اسيتون',
    'kussmaul', 'تنفس سريع', 'تنفس عميق', 'dka', 'حماض', 'diabetic ketoacidosis',
    'unconscious', 'fainted', 'passed out', 'فقدان الوعي', 'مغمي عليه', 'اغماء', 'غيبوبه', 'coma',
    'seizure', 'convulsion', 'تشنج', 'صرع',
    'chest pain', 'heart attack', 'الم في الصدر', 'الم بالصدر', 'وجع بالصدر', 'جلطه قلبيه', 'ذبحه صدريه',
    'slurred speech', 'ثقل في اللسان', 'صعوبه في النطق', 'facial drooping', 'شلل في الوجه', 'stroke', 'جلطه دماغيه',
    'gangrene', 'black toe', 'غرغرينا', 'سواد في الاصبع', 'تعفن القدم', 'صديد شديد',
    'severe hypoglycemia', 'هبوط حاد', 'سكر 40', 'سكر 35', 'سكر 50', 'سكر اقل من 54',
    'hhs', 'فرط الاسمولي', 'سكر 600', 'سكر 700'
  ];

  return emergencyKeywords.some(kw => norm.includes(kw));
}

export function detectPII(text: string): boolean {
  const phonePattern = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3,4})[-. ]*(\d{4})|07\d{8,9}/g;
  const hasPhone = phonePattern.test(text);

  const piiKeywords = [
    'رقم هاتفي', 'رقم جوالي', 'اسمي الكامل', 'اسمي هو', 'بطاقة وطنية', 'رقم الهوية',
    'my phone number', 'my full name is', 'my national id', 'ssn', 'medical record number'
  ];

  const hasPiiKeyword = piiKeywords.some(kw => text.toLowerCase().includes(kw));
  return hasPhone || hasPiiKeyword;
}

export function detectOutOfScope(text: string): boolean {
  const lower = text.toLowerCase();
  const norm = normalizeArabic(text);

  const outOfScopeKeywords = [
    'migraine', 'صداع نصفي', 'شقيقه', 'شقيقة',
    'heartburn', 'acid reflux', 'حرقه في المعده', 'حرقة في المعدة', 'حموضه', 'حموضة', 'ارتجاع المريء',
    'asthma', 'ربو', 'ضيق قصبات',
    'appendicitis', 'التهاب الزائده', 'التهاب الزائدة',
    'bone fracture', 'كسر في العظم', 'كسور',
    'cancer', 'سرطان', 'ورم خبيث',
    'tooth extraction', 'خلع ضرس', 'الم اسنان', 'تسوس',
    'عرق النسا', 'انزلاق غضروفي', 'الم الظهر', 'المراره', 'المرارة', 'حصى الكلى', 'بواسير',
    'covid-19', 'كورونا',
    'python', 'بايثون', 'javascript', 'جافاسكريبت', 'react', 'رياكت', 'اكتب كود', 'كود', 'برمجه', 'برمجة',
    'كره قدم', 'كرة قدم', 'مباراه', 'مباراة', 'سياره', 'سيارة', 'سيارات', 'طقس', 'تصليح', 'شعر', 'قصيده', 'قصيدة'
  ];

  // If text mentions these AND does NOT ask about their relation to diabetes
  const matches = outOfScopeKeywords.some(kw => norm.includes(normalizeArabic(kw)) || lower.includes(kw));
  const mentionsDiabetes =
    norm.includes('سكري') ||
    norm.includes('سكر') ||
    norm.includes('تراكمي') ||
    lower.includes('diabetes') ||
    lower.includes('glucose') ||
    lower.includes('hba1c');

  if (matches && !mentionsDiabetes) {
    return true;
  }
  return false;
}

export function validateAndCleanCitations(
  citations: Array<{ organization?: string; title?: string; url: string }> | undefined,
  sources: VerifiedSource[]
): Array<{ organization: string; title: string; url: string }> {
  if (!Array.isArray(citations)) return [];

  const verifiedUrlMap = new Map<string, VerifiedSource>();
  for (const s of sources) {
    verifiedUrlMap.set(s.url.trim().toLowerCase(), s);
  }

  const cleaned: Array<{ organization: string; title: string; url: string }> = [];
  const addedUrls = new Set<string>();

  for (const c of citations) {
    if (!c || !c.url) continue;
    const normUrl = c.url.trim().toLowerCase();

    // Check exact match or known organization match
    let match = verifiedUrlMap.get(normUrl);
    if (!match) {
      // Find by matching pathname
      const entries = Array.from(verifiedUrlMap.entries());
      for (let i = 0; i < entries.length; i++) {
        const [vUrl, vSource] = entries[i];
        try {
          if (normUrl.includes(new URL(vUrl).pathname) || vUrl.includes(normUrl)) {
            match = vSource;
            break;
          }
        } catch {
          if (vUrl.includes(normUrl) || normUrl.includes(vUrl)) {
            match = vSource;
            break;
          }
        }
      }
    }

    if (match && !addedUrls.has(match.url)) {
      addedUrls.add(match.url);
      cleaned.push({
        organization: match.organization,
        title: match.title,
        url: match.url,
      });
    }
  }

  // Fallback: If no citations matched, add relevant default sources from verified list
  if (cleaned.length === 0 && sources.length > 0) {
    cleaned.push({
      organization: sources[0].organization,
      title: sources[0].title,
      url: sources[0].url,
    });
    if (sources[6]) {
      cleaned.push({
        organization: sources[6].organization,
        title: sources[6].title,
        url: sources[6].url,
      });
    }
  }

  return cleaned;
}
