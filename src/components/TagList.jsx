import { useEffect, useRef, useState } from 'preact/hooks';

function TagList({ collections, index, onClick }) {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(collections.length);

  useEffect(() => {
    function calculateVisible() {
      const container = containerRef.current;
      if (!container) return;

      const buttons = Array.from(container.querySelectorAll('.tag-btn'));
      let totalWidth = 0;
      let count = 0;

      const containerWidth = container.offsetWidth - 80; // reserve space for "More" button

      for (const btn of buttons) {
        const w = btn.offsetWidth + 12; // include gap
        if (totalWidth + w > containerWidth) break;
        totalWidth += w;
        count++;
      }

      setVisibleCount(count-1);
    }

    calculateVisible();
    window.addEventListener('resize', calculateVisible);
    return () => window.removeEventListener('resize', calculateVisible);
  }, [collections]);

  const visible = collections.slice(0, visibleCount);
  const hidden = collections.slice(visibleCount);

  const [open, setOpen] = useState(false);

  return (
    <nav
      ref={containerRef}
      className="flex gap-3 mb-5.5 pb-3 border-b border-gray-200 dark:border-zinc-800 overflow-visible"
    >
      {/* ALL button */}
      <button
        onClick={() => onClick(-1)}
        className={`tag-btn px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all duration-200 border
          ${index === -1 
            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
            : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 dark:text-zinc-500 dark:border-zinc-800 dark:hover:border-zinc-600'
          }`}
      >
        All <span className="ml-1 opacity-50 text-xs">{collections.length}</span>
      </button>

      {/* Visible tags */}
      {visible.map((col, i) => (
        <button
          key={i}
          onClick={() => onClick(i)}
          className={`tag-btn px-4.5 py-2.5 rounded-[22px] whitespace-nowrap transition-all duration-200 text-[0.95rem] cursor-pointer
            ${index === i 
              ? 'bg-black text-white dark:bg-white dark:text-black font-semibold' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
        >
          {col.title}
        </button>
      ))}

      {/* More menu */}
      {hidden.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="px-4.5 py-2.5 rounded-[22px] bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            More ▾
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
              {hidden.map((col, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onClick(i + visibleCount);
                    setOpen(false);
                  }}
                  className="shrink-0 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  {col.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default TagList;
