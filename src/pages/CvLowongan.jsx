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
import { SideLowongan } from "../components/SideLowongan";
import { Skeleton } from "../components/Skeleton";

export default function CvLowongan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // get data _______________________________________________________
  async function getLowongan() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/data/all-lowongan"
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
  useEffect(() => {
    function getTop() {
      window.scrollTo({ top: 0 });
    }
    getTop();
  }, []);

  // select lowongan function
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
        <div className="kerja">
          <h4>Hasil pencarian berdasarkan CV anda.</h4>
          <br />
          <div className="k-list">
            {loading
              ? Array.from({ length: 20 }).map((_, i) => (
                  <Skeleton width={"100%"} height={"300px"} />
                ))
              : data
              ? data
                  .sort((a, b) => b.match_score - a.match_score)
                  .map((e) => (
                    <div
                      onClick={() => setSelect(e.id_lowongan)}
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
                              e.picture ? e.picture : "/profil-perusahaan.svg"
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
        </div>
      </div>
      <br />
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
