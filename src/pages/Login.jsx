import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { LoadingButton } from "../components/Loading";
import Cookies from "js-cookie";

export default function Login() {
  const nav = useNavigate();
  const [seePass, setSeePass] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [caution, setCaution] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleShowPass(e) {
    e.preventDefault();
    setSeePass(!seePass);
  }

  // function data dummy____________________________________________________________
  async function getData() {
    const { data } = await supabase.from("pelamar").select("*,data_pelamar(*)");
    const filterEmail = data.filter(
      (e) => e.email === inputEmail && e.password === inputPass
    );
    const { password, ...dataUser } = filterEmail[0];
    console.log(dataUser);
    if (filterEmail.length != 0) {
      console.log("berhasil masuk");
      Cookies.set("token");
      sessionStorage.setItem("data", JSON.stringify(dataUser));
      nav("/");
    } else {
      console.log("gagal masuk");
      setLoading(false);
      setCaution(true);
    }
  }

  // _______________________________________________________________________________

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    getData();
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
              <h5>Masuk ke akun anda</h5>
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
              <span>
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
            <a href="#">Lupa password?</a>
            <p>
              Belum punya akun? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
