import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingPage } from "../components/Loading";
import { AlertFailed, AlertSucceed } from "../components/Alert";
import Cookies from "js-cookie";

export default function Lowonganlist() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  async function getData() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      console.log(
        resp.data.filter((e) => e.perusahaan_id === userId.id_perusahaan)
      );
      setData(
        resp.data.filter((e) => e.perusahaan_id === userId.id_perusahaan)
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (!token || userId?.role === "pelamar") {
      nav("/");
    }
    getData();
  }, []);

  // pagination
  const itemsPerPage = 10;
  const dataItem = Array.from(
    { length: data ? data.length : null },
    (_, i) => `Item ${i + 1}`
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dataItem.length / itemsPerPage);

  const visibleItems = data
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : null;

  // handle delete
  const [popup, setPopup] = useState(false);
  const [getIdDelete, setGetIdDelete] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertFailed, setAlertFailed] = useState(false);
  async function handleDeleteLowongan() {
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/lowongan/${getIdDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setAlert(true);
      setPopup(false);
    } catch (e) {
      setAlertFailed(true);
      setPopup(false);
    }
  }

  // time out 5 detik
  useEffect(() => {
    let timeout;
    if (alert || alertFailed) {
      timeout = setTimeout(() => {
        setAlert(false);
        setAlertFailed(false);
      }, 8000);
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {alert ? <AlertSucceed message={"Data berhasil dihapus"} /> : null}
            {alertFailed ? (
              <AlertFailed message={"Data gagal dihapus"} />
            ) : null}

            {/* popup________________________________________________________ */}
            <div
              onClick={() => setPopup(false)}
              className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                className={`popup-content ${popup ? "popup-content-off" : ""}`}
              >
                <div className="lowongan-list-delete">
                  <img src="/trash2.svg" alt="trash icon" />
                  <br />
                  <h4>Hapus</h4>
                  <p>Apakah anda yakin untuk menghapus?</p>
                  <br />
                  <span>
                    <button
                      onClick={() => setPopup(false)}
                      className="button-cancel"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDeleteLowongan}
                      className="button-deleting"
                    >
                      Hapus
                    </button>
                  </span>
                </div>
              </div>
            </div>
            {/* _____________________________________________________________ */}
            <h4 style={{ marginBottom: "10px" }} className="heading-page">
              Daftar Lowongan
            </h4>
            <button
              style={{ marginBottom: "10px" }}
              onClick={() => nav("/posting")}
              className="button-main posting-button"
            >
              Posting
            </button>
            <div className="t-b-lowongan-wrap">
              {visibleItems
                .sort(
                  (a, b) =>
                    new Date(b.lowongan_created_at) -
                    new Date(a.lowongan_created_at)
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
                          {moment(e.lowongan_created_at, "YYYYMMDD").fromNow()}
                        </p>
                      </div>
                      <div className="l-c-title">
                        <span>
                          <p>{e.nama_perusahaan}</p>
                          <h5>{e.posisi}</h5>
                        </span>
                        <img
                          src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                          alt="gambar profil perusahaan"
                        />
                      </div>
                      <div className="l-c-skill">
                        {e.skill
                          ? JSON.parse(e.skill)
                              .slice(0, 5)
                              .map((skill, index) => <p key={index}>{skill}</p>)
                          : null}
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
                      <span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            nav(`/edit-lowongan/${e.id_lowongan}`);
                          }}
                          className="button-main"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setGetIdDelete(e.id_lowongan);
                            setPopup(true);
                          }}
                          className="button-delete"
                        >
                          <img src="/trash.svg" alt="trash icon" />
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <br />
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
      <br />
      <Footer />
    </>
  );
}
