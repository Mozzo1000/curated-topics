import { Share2 } from 'lucide-preact';
import { useToast } from '../ToastContext';
import { useEffect, useRef } from 'preact/hooks';

function LinkCard({ link, view, isFocused}) {
  const domain = new URL(link.url).hostname.replace('www.', '');
  const toast = useToast();
  const cardRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isFocused]);

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
      toast("Link copied to clipboard");
    }
  };

  // --- COMPACT VIEW ---
  if (view === 'compact') {
    return (
      <div
        ref={cardRef}
        className={`group flex items-center gap-4 px-4 py-2 border-b last:border-0 transition-all
          ${isFocused 
            ? 'bg-zinc-100 dark:bg-zinc-800/50 border-l-4 border-l-black dark:border-l-white' 
            : 'border-gray-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/30'}`}
      >
        {/* Small Favicon */}
        <img 
          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
          className="w-4 h-4 rounded-sm grayscale group-hover:grayscale-0 transition-all"
          alt=""
        />
        
        {/* Title */}
        <span className="flex-1 truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
          <a href={link.url} target="_blank" rel="noopener" className="flex-1 no-underline group/title">
            {link.title}
          </a>
        </span>

        {/* Domain - Subtle */}
        <span className="hidden sm:block text-[10px] font-mono text-zinc-400">
          {new URL(link.url).hostname.replace('www.', '')}
        </span>

        {/* Date */}
        <span className="text-[10px] text-zinc-400 tabular-nums">
          {new Date(link.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`
        group relative transition-all duration-300
        bg-white border border-gray-100 shadow-sm
        dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none
        hover:border-black dark:hover:border-white hover:shadow-md
        ${view === 'grid' 
          ? 'p-0 rounded-2xl flex flex-col h-full overflow-hidden' 
          : 'p-4 rounded-xl flex items-center gap-4 mb-3'
        }
        ${isFocused 
          ? 'border-black ring-2 ring-black dark:border-white dark:ring-white scale-[1.02] z-10 shadow-xl' 
          : 'border-gray-200 dark:border-zinc-800'
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