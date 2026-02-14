export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full animate-in fade-in duration-700">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div className="w-16 h-16 border-4 border-gray-100 dark:border-zinc-800 border-t-black dark:border-t-white rounded-full animate-spin"></div>
        
        {/* Inner Pulsing Logo/Icon Placeholder */}
        <div className="absolute w-8 h-8 bg-black dark:bg-white rounded-lg animate-pulse opacity-20"></div>
      </div>
      
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 animate-pulse">
        Loading links
      </p>
    </div>
  );
}