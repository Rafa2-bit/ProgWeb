import { useState, useEffect } from "react";
import { continentesApi, paisesApi, cidadesApi } from "../data/api";
import { WEATHER_MOCK, COUNTRIES_API } from "../data/initialData";
import { Loading, ErrorState } from "../components/UI";

function fmt(n) { return n?.toLocaleString("pt-BR") || "—"; }

export default function Dashboard({ setPage }) {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  async function load() {
    try {
      setLoading(true); setError(null);
      const [conts, paises, cidadesRes] = await Promise.all([
        continentesApi.listar(),
        paisesApi.listar(),
        cidadesApi.listar({ limit: 100 }),
      ]);
      const cidades = cidadesRes.data ?? cidadesRes;
      setStats({
        continentes: conts.length,
        paises: paises.length,
        cidades: cidadesRes.total ?? cidades.length,
        populacao: cidades.reduce((a, c) => a + c.populacao, 0),
      });
      setRecent(cidades.slice(0, 5));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;
  if (error)   return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="breadcrumb">
        <i className="ti ti-home"></i>
        <i className="ti ti-chevron-right"></i>
        <span>Dashboard</span>
      </div>

      <div className="stats-grid">
        {[
          { label: "Continentes", value: stats.continentes, sub: "regiões cadastradas",  icon: "ti-map",      color: "var(--accent)",  page: "continents" },
          { label: "Países",      value: stats.paises,      sub: "países cadastrados",   icon: "ti-flag",     color: "var(--green)",   page: "countries"  },
          { label: "Cidades",     value: stats.cidades,     sub: "cidades cadastradas",  icon: "ti-building", color: "var(--yellow)",  page: "cities"     },
          { label: "Pop. Total",  value: `${(stats.populacao / 1e6).toFixed(0)}M`, sub: "habitantes (cidades)", icon: "ti-users", color: "var(--purple)", page: null },
        ].map(({ label, value, sub, icon, color, page: pg }) => (
          <div key={label} className="stat-card" style={{ cursor: pg ? "pointer" : "default" }} onClick={() => pg && setPage(pg)}>
            <div className="stat-label"><i className={`ti ${icon}`} style={{ color }}></i> {label}</div>
            <div className="stat-value" style={label === "Pop. Total" ? { fontSize: 18 } : {}}>{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div className="api-grid">
        <div className="api-card">
          <div className="api-card-header">
            <div className="api-icon" style={{ background: "var(--teal-bg)" }}>
              <i className="ti ti-cloud" style={{ color: "var(--teal)" }}></i>
            </div>
            <div><h3>OpenWeatherMap</h3><div className="api-sub">Clima em tempo real</div></div>
          </div>
          {Object.entries(WEATHER_MOCK).slice(0, 3).map(([cidade, w]) => (
            <div key={cidade} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>{cidade}</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{w.icon === "sun" ? "☀️" : "🌧️"}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{w.temp}°C</span>
                <span className="badge badge-teal">{w.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="api-card">
          <div className="api-card-header">
            <div className="api-icon" style={{ background: "var(--accent-light)" }}>
              <i className="ti ti-world" style={{ color: "var(--accent)" }}></i>
            </div>
            <div><h3>REST Countries</h3><div className="api-sub">Dados de países</div></div>
          </div>
          {Object.entries(COUNTRIES_API).slice(0, 4).map(([nome, d]) => (
            <div key={nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{d.flag}</span>
                <span style={{ fontSize: 13, color: "var(--text2)" }}>{nome}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span className="chip">{d.capital}</span>
                <span className="chip">{d.area}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Cidades recentes</span>
          <span className="badge badge-blue">{stats.cidades} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Cidade</th><th>País</th><th>Continente</th><th>População</th><th>Coordenadas</th></tr></thead>
            <tbody>
              {recent.map((c) => {
                const apiPais = COUNTRIES_API[c.pais?.nome] || {};
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500, color: "var(--text)" }}>{c.nome}</td>
                    <td><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span>{apiPais.flag || "🌍"}</span>{c.pais?.nome}</div></td>
                    <td><span className="badge badge-purple">{c.pais?.continente?.nome}</span></td>
                    <td>{fmt(c.populacao)}</td>
                    <td><span className="chip">{c.latitude?.toFixed(2)}, {c.longitude?.toFixed(2)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
