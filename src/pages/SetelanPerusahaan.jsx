import { useNavigate } from "react-router-dom";
import "../styles/setelan.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TabBarGuest,
  TabBarPelamar,
  TabBarPerusahaan,
} from "../components/TabBar";
import { DataLogin } from "../data/DataLogin";

export default function SetelanPerusahaan() {
  const nav = useNavigate();
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const user = DataLogin();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  async function getData() {
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/auth/perusahaan/${userId?.id_perusahaan}`
      );
      setData(resp.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!token || userId?.role !== "perusahaan") {
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
                ? "/profil-perusahaan.svg"
                : data[0].picture
                ? data[0].picture
                : "/profil-perusahaan.svg"
            }
            alt="profil perusahaan"
          />
          <span>
            <h3>{loading ? "loading..." : data[0].nama_perusahaan}</h3>
            <p>{loading ? "loading..." : data[0].email}</p>
          </span>
        </div>
        <div className="setelan-general">
          <p>General</p>
          <div className="s-g-wrap">
            <div onClick={() => nav("/profil-perusahaan")} className="s-g-item">
              <img src="/mobile/setelan-profil.png" alt="icon" />
              <p>Lihat Profil</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/lowongan-post")} className="s-g-item">
              <img src="/mobile/setelan-daftar.png" alt="icon" />
              <p>Daftar Lowongan</p>
              <img src="/mobile/setelan-arrow.png" alt="arrow icon" />
            </div>
            <div onClick={() => nav("/pelamar")} className="s-g-item">
              <img src="/mobile/setelan-manajemen.png" alt="icon" />
              <p>Manajemen Pelamar</p>
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
      {user.token ? (
        user.data.role === "pelamar" ? (
          <TabBarPelamar />
        ) : (
          <TabBarPerusahaan />
        )
      ) : (
        <TabBarGuest />
      )}
    </>
  );
}
