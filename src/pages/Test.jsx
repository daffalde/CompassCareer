import { useEffect, useState } from "react";
import Header from "../components/Header";
import Cookies from "js-cookie";
import { perusahaan, user } from "../data/Data";
import { supabase } from "../data/supabaseClient";

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
    window.location.reload();
  }

  function loginPerusahaan() {
    const data = perusahaan[0];
    localStorage.setItem("auth", JSON.stringify(data));
    Cookies.set("token", "abcdefghijklmn");
    handleCookie();
    window.location.reload();
  }

  //   test pdf
  const [fileName, setFileName] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
  }

  const [lebar, setLebar] = useState(0);
  useEffect(() => {
    function handleLebar() {
      setLebar(window.innerWidth);
    }

    window.addEventListener("resize", handleLebar);
    return () => removeEventListener("resize", handleLebar);
  });

  // supabase
  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from("pelamar").select("*");
      console.log(data);
    }
    getData();
  }, []);
  return (
    <>
      <div className="container">
        <Header />
        <p>{lebar}</p>
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
        <br />
        <br />
        <br />
        <br />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
