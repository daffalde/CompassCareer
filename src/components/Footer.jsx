import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="f-top">
            <div className="f-t-item">
              <img id="f-t-i-img" src="./logo3.svg" alt="logo footer" />
              <p>
                Platform job portal yang membantu pencari kerja menemukan
                peluang terbaik
              </p>
              <span>
                <button
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com/")
                  }
                >
                  <img src="./fb.svg" alt="facebook social media image" />
                </button>
                <button
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com/")
                  }
                >
                  <img src="./ig.svg" alt="instagram social media image" />
                </button>
                <button
                  onClick={() =>
                    (window.location.href = "https://www.youtube.com/")
                  }
                >
                  <img src="./yt.svg" alt="youtube social media image" />
                </button>
                <button
                  onClick={() =>
                    (window.location.href = "https://mail.google.com/")
                  }
                >
                  <img src="./gl.svg" alt="email social media image" />
                </button>
              </span>
            </div>
            <div className="f-t-item">
              <ul>
                <li>
                  <h5>Navigasi</h5>
                </li>
                <li>
                  <Link to={"/"}>Beranda</Link>
                </li>
                <li>
                  <Link to={"/lowongan"}>Cari Pekerjaan</Link>
                </li>
                <li>
                  <Link to={"/perusahaan"}>Perusahaan</Link>
                </li>
                <li>
                  <Link to={"/tentang"}>Tentang Kami</Link>
                </li>
              </ul>
            </div>
            <div className="f-t-item">
              <ul>
                <li>
                  <h5>Hubungi Kami</h5>
                </li>
                <li>
                  <span>
                    <img src="./mail1.svg" alt="logo mail hubungi kami" />
                    <p>support@yourjobportal.com</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img src="./phone1.svg" alt="logo telepon hubungi kami" />
                    <p>+62 xxx-xxxx-xxxx</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img src="./location2.svg" alt="logo lokasi hubungi kami" />
                    <p>DKI Jakarta</p>
                  </span>
                </li>
              </ul>
            </div>
            <div className="f-t-item">
              <span>
                <button
                  onClick={() => (window.location.href = "/lowongan")}
                  className="button-second"
                >
                  Mencari Pekerjaan
                </button>
                <button
                  onClick={() => (window.location.href = "/lowongan")}
                  className="button-main"
                >
                  Pasang Lowongan
                </button>
              </span>
            </div>
          </div>
          <div className="f-bottom">
            <p>© 2025 · CompassCareer </p>
            <span>
              <Link to={"/privasi"}>Kebijakan Privasi</Link>
              <Link to={"/ketentuan"}>Syarat & Ketentuan</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
