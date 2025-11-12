
import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-gray-800/80 flex justify-center items-center rounded-lg z-10">
        <div className="w-12 h-12 border-4 border-t-transparent border-cyan-500 rounded-full animate-spin"></div>
    </div>
);
