export const ToggleRow = ({ label, isActive, onToggle, isDark }) => {
  // 1. Logic for dynamic colors based on Dark Mode and Active state
  const colors = {
    track: isActive ? '#2ecc71' : (isDark ? '#333' : '#e0e0e0'),
    thumb: '#fff',
    text: isDark ? '#eee' : '#1a1a1a'
  };

  // 2. Component-specific styles defined right here
  const localStyles = {
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease'
    },
    track: {
      width: '50px',
      height: '26px',
      borderRadius: '13px',
      backgroundColor: colors.track,
      position: 'relative',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2px'
    },
    thumb: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: colors.thumb,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isActive ? 'translateX(24px)' : 'translateX(0px)',
    }
  };

  return (
    <div style={localStyles.row} onClick={onToggle}>
      <span style={{ fontWeight: '600', color: colors.text }}>{label}</span>
      <div style={localStyles.track}>
        <div style={localStyles.thumb} />
      </div>
    </div>
  );
};