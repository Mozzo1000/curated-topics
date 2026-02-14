import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import { Globe, Loader2, ExternalLink } from 'lucide-preact';

export function LinkPreview({ title, url, domain, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [position, setPosition] = useState("above");
  
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const showPreview = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const previewHeight = 320; 
        setPosition(spaceAbove < previewHeight + 40 ? "below" : "above");
      }
      setShouldRender(true);
      setIsVisible(true);
    }, 400); 
  }, []);

  const hidePreview = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        setIframeLoaded(false);
      }, 300);
    }, 150); // Buffer for mouse travel
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
    >
      {children}

      {shouldRender && (
        <div
          className={`absolute left-1/2 z-[100] hidden -translate-x-1/2 transition-all duration-300 md:block
            ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"} 
            ${position === "above" ? "bottom-full mb-4" : "top-full mt-4"}`}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsVisible(true);
          }}
          onMouseLeave={hidePreview}
        >
          {/* Use a link wrapper for the whole preview to enable clicking without blocking scroll */}
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-[400px] overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 no-underline cursor-pointer"
          >
            {/* Header Bar */}
            <div className="flex items-center gap-2 border-b px-4 py-2 bg-gray-50/80 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                <Globe className="h-3 w-3 text-gray-400 dark:text-zinc-500" />
                <span className="truncate text-[10px] text-gray-500 dark:text-zinc-400 max-w-[200px]">
                  {url}
                </span>
              </div>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </div>

            {/* Viewport Area */}
            <div className="relative h-[320px] w-full overflow-hidden bg-white dark:bg-zinc-950">
                {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-300 dark:text-zinc-700" />
                    </div>
                )}

                <iframe
                    src={url}
                    title={`Preview of ${title}`}
                    /* Logic: 
                    Container is 400px wide. 
                    If we set iframe width to 800px and scale(0.5), 
                    it looks like a tablet-sized browser.
                    */
                    className="h-[640px] w-[800px] origin-top-left transition-opacity duration-500"
                    style={{ 
                        transform: "scale(0.5)", 
                        opacity: iframeLoaded ? 1 : 0,
                        backgroundColor: 'white' // Prevents transparent iframe flickering
                    }}
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={() => setIframeLoaded(true)}
                />
                </div>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t px-4 py-2 bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800">
              <span className="truncate text-[11px] font-bold text-gray-900 dark:text-zinc-100">
                {domain}
              </span>
              <span className="ml-auto text-[10px] text-zinc-500 font-medium animate-pulse">
                Click to Open Full Site
              </span>
            </div>
          </a>

          <div className={`absolute left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950
            ${position === "above" ? "top-full -mt-1.5 border-r border-b" : "bottom-full -mb-1.5 border-l border-t"}`} 
          />
        </div>
      )}
    </div>
  );
}