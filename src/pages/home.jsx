import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/home.css";
import { kategori } from "../data/Data";
import Footer from "../components/Footer";
import moment from "moment";
import Lowongan from "../components/Lowongan";
import { Skeleton } from "../components/Skeleton";
import { useGetAllLowongan } from "../api/Lowongan";
import { DataLogin } from "../data/DataLogin";
import { useState } from "react";
import { SideLowongan } from "../components/SideLowongan";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";

export default function Home() {
  const nav = useNavigate();
  const { data, loading } = useGetAllLowongan();
  const user = DataLogin();

  if (user.role) {
    console.log("ada");
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - 1150,
      behavior: "smooth",
    });
  };

  const [select, setSelect] = useState(null);
  return (
    <>
      <div className="container">
        <Header />
        {select !== null ? (
          <button onClick={() => setSelect(null)} className="side-back">
            <img src="/left-arrow.png" alt="back icon" />
            <p>Kembali</p>
          </button>
        ) : null}
        <div
          onClick={() => setSelect(null)}
          onScroll={(e) => e.stopPropagation()}
          className={`side-wrap ${select === null ? "side-wrap-off" : ""}`}
        ></div>
        {data ? (
          <SideLowongan
            data={data?.filter((e) => e.id_lowongan === select)}
            show={select !== null ? true : false}
          />
        ) : null}
        <div className="home">
          <img id="home-logo" src="/logo1.svg" alt="logo" />
          <div className="h-hero">
            <div className="h-h-title">
              <span>
                <h1>Temukan</h1> <h1>Pekerjaan</h1> <h1>Impianmu dengan</h1>{" "}
                <h1>Mudah!</h1>
              </span>
              <p>
                Unggah CV-mu dan biarkan teknologi machine learning kami
                mencocokkan profilmu dengan lowongan pekerjaan yang paling
                sesuai.
              </p>
              <div className="h-h-action">
                <button
                  onClick={() => nav("/lowongan")}
                  className="button-main"
                >
                  Memulai <img src="./right-arrow.svg" alt="arrow on button" />
                </button>
                <Link onClick={scrollToBottom}>Pelajari lebih lanjut</Link>
              </div>
            </div>
            <img id="h-h-img" src="./home1.png" alt="hero image" />
          </div>
          <div className="h-search">
            <Lowongan />
            <div onClick={() => nav("/lowongan")} className="h-s-wrap"></div>
          </div>
          <div className="h-kategori">
            <div className="h-k-title">
              <div className="the-void1"></div>
              <h4>
                Temukan kategori <br /> sesuai keahlian Anda.
              </h4>
            </div>
            <div className="h-k-list">
              {kategori
                .sort((a, b) => a.id - b.id)
                .slice(0, 10)
                .map((e, i) => (
                  <div
                    onClick={() => nav(`/lowongan?kategori=${e.nama}`)}
                    key={e.id}
                    className="h-k-l-item"
                  >
                    <img src={`/data/${e.nama}.svg`} alt="gambar kategori" />
                    <img
                      className="h-k-l-i-img2"
                      src="./arrow-diag1.svg"
                      alt="gambar panah selengkapnya kategori"
                    />
                    <p>{e.nama}</p>
                  </div>
                ))}
              <div className="h-k-l-item">
                <p>Lihat lebih banyak</p>
              </div>
            </div>
            <div className="grad1"></div>
            <div className="grad2"></div>
          </div>
          <div className="h-lowongan">
            <div className="h-l-list">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} width={"100%"} height={"220px"} />
                  ))
                : data
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6)
                    .map((e) => (
                      <div
                        className="h-l-l-item"
                        onClick={() => setSelect(e.id_lowongan)}
                        key={e.id_lowongan}
                      >
                        <span>
                          <p>{e.kategori}</p>
                          <h6>{e.posisi}</h6>
                        </span>
                        <div className="h-l-l-i-info">
                          <img src="./location1.svg" alt="location image" />
                          <p style={{ fontWeight: "600", color: "#212730" }}>
                            {e.provinsi}
                          </p>
                          <p>Full Time</p>
                        </div>
                        <div className="h-l-l-i-perusahaan">
                          <span>
                            <p>{moment(e.lowongan_created_at).fromNow()}</p>
                            <h6>{e.nama_perusahaan}</h6>
                          </span>
                          <img
                            src={
                              e.picture ? e.picture : "/profil-perusahaan.svg"
                            }
                            alt="perusahaan profil"
                          />
                        </div>
                      </div>
                    ))}
            </div>
            <div className="h-l-title">
              <h4>Lihat lowongan terbaru yang baru dipublikasikan</h4>
              <p>
                Temukan dan lamar lowongan terbaru yang baru dipublikasikan
                untuk mendapatkan peluang terbaik dalam mengembangkan karier
                Anda.
              </p>
              <button onClick={() => nav("/lowongan")} className="button-main">
                Lihat Lowongan
              </button>
            </div>
          </div>
          <br />
          <h4 style={{ textAlign: "center" }}>
            Langkah Mudah Menuju Karier Impian
          </h4>
          <p style={{ textAlign: "center" }}>
            Ikuti langkah mudah untuk menemukan pekerjaan terbaik yang sesuai
            dengan keahlian dan pengalaman Anda.
          </p>
          <br />
          <br />
          <div id="aboutuss" className="aboutus-timeline">
            <div className="a-t-left">
              <span className="a-t-b atb-show">
                <div className="a-t-blue">#1 Daftar & Buat Profil</div>
                <div className="a-t-desc">
                  <p>
                    Registrasi akun dan lengkapi profil dengan informasi pribadi
                    serta keahlian Anda.
                  </p>
                </div>
              </span>
              <span className="a-t-b atb-show">
                <div className="a-t-blue">#3 Temukan Pekerjaan</div>
                <div className="a-t-desc">
                  <p>
                    Jelajahi lowongan yang cocok dan dapatkan rekomendasi
                    otomatis berdasarkan CV Anda.
                  </p>
                </div>
              </span>
            </div>
            <div className="a-t-right">
              {/* hide first */}
              <span className="a-t-b-2 atb-hide">
                <div className="a-t-blue2">#1 Daftar & Buat Profil</div>
                <div className="a-t-desc2">
                  <p>
                    Registrasi akun dan lengkapi profil dengan informasi pribadi
                    serta keahlian Anda.
                  </p>
                </div>
              </span>
              {/* _______________________ */}
              <span className="a-t-b-2">
                <div className="a-t-blue2">#2 Unggah CV</div>
                <div className="a-t-desc2">
                  <p>
                    Tambahkan CV untuk mendapatkan rekomendasi pekerjaan sesuai
                    pengalaman dan keterampilan Anda.
                  </p>
                </div>
              </span>
              {/* hide first */}
              <span className="a-t-b-2 atb-hide">
                <div className="a-t-blue2">#3 Temukan Pekerjaan</div>
                <div className="a-t-desc2">
                  <p>
                    Jelajahi lowongan yang cocok dan dapatkan rekomendasi
                    otomatis berdasarkan CV Anda.
                  </p>
                </div>
              </span>
              {/* _______________________ */}
              <span className="a-t-b-2">
                <div className="a-t-blue2">#4 Lamar & Pantau Status</div>
                <div className="a-t-desc2">
                  <p>
                    Ajukan lamaran langsung dan pantau perkembangan proses
                    seleksi melalui dashboard.
                  </p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      {user.token ? (
        user.data.role === "pelamar" ? (
          <TabBarPelamar />
        ) : (
          <TabBarPerusahaan />
        )
      ) : (
        <TabBarGuest />
      )}
      <Footer />
    </>
  );
}
