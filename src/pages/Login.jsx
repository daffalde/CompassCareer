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

  // handle role
  const [handleRole, setHandleRole] = useState(null);
  const [rolePelamar, setRolePelamar] = useState(false);
  const [rolePerusahaan, setRolePerusahaan] = useState(false);
  const [nextButton, setNextButton] = useState(false);

  // function data dummy____________________________________________________________
  async function getData() {
    const rolePelamar = await supabase
      .from("pelamar")
      .select(
        "*,data_pelamar(*,cv(*),application(*),lowongan_tersimpan(*,lowongan(*)),perusahaan_tersimpan(*,data_perusahaan(*)))"
      );
    const rolePerusahaan = await supabase
      .from("perusahaan")
      .select("*,data_perusahaan(*,lowongan(*,application(*)))");

    const filterEmail = (
      handleRole === "pelamar" ? rolePelamar : rolePerusahaan
    ).data.filter((e) => e.email === inputEmail && e.password === inputPass);
    try {
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
    } catch (e) {
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
          {nextButton ? (
            <div
              onClick={() => {
                setNextButton(false);
              }}
              className="back-head"
            ></div>
          ) : null}
          <img
            className="auth-head-img"
            onClick={() => nav("/")}
            src="/logo1.svg"
            alt="logo Compass Career"
          />
        </div>
        <div className="auth-body">
          <div className="a-b-content">
            <div
              onClick={() => {
                setNextButton(false);
              }}
              className="a-b-back"
            ></div>
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

            {/* cover role */}
            <div className={`a-b-role ${nextButton ? "a-b-role-hidden" : ""}`}>
              <span>
                <p>Masuk sebagai apa?</p>
                <h4>Pilih Peran, Masuk dan Mulai Perjalananmu!</h4>
              </span>
              <div>
                <button
                  onClick={() => {
                    setRolePelamar(true);
                    setRolePerusahaan(false);
                    setHandleRole("pelamar");
                  }}
                  className={`role-button ${rolePelamar ? "role-on" : ""}`}
                >
                  <img
                    height={"40%"}
                    src={rolePelamar ? "/pelamar-off.svg" : "/pelamar-on.svg"}
                    alt="icon role perusahaan"
                  />
                  <p>Pelamar</p>
                </button>
                <button
                  onClick={() => {
                    setRolePerusahaan(true);
                    setRolePelamar(false);
                    setHandleRole("perusahaan");
                  }}
                  className={`role-button ${rolePerusahaan ? "role-on" : ""}`}
                >
                  <img
                    height={"40%"}
                    src={
                      rolePerusahaan ? "/company-on.svg" : "/company-off.svg"
                    }
                    alt="icon role perusahaan"
                  />
                  <p>Perusahaan</p>
                </button>
              </div>
              <br />
              <br />
              <br />
              <button
                className="button-main a-b-role-button"
                onClick={() => {
                  if (handleRole !== null) {
                    setNextButton(!nextButton);
                  }
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
