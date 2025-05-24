import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lowongan from "../components/Lowongan";
import { kategori, lowongan } from "../data/Data";
import "../styles/lowongan.css";
import usePagination from "../components/Pagination";
import { Titik } from "../components/Bullet";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import { LoadingPage } from "../components/Loading";

export default function Kerja() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // get data dummy_______________________________________________________
  async function getLowongan() {
    try {
      const dataLowongan = await supabase
        .from("lowongan")
        .select("*,data_perusahaan(*)");
      setData(dataLowongan.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLowongan();
  }, []);

  // _____________________________________________________________________

  // function pagination

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(loading === false ? data : kategori, 16);

  const url = useLocation();
  const params = new URLSearchParams(url.search);
  const queryKategori = params.get("kategori");

  const [searchResult, setSearchResult] = useState("");
  const [lokasiResult, setLokasiResult] = useState("");
  const [jenisResult, setJenisResult] = useState("");
  const [gajiMinResult, setGajiMinResult] = useState(0);
  const [gajiMaxResult, setGajiMaxResult] = useState(99999999999999);
  const [tanggalResult, SetTanggalResult] = useState(100000);
  const [kategoriResult, setKategoriResult] = useState(
    queryKategori == null ? "" : queryKategori
  );
  const [lokasiFilterResult, setLokasiFilterResult] = useState("");

  useEffect(() => {
    function getTop() {
      window.scrollTo({ top: 0 });
    }
    getTop();
  }, []);

  // function search & filter

  function handleSearch(data) {
    setSearchResult(data.pekerjaan);
    setLokasiResult(data.lokasi);
  }

  function handleJenis(data) {
    setJenisResult(data);
  }

  function handleTanggal(data) {
    if (data === "hari") {
      SetTanggalResult(1);
    }
    if (data === "minggu") {
      SetTanggalResult(7);
    }
    if (data === "bulan") {
      SetTanggalResult(30);
    }
    if (data === "tahun") {
      SetTanggalResult(360);
    }
  }

  const startDate = moment().subtract(tanggalResult, "days");
  const endDate = moment();

  function handleGaji(data) {
    if (data === "1-5") {
      setGajiMinResult(1000000);
      setGajiMaxResult(5000000);
    }
    if (data === "6-10") {
      setGajiMinResult(6000000);
      setGajiMaxResult(10000000);
    }
    if (data === "11-50") {
      setGajiMinResult(11000000);
      setGajiMaxResult(50000000);
    }
    if (data === "50") {
      setGajiMinResult(50000000);
      setGajiMaxResult(99999999999999);
    }
  }

  function handleKategori(data) {
    setKategoriResult(data);
  }
  function hanldeLokasi(data) {
    setLokasiFilterResult(data);
  }

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div className="kerja">
              <Lowongan
                onSearch={handleSearch}
                onJenis={handleJenis}
                onTanggal={handleTanggal}
                onGaji={handleGaji}
                onKategori={handleKategori}
                onLocation={hanldeLokasi}
              />
              <div className="k-list">
                {currentItems
                  .filter(
                    (job) =>
                      job.posisi
                        .toLowerCase()
                        .includes(searchResult.toLowerCase()) &&
                      job.data_perusahaan.provinsi
                        .toLowerCase()
                        .includes(lokasiResult.toLowerCase()) &&
                      job.jenis
                        .toLowerCase()
                        .includes(jenisResult.toLowerCase()) &&
                      moment(
                        job.created_at.split("T")[0],
                        "YYYYMMDD"
                      ).isBetween(startDate, endDate, "day", "[]") &&
                      job.gaji_min >= gajiMinResult &&
                      job.gaji_max <= gajiMaxResult &&
                      job.kategori
                        .toLowerCase()
                        .includes(kategoriResult.toLowerCase()) &&
                      job.data_perusahaan.provinsi
                        .toLowerCase()
                        .includes(lokasiFilterResult.toLocaleLowerCase())
                  )
                  .map((e) => (
                    <div
                      onClick={() => nav(`/lowongan/${e.id_lowongan}`)}
                      className="lowongan-card"
                      key={e.id}
                    >
                      <div className="l-c-wrap">
                        <div className="l-c-tanggal">
                          <p>
                            {moment(
                              e.created_at.split("T")[0],
                              "YYYYMMDD"
                            ).fromNow()}
                          </p>
                          <button>
                            <img src="/save1.svg" alt="save-logo" />
                          </button>
                        </div>
                        <div className="l-c-title">
                          <span>
                            <p>{e.data_perusahaan.nama}</p>
                            <h5>{e.posisi}</h5>
                          </span>
                          <img
                            src={
                              e.data_perusahaan.picture
                                ? e.data_perusahaan.picture
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
                          <p>{e.data_perusahaan.provinsi}</p>
                        </span>
                        <button className="button-main">Lihat</button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* pagination */}
              <div className="pagination">
                <div onClick={prevPage} className="p-arrow">
                  <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
                </div>
                {totalPages > 3 ? (
                  currentPage == totalPages ? (
                    <Titik />
                  ) : null
                ) : null}
                {Array.from({ length: 3 }, (_, i) => {
                  const pageNum = currentPage - 1 + i; // Menampilkan halaman saat ini dan 2 di sekitarnya
                  return (
                    pageNum >= 1 &&
                    pageNum <= totalPages && ( // Pastikan dalam batas halaman
                      <div
                        key={pageNum}
                        className={`p-item ${
                          currentPage === pageNum ? "pagig-on" : ""
                        }`}
                      >
                        <p onClick={() => page(pageNum)}>{pageNum}</p>
                      </div>
                    )
                  );
                })}
                {totalPages > 3 ? currentPage == 1 ? <Titik /> : null : null}
                <div onClick={nextPage} className="p-arrow">
                  <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
