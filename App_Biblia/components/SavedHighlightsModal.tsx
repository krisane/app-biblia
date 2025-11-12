import React, { useState } from 'react';
import type { Highlight, HighlightCategory } from '../types';

interface SavedHighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlights: Highlight[];
  categories: HighlightCategory[];
  onDelete: (id: string) => void;
  onGoToVerse: (reference: string) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m9.375 0-9.375 0" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const GoToIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);


const SavedHighlightsModal: React.FC<SavedHighlightsModalProps> = ({ isOpen, onClose, highlights, categories, onDelete, onGoToVerse }) => {
  if (!isOpen) return null;
  const [copyStatus, setCopyStatus] = useState('Copiar Tudo');
  const [deleteStatus, setDeleteStatus] = useState('');

  const groupedHighlights = categories.map(category => ({
    ...category,
    items: highlights.filter(h => h.categoryName === category.name),
  })).filter(group => group.items.length > 0);

  const generateHighlightsText = () => {
    return groupedHighlights.map(group => {
      const itemsText = group.items.map(h => `- "${h.text}" (${h.reference})`).join('\n');
      return `[${group.name}]\n${itemsText}`;
    }).join('\n\n');
  };

  const handleCopyAll = () => {
    if (highlights.length === 0) return;
    const textToCopy = generateHighlightsText();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('Copiado!');
      setTimeout(() => setCopyStatus('Copiar Tudo'), 2000);
    });
  };

  const handleDownload = () => {
    if (highlights.length === 0) return;
    const textToSave = generateHighlightsText();
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-grifos.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteStatus('Grifo apagado.');
    setTimeout(() => setDeleteStatus(''), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-cyan-400">Meus Grifos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            {groupedHighlights.length > 0 ? (
                groupedHighlights.map(group => (
                    <div key={group.name}>
                        <h3 className={`text-lg font-semibold mb-3 px-3 py-1 rounded-md inline-block ${group.colorClass}`}>
                            {group.name}
                        </h3>
                        <ul className="space-y-4">
                            {group.items.map(highlight => (
                                <li key={highlight.id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-gray-300">"{highlight.text}"</p>
                                        <button 
                                            onClick={() => onGoToVerse(highlight.reference)}
                                            className="text-sm font-semibold text-cyan-500 mt-2 hover:text-cyan-300 transition-colors flex items-center gap-1.5 group"
                                            title={`Ir para ${highlight.reference}`}
                                        >
                                            {highlight.reference}
                                            <GoToIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </button>
                                    </div>
                                    <button onClick={() => handleDelete(highlight.id)} className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-center py-10">Você ainda não tem grifos salvos. Selecione um texto para começar!</p>
            )}
        </div>

        {groupedHighlights.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-gray-700 flex justify-end items-center gap-4 relative">
            <div className={`absolute left-6 bottom-4 text-sm text-green-400 transition-opacity duration-300 ${deleteStatus ? 'opacity-100' : 'opacity-0'}`}>
              {deleteStatus}
            </div>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-200 shadow-md text-sm"
            >
              <CopyIcon className="w-4 h-4" />
              <span>{copyStatus}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-200 shadow-md text-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Salvar em Arquivo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedHighlightsModal;