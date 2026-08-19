import React from "react";
import { LucideIcon } from "lucide-react";

interface StitchCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/**
 * StitchCard (Presentation Component)
 * Stitch 디자인에서 자주 사용되는 카드 형태의 UI 컴포넌트입니다.
 * 클릭 이벤트와 같은 인터랙션은 상위(Container) 컴포넌트에서 주입받아 처리합니다.
 */
export const StitchCard: React.FC<StitchCardProps> = ({
  title,
  description,
  imageUrl,
  icon: Icon,
  onClick,
  className = "",
}) => {
  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-200 dark:bg-neutral-800 dark:border-neutral-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageUrl && (
        <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        {Icon && (
          <div className="mb-3 p-2 bg-blue-50 text-blue-600 rounded-lg w-fit dark:bg-blue-900/30 dark:text-blue-400">
            <Icon size={24} />
          </div>
        )}
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};
