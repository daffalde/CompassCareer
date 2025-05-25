import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/status.css";
import { user } from "../data/Data";
import moment from "moment";
import usePagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
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

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {/* popup */}
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
              <div className="status-b-header">
                <h6>Lowongan</h6>
                <h6>Tanggal Dikirim</h6>
                <h6>Status</h6>
                <h6></h6>
              </div>
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
                    <div className="status-b-item" key={e.id_application}>
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
                      <div className="status-b-i-date">
                        <p>{moment(e.created_at).format("LL")}</p>
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
                      </div>
                      <div className="status-b-i-action">
                        <img src="/right.png" alt="arrow right icon" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* pagination */}
            <div className="pagination">
              <div
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
