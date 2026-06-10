import { useState, useEffect, useCallback } from "react";
import { cidadesApi, paisesApi, continentesApi } from "../data/api";
import { WEATHER_MOCK, COUNTRIES_API } from "../data/initialData";
import { Modal, Loading, ErrorState, EmptyState } from "../components/UI";

function fmt(n) { return n?.toLocaleString("pt-BR") || "—"; }

export default function CitiesPage({ setToast }) {
  const [result, setResult]         = useState({ data: [], total: 0, totalPages: 1 });
  const [paises, setPaises]         = useState([]);
  const [continentes, setContinentes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filterPais, setFilterPais] = useState("");
  const [filterCont, setFilterCont] = useState("");
  const [page, setPage]             = useState(1);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({ nome: "", populacao: "", latitude: "", longitude: "", paisId: "" });
  const [saving, setSaving]         = useState(false);
  const [detailCity, setDetailCity] = useState(null);
  const LIMIT = 7;

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [cidadesRes, paisesData, contsData] = await Promise.all([
        cidadesApi.listar({ nome: search, paisId: filterPais, continenteId: filterCont, page, limit: LIMIT }),
        paisesApi.listar({ continenteId: filterCont }),
        continentesApi.listar(),
      ]);
      setResult(cidadesRes);
      setPaises(paisesData);
      setContinentes(contsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterPais, filterCont, page]);

  useEffect(() => { load(); }, [load]);

  function resetPage() { setPage(1); }

  function openAdd()  { setForm({ nome: "", populacao: "", latitude: "", longitude: "", paisId: "" }); setModal("add"); }
  function openEdit(c){ setForm({ id: c.id, nome: c.nome, populacao: String(c.populacao), latitude: String(c.latitude), longitude: String(c.longitude), paisId: String(c.paisId) }); setModal("edit"); }

  async function save() {
    const { nome, populacao, latitude, longitude, paisId } = form;
    if (!nome || !populacao || !latitude || !longitude || !paisId) return setToast("Preencha todos os campos!");
    try {
      setSaving(true);
      const body = { nome, populacao: Number(populacao), latitude: Number(latitude), longitude: Number(longitude), paisId: Number(paisId) };
      if (modal === "add") {
        await cidadesApi.criar(body);
        setToast("Cidade criada!");
      } else {
        await cidadesApi.atualizar(form.id, body);
        setToast("Cidade atualizada!");
      }
      setModal(null); load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm("Remover esta cidade?")) return;
    try {
      await cidadesApi.deletar(id);
      setToast("Cidade removida."); load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    }
  }

  async function openDetail(c) {
    try {
      const full = await cidadesApi.buscar(c.id);
      setDetailCity(full);
    } catch { setDetailCity(c); }
  }

  return (
    <div>
      <div className="breadcrumb">
        <i className="ti ti-home"></i><i className="ti ti-chevron-right"></i><span>Cidades</span>
      </div>

      <div className="filter-bar">
        <div className="search-bar">
          <i className="ti ti-search"></i>
          <input placeholder="Buscar cidade..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} />
        </div>
        <select className="select-filter" value={filterCont} onChange={(e) => { setFilterCont(e.target.value); setFilterPais(""); resetPage(); }}>
          <option value="">Todos continentes</option>
          {continentes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select className="select-filter" value={filterPais} onChange={(e) => { setFilterPais(e.target.value); resetPage(); }}>
          <option value="">Todos países</option>
          {paises.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="ti ti-plus"></i> Nova Cidade
        </button>
      </div>

      <div className="card">
        {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={load} /> : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Cidade</th><th>País</th><th>Continente</th><th>População</th><th>Coordenadas</th><th>Clima</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {result.data.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState icon="ti-building-off" message="Nenhuma cidade encontrada" /></td></tr>
                  ) : result.data.map((c) => {
                    const api = COUNTRIES_API[c.pais?.nome] || {};
                    const w   = WEATHER_MOCK[c.nome];
                    return (
                      <tr key={c.id}>
                        <td>
                          <span style={{ fontWeight: 500, color: "var(--text)", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }} onClick={() => openDetail(c)}>{c.nome}</span>
                        </td>
                        <td><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span>{api.flag || "🌍"}</span>{c.pais?.nome}</div></td>
                        <td><span className="badge badge-purple">{c.pais?.continente?.nome || "—"}</span></td>
                        <td>{fmt(c.populacao)}</td>
                        <td><span className="chip">{c.latitude?.toFixed(2)}, {c.longitude?.toFixed(2)}</span></td>
                        <td>{w ? <span className="badge badge-teal">{w.temp}°C</span> : <span style={{ color: "var(--text3)", fontSize: 12 }}>—</span>}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-icon" onClick={() => openDetail(c)}><i className="ti ti-eye"></i></button>
                            <button className="btn-icon" onClick={() => openEdit(c)}><i className="ti ti-edit"></i></button>
                            <button className="btn-icon" style={{ color: "var(--red)" }} onClick={() => del(c.id)}><i className="ti ti-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{result.total} resultado(s)</span>
              <div className="pagination">
                {Array.from({ length: result.totalPages }).map((_, i) => (
                  <button key={i} className={`page-btn${page === i + 1 ? " active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal criar/editar */}
      {modal && (
        <Modal
          title={modal === "add" ? "Nova Cidade" : "Editar Cidade"}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                <i className={`ti ${saving ? "ti-loader-2" : "ti-check"}`}></i> {saving ? "Salvando..." : "Salvar"}
              </button>
            </>
          }
        >
          <div className="form-row">
            <div className="form-group">
              <label>Nome *</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: São Paulo" />
            </div>
            <div className="form-group">
              <label>País *</label>
              <select value={form.paisId} onChange={(e) => setForm({ ...form, paisId: e.target.value })}>
                <option value="">Selecione...</option>
                {paises.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>População *</label>
            <input type="number" value={form.populacao} onChange={(e) => setForm({ ...form, populacao: e.target.value })} placeholder="12000000" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-23.55" />
            </div>
            <div className="form-group">
              <label>Longitude *</label>
              <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="-46.63" />
            </div>
          </div>
        </Modal>
      )}

      {/* Modal detalhe */}
      {detailCity && (() => {
        const api = COUNTRIES_API[detailCity.pais?.nome] || {};
        const w   = WEATHER_MOCK[detailCity.nome];
        return (
          <Modal title={`Detalhes — ${detailCity.nome}`} onClose={() => setDetailCity(null)}
            footer={<button className="btn" onClick={() => setDetailCity(null)}>Fechar</button>}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "10px 16px", flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>País</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>{api.flag || "🌍"}</span>{detailCity.pais?.nome || "—"}
                </div>
              </div>
              <div style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "10px 16px", flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>Continente</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{detailCity.pais?.continente?.nome || "—"}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[["População", fmt(detailCity.populacao)], ["Latitude", detailCity.latitude?.toFixed(4)], ["Longitude", detailCity.longitude?.toFixed(4)], ["Moeda", detailCity.pais?.moeda || "—"]].map(([k, v]) => (
                <div key={k} style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{v}</div>
                </div>
              ))}
            </div>
            {w && (
              <div style={{ background: "var(--teal-bg)", border: "1px solid var(--teal)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "var(--teal)", marginBottom: 6, fontWeight: 600 }}>☁ CLIMA ATUAL — OpenWeatherMap</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div><div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{w.temp}°C</div><div style={{ fontSize: 12, color: "var(--text2)" }}>{w.desc}</div></div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 2 }}><div>💧 Umidade: {w.humidity}%</div><div>💨 Vento: {w.wind} km/h</div></div>
                </div>
              </div>
            )}
            <div className="map-placeholder" style={{ marginTop: 16 }}>
              <i className="ti ti-map-2"></i>
              <p>Coordenadas: {detailCity.latitude?.toFixed(4)}, {detailCity.longitude?.toFixed(4)}</p>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
