import { useState, useEffect, useCallback } from "react";
import { paisesApi, continentesApi } from "../data/api";
import { COUNTRIES_API } from "../data/initialData";
import { Modal, Loading, ErrorState, EmptyState } from "../components/UI";

function fmt(n) { return n?.toLocaleString("pt-BR") || "—"; }

export default function CountriesPage({ setToast }) {
  const [paises, setPaises]         = useState([]);
  const [continentes, setContinentes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filterCont, setFilterCont] = useState("");
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({ nome: "", populacao: "", idioma: "", moeda: "", continenteId: "" });
  const [saving, setSaving]         = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [paisesData, contsData] = await Promise.all([
        paisesApi.listar({ nome: search, continenteId: filterCont }),
        continentesApi.listar(),
      ]);
      setPaises(paisesData);
      setContinentes(contsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterCont]);

  useEffect(() => { load(); }, [load]);

  function openAdd()  { setForm({ nome: "", populacao: "", idioma: "", moeda: "", continenteId: "" }); setModal("add"); }
  function openEdit(p){ setForm({ id: p.id, nome: p.nome, populacao: String(p.populacao), idioma: p.idioma, moeda: p.moeda, continenteId: String(p.continenteId) }); setModal("edit"); }

  async function save() {
    const { nome, populacao, idioma, moeda, continenteId } = form;
    if (!nome || !populacao || !idioma || !moeda || !continenteId) return setToast("Preencha todos os campos!");
    try {
      setSaving(true);
      const body = { nome, populacao: Number(populacao), idioma, moeda, continenteId: Number(continenteId) };
      if (modal === "add") {
        await paisesApi.criar(body);
        setToast("País criado!");
      } else {
        await paisesApi.atualizar(form.id, body);
        setToast("País atualizado!");
      }
      setModal(null); load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm("Tem certeza? Isso removerá todas as cidades vinculadas.")) return;
    try {
      await paisesApi.deletar(id);
      setToast("País removido."); load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    }
  }

  return (
    <div>
      <div className="breadcrumb">
        <i className="ti ti-home"></i><i className="ti ti-chevron-right"></i><span>Países</span>
      </div>

      <div className="filter-bar">
        <div className="search-bar">
          <i className="ti ti-search"></i>
          <input placeholder="Buscar país..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select-filter" value={filterCont} onChange={(e) => setFilterCont(e.target.value)}>
          <option value="">Todos os continentes</option>
          {continentes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="ti ti-plus"></i> Novo País
        </button>
      </div>

      <div className="card">
        {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={load} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>País</th><th>Continente</th><th>População</th><th>Idioma</th><th>Moeda</th><th>Capital (API)</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {paises.length === 0 ? (
                  <tr><td colSpan={7}><EmptyState icon="ti-flag-off" message="Nenhum país encontrado" /></td></tr>
                ) : paises.map((p) => {
                  const api = COUNTRIES_API[p.nome] || {};
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 18 }}>{api.flag || "🌍"}</span>
                          <span style={{ fontWeight: 500, color: "var(--text)" }}>{p.nome}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-blue">{p.continente?.nome || "—"}</span></td>
                      <td>{fmt(p.populacao)}</td>
                      <td>{p.idioma}</td>
                      <td><span className="chip">{p.moeda}</span></td>
                      <td>{api.capital ? <span className="chip">🏛 {api.capital}</span> : <span style={{ color: "var(--text3)", fontSize: 12 }}>—</span>}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn-icon" onClick={() => openEdit(p)}><i className="ti ti-edit"></i></button>
                          <button className="btn-icon" style={{ color: "var(--red)" }} onClick={() => del(p.id)}><i className="ti ti-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Novo País" : "Editar País"}
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
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Brasil" />
            </div>
            <div className="form-group">
              <label>Continente *</label>
              <select value={form.continenteId} onChange={(e) => setForm({ ...form, continenteId: e.target.value })}>
                <option value="">Selecione...</option>
                {continentes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>População *</label>
              <input type="number" value={form.populacao} onChange={(e) => setForm({ ...form, populacao: e.target.value })} placeholder="215000000" />
            </div>
            <div className="form-group">
              <label>Idioma Oficial *</label>
              <input value={form.idioma} onChange={(e) => setForm({ ...form, idioma: e.target.value })} placeholder="Ex: Português" />
            </div>
          </div>
          <div className="form-group">
            <label>Moeda *</label>
            <input value={form.moeda} onChange={(e) => setForm({ ...form, moeda: e.target.value })} placeholder="Ex: BRL" />
          </div>
        </Modal>
      )}
    </div>
  );
}
