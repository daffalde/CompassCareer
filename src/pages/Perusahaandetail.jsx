import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import "../styles/template.css";
import "../styles/perusahaandetail.css";
import Footer from "../components/Footer";
import { LoadingPage } from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";

export default function Perusahaandetail() {
  const token = Cookies.get("token");
  const userData = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [lowongan, setLowongan] = useState(null);
  const [tersimpan, setTersimpan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function StayUp() {
      window.scrollTo({ top: 0 });
    }
    StayUp();
  }, []);

  // data dummy_______________________________________________________
  async function getPerusahaan() {
    try {
      const dataPerusahaan = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${urlId}`
      );
      const dataLowongan = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan`
      );
      if (token) {
        const dataTersimpan = await axios.get(
          "https://careercompass-backend.vercel.app/data/perusahaan-tersimpan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTersimpan(
          dataTersimpan.data?.filter(
            (e) =>
              e.id_pelamar === userData.id_pelamar &&
              e.id_perusahaan === Number(urlId)
          )[0]
        );
      }
      setLowongan(
        dataLowongan.data.filter((e) => e.perusahaan_id === Number(urlId))
      );
      setData(dataPerusahaan.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getPerusahaan();
  }, []);

  const user = JSON.parse(sessionStorage.getItem("data"));
  // logic simpan_______________________________________________
  const [simpanButton, setSimpanButton] = useState(true);
  const [idTersimpan, setIdTersimpan] = useState(null);

  // tombol simpan
  async function simpanLowongan() {
    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/data/perusahaan-tersimpan",
        {
          pelamar: userData.id_pelamar,
          lowongan: Number(urlId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getPerusahaan();
    } catch (e) {
      console.log(e);
    }
  }

  //tombol hapus simpan
  async function hapusSimpanLowongan() {
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/perusahaan-tersimpan/${urlId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getPerusahaan();
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          data.map((e) => (
            <div className="template" key={e.id_perusahaan}>
              <div className="template-head">
                <div className="t-h-top">
                  <img
                    src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                    alt="logo perusahaan"
                  />
                </div>
                <div className="t-h-bottom">
                  <div className="t-h-b-title">
                    <h4>{e.nama_perusahaan}</h4>
                    <p>{e.bidang}</p>
                  </div>
                  <div className="t-h-b-desc">
                    <span>
                      <p>
                        {e.lokasi},{e.provinsi}
                      </p>
                      <img src="/dot1.svg" alt="dot gap" />
                      <p>{e.karyawan} Karyawan</p>
                    </span>
                    {userData?.role === "pelamar" ? (
                      <span>
                        {tersimpan?.id_perusahaan === Number(urlId) ? (
                          <button
                            onClick={() => hapusSimpanLowongan(e.id_perusahaan)}
                            className="button-second"
                          >
                            Disimpan
                          </button>
                        ) : (
                          <button
                            onClick={() => simpanLowongan(e.id_perusahaan)}
                            className="button-second"
                          >
                            Simpan
                          </button>
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="template-foot">
                <div className="t-f-left">
                  <div className="t-f-l-body">
                    <div className="info-perusahaan">
                      <h6>Informasi Perusahaan</h6>
                      <span>
                        <p>Situs Web</p>
                        <p>{e.situs}</p>
                      </span>
                      <span>
                        <p>Email</p>
                        <p>{e.email}</p>
                      </span>
                      <span>
                        <p>Tahun didirikan</p>
                        <p>{e.tahun_didirikan}</p>
                      </span>
                      <span>
                        <p>Industri</p>
                        <p>{e.bidang}</p>
                      </span>
                    </div>
                  </div>
                  <div className="t-f-l-body">
                    <div className="paragraph">
                      <h6>Tentang Kami</h6>
                      <p>{e.tentang}</p>
                    </div>
                    <div className="numbering">
                      <h6>Visi:</h6>
                      {e.visi.split("\n").map((e, i) => (
                        <div key={i} className="numbering-item">
                          <p>{i + 1}.</p>
                          <p>{e}</p>
                        </div>
                      ))}
                    </div>
                    <div className="numbering">
                      <h6>Misi:</h6>
                      {e.misi.split("\n").map((e, i) => (
                        <div key={i} className="numbering-item">
                          <p>{i + 1}.</p>
                          <p>{e}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="t-f-right">
                  <div className="t-f-l-body">
                    <div className="lowongan-lain-wrap">
                      <h6>Lowongan di perusahaan ini </h6>
                      {lowongan.slice(0, 7).map((list) => (
                        <div
                          onClick={() => nav(`/lowongan/${list.id_lowongan}`)}
                          className="lowongan-lain"
                          key={list.id_lowongan}
                        >
                          <h6>{list.posisi}</h6>
                          <span>
                            <img
                              src={
                                e.picture ? e.picture : "/profil-perusahaan.svg"
                              }
                              alt="profil perusahaan"
                            />
                            <p>{e.nama}</p>
                            <img src="/dot1.svg" alt="dot" />
                            <p>{e.provinsi}</p>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
