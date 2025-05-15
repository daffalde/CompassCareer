import moment from "moment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { lowongan } from "../data/Data";
import "../styles/lowongandetail.css";
import "../styles/template.css";
import { useNavigate } from "react-router-dom";

export default function Kerjadetail() {
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  const data = lowongan.filter((e) => e.id === Number(urlId));
  const nav = useNavigate();

  console.log(data[0]);
  return (
    <>
      <div className="container">
        <Header />
        {data.map((e) => (
          <div className="template" key={e.id}>
            <div className="template-head">
              <div className="t-h-top">
                <img src={e.perusahaan.profil} alt="logo perusahaan" />
              </div>
              <div className="t-h-bottom">
                <div className="t-h-b-title">
                  <h4>{e.nama}</h4>
                  <p>{e.perusahaan.nama}</p>
                </div>
                <div className="t-h-b-desc">
                  <span>
                    <p>
                      {e.perusahaan.lokasi},{e.perusahaan.provinsi}
                    </p>
                    <img src="/dot1.svg" alt="dot gap" />
                    <p>{moment(e.tanggal, "YYYYMMDD").fromNow()}</p>
                  </span>
                  <span>
                    <button className="button-second">Simpan</button>
                    <button className="button-main">Lamar</button>
                  </span>
                </div>
              </div>
            </div>
            <div className="template-foot">
              <div className="t-f-left">
                <div className="t-f-l-body">
                  <div className="numbering">
                    <h6>Tentang Pekerjaan:</h6>
                    {e.tentang.split("\n").map((e, i) => (
                      <div key={i} className="numbering-item">
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </div>
                    ))}
                  </div>
                  <div className="numbering">
                    <h6>Persyaratan:</h6>
                    {e.syarat.split("\n").map((e, i) => (
                      <div key={i} className="numbering-item">
                        <p>{i + 1}.</p>
                        <p>{e}</p>
                      </div>
                    ))}
                  </div>
                  <div className="skill">
                    <h6>Keahlian:</h6>
                    <div className="s-wrap">
                      {e.skill.map((e, i) => (
                        <div className="s-item" key={i}>
                          <p>{e}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="t-f-l-body">
                  <div className="t-f-l-b-wrap">
                    <div className="body-left">
                      <h5>Tentang perusahaan</h5>
                      <p>{e.perusahaan.tentang}</p>
                    </div>
                    <div className="body-right">
                      <img
                        src={e.perusahaan.profil}
                        alt="gambar profil perusahaan"
                      />
                      <h6>{e.perusahaan.nama}</h6>
                      <p>{e.perusahaan.bidang}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-f-right">
                <div className="t-f-l-body">
                  <div className="body-gaji">
                    <span>
                      <p>Gaji rata-rata</p>
                      <h4>
                        Rp {Number(e.gajiMin).toLocaleString("id")}-
                        {Number(e.gajiMax).toLocaleString("id")}
                      </h4>
                    </span>
                    <span>
                      <div className="b-g-detail">
                        <img src="/kategori.svg" alt="logo kategori" />
                        <span>
                          <h6>{e.kategori}</h6>
                          <p>Kategori</p>
                        </span>
                      </div>
                      <div className="b-g-detail">
                        <img src="/jenis.svg" alt="logo kategori" />
                        <span>
                          <h6>{e.jenis}</h6>
                          <p>Jenis Pekerjaan</p>
                        </span>
                      </div>
                      <div className="b-g-detail">
                        <img src="/tingkatan.svg" alt="logo kategori" />
                        <span>
                          <h6>{e.tingkat}</h6>
                          <p>Tingkatan</p>
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
                <div className="t-f-l-body">
                  <div className="lowongan-lain-wrap">
                    <h6>Lowongan lain</h6>
                    {lowongan
                      .slice(0, 7)
                      .filter(
                        (job) => job.kategori === e.kategori && job.id != e.id
                      )
                      .map((list) => (
                        <div
                          className="lowongan-lain"
                          onClick={() => nav(`/lowongan/${list.id}`)}
                          key={list.id}
                        >
                          <h6>{list.nama}</h6>
                          <span>
                            <img
                              src={list.perusahaan.profil}
                              alt="profil perusahaan"
                            />
                            <p>{list.perusahaan.nama}</p>
                            <img src="/dot1.svg" alt="dot" />
                            <p>{list.perusahaan.provinsi}</p>
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
