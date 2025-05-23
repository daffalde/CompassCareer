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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [caution, setCaution] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleShowPass(e) {
    e.preventDefault();
    setSeePass(!seePass);
  }

  // function data dummy____________________________________________________________
  async function getData() {
    const { data } = await supabase.from("pelamar").select("*");
    const filterEmail = data.filter(
      (e) => e.email === email && e.password === password
    );
    const selectData = {
      id: filterEmail[0].id,
      nama: filterEmail[0].nama,
      email: filterEmail[0].email,
    };
    if (filterEmail.length != 0) {
      console.log("berhasil masuk");
      Cookies.set("token");
      sessionStorage.setItem("data", JSON.stringify(selectData));
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
              <span>
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
