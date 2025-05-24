import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { provinsi } from "../data/Provinsi";
import "../styles/perusahaan.css";
import { kategori } from "../data/Data";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../components/Loading";
import { supabase } from "../data/supabaseClient";

export default function Perusahaan() {
  const nav = useNavigate();
  const inputCari = useRef("");
  const [inputLokasi, setInputLokasi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [cari, setCari] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  function handleCari(e) {
    e.preventDefault();
    setCari(inputCari.current.value);
    setLokasi(inputLokasi);
  }

  async function getPerusahaan() {
    try {
      setUser(JSON.parse(sessionStorage.getItem("data")));
      const { data, error } = await supabase
        .from("perusahaan")
        .select("*, data_perusahaan(*,lowongan(*),perusahaan_tersimpan(*))");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPerusahaan();
  }, []);

  // Hitung pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  // tombol simpan
  async function simpanPerusahaan(e) {
    await supabase.from("perusahaan_tersimpan").insert({
      id_pelamar: user.id_pelamar,
      id_perusahaan: e,
    });
    getPerusahaan();
  }

  //tombol hapus simpan
  async function hapusSimpanPerusahaan(e) {
    try {
      await supabase
        .from("perusahaan_tersimpan")
        .delete()
        .eq("id_perusahaan_tersimpan", e);
      getPerusahaan();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
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
                      ref={inputCari}
                      type="text"
                      placeholder="Cari Perusahaan...."
                    />
                  </span>
                  <div className="perusahaan-gap"></div>
                  <span>
                    <img src="/location4.svg" alt="location logo" />
                    <input
                      list="prov"
                      value={inputLokasi}
                      onChange={(e) => setInputLokasi(e.target.value)}
                      type="text"
                      placeholder="Lokasi?"
                    />
                    <datalist id="prov">
                      {inputLokasi.length >= 2 &&
                        provinsi.map((provinsi) => (
                          <option
                            key={provinsi.id}
                            value={provinsi.name}
                          ></option>
                        ))}
                    </datalist>
                  </span>
                  <button onClick={handleCari}>Cari</button>
                </form>
              </div>
            </div>
            <div className="perusahaan-body">
              {currentItems
                .filter(
                  (filtering) =>
                    filtering.nama.toLowerCase().includes(cari.toLowerCase()) &&
                    filtering.data_perusahaan.provinsi
                      .toLowerCase()
                      .includes(lokasi.toLowerCase())
                )
                .map((e) => (
                  <div
                    className="p-b-list"
                    onClick={() => nav(`/perusahaan/${e.id_perusahaan}`)}
                    key={e.id_perusahaan}
                  >
                    {e.data_perusahaan.perusahaan_tersimpan.length !== 0 ? (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          hapusSimpanPerusahaan(
                            e.data_perusahaan.perusahaan_tersimpan.find(
                              (element) =>
                                element.id_pelamar === user.id_pelamar
                            ).id_perusahaan_tersimpan
                          );
                        }}
                        className="p-b-l-save"
                      >
                        <img src="/save2.svg" alt="save icon" />
                      </button>
                    ) : (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          simpanPerusahaan(e.id_perusahaan);
                        }}
                        className="p-b-l-save"
                      >
                        <img src="/save1.svg" alt="save icon" />
                      </button>
                    )}
                    <img
                      className="p-b-l-img"
                      src={
                        e.data_perusahaan.picture
                          ? e.data_perusahaan.picture
                          : "/profil-perusahaan.svg"
                      }
                      alt="gambar profil perusahaan"
                    />
                    <div className="p-b-l-info">
                      <span>
                        <p style={{ color: "grey" }}>
                          {e.data_perusahaan.bidang}
                        </p>
                        <h5>{e.nama}</h5>
                      </span>
                      <div>
                        <img src="/location1.svg" alt="icon lokasi" />
                        <p>
                          {e.data_perusahaan.lokasi},{" "}
                          {e.data_perusahaan.provinsi}
                        </p>
                      </div>
                      <p>
                        {e.data_perusahaan.lowongan.length === 0
                          ? `Belum ada lowongan yang tersedia`
                          : `Ada ${e.data_perusahaan.lowongan.length} lowongan tersedia`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-arrow"
              >
                <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
              </div>
              {Array.from({ length: totalPages }, (_, i) => (
                <div
                  key={i}
                  className={`p-item ${
                    currentPage === i + 1 ? "pagig-on" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <p>{i + 1}</p>
                </div>
              ))}
              <div
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-arrow"
              >
                <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
