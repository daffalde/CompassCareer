import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/daftarpelamar.css";
import axios from "axios";
import { LoadingPage } from "../components/Loading";
import { Link } from "react-router-dom";
import { StatusApp } from "../components/StatusApp";

export default function DaftarPelamar() {
  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  async function getData() {
    try {
      const getDataApplication = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/application?select=*,lowongan(*,data_perusahaan(*)),cv(*),data_pelamar(*,pelamar(nama,email))",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(getDataApplication.data);
      setData(getDataApplication.data);
      setUser(JSON.parse(sessionStorage.getItem("data")));
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="container">
        <Header />
        {loadingPage ? (
          <LoadingPage />
        ) : (
          <>
            <div className="daftar-wrap">
              {data
                .filter(
                  (filter) =>
                    filter.lowongan.data_perusahaan.id_perusahaan ===
                    user.id_perusahaan
                )
                .map((e) => (
                  <div key={e.id_application} className="daftar-w-content">
                    <div className="daftar-w-c-pelamar">
                      <img
                        src={
                          e.data_pelamar.picture
                            ? e.data_pelamar.picture
                            : "profil-pelamar.svg"
                        }
                        alt="gambar profil pelamar"
                      />
                      <span>
                        <h6>{e.data_pelamar.pelamar.nama}</h6>
                        <p>{e.data_pelamar.pelamar.email}</p>
                      </span>
                    </div>
                    <div className="daftar-w-c-lowongan">
                      <p>{e.lowongan.posisi}</p>
                    </div>
                    <div className="daftar-w-c-cv">
                      <img src="/pdf.svg" alt="pdf icon" />
                      <Link
                        onClick={(event) => event.stopPropagation()}
                        to={e.cv.link}
                      >
                        {e.cv.nama}
                      </Link>
                    </div>
                    <div className="daftar-w-c-status">
                      <StatusApp variable={e.status} />
                    </div>
                    <div className="daftar-w-c-action">
                      <img
                        height={"25px"}
                        src="/right.png"
                        alt="arrow right icon"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
