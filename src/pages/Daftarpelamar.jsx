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
import Cookies from "js-cookie";

export default function DaftarPelamar() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);

  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

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
        `https://careercompass-backend.vercel.app/data/lowongan`
      );
      const getPelamar = await axios.get(
        "https://careercompass-backend.vercel.app/auth/pelamar"
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

      const listDataApp = getData.data;
      const listDataCv = getCv.data;
      const listPelamar = getPelamar.data;
      setDataApplication(
        listDataApp.map((e) => ({
          ...e,
          ...(listDataLowongan.find(
            (find) => find.id_lowongan === e.id_lowongan
          ) || {}),
          ...(listDataCv.find((find) => find.id_cv === e.id_cv) || {}),
          ...(listPelamar.find((find) => find.id_pelamar === e.id_pelamar) ||
            {}),
        }))
      );
      console.log(
        listDataApp.map((e) => ({
          ...e,
          ...(listDataLowongan.find(
            (find) => find.id_lowongan === e.id_lowongan
          ) || {}),
          ...(listDataCv.find((find) => find.id_cv === e.id_cv) || {}),
          ...(listPelamar.find((find) => find.id_pelamar === e.id_pelamar) ||
            {}),
        }))
      );
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (!token || userId?.role === "pelamar") {
      nav("/");
    }
    handleData();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalItem = 12;

  const totalPages = Math.ceil(
    dataApplication ? dataApplication.length / totalItem : null
  );
  const firstIndex = (currentPage - 1) * totalItem;
  const lastIndex = firstIndex + totalItem;
  const dataPagination = dataApplication
    ? dataApplication.slice(firstIndex, lastIndex)
    : null;

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
        `https://careercompass-backend.vercel.app/data/app/${e}`,
        {
          notes: inputNotes.current.value,
          status: "Ditolak",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertSuccess(true);
      setPopup(false);
      handleData();
    } catch (e) {
      console.log(e);
      setAlertFailed(true);
    }
  }

  async function handleTerima(e) {
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/data/app/${e}`,
        {
          notes: inputNotes.current.value,
          status: "Diterima",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertSuccess(true);
      setPopup(false);
      handleData();
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
                {dataApplication
                  .filter((element) => element.id_application === Number(getId))
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
                              src={e.profil ? e.profil : "/profil-pelamar.svg"}
                              alt="gambar profil pelamar"
                            />
                            <div>
                              <p>{e.spesialis}</p>
                              <h5>{e.nama_pelamar}</h5>
                              <p>{e.email}</p>
                            </div>
                          </span>
                          <img src="/right.png" alt="arrow right icon" />
                        </div>
                        <br />
                        <div className="daftar-p-c-cv">
                          <img src="/pdf.svg" alt="pdf icon" />
                          <Link to={e.link}>{e.nama}</Link>
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
                              {e.posisi}
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
            <h4 className="heading-page">Manajemen Pelamar</h4>
            <div className="daftar-header">
              <h6>Pelamar</h6>
              <h6>Lowongan</h6>
              <h6>Resume</h6>
              <h6>Status</h6>
            </div>
            <div className="daftar-wrap">
              {dataPagination
                .filter(
                  (filter) => filter.perusahaan_id === userId.id_perusahaan
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
                        src={e.profil ? e.profil : "profil-pelamar.svg"}
                        alt="gambar profil pelamar"
                      />
                      <span>
                        <h6>{e.nama_pelamar}</h6>
                        <p>{e.email}</p>
                      </span>
                    </div>
                    <div className="daftar-w-c-lowongan">
                      <p>{e.posisi}</p>
                    </div>
                    <div className="daftar-w-c-cv">
                      <img src="/pdf.svg" alt="pdf icon" />
                      <Link
                        onClick={(event) => event.stopPropagation()}
                        to={e.link}
                      >
                        {e.nama}
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
      <Footer />
    </>
  );
}
