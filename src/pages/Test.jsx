import { useEffect, useState } from "react";
import Header from "../components/Header";
import Cookies from "js-cookie";
import { perusahaan, user } from "../data/Data";

export default function Test() {
  const [kuki, setKuki] = useState("");

  function handleCookie() {
    const kue = Cookies.get("token");
    if (kue) {
      setKuki("ada");
    } else {
      setKuki("tidak ada");
    }
  }

  useEffect(() => {
    handleCookie();
  }, []);

  function handleAddKuki() {
    Cookies.set("token", "abcdefghijklmn");
    handleCookie();
  }

  function handleDeleteKuki() {
    Cookies.remove("token");
    handleCookie();
  }

  //   cek user
  function cekUser() {
    const user = localStorage.getItem("auth");
    console.log(JSON.parse(user));
  }
  //   logout
  function LogOut() {
    localStorage.removeItem("auth");
    Cookies.remove("token");
    window.location.reload();
  }
  //   fungsi login
  function loginUser() {
    const data = user[0];
    localStorage.setItem("auth", JSON.stringify(data));
    Cookies.set("token", "abcdefghijklmn");
    handleCookie();
  }

  function loginPerusahaan() {
    const data = perusahaan[0];
    localStorage.setItem("auth", JSON.stringify(data));
    Cookies.set("token", "abcdefghijklmn");
    handleCookie();
  }
  return (
    <>
      <div className="container">
        <Header />
        <h1>ini halaman tester</h1>
        <p>apakah Cookies ada = {kuki}</p>
        <button onClick={handleAddKuki}>set cookies</button>
        <button onClick={handleDeleteKuki}>hapus cookies</button>

        <br />
        <br />
        <button onClick={loginUser}>login user</button>
        <button onClick={loginPerusahaan}>login perusahaan</button>
        <button>login admin</button>
        <br />
        <button onClick={LogOut}>Log Out</button>
        <br />
        <button onClick={cekUser}>Cek user</button>
      </div>
    </>
  );
}
