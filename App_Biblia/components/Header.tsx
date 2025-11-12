import React from 'react';
import type { FontSize } from '../types';

interface HeaderProps {
    onShowHighlights: () => void;
    highlightCount: number;
    onGoHome: () => void;
    fontSize: FontSize;
    onIncreaseFontSize: () => void;
    onDecreaseFontSize: () => void;
}

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onShowHighlights, highlightCount, onGoHome, fontSize, onIncreaseFontSize, onDecreaseFontSize }) => {
    return (
        <header className="flex justify-between items-center pb-4 border-b border-gray-700">
            <h1 
                onClick={onGoHome}
                className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-tight cursor-pointer hover:text-cyan-300 transition-colors"
                title="Voltar à página inicial"
            >
                Bíblia de Estudo Interativa
            </h1>

            <div className="flex items-center gap-4 sm:gap-6">
                 <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                    <button 
                        onClick={onDecreaseFontSize} 
                        disabled={fontSize === 'sm'}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                        title="Diminuir fonte"
                    >
                        <span className="text-sm font-bold">A-</span>
                    </button>
                    <span className="font-semibold text-gray-400 text-sm select-none" title="Tamanho da fonte">Aa</span>
                    <button 
                        onClick={onIncreaseFontSize} 
                        disabled={fontSize === 'xl'}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                        title="Aumentar fonte"
                    >
                        <span className="text-lg font-bold">A+</span>
                    </button>
                </div>

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
            </div>
        </header>
    );
}