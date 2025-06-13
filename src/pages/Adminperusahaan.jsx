import { useEffect, useRef, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";
import { provinsi } from "../data/Provinsi";
import Cookies from "js-cookie";

export default function Adminperusahaan() {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [data, setData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  async function getData() {
    try {
      const takeData = await axios.get(
        "https://careercompass-backend.vercel.app/auth/all-perusahaan"
      );
      setData(takeData.data.data);
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
  const inputSitus = useRef(null);
  const inputTahun = useRef(null);
  const inputBidang = useRef(null);
  const inputKaryawan = useRef(null);
  const inputLokasi = useRef(null);
  const [inputProvinsi, setInputProvinsi] = useState("");
  const inputTentang = useRef(null);
  const inputVisi = useRef(null);
  const inputMisi = useRef(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      setImage(file);
    }
  }

  // input data
  async function handleTambah(e) {
    e.preventDefault();
    setLoadingButton(true);
    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/auth/perusahaan/register",
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
          `https://careercompass-backend.vercel.app/auth/perusahaan/profil/${e}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${e}`
      );

      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${e}`,
        {
          nama: inputNama.current.value
            ? inputNama.current.value
            : resp.data[0].nama_perusahaan,
          situs: inputSitus.current.value
            ? inputSitus.current.value
            : resp.data[0].situs,
          tahun: inputTahun.current.value
            ? inputTahun.current.value
            : resp.data[0].tahun_didirikan,
          bidang: inputBidang.current.value
            ? inputBidang.current.value
            : resp.data[0].bidang,
          karyawan: inputKaryawan.current.value
            ? inputKaryawan.current.value
            : resp.data[0].karyawan,
          lokasi: inputLokasi.current.value
            ? inputLokasi.current.value
            : resp.data[0].lokasi,
          provinsi: inputProvinsi ? inputProvinsi : resp.data[0].provinsi,
          tentang: inputTentang.current.value
            ? inputTentang.current.value
            : resp.data[0].tentang,
          visi: inputVisi.current.value
            ? inputVisi.current.value
            : resp.data[0].visi,
          misi: inputMisi.current.value
            ? inputMisi.current.value
            : resp.data[0].misi,
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
        `https://careercompass-backend.vercel.app/auth/perusahaan/${e}`,
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
  const [filterLokasi, setFilterLokasi] = useState(null);
  const [sortTanggal, setSortTanggal] = useState(false);
  const [pencarian, setPencarian] = useState("");
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <HeaderDashboard
            content={"Perusahaan"}
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
                    <h5>Tambah perusahaan</h5>
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
                        placeholder="e.g. Company corp"
                      />
                      <br />
                      <label htmlFor="dashboard-popup-email">Email</label>
                      <br />
                      <input
                        ref={inputEmail}
                        type="text"
                        id="dashboard-popup-email"
                        placeholder="e.g. company@example.com"
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
                    .filter((filter) => filter.id_perusahaan === getId)
                    .map((e) => (
                      <>
                        <div
                          onClick={() => setPopupEdit(false)}
                          className="popup-navigation"
                        >
                          <img src="/left-arrow.png" alt="back icon" />
                          <h5>Edit perusahaan</h5>
                        </div>
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="dashboard-popup"
                        >
                          <div className="dashboard-popup-profil">
                            <label
                              style={{
                                backgroundImage: `url(${
                                  e.picture
                                    ? e.picture
                                    : file
                                    ? file
                                    : "/profil-perusahaan.svg"
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
                              placeholder={
                                e.nama_perusahaan
                                  ? e.nama_perusahaan
                                  : "e.g. John Dhoe"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-spesialis">
                              Situs
                            </label>
                            <br />
                            <input
                              ref={inputSitus}
                              type="text"
                              id="dashboard-popup-spesialis"
                              placeholder={
                                e.situs
                                  ? e.situs
                                  : "e.g. https://www.Company.com/"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-spesialis">
                              Tahun didirikan
                            </label>
                            <br />
                            <input
                              ref={inputTahun}
                              type="text"
                              id="dashboard-popup-spesialis"
                              placeholder={
                                e.tahun_didirikan
                                  ? e.tahun_didirikan
                                  : "e.g. 1980"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-spesialis">
                              Karyawan
                            </label>
                            <br />
                            <input
                              ref={inputKaryawan}
                              type="text"
                              id="dashboard-popup-spesialis"
                              placeholder={
                                e.karyawan ? e.karyawan : "e.g. >20.000"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-spesialis">
                              Bidang
                            </label>
                            <br />
                            <input
                              ref={inputBidang}
                              type="text"
                              id="dashboard-popup-spesialis"
                              placeholder={
                                e.bidang ? e.bidang : "e.g. Manufaktur"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-lokasi">
                              Lokasi
                            </label>
                            <br />
                            <input
                              ref={inputLokasi}
                              type="text"
                              id="dashboard-popup-lokasi"
                              placeholder={
                                e.lokasi ? e.lokasi : "e.g. Jakarta Pusat"
                              }
                            />
                            <br />
                            <label htmlFor="dashboard-popup-provinsi">
                              Provinsi
                            </label>
                            <br />
                            <select
                              value={inputProvinsi}
                              onChange={(e) => setInputProvinsi(e.target.value)}
                              id="dashboard-popup-provinsi"
                            >
                              <option value="" selected hidden>
                                {e.provinsi ? e.provinsi : "Pilih provinsi"}
                              </option>
                              {provinsi.map((e) => (
                                <option key={e.id}>{e.name}</option>
                              ))}
                            </select>
                            <br />
                            <label htmlFor="dashboard-popup-provinsi">
                              Tentang
                            </label>
                            <br />
                            <textarea
                              ref={inputTentang}
                              id="dashboard-popup-provinsi"
                              placeholder={
                                e.tentang ? e.tentang : "Tentang perusahaan"
                              }
                            ></textarea>
                            <br />
                            <label htmlFor="dashboard-popup-provinsi">
                              Visi
                            </label>
                            <br />
                            <textarea
                              ref={inputVisi}
                              id="dashboard-popup-provinsi"
                              placeholder={
                                e.visi ? e.visi : "Visi dari perusahaan"
                              }
                            ></textarea>
                            <br />
                            <label htmlFor="dashboard-popup-provinsi">
                              Misi
                            </label>
                            <br />
                            <textarea
                              ref={inputMisi}
                              id="dashboard-popup-provinsi"
                              placeholder={
                                e.misi ? e.misi : "Misi dari perusahaan"
                              }
                            ></textarea>
                            <br />
                            <div className="dashboard-popup-action">
                              <button
                                onClick={() => handleEdit(e.id_perusahaan)}
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
                    <select onChange={(e) => setFilterLokasi(e.target.value)}>
                      <option value="" selected hidden>
                        Lokasi
                      </option>
                      {provinsi.map((e) => (
                        <option value={e.name} key={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
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
                  <h6>Provinsi</h6>
                  <h6>Spesialis</h6>
                  <h6>Action</h6>
                </div>
                <div className="dashboard-pelamar-wrap">
                  {dataPagination
                    .filter((filter) =>
                      filter.nama_perusahaan
                        .toLowerCase()
                        .includes(pencarian.toLowerCase())
                    )
                    .sort((a, b) =>
                      sortTanggal
                        ? new Date(a.created_at) - new Date(b.created_at)
                        : new Date(b.created_at) - new Date(a.created_at)
                    )
                    .filter((filter) =>
                      (filter.provinsi?.toString() || "")
                        .toLowerCase()
                        .includes((filterLokasi || "").toLowerCase())
                    )
                    .map((e) => (
                      <div
                        key={e.id_perusahaan}
                        className="dashboard-pelamar-w-item"
                      >
                        <div className="dashboard-pelamar-w-i-nama">
                          <img
                            src={
                              e?.picture ? e.picture : "/profil-perusahaan.svg"
                            }
                            alt="profil pelamar"
                          />
                          <h6>{e.nama_perusahaan}</h6>
                        </div>
                        <div className="dashboard-pelamar-w-i-email">
                          <p>{e.email}</p>
                        </div>
                        <div className="dashboard-pelamar-w-i-provinsi">
                          <p
                            style={{
                              color: e.provinsi ? "black" : "grey",
                            }}
                          >
                            {e.provinsi ? e.provinsi : "Belum ada data."}
                          </p>
                        </div>
                        <div className="dashboard-pelamar-w-i-keahlian">
                          <p
                            style={{
                              color: e.bidang ? "black" : "grey",
                            }}
                          >
                            {e.bidang ? e.bidang : "Belum ada data."}
                          </p>
                        </div>
                        <div className="dashboard-w-i-action">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setPopupEdit(true);
                              setGetId(e.id_perusahaan);
                            }}
                          >
                            <img src="/pencil2.svg" alt="edit icon" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(e.id_perusahaan);
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
