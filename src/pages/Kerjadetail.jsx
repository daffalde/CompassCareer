import moment from "moment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/lowongandetail.css";
import "../styles/template.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LoadingButton, LoadingPage } from "../components/Loading";
import axios from "axios";
import { AlertFailed, AlertSucceed } from "../components/Alert";
import Cookies from "js-cookie";
import { NavBack } from "../components/Navigation";

export default function Kerjadetail() {
  const token = Cookies.get("token");
  const getId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const url = window.location.pathname;
  const urlId = url.split("/").pop();

  const [dataLowongan, setDataLowongan] = useState(null);
  const [otherLowongan, setOtherLowongan] = useState(null);
  const [tersimpan, setTersimpan] = useState(false);
  const [cvData, setCvData] = useState(null);
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // data dummy_____________________________________________________
  async function getLowongan() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan/${urlId}`
      );
      const resp2 = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan`
      );
      if (token) {
        const resp3 = await axios.get(
          "https://careercompass-backend.vercel.app/data/lowongan-tersimpan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resp4 = await axios.get(
          "https://careercompass-backend.vercel.app/data/cv",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCvData(
          resp4.data.filter((e) => e.id_pelamar === Number(getId.id_pelamar))
        );
        setTersimpan(
          resp3.data.filter(
            (e) =>
              e.id_pelamar === getId.id_pelamar &&
              e.id_lowongan === Number(urlId)
          )[0]
            ? resp3.data.filter(
                (e) =>
                  e.id_pelamar === getId.id_pelamar &&
                  e.id_lowongan === Number(urlId)
              )[0]
            : null
        );
      }
      setOtherLowongan(resp2.data);
      setDataLowongan(resp.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  }
  useEffect(() => {
    function StayUp() {
      window.scrollTo({ top: 0 });
    }
    StayUp();
    getLowongan();
  }, []);

  // logic simpan________________________________________________________________________
  async function simpanLowongan() {
    setLoadingButton(true);
    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/data/lowongan-tersimpan",
        {
          pelamar: getId.id_pelamar ? getId.id_pelamar : null,
          lowongan: urlId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getLowongan();
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
    }
  }

  //tombol hapus simpan
  async function hapusSimpanLowongan() {
    setLoadingButton(true);
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/lowongan-tersimpan/${
          tersimpan ? tersimpan.id_lowongan_tersimpan : null
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getLowongan();
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
    }
  }

  // APPLY MENU________________________________________________________________
  const [showPopup, setShowPopup] = useState(false);
  const [takeIdCv, setTakeIdCv] = useState(null);
  const [alertCv, setAlertCv] = useState(false);
  const inputSurat = useRef("");
  const [loadingButton, setLoadingButton] = useState(false);
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
            lowongan: Number(urlId),
            cv: Number(takeIdCv),
            pelamar: getId.id_pelamar,
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
  return (
    <>
      <div className="container">
        <Header />
        <NavBack title={"Lowongan"} />
        {alertPesanShow ? (
          alertPesan === "Lamaran berhasil terkirim!" ? (
            <AlertSucceed message={alertPesan} />
          ) : (
            <AlertFailed message={alertPesan} />
          )
        ) : null}
        {/* pop up____________________________________ */}
        <div
          onClick={() => setShowPopup(false)}
          className={`popup-wrap ${showPopup ? "" : "popup-wrap-off"}`}
        >
          {dataLowongan ? (
            <div
              onClick={(event) => event.stopPropagation()}
              className={`popup-content ${
                showPopup ? "popup-content-off" : ""
              }`}
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
                      <h6>Tambahkan CV</h6>
                      {alertCv ? (
                        <p className="caution">
                          Pilih atau upload CV terlebih dahulu
                        </p>
                      ) : null}
                      <div className="apply-b-c-cv-wrap">
                        {cvData
                          ? cvData.map((e) => (
                              <div
                                onClick={() => setTakeIdCv(e.id_cv)}
                                className={`apply-b-c-cv-item ${
                                  takeIdCv === e.id_cv
                                    ? "apply-b-c-cv-item-on"
                                    : ""
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
                          : null}{" "}
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
                          dataLowongan[0].picture
                            ? dataLowongan[0].picture
                            : "/profil-perusahaan.svg"
                        }
                        alt="profil perusahaan"
                      />
                      <span>
                        <p>{dataLowongan[0].nama_perusahaan}</p>
                        <h6>{dataLowongan[0].posisi}</h6>
                        <p>
                          {dataLowongan[0].lokasi} {dataLowongan[0].provinsi}
                        </p>
                        <br />
                        <h6>
                          Rp{" "}
                          {dataLowongan[0].gaji_min > 1000000
                            ? `${dataLowongan[0].gaji_min / 1000000}Jt`
                            : `${dataLowongan[0].gaji_min / 1000}Rb`}
                          -
                          {dataLowongan[0].gaji_max > 1000000
                            ? `${dataLowongan[0].gaji_max / 1000000}Jt`
                            : `${dataLowongan[0].gaji_max / 1000}Rb`}
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
          ) : (
            <LoadingPage />
          )}
        </div>
        {/* __________________________________________ */}

        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {dataLowongan.map((e) => (
              <div className="template" key={e.id_lowongan}>
                <div className="template-head">
                  <div className="t-h-top">
                    <img
                      src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                      alt="logo perusahaan"
                    />
                  </div>
                  <div className="t-h-bottom">
                    <div className="t-h-b-title">
                      <h4>{e.posisi}</h4>
                      <p>{e.nama_perusahaan}</p>
                    </div>
                    <div className="t-h-b-desc">
                      <span>
                        <p>
                          {e.lokasi},{e.provinsi}
                        </p>
                        <img src="/dot1.svg" alt="dot gap" />
                        <p>
                          {moment(
                            e.lowongan_created_at.split("T")[0],
                            "YYYYMMDD"
                          ).fromNow()}
                        </p>
                      </span>
                      {getId?.role === "pelamar" ? (
                        <>
                          <span>
                            {!tersimpan?.id_lowongan_tersimpan ? (
                              <button
                                onClick={() => simpanLowongan(e.id_lowongan)}
                                className="button-second"
                              >
                                Simpan
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  hapusSimpanLowongan(e.id_lowongan)
                                }
                                className="button-second"
                              >
                                Disimpan
                              </button>
                            )}
                            <button
                              onClick={() => setShowPopup(true)}
                              className="button-main"
                            >
                              Lamar
                            </button>
                          </span>
                          {/* __________________ */}
                          <div className="bottombutton-container">
                            {!tersimpan?.id_lowongan_tersimpan ? (
                              <button
                                onClick={() => simpanLowongan(e.id_lowongan)}
                                className="button-second"
                              >
                                Simpan
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  hapusSimpanLowongan(e.id_lowongan)
                                }
                                className="button-second"
                              >
                                Disimpan
                              </button>
                            )}
                            <button
                              onClick={setShowPopup}
                              className="button-main"
                            >
                              Lamar
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="template-foot">
                  <div className="t-f-left">
                    <div className="t-f-l-body">
                      <div className="numbering">
                        <h6>Tentang Pekerjaan:</h6>
                        {e.tentang_lowongan
                          .split("\n")
                          .filter((filter) => filter.trim() !== "")
                          .map((e, i) => (
                            <div key={i} className="numbering-item">
                              <p>{i + 1}.</p>
                              <p>{e}</p>
                            </div>
                          ))}
                      </div>
                      <div className="numbering">
                        <h6>Persyaratan:</h6>
                        {e.syarat
                          .split("\n")
                          .filter((filter) => filter.trim() !== "")
                          .map((e, i) => (
                            <div key={i} className="numbering-item">
                              <p>{i + 1}.</p>
                              <p>{e}</p>
                            </div>
                          ))}
                      </div>
                      <div className="skill">
                        <h6>Keahlian:</h6>
                        <div className="s-wrap">
                          {JSON.parse(e.skill).map((e, i) => (
                            <div className="s-item" key={i}>
                              <p>{e}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className="t-f-l-body  t-f-l-b-wrap-company"
                      onClick={() => nav(`/perusahaan/${e.perusahaan_id}`)}
                    >
                      <div className="t-f-l-b-wrap">
                        <div className="body-left">
                          <h5>Tentang perusahaan</h5>
                          <p className="body-left-wraping">
                            {e.tentang_perusahaan}
                          </p>
                        </div>
                        <div className="body-right">
                          <img
                            src={
                              e.picture ? e.picture : "/profil-perusahaan.svg"
                            }
                            alt="gambar profil perusahaan"
                          />
                          <h6>{e.nama}</h6>
                          <p>{e.bidang}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="t-f-right">
                    <div className="t-f-l-body">
                      <div className="body-gaji">
                        <span>
                          <p>Gaji rata-rata</p>
                          <h4>
                            Rp {Number(e.gaji_min).toLocaleString("id")}-
                            {Number(e.gaji_max).toLocaleString("id")}
                          </h4>
                        </span>
                        <span>
                          <div className="b-g-detail">
                            <img src="/kategori.svg" alt="logo kategori" />
                            <span>
                              <h6>{e.kategori}</h6>
                              <p>Kategori</p>
                            </span>
                          </div>
                          <div className="b-g-detail">
                            <img src="/jenis.svg" alt="logo kategori" />
                            <span>
                              <h6>{e.jenis}</h6>
                              <p>Jenis Pekerjaan</p>
                            </span>
                          </div>
                          <div className="b-g-detail">
                            <img src="/tingkatan.svg" alt="logo kategori" />
                            <span>
                              <h6>{e.tingkatan}</h6>
                              <p>Tingkatan</p>
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="t-f-l-body">
                      {/* <div className="lowongan-lain-wrap">
                        <h6>Lowongan lain</h6>
                        {otherLowongan
                          .slice(0, 7)
                          .filter(
                            (job) =>
                              job.kategori === e.kategori &&
                              job.id_lowongan != e.id_lowongan
                          )
                          .map((list) => (
                            <div
                              className="lowongan-lain"
                              onClick={() => {
                                window.scrollTo({ top: 0 });
                                nav(`/lowongan/${list.id_lowongan}`);
                                window.location.reload();
                              }}
                              key={list.id_lowongan}
                            >
                              <h6>{list.posisi}</h6>
                              <span>
                                <img
                                  src={
                                    list.picture
                                      ? list.picture
                                      : "/profil-perusahaan.svg"
                                  }
                                  alt="profil perusahaan"
                                />
                                <p>{list.nama_Perusahaan}</p>
                                <img src="/dot1.svg" alt="dot" />
                                <p>{list.provinsi}</p>
                              </span>
                            </div>
                          ))}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
}
