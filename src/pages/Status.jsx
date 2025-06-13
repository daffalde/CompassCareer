import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/status.css";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingPage } from "../components/Loading";
import Cookies from "js-cookie";
import { NavBack } from "../components/Navigation";

export default function Status() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [statusButton, setStatusButton] = useState("");
  const [cari, setCari] = useState("");
  const [popup, setPopup] = useState(false);
  const [popupId, setPopupId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataApplication, setDataApplication] = useState(null);

  // pemanggilan data dummy_______________________________________________________
  async function handleData() {
    try {
      const getData = await axios.get(
        "https://careercompass-backend.vercel.app/data/app",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const getLowongan = await axios.get(
        `https://careercompass-backend.vercel.app/data/all-lowongan`
      );
      const getCv = await axios.get(
        "https://careercompass-backend.vercel.app/data/cv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const listDataLowongan = getLowongan.data.filter((e) =>
        getData.data.map((item) => item.id_lowongan).includes(e.id_lowongan)
      );

      const listDataApp = getData.data.filter(
        (e) => e.id_pelamar === userId.id_pelamar
      );
      const listDataCv = getCv.data.filter(
        (e) => e.id_pelamar === userId.id_pelamar
      );
      setDataApplication(
        listDataApp.map((e) => ({
          ...e,
          ...(listDataLowongan.find(
            (find) => find.id_lowongan === e.id_lowongan
          ) || {}),
          ...(listDataCv.find((find) => find.id_cv === e.id_cv) || {}),
        }))
      );
      console.log(
        listDataApp.map((e) => ({
          ...e,
          ...(listDataLowongan.find(
            (find) => find.id_lowongan === e.id_lowongan
          ) || {}),
          ...(listDataCv.find((find) => find.id_cv === e.id_cv) || {}),
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (!token || userId?.role === "perusahaan") {
      nav("/");
    }
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
        <NavBack title={"Status Lamaran"} />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {/* popup */}
            <div
              onClick={() => setPopup(false)}
              className={`popup-wrap popup-wrap-status ${
                popup ? "" : "popup-wrap-off"
              }`}
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
                                    e.picture
                                      ? e.picture
                                      : "/profil-perusahaan.svg"
                                  }
                                  alt="perusahaan profil image"
                                />
                                <div>
                                  <p>{e.nama}</p>
                                  <h6>{e.posisi}</h6>
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
                                  {moment(
                                    e.app_created_at,
                                    "YYYYMMDD"
                                  ).fromNow()}
                                </p>
                              </div>
                            </div>
                            <div className="status-b-d-cv">
                              <img src="/pdf.svg" alt="pdf icon" />
                              <Link to={e.link}>{e.nama}</Link>
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
                  placeholder="Cari .."
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
                  .sort(
                    (a, b) =>
                      new Date(b.app_created_at) - new Date(a.app_created_at)
                  )
                  .filter(
                    (filter) =>
                      filter.status.includes(statusButton) &&
                      filter.posisi.toLowerCase().includes(cari.toLowerCase())
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
                          src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                          alt="gambar profil perusahaan"
                        />
                        <span>
                          <p>{e.nama}</p>
                          <h6>{e.posisi}</h6>
                          <p>
                            {e.lokasi}, {e.provinsi}
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
                        <p>{moment(e.app_created_at).format("LL")}</p>
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
                                e.picture ? e.picture : "/profil-perusahaan.svg"
                              }
                              alt="perusahaan profil image"
                            />
                            <div>
                              <p>{e.nama_perusahaan}</p>
                              <h6>{e.posisi}</h6>
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
                              {moment(e.app_created_at, "YYYYMMDD").fromNow()}
                            </p>
                          </div>
                        </div>
                        <div className="status-b-d-cv">
                          <img src="/pdf.svg" alt="pdf icon" />
                          <Link to={e.link}>{e.nama}</Link>
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
                        <h4>Pilih Lamaran </h4>
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
