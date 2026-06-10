const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard", section: "Geral" },
  { id: "continents", label: "Continentes", icon: "ti-map", section: "Cadastros" },
  { id: "countries", label: "Países", icon: "ti-flag", section: "Cadastros" },
  { id: "cities", label: "Cidades", icon: "ti-building", section: "Cadastros" },
  { id: "apis", label: "APIs Externas", icon: "ti-cloud", section: "Integrações" },
];

export default function Sidebar({ page, setPage }) {
  const sections = [...new Set(NAV.map((n) => n.section))];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>
          <i className="ti ti-world" style={{ marginRight: 6 }}></i>GeoMundo
        </h1>
        <span>Sistema Geográfico CRUD</span>
      </div>
      <div className="sidebar-nav">
        {sections.map((s) => (
          <div key={s}>
            <div className="nav-section">{s}</div>
            {NAV.filter((n) => n.section === s).map((n) => (
              <div
                key={n.id}
                className={`nav-item${page === n.id ? " active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <i className={`ti ${n.icon}`}></i>
                {n.label}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <p>Admin</p>
            <span>admin@geomundo.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
