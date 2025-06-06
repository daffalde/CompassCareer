import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/profil.css";
import "../styles/template.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";
import { provinsi } from "../data/Provinsi";

export default function Profilperusahaan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  if (!token) {
    nav("/login");
  }
  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState(null);
  const [lowonganPost, setLowonganPost] = useState(null);
  // get data
  async function getData() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`
      );
      const resp2 = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      setData(resp.data[0]);
      setLowonganPost(
        resp2.data.filter((e) => e.perusahaan_id === userId.id_perusahaan)
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
    getData();
  }, []);

  const [loadingButton, setLoadingButton] = useState(false);
  //   change picture
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
        `https://careercompass-backend.vercel.app/auth/perusahaan/profil/${userId.id_perusahaan}`,
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
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`,
        {
          nama: nama === "" ? data.nama_perusahaan : nama,
          lokasi: lokasi === "" ? data.lokasi : lokasi,
          provinsi: provinsii === "" ? data.provinsi : provinsii,
          karyawan: spesialisasi === "" ? data.karyawan : spesialisasi,
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

  // change detail
  const [situs, setSitus] = useState("");
  const [didirikan, setDidirikan] = useState("");
  const [industri, setIndustri] = useState("");

  async function upDetail(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`,
        {
          situs: situs === "" ? data.situs : situs,
          tahun: didirikan === "" ? data.tahun_didirikan : didirikan,
          bidang: industri === "" ? data.bidang : industri,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  //   change ringkasan
  const [handleRingkasan, setHandleRingkasan] = useState(false);
  const [ringkasan, setRingkasan] = useState("");

  async function upRingkas(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`,
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

  //   change visi
  const [handleVisi, setHandleVisi] = useState(false);
  const [visi, setVisi] = useState("");

  async function upVisi(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`,
        {
          visi: visi === "" ? data.visi : visi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setHandleVisi(false);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  //   change misi
  const [handleMisi, setHandleMisi] = useState(false);
  const [misi, setMisi] = useState("");

  async function upMisi(e) {
    setLoadingButton(true);
    e.preventDefault();
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId.id_perusahaan}`,
        {
          misi: misi === "" ? data.misi : misi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setHandleMisi(false);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
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
                      : data.picture
                      ? data.picture
                      : "profil-perusahaan.svg"
                  }")`,
                }}
                for="input-picture"
              ></label>
              <input
                onChange={handleImageChange}
                id="input-picture"
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
            <h6>Ubah profil perusahaan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-nama">Nama perusahaan</label>
                <input
                  id="c-c-f-nama"
                  value={nama}
                  type="text"
                  placeholder={
                    data.nama_perusahaan
                      ? data.nama_perusahaan
                      : "e.g. Company corp."
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
                  placeholder={data.lokasi ? data.lokasi : "e.g. Jakarta Pusat"}
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
                  placeholder={
                    data.provinsi ? data.provinsi : "e.g. DKI Jakarta"
                  }
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
                <label for="c-c-f-nama">Jumlah karyawan</label>
                <input
                  id="c-c-f-nama"
                  value={spesialisasi}
                  type="text"
                  placeholder={data.karyawan ? data.karyawan : "e.g. >5000"}
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
      {handleRingkasan && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah ringkasan perusahaan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-area"></label>
                <textarea
                  id="c-c-f-area"
                  value={ringkasan}
                  type="text"
                  placeholder={"Tuliskan tentang perusahaan anda...."}
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
              <button onClick={upRingkas} className="button-main">
                Tambah {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}
      {handleVisi && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah visi perusahaan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-area"></label>
                <textarea
                  id="c-c-f-area"
                  value={visi}
                  type="text"
                  placeholder={`Visi pertama\nVisi kedua\n....`}
                  onChange={(e) => setVisi(e.target.value)}
                ></textarea>
                <p>
                  *harap jangan menggunakan angka untuk listing,karena akan
                  listing otomatis
                </p>
              </div>
            </div>
            <span>
              <button
                onClick={() => setHandleVisi(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={upVisi} className="button-main">
                Simpan {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}
      {handleMisi && (
        <div className="change">
          <form className="change-content">
            <h6>Ubah visi perusahaan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-area"></label>
                <textarea
                  id="c-c-f-area"
                  value={misi}
                  type="text"
                  placeholder={`Misi pertama\nMisi kedua\n....`}
                  onChange={(e) => setMisi(e.target.value)}
                ></textarea>
                <p>
                  *harap jangan menggunakan angka untuk listing,karena akan
                  listing otomatis
                </p>
              </div>
            </div>
            <span>
              <button
                onClick={() => setHandleMisi(false)}
                className="button-second"
              >
                Batal
              </button>
              <button onClick={upMisi} className="button-main">
                Simpan {loadingButton ? <LoadingButton /> : null}
              </button>
            </span>
          </form>
        </div>
      )}

      {loadingPage ? (
        <LoadingPage />
      ) : (
        <div className="container">
          <Header />
          <div className="template-head">
            <div className="t-h-top">
              <img
                src={data.picture ? data.picture : "/profil-perusahaan.svg"}
                alt="gambar profil user"
              />
              <div onClick={() => setHandleImage(true)} className="t-h-t-edit">
                <img src="/pencil.svg" alt="pencil icon" />
              </div>
            </div>
            <div className="t-h-bottom">
              <div className="t-h-b-title">
                <h4>{data.nama_perusahaan}</h4>
                <p>{data.email}</p>
              </div>
              <div className="t-h-b-desc">
                <span>
                  <p>
                    {data.lokasi},{data.provinsi}
                  </p>
                  <img src="/dot1.svg" alt="dot gap" />
                  <p>{data.karyawan} Karyawan</p>
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
                <form className="body-form">
                  <label for="b-f-web">Situs web</label>
                  <input
                    value={situs}
                    onChange={(e) => setSitus(e.target.value)}
                    placeholder={
                      data.situs ? data.situs : "e.g. https://www.industry.com"
                    }
                    type="text"
                    id="b-f-web"
                  />
                  <label for="b-f-tahun">Tahun didirikan</label>
                  <input
                    value={didirikan}
                    onChange={(e) => setDidirikan(e.target.value)}
                    placeholder={
                      data.tahun_didirikan ? data.tahun_didirikan : "e.g. 1990"
                    }
                    type="text"
                    id="b-f-tahun"
                  />
                  <label for="b-f-industri">Industri</label>
                  <input
                    value={industri}
                    onChange={(e) => setIndustri(e.target.value)}
                    placeholder={
                      data.bidang ? data.bidang : "e.g. Banking & Financial"
                    }
                    type="text"
                    id="b-f-industri"
                  />
                  <br />
                  <button onClick={upDetail} className="button-main">
                    Simpan {loadingButton ? <LoadingButton /> : null}
                  </button>
                </form>
              </div>
              <div className="t-f-l-body">
                <div className="paragraph">
                  <span className="t-f-l-b-title">
                    <h6>Tentang perusahaan</h6>
                    <img
                      onClick={() => setHandleRingkasan(true)}
                      src="/pencil2.svg"
                      alt="pencil icon"
                    />
                  </span>
                  <p>{data.tentang ? data.tentang : "Belum ada data"}</p>
                </div>
                <div className="paragraph">
                  <span className="t-f-l-b-title">
                    <h6>Visi</h6>
                    <img
                      onClick={() => setHandleVisi(true)}
                      src="/pencil2.svg"
                      alt="pencil icon"
                    />
                  </span>
                  {data.visi ? (
                    data.visi.split("\n").map((e, i) => (
                      <span className="numbering-item" key={i}>
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </span>
                    ))
                  ) : (
                    <p>Belum ada data</p>
                  )}
                </div>
                <div className="paragraph">
                  <span className="t-f-l-b-title">
                    <h6>Misi</h6>
                    <img
                      onClick={() => setHandleMisi(true)}
                      src="/pencil2.svg"
                      alt="pencil icon"
                    />
                  </span>
                  {data.misi ? (
                    data.misi.split("\n").map((e, i) => (
                      <span className="numbering-item" key={i}>
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </span>
                    ))
                  ) : (
                    <p>Belum ada data</p>
                  )}
                </div>
              </div>
            </div>
            <div className="t-f-right">
              <div className="t-f-l-body">
                <div className="lowongan-lain-wrap">
                  <h6>Lowongan di posting</h6>
                  {lowonganPost.slice(0, 7).map((list) => (
                    <div
                      className="lowongan-lain"
                      onClick={() => {
                        window.scrollTo({ top: 0 });
                        nav(`/lowongan/${list.id}`);
                      }}
                      key={list.id_lowongan}
                    >
                      <h6>{list.posisi}</h6>
                      <span>
                        <img
                          src={
                            list.picture
                              ? list.picture
                              : "/profil-perusahaan.svg"
                          }
                          alt="profil perusahaan"
                        />
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
      )}
      <br />

      <Footer />
    </>
  );
}
