import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { lowongan } from "../data/Data";
import usePagination from "../components/Pagination";
import moment from "moment";

export default function Lowonganlist() {
  const nav = useNavigate();

  const { currentItems, totalPages, nextPage, prevPage, page, currentPage } =
    usePagination(lowongan, 8);
  return (
    <>
      <div className="container">
        <Header />
        <h4>Daftar Lowongan</h4>
        <br />
        <div className="t-b-lowongan-wrap">
          {currentItems.map((e) => (
            <div
              onClick={() => nav(`/lowongan/${e.id}`)}
              className="lowongan-card"
              key={e.id}
            >
              <div className="l-c-wrap">
                <div className="l-c-tanggal">
                  <p>{moment(e.tanggal, "YYYYMMDD").fromNow()}</p>
                </div>
                <div className="l-c-title">
                  <span>
                    <p>{e.perusahaan.nama}</p>
                    <h5>{e.nama}</h5>
                  </span>
                  <img
                    src={e.perusahaan.profil}
                    alt="gambar profil perusahaan"
                  />
                </div>
                <div className="l-c-skill">
                  {e.skill.slice(0, 5).map((skill, index) => (
                    <p key={index}>{skill}</p>
                  ))}
                </div>
              </div>
              <div className="l-c-action">
                <span>
                  <h6>
                    Rp{" "}
                    {e.gajiMin / 1000000 >= 1
                      ? `${e.gajiMin / 1000000}Jt`
                      : `${e.gajiMin / 1000}Rb`}
                    -
                    {e.gajiMax / 1000000 >= 1
                      ? `${e.gajiMax / 1000000}Jt`
                      : `${e.gajiMax / 1000}Rb`}
                  </h6>
                  <p>{e.perusahaan.provinsi}</p>
                </span>
                <button className="button-main">Edit</button>
              </div>
            </div>
          ))}
        </div>
        <br />
        {/* pagination */}
        <div className="pagination">
          <div onClick={prevPage} className="p-arrow">
            <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
          </div>
          {totalPages > 3 ? currentPage == totalPages ? <Titik /> : null : null}
          {Array.from({ length: 3 }, (_, i) => {
            const pageNum = currentPage - 1 + i; // Menampilkan halaman saat ini dan 2 di sekitarnya
            return (
              pageNum >= 1 &&
              pageNum <= totalPages && ( // Pastikan dalam batas halaman
                <div
                  key={pageNum}
                  className={`p-item ${
                    currentPage === pageNum ? "pagig-on" : ""
                  }`}
                >
                  <p onClick={() => page(pageNum)}>{pageNum}</p>
                </div>
              )
            );
          })}
          {totalPages > 3 ? currentPage == 1 ? <Titik /> : null : null}
          <div onClick={nextPage} className="p-arrow">
            <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
}
