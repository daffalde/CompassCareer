import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { kategori } from "../data/Data";
import "../styles/posting.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoadingButton } from "../components/Loading";
import axios from "axios";
import { AlertFailed, AlertSucceed } from "../components/Alert";
import { BottomButton, NavBack } from "../components/Navigation";

export default function Posting() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);

  useEffect(() => {
    if (!token || userId?.role === "pelamar") {
      nav("/");
    }
  }, []);

  const inputPosisi = useRef(null);
  const inputGajiMin = useRef(null);
  const inputGajiMax = useRef(null);
  const inputKategori = useRef(null);
  const inputJenis = useRef(null);
  const inputTingkat = useRef(null);
  const inputTentang = useRef(null);
  const inputSyarat = useRef(null);
  const [inputSkill, setInputSkill] = useState("");
  const [skill, setSkill] = useState([]);

  const [alert, setAlert] = useState(null);

  function handleSkill(e) {
    e.preventDefault();
    setSkill((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }

  function handleSkillDelete(index) {
    setSkill((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/data/lowongan",
        {
          posisi: inputPosisi.current.value,
          gajiMin: inputGajiMin.current.value,
          gajiMax: inputGajiMax.current.value,
          kategori: inputKategori.current.value,
          jenis: inputJenis.current.value,
          tingkatan: inputTingkat.current.value,
          tentang: inputTentang.current.value,
          syarat: inputSyarat.current.value,
          skill: JSON.stringify(skill),
          perusahaan: user.id_perusahaan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlert("Lowongan disposting");
    } catch (e) {
      setAlert(e.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (alert === "Lowongan disposting") {
      const timeout = setTimeout(() => {
        nav("/lowongan-post");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, alert);

  return (
    <>
      {alert !== null ? (
        alert === "Lowongan disposting" ? (
          <AlertSucceed message={alert} />
        ) : (
          <AlertFailed message={alert} />
        )
      ) : null}
      <div className="container">
        <Header />
        <NavBack title={"Posting"} />
        <h4 className="posting-h4">Buat lowongan pekerjaan</h4>
        <div className="posting-body">
          <div>
            <h5>Informasi Lowongan</h5>
            <p>Gambaran singkat tentang posisi yang tersedia</p>
          </div>
          <form>
            <label htmlFor="posting-nama">Posisi pekerjaan</label>
            <input
              ref={inputPosisi}
              id="posting-nama"
              type="text"
              placeholder="Administrasi"
            />

            <label htmlFor="posting-gajimin">Range gaji</label>
            <span>
              <input
                ref={inputGajiMin}
                id="posting-gajimin"
                type="number"
                placeholder="Minimal"
              />
              <p>-</p>
              <input
                ref={inputGajiMax}
                id="posting-gajimax"
                type="number"
                placeholder="Maksimal"
              />
            </span>

            <label htmlFor="posting-kategori">Kategori</label>
            <select ref={inputKategori} id="posting-kategori">
              <option value="" selected hidden>
                Pilih
              </option>
              {kategori
                .sort((a, b) => a.nama.localeCompare(b.nama))
                .map((e) => (
                  <option key={e.id} value={e.nama}>
                    {e.nama}
                  </option>
                ))}
            </select>

            <label htmlFor="posting-jenis">Jenis</label>
            <select ref={inputJenis} id="posting-jenis">
              <option value="" selected hidden>
                Pilih
              </option>
              <option value="full time">Full Time</option>
              <option value="magang">Magang</option>
              <option value="paruh waktu">Paruh Waktu</option>
              <option value="shift work">Shift Work</option>
            </select>

            <label htmlFor="posting-tingkat">Tingkatan</label>
            <select ref={inputTingkat} id="posting-tingkat">
              <option value="" selected hidden>
                Pilih
              </option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="eksekutif">Eksekutif</option>
            </select>
          </form>
        </div>
        <div className="posting-body">
          <div>
            <h5>Detail Pekerjaan</h5>
            <p>Penjelasan mengenai tugas utama dan persyaratan</p>
          </div>
          <form>
            <label htmlFor="posting-tentang">Tentang pekerjaan</label>
            <textarea
              ref={inputTentang}
              id="posting-tentang"
              placeholder={`Tekan "enter" untuk ke list selanjutnya`}
            ></textarea>

            <label htmlFor="posting-syarat">Persyaratan</label>
            <textarea
              ref={inputSyarat}
              id="posting-syarat"
              placeholder={`Tekan "enter" untuk ke list selanjutnya`}
            ></textarea>
            <p>
              *harap jangan menggunakan angka untuk listing,karena akan listing
              otomatis
            </p>
          </form>
        </div>
        <div className="posting-body">
          <div>
            <h5>Skill yang dibutuhkan</h5>
            <p>
              Kompetensi dan keterampilan yang diperlukan untuk sukses dalam
              peran ini.
            </p>
          </div>
          <form>
            <label htmlFor="posting-keahlian">Keahlian</label>
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
            <br />
            <div className="p-b-skill-wrap">
              {skill.map((e, i) => (
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
              ))}
            </div>
          </form>
        </div>
        <div className="posting-action">
          <button onClick={() => nav(-1)} className="button-second">
            Batal
          </button>
          <button onClick={handleSend} className="button-main">
            Posting {loading ? <LoadingButton /> : null}
          </button>
        </div>
      </div>
      <br />
      {/* bottom button */}
      <div className="bottombutton-container">
        <button onClick={handleSend} className="button-main">
          Posting
        </button>
      </div>
      <Footer />
    </>
  );
}
