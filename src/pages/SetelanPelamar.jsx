import { useNavigate } from "react-router-dom";
import { TabBarPelamar } from "../components/TabBar";
import "../styles/setelan.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SetelanPelamar() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  async function getData() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/pelamar/${userId?.id_pelamar}`
      );
      setData(resp.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!token || userId?.role !== "pelamar") {
      nav("/");
    }
    getData();
  }, []);

  function handleSignout() {
    Cookies.remove("token");
    Cookies.remove("data");
    window.location.reload();
  }
  return (
    <>
      <div className="setelan-container">
        <div className="setelan-head">
          <img
            width={"60px"}
            height={"60px"}
            src={
              loading
                ? "/profil-pelamar.svg"
                : data[0].profil
                ? data[0].profil
                : "/profil-pelamar.svg"
            }
            alt="profil pelamar"
          />
          <span>
            <h3>{loading ? "loading..." : data[0].nama_pelamar}</h3>
            <p>{loading ? "loading..." : data[0].email}</p>
          </span>
        </div>
        <div className="setelan-general">
          <p>General</p>
          <div className="s-g-wrap">
            <div onClick={() => nav("/profil")} className="s-g-item">
              <img src="/mobile/setelan-profil.png" alt="icon" />
              <p>Lihat Profil</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/tersimpan")} className="s-g-item">
              <img src="/mobile/setelan-simpan.png" alt="icon" />
              <p>Tersimpan</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/status-lamaran")} className="s-g-item">
              <img src="/mobile/setelan-status.png" alt="icon" />
              <p>Status Lamaran</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
          </div>
        </div>
        <div className="setelan-general">
          <p>Informasi</p>
          <div className="s-g-wrap">
            <div onClick={() => nav("/tentang")} className="s-g-item">
              <img src="/mobile/setelan-tentang.png" alt="icon" />
              <p>Tentang Kami</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/kebijakan-privasi")} className="s-g-item">
              <img src="/mobile/setelan-privasi.png" alt="icon" />
              <p>Kebijakan Privasi</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/syarat")} className="s-g-item">
              <img src="/mobile/setelan-syarat.png" alt="icon" />
              <p>Syarat & Ketentuan</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={handleSignout} className="s-g-item">
              <img src="/mobile/setelan-logout.png" alt="icon" />
              <p style={{ color: "#FF5757" }}>Sign Out</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", width: "100%", color: "#21273080" }}>
          © 2025 · CompassCareer
        </p>
      </div>
      <TabBarPelamar />
    </>
  );
}
