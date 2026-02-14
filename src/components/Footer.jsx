import { useState, useEffect } from 'preact/hooks';
import { Keyboard } from 'lucide-preact';
import { ShortcutModal } from './ShortcutModal';

function Footer() {
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => { 
      if (e.key === 'Escape') setIsShortcutModalOpen(false); 
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <footer className="w-full mt-auto border-t border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-300 mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright/Credit Section */}
          <div className="flex items-center gap-2 text-sm tracking-tight text-gray-500 dark:text-zinc-500">
            <p className="m-0">
              Created by <span className="font-bold text-gray-900 dark:text-zinc-100"><a className="font-bold text-gray-900 dark:text-zinc-100 hover:text-black dark:hover:text-white underline decoration-gray-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-black dark:hover:decoration-white transition-all duration-200" href="https://andreasbackstrom.se" target="_blank">Andreas Backström</a></span>
            </p>
          </div>

          {/* Links/Actions Section */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsShortcutModalOpen(true)}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-all"
            >
              <Keyboard size={14} className="group-hover:scale-110 transition-transform" />
              <span>Shortcuts</span>
            </button>
          </div>

        </div>
      </footer>

      <ShortcutModal 
        isOpen={isShortcutModalOpen} 
        onClose={() => setIsShortcutModalOpen(false)}
      />
    </>
  );
}

export default Footer;