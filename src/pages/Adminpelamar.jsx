import { useEffect, useRef, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import axios from "axios";
import { LoadingPage } from "../components/Loading";
import { provinsi } from "../data/Provinsi";

export default function Adminpelamar() {
  const [data, setData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  async function getData() {
    try {
      const takeData = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/pelamar?select=*,data_pelamar(*,lowongan_tersimpan(*),perusahaan_tersimpan(*),cv(*),application(*))",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(takeData.data);
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
  const [popup, setPopup] = useState(true);

  // input
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const inputNama = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);
  const inputLokasi = useRef(null);
  const [inputProvinsi, setInputProvinsi] = useState("");
  const inputRingkasan = useRef(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      setImage(file);
    }
  }

  // skill
  const [inputSkill, setInputSkill] = useState("");
  const [skill, setSkill] = useState([]);

  function handleSkill(e) {
    e.preventDefault();
    setSkill((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }

  function handleSkillDelete(index) {
    setSkill((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  // cv
  const [cv, setCv] = useState(null);

  function handleCv(e) {
    const file = e.target.files[0];
    if (file) {
      setCv(file);
      console.log(file);
    }
  }

  // input data
  function handleTambah(e) {
    e.preventDefault();
    console.log({
      nama: inputNama.current.value,
      email: inputEmail.current.value,
      passwrod: inputPassword.current.value,
      lokasi: inputLokasi.current.value,
      provinsi: inputProvinsi,
      ringkasan: inputRingkasan.current.value,
      keahlian: JSON.stringify(skill),
    });
  }
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <HeaderDashboard content={"Pelamar"} />
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
                    <h5>Tambah user data</h5>
                  </div>
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="dashboard-popup"
                  >
                    <div className="dashboard-popup-profil">
                      <label
                        style={{
                          backgroundImage: `url(${
                            file ? file : "/profil-pelamar.svg"
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
                      <br />
                      <label htmlFor="dashboard-popup-lokasi">Lokasi</label>
                      <br />
                      <input
                        ref={inputLokasi}
                        type="text"
                        id="dashboard-popup-lokasi"
                        placeholder="e.g. Jakarta Pusat"
                      />
                      <br />
                      <label htmlFor="dashboard-popup-provinsi">Provinsi</label>
                      <br />
                      <select
                        value={inputProvinsi}
                        onChange={(e) => setInputProvinsi(e.target.value)}
                        id="dashboard-popup-provinsi"
                      >
                        <option value="" selected hidden>
                          Pilih provinsi
                        </option>
                        {provinsi.map((e) => (
                          <option key={e.id}>{e.name}</option>
                        ))}
                      </select>
                      <br />
                      <label htmlFor="dashboard-popup-provinsi">
                        Ringkasan pribadi
                      </label>
                      <br />
                      <textarea
                        ref={inputRingkasan}
                        id="dashboard-popup-provinsi"
                        placeholder="Ceritakan diri user"
                      ></textarea>
                      <br />
                      <label for="posting-keahlian">Keahlian</label>
                      <span>
                        <input
                          value={inputSkill}
                          onChange={(e) => setInputSkill(e.target.value)}
                          id="posting-keahlian"
                          type="text"
                          placeholder="Komputer,Manajemen,dll...."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSkill();
                            }
                          }}
                        />
                        <button onClick={handleSkill} className="button-main">
                          Tambah
                        </button>
                      </span>
                      <div className="p-b-skill-wrap">
                        {skill[0] ? (
                          skill.map((e, i) => (
                            <>
                              <h6 className="s-item" key={i}>
                                {e}
                                <img
                                  onClick={(remove) => {
                                    remove.stopPropagation();
                                    handleSkillDelete(i);
                                  }}
                                  src="/close.svg"
                                  alt="close icon"
                                />
                              </h6>
                            </>
                          ))
                        ) : (
                          <p style={{ color: "grey" }}>
                            Belum ada data keahlian.
                          </p>
                        )}
                      </div>
                      <br />

                      <div className="dashboard-popup-cv">
                        <p>CV tersimpan</p>
                        <label htmlFor="dashboard-popup-cv">
                          <img
                            src={cv ? "/pdf.svg" : "/plus2.png"}
                            alt="plus icon"
                          />
                          {cv ? cv.name : null}
                        </label>
                        <input
                          accept=".pdf"
                          onChange={handleCv}
                          type="file"
                          id="dashboard-popup-cv"
                        />
                      </div>
                      <div className="dashboard-popup-action">
                        <button onClick={handleTambah} className="button-main">
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ______________________________________________________________ */}
              <div className="dashboard-pelamar">
                <div className="dashboard-filter">
                  <div className="dashboard-filter-list">
                    <select>
                      <option value="" selected hidden>
                        Lokasi
                      </option>
                      {provinsi.map((e) => (
                        <option key={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>
                  <button className="button-main">Tambah</button>
                </div>
                <div className="dashboard-pelamar-header">
                  <h6>Profil</h6>
                  <h6>Email</h6>
                  <h6>Provinsi</h6>
                  <h6>Spesialis</h6>
                  <h6>Action</h6>
                </div>
                <div className="dashboard-pelamar-wrap">
                  {dataPagination.map((e) => (
                    <div
                      key={e.id_pelamar}
                      className="dashboard-pelamar-w-item"
                    >
                      <div className="dashboard-pelamar-w-i-nama">
                        <img
                          src={
                            e.data_pelamar?.picture
                              ? e.data_pelamar.picture
                              : "/profil-pelamar.svg"
                          }
                          alt="profil pelamar"
                        />
                        <h6>{e.nama}</h6>
                      </div>
                      <div className="dashboard-pelamar-w-i-email">
                        <p>{e.email}</p>
                      </div>
                      <div className="dashboard-pelamar-w-i-provinsi">
                        <p
                          style={{
                            color: e.data_pelamar.provinsi ? "black" : "grey",
                          }}
                        >
                          {e.data_pelamar.provinsi
                            ? e.data_pelamar.provinsi
                            : "Belum ada data."}
                        </p>
                      </div>
                      <div className="dashboard-pelamar-w-i-keahlian">
                        <p
                          style={{
                            color: e.data_pelamar.spesialis ? "black" : "grey",
                          }}
                        >
                          {e.data_pelamar.spesialis
                            ? e.data_pelamar.spesialis
                            : "Belum ada data."}
                        </p>
                      </div>
                      <div className="dashboard-w-i-action">
                        <button onClick={(event) => event.stopPropagation()}>
                          <img src="/pencil2.svg" alt="edit icon" />
                        </button>
                        <button onClick={(event) => event.stopPropagation()}>
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
