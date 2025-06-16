import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingButton } from "../components/Loading";
import { AlertFailed, AlertSucceed } from "../components/Alert";
import Cookies from "js-cookie";
import { TabBarGuest } from "../components/TabBar";

export default function Logout() {
  const nav = useNavigate();
  if (Cookies.get("token")) {
    nav("/");
  }

  const [seePass, setSeePass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  function handleShowPass(e) {
    e.preventDefault();
    setSeePass(!seePass);
  }

  // register
  async function handleReg(e) {
    setLoading(true);
    if ((!role && name == "", email == "", password == "")) {
      setLoading(false);
      return setWarning(true);
    }
    if (role === "pelamar") {
      try {
        const resp = await axios.post(
          "https://careercompass-backend.vercel.app/auth/pelamar/register",
          {
            name: name,
            email: email,
            password: password,
          }
        );
        setAlert("success");
      } catch (e) {
        setLoading(false);
        setAlert(e.response.data.message);
      }
    } else {
      try {
        const resp = await axios.post(
          "https://careercompass-backend.vercel.app/auth/perusahaan/register",
          {
            name: name,
            email: email,
            password: password,
          }
        );
        setAlert("success");
      } catch (e) {
        setLoading(false);
        setAlert(e.response.data.message);
      }
    }
  }

  useEffect(() => {
    if (alert === "success") {
      const timeout = setTimeout(() => {
        nav("/login");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);
  return (
    <>
      {alert ? (
        alert === "success" ? (
          <AlertSucceed message={"Berhasil,silahkan login"} />
        ) : (
          <AlertFailed message={alert} />
        )
      ) : null}
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
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </span>
              <span>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  placeholder="Johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
              <span className="pass-input">
                <label htmlFor="password">Password</label>
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
              <span id="role">
                <label htmlFor="role">Role</label>
                <select onChange={(e) => setRole(e.target.value)} id="role">
                  <option value="" hidden>
                    Pelamar/Perusahaan
                  </option>
                  <option value="pelamar">Pelamar</option>
                  <option value="perusahaan">Perusahaan</option>
                </select>
              </span>
            </form>
            {warning ? (
              <p className="warning">*Silahkan isi kredensial dengan lengkap</p>
            ) : null}
            <button
              onClick={() => handleReg()}
              className="button-main button-auth"
            >
              Daftar
              {loading ? <LoadingButton /> : null}
            </button>
            <p>
              Sudah punya akun? <a href="/login">Sign In</a>
            </p>
          </div>
        </div>
      </div>
      <TabBarGuest />
      <Footer />
    </>
  );
}
