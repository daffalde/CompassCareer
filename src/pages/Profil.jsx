import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/profil.css";
import { provinsi } from "../data/Provinsi";
import { lowongan } from "../data/Data";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const nav = useNavigate();
  const data = JSON.parse(sessionStorage.getItem("data"));
  console.log(data);

  // function data dummy____________________________________________________________

  // _______________________________________________________________________________

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

  //   change bio
  const [handleBio, setHandleBio] = useState(false);
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [provinsii, setProvinsii] = useState("");
  const [spesialisasi, setSpesialisasi] = useState("");

  //   change ringkasan
  const [handleRingkasan, setHandleRingkasan] = useState(false);
  const [ringkasan, setRingkasan] = useState("");

  //   add skill
  const [handleSkill, setHandleSkill] = useState(false);
  const [keahlian, setKeahlian] = useState("");

  //   option pada cv
  const [optionId, setOptionId] = useState(null);
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
                    imagePreview ? imagePreview : data.data_pelamar.picture
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
              <button className="button-main">Simpan</button>
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
                  placeholder={data.nama ? data.nama : "John Doe"}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div>
                <label for="c-c-f-nama">Lokasi</label>
                <input
                  id="c-c-f-nama"
                  value={lokasi}
                  type="text"
                  placeholder={
                    data.data_pelamar.lokasi
                      ? data.data_pelamar.lokasi
                      : "Jakarta Pusat"
                  }
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
                    data.data_pelamar.provinsi
                      ? data.data_pelamar.provinsi
                      : "DKI Jakarta"
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
                <label for="c-c-f-nama">Spesialisasi</label>
                <input
                  id="c-c-f-nama"
                  value={spesialisasi}
                  type="text"
                  placeholder={
                    data.data_pelamar.spesialis
                      ? data.data_pelamar.spesialis
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
              <button className="button-main">Simpan</button>
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
              <button className="button-main">Tambah</button>
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
                  placeholder={
                    data.data_pelamar.tentang
                      ? data.data_pelamar.tentang
                      : "Tuliskan tentang diri anda...."
                  }
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
              <button className="button-main">Tambah</button>
            </span>
          </form>
        </div>
      )}

      {/* ___________________________________________________________ */}
      <div className="container">
        <Header />
        <div className="template-head">
          <div className="t-h-top">
            <img
              src={
                data.data_pelamar.picture
                  ? data.data_pelamar.picture
                  : "/profil.svg"
              }
              alt="gambar profil user"
            />
            <div onClick={() => setHandleImage(true)} className="t-h-t-edit">
              <img src="/pencil.svg" alt="pencil icon" />
            </div>
          </div>
          <div className="t-h-bottom">
            <div className="t-h-b-title">
              <h4>{data.nama}</h4>
              <p>{data.email}</p>
            </div>
            <div className="t-h-b-desc">
              <span>
                <p>
                  {data.data_pelamar.lokasi},{data.data_pelamar.provinsi}
                </p>
                <img src="/dot1.svg" alt="dot gap" />
                <p>{data.data_pelamar.spesialis}</p>
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
                <p>{data.data_pelamar.tentang}</p>
              </div>
              <div className="skill">
                <h6>Keahlian:</h6>
                <div className="s-wrap">
                  {data.data_pelamar.skill
                    ? data.data_pelamar.skill.map((e, i) => (
                        <div className="s-item" key={i}>
                          <p>{e}</p>
                          <img
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
                  {data.data_pelamar.cv
                    ? data.data_pelamar.cv.map((e) => (
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
                          {optionId === null ? null : optionId === e.id_cv ? (
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
                                    //logic
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
                          <img id="pdf-image" src="/pdf.svg" alt="pdf logo" />
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
                    <input id="cv-input" type="file" />
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
                        nav(`/lowongan/${list.id}`);
                      }}
                      key={list.id}
                    >
                      <h6>{list.nama}</h6>
                      <span>
                        <img
                          src={list.perusahaan.profil}
                          alt="profil perusahaan"
                        />
                        <p>{list.perusahaan.nama}</p>
                        <img src="/dot1.svg" alt="dot" />
                        <p>{list.perusahaan.provinsi}</p>
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
  );
}
