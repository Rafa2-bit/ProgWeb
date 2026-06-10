const BASE = "http://localhost:3333/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na requisição");
  return data;
}

// ── Continentes ──────────────────────────────────────────────
export const continentesApi = {
  listar: (nome = "") =>
    request(`/continentes${nome ? `?nome=${encodeURIComponent(nome)}` : ""}`),
  buscar: (id) => request(`/continentes/${id}`),
  criar: (body) => request("/continentes", { method: "POST", body: JSON.stringify(body) }),
  atualizar: (id, body) => request(`/continentes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletar: (id) => request(`/continentes/${id}`, { method: "DELETE" }),
};

// ── Países ───────────────────────────────────────────────────
export const paisesApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined))
    ).toString();
    return request(`/paises${qs ? `?${qs}` : ""}`);
  },
  buscar: (id) => request(`/paises/${id}`),
  criar: (body) => request("/paises", { method: "POST", body: JSON.stringify(body) }),
  atualizar: (id, body) => request(`/paises/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletar: (id) => request(`/paises/${id}`, { method: "DELETE" }),
};

// ── Cidades ──────────────────────────────────────────────────
export const cidadesApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined))
    ).toString();
    return request(`/cidades${qs ? `?${qs}` : ""}`);
  },
  buscar: (id) => request(`/cidades/${id}`),
  criar: (body) => request("/cidades", { method: "POST", body: JSON.stringify(body) }),
  atualizar: (id, body) => request(`/cidades/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletar: (id) => request(`/cidades/${id}`, { method: "DELETE" }),
};
