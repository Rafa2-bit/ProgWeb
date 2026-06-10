import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (user === "admin" && pass === "123") {
      onLogin();
    } else {
      setErr("Usuário ou senha incorretos.");
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <i className="ti ti-world"></i>
          </div>
          <h2>GeoMundo</h2>
          <p>Sistema de Gestão Geográfica</p>
        </div>
        <div className="form-group">
          <label>Usuário</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="admin"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {err && <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{err}</p>}
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={submit}
        >
          <i className="ti ti-login"></i> Entrar
        </button>
        <p style={{ fontSize: 11.5, color: "var(--text3)", textAlign: "center", marginTop: 14 }}>
          Use <b style={{ color: "var(--text2)" }}>admin</b> /{" "}
          <b style={{ color: "var(--text2)" }}>123</b> para entrar
        </p>
      </div>
    </div>
  );
}
