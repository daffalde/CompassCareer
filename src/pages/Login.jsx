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

  // Handle role selection
  const [handleRole, setHandleRole] = useState(null);
  const [nextButton, setNextButton] = useState(false);

  // Function to fetch user data
  async function getData() {
    if (!inputEmail || !inputPass) {
      console.log("Harap isi email dan password!");
      setCaution(true);
      return;
    }

    try {
      let roleData;
      if (handleRole === "pelamar") {
        const { data, error } = await supabase
          .from("pelamar")
          .select(
            "*,data_pelamar(*,cv(*),application(*),lowongan_tersimpan(*,lowongan(*)),perusahaan_tersimpan(*,data_perusahaan(*)))"
          );

        if (error) throw error;
        roleData = data;
      } else if (handleRole === "perusahaan") {
        const { data, error } = await supabase
          .from("perusahaan")
          .select("*,data_perusahaan(*,lowongan(*,application(*)))");
        if (error) throw error;
        roleData = data;
      } else {
        console.log("Role tidak valid");
        setCaution(true);
        return;
      }

      // Filter user by email and password
      const filterEmail = roleData.filter(
        (e) => e.email === inputEmail && e.password === inputPass
      );

      if (filterEmail.length > 0) {
        const { password, ...dataUser } = filterEmail[0];
        console.log("Berhasil masuk", dataUser);
        Cookies.set("token", "your_secure_token_here");
        sessionStorage.setItem("data", JSON.stringify(dataUser));
        nav("/");
      } else {
        console.log("Gagal masuk: Email atau password salah.");
        setLoading(false);
        setCaution(true);
      }
    } catch (error) {
      console.error("Terjadi kesalahan dalam proses login:", error.message);
      setLoading(false);
      setCaution(true);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    getData();
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
            <a href="#">Lupa password?</a>
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
