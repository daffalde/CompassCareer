import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { useState } from "react";

export default function Logout() {
  const nav = useNavigate();
  const [seePass, setSeePass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleShowPass(e) {
    e.preventDefault();
    setSeePass(!seePass);
  }
  return (
    <>
      <div className="container">
        <div className="auth-head">
          <img
            onClick={() => nav("/")}
            src="/logo1.svg"
            alt="logo Compass Career"
          />
        </div>
        <div className="auth-body">
          <div className="a-b-content">
            <span>
              <h5>Buat akun baru</h5>
              <p>Akses peluang kerja terbaik dengan sekali login</p>
            </span>
            <form>
              <span>
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </span>
              <span>
                <label for="email">Email</label>
                <input
                  type="text"
                  id="email"
                  placeholder="Johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
              <span className="pass-input">
                <label for="password">Password</label>
                <input
                  type={seePass ? "text" : "password"}
                  id="password"
                  placeholder="Minimum 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button id="show-pass" onClick={handleShowPass}>
                  <img
                    src={`/${seePass ? "no-eye.svg" : "eye.svg"}`}
                    alt="show pass icon"
                  />
                </button>
              </span>
              <button className="button-main button-auth">Daftar</button>
            </form>
            <div className="auth-gap"></div>
            <span className="oauth">
              <button>
                <img src="/gl-auth.svg" alt="google icon" />
                <p>Daftar dengan Google</p>
              </button>
              <button>
                <img src="/fb-auth.svg" alt="facebook icon" />
                <p>Daftar dengan Facebook</p>
              </button>
            </span>
            <p>
              Sudah punya akun? <a href="/login">Sign In</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
