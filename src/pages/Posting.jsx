import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { kategori } from "../data/Data";
import "../styles/posting.css";
import { useNavigate } from "react-router-dom";

export default function Posting() {
  const nav = useNavigate();

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
            <input id="posting-nama" type="text" placeholder="Administrasi" />

            <label for="posting-gajimin">Range gaji</label>
            <span>
              <input id="posting-gajimin" type="number" placeholder="Minimal" />
              <p>-</p>
              <input
                id="posting-gajimax"
                type="number"
                placeholder="Maksimal"
              />
            </span>

            <label for="posting-kategori">Kategori</label>
            <select id="posting-kategori">
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
            <select id="posting-jenis">
              <option value="" selected hidden>
                Pilih
              </option>
              <option value="full time">Full Time</option>
              <option value="magang">Magang</option>
              <option value="paruh waktu">Paruh Waktu</option>
              <option value="shift work">Shift Work</option>
            </select>

            <label for="posting-tingkat">Tingkatan</label>
            <select id="posting-tingkat">
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
              id="posting-tentang"
              placeholder={`Tekan "enter" untuk ke list selanjutnya`}
            ></textarea>

            <label for="posting-syarat">Persyaratan</label>
            <textarea
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
          <button className="button-main">Posting</button>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
}
