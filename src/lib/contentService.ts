import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";


// --- TYPES ---
export interface PortfolioItem {
  id?: string;
  name: string;
  industry_ko: string;
  industry_en: string;
  type_ko: string;
  type_en: string;
  status: "active" | "realized";
  entry: string;
  exit?: string;
  irr?: string;
  description_ko: string;
  description_en: string;
  size?: string; // Home page featured deals info
  logo?: string;
  featured?: boolean;
}

export interface NewsItem {
  id?: string;
  category_ko: string;
  category_en: string;
  title_ko: string;
  title_en: string;
  date: string;
}

export interface MetricItem {
  id: string;
  label_ko: string;
  label_en: string;
  value: number;
  suffix_ko: string;
  suffix_en: string;
}

export interface InquiryItem {
  id?: string;
  name?: string;
  email: string;
  company?: string;
  message?: string;
  company_name?: string;
  contact_name?: string;
  phone?: string;
  industry?: string;
  description?: string;
  nda_requested?: boolean;
  upload_path?: string;
  created_at?: { seconds: number; nanoseconds: number } | null;
  type: "general" | "deal";
}

export interface CareerItem {
  id?: string;
  title: string;
  postedDate: string;
  status: "active" | "closed";
  description: string;
  requirements: string;
  preferred: string;
  conditions: string;
  process: string;
  submission: string;
  notes: string;
  contactEmail: string;
  createdAt?: string;
}

// --- DEFAULT DATA FOR SEEDING / FALLBACKS ---
export const defaultMetrics: MetricItem[] = [
  { id: "aum", label_ko: "운용자산 (AUM)", label_en: "Assets Under Management", value: 3.8, suffix_ko: "T KRW+", suffix_en: "T KRW+" },
  { id: "transactions", label_ko: "체결된 거래 건수", label_en: "Transactions Executed", value: 45, suffix_ko: "+", suffix_en: "+" },
  { id: "portfolio", label_ko: "포트폴리오 기업 수", label_en: "Portfolio Companies", value: 18, suffix_ko: "", suffix_en: "" },
  { id: "coverage", label_ko: "산업 커버리지 분야", label_en: "Industry Coverage", value: 5, suffix_ko: " Sectors", suffix_en: " Sectors" }
];

export const defaultPortfolio: PortfolioItem[] = [
  {
    name: "BioLogics Korea",
    industry_ko: "헬스케어 / 바이오",
    industry_en: "Healthcare / Biotech",
    type_ko: "인수금융 & 성장자본",
    type_en: "Acquisition Finance & Growth Equity",
    status: "active",
    entry: "2025.11",
    size: "350B KRW",
    logo: "BL",
    featured: true,
    description_ko: "국내 대표 CDMO 기업의 글로벌 설비 확장 및 기술 도약을 위한 패키지 금융 솔루션 공급.",
    description_en: "Provided structured expansion capital for a leading domestic CDMO's global facility scaling."
  },
  {
    name: "SemiTech Solutions",
    industry_ko: "반도체 장비 제조",
    industry_en: "Semiconductor Equipment",
    type_ko: "구조화 사채 (CB)",
    type_en: "Structured Convertible Bonds",
    status: "active",
    entry: "2025.08",
    size: "180B KRW",
    logo: "ST",
    featured: true,
    description_ko: "HBM 테스트 장비 국산화 기술 고도화를 지원하는 하이브리드 대출 금융 구조화.",
    description_en: "Structured hybrid credit to accelerate HBM test equipment localization."
  },
  {
    name: "Global Logistics Hub",
    industry_ko: "인프라 / 물류",
    industry_en: "Infrastructure / Logistics",
    type_ko: "경영권 인수 (Buyout)",
    type_en: "Buyout (GP-Led)",
    status: "active",
    entry: "2025.04",
    size: "520B KRW",
    logo: "GL",
    featured: true,
    description_ko: "아시아 주요 거점 콜드체인 물류 인프라 인수 및 스마트 물류 시스템 이식.",
    description_en: "Acquired a cold-chain logistics network in Asia and integrated smart logistics operating software."
  },
  {
    name: "K-Food Brands",
    industry_ko: "소비재 / F&B",
    industry_en: "Consumer / F&B",
    type_ko: "성장 자본 (Growth Capital)",
    type_en: "Growth Capital",
    status: "realized",
    entry: "2022.06",
    exit: "2025.02",
    irr: "28.5%",
    featured: false,
    description_ko: "북미 수출망 확장을 자금 지원하고, 현지 유통 파트너십을 주선하여 기업가치를 대폭 제고한 후 글로벌 기업에 성공적으로 매각 완료.",
    description_en: "Backed North American distribution expansion and successfully exited to a global strategic buyer."
  },
  {
    name: "EcoEnergy Group",
    industry_ko: "에너지 / 신재생",
    industry_en: "Energy / Renewables",
    type_ko: "구조화 메자닌",
    type_en: "Structured Mezzanine",
    status: "realized",
    entry: "2021.10",
    exit: "2024.11",
    irr: "19.2%",
    featured: false,
    description_ko: "태양광 발전 인프라 개발 메자닌 조달을 통해 고정 금리 수익 및 지분 전환 차익을 확보하며 회수 완료.",
    description_en: "Invested via structured mezzanine in solar infrastructure development, achieving robust fixed yield and equity upside."
  }
];

export const defaultNews: NewsItem[] = [
  {
    category_ko: "구조화금융 동향",
    category_en: "Trends",
    title_ko: "2026년 한국 중견기업 구조화 신용 투자 기회",
    title_en: "Korean Mid-Market Structured Credit Opportunities in 2026",
    date: "2026.05.15"
  },
  {
    category_ko: "뉴스룸",
    category_en: "News",
    title_ko: "원데이즈PE, 바이오로직스 코리아 파이낸싱 라운드 성공적 마감",
    title_en: "Onedays PE successfully closes BioLogics Korea financing round",
    date: "2025.11.20"
  },
  {
    category_ko: "시장 인사이트",
    category_en: "Market Insights",
    title_ko: "M&A 자문 동향: 하이브리드 부채 및 자기자본 구조",
    title_en: "M&A Advisory Trends: Hybrid Debt & Equity Capital Structures",
    date: "2025.10.08"
  }
];

export const defaultCareers: CareerItem[] = [
  {
    title: "[채용공고] 기관전용 PE 사모집합투자기구 운용전문인력 채용",
    postedDate: "2026.07.07",
    status: "active",
    description: "당사는 새롭게 첫걸음을 내딛는 기관전용 사모펀드(PE) 운용사로서, 당사와 함께 처음부터 회사를 빌드업하며 열정적이고 주도적으로 성장해 나갈 핵심 인재를 모집합니다.\n초기 멤버로서 펀드 설립부터 회사 운영 전반을 꼼꼼하고 책임감 있게 이끌어갈 분들의 많은 지원을 바랍니다.",
    requirements: "채용 직무: 사모집합투자기구 운용전문인력 (일반운용전문인력 자격 필수)\n담당 업무:\n- 기관전용 사모펀드(PEF) 설립 및 관리 업무\n- 펀드 운용 지원 및 청산 관련 제반 업무\n- 회사 운영 및 경영 관리 지원 업무\n자격 요건:\n- 금융투자협회 '사모집합투자기구 운용전문인력' 자격증 보유자 (필수)\n- 연령 제한 없음\n- 신설 법인의 초기 세팅과 성장에 열정을 가지고 임하실 분",
    preferred: "여성 금융인 커리어 개발 및 장기 근무 희망자 우대\n영어 및 외국어 능통자 (글로벌 업무 가능자)\n생성형 AI 툴(ChatGPT, 업무 자동화 등) 및 IT 디바이스 활용 능숙자",
    conditions: "근무 형태: 정규직 (조정 가능)\n급여 조건: 연봉 5,000만 원 이상 (경력과 역량에 따라 면접 후 적극 협의 가능)",
    process: "전형 절차: 서류 전형 ➡️ 면접 전형 (인터뷰) ➡️ 최종 합격\n접수 기간: 채용 공고일로부터 최소 10일간 모집 (적격자 채용 시 마감)\n면접 일정: 서류 합격자에 한해 개별 전화 연락을 통해 인터뷰 일시를 조정 및 확정합니다.",
    submission: "제출 서류: 이력서, 자기소개서, 관련 자격증 사본\n담당자: 김경준\n접수 방법: 이메일 접수 (thewillkim@naver.com)",
    notes: "제출하신 서류는 채용 목적 이외에는 사용되지 않으며, 개인정보 비밀이 보장됩니다.\n서류 허위 기재 시 채용이 취소될 수 있습니다.",
    contactEmail: "thewillkim@naver.com"
  }
];

// Checking if Firestore configuration exists helper
const hasFirebaseKey = () => typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// --- FIRESTORE SERVICES ---

// 1. Seed Database
export async function seedInitialData() {
  if (!hasFirebaseKey()) return false;
  try {
    // 1. Seed metrics
    for (const metric of defaultMetrics) {
      await setDoc(doc(db, "metrics", metric.id), metric);
    }
    // 2. Seed portfolio
    for (const item of defaultPortfolio) {
      const docRef = doc(collection(db, "portfolio"));
      await setDoc(docRef, { ...item, id: docRef.id });
    }
    // 3. Seed news
    for (const news of defaultNews) {
      const docRef = doc(collection(db, "news"));
      await setDoc(docRef, { ...news, id: docRef.id });
    }
    // 4. Seed careers
    for (const career of defaultCareers) {
      const docRef = doc(collection(db, "careers"));
      await setDoc(docRef, { ...career, id: docRef.id });
    }
    return true;
  } catch (error) {
    console.error("Seeding error:", error);
    return false;
  }
}

// 2. Metrics API
export async function getMetrics(): Promise<MetricItem[]> {
  if (!hasFirebaseKey()) return defaultMetrics;
  try {
    const querySnapshot = await getDocs(collection(db, "metrics"));
    if (querySnapshot.empty) {
      return defaultMetrics;
    }
    const metrics: MetricItem[] = [];
    querySnapshot.forEach((doc) => {
      metrics.push(doc.data() as MetricItem);
    });
    // Sort to match default metrics order if necessary
    return metrics.length > 0 ? metrics : defaultMetrics;
  } catch (e) {
    console.error("Error fetching metrics from firestore: ", e);
    return defaultMetrics;
  }
}

export async function updateMetric(metric: MetricItem): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await setDoc(doc(db, "metrics", metric.id), metric);
    return true;
  } catch (e) {
    console.error("Error updating metric:", e);
    return false;
  }
}

// 3. Portfolio API
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!hasFirebaseKey()) return defaultPortfolio;
  try {
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    if (querySnapshot.empty) {
      return defaultPortfolio;
    }
    const items: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id } as PortfolioItem);
    });
    return items;
  } catch (e) {
    console.error("Error fetching portfolio from firestore:", e);
    return defaultPortfolio;
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, "id">): Promise<string | null> {
  if (!hasFirebaseKey()) return null;
  try {
    const docRef = await addDoc(collection(db, "portfolio"), item);
    // Add id field internally too
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (e) {
    console.error("Error adding portfolio item:", e);
    return null;
  }
}

export async function updatePortfolioItem(id: string, item: Partial<PortfolioItem>): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await updateDoc(doc(db, "portfolio", id), item);
    return true;
  } catch (e) {
    console.error("Error updating portfolio item:", e);
    return false;
  }
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await deleteDoc(doc(db, "portfolio", id));
    return true;
  } catch (e) {
    console.error("Error deleting portfolio item:", e);
    return false;
  }
}

// 4. News API
export async function getNewsItems(): Promise<NewsItem[]> {
  if (!hasFirebaseKey()) return defaultNews;
  try {
    const querySnapshot = await getDocs(collection(db, "news"));
    if (querySnapshot.empty) {
      return defaultNews;
    }
    const items: NewsItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id } as NewsItem);
    });
    // Sort by date descending
    return items.sort((a, b) => b.date.localeCompare(a.date));
  } catch (e) {
    console.error("Error fetching news from firestore:", e);
    return defaultNews;
  }
}

export async function addNewsItem(item: Omit<NewsItem, "id">): Promise<string | null> {
  if (!hasFirebaseKey()) return null;
  try {
    const docRef = await addDoc(collection(db, "news"), item);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (e) {
    console.error("Error adding news item:", e);
    return null;
  }
}

export async function updateNewsItem(id: string, item: Partial<NewsItem>): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await updateDoc(doc(db, "news", id), item);
    return true;
  } catch (e) {
    console.error("Error updating news item:", e);
    return false;
  }
}

export async function deleteNewsItem(id: string): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await deleteDoc(doc(db, "news", id));
    return true;
  } catch (e) {
    console.error("Error deleting news item:", e);
    return false;
  }
}

// 5. Inquiries View API (Inquiries are saved directly to contact_inquiries / deal_submissions)
export async function getInquiries(): Promise<InquiryItem[]> {
  if (!hasFirebaseKey()) return [];
  try {
    const inquiriesList: InquiryItem[] = [];

    // General inquiries
    const generalSnapshot = await getDocs(collection(db, "contact_inquiries"));
    generalSnapshot.forEach((doc) => {
      inquiriesList.push({
        ...doc.data(),
        id: doc.id,
        type: "general"
      } as InquiryItem);
    });

    // Deal inquiries
    const dealSnapshot = await getDocs(collection(db, "deal_submissions"));
    dealSnapshot.forEach((doc) => {
      inquiriesList.push({
        ...doc.data(),
        id: doc.id,
        type: "deal"
      } as InquiryItem);
    });

    // Sort by created_at (descending)
    return inquiriesList.sort((a, b) => {
      const dateA = a.created_at?.seconds || 0;
      const dateB = b.created_at?.seconds || 0;
      return dateB - dateA;
    });
  } catch (e) {
    console.error("Error fetching inquiries:", e);
    return [];
  }
}

export async function deleteInquiry(id: string, type: "general" | "deal"): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    const collectionName = type === "general" ? "contact_inquiries" : "deal_submissions";
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (e) {
    console.error(`Error deleting inquiry ${id} of type ${type}:`, e);
    return false;
  }
}

// 6. Careers API
export async function getCareers(): Promise<CareerItem[]> {
  if (!hasFirebaseKey()) return defaultCareers;
  try {
    const querySnapshot = await getDocs(collection(db, "careers"));
    if (querySnapshot.empty) {
      return defaultCareers;
    }
    const items: CareerItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id } as CareerItem);
    });
    return items;
  } catch (e) {
    console.error("Error fetching careers from firestore:", e);
    return defaultCareers;
  }
}

export async function addCareerItem(item: Omit<CareerItem, "id">): Promise<string | null> {
  if (!hasFirebaseKey()) return null;
  try {
    const docRef = await addDoc(collection(db, "careers"), {
      ...item,
      createdAt: new Date().toISOString()
    });
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (e) {
    console.error("Error adding career item:", e);
    return null;
  }
}

export async function updateCareerItem(id: string, item: Partial<CareerItem>): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await updateDoc(doc(db, "careers", id), item);
    return true;
  } catch (e) {
    console.error("Error updating career item:", e);
    return false;
  }
}

export async function deleteCareerItem(id: string): Promise<boolean> {
  if (!hasFirebaseKey()) return false;
  try {
    await deleteDoc(doc(db, "careers", id));
    return true;
  } catch (e) {
    console.error("Error deleting career item:", e);
    return false;
  }
}
