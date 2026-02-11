import { h } from 'preact';

export function Drawer({ isOpen, onClose, isDark, children }) {
  const theme = isDark ? darkStyles : lightStyles;

  return (
    <div style={{
      ...styles.overlay,
      visibility: isOpen ? 'visible' : 'hidden',
      opacity: isOpen ? 1 : 0,
    }}>
      {/* Clickable Backdrop to close */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Sliding Panel */}
      <div style={{
        ...styles.panel,
        backgroundColor: theme.bg,
        color: theme.text,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div style={{...styles.header, borderBottom: `1px solid ${theme.border}`}}>
          <h2 style={{margin: 0, fontSize: '1.5rem'}}>Settings</h2>
          <button onClick={onClose} style={{...styles.closeBtn, color: theme.text}}>✕</button>
        </div>

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Internal Styles for the Drawer
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    transition: 'all 0.3s ease-in-out',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    position: 'absolute',
    right: 0,
    width: 'min(400px, 80vw)',
    height: '100%',
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '8px',
  },
  content: {
    padding: '24px',
    flex: 1,
    overflowY: 'auto',
  }
};

const lightStyles = { bg: '#fff', text: '#000', border: '#eee' };
const darkStyles = { bg: '#121212', text: '#fff', border: '#333' };