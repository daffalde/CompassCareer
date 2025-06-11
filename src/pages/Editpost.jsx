import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { kategori } from "../data/Data";
import "../styles/posting.css";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import { LoadingButton, LoadingPage } from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { NavBack } from "../components/Navigation";

export default function Editpost() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const token = Cookies.get("token");
  const getId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);

  const [skill, setSkill] = useState([]);

  // data dummy backend______________________________________________________
  const [dataLowongan, setDataLowongan] = useState(null);
  const getUrlId = window.location.pathname;
  async function getDataLowongan() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      setDataLowongan(
        resp.data.filter(
          (e) => e.id_lowongan === Number(getUrlId.split("/")[2])
        )[0]
      );
      console.log(
        resp.data.filter(
          (e) => e.id_lowongan === Number(getUrlId.split("/")[2])
        )[0]
      );
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!token || getId?.role === "pelamar") {
      nav("/");
    }
    getDataLowongan();
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

  function handleSkill(e) {
    e.preventDefault();
    setSkill((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }

  function handleSkillDelete(index) {
    setSkill((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  //   buat function untuk kirim semua data
  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(
        `https://careercompass-backend.vercel.app/data/lowongan/${
          getUrlId.split("/")[2]
        }`,
        {
          posisi: inputPosisi.current.value
            ? inputPosisi.current.value
            : dataLowongan.posisi,
          gajiMin: inputGajiMin.current.value
            ? inputGajiMin.current.value
            : dataLowongan.gaji_min,
          gajiMax: inputGajiMax.current.value
            ? inputGajiMax.current.value
            : dataLowongan.gaji_max,
          kategori: inputKategori.current.value
            ? inputKategori.current.value
            : dataLowongan.kategori,
          jenis: inputJenis.current.value
            ? inputJenis.current.value
            : dataLowongan.jenis,
          tingkatan: inputTingkat.current.value
            ? inputTingkat.current.value
            : dataLowongan.tingkatan,
          tentang: inputTentang.current.value
            ? inputTentang.current.value
            : dataLowongan.tentang_lowongan,
          syarat: inputSyarat.current.value
            ? inputSyarat.current.value
            : dataLowongan.syarat,
          skill: JSON.stringify(skill),
          id: getId.id_perusahaan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      nav("/lowongan-post");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className="container">
        <Header />
        <NavBack title={"Edit Lowongan"} />
        {loadingPage ? (
          <LoadingPage />
        ) : (
          <>
            <h4 className="posting-h4">Edit lowongan pekerjaan</h4>
            <div className="posting-body">
              <div>
                <h5>Informasi Lowongan</h5>
                <p>Gambaran singkat tentang posisi yang tersedia</p>
              </div>
              <form>
                <label for="posting-nama">Posisi pekerjaan</label>
                <input
                  ref={inputPosisi}
                  id="posting-nama"
                  type="text"
                  placeholder={dataLowongan.posisi}
                />

                <label for="posting-gajimin">Range gaji</label>
                <span>
                  <input
                    ref={inputGajiMin}
                    id="posting-gajimin"
                    type="number"
                    placeholder={dataLowongan.gaji_min}
                  />
                  <p>-</p>
                  <input
                    ref={inputGajiMax}
                    id="posting-gajimax"
                    type="number"
                    placeholder={dataLowongan.gaji_max}
                  />
                </span>

                <label for="posting-kategori">Kategori</label>
                <select ref={inputKategori} id="posting-kategori">
                  <option value={dataLowongan.kategori} selected hidden>
                    {dataLowongan.kategori}
                  </option>
                  {kategori
                    .sort((a, b) => a.nama.localeCompare(b.nama))
                    .map((e) => (
                      <option key={e.id} value={e.nama}>
                        {e.nama}
                      </option>
                    ))}
                </select>

                <label for="posting-jenis">Jenis</label>
                <select ref={inputJenis} id="posting-jenis">
                  <option value={dataLowongan.jenis} selected hidden>
                    {dataLowongan.jenis}
                  </option>
                  <option value="full time">Full Time</option>
                  <option value="magang">Magang</option>
                  <option value="paruh waktu">Paruh Waktu</option>
                  <option value="shift work">Shift Work</option>
                </select>

                <label for="posting-tingkat">Tingkatan</label>
                <select ref={inputTingkat} id="posting-tingkat">
                  <option value={dataLowongan.tingkatan} selected hidden>
                    {dataLowongan.tingkatan}
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
                <label for="posting-tentang">Tentang pekerjaan</label>
                <textarea
                  ref={inputTentang}
                  id="posting-tentang"
                  placeholder={dataLowongan.tentang_lowongan}
                ></textarea>

                <label for="posting-syarat">Persyaratan</label>
                <textarea
                  ref={inputSyarat}
                  id="posting-syarat"
                  placeholder={dataLowongan.syarat}
                ></textarea>
                <p>
                  *harap jangan menggunakan angka untuk listing,karena akan
                  listing otomatis
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
                Simpan {loading ? <LoadingButton /> : null}
              </button>
            </div>
          </>
        )}
      </div>
      <br />
      <br />
      <div className="bottombutton-container">
        <button onClick={handleSend} className="button-main">
          Posting
        </button>
      </div>
      <Footer />
    </>
  );
}
