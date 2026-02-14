function SearchBar({value, inputRef, onChange}) {
  return (
    <>
     <input 
        ref={inputRef}
        type="text" 
        placeholder="Search links..." 
        value={value}
        onInput={(e) => onChange(e.target.value)}
        className="w-full px-4.5 py-3.5 rounded-[14px] border border-solid 
         text-[1.05rem] outline-none box-border transition-colors
         bg-white text-gray-900 border-gray-200 
         dark:bg-[#1a1a1a] dark:text-gray-100 dark:border-gray-800"
    />
    {!value ? (
        <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.25 py-1.25 rounded-md 
            text-[0.75rem] font-medium pointer-events-none select-none
            bg-gray-100 text-gray-500 border border-gray-200
            dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
        {"CTRL + P"}
      </kbd>
    ) : (
        <button onClick={() => onChange('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors border-none cursor-pointer">✕</button>
    )}
    </>
  )
}

export default SearchBar