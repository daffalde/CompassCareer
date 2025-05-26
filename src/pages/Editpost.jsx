import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { kategori } from "../data/Data";
import "../styles/posting.css";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import { LoadingButton, LoadingPage } from "../components/Loading";
import axios from "axios";

export default function Editpost() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [skill, setSkill] = useState([]);

  // data dummy backend______________________________________________________
  const [dataLowongan, setDataLowongan] = useState(null);
  const getUrlId = window.location.pathname;
  async function getDataLowongan() {
    try {
      const inputDataLowongan = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/lowongan?select=*",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      setDataLowongan(
        inputDataLowongan.data.find(
          (find) => find.id_lowongan === Number(getUrlId.split("/")[2])
        )
      );
      setLoadingPage(false);
      setSkill(
        JSON.parse(
          inputDataLowongan.data.find(
            (find) => find.id_lowongan === Number(getUrlId.split("/")[2])
          ).skill
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
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

  const data = JSON.parse(sessionStorage.getItem("data"));
  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(
        `https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/lowongan?id_lowongan=eq.${
          getUrlId.split("/")[2]
        }`,
        {
          id_perusahaan: data.id_perusahaan,
          posisi: inputPosisi.current.value,
          gaji_min: inputGajiMin.current.value,
          gaji_max: inputGajiMax.current.value,
          kategori: inputKategori.current.value,
          jenis: inputJenis.current.value,
          tingkatan: inputTingkat.current.value,
          tentang: inputTentang.current.value,
          syarat: inputSyarat.current.value,
          skill: JSON.stringify(skill),
        },
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      console.log("data berhasil di unggah");
    }
  }

  return (
    <>
      <div className="container">
        <Header />
        {loadingPage ? (
          <LoadingPage />
        ) : (
          <>
            <h4>Buat lowongan pekerjaan</h4>
            <br />
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
                  placeholder={dataLowongan.tentang}
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
                Posting {loading ? <LoadingButton /> : null}
              </button>
            </div>
          </>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
}
