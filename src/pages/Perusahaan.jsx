import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { provinsi } from "../data/Provinsi";
import "../styles/perusahaan.css";
import { kategori } from "../data/Data";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../components/Loading";
import { supabase } from "../data/supabaseClient";
import axios from "axios";
import Cookies from "js-cookie";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";

export default function Perusahaan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userData = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const inputCari = useRef("");
  const [inputLokasi, setInputLokasi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [cari, setCari] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  console.log(userData);

  function handleCari(e) {
    e.preventDefault();
    setCari(inputCari.current.value);
    setLokasi(inputLokasi);
  }

  async function getPerusahaan() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/auth/perusahaan"
      );
      setData(resp.data);
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
                    filtering.nama_perusahaan
                      ?.toLowerCase()
                      .includes(cari.toLowerCase()) &&
                    (filtering.provinsi?.toLowerCase() || "").includes(
                      lokasi.toLowerCase()
                    )
                )
                .map((e) => (
                  <div
                    className="p-b-list"
                    onClick={() => nav(`/perusahaan/${e.id_perusahaan}`)}
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
      <br />
      {token ? (
        userData?.role === "pelamar" ? (
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
