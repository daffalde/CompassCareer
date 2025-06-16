import { useEffect, useRef, useState } from "react";
import "../styles/components/sidelowongan.css";
import { gradient } from "../data/Data";
import moment from "moment";
import Cookies from "js-cookie";
import axios from "axios";
import { LoadingButton, LoadingButtonBlue } from "./Loading";
import { Link } from "react-router-dom";
import { AlertFailed, AlertSucceed } from "./Alert";

export function SideLowongan({ data, show }) {
  const getGrad = Math.round(Number(data[0]?.id_lowongan) % 19);
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loadingButton, setLoadingButton] = useState(false);

  //   cek simpan + cv
  const [lowonganSimpan, setLowonganSimpan] = useState(null);
  const [getCv, setGetCv] = useState(null);
  async function getSimpan() {
    setLoadingButton(true);
    try {
      if (token && userId?.role === "pelamar") {
        const lokerSimpan = await axios.get(
          "https://careercompass-backend.vercel.app/data/lowongan-tersimpan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const takeCv = await axios.get(
          "https://careercompass-backend.vercel.app/data/cv",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGetCv(
          takeCv.data.filter((e) => e.id_pelamar === userId?.id_pelamar)
        );
        setLowonganSimpan(
          lokerSimpan.data.filter(
            (e) =>
              e.id_pelamar === userId.id_pelamar &&
              e.id_lowongan === data[0]?.id_lowongan
          )
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  }
  useEffect(() => {
    getSimpan();
  }, [data[0]?.id_lowongan]);

  //   fungsi simpan
  async function save() {
    setLoadingButton(true);
    try {
      if (lowonganSimpan?.length === 0) {
        await axios.post(
          "https://careercompass-backend.vercel.app/data/lowongan-tersimpan",
          {
            pelamar: userId?.id_pelamar,
            lowongan: data[0]?.id_lowongan,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getSimpan();
      } else {
        await axios.delete(
          `https://careercompass-backend.vercel.app/data/lowongan-tersimpan/${lowonganSimpan[0]?.id_lowongan_tersimpan}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getSimpan();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  }

  //   lamar
  const [showPopup, setShowPopup] = useState(false);
  const inputSurat = useRef("");
  const [alertCv, setAlertCv] = useState(false);
  const [takeIdCv, setTakeIdCv] = useState(null);
  const [alertPesan, setAlertPesan] = useState(null);
  const [alertPesanShow, setAlertPesanShow] = useState(false);

  async function handleSendApply(e) {
    e.preventDefault();
    setLoadingButton(true);
    if (takeIdCv) {
      try {
        await axios.post(
          "https://careercompass-backend.vercel.app/data/app",
          {
            lowongan: Number(data[0]?.id_lowongan),
            cv: Number(takeIdCv),
            pelamar: userId?.id_pelamar,
            surat: inputSurat.current.value,
            status: "Ditinjau",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAlertPesan("Lamaran berhasil terkirim!");
        setAlertPesanShow(true);
        setShowPopup(false);
        setLoadingButton(false);
        setTakeIdCv(null);
        inputSurat.current.value = "";
      } catch (e) {
        console.log(e);
        setAlertPesan("Lamaran gagal terkirim!", e);
        setAlertPesanShow(true);
      }
    } else {
      setAlertCv(true);
      setLoadingButton(false);
    }
  }

  useEffect(() => {
    if (alertPesanShow) {
      const timeout = setTimeout(() => {
        setAlertPesan(null);
        setAlertPesanShow(false);
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [alertPesanShow]);
  return (
    <>
      {/* pop up____________________________________ */}
      {alertPesanShow ? (
        alertPesan === "Lamaran berhasil terkirim!" ? (
          <AlertSucceed message={alertPesan} />
        ) : (
          <AlertFailed message={alertPesan} />
        )
      ) : null}
      <div
        onClick={() => {
          setShowPopup(false);
          setAlertCv(false);
        }}
        className={`popup-wrap ${showPopup ? "" : "popup-wrap-off"}`}
      >
        {data[0] ? (
          <div
            onClick={(event) => event.stopPropagation()}
            className={`popup-content ${showPopup ? "popup-content-off" : ""}`}
          >
            <div className="apply-page">
              <div className="apply-p-head">
                <img
                  onClick={() => setShowPopup(false)}
                  src="/left-arrow.png"
                  alt="back icon"
                />
                <h5>Formulir Lamaran</h5>
              </div>
              <br />
              <div className="apply-body">
                <div className="apply-b-content">
                  <textarea
                    ref={inputSurat}
                    placeholder="Tulis cover letter..."
                    className="apply-b-c-text"
                  ></textarea>
                </div>
                <div className="apply-b-content">
                  <div
                    className={`apply-b-c-cv ${
                      alertCv ? "apply-b-c-cv-alert" : ""
                    }`}
                  >
                    <h6>Pilih CV</h6>
                    {alertCv ? (
                      <p className="caution">
                        Pilih atau upload CV terlebih dahulu
                      </p>
                    ) : (
                      <p style={{ color: "grey" }}>
                        Tambahkan CV anda di{" "}
                        <Link style={{ color: "grey" }} to={"/profil"}>
                          Profil
                        </Link>
                      </p>
                    )}
                    <div className="apply-b-c-cv-wrap">
                      {getCv ? (
                        getCv.map((e) => (
                          <div
                            onClick={() => setTakeIdCv(e.id_cv)}
                            className={`apply-b-c-cv-item ${
                              takeIdCv === e.id_cv ? "apply-b-c-cv-item-on" : ""
                            }`}
                            key={e.id_cv}
                          >
                            <img src="/pdf.svg" alt="png icon" />
                            <p>{e.nama}</p>
                            <div
                              style={{
                                backgroundImage: `url(${
                                  takeIdCv === e.id_cv
                                    ? "/check1.svg"
                                    : "/plus1.png"
                                })`,
                              }}
                              className="apply-b-c-cv-i-plus"
                            ></div>
                          </div>
                        ))
                      ) : (
                        <p>
                          Tambahkan CV di Halaman{" "}
                          <Link to={"/profil"}>Profil</Link>
                        </p>
                      )}{" "}
                    </div>
                  </div>
                  <br />
                  <div
                    onClick={() => setShowPopup(false)}
                    className="apply-b-c-lowongan"
                  >
                    <div className="apply-b-c-l-arrow"></div>
                    <img
                      src={
                        data[0]?.picture
                          ? data[0]?.picture
                          : "/profil-perusahaan.svg"
                      }
                      alt="profil perusahaan"
                    />
                    <span>
                      <p>{data[0]?.nama_perusahaan}</p>
                      <h6>{data[0]?.posisi}</h6>
                      <p>
                        {data[0]?.lokasi} {data[0]?.provinsi}
                      </p>
                      <br />
                      <h6>
                        Rp{" "}
                        {data[0]?.gaji_min > 1000000
                          ? `${data[0]?.gaji_min / 1000000}Jt`
                          : `${data[0]?.gaji_min / 1000}Rb`}
                        -
                        {data[0]?.gaji_max > 1000000
                          ? `${data[0]?.gaji_max / 1000000}Jt`
                          : `${data[0]?.gaji_max / 1000}Rb`}
                      </h6>
                    </span>
                  </div>
                  <br />
                  <button
                    onClick={handleSendApply}
                    className="button-main apply-b-c-button"
                  >
                    Kirim Lamaran {loadingButton ? <LoadingButton /> : null}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/* __________________________________________ */}
      <div className={`side-container ${show ? "side-container-on" : ""} `}>
        <div
          style={{
            backgroundImage: gradient[getGrad ? getGrad + 1 : 1].gradient,
          }}
          className="side-head"
        ></div>
        <div className="side-info">
          <img
            className="side-profil"
            src={data[0]?.picture ? data[0].picture : "/profil-perusahaan.svg"}
            alt="profil perusahaan"
          />
          <div className="s-p-title">
            <h4>{data[0]?.posisi}</h4>
            <p>{data[0]?.nama_perusahaan}</p>
            <br />
            <div className="s-p-t-location">
              <p>{data[0]?.lokasi}</p>
              {data[0]?.lokasi && data[0]?.provinsi ? <p>,</p> : null}
              <p>{data[0]?.provinsi}</p>
              {data[0]?.lokasi && data[0]?.provinsi ? (
                <div className="dot"></div>
              ) : null}

              <p>
                {moment(data[0]?.lowongan_created_at, "YYYYMMDD").fromNow()}
              </p>
            </div>
          </div>
          {token && userId?.role === "pelamar" ? (
            <div className="s-p-action">
              <button onClick={save} className="button-save">
                {loadingButton ? (
                  <LoadingButtonBlue />
                ) : (
                  <img
                    src={
                      lowonganSimpan?.length > 0 ? "/save2.svg" : "/save1.svg"
                    }
                    alt="save icon"
                  />
                )}
              </button>
              <button
                onClick={() => setShowPopup(true)}
                className="button-main"
              >
                Lamar
              </button>
            </div>
          ) : null}
        </div>
        <div className="side-detail">
          <div className="s-d-item">
            <h6>Gaji</h6>
            <h5>
              Rp{" "}
              {data[0]?.gaji_min / 1000000 >= 1
                ? `${data[0]?.gaji_min / 1000000}Jt`
                : `${data[0]?.gaji_min / 1000}Rb`}
              -
              {data[0]?.gaji_max / 1000000 >= 1
                ? `${data[0]?.gaji_max / 1000000}Jt`
                : `${data[0]?.gaji_max / 1000}Rb`}
            </h5>
          </div>
          <div className="s-d-item">
            <h6>Kategori</h6>
            <h5>{data[0]?.kategori}</h5>
          </div>
          <div className="s-d-item">
            <h6>Jenis</h6>
            <h5>{data[0]?.jenis}</h5>
          </div>
        </div>
        <div className="side-desc">
          <h5>Keahlian:</h5>
          <div className="s-d-wrap">
            {data[0]?.skill
              ? JSON.parse(data[0]?.skill).map((e, i) => (
                  <div className="s-item" key={i}>
                    <p>{e}</p>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="side-desc">
          <h5>Tentang Pekerjaan:</h5>
          {data[0]?.tentang_lowongan
            .split("\n")
            .filter((filter) => filter.trim() !== "")
            .map((e, i) => (
              <span key={i}>
                <p>{i + 1}.</p>
                <p>{e}</p>
              </span>
            ))}
        </div>
        <div className="side-desc">
          <h5>Persyaratan:</h5>
          {data[0]?.syarat
            .split("\n")
            .filter((filter) => filter.trim() !== "")
            .map((e, i) => (
              <span key={i}>
                <p>{i + 1}.</p>
                <p>{e}</p>
              </span>
            ))}
        </div>

        {data?.length === 0 ? null : token && userId?.role === "pelamar" ? (
          <div className="side-action">
            <button onClick={save} className="button-save s-a-save">
              {loadingButton ? (
                <LoadingButtonBlue />
              ) : (
                <img
                  src={lowonganSimpan?.length > 0 ? "/save2.svg" : "/save1.svg"}
                  alt="save icon"
                />
              )}
            </button>
            <button
              onClick={() => setShowPopup(true)}
              className="button-main s-a-main"
            >
              Lamar
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function SidePerusahaan({ data, show }) {
  const getGrad = Math.round(Number(data[0]?.id_perusahaan) % 19);
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loadingButton, setLoadingButton] = useState(false);

  //   cek simpan
  const [perusahaanSimpan, setPerusahaanSimpan] = useState(null);
  async function getSimpan() {
    setLoadingButton(true);
    try {
      if (token && userId?.role === "pelamar") {
        const companySimpan = await axios.get(
          "https://careercompass-backend.vercel.app/data/perusahaan-tersimpan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPerusahaanSimpan(
          companySimpan.data.filter(
            (e) =>
              e.id_pelamar === userId.id_pelamar &&
              e.id_perusahaan === data[0]?.id_perusahaan
          )
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  }
  useEffect(() => {
    getSimpan();
  }, [data[0]?.id_perusahaan]);

  //   fungsi simpan
  async function save() {
    setLoadingButton(true);
    try {
      if (perusahaanSimpan?.length === 0) {
        await axios.post(
          "https://careercompass-backend.vercel.app/data/perusahaan-tersimpan",
          {
            pelamar: userId?.id_pelamar,
            lowongan: data[0]?.id_perusahaan,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getSimpan();
      } else {
        await axios.delete(
          `https://careercompass-backend.vercel.app/data/perusahaan-tersimpan/${perusahaanSimpan[0]?.id_perusahaan_tersimpan}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getSimpan();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  }

  return (
    <>
      <div className={`side-container ${show ? "side-container-on" : ""} `}>
        <div
          style={{
            backgroundImage: gradient[getGrad ? getGrad + 1 : 1].gradient,
          }}
          className="side-head"
        ></div>
        <div className="side-info">
          <img
            className="side-profil"
            src={data[0]?.picture ? data[0].picture : "/profil-perusahaan.svg"}
            alt="profil perusahaan"
          />
          <div className="s-p-title">
            <h4>{data[0]?.nama_perusahaan}</h4>
            <p>{data[0]?.bidang}</p>
            <br />
            <div className="s-p-t-location">
              <p>{data[0]?.lokasi}</p>
              {data[0]?.lokasi && data[0]?.provinsi ? <p>,</p> : null}
              <p>{data[0]?.provinsi}</p>
            </div>
          </div>
          {token && userId?.role === "pelamar" ? (
            <div className="s-p-action">
              <button onClick={save} className="button-save">
                {loadingButton ? (
                  <LoadingButtonBlue />
                ) : (
                  <img
                    src={
                      perusahaanSimpan?.length > 0 ? "/save2.svg" : "/save1.svg"
                    }
                    alt="save icon"
                  />
                )}
              </button>
            </div>
          ) : null}
        </div>
        <div className="side-detail">
          <div className="s-d-item">
            <h6>Situs</h6>
            {data[0]?.situs ? (
              <h5
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => window.open(data[0]?.situs)}
              >
                {data[0]?.situs.split(".")[1]}
              </h5>
            ) : (
              <p style={{ color: "#bdbdbd", fontSize: "13px" }}>Belum ada</p>
            )}
          </div>
          <div className="s-d-item">
            <h6>Didirikan</h6>
            {data[0]?.tahun_didirikan ? (
              <h5>{data[0]?.tahun_didirikan}</h5>
            ) : (
              <p style={{ color: "#bdbdbd", fontSize: "13px" }}>Belum ada</p>
            )}
          </div>
          <div className="s-d-item">
            <h6>Karyawan</h6>
            {data[0]?.karyawan ? (
              <h5>{data[0]?.karyawan}</h5>
            ) : (
              <p style={{ color: "#bdbdbd", fontSize: "13px" }}>Belum ada</p>
            )}
          </div>
        </div>
        <div className="side-desc">
          <h5>Tentang:</h5>
          <p>{data[0]?.tentang}</p>
        </div>
        <div className="side-desc">
          <h5>Visi:</h5>
          {data[0]?.visi
            ? data[0]?.visi
                .split("\n")
                .filter((filter) => filter.trim() !== "")
                .map((e, i) => (
                  <span key={i}>
                    <p>{i + 1}.</p>
                    <p>{e}</p>
                  </span>
                ))
            : null}
        </div>
        <div className="side-desc">
          <h5>Misi:</h5>
          {data[0]?.misi
            ? data[0]?.misi
                .split("\n")
                .filter((filter) => filter.trim() !== "")
                .map((e, i) => (
                  <span key={i}>
                    <p>{i + 1}.</p>
                    <p>{e}</p>
                  </span>
                ))
            : null}
        </div>

        {data?.length === 0 ? null : token && userId?.role === "pelamar" ? (
          <div className="side-action side-action-perusahaan">
            <button
              onClick={save}
              className="button-save s-a-save s-a-save-perusahaan"
            >
              {loadingButton ? (
                <LoadingButtonBlue />
              ) : (
                <img
                  src={
                    perusahaanSimpan?.length > 0 ? "/save2.svg" : "/save1.svg"
                  }
                  alt="save icon"
                />
              )}
              {perusahaanSimpan?.length > 0 ? "Disimpan" : "Simpan"}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
