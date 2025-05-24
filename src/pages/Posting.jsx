import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { kategori } from "../data/Data";
import "../styles/posting.css";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import { LoadingButton } from "../components/Loading";

export default function Posting() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

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

  function handleSkill(e) {
    e.preventDefault();
    setSkill((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }

  function handleSkillDelete(index) {
    setSkill((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  //   buat function untuk kirim semua data
  // data dummy backend______________________________________________________
  const data = JSON.parse(sessionStorage.getItem("data"));
  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from("lowongan").insert([
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
      ]);
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
              placeholder="Administrasi"
            />

            <label for="posting-gajimin">Range gaji</label>
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

            <label for="posting-kategori">Kategori</label>
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

            <label for="posting-jenis">Jenis</label>
            <select ref={inputJenis} id="posting-jenis">
              <option value="" selected hidden>
                Pilih
              </option>
              <option value="full time">Full Time</option>
              <option value="magang">Magang</option>
              <option value="paruh waktu">Paruh Waktu</option>
              <option value="shift work">Shift Work</option>
            </select>

            <label for="posting-tingkat">Tingkatan</label>
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
            <label for="posting-tentang">Tentang pekerjaan</label>
            <textarea
              ref={inputTentang}
              id="posting-tentang"
              placeholder={`Tekan "enter" untuk ke list selanjutnya`}
            ></textarea>

            <label for="posting-syarat">Persyaratan</label>
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
      </div>
      <br />
      <Footer />
    </>
  );
}
