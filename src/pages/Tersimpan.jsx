import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/tersimpan.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import usePagination from "../components/Pagination";
import { lowongan, perusahaan } from "../data/Data";
import { supabase } from "../data/supabaseClient";
import { LoadingPage } from "../components/Loading";

export default function Tersimpan() {
  const nav = useNavigate();
  const [halaman, setHalaman] = useState("lowongan");
  const [loading, setLoading] = useState(true);

  // dummy backend lowonan______________________________________________________________
  const [dataLowongan, setDataLowongan] = useState(null);
  async function getDataPelamar() {
    try {
      const user = JSON.parse(sessionStorage.getItem("data"));
      const dataTersimpanPick = await supabase
        .from("lowongan_tersimpan")
        .select("*,lowongan(*,data_perusahaan(*))")
        .eq("id_pelamar", user.id_pelamar);
      setDataLowongan(dataTersimpanPick.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  // dummy backend lowonan______________________________________________________________
  const [dataPerusahaan, setDataPerusahaan] = useState(null);
  async function getDataPerusahaan() {
    try {
      const user = JSON.parse(sessionStorage.getItem("data"));
      const dataTersimpanPick = await supabase
        .from("perusahaan_tersimpan")
        .select("*,data_perusahaan(*)")
        .eq("id_pelamar", user.id_pelamar);
      setDataPerusahaan(dataTersimpanPick.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getDataPelamar();
    getDataPerusahaan();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    dataLowongan ? dataLowongan.length : null / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems =
    halaman === "lowongan"
      ? dataLowongan
        ? dataLowongan.slice(startIndex, endIndex)
        : null
      : dataPerusahaan
      ? dataPerusahaan.slice(startIndex, endIndex)
      : null;

  //tombol hapus simpan lowongan
  async function hapusSimpanLowongan(e) {
    try {
      await supabase
        .from("lowongan_tersimpan")
        .delete()
        .eq("id_lowongan_tersimpan", e);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  //tombol hapus simpan perusahaan
  async function hapusSimpanPerusahaan(e) {
    try {
      await supabase
        .from("perusahaan_tersimpan")
        .delete()
        .eq("id_perusahaan_tersimpan", e);
      window.location.reload();
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
                    {currentItems ? (
                      currentItems.length !== 0 ? (
                        currentItems.map((e) => (
                          <div
                            onClick={() => nav(`/lowongan/${e.id_lowongan}`)}
                            className="lowongan-card"
                            key={e.id_lowongan}
                          >
                            <div className="l-c-wrap">
                              <div className="l-c-tanggal">
                                <p>
                                  {moment(
                                    e.lowongan.created_at.split("T")[0],
                                    "YYYYMMDD"
                                  ).fromNow()}
                                </p>
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    hapusSimpanLowongan(
                                      e.id_lowongan_tersimpan
                                    );
                                  }}
                                >
                                  <img src="/save2.svg" alt="save-logo" />
                                </button>
                              </div>
                              <div className="l-c-title">
                                <span>
                                  <p>{e.lowongan.data_perusahaan.nama}</p>
                                  <h5>{e.lowongan.posisi}</h5>
                                </span>
                                <img
                                  src={
                                    e.lowongan.data_perusahaan.picture
                                      ? e.lowongan.data_perusahaan.picture
                                      : "/profil-perusahaan.svg"
                                  }
                                  alt="gambar profil perusahaan"
                                />
                              </div>
                              <div className="l-c-skill">
                                {JSON.parse(e.lowongan.skill)
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
                                  {e.lowongan.gaji_min / 1000000 >= 1
                                    ? `${e.lowongan.gaji_min / 1000000}Jt`
                                    : `${e.lowongan.gaji_min / 1000}Rb`}
                                  -
                                  {e.lowongan.gaji_max / 1000000 >= 1
                                    ? `${e.lowongan.gaji_max / 1000000}Jt`
                                    : `${e.lowongan.gaji_max / 1000}Rb`}
                                </h6>
                                <p>{e.lowongan.data_perusahaan.provinsi}</p>
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
                    {currentItems ? (
                      currentItems.length !== 0 ? (
                        currentItems.map((e) => (
                          <div
                            className="p-b-list"
                            onClick={() =>
                              nav(`/perusahaan/${e.id_perusahaan_tersimpan}`)
                            }
                            key={e.id_perusahaan_tersimpan}
                          >
                            <button
                              className="p-b-l-save"
                              onClick={(event) => {
                                event.stopPropagation();
                                hapusSimpanPerusahaan(
                                  e.id_perusahaan_tersimpan
                                );
                              }}
                            >
                              <img src="/save2.svg" alt="save-logo" />
                            </button>
                            <img
                              className="p-b-l-img"
                              src={
                                e.data_perusahaan.picture
                                  ? e.data_perusahaan.picture
                                  : "/profil-perusahaan.svg"
                              }
                              alt="gambar profil perusahaan"
                            />
                            <div className="p-b-l-info">
                              <span>
                                <p style={{ color: "grey" }}>
                                  {e.data_perusahaan.bidang}
                                </p>
                                <h5>{e.data_perusahaan.nama}</h5>
                              </span>
                              <div>
                                <img src="/location1.svg" alt="icon lokasi" />
                                <p>
                                  {e.data_perusahaan.lokasi},{" "}
                                  {e.data_perusahaan.provinsi}
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
