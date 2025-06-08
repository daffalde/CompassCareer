import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Cookies from "js-cookie";
import { useEffect } from "react";

export function Sidebar() {
  const nav = useNavigate();
  const getPath = window.location.pathname.split("/")[2];
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);

  useEffect(() => {
    if (!token && userId?.role !== "admin") {
      nav("/");
    }
  }, []);

  function Signout() {
    Cookies.remove("token");
    Cookies.remove("data");
    window.location.reload();
  }

  return (
    <>
      <div className="dashboard-sidebar">
        <span>
          <img
            className="dashboard-sidebar-logo1"
            src="/logo1.svg"
            alt="logo CompassCareer"
          />
          <img
            className="dashboard-sidebar-logo2"
            src="/logo4.svg"
            alt="logo CompassCareer"
          />
          <div className="dashboard-s-buttnav">
            <button
              onClick={() => nav("/dashboard")}
              className={`button-sidebar ${getPath ? "" : "button-sidebar-on"}`}
            >
              <img src="/home.png" alt="button icon" />
              <p>Dashboard</p>
            </button>
            <button
              onClick={() => nav("/dashboard/pelamar")}
              className={`button-sidebar ${
                getPath === "pelamar" ? "button-sidebar-on" : ""
              }`}
            >
              <img src="/pelamar.png" alt="button icon" />
              <p>Pelamar</p>
            </button>
            <button
              onClick={() => nav("/dashboard/perusahaan")}
              className={`button-sidebar ${
                getPath === "perusahaan" ? "button-sidebar-on" : ""
              }`}
            >
              <img src="/perusahaan.png" alt="button icon" />
              <p>Perusahaan</p>
            </button>
            <button
              onClick={() => nav("/dashboard/lowongan")}
              className={`button-sidebar ${
                getPath === "lowongan" ? "button-sidebar-on" : ""
              }`}
            >
              <img src="/lowongan.png" alt="button icon" />
              <p>Lowongan</p>
            </button>
            <button
              onClick={() => nav("/dashboard/pengaturan")}
              className={`button-sidebar ${
                getPath === "pengaturan" ? "button-sidebar-on" : ""
              }`}
            >
              <img src="/setting.png" alt="button icon" />
              <p>Pengaturan</p>
            </button>
          </div>
        </span>
        <button onClick={Signout} className={`button-sidebar`}>
          <img src="/logout-black.png" alt="logout icon" />
          <p>Sign out</p>
        </button>
      </div>
    </>
  );
}

export function HeaderDashboard({ content, search, setSearch }) {
  return (
    <>
      <div className="dashboard-header">
        <h4>{content}</h4>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Cari...."
        />
        <div className="dashboard-h-profil">
          <p>admin</p>
          <img src="/profil-pelamar.svg" alt="profil pelamar" />
        </div>
      </div>
    </>
  );
}
