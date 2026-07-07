"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getNewsItems, NewsItem } from "@/lib/contentService";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Info, Newspaper } from "lucide-react";

type FilterTab = "all" | "news" | "market" | "trends";

export default function InsightsPage() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadNews() {
      try {
        const data = await getNewsItems();
        setNews(data);
      } catch (error) {
        console.error("Failed to load news items:", error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Parse URL Hash on load & hashchange
  useEffect(() => {
    if (!mounted) return;

    const parseHash = () => {
      const hash = window.location.hash;
      if (hash === "#news") {
        setActiveTab("news");
      } else if (hash === "#market") {
        setActiveTab("market");
      } else if (hash === "#trends") {
        setActiveTab("trends");
      } else {
        setActiveTab("all");
      }
    };

    parseHash(); // On mount
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, [mounted]);

  // Handle Tab Switch & URL hash update
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setExpandedId(null); // Reset accordion on tab change
    if (tab === "all") {
      window.history.pushState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `#${tab}`);
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (!mounted) return null;

  // Filter Logic
  const filteredNews = news.filter((item) => {
    if (activeTab === "all") return true;
    
    // category matching (KO or EN category keywords mapping)
    const categoryKo = item.category_ko;
    const categoryEn = item.category_en;

    if (activeTab === "news") {
      return categoryKo.includes("뉴스룸") || categoryEn.toLowerCase().includes("news");
    }
    if (activeTab === "market") {
      return categoryKo.includes("시장 인사이트") || categoryEn.toLowerCase().includes("market");
    }
    if (activeTab === "trends") {
      return categoryKo.includes("구조화금융 동향") || categoryKo.includes("트렌드") || categoryEn.toLowerCase().includes("trends");
    }
    return true;
  });

  const tabLabels = {
    all: language === "en" ? "All" : "전체",
    news: language === "en" ? "Newsroom" : "뉴스룸",
    market: language === "en" ? "Market Insights" : "시장 인사이트",
    trends: language === "en" ? "Structured Credit Trends" : "구조화금융 동향"
  };

  return (
    <div className="bg-navy-deep min-h-screen text-white py-16 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">INSIGHTS & NEWS</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gold-gradient-text uppercase">뉴스 & 인사이트</h1>
          <p className="text-xs text-white/50 max-w-lg mx-auto font-light leading-relaxed">
            원데이즈PE가 제공하는 최신 사모펀드 동향, 미디어 릴리즈 및 시장 인사이트를 전해드립니다.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/10 max-w-2xl mx-auto">
          {(["all", "news", "market", "trends"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-accent-gold text-navy-deep shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Insights List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white/50">데이터를 로드하는 중...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="border border-white/10 bg-navy-light/10 rounded-xl p-16 text-center text-xs text-white/30 space-y-2">
            <Newspaper className="w-12 h-12 mx-auto text-white/10" />
            <div>선택한 카테고리에 등록된 소식이 없습니다.</div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredNews.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-navy-light/30 border rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${
                    isExpanded ? "border-accent-gold/50 bg-navy-light/50" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Header Row (Clickable) */}
                  <button
                    onClick={() => item.id && toggleAccordion(item.id)}
                    className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                          {language === "en" ? item.category_en : item.category_ko}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-accent-gold transition-colors">
                        {language === "en" ? item.title_en : item.title_ko}
                      </h3>
                    </div>
                    <div className="p-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {isExpanded ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
                    </div>
                  </button>

                  {/* Body Content (Collapsible) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden bg-navy-deep/40 border-t border-white/5"
                      >
                        <div className="p-6 text-xs md:text-sm text-white/70 leading-relaxed font-light whitespace-pre-wrap select-text space-y-4">
                          {language === "en" ? (
                            item.content_en ? (
                              <p>{item.content_en}</p>
                            ) : (
                              <p className="text-white/30 italic flex items-center gap-1.5">
                                <Info className="w-4 h-4" />
                                English content is being prepared. Please refer to the Korean version.
                              </p>
                            )
                          ) : null}

                          {language === "ko" || (language === "en" && !item.content_en) ? (
                            item.content_ko ? (
                              <p>{item.content_ko}</p>
                            ) : (
                              <p className="text-white/30 italic flex items-center gap-1.5">
                                <Info className="w-4 h-4" />
                                상세 내용이 등록되어 있지 않습니다.
                              </p>
                            )
                          ) : null}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
