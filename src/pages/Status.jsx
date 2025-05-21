import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/status.css";

export default function Status() {
  const [statusButton, setStatusButton] = useState("semua");
  return (
    <>
      <div className="container">
        <Header />
        <h4>Status Lamaran</h4>
        <br />
        <div className="status-head">
          <form className="status-search">
            <img src="/search1.svg" alt="search icon" />
            <input type="text" placeholder="Cari..." />
          </form>
          <div className="status-filter">
            <button
              onClick={() => setStatusButton("semua")}
              className={`s-f-button ${
                statusButton === "semua" ? "s-f-button-on" : ""
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusButton("ditinjau")}
              className={`s-f-button ${
                statusButton === "ditinjau" ? "s-f-button-on" : ""
              }`}
            >
              Ditinjau
            </button>
            <button
              onClick={() => setStatusButton("diterima")}
              className={`s-f-button ${
                statusButton === "diterima" ? "s-f-button-on" : ""
              }`}
            >
              Diterima
            </button>
            <button
              onClick={() => setStatusButton("ditolak")}
              className={`s-f-button ${
                statusButton === "ditolak" ? "s-f-button-on" : ""
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>
        <br />
        <div className="status-body"></div>
      </div>
      <Footer />
    </>
  );
}
