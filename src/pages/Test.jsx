import { useEffect, useState } from "react";
import Header from "../components/Header";
import Cookies from "js-cookie";

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

  sessionStorage.setItem("nilai", "ini-token");
  return (
    <>
      <div className="container">
        <Header />
        <h1>ini halaman tester</h1>
        <p>apakah Cookies ada = {kuki}</p>
        <button onClick={handleAddKuki}>set cookies</button>
        <button onClick={handleDeleteKuki}>hapus cookies</button>
      </div>
    </>
  );
}
