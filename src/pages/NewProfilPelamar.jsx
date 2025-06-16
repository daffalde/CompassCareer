import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/newProfilePelamar.css";
import { gradient } from "../data/Data";
import { Skeleton } from "../components/Skeleton";
import moment from "moment";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgress } from "../components/Circular";
import { LoadingButton } from "../components/Loading";
import { provinsi } from "../data/Provinsi";
import { NavBack } from "../components/Navigation";

export default function NewProfilPelamar() {
  const nav = useNavigate();

  const getBanner = Math.round(new Date().getDate() % 19);

  const token = Cookies.get("token");
  const userId = Cookies.get("data") ? JSON.parse(Cookies.get("data")) : null;

  const [loading, setLoading] = useState(true);

  // ambil data
  const [pelamar, setPelamar] = useState(null);
  const [cv, setCv] = useState(null);

  const [percentAll, setPercentAll] = useState(0);
  const [percentNow, setPercentNow] = useState(0);
  async function getData() {
    setLoading(true);
    try {
      const takePelamar = await axios.get(
        `https://careercompass-backend.vercel.app/auth/pelamar/${userId?.id_pelamar}`
      );
      setPelamar(takePelamar.data[0]);
      setPercentAll(Object.values(takePelamar.data[0]).length);
      setPercentNow(
        Object.values(takePelamar.data[0]).filter((e) => e !== null).length
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const [loadingCv, setLoadingCv] = useState(true);
  async function getCv() {
    setLoadingCv(true);
    try {
      const takeCv = await axios.get(
        "https://careercompass-backend.vercel.app/data/cv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCv(takeCv.data.filter((e) => e.id_pelamar === userId?.id_pelamar));
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCv(false);
    }
  }

  useEffect(() => {
    if (!token || userId?.role !== "pelamar") {
      nav("/");
    }
    getData();
    getCv();
  }, []);

  //   ubah profil
  const [image, setImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imageWarning, setImageWarning] = useState(false);

  function handleImage(e) {
    const file = e.target.files[0];

    if (file && file.size < 3 * 1024 * 1024) {
      setImage(file);
    } else if (file.size > 3 * 1024 * 1024) {
      setImageWarning(true);
    }
  }

  async function handleSendImage() {
    setLoadingImg(true);
    const formData = new FormData();
    formData.append("picture", image);

    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/profil/${userId?.id_pelamar}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingImg(false);
    }
  }

  //   tambah cv
  const [inputCv, setInputCv] = useState(null);

  function takeCv(e) {
    const file = e.target.files[0];
    if (file) {
      setInputCv(file);
    }
  }

  async function handleSendCv() {
    setLoadingCv(true);
    try {
      const formData = new FormData();
      formData.append("link", inputCv);
      formData.append("pelamar", userId?.id_pelamar);

      await axios.post(
        "https://careercompass-backend.vercel.app/data/cv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCv();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCv(false);
    }
  }

  useEffect(() => {
    if (image instanceof File && image.size > 0) {
      handleSendImage();
    }
  }, [image]);

  useEffect(() => {
    if (inputCv instanceof File && inputCv.size > 0) {
      handleSendCv();
    }
  }, [inputCv]);

  //   delete cv
  async function deleteCv(e) {
    setLoadingCv(true);
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/cv/${e}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCv();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCv(false);
    }
  }

  //   edit bio
  const [popup, setPopup] = useState(false);

  const [textSkill, setTextSkill] = useState("");

  const [inputNama, setInputNama] = useState("");
  const [inputSpesialis, setInputSpesialis] = useState("");
  const [inputLokasi, setInputLokasi] = useState("");
  const [inputProvinsi, setInputProvinsi] = useState("");
  const [inputTentang, setInputTentang] = useState("");
  const [inputSkill, setInputSkill] = useState([]);

  function handleClear() {
    setInputNama("");
    setInputSpesialis("");
    setInputLokasi("");
    setInputProvinsi("");
    setInputTentang("");
    setTextSkill("");
    setInputSkill([]);
  }

  function handleInputSkill(e) {
    e.preventDefault();
    if (textSkill.trim() !== "") {
      setInputSkill((prev) => [...prev, textSkill]);
    }
    setTextSkill("");
  }

  function handleDeleteSkill(indexToRemove) {
    setInputSkill((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  //   edit data
  async function handleEdit(e) {
    setLoading(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/${userId?.id_pelamar}`,
        {
          nama: inputNama.length > 0 ? inputNama : pelamar?.nama_pelamar,
          spesialis:
            inputSpesialis.length > 0 ? inputSpesialis : pelamar?.spesialis,
          lokasi: inputLokasi.length > 0 ? inputLokasi : pelamar?.lokasi,
          provinsi:
            inputProvinsi.length > 0 ? inputProvinsi : pelamar?.provinsi,
          tentang: inputTentang.length > 0 ? inputTentang : pelamar?.tentang,
          skill:
            inputSkill.length > 0 ? JSON.stringify(inputSkill) : pelamar?.skill,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopup(false);
      handleClear();
      getData();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {/* pop up ___________________________________________________________ */}

      <div
        onClick={() => {
          setPopup(false);
          handleClear();
        }}
        className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
      >
        <div className={`popup-content ${popup ? "popup-content-off" : ""}`}>
          <div
            onClick={(event) => event.stopPropagation()}
            className="profil-popup"
          >
            <div onClick={() => setPopup(false)} className="popup-navigation">
              <img src="/left-arrow.png" alt="back icon" />
              <h5>Edit Profil</h5>
            </div>

            {/* _____________ */}
            <span>
              <label htmlFor="profil-popup-nama">Nama</label>
              <input
                type="text"
                id="profil-popup-nama"
                placeholder={pelamar ? pelamar?.nama_pelamar : "e.g. John Doe"}
                value={inputNama}
                onChange={(e) => setInputNama(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-spesialis">Spesialisasi</label>
              <input
                type="text"
                id="profil-popup-spesialis"
                placeholder={pelamar ? pelamar?.spesialis : "e.g. Administrasi"}
                value={inputSpesialis}
                onChange={(e) => setInputSpesialis(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-lokasi">Lokasi</label>
              <input
                type="text"
                id="profil-popup-lokasi"
                placeholder={pelamar ? pelamar?.lokasi : "e.g. Jakarta Pusat"}
                value={inputLokasi}
                onChange={(e) => setInputLokasi(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-provinsi">Provinsi</label>
              <select
                onChange={(e) => setInputProvinsi(e.target.value)}
                id="profil-popup-provinsi"
              >
                <option value="" hidden>
                  {pelamar ? pelamar?.provinsi : "Pilih provinsi"}
                </option>
                {provinsi.map((e, i) => (
                  <option value={e.nama} key={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </span>
            <span>
              <label htmlFor="profil-popup-tentang">Tentang anda</label>
              <textarea
                id="profil-popup-tentang"
                placeholder={
                  pelamar ? pelamar?.tentang : "Ceritakan tentang diri anda"
                }
                value={inputTentang}
                onChange={(e) => setInputTentang(e.target.value)}
              ></textarea>
            </span>
            <span>
              <label htmlFor="profil-popup-keahlian">Keahlian baru</label>
              <div className="profil-popup-keahlian">
                <input
                  type="text"
                  placeholder="e.g. Manajemen"
                  value={textSkill}
                  onChange={(e) => {
                    e.stopPropagation();
                    setTextSkill(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputSkill(e);
                    }
                  }}
                />
                <button onClick={handleInputSkill} className="button-main">
                  Tambah
                </button>
              </div>
              <div className="skill-wrap">
                {inputSkill
                  ? inputSkill.map((skill, i) => (
                      <p key={i}>
                        {skill}
                        <img
                          onClick={() => handleDeleteSkill(i)}
                          height={"13px"}
                          src="/close.svg"
                          alt="close icon"
                        />
                      </p>
                    ))
                  : null}
              </div>
            </span>
            <span>
              <div
                style={{ filter: "opacity(50%)" }}
                className="p-p-m-b-content"
              >
                <label>Keahlian sebelumnya:</label>
                <div className="skill-wrap">
                  {!loading ? (
                    pelamar?.skill ? (
                      JSON.parse(pelamar?.skill).map((e, i) => (
                        <p key={i}>{e}</p>
                      ))
                    ) : (
                      <h6 style={{ color: "grey", fontWeight: "400" }}>
                        Belum ada data.
                      </h6>
                    )
                  ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} width={"120px"} height={"50px"} />
                    ))
                  )}
                </div>
              </div>
            </span>
            <div className="profil-popup-action">
              <button className="button-main" onClick={handleEdit}>
                Simpan {loading ? <LoadingButton /> : null}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ___________________________________________________________ */}

      <div className="container">
        <Header />
        <NavBack title={"Profil"} />
        <div className="profil-pelamar">
          <div className="p-p-main">
            <div
              style={{ backgroundImage: gradient[getBanner + 1].gradient }}
              className="p-p-m-banner"
            ></div>
            <div className="p-p-m-head">
              <img
                src={
                  loadingImg
                    ? "/loading.gif"
                    : pelamar
                    ? pelamar.profil
                      ? pelamar.profil
                      : "/profil-pelamar.svg"
                    : "/profil-pelamar.svg"
                }
                alt="profil user"
              />
              <input type="file" onChange={handleImage} />
              <div className="p-p-m-h-left">
                {imageWarning ? (
                  <p className="caution">*Ukuran file max 3Mb</p>
                ) : null}
                {loading ? (
                  <Skeleton width={"400px"} height={"30px"} />
                ) : pelamar ? (
                  <h4>{pelamar?.nama_pelamar}</h4>
                ) : null}
                <p style={{ color: "grey" }}>
                  {pelamar?.spesialis ? (
                    pelamar?.spesialis
                  ) : (
                    <Skeleton width={"250px"} height={"20px"} />
                  )}
                </p>
                <br />
                <span>
                  <img src="/location.png" alt="" />
                  {pelamar?.lokasi ? (
                    <p>{pelamar?.lokasi}</p>
                  ) : (
                    <Skeleton width={"100px"} height={"16px"} />
                  )}
                  <p>, </p>{" "}
                  {pelamar?.provinsi ? (
                    <p>{pelamar?.provinsi}</p>
                  ) : (
                    <Skeleton width={"100px"} height={"16px"} />
                  )}
                </span>
              </div>
              <button
                onClick={() => setPopup(true)}
                className="button-main none-when-mobile"
              >
                Edit
              </button>
            </div>
            <div className="p-p-m-body">
              <div className="p-p-m-b-content">
                <h5>Tentang anda:</h5>
                {loading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} width={"100%"} height={"30px"} />
                    ))}
                    <Skeleton width={"300px"} height={"30px"} />
                  </>
                ) : pelamar?.tentang ? (
                  <p>{pelamar.tentang}</p>
                ) : (
                  <h6>Belum ada data.</h6>
                )}
              </div>

              <div className="p-p-m-b-content">
                <h5>Keahlian:</h5>
                <div className="skill-wrap">
                  {!loading ? (
                    pelamar?.skill ? (
                      JSON.parse(pelamar?.skill).map((e, i) => (
                        <p key={i}>{e}</p>
                      ))
                    ) : (
                      <h6 style={{ color: "grey", fontWeight: "400" }}>
                        Belum ada data.
                      </h6>
                    )
                  ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} width={"120px"} height={"50px"} />
                    ))
                  )}
                </div>
              </div>
              <div className="p-p-m-b-content">
                <h5>Resume/Cv:</h5>
                <div className="cv-wrap">
                  {!loadingCv
                    ? cv
                      ? cv
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )
                          .map((e) => (
                            <div
                              onClick={() => window.open(e.link)}
                              className="p-p-m-b-c-cv"
                              key={e.id_cv}
                            >
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteCv(e.id_cv);
                                }}
                              >
                                <img src="/trash2.svg" alt="delete icon" />
                              </button>
                              <span>
                                <img src="/pdf.svg" alt="pdf icon" />
                                <p>{e.nama}</p>
                              </span>
                              <span>
                                <p>{Math.round(e.size / 1000)} Kb</p>
                                <p>{moment(e.created_at).format("ll")}</p>
                              </span>
                            </div>
                          ))
                      : Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} height={"200px"} />
                        ))
                    : Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} height={"200px"} />
                      ))}
                  {cv ? (
                    <div className="p-p-m-b-c-cv-add">
                      <img src="/plus3.png" alt="pdf icon" />
                      <input type="file" onChange={takeCv} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="p-p-side">
            <div className="p-p-s-percent">
              <CircularProgress
                size={200}
                progress={Math.round(
                  pelamar ? (percentNow / percentAll) * 100 : 0
                )}
              />
              <span>
                <h5>
                  {percentNow !== 11 ? "Lengkapi Profilmu" : "Profil Lengkap"}
                </h5>
                <p>
                  {percentNow !== 11
                    ? "Isi data diri kamu untuk meningkatkan peluang diterima kerja dan menarik perhatian recruiter."
                    : "Selamat! Semua data profil kamu telah terisi,kamu siap untuk melamar pekerjaan"}
                </p>
              </span>
            </div>
          </div>
        </div>
        {/* bottom button */}
        {popup ? (
          <div className="bottombutton-container">
            <button onClick={handleEdit} className="button-main">
              Simpan
            </button>
          </div>
        ) : (
          <div className="bottombutton-container">
            <button onClick={() => setPopup(true)} className="button-main">
              Edit
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
