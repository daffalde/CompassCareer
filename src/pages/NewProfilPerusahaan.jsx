import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/newProfilePelamar.css";
import { gradient } from "../data/Data";
import { Skeleton } from "../components/Skeleton";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgress } from "../components/Circular";
import { LoadingButton } from "../components/Loading";
import { provinsi } from "../data/Provinsi";
import { NavBack } from "../components/Navigation";

export default function NewProfilPerusahaan() {
  const nav = useNavigate();

  const getBanner = Math.round(new Date().getDate() % 19);

  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);

  const [loading, setLoading] = useState(true);

  // ambil data
  const [pelamar, setPelamar] = useState(null);

  const [percentAll, setPercentAll] = useState(0);
  const [percentNow, setPercentNow] = useState(0);
  async function getData() {
    setLoading(true);
    try {
      const takePerusahaan = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId?.id_perusahaan}`
      );
      setPelamar(takePerusahaan.data[0]);
      setPercentAll(Object.values(takePerusahaan.data[0]).length);
      setPercentNow(
        Object.values(takePerusahaan.data[0]).filter((e) => e !== null).length
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || userId?.role !== "perusahaan") {
      nav("/");
    }
    getData();
  }, []);

  //   ubah profil
  const [image, setImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);

  function handleImage(e) {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
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

  useEffect(() => {
    if (image instanceof File && image.size > 0) {
      handleSendImage();
    }
  }, [image]);

  //   edit bio
  const [popup, setPopup] = useState(false);

  const [inputNama, setInputNama] = useState("");
  const [inputSitus, setInputSitus] = useState("");
  const [inputTahun, setInputTahun] = useState("");
  const [inputKaryawan, setInputKaryawan] = useState("");
  const [inputSpesialis, setInputSpesialis] = useState("");
  const [inputLokasi, setInputLokasi] = useState("");
  const [inputProvinsi, setInputProvinsi] = useState("");
  const [inputTentang, setInputTentang] = useState("");
  const [inputVisi, setInputVisi] = useState("");
  const [inputMisi, setInputMisi] = useState("");

  //   edit data
  async function handleEdit(e) {
    setLoading(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId?.id_perusahaan}`,
        {
          nama: inputNama.length > 0 ? inputNama : pelamar?.nama_pelamar,
          situs: inputSitus.length > 0 ? inputSitus : pelamar?.situs,
          tahun: inputTahun.length > 0 ? inputTahun : pelamar?.tahun_didirikan,
          bidang: inputSpesialis.length > 0 ? inputSpesialis : pelamar?.bidang,
          karyawan:
            inputKaryawan.length > 0 ? inputKaryawan : pelamar?.karyawan,
          lokasi: inputLokasi.length > 0 ? inputLokasi : pelamar?.lokasi,
          provinsi:
            inputProvinsi.length > 0 ? inputProvinsi : pelamar?.provinsi,
          tentang: inputTentang.length > 0 ? inputTentang : pelamar?.tentang,
          visi: inputVisi.length > 0 ? inputVisi : pelamar?.visi,
          misi: inputMisi.length > 0 ? inputMisi : pelamar?.misi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopup(false);
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
        onClick={() => setPopup(false)}
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
              <label htmlFor="profil-popup-nama">Nama Perusahaan</label>
              <input
                type="text"
                id="profil-popup-nama"
                placeholder={
                  pelamar ? pelamar?.nama_perusahaan : "e.g. John Doe"
                }
                value={inputNama}
                onChange={(e) => setInputNama(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-situs">Website</label>
              <input
                type="text"
                id="profil-popup-situs"
                placeholder={
                  pelamar ? pelamar?.situs : "e.g. http://example.com/"
                }
                value={inputSitus}
                onChange={(e) => setInputSitus(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-tahun">Tahun Didirikan</label>
              <input
                type="text"
                id="profil-popup-tahun"
                placeholder={pelamar ? pelamar?.tahun_didirikan : "e.g. 1990"}
                value={inputTahun}
                onChange={(e) => setInputTahun(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-spesialis">Bidang</label>
              <input
                type="text"
                id="profil-popup-spesialis"
                placeholder={pelamar ? pelamar?.bidang : "e.g. Administrasi"}
                value={inputSpesialis}
                onChange={(e) => setInputSpesialis(e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="profil-popup-karyawan">Karyawan</label>
              <input
                type="text"
                id="profil-popup-karyawan"
                placeholder={pelamar ? pelamar?.karyawan : "e.g. > 10.000"}
                value={inputKaryawan}
                onChange={(e) => setInputKaryawan(e.target.value)}
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
              <label htmlFor="profil-popup-tentang">Tentang Perusahaan</label>
              <textarea
                id="profil-popup-tentang"
                placeholder={
                  pelamar ? pelamar?.tentang : "Ceritakan tentang perusahaan"
                }
                value={inputTentang}
                onChange={(e) => setInputTentang(e.target.value)}
              ></textarea>
            </span>
            <span>
              <label htmlFor="profil-popup-visi">Visi</label>
              <textarea
                id="profil-popup-visi"
                placeholder={"Visi pertama\nVisi kedua\n..."}
                value={inputVisi}
                onChange={(e) => setInputVisi(e.target.value)}
              ></textarea>
            </span>
            <span>
              <label htmlFor="profil-popup-misi">Misi</label>
              <textarea
                id="profil-popup-misi"
                placeholder={"Misi pertama\nMisi kedua\n..."}
                value={inputMisi}
                onChange={(e) => setInputMisi(e.target.value)}
              ></textarea>
            </span>
            <div className="profil-popup-action">
              <button className="button-main" onClick={handleEdit}>
                Simpan {loading ? <LoadingButton /> : null}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* pop up ___________________________________________________________ */}

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
                    ? pelamar.picture
                      ? pelamar.picture
                      : "/profil-pelamar.svg"
                    : "/profil-pelamar.svg"
                }
                alt="profil user"
              />
              <input type="file" onChange={handleImage} />
              <div className="p-p-m-h-left">
                {loading ? (
                  <Skeleton width={"400px"} height={"30px"} />
                ) : pelamar ? (
                  <h4>{pelamar?.nama_perusahaan}</h4>
                ) : null}
                <p style={{ color: "grey" }}>
                  {pelamar?.bidang ? (
                    pelamar?.bidang
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
                <h5>Tentang perusahaan:</h5>
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
                <h5>Visi:</h5>
                {loading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} width={"100%"} height={"30px"} />
                    ))}
                    <Skeleton width={"300px"} height={"30px"} />
                  </>
                ) : pelamar?.visi ? (
                  pelamar.visi
                    .split("\n")
                    .filter((e) => e.trim() !== "")
                    .map((e, i) => (
                      <div className="p-p-m-b-c-list" key={i}>
                        <p>{i + 1}</p>
                        <p>{e}</p>
                      </div>
                    ))
                ) : (
                  <h6>Belum ada data.</h6>
                )}
              </div>
              <div className="p-p-m-b-content">
                <h5>Visi:</h5>
                {loading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} width={"100%"} height={"30px"} />
                    ))}
                    <Skeleton width={"300px"} height={"30px"} />
                  </>
                ) : pelamar?.misi ? (
                  pelamar.misi
                    .split("\n")
                    .filter((e) => e.trim() !== "")
                    .map((e, i) => (
                      <div className="p-p-m-b-c-list" key={i}>
                        <p>{i + 1}</p>
                        <p>{e}</p>
                      </div>
                    ))
                ) : (
                  <h6>Belum ada data.</h6>
                )}
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
                  {percentNow !== 15 ? "Lengkapi Profilmu" : "Profil Lengkap"}
                </h5>
                <p>
                  {percentNow !== 15
                    ? "Lengkapi profil perusahaan Anda untuk menarik perhatian kandidat terbaik dan membangun kepercayaan."
                    : "Selamat! Profil perusahaan Anda sudah lengkap, Anda siap untuk merekrut talenta terbaik."}
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
