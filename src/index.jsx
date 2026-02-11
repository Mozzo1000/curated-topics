import { hydrate, prerender as ssr } from 'preact-iso';
import { h, Fragment } from 'preact';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import { Drawer } from './Drawer';
import { ToggleRow } from './ToggleRow';

const collectionFiles = import.meta.glob('/src/content/collections/*.json');

export default function App() {
  // --- STATE ---
  const [collections, setCollections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copyId, setCopyId] = useState(null); // For "Copied!" feedback
  const [selectedDomain, setSelectedDomain] = useState('all'); // New Domain State
  const searchInputRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDark, setIsDark] = useState();
  
  const [isGrid, setIsGrid] = useState();

  const PAGE_SIZE = isGrid ? 6 : 5; // Grid looks better with multiples of 3

  useEffect(() => { setIsDark(localStorage.getItem("vault-theme") === "dark"); }, []);
  useEffect(() => { setIsGrid(localStorage.getItem("vault-layout") === "grid"); }, []);

  useEffect(() => {
    localStorage.setItem('vault-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('vault-layout', isGrid ? 'grid' : 'list');
  }, [isGrid]);

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = async () => {
      const loaded = [];
      for (const path in collectionFiles) {
        const module = await collectionFiles[path]();
        loaded.push(module.default);
      }
      setCollections(loaded);
      setLoading(false);
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
const allLinks = currentCollection?.links || [];

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

  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedLinks.slice(start, start + PAGE_SIZE);
  }, [sortedLinks, currentPage, PAGE_SIZE]);

  const handleShare = (e, url, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  if (loading) return <div style={{...styles.center, color: isDark ? '#fff' : '#000'}}>Loading...</div>;

  // --- THEME ---
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div style={{...styles.wrapper, backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: 'all 0.3s ease'}}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <h1>Links</h1>
          
          <button onClick={() => setIsDrawerOpen(true)} style={{...styles.iconBtn, backgroundColor: theme.tabBg, color: theme.text}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
          </button>
        </header>

        {/* Tabs */}
        <nav style={{...styles.nav, borderBottomColor: theme.border}}>
          {collections.map((col, i) => (
            <button 
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                ...styles.tab, 
                backgroundColor: activeIndex === i ? theme.activeTab : theme.tabBg,
                color: activeIndex === i ? '#fff' : theme.text
              }}
            >
              {col.title}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div style={styles.searchContainer}>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search links..." 
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            style={{...styles.searchInput, backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border}}
          />
          {!searchQuery ? (
            <div style={{...styles.shortcutBadge, backgroundColor: theme.tabBg}}>Ctrl + P</div>
          ) : (
            <button onClick={() => setSearchQuery('')} style={{...styles.clearBtn, backgroundColor: theme.border, color: theme.text}}>✕</button>
          )}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <p style={{color: theme.muted}}>{sortedLinks.length} results</p>
          <div style={styles.selectWrapper}>
              <select 
                value={selectedDomain} 
                onChange={(e) => setSelectedDomain(e.target.value)}
                style={{...styles.select, backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border}}
              >
                {uniqueDomains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
              <div style={{...styles.selectIcon, borderLeftColor: theme.muted, borderBottomColor: theme.muted}} />
              
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)} 
              style={{...styles.select, backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border}}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <div style={{...styles.selectIcon, borderLeftColor: theme.muted, borderBottomColor: theme.muted}} />
          </div>
        </div>

        {/* Dynamic Grid/List Logic */}
        <section style={isGrid ? styles.gridLayout : styles.listLayout}>
          {paginatedLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener" 
               style={{...styles.card, flexDirection: isGrid ? 'column' : 'row', backgroundColor: theme.cardBg, borderColor: theme.border}}>
              <img src={link.image || 'https://via.placeholder.com/60'} 
                   style={{...styles.img, width: isGrid ? '100%' : '100px', height: isGrid ? '160px' : '100px'}} alt="" />
              <div style={styles.cardBody}>
                <div style={styles.cardHeader}>
                  <strong style={{...styles.linkTitle, color: theme.text}}>{link.title}</strong>
                  <button onClick={(e) => handleShare(e, link.url, i)} style={{...styles.shareBtn, color: copyId === i ? '#2ecc71' : theme.muted}}>
                    {copyId === i ? '✓ Copied' : '🔗 Share'}
                  </button>
                </div>
                {!isGrid && <p style={{...styles.desc, color: theme.muted}}>{link.description}</p>}
                <span style={{...styles.date, color: theme.muted}}>{link.date}</span>
              </div>
            </a>
          ))}
        </section>

        {/* Pagination */}
        {Math.ceil(sortedLinks.length / PAGE_SIZE) > 1 && (
          <div style={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} 
                    style={{...styles.pageBtn, backgroundColor: theme.tabBg, color: theme.text}}>Prev</button>
            <span style={{color: theme.muted}}>{currentPage} / {Math.ceil(sortedLinks.length / PAGE_SIZE)}</span>
            <button disabled={currentPage === Math.ceil(sortedLinks.length / PAGE_SIZE)} onClick={() => setCurrentPage(p => p + 1)} 
                    style={{...styles.pageBtn, backgroundColor: theme.tabBg, color: theme.text}}>Next</button>
          </div>
        )}
      </div>

        <footer style={{
          ...styles.footer, 
          borderTop: `1px solid ${theme.border}`,
          color: theme.muted 
        }}>
          <p>
            Created by <a href="https://andreasbackstrom.se" 
                          target="_blank" 
                          rel="noopener" 
                          style={{ color: theme.text, fontWeight: 'bold', textDecoration: 'none' }}>
              Andreas Backström
            </a>
          </p>
        </footer>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} isDark={isDark}>
        <ToggleRow 
          label="Dark Mode" 
          isActive={isDark} 
          onToggle={() => setIsDark(!isDark)} 
          isDark={isDark} 
        />
    
        <ToggleRow 
          label="Grid View" 
          isActive={isGrid} 
          onToggle={() => setIsGrid(!isGrid)} 
          isDark={isDark} 
        />

      </Drawer>
    </div>
  );
}

// --- STYLES ---
const lightTheme = { bg: '#fff', text: '#1a1a1a', cardBg: '#fff', border: '#eee', tabBg: '#f0f0f0', activeTab: '#000', muted: '#666' };
const darkTheme = { bg: '#0d0d0d', text: '#eee', cardBg: '#1a1a1a', border: '#333', tabBg: '#333', activeTab: '#444', muted: '#aaa' };

const styles = {
  iconBtn: {width: "3.6em", padding: '8px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer' },

  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '28px' 
  },

  // Larger tap target + slightly bigger text
  themeBtn: { 
    padding: '10px 14px', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontSize: '0.9rem' 
  },

  // Slightly taller tabs + more spacing
  nav: { 
    display: 'flex', 
    gap: '12px', 
    overflowX: 'auto', 
    marginBottom: '22px', 
    borderBottom: '1px solid', 
    paddingBottom: '12px' 
  },

  tab: { 
    padding: '10px 18px', 
    borderRadius: '22px', 
    border: 'none', 
    cursor: 'pointer', 
    whiteSpace: 'nowrap', 
    transition: 'all 0.2s',
    fontSize: '0.95rem'
  },

  searchContainer: { position: 'relative', marginBottom: '22px' },

  // Bigger input + slightly larger font
  searchInput: { 
    width: '100%', 
    padding: '14px 18px', 
    borderRadius: '14px', 
    border: '1px solid', 
    fontSize: '1.05rem', 
    outline: 'none', 
    boxSizing: 'border-box' 
  },

  shortcutBadge: { 
    position: 'absolute', 
    right: '14px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    padding: '5px 9px', 
    borderRadius: '6px', 
    fontSize: '0.75rem', 
    pointerEvents: 'none' 
  },

  clearBtn: { 
    position: 'absolute', 
    right: '14px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    border: 'none', 
    borderRadius: '50%', 
    width: '26px', 
    height: '26px', 
    cursor: 'pointer' 
  },

  toolbar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '18px' 
  },

  selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center', gap: "10px"},
  select: { 
    appearance: 'none', 
    padding: '10px 34px 10px 14px', 
    borderRadius: '10px', 
    border: '1px solid', 
    outline: 'none',
    fontSize: '0.95rem'
  },

  selectIcon: { 
    position: 'absolute', 
    right: '12px', 
    top: '14px', 
    width: '7px', 
    height: '7px', 
    borderLeft: '2px solid', 
    borderBottom: '2px solid', 
    transform: 'rotate(-45deg)' 
  },

  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '14px' 
  },

  // Slightly larger padding + bigger image
  card: { 
    display: 'flex', 
    gap: '16px', 
    padding: '18px', 
    borderRadius: '14px', 
    border: '1px solid', 
    textDecoration: 'none', 
    transition: 'transform 0.2s' 
  },

  img: { 
    width: '70px', 
    height: '70px', 
    borderRadius: '10px', 
    objectFit: 'cover' 
  },

  cardHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '6px' 
  },

  linkTitle: { fontSize: '1.15rem' },
  date: { fontSize: '0.75rem' },
  desc: { fontSize: '0.95rem', margin: 0 },

  pagination: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '22px', 
    marginTop: '34px' 
  },

  pageBtn: { 
    padding: '10px 18px', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  listLayout: { display: 'flex', flexDirection: 'column', gap: '16px' },
  gridLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  shareBtn: { background: 'none', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold', padding: '4px 8px' },
  wrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    transition: 'background-color 0.3s ease' 
  },
  // This is your main content container
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '40px 20px',
    flex: 1, // This tells the container to grow and fill all available space
    width: '100%',
    boxSizing: 'border-box'
  },
  footer: {
    paddingBottom: "15px",
    textAlign: 'center',
    fontSize: '0.9rem',
    width: '100%',
  }
};


if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
