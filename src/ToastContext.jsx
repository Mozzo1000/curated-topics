import { createContext } from 'preact';
import { useContext, useState, useCallback } from 'preact/hooks';
import { Toast } from './Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast 
        isVisible={toast.visible} 
        message={toast.message} 
        onClose={hideToast} 
      />
    </ToastContext.Provider>
  );
}

// The Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};