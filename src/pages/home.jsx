import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/home.css";
import Lowongan from "../components/Lowongan";
import { HomeKategori } from "../data/DataSecondary";
import { kategori, lowongan } from "../data/Data";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const nav = useNavigate();
  return (
    <>
      <div className="container">
        <Header />
        <div className="home">
          <div className="h-hero">
            <div className="h-h-title">
              <h1>Temukan Pekerjaan Impianmu dengan Mudah!</h1>
              <p>
                Unggah CV-mu dan biarkan teknologi machine learning kami
                mencocokkan profilmu dengan lowongan pekerjaan yang paling
                sesuai.
              </p>
              <div className="h-h-action">
                <button className="button-main">
                  Memulai <img src="./right-arrow.svg" alt="arrow on button" />
                </button>
                <Link to={"/tentang"}>Pelajari lebih lanjut</Link>
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
              {kategori.slice(0, 10).map((e, i) => (
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
              {lowongan.slice(0, 6).map((e) => (
                <div
                  className="h-l-l-item"
                  onClick={() => nav(`/lowongan/${e.id}`)}
                  key={e.id}
                >
                  <span>
                    <p>{e.kategori}</p>
                    <h6>{e.nama}</h6>
                  </span>
                  <div className="h-l-l-i-info">
                    <img src="./location1.svg" alt="location image" />
                    <p style={{ fontWeight: "600", color: "#212730" }}>
                      Jakarta Selatan
                    </p>
                    <p>Full Time</p>
                  </div>
                  <div className="h-l-l-i-perusahaan">
                    <span>
                      <p>{e.tanggal}</p>
                      <h6>{e.perusahaan.nama}</h6>
                    </span>
                    <img src="./data/perusahaan1.png" alt="perusahaan profil" />
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
              <button className="button-main">Lihat Lowongan</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
