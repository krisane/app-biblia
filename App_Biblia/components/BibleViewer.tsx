import React, { useState, useEffect, useRef } from 'react';
import type { ChapterData, Highlight, HighlightCategory } from '../types';
import { HIGHLIGHT_CATEGORIES } from '../constants';

interface BibleViewerProps {
  chapter: ChapterData;
  highlights: Highlight[];
  onAddHighlight: (text: string, category: HighlightCategory) => void;
  title?: string;
  saveStatus: string;
  onTitleClick: () => void;
  scrollToVerse: number | null;
}

const BibleViewer: React.FC<BibleViewerProps> = ({ chapter, highlights, onAddHighlight, title, saveStatus, onTitleClick, scrollToVerse }) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const versesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToVerse && versesContainerRef.current) {
        const verseElement = versesContainerRef.current.querySelector(`#verse-${scrollToVerse}`) as HTMLElement;
        if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            verseElement.classList.add('flash-highlight');
            setTimeout(() => {
                verseElement.classList.remove('flash-highlight');
            }, 1500);
        }
    }
  }, [scrollToVerse]);

  const handleTextSelection = () => {
    const text = window.getSelection()?.toString().trim() ?? '';
    setSelectedText(text);
  };
  
  const handleHighlightClick = (category: HighlightCategory) => {
    if (selectedText.length > 0) {
      onAddHighlight(selectedText, category);
      setSelectedText('');
      window.getSelection()?.removeAllRanges();
    }
  };

  const renderVerseText = (verseText: string) => {
    let remainingText = verseText;
    const parts: (string | React.ReactElement)[] = [];

    const sortedHighlights = [...highlights]
        .filter(h => remainingText.includes(h.text))
        .sort((a, b) => remainingText.indexOf(a.text) - remainingText.indexOf(b.text));

    sortedHighlights.forEach((highlight) => {
        const index = remainingText.indexOf(highlight.text);
        if (index > -1) {
            const before = remainingText.substring(0, index);
            if (before) parts.push(before);

            const category = HIGHLIGHT_CATEGORIES.find(c => c.name === highlight.categoryName);
            parts.push(
                <span key={highlight.id} className={category?.colorClass || ''}>
                    {highlight.text}
                </span>
            );
            remainingText = remainingText.substring(index + highlight.text.length);
        }
    });

    if (remainingText) {
        parts.push(remainingText);
    }

    return parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>);
  };

  return (
    <div className="relative select-text pt-10">
      {title && <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6 tracking-wide">{title}</h2>}
      <h2 
        onClick={onTitleClick}
        className="text-xl sm:text-2xl font-bold text-cyan-400 mb-6 text-center cursor-pointer hover:text-cyan-300 transition-colors"
        title="Selecionar versículo"
      >
        {chapter.reference}
      </h2>
      
      <div className="flex gap-6">
        {/* Verse text on the left */}
        <div 
          onMouseUp={handleTextSelection}
          className="flex-grow space-y-3 text-lg sm:text-xl leading-relaxed text-gray-300 text-left"
          ref={versesContainerRef}
        >
            {chapter.verses.map(v => (
                <p key={v.verse} id={`verse-${v.verse}`}>
                    <sup className="font-semibold text-cyan-500 mr-2 select-none">{v.verse}</sup>
                    <span>{renderVerseText(v.text)}</span>
                </p>
            ))}
        </div>

        {/* Sticky toolbar on the right */}
        <div className="relative w-12 flex-shrink-0" aria-live="polite">
            <div className="sticky top-24">
                <div className="flex flex-col items-center gap-4 p-2 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600/50">
                    {HIGHLIGHT_CATEGORIES.map(category => (
                        <button
                            key={category.name}
                            onClick={() => handleHighlightClick(category)}
                            aria-label={`Grifar como ${category.name}`}
                            className="w-8 h-8 rounded-full border-2 border-gray-600 transition-all duration-200 hover:scale-110 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            title={category.name}
                        >
                            <span className={`block w-full h-full rounded-full ${category.colorClass}`}></span>
                        </button>
                    ))}
                </div>
                <div className={`transition-opacity duration-500 absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max ${saveStatus ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
                        {saveStatus}
                    </span>
                </div>
            </div>
        </div>
      </div>
       
      <p className="text-right text-sm text-gray-500 mt-6 italic">{chapter.translation_name}</p>

    </div>
  );
};

export default BibleViewer;