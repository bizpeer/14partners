"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getCareers, CareerItem } from "@/lib/contentService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  FileText,
  Award,
  Clock,
  ArrowRight,
  User,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function CareersPage() {
  const { language } = useLanguage();
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    async function loadCareers() {
      try {
        const data = await getCareers();
        setCareers(data);
      } catch (error) {
        console.error("Failed to load careers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCareers();
  }, []);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateSlide(-1);
      } else if (e.key === "ArrowRight") {
        navigateSlide(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, careers]);

  const activeJob = careers.find((c) => c.status === "active") || careers[0];

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-navy-deep flex items-center justify-center flex-col gap-2">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-white/50">채용공고 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (!activeJob) {
    return (
      <div className="min-h-[70vh] bg-navy-deep flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <Info className="w-12 h-12 text-accent-gold mx-auto opacity-75" />
          <h2 className="text-xl font-bold text-white">현재 진행 중인 채용공고가 없습니다.</h2>
          <p className="text-xs text-white/50 leading-relaxed">
            원데이즈PE에 관심을 가져주셔서 감사합니다. 새로운 인재 영입 공고가 등록되면 이곳에 업데이트됩니다.
          </p>
        </div>
      </div>
    );
  }

  // Split lines helper
  const getLines = (text: string) => {
    if (!text) return [];
    return text.split("\n").map(l => l.trim()).filter(Boolean);
  };

  const slides = [
    // Slide 1: Cover
    {
      title: "Title Slide",
      content: (
        <div className="flex flex-col justify-between h-full py-4 text-center">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-accent-gold/15 text-accent-gold border border-accent-gold/20 inline-block">
              RECRUITMENT
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-snug tracking-tight text-white px-2">
              {activeJob.title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs font-mono pt-2">
              <Calendar className="w-4 h-4 text-accent-gold" />
              <span>게시일: {activeJob.postedDate}</span>
              <span className="h-3 w-[1px] bg-white/20 mx-1"></span>
              <span className="text-emerald-400 font-bold">모집 중</span>
            </div>
          </div>

          <div className="my-auto max-w-xl mx-auto px-4 md:px-8">
            <p className="text-sm text-white/70 leading-relaxed font-light whitespace-pre-wrap">
              {activeJob.description}
            </p>
          </div>

          <div className="text-[10px] text-white/30 tracking-widest uppercase">
            좌우 방향키(←, →) 또는 하단 버튼으로 자세히 보기
          </div>
        </div>
      )
    },
    // Slide 2: Qualifications & Responsibilities
    {
      title: "모집 부문 및 자격 요건",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <User className="w-5 h-5 text-accent-gold" />
            <h3 className="text-base font-bold text-accent-gold">1. 모집 부문 및 자격 요건</h3>
          </div>

          <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4 text-left max-h-[300px]">
            {getLines(activeJob.requirements).map((line, idx) => {
              const isHeader = line.includes("채용 직무") || line.includes("담당 업무") || line.includes("자격 요건");
              if (isHeader) {
                return (
                  <h4 key={idx} className="text-xs font-extrabold tracking-wide text-white uppercase mt-4 mb-2 flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded border-l-2 border-accent-gold">
                    {line}
                  </h4>
                );
              }
              return (
                <div key={idx} className="flex gap-2 items-start text-xs text-white/80 leading-relaxed pl-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold/75 flex-shrink-0 mt-0.5" />
                  <span>{line.replace(/^-\s*/, "").replace(/^•\s*/, "")}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-white/40 border-t border-white/5 pt-2">
            ONEDAYS PRIVATE EQUITY RECRUITING
          </div>
        </div>
      )
    },
    // Slide 3: Preferred
    {
      title: "우대 사항",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Award className="w-5 h-5 text-accent-gold" />
            <h3 className="text-base font-bold text-accent-gold">2. 우대 사항</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center my-6 space-y-4 max-w-lg mx-auto w-full text-left">
            {getLines(activeJob.preferred).map((line, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-accent-gold/30 hover:bg-white/10 transition-all duration-300 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <div className="text-xs text-white/90 leading-relaxed font-light">
                  {line.replace(/^•\s*/, "")}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-white/40">
            ONEDAYS PRIVATE EQUITY RECRUITING
          </div>
        </div>
      )
    },
    // Slide 4: Terms
    {
      title: "근무 조건 및 처우",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Clock className="w-5 h-5 text-accent-gold" />
            <h3 className="text-base font-bold text-accent-gold">3. 근무 조건 및 처우</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center my-6 max-w-md mx-auto w-full space-y-4 text-left">
            {getLines(activeJob.conditions).map((line, idx) => {
              const parts = line.split(":");
              const label = parts[0]?.trim();
              const val = parts.slice(1).join(":")?.trim();

              return (
                <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                  <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">{label.replace(/^•\s*/, "")}</span>
                  <span className="text-sm font-semibold text-white">{val || label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-white/40">
            ONEDAYS PRIVATE EQUITY RECRUITING
          </div>
        </div>
      )
    },
    // Slide 5: Selection Process
    {
      title: "전형 절차 및 일정",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <ArrowRight className="w-5 h-5 text-accent-gold" />
            <h3 className="text-base font-bold text-accent-gold">4. 전형 절차 및 일정</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center my-6 space-y-8">
            {/* Visual Process Timeline */}
            <div className="flex items-center justify-center gap-2 md:gap-4 max-w-md mx-auto w-full">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center flex-1">
                <span className="text-[10px] text-white/40 font-mono">STEP 01</span>
                <div className="text-xs font-bold text-white mt-1">서류 전형</div>
              </div>
              <ArrowRight className="w-4 h-4 text-accent-gold flex-shrink-0" />
              <div className="bg-accent-gold/10 border border-accent-gold/30 p-3 rounded-lg text-center flex-1">
                <span className="text-[10px] text-accent-gold font-mono">STEP 02</span>
                <div className="text-xs font-bold text-accent-gold mt-1">면접 전형</div>
              </div>
              <ArrowRight className="w-4 h-4 text-accent-gold flex-shrink-0" />
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center flex-1">
                <span className="text-[10px] text-white/40 font-mono">STEP 03</span>
                <div className="text-xs font-bold text-white mt-1">최종 합격</div>
              </div>
            </div>

            <div className="max-w-md mx-auto text-left space-y-3 px-4">
              {getLines(activeJob.process).map((line, idx) => {
                if (line.includes("전형 절차")) return null; // Skip redundant text
                return (
                  <div key={idx} className="flex gap-2 items-start text-xs text-white/70 leading-relaxed font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0 mt-2" />
                    <span>{line.replace(/^•\s*/, "")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-white/40">
            ONEDAYS PRIVATE EQUITY RECRUITING
          </div>
        </div>
      )
    },
    // Slide 6: How to Apply & Notes
    {
      title: "제출 서류 및 접수 방법",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Mail className="w-5 h-5 text-accent-gold" />
            <h3 className="text-base font-bold text-accent-gold">5. 접수 방법 및 안내</h3>
          </div>

          <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4 text-left max-h-[260px]">
            {/* Submission & Email Contact */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              {getLines(activeJob.submission).map((line, idx) => {
                if (line.includes("접수 방법") || line.includes("thewillkim")) return null; // Custom Render
                return (
                  <div key={idx} className="text-xs flex gap-2 font-light text-white/90">
                    <span className="text-accent-gold font-bold">•</span>
                    <span>{line.replace(/^•\s*/, "")}</span>
                  </div>
                );
              })}

              <div className="pt-2">
                <a
                  href={`mailto:${activeJob.contactEmail}?subject=${encodeURIComponent(`[원데이즈PE 지원] 성명 - 사모펀드 운용전문인력`)}`}
                  className="w-full flex items-center justify-center gap-2 bg-accent-gold hover:bg-accent-gold-dark text-navy-deep font-extrabold text-xs py-2.5 rounded transition-all duration-300 shadow-md shadow-accent-gold/10"
                >
                  <Mail className="w-4 h-4" />
                  이메일 입사지원 ({activeJob.contactEmail})
                </a>
              </div>
            </div>

            {/* Note details */}
            <div className="bg-rose-500/5 border border-rose-500/10 rounded p-3 text-[11px] text-white/60 space-y-1">
              <div className="flex items-center gap-1 text-rose-400 font-bold mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>안내 및 유의사항</span>
              </div>
              {getLines(activeJob.notes).map((line, idx) => (
                <p key={idx} className="leading-relaxed font-light pl-4 relative">
                  <span className="absolute left-0 text-rose-500">•</span>
                  {line.replace(/^•\s*/, "")}
                </p>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-white/40">
            ONEDAYS PRIVATE EQUITY RECRUITING
          </div>
        </div>
      )
    }
  ];

  const navigateSlide = (newDirection: number) => {
    if (newDirection === 1) {
      if (currentSlide < slides.length - 1) {
        setDirection(1);
        setCurrentSlide(prev => prev + 1);
      }
    } else {
      if (currentSlide > 0) {
        setDirection(-1);
        setCurrentSlide(prev => prev - 1);
      }
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <div className="bg-navy-deep min-h-[90vh] relative text-white py-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">CAREERS</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gold-gradient-text uppercase">인재 영입</h1>
          <p className="text-xs text-white/50 max-w-lg mx-auto font-light leading-relaxed">
            원데이즈PE와 함께 투자 생태계를 빌드업하며 장기적으로 성장해 나갈 핵심 파트너를 모집합니다.
          </p>

          {/* Multilingual Warning guidance if language is EN */}
          {language === "en" && (
            <div className="mt-4 inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 px-4 py-2 rounded-full text-[11px] text-accent-gold max-w-xl mx-auto">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Please note: The official job posting details are provided in Korean.</span>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto bg-navy-light/40 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 backdrop-blur-md overflow-hidden min-h-[500px] flex flex-col justify-between">
          <div className="flex-1 relative flex flex-col justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full w-full"
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-6">
            <button
              onClick={() => navigateSlide(-1)}
              disabled={currentSlide === 0}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="이전 카드 (이전 방향키)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots Pagination */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-6 bg-accent-gold"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  title={`${index + 1}번 카드로 이동`}
                />
              ))}
            </div>

            <button
              onClick={() => navigateSlide(1)}
              disabled={currentSlide === slides.length - 1}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="다음 카드 (다음 방향키)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Accordion: Show Full Job Description text for SEO / easy copying */}
        <div className="max-w-2xl mx-auto bg-navy-light/20 border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="w-full px-6 py-4 flex justify-between items-center text-xs text-white/60 hover:text-white transition-colors cursor-pointer bg-white/5"
          >
            <span className="font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-accent-gold" />
              전체 채용 공고 텍스트로 복사 및 보기
            </span>
            {showFullText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showFullText && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 text-xs text-white/70 leading-relaxed font-light whitespace-pre-wrap select-text bg-navy-deep/80 border-t border-white/5 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{activeJob.title}</h3>
                    <p className="text-white/40 font-mono">게시일: {activeJob.postedDate}</p>
                  </div>

                  <div>
                    <p>{activeJob.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">1. 모집 부문 및 자격 요건</h4>
                    <p>{activeJob.requirements}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">2. 우대 사항</h4>
                    <p>{activeJob.preferred}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">3. 근무 조건 및 처우</h4>
                    <p>{activeJob.conditions}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">4. 전형 절차 및 일정</h4>
                    <p>{activeJob.process}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">5. 제출 서류 및 접수 방법</h4>
                    <p>{activeJob.submission}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-accent-gold mb-1">안내 사항</h4>
                    <p>{activeJob.notes}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
