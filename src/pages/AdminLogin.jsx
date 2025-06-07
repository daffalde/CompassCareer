import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { useEffect, useState } from "react";
import { LoadingButton } from "../components/Loading";
import Cookies from "js-cookie";
import axios from "axios";

export default function AdminLogin() {
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
  const [nextButton, setNextButton] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post(
        "https://careercompass-backend.vercel.app/auth/admin/login",
        {
          email: inputEmail,
          password: inputPass,
        }
      );
      Cookies.set("token", resp.data.token);
      Cookies.set("data", JSON.stringify(resp.data.data[0]));
      nav("/dashboard");
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
              <h5>Admin login</h5>
              <p>
                Masuk ke sistem dengan kredensial aman untuk mengelola data dan
                pengaturan.
              </p>
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
