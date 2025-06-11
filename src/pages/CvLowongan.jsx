import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lowongan from "../components/Lowongan";
import "../styles/lowongan.css";
import Cookies from "js-cookie";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingPage } from "../components/Loading";
import axios from "axios";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";

export default function CvLowongan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // get data _______________________________________________________
  async function getLowongan() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      const cvData = JSON.parse(localStorage.getItem("data"));

      const filterisasi = resp.data.filter((e) =>
        cvData.some((cv) => cv.id_lowongan === e.id_lowongan)
      );

      setData(
        filterisasi.map((e) => {
          const skor = cvData.find(
            (cv) => cv.id_lowongan === e.id_lowongan
          )?.match_score;
          return { ...e, match_score: Math.round(skor * 100) };
        })
      );

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("data"))) {
      nav("/lowongan");
    }
    getLowongan();
  }, []);

  // _____________________________________________________________________

  // Hitung pagination
  const totalPages = Math.ceil(data ? data.length / itemsPerPage : null);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data ? data.slice(startIndex, endIndex) : null;

  useEffect(() => {
    function getTop() {
      window.scrollTo({ top: 0 });
    }
    getTop();
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div className="kerja">
              <h4 style={{ textAlign: "center" }}>
                Hasil pencarian berdasarkan CV anda
              </h4>
              <br />
              <div className="k-list">
                {currentItems
                  ? currentItems
                      .sort((a, b) => b.match_score - a.match_score)
                      .map((e) => (
                        <div
                          onClick={() => nav(`/lowongan/${e.id_lowongan}`)}
                          className="lowongan-card"
                          key={e.id_lowongan}
                        >
                          <div className="l-c-wrap">
                            <div className="l-c-tanggal">
                              <p>
                                {moment(
                                  e.lowongan_created_at.split("T")[0],
                                  "YYYYMMDD"
                                ).fromNow()}
                              </p>
                              <div className="match-score">
                                <h5>{e.match_score}%</h5>
                                <p>Relevansi</p>
                              </div>
                            </div>
                            <div className="l-c-title">
                              <span>
                                <p>{e.nama_perusahaan}</p>
                                <h5>{e.posisi}</h5>
                              </span>
                              <img
                                src={
                                  e.picture
                                    ? e.picture
                                    : "/profil-perusahaan.svg"
                                }
                                alt="gambar profil perusahaan"
                              />
                            </div>
                            <div className="l-c-skill">
                              {JSON.parse(e.skill) ? (
                                JSON.parse(e.skill).map((skill, index) => (
                                  <p key={index}>{skill}</p>
                                ))
                              ) : (
                                <p>Belum ada data</p>
                              )}
                            </div>
                          </div>
                          <div className="l-c-action">
                            <span>
                              <h6>
                                Rp{" "}
                                {e.gaji_min / 1000000 >= 1
                                  ? `${e.gaji_min / 1000000}Jt`
                                  : `${e.gaji_min / 1000}Rb`}
                                -
                                {e.gaji_max / 1000000 >= 1
                                  ? `${e.gaji_max / 1000000}Jt`
                                  : `${e.gaji_max / 1000}Rb`}
                              </h6>
                              <p>{e.provinsi}</p>
                            </span>
                            <button className="button-main">Lihat</button>
                          </div>
                        </div>
                      ))
                  : null}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <div
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="p-arrow"
                >
                  <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
                </div>
                {Array.from({ length: totalPages }, (_, i) => (
                  <div
                    key={i}
                    className={`p-item ${
                      currentPage === i + 1 ? "pagig-on" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    <p>{i + 1}</p>
                  </div>
                ))}
                <div
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="p-arrow"
                >
                  <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {token ? (
        userId?.role === "pelamar" ? (
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
