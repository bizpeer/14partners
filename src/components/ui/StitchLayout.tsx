import React from "react";

interface StitchLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * StitchLayout (Presentation Component)
 * 순수 UI 레이아웃을 담당하는 컴포넌트입니다.
 * 비즈니스 로직은 포함하지 않으며, children을 통해 컨텐츠를 렌더링합니다.
 */
export const StitchLayout: React.FC<StitchLayoutProps> = ({ children, title, className = "" }) => {
  return (
    <div className={`min-h-screen bg-neutral-50 dark:bg-neutral-900 ${className}`}>
      {title && (
        <header className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h1>
        </header>
      )}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
