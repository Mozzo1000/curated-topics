import React from 'react';
import { Share2 } from 'lucide-preact';

function LinkCard({ link, view }) {
  const domain = new URL(link.url).hostname.replace('www.', '');

  const handleShare = (e) => {
    e.preventDefault(); // Prevent opening the link when clicking share
    if (navigator.share) {
      navigator.share({
        title: link.title,
        text: link.description,
        url: link.url,
      });
    } else {
      // Fallback for browsers that don't support native share
      link.url && navigator.clipboard.writeText(link.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className={`
        group relative transition-all duration-300
        bg-white border border-gray-100 shadow-sm
        dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none
        hover:border-black dark:hover:border-white hover:shadow-md
        ${view === 'grid' 
          ? 'p-0 rounded-2xl flex flex-col h-full overflow-hidden' 
          : 'p-4 rounded-xl flex items-center gap-4 mb-3'
        }
      `}>
      {/* 1. THE IMAGE SECTION */}
      <div className={`
        shrink-0 bg-gray-100 dark:bg-zinc-800 overflow-hidden
        ${view === 'grid' ? 'w-full h-48' : 'w-16 h-16 rounded-lg'}
      `}>
        {link.image ? (
          <img 
            src={link.image} 
            alt={link.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-tighter opacity-50">No Preview</span>
          </div>
        )}
      </div>

      {/* 2. CONTENT SECTION */}
      <div className={`flex-1 flex flex-col ${view === 'grid' ? 'p-5' : 'min-w-0'}`}>
        <div className="flex items-start justify-between gap-3">
          <a href={link.url} target="_blank" rel="noopener" className="flex-1 no-underline group/title">
            <h3 className="text-wrap font-bold text-gray-900 dark:text-zinc-100 truncate text-[1.05rem] leading-snug group-hover/title:underline">
              {link.title}
            </h3>
          </a>
          
          {/* SHARE BUTTON */}
          <button 
            onClick={handleShare}
            className="p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            title="Share Link"
          >
            <Share2 size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed flex-1">
          {link.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-600">
            {domain}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LinkCard;