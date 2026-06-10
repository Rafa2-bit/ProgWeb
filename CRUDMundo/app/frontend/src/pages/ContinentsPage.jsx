import { useState, useEffect, useCallback } from "react";
import { continentesApi } from "../data/api";
import { Modal, Loading, ErrorState, EmptyState } from "../components/UI";

export default function ContinentsPage({ setToast }) {
  const [continentes, setContinentes] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [modal, setModal]             = useState(null); // null | "add" | "edit"
  const [form, setForm]               = useState({ nome: "", descricao: "" });
  const [saving, setSaving]           = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await continentesApi.listar(search);
      setContinentes(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  function openAdd()  { setForm({ nome: "", descricao: "" }); setModal("add"); }
  function openEdit(c){ setForm({ id: c.id, nome: c.nome, descricao: c.descricao }); setModal("edit"); }

  async function save() {
    if (!form.nome || !form.descricao) return setToast("Preencha todos os campos!");
    try {
      setSaving(true);
      if (modal === "add") {
        await continentesApi.criar({ nome: form.nome, descricao: form.descricao });
        setToast("Continente criado com sucesso!");
      } else {
        await continentesApi.atualizar(form.id, { nome: form.nome, descricao: form.descricao });
        setToast("Continente atualizado!");
      }
      setModal(null);
      load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm("Tem certeza? Isso removerá os países e cidades vinculados.")) return;
    try {
      await continentesApi.deletar(id);
      setToast("Continente removido.");
      load();
    } catch (e) {
      setToast(`Erro: ${e.message}`);
    }
  }

  return (
    <div>
      <div className="breadcrumb">
        <i className="ti ti-home"></i><i className="ti ti-chevron-right"></i><span>Continentes</span>
      </div>

      <div className="section-header">
        <div className="search-bar">
          <i className="ti ti-search"></i>
          <input placeholder="Buscar continente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="ti ti-plus"></i> Novo Continente
        </button>
      </div>

      <div className="card">
        {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={load} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Países</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {continentes.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon="ti-map-off" message="Nenhum continente encontrado" /></td></tr>
                ) : continentes.map((c) => (
                  <tr key={c.id}>
                    <td><span className="chip">#{c.id}</span></td>
                    <td style={{ fontWeight: 500, color: "var(--text)" }}>{c.nome}</td>
                    <td>{c.descricao}</td>
                    <td><span className="badge badge-blue">{c._count?.paises ?? 0} países</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-icon" onClick={() => openEdit(c)}><i className="ti ti-edit"></i></button>
                        <button className="btn-icon" style={{ color: "var(--red)" }} onClick={() => del(c.id)}><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Novo Continente" : "Editar Continente"}
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
          <div className="form-group">
            <label>Nome *</label>
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: América do Sul" />
          </div>
          <div className="form-group">
            <label>Descrição *</label>
            <input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descrição..." />
          </div>
        </Modal>
      )}
    </div>
  );
}
