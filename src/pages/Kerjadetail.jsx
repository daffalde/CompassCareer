import moment from "moment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { lowongan } from "../data/Data";
import "../styles/lowongandetail.css";
import "../styles/template.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { LoadingButton, LoadingPage } from "../components/Loading";
import axios from "axios";
import { AlertFailed, AlertSucceed } from "../components/Alert";
import Cookies from "js-cookie";

export default function Kerjadetail() {
  const getId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const url = window.location.pathname;
  const urlId = url.split("/").pop();

  const [dataLowongan, setDataLowongan] = useState(null);
  const [otherLowongan, setOtherLowongan] = useState(null);
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
      setOtherLowongan(resp2.data);
      setDataLowongan(resp.data);
      console.log(resp.data);
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
  const [simpanButton, setSimpanButton] = useState(true);
  const [idTersimpan, setIdTersimpan] = useState(null);
  // async function cekSimpan() {
  //   const userId = JSON.parse(sessionStorage.getItem("data"));
  //   const ceking = await supabase
  //     .from("lowongan_tersimpan")
  //     .select("*")
  //     .eq("id_pelamar", userId.id_pelamar);
  //   const dataCek = ceking.data.filter((e) => e.id_lowongan === Number(urlId));
  //   if (dataCek[0]) {
  //     setIdTersimpan(dataCek[0].id_lowongan_tersimpan);
  //     setSimpanButton(false);
  //   }
  // }

  // useEffect(() => {
  //   cekSimpan();
  // }, []);
  // tombol simpan
  async function simpanLowongan(e) {
    try {
      await axios.post("http://localhost:5000/data/lowongan-tersimpan", {
        pelamar: getId.id_pelamar ? getId.id_pelamar : null,
        lowongan: urlId,
      });
    } catch (e) {
      console.log(e);
    }
  }

  //tombol hapus simpan
  async function hapusSimpanLowongan() {
    try {
      await supabase
        .from("lowongan_tersimpan")
        .delete()
        .eq("id_lowongan_tersimpan", idTersimpan);
      window.location.reload();
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
          "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application",
          {
            id_lowongan: Number(urlId),
            id_cv: takeIdCv,
            id_pelamar: user.id_pelamar,
            surat: inputSurat.current.value,
            status: "Ditinjau",
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
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
                    <div
                      onClick={() => nav("/profil")}
                      className="apply-b-c-profil"
                    >
                      <img
                        src={
                          user
                            ? user.data_pelamar.picture
                            : "/profil-pelamar.svg"
                        }
                        alt="foto profil pelamar"
                      />
                      <span>
                        <p>{user ? user.data_pelamar.spesialis : null}</p>
                        <h5>{user ? user.nama : null}</h5>
                        <p>{user ? user.email : null}</p>
                      </span>
                      <img height={"20px"} src="/right.png" alt="arrow icon" />
                    </div>
                    <br />
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
                        {user
                          ? user.data_pelamar.cv
                            ? user.data_pelamar.cv.map((e) => (
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
                            : null
                          : null}{" "}
                        {/* buat function buat nambah cv________________________________________ */}
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
                      {getId.role === "pelamar" ? (
                        <span>
                          {simpanButton ? (
                            <button
                              onClick={() => simpanLowongan(e.id_lowongan)}
                              className="button-second"
                            >
                              Simpan
                            </button>
                          ) : (
                            <button
                              onClick={() => hapusSimpanLowongan(e.id_lowongan)}
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
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="template-foot">
                  <div className="t-f-left">
                    <div className="t-f-l-body">
                      <div className="numbering">
                        <h6>Tentang Pekerjaan:</h6>
                        {e.tentang_lowongan.split("\n").map((e, i) => (
                          <div key={i} className="numbering-item">
                            <p>{i + 1}.</p>
                            <p>{e}</p>
                          </div>
                        ))}
                      </div>
                      <div className="numbering">
                        <h6>Persyaratan:</h6>
                        {e.syarat.split("\n").map((e, i) => (
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
                    <div className="t-f-l-body">
                      <div className="t-f-l-b-wrap">
                        <div className="body-left">
                          <h5>Tentang perusahaan</h5>
                          <p>{e.tentang_perusahaan}</p>
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
                      <div className="lowongan-lain-wrap">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
