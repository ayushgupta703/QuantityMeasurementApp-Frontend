import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = { success: "✓", error: "✕", info: "ℹ" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRefs = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 380);
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
      timerRefs.current[id] = setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type} ${t.leaving ? "leaving" : ""}`}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <span className="toast-icon">{ICONS[t.type]}</span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => {
                clearTimeout(timerRefs.current[t.id]);
                dismiss(t.id);
              }}
            >
              ×
            </button>
            <div className="toast-bar" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
