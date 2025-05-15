import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();

  const [ham, setHam] = useState(false);

  const [muncul, setMuncul] = useState(true);
  const [nilai, setNilai] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    function headerScroll() {
      setHam(false);
      setMuncul(false);
      setNilai(window.scrollY);
      const currentY = window.scrollY;
      if (currentY < lastY) {
        setMuncul(true);
      } else {
        setMuncul(false);
      }
    }
    window.addEventListener("scroll", headerScroll);
    return () => removeEventListener("scroll", headerScroll);
  });

  const path = window.location.pathname;
  return (
    <>
      <div className="header-void"></div>
      <div className={`header ${muncul ? "" : "header-off"}`}>
        <img
          draggable={false}
          onClick={() => nav("/")}
          src="/logo1.svg"
          alt="logo"
        />
        <ul className="header-list">
          <div className="h-navigasi">
            <li>
              <NavLink
                to="/lowongan"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Cari Pekerjaan
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/perusahaan"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Perusahaan
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tentang"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Tentang Kami
              </NavLink>
            </li>
          </div>
          <div className="h-action">
            <li>
              <button className="button-main">Masuk</button>
            </li>
          </div>
        </ul>
        <button onClick={() => setHam(!ham)} className="ham-button">
          <img src="./ham.svg" alt="hamburger button" />
        </button>
      </div>
      <div
        onClick={() => setHam(false)}
        onScroll={() => setHam(false)}
        className={`hlm-wrap ${ham ? "hlm-true" : ""}`}
      >
        <div className="header-list-mobile">
          <ul>
            <div className="hlm-navigasi">
              <li className={path == "/lowongan" ? "active-m" : ""}>
                <NavLink to="/lowongan">Cari Pekerjaan</NavLink>
              </li>
              <li className={path == "/perusahaan" ? "active-m" : ""}>
                <NavLink to="/perusahaan">Perusahaan</NavLink>
              </li>
              <li className={path == "/tenatng" ? "active-m" : ""}>
                <NavLink to="/tentang">Tentang Kami</NavLink>
              </li>
            </div>

            <div className="hlm-action">
              <li>
                <button className="button-main">Masuk</button>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
