import { useState } from "react";
import Header from "../components/Header";
import { provinsi } from "../data/Provinsi";
import "../styles/perusahaan.css";
import { lowongan, perusahaan } from "../data/Data";
import Footer from "../components/Footer";
import usePagination from "../components/Pagination";

export default function Perusahaan() {
  const [lokasi, setLokasi] = useState("");

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(perusahaan, 10);
  return (
    <>
      <div className="container">
        <Header />
        <div
          style={{ backgroundImage: `url("/building-header.jpg")` }}
          className="perusahaan-head"
        >
          <span>
            <h2>Temukan Perusahaan Impian untuk Karier Anda</h2>
            <p>
              Jelajahi peluang kerja dari berbagai perusahaan terbaik untuk
              karier Anda.
            </p>
          </span>
          <div className="p-h-search">
            <form>
              <span>
                <img src="/search1.svg" alt="search logo" />
                <input type="text" placeholder="Cari Perusahaan...." />
              </span>
              <div className="perusahaan-gap"></div>
              <span>
                <img src="/location4.svg" alt="location logo" />
                <input
                  list="prov"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  type="text"
                  placeholder="Lokasi?"
                />
                <datalist id="prov">
                  {lokasi.length >= 2 &&
                    provinsi.map((provinsi) => (
                      <option key={provinsi.id} value={provinsi.name}></option>
                    ))}
                </datalist>
              </span>
              <button>Cari</button>
            </form>
          </div>
        </div>
        <div className="perusahaan-body">
          {currentItems.map((e) => (
            <div className="p-b-list" key={e.id}>
              <button className="p-b-l-save">
                <img src="/save1.svg" alt="save icon" />
              </button>
              <img
                className="p-b-l-img"
                src={e.profil}
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
                <p>
                  {e.lowongan.length === 0
                    ? `Belum ada lowongan yang tersedia`
                    : `Ada ${e.lowongan.length} lowongan tersedia`}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <div onClick={prevPage} className="p-arrow">
            <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
          </div>
          {totalPages > 3 ? currentPage == totalPages ? <Titik /> : null : null}
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
      <Footer />
    </>
  );
}
