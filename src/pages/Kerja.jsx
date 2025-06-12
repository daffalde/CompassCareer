import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lowongan from "../components/Lowongan";
import "../styles/lowongan.css";
import Cookies from "js-cookie";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingPage } from "../components/Loading";
import { kategori } from "../data/Data";
import axios from "axios";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";
import { Skeleton } from "../components/Skeleton";
import { provinsi } from "../data/Provinsi";

export default function Kerja() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  // ________________________________________________________________________________
  const [inputCari, setInputCari] = useState("");
  const [valueCari, setValueCari] = useState("");

  const [inputLokasi, setInputLokasi] = useState("");
  const [valueLokasi, setValueLokasi] = useState("");

  function handleCari(e) {
    e.preventDefault();
    setCurrentCursor(0);
    setInputCari(valueCari);
    setInputLokasi(valueLokasi);
  }

  const [inputKategori, setInputKategori] = useState("");
  const [inputJenis, setInputJenis] = useState("");

  // ________________________________________________________________________________

  // State untuk menyimpan data lowongan yang di-fetch
  const [data, setData] = useState([]);

  // State untuk menandai apakah sedang loading
  const [loading, setLoading] = useState(false);

  // Menyimpan histori cursor untuk navigasi halaman
  const [cursorStack, setCursorStack] = useState([0]);

  // Menyimpan posisi cursor saat ini
  const [currentCursor, setCurrentCursor] = useState(0);

  const [next, setNext] = useState(null);

  // Fetch data ketika currentCursor berubah
  useEffect(() => {
    const fetchLowongan = async () => {
      setLoading(true); // Tampilkan loading

      try {
        // Panggil API dengan cursor dan limit
        const res = await axios.get(
          `https://careercompass-backend.vercel.app/data/lowongan?cursor=${currentCursor}&posisi=${inputCari}&provinsi=${inputLokasi}&kategori=${inputKategori}&jenis=${inputJenis}`
        );

        // Jika masih ada halaman berikutnya
        if (res.data.nextCursor !== null) {
          // Tambahkan ke cursorStack
          setCursorStack((prev) => [...prev, res.data.nextCursor]);
        }

        setNext(res.data.nextCursor);

        // Simpan data lowongan dari response
        setData(res.data.data);
      } catch (err) {
        // Tangani jika terjadi error saat fetch
        console.error(err);
      } finally {
        // Sembunyikan loading
        setLoading(false);
      }
    };

    // Jalankan fetch saat useEffect trigger
    fetchLowongan();
  }, [
    currentCursor || inputCari || inputLokasi || inputKategori || inputJenis,
  ]);

  // Navigasi ke halaman sebelumnya
  const handlePrev = () => {
    setCursorStack((prev) => {
      const updated = [...prev]; // Salin stack agar tidak mengubah state langsung
      updated.pop(); // Hapus cursor terakhir (saat ini)
      const prevCursor = updated[updated.length - 2] || 0; // Ambil cursor sebelumnya
      setCurrentCursor(prevCursor); // Set ke cursor sebelumnya
      return updated; // Update stack
    });
  };

  // Navigasi ke halaman berikutnya
  const handleNext = () => {
    const next = cursorStack[cursorStack.length - 1]; // Ambil cursor terakhir
    if (next !== null) {
      setCurrentCursor(next);
    } // Set cursor jika masih valid
  };

  // _____________________________________________________________________

  return (
    <>
      <div className="container">
        <Header />
        <div className="kerja">
          <div className="kerja-banner">
            <span>
              <h4>Sedang mencari pekerjaan?</h4>
              <p>
                Jelajahi ribuan peluang kerja yang sesuai dengan keahlian dan
                lokasimu.
              </p>
            </span>
            <div className="k-b-search">
              <div className="k-b-s-input">
                <img src="/search.png" alt="search logo" />
                <input
                  value={valueCari}
                  onChange={(e) => setValueCari(e.target.value)}
                  type="text"
                  placeholder="Posisi pekerjaan"
                />
              </div>
              <div className="k-b-s-input">
                <img src="location.png" alt="location logo" />
                <input
                  type="text"
                  value={valueLokasi}
                  onChange={(e) => setValueLokasi(e.target.value)}
                  placeholder="Provinsi perusahaan"
                  list="prov"
                />
                <datalist id="prov">
                  {valueLokasi.length >= 2 &&
                    provinsi.map((provinsi) => (
                      <option key={provinsi.id} value={provinsi.name}></option>
                    ))}
                </datalist>
              </div>

              <button onClick={handleCari} className="button-main">
                Cari
              </button>
            </div>
            <div className="k-b-filter">
              <span>
                <select onChange={(e) => setInputKategori(e.target.value)}>
                  <option value="" selected hidden>
                    Kategori
                  </option>
                  {kategori.map((e) => (
                    <option value={e.nama} key={e.id}>
                      {e.nama}
                    </option>
                  ))}
                </select>
                <select onChange={(e) => setInputJenis(e.target.value)}>
                  <option hidden value="" disabled selected>
                    Jenis
                  </option>
                  <option value="Full Time">Full Time</option>
                  <option value="Magang">Magang</option>
                  <option value="Paruh Waktu">Paruh Waktu</option>
                  <option value="Shift Work">Shift Work</option>
                </select>
              </span>
              <button
                onClick={() => {
                  setInputKategori("");
                  setInputJenis("");
                  setCurrentCursor(0);
                }}
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="k-list">
            {loading
              ? Array.from({ length: 20 }).map((_, i) => (
                  <Skeleton width={"100%"} height={"300px"} />
                ))
              : data
              ? data.map((e) => (
                  <div
                    onClick={() => nav(`/lowongan/${e.id_lowongan}`)}
                    className="lowongan-card"
                    key={e.id_lowongan}
                  >
                    <div className="l-c-wrap">
                      <div className="l-c-tanggal">
                        <p>
                          {moment(
                            e.lowongan_created_at.split("T")[0],
                            "YYYYMMDD"
                          ).fromNow()}
                        </p>
                      </div>
                      <div className="l-c-title">
                        <span>
                          <p>{e.nama_perusahaan}</p>
                          <h5>{e.posisi}</h5>
                        </span>
                        <img
                          src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                          alt="gambar profil perusahaan"
                        />
                      </div>
                      <div className="l-c-skill">
                        {JSON.parse(e.skill) ? (
                          JSON.parse(e.skill).map((skill, index) => (
                            <p key={index}>{skill}</p>
                          ))
                        ) : (
                          <p>Belum ada data</p>
                        )}
                      </div>
                    </div>
                    <div className="l-c-action">
                      <span>
                        <h6>
                          Rp{" "}
                          {e.gaji_min / 1000000 >= 1
                            ? `${e.gaji_min / 1000000}Jt`
                            : `${e.gaji_min / 1000}Rb`}
                          -
                          {e.gaji_max / 1000000 >= 1
                            ? `${e.gaji_max / 1000000}Jt`
                            : `${e.gaji_max / 1000}Rb`}
                        </h6>
                        <p>{e.provinsi}</p>
                      </span>
                      <button className="button-main">Lihat</button>
                    </div>
                  </div>
                ))
              : null}
          </div>

          {/* Pagination */}
          {!loading ? (
            <div className="pagination">
              <div
                onClick={handlePrev}
                className={`p-arrow ${
                  currentCursor !== 0 ? "" : "p-arrow-off"
                }`}
              >
                <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
              </div>
              <div
                onClick={handleNext}
                className={`p-arrow ${next ? "" : "p-arrow-off"}`}
              >
                <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <br />
      {token ? (
        userId?.role === "pelamar" ? (
          <TabBarPelamar />
        ) : (
          <TabBarPerusahaan />
        )
      ) : (
        <TabBarGuest />
      )}
      <Footer />
    </>
  );
}
