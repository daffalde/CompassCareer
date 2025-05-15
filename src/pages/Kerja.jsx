import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lowongan from "../components/Lowongan";
import { lowongan } from "../data/Data";
import "../styles/lowongan.css";
import usePagination from "../components/Pagination";
import { Titik } from "../components/Bullet";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function Kerja() {
  const nav = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(lowongan, 10);

  const [searchResult, setSearchResult] = useState("");
  const [lokasiResult, setLokasiResult] = useState("");
  const [jenisResult, setJenisResult] = useState("");
  const [gajiMinResult, setGajiMinResult] = useState(0);
  const [gajiMaxResult, setGajiMaxResult] = useState(99999999999999);
  const [tanggalResult, SetTanggalResult] = useState(100000);
  const [kategoriResult, setKategoriResult] = useState("");
  const [lokasiFilterResult, setLokasiFilterResult] = useState("");

  function handleSearch(data) {
    setSearchResult(data.pekerjaan);
    setLokasiResult(data.lokasi);
    console.log(data);
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
                  job.nama.toLowerCase().includes(searchResult.toLowerCase()) &&
                  job.perusahaan.provinsi
                    .toLowerCase()
                    .includes(lokasiResult.toLowerCase()) &&
                  job.jenis.toLowerCase().includes(jenisResult.toLowerCase()) &&
                  moment(job.tanggal, "YYYYMMDD").isBetween(
                    startDate,
                    endDate,
                    "day",
                    "[]"
                  ) &&
                  job.gajiMin >= gajiMinResult &&
                  job.gajiMax <= gajiMaxResult &&
                  job.kategori
                    .toLowerCase()
                    .includes(kategoriResult.toLowerCase()) &&
                  job.perusahaan.provinsi
                    .toLowerCase()
                    .includes(lokasiFilterResult.toLocaleLowerCase())
              )
              .map((e) => (
                <div
                  onClick={() => nav(`/lowongan/${e.id}`)}
                  key={e.id}
                  onMouseOver={() => setHoveredItem(e.id)}
                  onMouseOut={() => setHoveredItem(null)}
                  className="k-l-item"
                >
                  <img
                    id="k-l-i-img"
                    src={e.perusahaan.profil}
                    alt="profil perusahaan dari lowongan"
                  />
                  <span>
                    <h5>{e.nama}</h5>
                    <p>{e.perusahaan.nama}</p>
                  </span>
                  <span id="k-l-i-location">
                    <img
                      src={
                        hoveredItem === e.id
                          ? "./location3.svg"
                          : "./location1.svg"
                      }
                      alt="icon lokasi dari lowongan"
                    />
                    <p>{e.perusahaan.provinsi}</p>
                  </span>
                  <span>
                    <p>{moment(e.tanggal, "YYYYMMDD").fromNow()}</p>
                    <h6>
                      Rp {Number(e.gajiMin).toLocaleString("id-ID")}-
                      {Number(e.gajiMax).toLocaleString("id-ID")}
                    </h6>
                  </span>
                  <div
                    className={`k-l-i-lihat ${
                      hoveredItem === e.id ? "k-l-i-lihat-on" : ""
                    }`}
                  >
                    {hoveredItem === e.id ? <p>Lihat</p> : null}
                    <img src="./pagig-arrow.svg" alt="arrow lihat detail" />
                  </div>
                  <div
                    className={`k-l-jenis ${
                      hoveredItem === e.id ? "k-l-jenis-on" : ""
                    }`}
                  >
                    <p>{e.jenis}</p>
                  </div>
                </div>
              ))}
          </div>
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
      </div>
      <Footer />
    </>
  );
}
