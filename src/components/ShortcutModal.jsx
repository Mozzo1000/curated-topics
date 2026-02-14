import { X, Keyboard } from 'lucide-preact';

const SHORTCUTS = [
  { key: 'J', action: 'Previous Card', description: 'Move focus to the next previous link.' },
  { key: 'K', action: 'Next Card', description: 'Move focus to the next link.' },
  { key: 'Enter', action: 'Open Link', description: 'Open the currently focused link in a new tab.' },
  { key: 'CTRL+P', action: 'Search', description: 'Instantly focus the search bar to find links.' },
  { key: 'Esc', action: 'Reset', description: 'Clear card focus and close any open menus.' },
];

export function ShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Sheet */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <Keyboard size={20} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="text-lg font-bold tracking-tight uppercase">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Key</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Action</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {SHORTCUTS.map((s) => (
                <tr key={s.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <kbd className="inline-flex items-center justify-center min-w-6 px-1.5 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-[10px] font-mono font-bold shadow-sm">
                      {s.key}
                    </kbd>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-900 dark:text-zinc-100">{s.action}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 text-center border-t border-gray-100 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-400 font-medium">PRESS <span className="font-bold text-zinc-600 dark:text-zinc-300">ESC</span> TO CLOSE</p>
        </div>
      </div>
    </div>
  );
}