import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/status.css";
import { user } from "../data/Data";
import moment from "moment";
import usePagination from "../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import axios from "axios";
import { LoadingPage } from "../components/Loading";

export default function Status() {
  const nav = useNavigate();
  const [statusButton, setStatusButton] = useState("");
  const [cari, setCari] = useState("");
  const [popup, setPopup] = useState(false);
  const [popupId, setPopupId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataApplication, setDataApplication] = useState(null);
  const [user, setUser] = useState(null);

  // pemanggilan data dummy_______________________________________________________
  async function handleData() {
    try {
      const getData = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application?select=*,data_pelamar(*),lowongan(*,data_perusahaan(*)),cv(*)",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(getData.data);
      setDataApplication(getData.data);
      setUser(JSON.parse(sessionStorage.getItem("data")));
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    handleData();
  }, []);

  // pagination
  const itemsPerPage = 10;
  const data = Array.from(
    { length: dataApplication ? dataApplication.length : null },
    (_, i) => `Item ${i + 1}`
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const visibleItems = dataApplication
    ? dataApplication.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : null;

  // detail
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {/* popup */}
            <div
              onClick={() => setPopup(false)}
              className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                className={`popup-content ${popup ? "popup-content-off" : ""}`}
              >
                <div className="status-popup">
                  <div className="popup-navigation">
                    <img
                      onClick={() => setPopup(false)}
                      src="/left-arrow.png"
                      alt="icon back"
                    />
                    <h5>Detail Lamaran</h5>
                  </div>

                  <div className="status-b-detail-pop">
                    {popupId ? (
                      dataApplication
                        .filter((id) => id.id_application === popupId)
                        .map((e) => (
                          <div
                            className="status-b-d-content"
                            key={e.id_application}
                          >
                            <div className="status-b-d-head">
                              <div className="status-b-d-h-left">
                                <img
                                  src={
                                    e.lowongan.data_perusahaan.picture
                                      ? e.lowongan.data_perusahaan.picture
                                      : "/profil-perusahaan.svg"
                                  }
                                  alt="perusahaan profil image"
                                />
                                <div>
                                  <p>{e.lowongan.data_perusahaan.nama}</p>
                                  <h6>{e.lowongan.posisi}</h6>
                                  <span>
                                    <img src="/link.png" alt="link icon" />
                                    <Link to={`/lowongan/${e.id_lowongan}`}>
                                      Lihat
                                    </Link>
                                  </span>
                                </div>
                              </div>
                              <div className="status-b-d-h-right">
                                <p
                                  style={{
                                    backgroundColor: `${
                                      e.status === "Ditinjau"
                                        ? "#fde9bc"
                                        : e.status === "Diterima"
                                        ? "#c8f2da"
                                        : "#ffc3ce"
                                    }`,
                                  }}
                                >
                                  {e.status}
                                </p>
                                <p>
                                  {moment(e.created_at, "YYYYMMDD").fromNow()}
                                </p>
                              </div>
                            </div>
                            <div className="status-b-d-cv">
                              <img src="/pdf.svg" alt="pdf icon" />
                              <Link to={e.cv.link}>{e.cv.nama}</Link>
                            </div>
                            {e.surat ? (
                              <div
                                onClick={() =>
                                  setShowCoverLetter(!showCoverLetter)
                                }
                                className={`status-b-d-surat ${
                                  showCoverLetter ? "status-b-d-surat-on" : ""
                                }`}
                              >
                                <h6 style={{ marginBottom: "10px" }}>
                                  Cover letter
                                </h6>
                                <p>{e.surat}</p>
                              </div>
                            ) : null}
                            <div className="status-b-d-notes">
                              <h6 style={{ marginBottom: "10px" }}>
                                Informasi dari perusahaan
                              </h6>
                              {e.notes ? (
                                <p>{e.notes}</p>
                              ) : (
                                <p>Belum ada pesan.</p>
                              )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <>
                        <div className="status-b-d-idnull">
                          <img src="/left-arrow.png" alt="arrow icon" />
                          <span>
                            <h4>Pilih Lamaran yang Dikirim </h4>
                            <p>Tampilkan detail di sini</p>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ______________________________ */}
            <h3 className="heading-page">Status Lamaran</h3>
            <br />
            <div className="status-head">
              <form className="status-search">
                <img src="/search1.svg" alt="search icon" />
                <input
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  type="text"
                  placeholder="Cari lowongan..."
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
              <div className="status-b-wrap">
                {visibleItems
                  .filter(
                    (filter) =>
                      filter.status.includes(statusButton) &&
                      filter.lowongan.posisi
                        .toLowerCase()
                        .includes(cari.toLowerCase())
                  )
                  .map((e) => (
                    <button
                      onClick={() => {
                        setPopup(true);
                        setPopupId(e.id_application);
                      }}
                      className="status-b-item"
                      key={e.id_application}
                    >
                      <div className="status-b-i-info">
                        <img
                          src={
                            e.lowongan.data_perusahaan.picture
                              ? e.lowongan.data_perusahaan.picture
                              : "/profil-perusahaan.svg"
                          }
                          alt="gambar profil perusahaan"
                        />
                        <span>
                          <p>{e.lowongan.data_perusahaan.nama}</p>
                          <h6>{e.lowongan.posisi}</h6>
                          <p>
                            {e.lowongan.data_perusahaan.lokasi},{" "}
                            {e.lowongan.data_perusahaan.provinsi}
                          </p>
                        </span>
                      </div>
                      <div className="status-b-i-status">
                        <p
                          style={{
                            backgroundColor: `${
                              e.status === "Ditinjau"
                                ? "#fde9bc"
                                : e.status === "Diterima"
                                ? "#c8f2da"
                                : "#ffc3ce"
                            }`,
                          }}
                        >
                          {e.status}
                        </p>
                        <p>{moment(e.created_at).format("LL")}</p>
                      </div>
                    </button>
                  ))}
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
                    <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
                  </div>
                </div>
              </div>
              <div className="status-b-detail">
                {popupId ? (
                  dataApplication
                    .filter((id) => id.id_application === popupId)
                    .map((e) => (
                      <div
                        className="status-b-d-content"
                        key={e.id_application}
                      >
                        <div className="status-b-d-head">
                          <div className="status-b-d-h-left">
                            <img
                              src={
                                e.lowongan.data_perusahaan.picture
                                  ? e.lowongan.data_perusahaan.picture
                                  : "/profil-perusahaan.svg"
                              }
                              alt="perusahaan profil image"
                            />
                            <div>
                              <p>{e.lowongan.data_perusahaan.nama}</p>
                              <h6>{e.lowongan.posisi}</h6>
                              <span>
                                <img src="/link.png" alt="link icon" />
                                <Link to={`/lowongan/${e.id_lowongan}`}>
                                  Lihat
                                </Link>
                              </span>
                            </div>
                          </div>
                          <div className="status-b-d-h-right">
                            <p
                              style={{
                                backgroundColor: `${
                                  e.status === "Ditinjau"
                                    ? "#fde9bc"
                                    : e.status === "Diterima"
                                    ? "#c8f2da"
                                    : "#ffc3ce"
                                }`,
                              }}
                            >
                              {e.status}
                            </p>
                            <p>{moment(e.created_at, "YYYYMMDD").fromNow()}</p>
                          </div>
                        </div>
                        <div className="status-b-d-cv">
                          <img src="/pdf.svg" alt="pdf icon" />
                          <Link to={e.cv.link}>{e.cv.nama}</Link>
                        </div>
                        {e.surat ? (
                          <div
                            onClick={() => setShowCoverLetter(!showCoverLetter)}
                            className={`status-b-d-surat ${
                              showCoverLetter ? "status-b-d-surat-on" : ""
                            }`}
                          >
                            <h6 style={{ marginBottom: "10px" }}>
                              Cover letter
                            </h6>
                            <p>{e.surat}</p>
                          </div>
                        ) : null}
                        <div className="status-b-d-notes">
                          <h6 style={{ marginBottom: "10px" }}>
                            Informasi dari perusahaan
                          </h6>
                          {e.notes ? <p>{e.notes}</p> : <p>Belum ada pesan.</p>}
                        </div>
                      </div>
                    ))
                ) : (
                  <>
                    <div className="status-b-d-idnull">
                      <img src="/left-arrow.png" alt="arrow icon" />
                      <span>
                        <h4>Pilih Lamaran yang Dikirim </h4>
                        <p>Tampilkan detail di sini</p>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
