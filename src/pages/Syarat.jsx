import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/kebijakan.css";

export default function Syarat() {
  return (
    <>
      <div className="container">
        <Header />
        <div className="kebijakan">
          <h4>Syarat dan Ketentuan</h4>
          <p>
            Selamat datang di CompassCareer! Dengan menggunakan layanan kami,
            pengguna setuju untuk mematuhi syarat dan ketentuan yang telah kami
            tetapkan. Harap baca dengan seksama sebelum menggunakan platform.
          </p>
          <br />

          <h5>1. Pendaftaran Akun</h5>
          <p>
            Pengguna wajib memberikan informasi yang akurat dan terbaru saat
            mendaftar di platform. Pengguna bertanggung jawab atas keamanan akun
            mereka, termasuk menjaga kerahasiaan kata sandi.
          </p>
          <br />

          <h5>2. Penggunaan Layanan</h5>
          <p>
            Pengguna setuju untuk menggunakan platform sesuai dengan ketentuan
            berikut:
          </p>
          <ul>
            <li>
              Tidak menggunakan layanan untuk tujuan ilegal atau merugikan pihak
              lain.
            </li>
            <li>
              Tidak mengunggah atau mendistribusikan konten yang melanggar hak
              cipta, privasi, atau hukum yang berlaku.
            </li>
            <li>
              Tidak mencoba meretas, mengganggu, atau mengakses data pengguna
              lain secara tidak sah.
            </li>
          </ul>
          <br />

          <h5>3. Rekomendasi Pekerjaan</h5>
          <p>
            Sistem rekomendasi pekerjaan berbasis machine learning kami
            bertujuan memberikan saran yang paling sesuai bagi pengguna
            berdasarkan informasi yang diberikan. Namun, kami tidak menjamin
            bahwa setiap rekomendasi akan menghasilkan tawaran pekerjaan.
          </p>
          <br />

          <h5>4. Hak dan Kewajiban Pengguna</h5>
          <p>
            Pengguna memiliki hak untuk mengakses, memperbarui, dan menghapus
            data mereka dari platform. Selain itu, pengguna bertanggung jawab
            atas kebenaran data yang mereka berikan.
          </p>
          <br />

          <h5>5. Perubahan dan Penghentian Layanan</h5>
          <p>
            Kami berhak untuk memperbarui, mengubah, atau menghentikan layanan
            sewaktu-waktu, dengan atau tanpa pemberitahuan terlebih dahulu
            kepada pengguna.
          </p>
          <br />

          <h5>6. Batasan Tanggung Jawab</h5>
          <p>CompassCareer tidak bertanggung jawab atas:</p>
          <ul>
            <li>
              Keakuratan atau kesesuaian rekomendasi pekerjaan dengan preferensi
              pengguna.
            </li>
            <li>
              Kerugian yang timbul akibat keputusan pengguna berdasarkan
              rekomendasi sistem.
            </li>
            <li>
              Gangguan atau kesalahan teknis yang dapat mempengaruhi akses
              layanan.
            </li>
          </ul>
          <br />

          <h5>7. Hukum yang Berlaku</h5>
          <p>
            Syarat dan ketentuan ini tunduk pada hukum yang berlaku di
            Indonesia. Jika terjadi perselisihan, kami akan berupaya
            menyelesaikannya dengan cara yang adil dan transparan.
          </p>
          <br />

          <h5>8. Kontak Kami</h5>
          <p>
            Jika ada pertanyaan atau keluhan terkait syarat dan ketentuan ini,
            pengguna dapat menghubungi kami melalui [Alamat Email atau Kontak].
          </p>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
}
