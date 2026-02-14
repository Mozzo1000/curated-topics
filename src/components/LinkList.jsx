import LinkCard from './LinkCard';
import { Globe } from "lucide-preact"
import { LinkPreview } from './LinkPreview';

function LinkList({ 
  links, 
  viewMode, 
  currentPage, 
  setCurrentPage, 
  pageSize,
  previewEnabled,
  focusedIndex
}) {
  const totalPages = Math.ceil(links.length / pageSize);
  
  // Calculate which slice of links to show
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLinks = links.slice(startIndex, startIndex + pageSize);
    
  return (
    <div className="flex flex-col">
      {/* 1. The Grid/List Container */}
      <section className={`
        grid ransition-all duration-300
        ${viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
        }
        ${viewMode === 'compact' 
          ? 'flex flex-col border border-gray-200 dark:border-zinc-800 rounded-xl gap-2' 
          : 'flex flex-col gap-6'
        }
      `}>
        {links.length > 0 ? (
          paginatedLinks.map((link, idx) => {
              const cardElement = <LinkCard key={link.id || link.url} link={link} view={viewMode} isFocused={focusedIndex === idx} />
              if (!previewEnabled) {
                  return cardElement;
                }

                return (
                  <LinkPreview 
                    key={link.url}
                    title={link.title}
                    url={link.url}
                    domain={new URL(link.url).hostname.replace('www.', '')}
                  >
                    {cardElement}
                  </LinkPreview>
                )
          })
        ):(
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
              <Globe className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-base font-medium text-foreground">No links found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
        )}
      </section>



      {/* 2. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12 mb-8">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all border border-solid
                       bg-white text-gray-900 border-gray-200 hover:bg-gray-50
                       dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          
          <span className="text-sm font-medium text-gray-500 dark:text-zinc-500 tabular-nums">
            {currentPage} <span className="mx-1">/</span> {totalPages}
          </span>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all border border-solid
                       bg-white text-gray-900 border-gray-200 hover:bg-gray-50
                       dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default LinkList;