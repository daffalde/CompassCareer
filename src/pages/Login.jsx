import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { useEffect, useState } from "react";
import { LoadingButton } from "../components/Loading";
import Cookies from "js-cookie";
import axios from "axios";

export default function Login() {
  const nav = useNavigate();
  if (Cookies.get("token")) {
    nav("/");
  }
  const [seePass, setSeePass] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [caution, setCaution] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleShowPass(e) {
    e.preventDefault();
    setSeePass(!seePass);
  }

  // Handle role selection
  const [handleRole, setHandleRole] = useState(null);
  const [nextButton, setNextButton] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post(
        `https://careercompass-backend.vercel.app/auth/${
          handleRole === "pelamar" ? "pelamar" : "perusahaan"
        }/login`,
        {
          email: inputEmail,
          password: inputPass,
        }
      );
      Cookies.set("token", resp.data.token);
      Cookies.set("data", JSON.stringify(resp.data.data[0]));
      nav("/");
    } catch (e) {
      console.log(e);
      setCaution(true);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="auth-head">
          {nextButton && (
            <div
              onClick={() => setNextButton(false)}
              className="back-head"
            ></div>
          )}
          <img
            className="auth-head-img"
            onClick={() => nav("/")}
            src="/logo1.svg"
            alt="logo Compass Career"
          />
        </div>
        <div className="auth-body">
          <div className="a-b-content">
            {nextButton && (
              <div
                onClick={() => setNextButton(false)}
                className="a-b-back"
              ></div>
            )}
            <span>
              <h5>Masuk ke akun Anda</h5>
              <p>Akses peluang kerja terbaik dengan sekali login</p>
            </span>
            <form onSubmit={handleLogin}>
              <span>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Johndoe@example.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              </span>
              <span className="passs">
                <label htmlFor="password">Password</label>
                <input
                  type={seePass ? "text" : "password"}
                  id="password"
                  placeholder="Minimum 8 karakter"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                />
                <button id="show-pass" onClick={handleShowPass}>
                  <img
                    src={`/${seePass ? "no-eye.svg" : "eye.svg"}`}
                    alt="show pass icon"
                  />
                </button>
              </span>
              {caution && (
                <p className="caution">
                  Login gagal! Periksa kembali email dan password kamu.
                </p>
              )}
              <button className="button-main button-auth">
                Masuk {loading && <LoadingButton />}
              </button>
            </form>
            <p>
              Belum punya akun? <a href="/signup">Sign Up</a>
            </p>

            {/* Role Selection */}
            <div className={`a-b-role ${nextButton ? "a-b-role-hidden" : ""}`}>
              <span>
                <p>Masuk sebagai apa?</p>
                <h4>Pilih Peran, Masuk dan Mulai Perjalananmu!</h4>
              </span>
              <div>
                <button
                  onClick={() => {
                    setHandleRole("pelamar");
                  }}
                  className={`role-button ${
                    handleRole === "pelamar" ? "role-on" : ""
                  }`}
                >
                  <img
                    height="40%"
                    src={
                      handleRole === "pelamar"
                        ? "/pelamar-off.svg"
                        : "/pelamar-on.svg"
                    }
                    alt="icon role pelamar"
                  />
                  <p>Pelamar</p>
                </button>
                <button
                  onClick={() => {
                    setHandleRole("perusahaan");
                  }}
                  className={`role-button ${
                    handleRole === "perusahaan" ? "role-on" : ""
                  }`}
                >
                  <img
                    height="40%"
                    src={
                      handleRole === "perusahaan"
                        ? "/company-on.svg"
                        : "/company-off.svg"
                    }
                    alt="icon role perusahaan"
                  />
                  <p>Perusahaan</p>
                </button>
              </div>
              <button
                className="button-main a-b-role-button"
                onClick={() => {
                  if (handleRole) setNextButton(!nextButton);
                }}
              >
                Lanjut <img src="/right-arrow.svg" alt="right arrow icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
