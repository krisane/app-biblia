import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: João 3:16 ou Salmos 23"
        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow duration-200"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !query}
        className="flex items-center justify-center px-4 sm:px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          <SearchIcon className="w-6 h-6 sm:hidden" />
        )}
        <span className="hidden sm:inline">{loading ? 'Buscando...' : 'Buscar'}</span>
      </button>
    </form>
  );
};

export default SearchForm;
