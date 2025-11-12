import React, { useState } from 'react';
import { OLD_TESTAMENT, NEW_TESTAMENT, Book } from '../constants/bibleBooks';

interface BibleBrowserProps {
  onSelectChapter: (book: string, chapter: number) => void;
}

const BibleBrowser: React.FC<BibleBrowserProps> = ({ onSelectChapter }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleChapterClick = (chapter: number) => {
    if (selectedBook) {
      onSelectChapter(selectedBook.name, chapter);
    }
  };

  if (selectedBook) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setSelectedBook(null)} className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                 </svg>
                 Voltar para Livros
            </button>
            <h3 className="text-xl font-bold text-cyan-400">{selectedBook.name}</h3>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapter => (
            <button
              key={chapter}
              onClick={() => handleChapterClick(chapter)}
              className="aspect-square flex items-center justify-center bg-gray-700 rounded-md text-gray-200 hover:bg-cyan-600 hover:text-white font-semibold transition-colors duration-200"
            >
              {chapter}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            Navegar pela Bíblia
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Antigo Testamento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OLD_TESTAMENT.map(book => (
                        <button key={book.name} onClick={() => handleBookClick(book)} className="text-left p-2 rounded-md hover:bg-gray-700 transition-colors duration-150">
                            {book.name}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Novo Testamento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {NEW_TESTAMENT.map(book => (
                        <button key={book.name} onClick={() => handleBookClick(book)} className="text-left p-2 rounded-md hover:bg-gray-700 transition-colors duration-150">
                            {book.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BibleBrowser;
