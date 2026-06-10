import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ContinentsPage from "./pages/ContinentsPage";
import CountriesPage from "./pages/CountriesPage";
import CitiesPage from "./pages/CitiesPage";
import APIsPage from "./pages/APIsPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
//import Toast from "./components/Toast";
import "./styles.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const titles = {
    dashboard:  "Dashboard",
    continents: "Continentes",
    countries:  "Países",
    cities:     "Cidades",
    apis:       "APIs Externas",
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <div className="main">
        <Topbar title={titles[page]} onLogout={() => setLoggedIn(false)} />
        <div className="page">
          {page === "dashboard"  && <Dashboard setPage={setPage} />}
          {page === "continents" && <ContinentsPage setToast={setToast} />}
          {page === "countries"  && <CountriesPage  setToast={setToast} />}
          {page === "cities"     && <CitiesPage      setToast={setToast} />}
          {page === "apis"       && <APIsPage />}
        </div>
      </div>
      {/* {toast && <Toast msg={toast} onDone={() => setToast(null)} />} */}
    </div>
  );
}
