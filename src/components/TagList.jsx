function TagList({collections, index, onClick}) {
  return (
    <nav className="flex gap-3 overflow-x-auto mb-5.5 pb-3 border-b border-solid border-gray-200 dark:border-zinc-800 scrollbar-hide">
        <button
          onClick={() => onClick(-1)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all duration-200 border
            ${index === -1 
              ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
              : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 dark:text-zinc-500 dark:border-zinc-800 dark:hover:border-zinc-600'
            }`}>
          All <span className="ml-1 opacity-50 text-xs">{collections.length}</span>
        </button>
        {collections.map((col, i) => (
           <button 
            key={i}
            onClick={() => onClick(i)}
            className={`
                px-4.5 py-2.5 rounded-[22px] whitespace-nowrap transition-all duration-200 text-[0.95rem] border-none cursor-pointer
                ${index === i 
                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }
            `}
            >
            {col.title}
            </button>
        ))}
    </nav>
  )
}

export default TagList