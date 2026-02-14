import { ChevronDown } from 'lucide-preact';

function FilterBar({ 
  resultCount, 
  selectedDomain, 
  setSelectedDomain, 
  uniqueDomains, 
  sortOrder, 
  setSortOrder 
}) {
  // Shared classes for the select elements
  const selectClasses = `
    w-full sm:w-auto appearance-none pl-4 pr-10 py-2 rounded-xl border border-solid 
    cursor-pointer text-sm transition-all outline-none
    bg-white border-gray-200 text-gray-900 
    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100
    focus:ring-2 focus:ring-black dark:focus:ring-white
  `;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Result Count */}
      <p className="text-sm font-medium text-gray-500 dark:text-zinc-500">
        {resultCount} results
      </p>

      {/* Controls Group */}
      <div className="flex items-center gap-3">
        
        {/* Domain Filter */}
        <div className="relative flex-1 sm:flex-none">
          <select 
            value={selectedDomain} 
            onChange={(e) => setSelectedDomain(e.target.value)}
            className={selectClasses}
          >
            {uniqueDomains.map(domain => (
              <option key={domain} value={domain}>
                {domain === 'all' ? 'All Domains' : domain}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-zinc-600">
            <ChevronDown size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Sort Order */}
        <div className="relative flex-1 sm:flex-none">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className={selectClasses}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-zinc-600">
            <ChevronDown size={16} strokeWidth={2.5} />
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default FilterBar;