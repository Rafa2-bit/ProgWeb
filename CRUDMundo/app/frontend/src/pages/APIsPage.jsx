import { useState, useEffect } from "react";
import { cidadesApi, paisesApi } from "../data/api";
import { WEATHER_MOCK, COUNTRIES_API } from "../data/initialData";
import { Loading, ErrorState } from "../components/UI";

export default function APIsPage() {
  const [tab, setTab]       = useState("weather");
  const [cidades, setCidades] = useState([]);
  const [paises, setPaises]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  async function load() {
    try {
      setLoading(true); setError(null);
      const [cidadesRes, paisesData] = await Promise.all([
        cidadesApi.listar({ limit: 100 }),
        paisesApi.listar(),
      ]);
      setCidades(cidadesRes.data ?? cidadesRes);
      setPaises(paisesData);
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
        <i className="ti ti-home"></i><i className="ti ti-chevron-right"></i><span>APIs Externas</span>
      </div>

      <div className="tab-bar">
        <div className={`tab${tab === "weather" ? " active" : ""}`} onClick={() => setTab("weather")}>
          <i className="ti ti-cloud"></i> OpenWeatherMap
        </div>
        <div className={`tab${tab === "countries" ? " active" : ""}`} onClick={() => setTab("countries")}>
          <i className="ti ti-world"></i> REST Countries
        </div>
      </div>

      {tab === "weather" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {cidades.map((c) => {
            const w = WEATHER_MOCK[c.nome];
            if (!w) return null;
            const api = COUNTRIES_API[c.pais?.nome] || {};
            return (
              <div key={c.id} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{c.nome}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", display: "flex", gap: 6, marginTop: 2 }}>
                      <span>{api.flag || "🌍"}</span>{c.pais?.nome}
                    </div>
                  </div>
                  <span style={{ fontSize: 28 }}>{w.icon === "sun" ? "☀️" : "🌧️"}</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{w.temp}°C</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>{w.desc}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="chip">💧 {w.humidity}%</span>
                  <span className="chip">💨 {w.wind} km/h</span>
                </div>
              </div>
            );
          })}
          {cidades.filter(c => WEATHER_MOCK[c.nome]).length === 0 && (
            <div style={{ color: "var(--text3)", fontSize: 13, gridColumn: "1/-1", padding: 24 }}>
              Nenhuma cidade com dados de clima disponível.
            </div>
          )}
        </div>
      )}

      {tab === "countries" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {paises.map((p) => {
            const d = COUNTRIES_API[p.nome];
            if (!d) return null;
            return (
              <div key={p.id} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{d.flag}</div>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 15, marginBottom: 8 }}>{p.nome}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[["Capital", d.capital], ["Região", d.region], ["Área", d.area], ["Idioma", p.idioma], ["Moeda", p.moeda]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--text3)" }}>{k}</span>
                      <span style={{ color: "var(--text2)", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
