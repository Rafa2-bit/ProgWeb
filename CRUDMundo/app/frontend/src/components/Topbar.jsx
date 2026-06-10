export default function Topbar({ title, onLogout }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <span style={{ fontSize: 11, color: "var(--text3)", display: "flex", gap: 4, alignItems: "center" }}>
          <span className="dot dot-green"></span>API conectada
        </span>
        <button className="btn-icon" onClick={onLogout} title="Sair">
          <i className="ti ti-logout"></i>
        </button>
      </div>
    </div>
  );
}
