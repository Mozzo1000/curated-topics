import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-preact';

export function Toast({ message, isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-full fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl min-w-[280px]">
        <div className="text-green-500">
          <CheckCircle2 size={20} />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-900 dark:text-zinc-100">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-gray-400"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}