import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/status.css";
import { user } from "../data/Data";
import moment from "moment";
import usePagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

export default function Status() {
  const nav = useNavigate();
  const [statusButton, setStatusButton] = useState("");
  const [cari, setCari] = useState("");
  const [popup, setPopup] = useState(false);
  const [popupId, setPopupId] = useState(null);

  const data = user[0].offer;

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(data, 8);

  return (
    <>
      <div className="container">
        <Header />
        {/* popup */}
        {popup && (
          <div onClick={() => setPopup(false)} className="status-popup">
            {data
              .filter((element) => element.id === popupId)
              .map((e) => (
                <div
                  onClick={(close) => close.stopPropagation()}
                  key={e.id}
                  className="s-p-content"
                >
                  <button
                    onClick={() => {
                      setPopup(false);
                      setPopupId(null);
                    }}
                    className="s-p-close"
                  >
                    <img width={"15px"} src="/close.svg" alt="close-icon" />
                  </button>
                  <div
                    onClick={(close) => {
                      close.stopPropagation();
                      nav(`/lowongan/${e.id}`);
                    }}
                    className="s-p-c-lowongan"
                  >
                    <img
                      src={e.lowongan.perusahaan.profil}
                      alt="logo perusahaan"
                    />
                    <span>
                      <p>{e.lowongan.perusahaan.nama}</p>
                      <h5>{e.lowongan.nama}</h5>
                    </span>
                  </div>
                  <div className="s-p-c-notes">
                    <span>
                      <p>Status</p>
                      <p
                        className="status-code"
                        style={{
                          backgroundColor: `${
                            e.status === "Ditinjau"
                              ? "#FFF4CC"
                              : e.status === "Diterima"
                              ? "#C7E9B0"
                              : "#F7C6C6"
                          }`,
                        }}
                      >
                        {e.status}
                      </p>
                    </span>
                    <span>
                      <p>Pengajuan</p>
                      <p>{moment(e.tanggal).format("LL")}</p>
                    </span>
                    <span>
                      <p>Pesan dari Perusahaan :</p>
                      <p>{e.notes ? e.notes : "-Belum ada pesan"}</p>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* ______________________________ */}
        <h4>Status Lamaran</h4>
        <br />
        <div className="status-head">
          <form className="status-search">
            <img src="/search1.svg" alt="search icon" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              type="text"
              placeholder="Cari..."
            />
          </form>
          <div className="status-filter">
            <button
              onClick={() => setStatusButton("")}
              className={`s-f-button ${
                statusButton === "" ? "s-f-button-on" : ""
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusButton("Ditinjau")}
              className={`s-f-button ${
                statusButton === "Ditinjau" ? "s-f-button-on" : ""
              }`}
            >
              Ditinjau
            </button>
            <button
              onClick={() => setStatusButton("Diterima")}
              className={`s-f-button ${
                statusButton === "Diterima" ? "s-f-button-on" : ""
              }`}
            >
              Diterima
            </button>
            <button
              onClick={() => setStatusButton("Ditolak")}
              className={`s-f-button ${
                statusButton === "Ditolak" ? "s-f-button-on" : ""
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>
        <br />
        <div className="status-body">
          {currentItems
            .filter(
              (element) =>
                element.status.includes(statusButton) &&
                element.lowongan.nama.toLowerCase().includes(cari.toLowerCase())
            )
            .map((e, i) => (
              <div
                onClick={() => {
                  setPopupId(e.id);
                  setPopup(true);
                }}
                className="s-b-item"
                key={e.id}
              >
                <div className="s-b-i-title">
                  <img
                    src={e.lowongan.perusahaan.profil}
                    alt="logo perusahaan"
                  />
                  <span>
                    <p>{e.lowongan.perusahaan.nama}</p>
                    <h6>{e.lowongan.nama}</h6>
                  </span>
                </div>
                <div className="s-b-status">
                  <p>{moment(e.tanggal).format("LL")}</p>
                  <p
                    className="status-code"
                    style={{
                      backgroundColor: `${
                        e.status === "Ditinjau"
                          ? "#FFF4CC"
                          : e.status === "Diterima"
                          ? "#C7E9B0"
                          : "#F7C6C6"
                      }`,
                    }}
                  >
                    {e.status}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {/* pagination */}
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
