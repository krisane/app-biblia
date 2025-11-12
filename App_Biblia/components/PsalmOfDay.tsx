import React from 'react';
import type { ChapterData, FontSize } from '../types';

interface PsalmOfDayProps {
  data: ChapterData | null;
  loading: boolean;
  fontSize: FontSize;
}

const fontSizeClasses: Record<FontSize, string> = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
};

export const PsalmOfDay: React.FC<PsalmOfDayProps> = ({ data, loading, fontSize }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-6 shadow-xl mb-8 border border-yellow-400/30">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4 tracking-wide">
                Versículo do Dia
            </h2>
            {loading && (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
            )}
            {data && !loading && (
                <div className={`space-y-3 leading-relaxed text-gray-300 text-center ${fontSizeClasses[fontSize]}`}>
                    <h3 className="font-bold text-cyan-400 text-xl">{data.reference}</h3>
                    {data.verses.map(v => (
                         <p key={v.verse}>
                            <sup className="font-semibold text-cyan-500 mr-1 select-none">{v.verse}</sup>
                            {v.text}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};