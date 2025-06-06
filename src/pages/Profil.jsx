import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/profil.css";
import "../styles/template.css";
import { provinsi } from "../data/Provinsi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";

export default function Profil() {
  const nav = useNavigate();
  const user = JSON.parse(Cookies.get("data"));
  const token = Cookies.get("token");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  // _______________________________________________________________________________
  const [data, setData] = useState(null);
  const [lowongan, setLowongan] = useState(null);
  const [cvData, setCvData] = useState(null);
  async function getData() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/pelamar/${user.id_pelamar}`
      );
      const resp2 = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      const resp3 = await axios.get(
        "https://careercompass-backend.vercel.app/data/cv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCvData(
        resp3.data.filter((e) => e.id_pelamar === Number(user.id_pelamar))
      );
      setLowongan(resp2.data);
      setData(resp.data[0]);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  //   change profil
  const [handleImage, setHandleImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handlePicture(e) {
    e.preventDefault();
    setLoadingButton(true);
    const formData = new FormData();
    formData.append("picture", image);
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/profil/${user.id_pelamar}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadingButton(false);
      setHandleImage(false);
      getData();
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  //   change bio
  const [handleBio, setHandleBio] = useState(false);
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [provinsii, setProvinsii] = useState("");
  const [spesialisasi, setSpesialisasi] = useState("");

  async function upBio(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/${user.id_pelamar}`,
        {
          nama: nama === "" ? data.nama_pelamar : nama,
          lokasi: lokasi === "" ? data.lokasi : lokasi,
          provinsi: provinsii === "" ? data.provinsi : provinsii,
          spesialis: spesialisasi === "" ? data.spesialis : spesialisasi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setHandleBio(false);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  //   change ringkasan
  const [handleRingkasan, setHandleRingkasan] = useState(false);
  const [ringkasan, setRingkasan] = useState("");

  async function upRingkasan(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/${user.id_pelamar}`,
        {
          tentang: ringkasan === "" ? data.tentang : ringkasan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setHandleRingkasan(false);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  //   add skill
  const [handleSkill, setHandleSkill] = useState(false);
  const [keahlian, setKeahlian] = useState("");

  async function upSkill(e) {
    setLoadingButton(true);
    e.preventDefault();
    const updatedSkills = [...JSON.parse(data.skill), keahlian];
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/${user.id_pelamar}`,
        {
          skill: JSON.stringify(updatedSkills),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setKeahlian("");
      setHandleSkill(false);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  async function editSkill(skill) {
    setLoadingPage(true);
    const filterSkill = JSON.parse(data.skill).filter((e) => e !== skill);
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/pelamar/${user.id_pelamar}`,
        {
          skill: JSON.stringify(filterSkill),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setHandleSkill(false);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
      setLoadingPage(false);
    }
  }

  //   option pada cv
  const [optionId, setOptionId] = useState(null);

  async function handleCv(e) {
    const file = e.target.files[0];
    if (file) {
      setLoadingPage(true);
      const formData = new FormData();
      formData.append("link", file);
      formData.append("pelamar", user.id_pelamar);
      await axios.post(
        "https://careercompass-backend.vercel.app/data/cv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setLoadingPage(false);
    }
  }

  async function deleteCv(e) {
    setLoadingPage(true);
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/cv/${e}`,
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
    }
  }
  return (
    <>
      {/* pop up_____________________________________________________ */}
      {handleImage && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah foto profil</h6>
            <div className="c-c-image">
              <label
                style={{
                  backgroundImage: `url("${
                    imagePreview
                      ? imagePreview
                      : data.profil
                      ? data.profil
                      : "/profil-pelamar.svg"
                  }")`,
                }}
                for="input-profil"
              ></label>
              <input
                onChange={handleImageChange}
                id="input-profil"
                type="file"
              />
            </div>
            <span>
              <button
                onClick={() => setHandleImage(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={handlePicture} className="button-main">
                Simpan {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}
      {handleBio && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah profil</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-nama">Nama lengkap</label>
                <input
                  id="c-c-f-nama"
                  value={nama}
                  type="text"
                  placeholder={
                    data.nama_pelamar ? data.nama_pelamar : "John Doe"
                  }
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div>
                <label for="c-c-f-nama">Lokasi</label>
                <input
                  id="c-c-f-nama"
                  value={lokasi}
                  type="text"
                  placeholder={data.lokasi ? data.lokasi : "Jakarta Pusat"}
                  onChange={(e) => setLokasi(e.target.value)}
                />
              </div>
              <div>
                <label for="c-c-f-nama">Provinsi</label>
                <input
                  id="c-c-f-nama"
                  list="prov"
                  value={provinsii}
                  type="text"
                  placeholder={data.provinsi ? data.provinsi : "DKI Jakarta"}
                  onChange={(e) => setProvinsii(e.target.value)}
                />
                <datalist id="prov">
                  {provinsii.length >= 2 &&
                    provinsi.map((provinsi) => (
                      <option key={provinsi.id} value={provinsi.name}></option>
                    ))}
                </datalist>
              </div>
              <div>
                <label for="c-c-f-nama">Spesialisasi</label>
                <input
                  id="c-c-f-nama"
                  value={spesialisasi}
                  type="text"
                  placeholder={
                    data.spesialis
                      ? data.spesialis
                      : "Web Developer,Manajemen,dll..."
                  }
                  onChange={(e) => setSpesialisasi(e.target.value)}
                />
              </div>
            </div>
            <span>
              <button
                onClick={() => setHandleBio(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={upBio} className="button-main">
                Simpan {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}
      {handleSkill && (
        <div className="change">
          <form className="change-content">
            <h6>Tambah Keahlian</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-nama">
                  Bantu perusahaan menemukan Anda dengan menampilkan semua
                  keahlian Anda.
                </label>
                <input
                  id="c-c-f-nama"
                  value={keahlian}
                  type="text"
                  placeholder="Desain,Analisis,Komputer,dll...."
                  onChange={(e) => setKeahlian(e.target.value)}
                />
              </div>
            </div>
            <span>
              <button
                onClick={() => setHandleSkill(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={upSkill} className="button-main">
                Tambah {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}
      {handleRingkasan && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah Ringkasan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-area"></label>
                <textarea
                  id="c-c-f-area"
                  value={ringkasan}
                  type="text"
                  placeholder={"Tuliskan tentang diri anda...."}
                  onChange={(e) => setRingkasan(e.target.value)}
                ></textarea>
              </div>
            </div>
            <span>
              <button
                onClick={() => setHandleRingkasan(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={upRingkasan} className="button-main">
                Tambah {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}

      {/* ___________________________________________________________ */}
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <>
          <div className="container">
            <Header />
            <div className="template-head">
              <div className="t-h-top">
                <img
                  src={data.profil ? data.profil : "/profil-pelamar.svg"}
                  alt="gambar profil user"
                />
                <div
                  onClick={() => setHandleImage(true)}
                  className="t-h-t-edit"
                >
                  <img src="/pencil.svg" alt="pencil icon" />
                </div>
              </div>
              <div className="t-h-bottom">
                <div className="t-h-b-title">
                  <h4>{data.nama_pelamar}</h4>
                  <p>{data.email}</p>
                </div>
                <div className="t-h-b-desc">
                  <span>
                    <p>
                      {data.lokasi},{data.provinsi}
                    </p>
                    <img src="/dot1.svg" alt="dot gap" />
                    <p>{data.spesialis}</p>
                  </span>
                  <span>
                    <button
                      onClick={() => setHandleBio(true)}
                      className="button-main"
                    >
                      Ubah
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <br />
            <div className="template-foot">
              <div className="t-f-left">
                <div className="t-f-l-body">
                  <div className="paragraph">
                    <span className="t-f-l-b-title">
                      <h6>Ringkasan pribadi</h6>
                      <img
                        onClick={() => setHandleRingkasan(true)}
                        src="/pencil2.svg"
                        alt="pencil icon"
                      />
                    </span>
                    <p>{data.tentang}</p>
                  </div>
                  <div className="skill">
                    <h6>Keahlian:</h6>
                    <div className="s-wrap">
                      {data.skill
                        ? JSON.parse(data.skill).map((e, i) => (
                            <div className="s-item" key={i}>
                              <p>{e}</p>
                              <img
                                onClick={() => editSkill(e)}
                                style={{ width: "10px" }}
                                src="/close.svg"
                                alt="close icon"
                              />
                            </div>
                          ))
                        : null}
                      <div
                        onClick={() => setHandleSkill(true)}
                        style={{ fontWeight: "500" }}
                        className="s-item"
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <div className="cv-list">
                    <h6>CV Tersimpan:</h6>
                    <p>
                      Unggah CV untuk lamaran dan akses mudah di mana pun Anda
                      berada.
                    </p>
                    <div className="cv-l-wrap">
                      {cvData
                        ? cvData
                            .sort(
                              (a, b) =>
                                new Date(b.created_at) - new Date(a.created_at)
                            )
                            .map((e) => (
                              <div
                                onClick={() => window.open(e.link)}
                                className="cv-l-item"
                                key={e.id}
                              >
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOptionId(e.id_cv);
                                  }}
                                  className="cv-l-i-option"
                                >
                                  <img src="/3dots.svg" alt="option" />
                                </button>
                                {optionId === null ? null : optionId ===
                                  e.id_cv ? (
                                  <>
                                    <div className="cv-l-i-option-wrap-content">
                                      <button
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          //logic
                                        }}
                                      >
                                        Cari Lowongan
                                      </button>
                                      <button
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          deleteCv(e.id_cv);
                                        }}
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                    <div
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setOptionId(null);
                                      }}
                                      className="cv-l-i-option-wrap"
                                    ></div>
                                  </>
                                ) : null}
                                <img
                                  id="pdf-image"
                                  src="/pdf.svg"
                                  alt="pdf logo"
                                />
                                <h6>{e.nama}</h6>
                                <span>
                                  <p>{e.size / 1000} Kb</p>
                                  <p>{moment(e.tanggal).format("LL")}</p>
                                </span>
                              </div>
                            ))
                        : null}

                      {/* !tambahin logic buat up pdf */}
                      <div className="cv-l-plus">
                        <label
                          for="cv-input"
                          style={{ fontWeight: "500" }}
                          className="s-item"
                        >
                          +
                        </label>
                        <input onChange={handleCv} id="cv-input" type="file" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-f-right">
                <div className="t-f-l-body">
                  <div className="lowongan-lain-wrap">
                    <h6>Lowongan lain</h6>
                    {lowongan
                      .slice(Math.random() * lowongan.length, 7)
                      .map((list) => (
                        <div
                          className="lowongan-lain"
                          onClick={() => {
                            window.scrollTo({ top: 0 });
                            nav(`/lowongan/${list.id_lowongan}`);
                          }}
                          key={list.id_lowongan}
                        >
                          <h6>{list.posisi}</h6>
                          <span>
                            <img src={list.picture} alt="profil perusahaan" />
                            <p>{list.nama_perusahaan}</p>
                            <img src="/dot1.svg" alt="dot" />
                            <p>{list.provinsi}</p>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          <Footer />
        </>
      )}
    </>
  );
}
