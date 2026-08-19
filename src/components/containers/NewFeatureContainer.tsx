"use client";

import React, { useState, useEffect } from "react";
import { StitchLayout } from "../ui/StitchLayout";
import { StitchCard } from "../ui/StitchCard";
import { Sparkles, Image as ImageIcon, LayoutTemplate } from "lucide-react";

// Mock data interface
interface DesignAsset {
  id: string;
  title: string;
  description: string;
  type: "layout" | "image" | "component";
}

/**
 * NewFeatureContainer (Container Component)
 * 비즈니스 로직(상태 관리, API 호출 등)을 처리하고 UI 컴포넌트에 주입합니다.
 */
export const NewFeatureContainer: React.FC = () => {
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock API call to load Stitch design metadata
  useEffect(() => {
    const fetchStitchData = async () => {
      setLoading(true);
      try {
        // 실제로는 Firebase나 외부 API로부터 Design DNA 데이터를 불러옵니다.
        // 현재는 디자인 데이터가 없으므로 Mock 데이터를 사용합니다.
        setTimeout(() => {
          setAssets([
            {
              id: "1",
              title: "Hero Section",
              description: "Main landing page hero with call to action.",
              type: "layout",
            },
            {
              id: "2",
              title: "Feature Grid",
              description: "Responsive 3-column grid for product features.",
              type: "component",
            },
            {
              id: "3",
              title: "Background Pattern",
              description: "Subtle geometric background pattern.",
              type: "image",
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to load Stitch data", error);
        setLoading(false);
      }
    };

    fetchStitchData();
  }, []);

  const handleAssetClick = (asset: DesignAsset) => {
    // 실제 상태 관리 라이브러리(Zustand 등)의 액션 호출 또는 라우팅 처리
    console.log(`Asset clicked: ${asset.title}`);
    alert(`Selected: ${asset.title}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "layout": return LayoutTemplate;
      case "image": return ImageIcon;
      default: return Sparkles;
    }
  };

  if (loading) {
    return (
      <StitchLayout title="Loading Design Assets...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </StitchLayout>
    );
  }

  return (
    <StitchLayout 
      title="Stitch UI Components"
      className="stitch-feature-module"
    >
      <div className="mb-8">
        <p className="text-neutral-600 dark:text-neutral-300">
          이 화면은 Stitch에서 추출된 디자인 에셋을 렌더링하는 예시(Container)입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <StitchCard
            key={asset.id}
            title={asset.title}
            description={asset.description}
            icon={getIconForType(asset.type)}
            onClick={() => handleAssetClick(asset)}
          />
        ))}
      </div>
    </StitchLayout>
  );
};
