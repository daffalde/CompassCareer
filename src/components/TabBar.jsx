import { useNavigate } from "react-router-dom";
import "../styles/components/tabbar.css";
import pdfToText from "react-pdftotext";
import { franc } from "franc-min";
import { useState } from "react";
import { LoadingPage } from "./Loading";
import axios from "axios";
import { DataLogin } from "../data/DataLogin";

export function TabBarGuest() {
  const nav = useNavigate();
  const path = window.location.pathname;
  return (
    <>
      <div className="tabbar-container">
        <div
          onClick={() => nav("/")}
          className={`tabbar-content ${
            path === "/" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/" ? "/mobile/home-blue.png" : "/mobile/home-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/" ? "#005df4" : "#393e46" }}>Beranda</p>
        </div>
        <div
          onClick={() => nav("/lowongan")}
          className={`tabbar-content ${
            path === "/lowongan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/lowongan"
                ? "/mobile/job-blue.png"
                : "/mobile/job-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/lowongan" ? "#005df4" : "#393e46" }}>
            Lowongan
          </p>
        </div>
        <div
          onClick={() => nav("/perusahaan")}
          className={`tabbar-content ${
            path === "/perusahaan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/perusahaan"
                ? "/mobile/building-blue.png"
                : "/mobile/building-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/perusahaan" ? "#005df4" : "#393e46" }}>
            Perusahaan
          </p>
        </div>
        <div
          onClick={() => nav("/login")}
          className={`tabbar-content ${
            path === "/login" || path === "/signup" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/login" || path === "/signup"
                ? "/mobile/masuk-blue.png"
                : "/mobile/masuk.png"
            }
            alt=""
          />
          <p
            style={{
              color:
                path === "/login" || path === "/signup" ? "#005df4" : "#393e46",
            }}
          >
            Masuk
          </p>
        </div>
      </div>
    </>
  );
}

export function TabBarPelamar() {
  const nav = useNavigate();
  const path = window.location.pathname;
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

  const [popupCv, setPopupCv] = useState(false);
  return (
    <>
      <div className="tabbar-container tabbar-container-add">
        <div
          onClick={() => nav("/")}
          className={`tabbar-content ${
            path === "/" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/" ? "/mobile/home-blue.png" : "/mobile/home-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/" ? "#005df4" : "#393e46" }}>Beranda</p>
        </div>
        <div
          onClick={() => nav("/lowongan")}
          className={`tabbar-content ${
            path === "/lowongan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/lowongan"
                ? "/mobile/job-blue.png"
                : "/mobile/job-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/lowongan" ? "#005df4" : "#393e46" }}>
            Lowongan
          </p>
        </div>
        <div onClick={() => setPopupCv(!popupCv)} className="tabbar-content">
          {popupCv ? (
            <img src="/mobile/close.png" alt="close icon" />
          ) : (
            <>
              <img src="/mobile/cv-black.png" alt="" />
              <p style={{ color: "#393e46" }}>Upload CV</p>
            </>
          )}
        </div>
        <div
          onClick={() => nav("/perusahaan")}
          className={`tabbar-content ${
            path === "/perusahaan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/perusahaan"
                ? "/mobile/building-blue.png"
                : "/mobile/building-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/perusahaan" ? "#005df4" : "#393e46" }}>
            Perusahaan
          </p>
        </div>
        <div
          onClick={() => nav("/setelan-pelamar")}
          className={`tabbar-content ${
            path === "/setelan-pelamar" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/setelan-pelamar"
                ? "/mobile/gear-blue.png"
                : "/mobile/gear-black.png"
            }
            alt=""
          />
          <p
            style={{
              color: path === "/setelan-pelamar" ? "#005df4" : "#393e46",
            }}
          >
            Setelan
          </p>
        </div>
      </div>

      {/* pop up */}
      <div className={`tabbar-popup ${popupCv ? "tabbar-popup-on" : ""}`}>
        <form className="hlm-cv-up">
          <div className="hlm-cv-up-left">
            <label className="input-file-class" htmlFor="input-file">
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
      </div>
    </>
  );
}

export function TabBarPerusahaan() {
  const nav = useNavigate();
  const path = window.location.pathname;

  return (
    <>
      <div className="tabbar-container tabbar-container-add">
        <div
          onClick={() => nav("/")}
          className={`tabbar-content ${
            path === "/" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/" ? "/mobile/home-blue.png" : "/mobile/home-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/" ? "#005df4" : "#393e46" }}>Beranda</p>
        </div>
        <div
          onClick={() => nav("/lowongan")}
          className={`tabbar-content ${
            path === "/lowongan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/lowongan"
                ? "/mobile/job-blue.png"
                : "/mobile/job-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/lowongan" ? "#005df4" : "#393e46" }}>
            Lowongan
          </p>
        </div>
        <div onClick={() => nav("/posting")} className="tabbar-content">
          <img src="/mobile/plus.png" alt="plus icon" />
          <p
            style={{
              color: "#393e46",
            }}
          >
            Posting
          </p>
        </div>
        <div
          onClick={() => nav("/perusahaan")}
          className={`tabbar-content ${
            path === "/perusahaan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/perusahaan"
                ? "/mobile/building-blue.png"
                : "/mobile/building-black.png"
            }
            alt=""
          />
          <p style={{ color: path === "/perusahaan" ? "#005df4" : "#393e46" }}>
            Perusahaan
          </p>
        </div>
        <div
          onClick={() => nav("/setelan-perusahaan")}
          className={`tabbar-content ${
            path === "/setelan-perusahaan" ? "tabbar-content-on" : ""
          }`}
        >
          <img
            src={
              path === "/setelan-perusahaan"
                ? "/mobile/gear-blue.png"
                : "/mobile/gear-black.png"
            }
            alt=""
          />
          <p
            style={{
              color: path === "/setelan-perusahaan" ? "#005df4" : "#393e46",
            }}
          >
            Setelan
          </p>
        </div>
      </div>
    </>
  );
}
