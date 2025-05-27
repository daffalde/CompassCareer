import { useEffect, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import axios from "axios";
import { LoadingPage } from "../components/Loading";

export default function Adminpelamar() {
  const [data, setData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  async function getData() {
    try {
      const takeData = await axios.get(
        "https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/pelamar?select=*,data_pelamar(*,lowongan_tersimpan(*),perusahaan_tersimpan(*))",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(takeData.data);
      setData(takeData.data);
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
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <HeaderDashboard content={"Pelamar"} />
          {loadingPage ? (
            <LoadingPage />
          ) : (
            <div className="dashboard-pelamar">
              <div className="dashboard-pelamar-wrap">
                {data.map((e) => (
                  <div key={e.id_pelamar} className="dashboard-pelamar-w-item">
                    <div className="dashboard-pelamar-w-i-nama">
                      <img
                        src={
                          e.data_pelamar?.picture
                            ? e.data_pelamar.picture
                            : "/profil-pelamar.svg"
                        }
                        alt="profil pelamar"
                      />
                      <h6>{e.nama}</h6>
                    </div>
                    <div className="dashboard-pelamar-w-i-email">
                      <p>{e.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
