import { hydrate, prerender as ssr } from 'preact-iso';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import { SettingsDrawer } from './components/SettingsDrawer';
import SearchBar from './components/SearchBar';
import './style.css'
import { Bookmark, Settings} from 'lucide-preact';
import TagList from './components/TagList';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import LinkList from './components/LinkList';
import { Loader } from './components/Loader';
import { ToastProvider } from './ToastContext';

const collectionFiles = import.meta.glob('/src/content/collections/*.json');

export default function App() {
  // --- STATE ---
  const [collections, setCollections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all'); // New Domain State
  const searchInputRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const [appTheme, setAppTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [viewMode, setViewMode] = useState('grid'); // 'list' | 'grid' | 'compact'
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const PAGE_SIZE = viewMode === "grid" ? 12 : viewMode === "compact" ? 25 : 8; // Grid looks better with multiples of 3

  useEffect(() => { setAppTheme(localStorage.getItem("link-theme") || "system"); }, []);
  useEffect(() => { setViewMode(localStorage.getItem("link-layout") || "list"); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("link-preview");
    if (saved !== null) {
      setPreviewEnabled(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('link-theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    localStorage.setItem('link-layout', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('link-preview', JSON.stringify(previewEnabled));
  }, [previewEnabled]);

  useEffect(() => {
    const root = window.document.documentElement; // Usually the <html> tag
    
    if (appTheme === 'dark') {
      root.classList.add('dark');
    } else if (appTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference logic
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    }
    
    // Save to localStorage so it persists on refresh
    localStorage.setItem('link-theme', appTheme);
  }, [appTheme]);

  // Reset focus when navigation/filtering happens
  useEffect(() => {
    setFocusedIndex(-1);
  }, [activeIndex, searchQuery, selectedDomain, currentPage, sortOrder]);

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = async () => {
      const loaded = [];
      for (const path in collectionFiles) {
        const module = await collectionFiles[path]();
        loaded.push(module.default);
      }
      setCollections(loaded);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Keyboard Shortcut: Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // --- LOGIC ---
  const currentCollection = collections[activeIndex];
  const allLinks = useMemo(() => {
    if (activeIndex === -1) {
      // Flatten all links from all collections into one array
      return collections.flatMap(col => col.links || []);
    }
    return collections[activeIndex]?.links || [];
  }, [collections, activeIndex]);
  
  // 1. Extract Unique Domains for the dropdown
  const uniqueDomains = useMemo(() => {
    const domains = allLinks.map(link => {
      try {
        return new URL(link.url).hostname.replace('www.', '');
      } catch {
        return null;
      }
    }).filter(Boolean);
    return ['all', ...new Set(domains)];
  }, [allLinks]);

  // 2. Multi-stage Filtering: Collection -> Domain -> Search
  const filteredLinks = useMemo(() => {
    let items = allLinks;

    // Filter by Domain
    if (selectedDomain !== 'all') {
      items = items.filter(link => link.url.includes(selectedDomain));
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(l => 
        l.title?.toLowerCase().includes(q) || 
        l.description?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allLinks, selectedDomain, searchQuery]);

  // Reset page when any filter changes
  useEffect(() => setCurrentPage(1), [activeIndex, sortOrder, searchQuery, selectedDomain]);

  // 3. Sorting & Pagination (standard logic using filteredLinks)
  const sortedLinks = useMemo(() => {
    return [...filteredLinks].sort((a, b) => {
      const d1 = new Date(a.date || 0);
      const d2 = new Date(b.date || 0);
      return sortOrder === 'desc' ? d2 - d1 : d1 - d2;
    });
  }, [filteredLinks, sortOrder]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in the search bar
      if (document.activeElement.tagName === 'INPUT') return;

      const itemsOnPage = sortedLinks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
      
      if (e.key === 'k') {
        setFocusedIndex(prev => Math.min(prev + 1, itemsOnPage.length - 1));
      } else if (e.key === 'j') {
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex !== -1) {
        window.open(itemsOnPage[focusedIndex].url, '_blank');
      }
      if (e.key === "Escape") {
        setFocusedIndex(-1)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, sortedLinks, currentPage, PAGE_SIZE]);


  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-zinc-950 dark:text-white transition-all duration-300 ease-in-out">
          <div className="max-w-300 mx-auto px-5 py-10 flex-1 w-full box-border">
          
          <header className="flex justify-between items-center mb-7">
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-6 w-6 text-foreground sm:h-7 sm:w-7" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Links
              </h1>
            </div>
            
            <button onClick={() => setIsDrawerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
              <Settings className="text-gray-600 dark:text-zinc-400" size={22} />
            </button>
          </header>

          {isLoading ? (
            <Loader />
          ): (
            <>
            {/* Tabs */}
            <TagList collections={collections} index={activeIndex} onClick={setActiveIndex} />

            {/* Search */}
            <div className="relative mb-5.5">
              <SearchBar value={searchQuery} inputRef={searchInputRef} onChange={setSearchQuery} />
            </div>

            {/* Toolbar */}
            <FilterBar 
              resultCount={sortedLinks.length}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              uniqueDomains={uniqueDomains}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            <LinkList 
              links={sortedLinks} // Pass the full filtered/sorted array
              viewMode={viewMode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={PAGE_SIZE}
              previewEnabled={previewEnabled}
              focusedIndex={focusedIndex}
            />
            </>
          )}
          </div>

        <Footer />
        <SettingsDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)}
          theme={appTheme}
          setTheme={setAppTheme}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          previewEnabled={previewEnabled}
          onPreviewToggle={setPreviewEnabled}
        />
      </div>
    </ToastProvider>
  );
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
