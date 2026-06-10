import { useEffect } from "react";

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="toast">
      <i className="ti ti-circle-check"></i>
      {msg}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────
export function Loading() {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text3)" }}>
      <i className="ti ti-loader-2" style={{ fontSize: 32, display: "block", marginBottom: 12, animation: "spin 1s linear infinite" }}></i>
      <p style={{ fontSize: 13 }}>Carregando...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--red)" }}>
      <i className="ti ti-alert-circle" style={{ fontSize: 32, display: "block", marginBottom: 12 }}></i>
      <p style={{ fontSize: 13, marginBottom: 12 }}>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          <i className="ti ti-refresh"></i> Tentar novamente
        </button>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div className="empty-state">
      <i className={`ti ${icon}`}></i>
      <p>{message}</p>
    </div>
  );
}

export default Toast;
