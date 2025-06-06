import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/profil.css";
import "../styles/template.css";
import { provinsi } from "../data/Provinsi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";

export default function ProfilPelamar() {
  const nav = useNavigate();
  const user = JSON.parse(Cookies.get("data"));
  const token = Cookies.get("token");
  const [loadingPage, setLoadingPage] = useState(true);
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  // _______________________________________________________________________________
  const [data, setData] = useState(null);
  const [lowongan, setLowongan] = useState(null);
  const [cvData, setCvData] = useState(null);
  async function getData() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/pelamar/${urlId}`
      );
      const resp2 = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      const resp3 = await axios.get(
        "https://careercompass-backend.vercel.app/data/cv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCvData(resp3.data.filter((e) => e.id_pelamar === Number(urlId)));
      setLowongan(resp2.data);
      setData(resp.data[0]);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <>
          <div className="container">
            <Header />
            <div className="template-head">
              <div className="t-h-top">
                <img
                  src={data.profil ? data.profil : "/profil-pelamar.svg"}
                  alt="gambar profil user"
                />
                <div
                  onClick={() => setHandleImage(true)}
                  className="t-h-t-edit"
                >
                  <img src="/pencil.svg" alt="pencil icon" />
                </div>
              </div>
              <div className="t-h-bottom">
                <div className="t-h-b-title">
                  <h4>{data.nama_pelamar}</h4>
                  <p>{data.email}</p>
                </div>
                <div className="t-h-b-desc">
                  <span>
                    <p>
                      {data.lokasi},{data.provinsi}
                    </p>
                    <img src="/dot1.svg" alt="dot gap" />
                    <p>{data.spesialis}</p>
                  </span>
                </div>
              </div>
            </div>
            <br />
            <div className="template-foot">
              <div className="t-f-left">
                <div className="t-f-l-body">
                  <div className="paragraph">
                    <span className="t-f-l-b-title">
                      <h6>Ringkasan pribadi</h6>
                    </span>
                    <p>{data.tentang}</p>
                  </div>
                  <div className="skill">
                    <h6>Keahlian:</h6>
                    <div className="s-wrap">
                      {data.skill
                        ? JSON.parse(data.skill).map((e, i) => (
                            <div className="s-item" key={i}>
                              <p>{e}</p>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                  <div className="cv-list">
                    <h6>CV Tersimpan:</h6>
                    <p>
                      Unggah CV untuk lamaran dan akses mudah di mana pun Anda
                      berada.
                    </p>
                    <div className="cv-l-wrap">
                      {cvData
                        ? cvData
                            .sort(
                              (a, b) =>
                                new Date(b.created_at) - new Date(a.created_at)
                            )
                            .map((e) => (
                              <div
                                onClick={() => window.open(e.link)}
                                className="cv-l-item"
                                key={e.id}
                              >
                                <img
                                  id="pdf-image"
                                  src="/pdf.svg"
                                  alt="pdf logo"
                                />
                                <h6>{e.nama}</h6>
                                <span>
                                  <p>{e.size / 1000} Kb</p>
                                  <p>{moment(e.tanggal).format("LL")}</p>
                                </span>
                              </div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-f-right">
                <div className="t-f-l-body">
                  <div className="lowongan-lain-wrap">
                    <h6>Lowongan lain</h6>
                    {lowongan
                      .slice(Math.random() * lowongan.length, 7)
                      .map((list) => (
                        <div
                          className="lowongan-lain"
                          onClick={() => {
                            window.scrollTo({ top: 0 });
                            nav(`/lowongan/${list.id_lowongan}`);
                          }}
                          key={list.id_lowongan}
                        >
                          <h6>{list.posisi}</h6>
                          <span>
                            <img src={list.picture} alt="profil perusahaan" />
                            <p>{list.nama_perusahaan}</p>
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
          <br />
          <br />
          <Footer />
        </>
      )}
    </>
  );
}
