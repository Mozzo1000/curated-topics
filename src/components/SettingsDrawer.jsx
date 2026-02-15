import { useEffect } from 'preact/hooks';
import { Sun, Moon, Monitor, LayoutGrid, LayoutList, X, Rows4 } from 'lucide-preact';

export function SettingsDrawer({ 
  isOpen, 
  onClose, 
  theme,
  setTheme, 
  viewMode, 
  onViewModeChange,
  previewEnabled,
  onPreviewToggle
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="hidden sm:block absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Sheet Content */}
      <div className="relative w-full sm:w-80 h-full bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Settings</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8">
          Customize your viewing experience
        </p>

        <div className="flex flex-col gap-8">
          
          {/* Theme Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <ThemeButton 
                active={theme === 'light'} 
                onClick={() => setTheme('light')} 
                icon={<Sun size={18} />} 
                label="Light"
              />
              <ThemeButton 
                active={theme === 'dark'} 
                onClick={() => setTheme('dark')} 
                icon={<Moon size={18} />} 
                label="Dark" 
              />
              <ThemeButton 
                active={theme === 'system'} 
                onClick={() => setTheme('system')} 
                icon={<Monitor size={18} />} 
                label="System" 
              />
            </div>
          </div>

          <hr className="border-gray-100 dark:border-zinc-700" />

          {/* Layout Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">Layout</label>
            <div className="grid grid-cols-2 gap-2">
              <LayoutButton 
                active={viewMode === 'list'} 
                onClick={() => onViewModeChange('list')} 
                icon={<LayoutList size={18} />} 
                label="List" 
              />
              <LayoutButton 
                active={viewMode === 'grid'} 
                onClick={() => onViewModeChange('grid')} 
                icon={<LayoutGrid size={18} />} 
                label="Grid" 
              />
              <LayoutButton 
                active={viewMode === 'compact'} 
                onClick={() => onViewModeChange('compact')} 
                icon={<Rows4 size={18} />} 
                label="Compact" 
              />
            </div>
          </div>

          <hr className="border-gray-100 dark:border-zinc-700" />
          
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
              Site Preview
            </label>
            <button
              onClick={() => onPreviewToggle(!previewEnabled)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all ${
                previewEnabled 
                  ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black' 
                  : 'border-gray-200 text-gray-500 dark:border-zinc-800 dark:text-zinc-400'
              }`}
            >
              <span className="text-sm font-semibold">
                {previewEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${
                previewEnabled ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-200 dark:bg-zinc-800'
              }`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full transition-all ${
                  previewEnabled 
                    ? 'right-1 bg-white dark:bg-black' 
                    : 'left-1 bg-gray-400 dark:bg-zinc-600'
                }`} />
              </div>
            </button>
            <p className="text-sm text-zinc-500 leading-tight">
              Show a live peek of the website when hovering over cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function ThemeButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border py-3 transition-all ${
        active 
          ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black' 
          : 'border-gray-200 text-gray-500 hover:border-gray-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function LayoutButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-xl border py-3 transition-all ${
        active 
          ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black' 
          : 'border-gray-200 text-gray-500 hover:border-gray-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
      }`}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}