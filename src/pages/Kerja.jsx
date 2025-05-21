import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lowongan from "../components/Lowongan";
import { lowongan } from "../data/Data";
import "../styles/lowongan.css";
import usePagination from "../components/Pagination";
import { Titik } from "../components/Bullet";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";

export default function Kerja() {
  const nav = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(lowongan, 16);

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
                  className="lowongan-card"
                  key={e.id}
                >
                  <div className="l-c-wrap">
                    <div className="l-c-tanggal">
                      <p>{moment(e.tanggal).format("LL")}</p>
                      <button>
                        <img src="/save1.svg" alt="save-logo" />
                      </button>
                    </div>
                    <div className="l-c-title">
                      <span>
                        <p>{e.perusahaan.nama}</p>
                        <h5>{e.nama}</h5>
                      </span>
                      <img
                        src={e.perusahaan.profil}
                        alt="gambar profil perusahaan"
                      />
                    </div>
                    <div className="l-c-skill">
                      {e.skill.slice(0, 5).map((skill, index) => (
                        <p key={index}>{skill}</p>
                      ))}
                    </div>
                  </div>
                  <div className="l-c-action">
                    <span>
                      <h6>
                        Rp.
                        {e.gajiMin / 1000000 >= 1
                          ? `${e.gajiMin / 1000000}Jt`
                          : `${e.gajiMin / 1000}Rb`}
                        -
                        {e.gajiMax / 1000000 >= 1
                          ? `${e.gajiMax / 1000000}Jt`
                          : `${e.gajiMax / 1000}Rb`}
                      </h6>
                      <p>{e.perusahaan.provinsi}</p>
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
      </div>
      <Footer />
    </>
  );
}
