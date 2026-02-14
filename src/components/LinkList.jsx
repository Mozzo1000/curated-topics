import LinkCard from './LinkCard';

function LinkList({ 
  links, 
  viewMode, 
  currentPage, 
  setCurrentPage, 
  pageSize 
}) {
  const totalPages = Math.ceil(links.length / pageSize);
  
  // Calculate which slice of links to show
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLinks = links.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col">
      {/* 1. The Grid/List Container */}
      <section className={`
        grid gap-6 transition-all duration-300
        ${viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
        }
      `}>
        {paginatedLinks.map((link) => (
          <LinkCard 
            key={link.id || link.url} 
            link={link} 
            view={viewMode} 
          />
        ))}
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