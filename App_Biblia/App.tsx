import React, { useState, useEffect, useCallback } from 'react';
import type { ChapterData, Highlight, HighlightCategory } from './types';
import { fetchReference } from './services/bibleService';
import { HIGHLIGHT_CATEGORIES, INSPIRATIONAL_VERSES } from './constants';
import SearchForm from './components/SearchForm';
import BibleViewer from './components/BibleViewer';
import SavedHighlightsModal from './components/SavedHighlightsModal';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PsalmOfDay } from './components/PsalmOfDay';
import BibleBrowser from './components/BibleBrowser';
import VerseSelector from './components/VerseSelector';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'viewer'>('home');
  const [verseOfDayData, setVerseOfDayData] = useState<ChapterData | null>(null);
  const [currentChapterData, setCurrentChapterData] = useState<ChapterData | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [verseOfDayLoading, setVerseOfDayLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [viewerSubView, setViewerSubView] = useState<'reading' | 'verse_selection'>('reading');
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);


  useEffect(() => {
    try {
      const savedHighlights = localStorage.getItem('bible-highlights');
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }
    } catch (e) {
      console.error("Failed to load highlights from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bible-highlights', JSON.stringify(highlights));
    } catch (e) {
      console.error("Failed to save highlights to localStorage", e);
    }
  }, [highlights]);

  const loadReferenceInViewer = useCallback(async (query: string) => {
    if (!query) return;
    setChapterLoading(true);
    setError(null);
    setCurrentChapterData(null);
    setViewerSubView('reading');
    setScrollToVerse(null);
    setView('viewer');
    try {
      const data = await fetchReference(query);
      setCurrentChapterData(data);
    } catch (err: any) {
      setError(err.message || 'Não foi possível encontrar a referência. Verifique a busca.');
    } finally {
      setChapterLoading(false);
    }
  }, []);
  
  const handleGoToVerse = useCallback((reference: string) => {
    setIsModalOpen(false);
    // Delay to allow modal to close before navigating
    setTimeout(() => {
        loadReferenceInViewer(reference);
    }, 150);
  }, [loadReferenceInViewer]);

  const handleGoHome = () => {
    setView('home');
    setCurrentChapterData(null);
    setError(null);
    setViewerSubView('reading');
    setScrollToVerse(null);
  };

  const handleSelectVerse = (verse: number) => {
    setViewerSubView('reading');
    setScrollToVerse(verse);
    setTimeout(() => setScrollToVerse(null), 50);
  };

  useEffect(() => {
    const getVerseReferenceForDay = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      const verseIndex = dayOfYear % INSPIRATIONAL_VERSES.length;
      return INSPIRATIONAL_VERSES[verseIndex];
    };
    
    const fetchVerseOfDay = async () => {
        setVerseOfDayLoading(true);
        try {
            const verseReference = getVerseReferenceForDay();
            const data = await fetchReference(verseReference);
            setVerseOfDayData(data);
        } catch (err) {
            console.error("Failed to fetch Verse of the Day", err);
        } finally {
            setVerseOfDayLoading(false);
        }
    };

    fetchVerseOfDay();
  }, []);


  const addHighlight = useCallback((text: string, category: HighlightCategory) => {
    if (!currentChapterData) return;
    const newHighlight: Highlight = {
      id: `${currentChapterData.reference}-${text}-${Date.now()}`,
      reference: currentChapterData.reference,
      text,
      categoryName: category.name,
    };
    setHighlights(prev => [...prev, newHighlight]);
    setSaveStatus('Grifo salvo!');
    setTimeout(() => setSaveStatus(''), 2000);
  }, [currentChapterData]);

  const deleteHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header onShowHighlights={() => setIsModalOpen(true)} highlightCount={highlights.length} onGoHome={handleGoHome} />
        
        <main className="mt-8">
          <SearchForm onSearch={loadReferenceInViewer} loading={chapterLoading} />
          
           {view === 'home' && (
            <div className="mt-8">
              <PsalmOfDay data={verseOfDayData} loading={verseOfDayLoading} />
              <BibleBrowser onSelectChapter={(book, chapter) => loadReferenceInViewer(`${book} ${chapter}`)} />
            </div>
           )}

           {view === 'viewer' && (
             <div className="mt-8 min-h-[400px] bg-gray-800/50 rounded-lg p-6 shadow-xl relative transition-all duration-300">
               <button onClick={handleGoHome} className="absolute top-4 left-6 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 z-10">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                 </svg>
                 Voltar
               </button>
               {chapterLoading && <LoadingSpinner />}
               {error && !chapterLoading && (
                   <div className="text-center text-red-400 flex flex-col items-center justify-center h-full pt-12">
                       <p className="text-lg">{error}</p>
                   </div>
               )}
               {!chapterLoading && !error && currentChapterData && (
                 <>
                    {viewerSubView === 'reading' && (
                        <BibleViewer 
                            chapter={currentChapterData}
                            highlights={highlights.filter(h => 
                                currentChapterData.reference.startsWith(h.reference.split(':')[0]) || h.reference.startsWith(currentChapterData.reference)
                            )} 
                            onAddHighlight={addHighlight}
                            saveStatus={saveStatus}
                            onTitleClick={() => setViewerSubView('verse_selection')}
                            scrollToVerse={scrollToVerse}
                        />
                    )}
                    {viewerSubView === 'verse_selection' && (
                        <VerseSelector
                            chapter={currentChapterData}
                            onSelectVerse={handleSelectVerse}
                            onBack={() => setViewerSubView('reading')}
                        />
                    )}
                 </>
               )}
             </div>
           )}
        </main>
      </div>

      <SavedHighlightsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlights={highlights}
        categories={HIGHLIGHT_CATEGORIES}
        onDelete={deleteHighlight}
        onGoToVerse={handleGoToVerse}
      />
    </div>
  );
};

export default App;