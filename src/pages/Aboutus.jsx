import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/aboutus.css";
import { kategori } from "../data/Data";
import { LoadingPage } from "../components/Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Aboutus() {
  const nav = useNavigate();

  const token = Cookies.get("token");

  const [lowongan, setLowongan] = useState(null);
  const [perusahaan, setPerusahaan] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  async function getData() {
    try {
      const resp = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      const resp2 = await axios.get(
        "https://careercompass-backend.vercel.app/auth/perusahaan"
      );
      const resp3 = await axios.get(
        "https://careercompass-backend.vercel.app/auth/pelamar"
      );
      setLowongan(resp.data);
      setPerusahaan(resp2.data);
      setUser(resp3.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="container">
        <Header />
        {loadingPage ? (
          <LoadingPage />
        ) : (
          <>
            {" "}
            <div className="aboutus-head">
              <h6>Career Compass</h6>
              <h1>
                Kami Membantu Anda Menemukan <br /> Karier yang Tepat
              </h1>
              <p>
                Dengan rekomendasi berbasis CV, kami menghubungkan Anda dengan
                <br />
                peluang kerja terbaik sesuai keahlian dan pengalaman Anda.
              </p>
              <br />
              <span>
                <button
                  onClick={() => (token ? nav("/") : nav("/login"))}
                  className="button-main"
                >
                  Bergabung sekarang
                </button>
                <button onClick={() => nav("/lowongan")}>Cari Pekerjaan</button>
              </span>
            </div>
            <div className="aboutus-about">
              <div className="a-a-left">
                <img
                  src="/about-group.png"
                  alt="group of person working image"
                />
              </div>
              <div className="a-a-rigth">
                <h6>Tentang Kami</h6>
                <h2>Membangun Jembatan Menuju Karier Impian</h2>
                <p>
                  Kami adalah platform job portal yang memudahkan pencari kerja
                  mendapatkan rekomendasi pekerjaan terbaik berdasarkan CV
                  mereka. Dengan teknologi cerdas, kami menghubungkan Anda
                  dengan peluang yang sesuai dengan keahlian dan pengalaman
                  Anda.
                </p>
                <p>
                  Selain membantu individu menemukan pekerjaan impian, kami juga
                  mendukung perusahaan dalam mencari talenta terbaik. Dengan
                  proses yang cepat dan akurat, kami memastikan pencari kerja
                  dan pemberi kerja bertemu dalam satu platform yang efisien.
                </p>
              </div>
            </div>
            <div className="aboutus-gap">
              <span>
                <h1>{lowongan.length}+</h1>
                <p>
                  Saat ini terdapat {lowongan.length} peluang kerja aktif yang
                  bisa Anda lamar.
                </p>
              </span>
              <span>
                <h1>{perusahaan.length}+</h1>
                <p>
                  Lebih dari {perusahaan.length} perusahaan siap mencari talenta
                  terbaik.
                </p>
              </span>
              <span>
                <h1>{kategori.length}+</h1>
                <p>
                  Pekerjaan tersedia dalam {kategori.length} kategori berbeda,
                  sesuai berbagai keahlian.
                </p>
              </span>
              <span>
                <h1>{user.length}+</h1>
                <p>
                  Sudah ada {user.length} pelamar yang bergabung untuk
                  kesempatan baru.
                </p>
              </span>
            </div>
            <div className="aboutus-benefit">
              <div className="a-a-right">
                <h6>Kenapa kami?</h6>
                <h2>Apa Keuntungan Bergabung dengan Kami?</h2>
                <span>
                  <img src="/check.svg" alt="ceklis icon" />
                  <p>
                    Dapatkan rekomendasi pekerjaan yang sesuai dengan keahlian
                    dan pengalaman Anda.
                  </p>
                </span>
                <span>
                  <img src="/check.svg" alt="ceklis icon" />
                  <p>
                    Unggah CV sekali, lalu temukan berbagai pilihan pekerjaan
                    terbaik.
                  </p>
                </span>
                <span>
                  <img src="/check.svg" alt="ceklis icon" />
                  <p>
                    Terhubung dengan banyak perusahaan yang mencari talenta
                    seperti Anda.
                  </p>
                </span>
                <span>
                  <img src="/check.svg" alt="ceklis icon" />
                  <p>
                    Privasi dan keamanan data Anda selalu menjadi prioritas
                    utama kami.
                  </p>
                </span>
              </div>
              <div className="a-a-left">
                <img
                  id="person-working"
                  src="/person-work.jpg"
                  alt="person working"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
