import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/profil.css";
import "../styles/template.css";
import { useState } from "react";
import { lowongan } from "../data/Data";

export default function Profilperusahaan() {
  const data = JSON.parse(sessionStorage.getItem("data"));
  console.log(data);
  const nav = useNavigate();

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

  //   change visi
  const [handleVisi, setHandleVisi] = useState(false);
  const [visi, setVisi] = useState("");

  //   change misi
  const [handleMisi, setHandleMisi] = useState(false);
  const [misi, setMisi] = useState("");

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
                    imagePreview ? imagePreview : data.profil
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
            <h6>Ubah profil perusahaan</h6>
            <div className="c-c-form">
              <div>
                <label for="c-c-f-nama">Nama perusahaan</label>
                <input
                  id="c-c-f-nama"
                  value={nama}
                  type="text"
                  placeholder={data.nama ? data.nama : "Company corp."}
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
                <label for="c-c-f-nama">Jumlah karyawan</label>
                <input
                  id="c-c-f-nama"
                  value={spesialisasi}
                  type="text"
                  placeholder={data.spesialisasi ? data.spesialisasi : ">5000"}
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
                  placeholder={
                    data.tentang
                      ? data.tentang
                      : "Tuliskan tentang perusahaan anda...."
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
                  placeholder={
                    data.visi ? data.visi : `Visi pertama\nVisi kedua\n....`
                  }
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
              <button className="button-main">Simpan</button>
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
                  placeholder={
                    data.visi ? data.visi : `Misi pertama\nMisi kedua\n....`
                  }
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
              <button className="button-main">Simpan</button>
            </span>
          </form>
        </div>
      )}

      <div className="container">
        <Header />
        <div className="template-head">
          <div className="t-h-top">
            <img
              src={
                data.data_perusahaan.picture
                  ? data.data_perusahaan.picture
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
                  {data.data_perusahaan.lokasi},{data.data_perusahaan.provinsi}
                </p>
                <img src="/dot1.svg" alt="dot gap" />
                <p>{data.data_perusahaan.karyawan} Karyawan</p>
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
                  placeholder={
                    data.data_perusahaan.situs
                      ? data.data_perusahaan.situs
                      : "https://www.industry.com"
                  }
                  type="text"
                  id="b-f-web"
                />
                <label for="b-f-tahun">Tahun didirikan</label>
                <input
                  placeholder={
                    data.data_perusahaan.didirikan
                      ? data.data_perusahaan.didirikan
                      : "1990"
                  }
                  type="text"
                  id="b-f-tahun"
                />
                <label for="b-f-industri">Industri</label>
                <input
                  placeholder={
                    data.data_perusahaan.bidang
                      ? data.data_perusahaan.bidang
                      : "Banking & Financial"
                  }
                  type="text"
                  id="b-f-industri"
                />
                <br />
                <button className="button-main">Simpan</button>
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
                <p>
                  {data.data_perusahaan.tentang
                    ? data.data_perusahaan.tentang
                    : "Belum ada data"}
                </p>
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
                {data.data_perusahaan.visi ? (
                  data.data_perusahaan.visi.split("\n").map((e, i) => (
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
                {data.data_perusahaan.misi ? (
                  data.data_perusahaan.misi.split("\n").map((e, i) => (
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

      <Footer />
    </>
  );
}
