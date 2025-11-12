import React from 'react';

interface HeaderProps {
    onShowHighlights: () => void;
    highlightCount: number;
    onGoHome: () => void;
}

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onShowHighlights, highlightCount, onGoHome }) => {
    return (
        <header className="flex justify-between items-center pb-4 border-b border-gray-700">
            <h1 
                onClick={onGoHome}
                className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-tight cursor-pointer hover:text-cyan-300 transition-colors"
                title="Voltar à página inicial"
            >
                Bíblia de Estudo Interativa
            </h1>
            <button
                onClick={onShowHighlights}
                className="relative flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-200 shadow-md"
            >
                <BookmarkIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Grifos</span>
                {highlightCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {highlightCount}
                    </span>
                )}
            </button>
        </header>
    );
}