import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/kebijakan.css";

export default function Privasi() {
  return (
    <>
      <div className="container">
        <Header />
        <div className="kebijakan">
          <h4>Kebijakan Privasi</h4>
          <p>
            Selamat datang di CompassCareer. Kami berkomitmen untuk menjaga
            privasi dan keamanan data pengguna saat menggunakan layanan kami.
            Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, dan melindungi informasi pribadi yang diberikan oleh
            pengguna.
          </p>
          <br />

          <h5>1. Informasi yang Kami Kumpulkan</h5>
          <p>
            Kami mengumpulkan informasi berikut saat pengguna menggunakan
            layanan kami:
          </p>
          <ul>
            <li>
              <p>
                <b>Informasi Pribadi</b>: Nama, alamat email, nomor telepon, dan
                informasi lain yang diberikan saat pendaftaran.
              </p>
            </li>
            <li>
              <p>
                <b>CV dan Data Profil</b>: Informasi terkait pengalaman kerja,
                keahlian, pendidikan, dan preferensi pekerjaan yang diberikan
                oleh pengguna.
              </p>
            </li>
            <li>
              <p>
                <b>Data Penggunaan</b>: Informasi tentang bagaimana pengguna
                berinteraksi dengan platform, termasuk pencarian pekerjaan dan
                preferensi rekomendasi.
              </p>
            </li>
            <li>
              <p>
                <b>Data Teknis</b>: Alamat IP, jenis perangkat, dan data
                analitik lainnya untuk meningkatkan layanan kami.
              </p>
            </li>
          </ul>
          <br />

          <h5>2. Cara Kami Menggunakan Informasi</h5>
          <p>Kami menggunakan data pengguna untuk:</p>
          <ul>
            <li>
              Memberikan rekomendasi pekerjaan yang sesuai menggunakan teknologi
              machine learning.
            </li>
            <li>
              Menyempurnakan algoritma pencarian dan rekomendasi berdasarkan
              preferensi pengguna.
            </li>
            <li>Menghubungkan pencari kerja dengan perusahaan yang sesuai.</li>
            <li>Memantau dan meningkatkan kualitas layanan kami.</li>
            <li>Menjaga keamanan dan mencegah penyalahgunaan platform.</li>
          </ul>
          <br />

          <h5>3. Berbagi Informasi dengan Pihak Ketiga</h5>
          <p>
            Kami tidak menjual atau membagikan data pribadi pengguna kepada
            pihak ketiga tanpa izin, kecuali:
          </p>
          <ul>
            <li>
              Untuk memenuhi kewajiban hukum atau permintaan dari otoritas
              terkait.
            </li>
            <li>
              Dengan penyedia layanan pihak ketiga yang membantu dalam
              operasional platform, seperti hosting dan analitik.
            </li>
            <li>
              Dalam kondisi pengguna menyetujui berbagi data dengan perusahaan
              pencari tenaga kerja.
            </li>
          </ul>
          <br />

          <h5>4. Keamanan Data</h5>
          <p>
            Kami menerapkan langkah-langkah keamanan teknis dan administratif
            untuk melindungi data pengguna dari akses yang tidak sah,
            kehilangan, atau perubahan yang tidak diinginkan.
          </p>
          <br />

          <h5>5. Hak Pengguna</h5>
          <p>Pengguna memiliki hak untuk:</p>
          <ul>
            <li>
              Mengakses, memperbarui, atau menghapus informasi pribadi mereka.
            </li>
            <li>
              Menolak penggunaan data tertentu untuk rekomendasi pekerjaan.
            </li>
            <li>
              Mengajukan pertanyaan atau keluhan terkait privasi mereka melalui
              kontak yang disediakan.
            </li>
          </ul>
          <br />

          <h5>6. Perubahan Kebijakan</h5>
          <p>
            Kebijakan ini dapat diperbarui dari waktu ke waktu sesuai dengan
            perkembangan layanan kami. Perubahan akan diinformasikan melalui
            platform atau email kepada pengguna.
          </p>
          <br />

          <h5>7. Kontak Kami</h5>
          <p>
            Jika ada pertanyaan terkait kebijakan privasi ini, pengguna dapat
            menghubungi kami melalui [Alamat Email atau Kontak].
          </p>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
}
