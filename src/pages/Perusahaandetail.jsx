import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { perusahaan } from "../data/Data";
import "../styles/template.css";
import "../styles/perusahaandetail.css";
import Footer from "../components/Footer";
import { supabase } from "../data/supabaseClient";
import { LoadingPage } from "../components/Loading";

export default function Perusahaandetail() {
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function StayUp() {
      window.scrollTo({ top: 0 });
    }
    StayUp();
  }, []);

  // data dummy_______________________________________________________
  async function getPerusahaan() {
    try {
      const dataPerusahaan = await supabase
        .from("perusahaan")
        .select("*,data_perusahaan(*,lowongan(*))")
        .eq("id_perusahaan", Number(urlId));
      setData(dataPerusahaan.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getPerusahaan();
  }, []);

  const user = JSON.parse(sessionStorage.getItem("data"));
  // logic simpan_______________________________________________
  const [simpanButton, setSimpanButton] = useState(true);
  const [idTersimpan, setIdTersimpan] = useState(null);
  async function cekSimpan() {
    const ceking = await supabase
      .from("perusahaan_tersimpan")
      .select("*")
      .eq("id_pelamar", user.id_pelamar);
    const dataCek = ceking.data.filter((e) => e.id_pelamar === Number(urlId));
    if (dataCek[0]) {
      setIdTersimpan(dataCek[0].id_perusahaan_tersimpan);
      setSimpanButton(false);
    }
  }

  useEffect(() => {
    cekSimpan();
  }, []);
  // tombol simpan
  async function simpanLowongan(e) {
    await supabase.from("perusahaan_tersimpan").insert({
      id_pelamar: user.id_pelamar,
      id_perusahaan: e,
    });
    window.location.reload();
  }

  //tombol hapus simpan
  async function hapusSimpanLowongan() {
    try {
      await supabase
        .from("perusahaan_tersimpan")
        .delete()
        .eq("id_perusahaan_tersimpan", idTersimpan);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div className="container">
        <Header />
        {loading ? (
          <LoadingPage />
        ) : (
          data.map((e) => (
            <div className="template" key={e.id_perusahaan}>
              <div className="template-head">
                <div className="t-h-top">
                  <img
                    src={
                      e.data_perusahaan.picture
                        ? e.data_perusahaan.picture
                        : "/profil-perusahaan.svg"
                    }
                    alt="logo perusahaan"
                  />
                </div>
                <div className="t-h-bottom">
                  <div className="t-h-b-title">
                    <h4>{e.nama}</h4>
                    <p>{e.data_perusahaan.bidang}</p>
                  </div>
                  <div className="t-h-b-desc">
                    <span>
                      <p>
                        {e.data_perusahaan.lokasi},{e.data_perusahaan.provinsi}
                      </p>
                      <img src="/dot1.svg" alt="dot gap" />
                      <p>{e.data_perusahaan.karyawan} Karyawan</p>
                    </span>
                    <span>
                      {simpanButton ? (
                        <button
                          onClick={() => simpanLowongan(e.id_perusahaan)}
                          className="button-second"
                        >
                          Simpan
                        </button>
                      ) : (
                        <button
                          onClick={() => hapusSimpanLowongan(e.id_perusahaan)}
                          className="button-second"
                        >
                          Disimpan
                        </button>
                      )}
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
                        <p>{e.data_perusahaan.situs}</p>
                      </span>
                      <span>
                        <p>Email</p>
                        <p>{e.email}</p>
                      </span>
                      <span>
                        <p>Tahun didirikan</p>
                        <p>{e.data_perusahaan.didirikan}</p>
                      </span>
                      <span>
                        <p>Industri</p>
                        <p>{e.data_perusahaan.bidang}</p>
                      </span>
                    </div>
                  </div>
                  <div className="t-f-l-body">
                    <div className="paragraph">
                      <h6>Tentang Kami</h6>
                      <p>{e.data_perusahaan.tentang}</p>
                    </div>
                    <div className="numbering">
                      <h6>Visi:</h6>
                      {e.data_perusahaan.visi.split("\n").map((e, i) => (
                        <div key={i} className="numbering-item">
                          <p>{i + 1}.</p>
                          <p>{e}</p>
                        </div>
                      ))}
                    </div>
                    <div className="numbering">
                      <h6>Misi:</h6>
                      {e.data_perusahaan.misi.split("\n").map((e, i) => (
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
                      {e.data_perusahaan.lowongan
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 7)
                        .map((list) => (
                          <div
                            onClick={() => nav(`/lowongan/${list.id_lowongan}`)}
                            className="lowongan-lain"
                            key={list.id_lowongan}
                          >
                            <h6>{list.posisi}</h6>
                            <span>
                              <img
                                src={
                                  e.data_perusahaan.picture
                                    ? e.data_perusahaan.picture
                                    : "/profil-perusahaan.svg"
                                }
                                alt="profil perusahaan"
                              />
                              <p>{e.data_perusahaan.nama}</p>
                              <img src="/dot1.svg" alt="dot" />
                              <p>{e.data_perusahaan.provinsi}</p>
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
