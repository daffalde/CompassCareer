import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/aboutus.css";
import { kategori, lowongan, perusahaan, user } from "../data/Data";

export default function Aboutus() {
  const nav = useNavigate();
  return (
    <>
      <div className="container">
        <Header />
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
            <button className="button-main">Bergabung sekarang</button>
            <button onClick={() => nav("/lowongan")}>Cari Pekerjaan</button>
          </span>
        </div>
        <div className="aboutus-about">
          <div className="a-a-left">
            <img src="/about-group.png" alt="group of person working image" />
          </div>
          <div className="a-a-rigth">
            <h6>Tentang Kami</h6>
            <h2>Membangun Jembatan Menuju Karier Impian</h2>
            <p>
              Kami adalah platform job portal yang memudahkan pencari kerja
              mendapatkan rekomendasi pekerjaan terbaik berdasarkan CV mereka.
              Dengan teknologi cerdas, kami menghubungkan Anda dengan peluang
              yang sesuai dengan keahlian dan pengalaman Anda.
            </p>
            <p>
              Selain membantu individu menemukan pekerjaan impian, kami juga
              mendukung perusahaan dalam mencari talenta terbaik. Dengan proses
              yang cepat dan akurat, kami memastikan pencari kerja dan pemberi
              kerja bertemu dalam satu platform yang efisien.
            </p>
          </div>
        </div>
        <div className="aboutus-gap">
          <span>
            <h1>{lowongan.length}+</h1>
            <p>
              Saat ini terdapat {lowongan.length} peluang kerja aktif yang bisa
              Anda lamar.
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
              Sudah ada {user.length} pelamar yang bergabung kesempatan baru.
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
                Dapatkan rekomendasi pekerjaan yang sesuai dengan keahlian dan
                pengalaman Anda.
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
                Terhubung dengan banyak perusahaan yang mencari talenta seperti
                Anda.
              </p>
            </span>
            <span>
              <img src="/check.svg" alt="ceklis icon" />
              <p>
                Privasi dan keamanan data Anda selalu menjadi prioritas utama
                kami.
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
        <h4 style={{ textAlign: "center" }}>
          Langkah Mudah Menuju Karier Impian
        </h4>
        <p style={{ textAlign: "center" }}>
          Ikuti langkah mudah untuk menemukan pekerjaan terbaik yang sesuai
          dengan keahlian dan pengalaman Anda.
        </p>
        <br />
        <br />
        <div className="aboutus-timeline">
          <div className="a-t-left">
            <span className="a-t-b">
              <div className="a-t-blue">#1 Daftar & Buat Profil</div>
              <div className="a-t-desc">
                <p>
                  Registrasi akun dan lengkapi profil dengan informasi pribadi
                  serta keahlian Anda.
                </p>
              </div>
            </span>
            <span className="a-t-b">
              <div className="a-t-blue">#3 Temukan Pekerjaan</div>
              <div className="a-t-desc">
                <p>
                  Jelajahi lowongan yang cocok dan dapatkan rekomendasi otomatis
                  berdasarkan CV Anda.
                </p>
              </div>
            </span>
          </div>
          <div className="a-t-right">
            <span className="a-t-b-2">
              <div className="a-t-blue2">#2 Unggah CV</div>
              <div className="a-t-desc2">
                <p>
                  Tambahkan CV untuk mendapatkan rekomendasi pekerjaan sesuai
                  pengalaman dan keterampilan Anda.
                </p>
              </div>
            </span>
            <span className="a-t-b-2">
              <div className="a-t-blue2">#4 Lamar & Pantau Status</div>
              <div className="a-t-desc2">
                <p>
                  Ajukan lamaran langsung dan pantau perkembangan proses seleksi
                  melalui dashboard.
                </p>
              </div>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
