import { useEffect, useRef, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";
import { provinsi } from "../data/Provinsi";
import Cookies from "js-cookie";

export default function AdminPengaturan() {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [data, setData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  async function getData() {
    try {
      const takeData = await axios.get(
        "https://careercompass-backend.vercel.app/auth/admin"
      );
      setData(takeData.data);
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

  // input
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const inputNama = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      setImage(file);
    }
  }
  // function input data

  // input data
  async function handleTambah(e) {
    e.preventDefault();
    setLoadingButton(true);
    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/auth/admin/register",
        {
          name: inputNama.current.value,
          email: inputEmail.current.value,
          password: inputPassword.current.value,
        }
      );
      getData();
      setLoadingButton(false);
      setPopup(false);
    } catch (e) {
      console.log(e);
    }
  }

  // fungsi edit
  const [popupEdit, setPopupEdit] = useState(false);
  const [getId, setGetId] = useState(null);

  async function handleEdit(e) {
    setLoadingButton(true);
    const formData = new FormData();
    formData.append("picture", image);
    try {
      if (image) {
        await axios.patch(
          `https://careercompass-backend.vercel.app/auth/admin/profil/${e}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/admin/${e}`,
        {
          nama: inputNama.current.value ? inputNama.current.value : "Admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadingButton(false);
      setPopupEdit(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  // fungsi hapus
  async function handleDelete(e) {
    setLoadingPage(true);
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/auth/admin/${e}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
      setLoadingPage(false);
    }
  }

  // filter & sort
  const [sortTanggal, setSortTanggal] = useState(false);
  const [pencarian, setPencarian] = useState("");
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <HeaderDashboard
            content={"Pengaturan"}
            search={pencarian}
            setSearch={setPencarian}
          />
          {loadingPage ? (
            <LoadingPage />
          ) : (
            <>
              {/* popup_________________________________________________________ */}
              <div
                onClick={() => setPopup(false)}
                className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
              >
                <div
                  className={`popup-content ${
                    popup ? "popup-content-off" : ""
                  }`}
                >
                  <div
                    onClick={() => setPopup(false)}
                    className="popup-navigation"
                  >
                    <img src="/left-arrow.png" alt="back icon" />
                    <h5>Tambah user admin</h5>
                  </div>
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="dashboard-popup"
                  >
                    <div className="dashboard-popup-text">
                      <label htmlFor="dashboard-popup-nama">Nama</label>
                      <br />
                      <input
                        ref={inputNama}
                        type="text"
                        id="dashboard-popup-nama"
                        placeholder="e.g. John Dhoe"
                      />
                      <br />
                      <label htmlFor="dashboard-popup-email">Email</label>
                      <br />
                      <input
                        ref={inputEmail}
                        type="text"
                        id="dashboard-popup-email"
                        placeholder="e.g. johndoe@example.com"
                      />
                      <br />
                      <label htmlFor="dashboard-popup-password">Password</label>
                      <br />
                      <input
                        ref={inputPassword}
                        type="text"
                        id="dashboard-popup-password"
                        placeholder="Minimal 8 karakter"
                      />
                      <div className="dashboard-popup-action">
                        <button onClick={handleTambah} className="button-main">
                          Tambah {loadingButton ? <LoadingButton /> : null}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ________________ */}
              <div
                onClick={() => {
                  setPopupEdit(false);
                  setGetId(null);
                  getData();
                }}
                className={`popup-wrap ${
                  popupEdit && getId !== null ? "" : "popup-wrap-off"
                }`}
              >
                <div
                  className={`popup-content ${
                    popupEdit && getId !== null ? "popup-content-off" : ""
                  }`}
                >
                  {data
                    .filter((filter) => filter.id_admin === getId)
                    .map((e) => (
                      <>
                        <div
                          onClick={() => setPopupEdit(false)}
                          className="popup-navigation"
                        >
                          <img src="/left-arrow.png" alt="back icon" />
                          <h5>Edit admin data</h5>
                        </div>
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="dashboard-popup"
                        >
                          <div className="dashboard-popup-profil">
                            <label
                              style={{
                                backgroundImage: `url(${
                                  e.profil
                                    ? e.profil
                                    : file
                                    ? file
                                    : "/profil-pelamar.svg"
                                })`,
                              }}
                              htmlFor="dashboard-popup-profil"
                            ></label>
                            <input
                              onChange={handleImage}
                              id="dashboard-popup-profil"
                              type="file"
                            />
                          </div>

                          <div className="dashboard-popup-text">
                            <label htmlFor="dashboard-popup-nama">Nama</label>
                            <br />
                            <input
                              ref={inputNama}
                              type="text"
                              id="dashboard-popup-nama"
                              placeholder={e.nama ? e.nama : "e.g. John Dhoe"}
                            />
                            <div className="dashboard-popup-action">
                              <button
                                onClick={() => handleEdit(e.id_admin)}
                                className="button-main"
                              >
                                Edit {loadingButton ? <LoadingButton /> : null}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
              {/* ______________________________________________________________ */}
              <div className="dashboard-pelamar">
                <div className="dashboard-filter">
                  <div className="dashboard-filter-list">
                    <button onClick={() => setSortTanggal(!sortTanggal)}>
                      <img
                        src={sortTanggal ? "/down-sort.png" : "/up-sort.png"}
                        alt="sort icon"
                      />
                      {sortTanggal ? "Terlama" : "Terbaru"}
                    </button>
                  </div>
                  <button
                    onClick={() => setPopup(true)}
                    className="button-main"
                  >
                    Tambah
                  </button>
                </div>
                <div className="dashboard-pelamar-header">
                  <h6>Profil</h6>
                  <h6>Email</h6>
                  <h6>Role</h6>
                  <h6>Action</h6>
                </div>
                <div className="dashboard-pelamar-wrap">
                  {dataPagination
                    .filter((filter) =>
                      filter.nama
                        .toLowerCase()
                        .includes(pencarian.toLowerCase())
                    )
                    .sort((a, b) =>
                      sortTanggal
                        ? new Date(a.created_at) - new Date(b.created_at)
                        : new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((e) => (
                      <div
                        key={e.id_admin}
                        className="dashboard-pelamar-w-item"
                      >
                        <div className="dashboard-pelamar-w-i-nama">
                          <img
                            src={e?.profil ? e.profil : "/profil-pelamar.svg"}
                            alt="profil pelamar"
                          />
                          <h6>
                            {e.nama}{" "}
                            {user.id_admin === e.id_admin ? "(You)" : null}
                          </h6>
                        </div>
                        <div className="dashboard-pelamar-w-i-email">
                          <p>{e.email}</p>
                        </div>
                        <div className="dashboard-pelamar-w-i-keahlian">
                          <p>{e.role}</p>
                        </div>
                        <div className="dashboard-w-i-action">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setPopupEdit(true);
                              setGetId(e.id_admin);
                            }}
                          >
                            <img src="/pencil2.svg" alt="edit icon" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(e.id_admin);
                            }}
                          >
                            <img src="/trash.svg" alt="delete icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {/* Pagination */}
                {dataPagination ? (
                  <div className="pagination">
                    <div
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="p-arrow"
                    >
                      <img
                        src="../pagig-arrow2.svg"
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
                      <img
                        src="../pagig-arrow.svg"
                        alt="tanda panah pagination"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
