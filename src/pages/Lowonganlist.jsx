import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { lowongan } from "../data/Data";
import usePagination from "../components/Pagination";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingPage } from "../components/Loading";

export default function Lowonganlist() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  async function getData() {
    try {
      const dataUser = JSON.parse(sessionStorage.getItem("data"));
      const dataLowongan = await axios.get(
        `https://cgwjkypgcahdksethmmh.supabase.co/rest/v1/lowongan?select=*,data_perusahaan(*)`,
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2preXBnY2FoZGtzZXRobW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODYyMDUsImV4cCI6MjA2MzQ2MjIwNX0.r4hIKHMQOyVLWBGDqrrc7hxJL6pZ8M7Uxuf7qjjoKzI",
          },
        }
      );
      console.log(dataLowongan.data);
      setUser(dataUser);
      setData(dataLowongan.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  // pagination
  const itemsPerPage = 10;
  const dataItem = Array.from(
    { length: data ? data.length : null },
    (_, i) => `Item ${i + 1}`
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dataItem.length / itemsPerPage);

  const visibleItems = data
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : null;
  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <h3 className="heading-page">Daftar Lowongan</h3>
            <br />
            <div className="t-b-lowongan-wrap">
              {visibleItems.map((e) => (
                <div
                  onClick={() => nav(`/lowongan/${e.id_lowongan}`)}
                  className="lowongan-card"
                  key={e.id_lowongan}
                >
                  <div className="l-c-wrap">
                    <div className="l-c-tanggal">
                      <p>{moment(e.created_at, "YYYYMMDD").fromNow()}</p>
                    </div>
                    <div className="l-c-title">
                      <span>
                        <p>{e.data_perusahaan.nama}</p>
                        <h5>{e.posisi}</h5>
                      </span>
                      <img
                        src={
                          e.data_perusahaan.picture
                            ? e.data_perusahaan.picture
                            : "/profil-perusahaan.svg"
                        }
                        alt="gambar profil perusahaan"
                      />
                    </div>
                    <div className="l-c-skill">
                      {e.skill
                        ? JSON.parse(e.skill)
                            .slice(0, 5)
                            .map((skill, index) => <p key={index}>{skill}</p>)
                        : null}
                    </div>
                  </div>
                  <div className="l-c-action">
                    <span>
                      <h6>
                        Rp{" "}
                        {e.gaji_min / 1000000 >= 1
                          ? `${e.gaji_min / 1000000}Jt`
                          : `${e.gaji_min / 1000}Rb`}
                        -
                        {e.gaji_max / 1000000 >= 1
                          ? `${e.gaji_max / 1000000}Jt`
                          : `${e.gaji_max / 1000}Rb`}
                      </h6>
                      <p>{e.data_perusahaan.provinsi}</p>
                    </span>
                    <button className="button-main">Edit</button>
                  </div>
                </div>
              ))}
            </div>
            <br />
            {/* pagination */}
            <div className="pagination">
              <div
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-arrow"
              >
                <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
              </div>
              {Array.from({ length: totalPages }, (_, i) => (
                <div
                  key={i}
                  className={`p-item ${
                    currentPage === i + 1 ? "pagig-on" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <p>{i + 1}</p>
                </div>
              ))}
              <div
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-arrow"
              >
                <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
              </div>
            </div>
          </>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
}
