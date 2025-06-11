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

export default function Kerja() {
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
      setData(resp.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getLowongan();
  }, []);

  // _____________________________________________________________________

  // Hitung pagination
  const totalPages = Math.ceil(data ? data.length / itemsPerPage : null);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data ? data.slice(startIndex, endIndex) : null;

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
                  ? currentItems
                      .filter(
                        (job) =>
                          job?.posisi
                            ?.toLowerCase()
                            .includes(searchResult.toLowerCase()) &&
                          job?.provinsi
                            ?.toLowerCase()
                            .includes(lokasiResult.toLowerCase()) &&
                          job?.jenis
                            ?.toLowerCase()
                            .includes(jenisResult.toLowerCase()) &&
                          moment(
                            job?.lowongan_created_at?.split("T")[0],
                            "YYYYMMDD"
                          ).isBetween(startDate, endDate, "day", "[]") &&
                          job?.gaji_min >= gajiMinResult &&
                          job?.gaji_max <= gajiMaxResult &&
                          job?.kategori
                            ?.toLowerCase()
                            .includes(kategoriResult.toLowerCase()) &&
                          job?.provinsi
                            ?.toLowerCase()
                            .includes(lokasiFilterResult.toLocaleLowerCase())
                      )

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
