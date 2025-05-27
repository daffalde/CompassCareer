import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/daftarpelamar.css";
import axios from "axios";
import { LoadingPage } from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { StatusApp } from "../components/StatusApp";
import moment from "moment";
import { AlertSucceed } from "../components/Alert";

export default function DaftarPelamar() {
  const nav = useNavigate();
  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  async function getData() {
    try {
      const getDataApplication = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application?select=*,lowongan(*,data_perusahaan(*)),cv(*),data_pelamar(*,pelamar(nama,email))",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(getDataApplication.data);
      setData(getDataApplication.data);
      setUser(JSON.parse(sessionStorage.getItem("data")));
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalItem = 12;

  const totalPages = Math.ceil(data ? data.length / totalItem : null);
  const firstIndex = (currentPage - 1) * totalItem;
  const lastIndex = firstIndex + totalItem;
  const dataPagination = data ? data.slice(firstIndex, lastIndex) : null;

  // pop up
  const [popup, setPopup] = useState(false);
  const [getId, setGetId] = useState(null);
  const inputNotes = useRef(null);

  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFailed, setAlertFailed] = useState(false);

  // button function
  async function handleTolak(e) {
    try {
      await axios.patch(
        `https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application?id_application=eq.${e}`,
        {
          notes: inputNotes.current.value,
          status: "Ditolak",
        },
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      setAlertSuccess(true);
      setPopup(false);
      getData();
    } catch (e) {
      console.log(e);
      setAlertFailed(true);
    }
  }

  async function handleTerima(e) {
    try {
      await axios.patch(
        `https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application?id_application=eq.${e}`,
        {
          notes: inputNotes.current.value,
          status: "Diterima",
        },
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      setAlertSuccess(true);
      setPopup(false);
      getData();
    } catch (e) {
      console.log(e);
      setAlertFailed(true);
    }
  }

  // function time
  useEffect(() => {
    if (alertSuccess || alertFailed) {
      const timeout = setTimeout(() => {
        setAlertFailed(false);
        setAlertSuccess(false);
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, []);
  return (
    <>
      <div className="container">
        <Header />
        {loadingPage ? (
          <LoadingPage />
        ) : (
          <>
            {alertSuccess ? (
              <AlertSucceed message={"Berhasil terikirm"} />
            ) : null}
            {alertFailed ? <AlertSucceed message={"Gagal terikirm"} /> : null}
            {/* pop up_______________________________ */}
            <div
              onClick={() => setPopup(false)}
              className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                className={`popup-content ${popup ? "popup-content-off" : ""}`}
              >
                <div
                  onClick={() => setPopup(false)}
                  className="popup-navigation"
                >
                  <img src="/left-arrow.png" alt="left arrow icon" />
                  <h5>Detail Lamaran</h5>
                </div>
                {data
                  .filter((element) => element.id_application === getId)
                  .map((e) => (
                    <div key={e.id_application} className="daftar-popup">
                      <div className="daftar-p-content">
                        {/* bikin daftar profil pelamar */}
                        <div
                          onClick={() => nav(`/profil-pelamar/${e.id_pelamar}`)}
                          className="daftar-p-c-pelamar"
                        >
                          <span>
                            <img
                              src={
                                e.data_pelamar.picture
                                  ? e.data_pelamar.picture
                                  : "/profil-pelamar.svg"
                              }
                              alt="gambar profil pelamar"
                            />
                            <div>
                              <p>{e.data_pelamar.spesialis}</p>
                              <h5>{e.data_pelamar.pelamar.nama}</h5>
                              <p>{e.data_pelamar.pelamar.email}</p>
                            </div>
                          </span>
                          <img src="/right.png" alt="arrow right icon" />
                        </div>
                        <br />
                        <div className="daftar-p-c-cv">
                          <img src="/pdf.svg" alt="pdf icon" />
                          <Link to={e.cv.link}>{e.cv.nama}</Link>
                        </div>
                        <br />
                        <div className="daftar-p-c-coverletter">
                          <h6>Cover Letter</h6>
                          <p>{e.surat}</p>
                        </div>
                      </div>
                      <div className="daftar-p-content">
                        <div className="daftar-p-c-info">
                          <span>
                            <p>Tanggal dikirim</p>
                            <p>{moment(e.created_at).format("LL")}</p>
                          </span>
                          <span>
                            <p>Status</p>
                            <StatusApp variable={e.status} />
                          </span>
                          <span>
                            <p>Lowongan</p>
                            <Link to={`/lowongan/${e.id_lowongan}`}>
                              {e.lowongan.posisi}
                              <img
                                height={"20px"}
                                src="/link.png"
                                alt="link icon"
                              />
                            </Link>
                          </span>
                        </div>
                        <div className="daftar-p-c-pesan">
                          <label htmlFor="daftar-p-c-p-input">
                            Pesan untuk pelamar
                          </label>
                          {e.status === "Ditolak" ? (
                            e.notes ? (
                              <p>{e.notes}</p>
                            ) : (
                              <p>Tidak ada pesan</p>
                            )
                          ) : (
                            <textarea
                              ref={inputNotes}
                              id="daftar-p-c-p-input"
                              placeholder="Tulis pesan untuk pelamar"
                            ></textarea>
                          )}
                        </div>
                        {e.status === "Ditinjau" ? (
                          <div className="daftar-p-c-action">
                            <button
                              onClick={() => handleTolak(e.id_application)}
                              className="daftar-button-tolak"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => handleTerima(e.id_application)}
                              className="daftar-button-terima"
                            >
                              Terima
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* _____________________________________ */}
            <div className="daftar-header">
              <h6>Pelamar</h6>
              <h6>Lowongan</h6>
              <h6>Resume</h6>
              <h6>Status</h6>
            </div>
            <div className="daftar-wrap">
              {dataPagination
                .filter(
                  (filter) =>
                    filter.lowongan.data_perusahaan.id_perusahaan ===
                    user.id_perusahaan
                )
                .map((e) => (
                  <div
                    onClick={() => {
                      setGetId(e.id_application);
                      setPopup(true);
                    }}
                    key={e.id_application}
                    className="daftar-w-content"
                  >
                    <div className="daftar-w-c-pelamar">
                      <img
                        src={
                          e.data_pelamar.picture
                            ? e.data_pelamar.picture
                            : "profil-pelamar.svg"
                        }
                        alt="gambar profil pelamar"
                      />
                      <span>
                        <h6>{e.data_pelamar.pelamar.nama}</h6>
                        <p>{e.data_pelamar.pelamar.email}</p>
                      </span>
                    </div>
                    <div className="daftar-w-c-lowongan">
                      <p>{e.lowongan.posisi}</p>
                    </div>
                    <div className="daftar-w-c-cv">
                      <img src="/pdf.svg" alt="pdf icon" />
                      <Link
                        onClick={(event) => event.stopPropagation()}
                        to={e.cv.link}
                      >
                        {e.cv.nama}
                      </Link>
                    </div>
                    <div className="daftar-w-c-status">
                      <StatusApp variable={e.status} />
                    </div>
                    <div className="daftar-w-c-action">
                      <img
                        height={"25px"}
                        src="/right.png"
                        alt="arrow right icon"
                      />
                    </div>
                  </div>
                ))}
              {/* pagination */}
              {data ? (
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
              ) : null}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
