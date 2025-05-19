import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";
import { perusahaan } from "../data/Data";
import "../styles/template.css";
import "../styles/perusahaandetail.css";
import Footer from "../components/Footer";

export default function Perusahaandetail() {
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  const nav = useNavigate();
  const data = perusahaan.filter((e) => e.id === Number(urlId));

  useEffect(() => {
    function StayUp() {
      window.scrollTo({ top: 0 });
    }
    StayUp();
  }, []);

  console.log(data[0]);

  return (
    <>
      <div className="container">
        <Header />
        {data.map((e) => (
          <div className="template" key={e.id}>
            <div className="template-head">
              <div className="t-h-top">
                <img src={e.profil} alt="logo perusahaan" />
              </div>
              <div className="t-h-bottom">
                <div className="t-h-b-title">
                  <h4>{e.nama}</h4>
                  <p>{e.bidang}</p>
                </div>
                <div className="t-h-b-desc">
                  <span>
                    <p>
                      {e.lokasi},{e.provinsi}
                    </p>
                    <img src="/dot1.svg" alt="dot gap" />
                    <p>{e.karyawan} Karyawan</p>
                  </span>
                  <span>
                    <button className="button-second">Simpan</button>
                  </span>
                </div>
              </div>
            </div>
            <div className="template-foot">
              <div className="t-f-left">
                <div className="t-f-l-body">
                  <div className="info-perusahaan">
                    <h6>Informasi Perusahaan</h6>
                    <span>
                      <p>Situs Web</p>
                      <p>{e.situs}</p>
                    </span>
                    <span>
                      <p>Email</p>
                      <p>{e.email}</p>
                    </span>
                    <span>
                      <p>Tahun didirikan</p>
                      <p>{e.didirikan}</p>
                    </span>
                    <span>
                      <p>Industri</p>
                      <p>{e.bidang}</p>
                    </span>
                  </div>
                </div>
                <div className="t-f-l-body">
                  <div className="paragraph">
                    <h6>Tentang Kami</h6>
                    <p>{e.tentang}</p>
                  </div>
                  <div className="numbering">
                    <h6>Visi:</h6>
                    {e.visi.split("\n").map((e, i) => (
                      <div key={i} className="numbering-item">
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </div>
                    ))}
                  </div>
                  <div className="numbering">
                    <h6>Misi:</h6>
                    {e.misi.split("\n").map((e, i) => (
                      <div key={i} className="numbering-item">
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="t-f-right">
                <div className="t-f-l-body">
                  <div className="lowongan-lain-wrap">
                    <h6>Lowongan lain </h6>
                    {e.lowongan.slice(0, 7).map((list) => (
                      <div className="lowongan-lain" key={list.id}>
                        <h6>{list.nama}</h6>
                        <span>
                          <img src={e.profil} alt="profil perusahaan" />
                          <p>{e.nama}</p>
                          <img src="/dot1.svg" alt="dot" />
                          <p>{e.provinsi}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
