import React from 'react';
import type { ChapterData } from '../types';

interface VerseSelectorProps {
  chapter: ChapterData;
  onSelectVerse: (verse: number) => void;
  onBack: () => void;
}

const VerseSelector: React.FC<VerseSelectorProps> = ({ chapter, onSelectVerse, onBack }) => {
  return (
    <div className="pt-10">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Voltar à Leitura
        </button>
        <h3 className="text-xl font-bold text-cyan-400 text-right">
            Versículos em {chapter.reference}
        </h3>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
        {chapter.verses.map(v => (
          <button
            key={v.verse}
            onClick={() => onSelectVerse(v.verse)}
            className="aspect-square flex items-center justify-center bg-gray-700 rounded-md text-gray-200 hover:bg-cyan-600 hover:text-white font-semibold transition-colors duration-200"
          >
            {v.verse}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VerseSelector;
