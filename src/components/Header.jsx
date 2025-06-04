import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Header() {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const nav = useNavigate();
  const [ham, setHam] = useState(false);

  // get lebar window
  const [lebar, setLebar] = useState(window.innerWidth);
  useEffect(() => {
    function handleLebar() {
      setLebar(window.innerWidth);
    }

    window.addEventListener("resize", handleLebar);
    return () => removeEventListener("resize", handleLebar);
  });

  // logout
  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("data");
    window.location.reload();
  }

  // fungsi header
  function loginUser() {
    if (token && user) {
      if (user ? user.role === "pelamar" : null) {
        return (
          <>
            <div className="h-action">
              <li>
                <button
                  onClick={() => setHam(true)}
                  style={{
                    backgroundImage: `url("${
                      user.profil ? user.profil : "/profil-pelamar.svg"
                    }")`,
                  }}
                  id="user-profil"
                ></button>
              </li>
            </div>
          </>
        );
      }
      if (user ? user.role === "perusahaan" : null) {
        return (
          <>
            <div className="h-action">
              <li>
                <button onClick={() => nav("/posting")} className="button-main">
                  Posting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setHam(true)}
                  style={{
                    backgroundImage: `url("${
                      user.picture ? user.picture : "/profil-perusahaan.svg"
                    }")`,
                  }}
                  id="user-profil"
                ></button>
              </li>
            </div>
          </>
        );
      } else {
      }
    } else {
      return (
        <>
          <div className="h-action">
            <li>
              <button onClick={() => nav("/login")} className="button-main">
                Masuk
              </button>
            </li>
          </div>
        </>
      );
    }
  }
  // ____________________________________________________________

  // get pdf file
  const [pdfFile, setPdfFile] = useState(null);

  function handlePdf(e) {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  }

  // fungsi ham menu
  function loginUserHam() {
    if (user && token) {
      if (user.role === "pelamar") {
        return (
          <>
            <div
              onClick={(event) => event.stopPropagation()}
              className="header-list-mobile"
            >
              <ul>
                {/* user_____________ */}
                <div className="hlm-user">
                  <div
                    style={{
                      backgroundImage: `url("${
                        user.profil ? user.profil : "/profil-pelamar.svg"
                      }")`,
                    }}
                    className="hlm-u-img"
                  ></div>
                  <div className="hlm-u-desc">
                    <h6>{user.nama_pelamar}</h6>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="gap-ham"></div>
                {/* user menu________ */}
                <div className="hlm-navigasi">
                  <li
                    onClick={() => nav("/profil")}
                    className={path == "/profil" ? "active-m" : ""}
                  >
                    <NavLink to="/profil">Lihat Profil</NavLink>
                  </li>
                  <li
                    onClick={() => nav("/tersimpan")}
                    className={path == "/tersimpan" ? "active-m" : ""}
                  >
                    <NavLink to="/tersimpan">Tersimpan</NavLink>
                  </li>
                  <li
                    onClick={() => nav("/status-lamaran")}
                    className={path == "/status-lamaran" ? "active-m" : ""}
                  >
                    <NavLink to="/status-lamaran">Status Lamaran</NavLink>
                  </li>
                </div>
                <div className="gap-ham"></div>
                {lebar <= 800 ? (
                  <>
                    {" "}
                    {/* menu_____________ */}
                    <div className="hlm-navigasi">
                      <li
                        onClick={() => nav("/lowongan")}
                        className={path == "/lowongan" ? "active-m" : ""}
                      >
                        <NavLink to="/lowongan">Cari Pekerjaan</NavLink>
                      </li>
                      <li
                        onClick={() => nav("/perusahaan")}
                        className={path == "/perusahaan" ? "active-m" : ""}
                      >
                        <NavLink to="/perusahaan">Perusahaan</NavLink>
                      </li>
                      <li
                        onClick={() => nav("/tentang")}
                        className={path == "/tentang" ? "active-m" : ""}
                      >
                        <NavLink to="/tentang">Tentang Kami</NavLink>
                      </li>
                    </div>
                    <div className="gap-ham"></div>
                  </>
                ) : null}
                {/* cv_____________ */}
                <form className="hlm-cv-up">
                  <div className="hlm-cv-up-left">
                    <label className="input-file-class" for="input-file">
                      {pdfFile ? (
                        <>
                          <img src="/pdf.svg" alt="upload icon" />
                          <p>{pdfFile.name}</p>
                        </>
                      ) : (
                        <img src="/upload.svg" alt="upload icon" />
                      )}
                    </label>
                    <input
                      onChange={handlePdf}
                      accept="application/pdf"
                      id="input-file"
                      type="file"
                    />
                  </div>
                  <div className="hlm-cv-up-right">
                    <div>
                      <h6>Unggah CV anda</h6>
                      <p style={{ color: "grey" }}>pdf.Max 10mb</p>
                    </div>
                    <button className="button-main">Cari Pekerjaan</button>
                  </div>
                </form>
                <div className="hlm-action">
                  <li>
                    <button onClick={handleLogout} className="button-signout">
                      <img src="/logout.svg" alt="logout logo" />
                      Keluar
                    </button>
                  </li>
                </div>
              </ul>
            </div>
          </>
        );
      }
      if (user.role === "perusahaan") {
        return (
          <>
            <div className="header-list-mobile">
              <ul>
                {/* user_____________ */}
                <div className="hlm-user">
                  <div
                    style={{
                      backgroundImage: `url("${
                        user.picture ? user.picture : "/profil-perusahaan.svg"
                      }")`,
                    }}
                    className="hlm-u-img"
                  ></div>
                  <div className="hlm-u-desc">
                    <h6>{user.nama_perusahaan}</h6>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="gap-ham"></div>
                {/* user menu________ */}
                <div className="hlm-navigasi">
                  <li
                    onClick={() => nav("/profil-perusahaan")}
                    className={path == "/profil-perusahaan" ? "active-m" : ""}
                  >
                    <NavLink to="/profil-perusahaan">Lihat Profil</NavLink>
                  </li>
                  <li
                    onClick={() => nav("/lowongan-post")}
                    className={path == "/lowongan-post" ? "active-m" : ""}
                  >
                    <NavLink to="/perusahaan-post">Daftar Lowongan </NavLink>
                  </li>
                  <li
                    onClick={() => nav("/pelamar")}
                    className={path == "/pelamar" ? "active-m" : ""}
                  >
                    <NavLink to="/pelamar">Manajemen Pelamar</NavLink>
                  </li>
                </div>
                <div className="gap-ham"></div>
                {lebar <= 800 ? (
                  <>
                    {/* menu_____________ */}
                    <div className="hlm-navigasi">
                      <li
                        onClick={() => nav("/lowongan")}
                        className={path == "/lowongan" ? "active-m" : ""}
                      >
                        <NavLink to="/lowongan">Cari Pekerjaan</NavLink>
                      </li>
                      <li
                        onClick={() => nav("/lowongan")}
                        className={path == "/perusahaan" ? "active-m" : ""}
                      >
                        <NavLink to="/perusahaan">Perusahaan</NavLink>
                      </li>
                      <li
                        onClick={() => nav("/lowongan")}
                        className={path == "/tentang" ? "active-m" : ""}
                      >
                        <NavLink to="/tentang">Tentang Kami</NavLink>
                      </li>
                    </div>
                    <div className="gap-ham"></div>
                  </>
                ) : null}
                <div className="hlm-action">
                  <li>
                    <button onClick={handleLogout} className="button-signout">
                      <img src="/logout.svg" alt="logout logo" />
                      Keluar
                    </button>
                  </li>
                </div>
              </ul>
            </div>
          </>
        );
      } else {
      }
    } else {
      return (
        <>
          <div className="header-list-mobile">
            <ul>
              <div className="hlm-navigasi">
                <li
                  onClick={() => nav("/lowongan")}
                  className={path == "/lowongan" ? "active-m" : ""}
                >
                  <NavLink to="/lowongan">Cari Pekerjaan</NavLink>
                </li>
                <li
                  onClick={() => nav("/lowongan")}
                  className={path == "/perusahaan" ? "active-m" : ""}
                >
                  <NavLink to="/perusahaan">Perusahaan</NavLink>
                </li>
                <li
                  onClick={() => nav("/lowongan")}
                  className={path == "/tentang" ? "active-m" : ""}
                >
                  <NavLink to="/tentang">Tentang Kami</NavLink>
                </li>
              </div>
              <div className="hlm-action">
                <li>
                  <button onClick={() => nav("/login")} className="button-main">
                    Masuk
                  </button>
                </li>
              </div>
            </ul>
          </div>
        </>
      );
    }
  }
  // ____________________________________________________________

  const [muncul, setMuncul] = useState(true);
  const [nilai, setNilai] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    function headerScroll() {
      setHam(false);
      setMuncul(false);
      setNilai(window.scrollY);
      const currentY = window.scrollY;
      if (currentY < lastY || currentY == 0) {
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

          {/* auth function */}
          {loginUser()}
        </ul>
        <button onClick={() => setHam(!ham)} className="ham-button">
          <img src="/ham.svg" alt="hamburger button" />
        </button>
      </div>
      <div
        onClick={() => setHam(false)}
        onScroll={() => setHam(false)}
        className={`hlm-wrap ${ham ? "hlm-true" : ""}`}
      >
        {/* header ham menu______________________________________ */}
      </div>
      {ham && (
        <div
          onClick={() => setHam(false)}
          onScroll={() => setHam(false)}
          className="hlm-wraping"
        >
          {loginUserHam()}
        </div>
      )}
    </>
  );
}
