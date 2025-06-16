import { useEffect, useState } from "react";
import Header from "../components/Header";
import { provinsi } from "../data/Provinsi";
import "../styles/perusahaan.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Skeleton } from "../components/Skeleton";
import { SidePerusahaan } from "../components/SideLowongan";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";
import { DataLogin } from "../data/DataLogin";

export default function Perusahaan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userData = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const user = DataLogin();

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
          `https://careercompass-backend.vercel.app/auth/perusahaan?cursor=${currentCursor}&nama_perusahaan=${inputCari}&provinsi=${inputLokasi}`
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
  }, [currentCursor || inputCari || inputLokasi]);

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

  // select lowongan function
  const [select, setSelect] = useState(null);

  return (
    <>
      <div className="container">
        <Header />
        {select !== null ? (
          <button onClick={() => setSelect(null)} className="side-back">
            <img src="/left-arrow.png" alt="back icon" />
            <p>Kembali</p>
          </button>
        ) : null}
        <div
          onClick={() => setSelect(null)}
          onScroll={(e) => e.stopPropagation()}
          className={`side-wrap ${select === null ? "side-wrap-off" : ""}`}
        ></div>
        <SidePerusahaan
          data={data.filter((e) => e.id_perusahaan === select)}
          show={select !== null ? true : false}
        />
        <div
          style={{ backgroundImage: `url("/building-header.jpg")` }}
          className="perusahaan-head"
        >
          <span>
            <h2>Temukan Perusahaan Impian untuk Karier Anda</h2>
            <p>
              Jelajahi peluang kerja dari berbagai perusahaan terbaik untuk
              karier Anda.
            </p>
          </span>
          <div className="p-h-search">
            <form>
              <span>
                <img src="/search1.svg" alt="search logo" />
                <input
                  value={valueCari}
                  onChange={(e) => setValueCari(e.target.value)}
                  type="text"
                  placeholder="Cari Perusahaan...."
                />
              </span>
              <div className="perusahaan-gap"></div>
              <span>
                <img src="/location4.svg" alt="location logo" />
                <input
                  list="prov"
                  value={valueLokasi}
                  onChange={(e) => setValueLokasi(e.target.value)}
                  type="text"
                  placeholder="Lokasi?"
                />
                <datalist id="prov">
                  {valueLokasi.length >= 2 &&
                    provinsi.map((provinsi) => (
                      <option key={provinsi.id} value={provinsi.name}></option>
                    ))}
                </datalist>
              </span>
              <button className="button-main" onClick={handleCari}>
                Cari
              </button>
            </form>
          </div>
        </div>
        <div className="perusahaan-body">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} width={"100%"} height={"130px"} />
              ))
            : data.map((e) => (
                <div
                  className="p-b-list"
                  onClick={() => setSelect(e.id_perusahaan)}
                  key={e.id_perusahaan}
                >
                  <img
                    className="p-b-l-img"
                    src={e.picture ? e.picture : "/profil-perusahaan.svg"}
                    alt="gambar profil perusahaan"
                  />
                  <div className="p-b-l-info">
                    <span>
                      <p style={{ color: "grey" }}>
                        {e.bidang ? e.bidang : "-"}
                      </p>
                      <h5>{e.nama_perusahaan}</h5>
                    </span>
                    <div>
                      <img src="/location1.svg" alt="icon lokasi" />
                      {e.lokasi && e.provinsi ? (
                        <p>
                          {e.lokasi}, {e.provinsi}
                        </p>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        {!loading ? (
          <div className="pagination">
            <div
              onClick={handlePrev}
              className={`p-arrow ${currentCursor !== 0 ? "" : "p-arrow-off"}`}
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
      <br />
      {user.token ? (
        user.data.role === "pelamar" ? (
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
