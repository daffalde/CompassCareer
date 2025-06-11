import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import pdfToText from "react-pdftotext";
import { franc } from "franc-min";
import { LoadingButton, LoadingPage } from "./Loading";
import { AlertFailed } from "./Alert";

export default function Header() {
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const nav = useNavigate();
  const [ham, setHam] = useState(false);

  const [user, setUser] = useState(null);

  // get user
  async function getUser() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/${
          userId.role === "pelamar" ? "pelamar" : "perusahaan"
        }/${
          userId.role === "pelamar" ? userId.id_pelamar : userId.id_perusahaan
        }`
      );
      setUser(resp.data[0]);
    } catch (e) {}
  }

  useEffect(() => {
    getUser();
  }, []);

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
    if (token) {
      if (userId.role === "pelamar") {
        return (
          <>
            <div className="h-action">
              <li>
                <button
                  onClick={() => setHam(true)}
                  style={{
                    backgroundImage: `url("${
                      userId.profil ? userId.profil : "/profil-pelamar.svg"
                    }")`,
                  }}
                  id="user-profil"
                ></button>
              </li>
            </div>
          </>
        );
      }
      if (userId.role === "perusahaan") {
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
                      userId.picture ? userId.picture : "/profil-perusahaan.svg"
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
  const [loadingButton, setLoadingButton] = useState(false);
  const [warning, setWarning] = useState(false);

  async function handlePdf(e) {
    const file = e.target.files[0];
    if (file) {
      setLoadingButton(true);
      setWarning(false);
      try {
        const ekstrak = await pdfToText(file);
        const bahasa = franc(ekstrak);
        setLoadingButton(false);
        if (bahasa !== "eng") {
          setWarning(true);
        } else {
          setPdfFile(file);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  // send request
  async function handleCari(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", pdfFile);
    try {
      localStorage.removeItem("data");
      const resp = await axios.post(
        "https://ml-caps-production.up.railway.app/predict",
        formData
      );
      localStorage.setItem("data", JSON.stringify(resp.data.top_matches));
      window.location.href = "/cv-lowongan";
    } catch (e) {
      console.log(e);
    }
  }

  // fungsi ham menu
  function loginUserHam() {
    if (token) {
      if (userId.role === "pelamar") {
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
                        userId.profil ? userId.profil : "/profil-pelamar.svg"
                      }")`,
                    }}
                    className="hlm-u-img"
                  ></div>
                  <div className="hlm-u-desc">
                    <h6>{userId.nama_pelamar}</h6>
                    <p>{userId.email}</p>
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
                          <p style={{ textAlign: "center" }}>{pdfFile.name}</p>
                        </>
                      ) : loadingButton ? (
                        <LoadingPage />
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
                      {warning ? (
                        <p className="caution">
                          Harap masukan CV <br /> berbahasa inggris
                        </p>
                      ) : null}
                    </div>
                    <button onClick={handleCari} className="button-main">
                      Cari Pekerjaan
                    </button>
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
      if (userId.role === "perusahaan") {
        return (
          <>
            <div className="header-list-mobile">
              <ul>
                {/* user_____________ */}
                <div className="hlm-user">
                  <div
                    style={{
                      backgroundImage: `url("${
                        userId.picture
                          ? userId.picture
                          : "/profil-perusahaan.svg"
                      }")`,
                    }}
                    className="hlm-u-img"
                  ></div>
                  <div className="hlm-u-desc">
                    <h6>{userId.nama_perusahaan}</h6>
                    <p>{userId.email}</p>
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
