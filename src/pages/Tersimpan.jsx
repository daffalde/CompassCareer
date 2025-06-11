import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/tersimpan.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import { LoadingPage } from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { NavBack } from "../components/Navigation";

export default function Tersimpan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [halaman, setHalaman] = useState("lowongan");
  const [loading, setLoading] = useState(true);

  // dummy backend lowonan______________________________________________________________
  const [dataLowongan, setDataLowongan] = useState(null);
  const [dataPerusahaan, setDataPerusahaan] = useState(null);
  async function getAllData() {
    setLoading(true);
    try {
      const lowonganTersimpan = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan-tersimpan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const lowongan = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan`
      );
      const perusahaanTersimpan = await axios.get(
        `https://careercompass-backend.vercel.app/data/perusahaan-tersimpan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const perusahaan = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan`
      );
      setDataLowongan(
        lowongan.data.filter((e) =>
          lowonganTersimpan.data
            .map((item) => item.id_lowongan)
            .includes(e.id_lowongan)
        )
      );

      setDataPerusahaan(
        perusahaan.data.filter((e) =>
          perusahaanTersimpan.data
            .map((item) => item.id_perusahaan)
            .includes(e.id_perusahaan)
        )
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || user?.role === "perusahaan") {
      nav("/");
    }
    getAllData();
  }, []);

  // pagination lowongan
  const itemsPerPage = 6;
  const data = Array.from(
    { length: dataLowongan ? dataLowongan.length : null },
    (_, i) => `Item ${i + 1}`
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const visibleItems = dataLowongan
    ? dataLowongan.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : null;

  // pagination perusahaan
  const itemsPerPagee = 6;
  const dataa = Array.from(
    { length: dataPerusahaan ? dataPerusahaan.length : null },
    (_, i) => `Item ${i + 1}`
  );

  const [currentPagee, setCurrentPagee] = useState(1);
  const totalPagess = Math.ceil(dataa.length / itemsPerPagee);

  const visibleItemss = dataPerusahaan
    ? dataPerusahaan.slice(
        (currentPagee - 1) * itemsPerPagee,
        currentPagee * itemsPerPagee
      )
    : null;

  return (
    <>
      <div className="container">
        <Header />
        <NavBack title={"Tersimpan"} />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div className="tersimpan-head">
              <button
                onClick={() => setHalaman("lowongan")}
                className={`tersimpan-head-button ${
                  halaman == "lowongan" ? "tersimpan-head-button-on" : ""
                }`}
              >
                Lowongan
              </button>
              <button
                onClick={() => setHalaman("perusahaan")}
                className={`tersimpan-head-button ${
                  halaman == "perusahaan" ? "tersimpan-head-button-on" : ""
                }`}
              >
                Perusahaan
              </button>
            </div>
            <div className="tersimpan-body">
              {halaman === "lowongan" ? (
                <>
                  <h4>Lowongan Tersimpan</h4>
                  <br />
                  <div className="t-b-lowongan-wrap">
                    {visibleItems ? (
                      visibleItems.length !== 0 ? (
                        visibleItems.map((e) => (
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
                                {JSON.parse(e.skill)
                                  .slice(0, 5)
                                  .map((skill, index) => (
                                    <p key={index}>{skill}</p>
                                  ))}
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
                      ) : (
                        <p>Belum ada data.</p>
                      )
                    ) : null}
                  </div>
                  <br />
                  {/* pagination */}
                  <div className="pagination">
                    <div
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="p-arrow"
                    >
                      <img
                        src="./pagig-arrow2.svg"
                        alt="tanda panah pagination"
                      />
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
                      <img
                        src="./pagig-arrow.svg"
                        alt="tanda panah pagination"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h4>Perusahaan Tersimpan</h4>
                  <br />
                  <div className="t-b-perushaan-wrap">
                    {visibleItemss ? (
                      visibleItemss.length !== 0 ? (
                        visibleItemss.map((e) => (
                          <div
                            className="p-b-list"
                            onClick={() =>
                              nav(`/perusahaan/${e.id_perusahaan}`)
                            }
                            key={e.id_perusahaan}
                          >
                            <img
                              className="p-b-l-img"
                              src={
                                e.picture ? e.picture : "/profil-perusahaan.svg"
                              }
                              alt="gambar profil perusahaan"
                            />
                            <div className="p-b-l-info">
                              <span>
                                <p style={{ color: "grey" }}>{e.bidang}</p>
                                <h5>{e.nama}</h5>
                              </span>
                              <div>
                                <img src="/location1.svg" alt="icon lokasi" />
                                <p>
                                  {e.lokasi}, {e.provinsi}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Belum ada data.</p>
                      )
                    ) : (
                      <p>Belum ada data.</p>
                    )}
                  </div>
                  <br />
                  {/* pagination */}
                  <div className="pagination">
                    <div
                      onClick={() =>
                        setCurrentPagee((prev) => Math.max(prev - 1, 1))
                      }
                      className="p-arrow"
                    >
                      <img
                        src="./pagig-arrow2.svg"
                        alt="tanda panah pagination"
                      />
                    </div>
                    {Array.from({ length: totalPagess }, (_, i) => (
                      <div
                        key={i}
                        className={`p-item ${
                          currentPagee === i + 1 ? "pagig-on" : ""
                        }`}
                        onClick={() => setCurrentPagee(i + 1)}
                      >
                        <p>{i + 1}</p>
                      </div>
                    ))}
                    <div
                      onClick={() =>
                        setCurrentPagee((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      className="p-arrow"
                    >
                      <img
                        src="./pagig-arrow.svg"
                        alt="tanda panah pagination"
                      />
                    </div>
                  </div>
                </>
              )}
              <br />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
