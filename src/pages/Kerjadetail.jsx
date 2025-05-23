import moment from "moment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { lowongan } from "../data/Data";
import "../styles/lowongandetail.css";
import "../styles/template.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { LoadingPage } from "../components/Loading";

export default function Kerjadetail() {
  const url = window.location.pathname;
  const urlId = url.split("/").pop();
  const user = JSON.parse(sessionStorage.getItem("data"));

  const [dataLowongan, setDataLowongan] = useState(null);
  const [otherLowongan, setOtherLowongan] = useState(null);
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  // data dummy_____________________________________________________
  async function getLowongan() {
    try {
      const lowonganData = await supabase
        .from("lowongan")
        .select("*,data_perusahaan(*)")
        .eq("id_lowongan", Number(urlId)); // filtering data dari uid disini

      const another = await supabase
        .from("lowongan")
        .select("*,data_perusahaan(*)");
      setOtherLowongan(another.data);
      setDataLowongan(lowonganData.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  }
  useEffect(() => {
    function StayUp() {
      window.scrollTo({ top: 0 });
    }
    StayUp();
    getLowongan();
  }, []);

  // logic simpan_______________________________________________
  const [simpanButton, setSimpanButton] = useState(true);
  const [idTersimpan, setIdTersimpan] = useState(null);
  async function cekSimpan() {
    const ceking = await supabase
      .from("lowongan_tersimpan")
      .select("*")
      .eq("id_pelamar", user.id_pelamar);
    const dataCek = ceking.data.filter((e) => e.id_lowongan === Number(urlId));
    if (dataCek[0]) {
      setIdTersimpan(dataCek[0].id_lowongan_tersimpan);
      setSimpanButton(false);
    }
  }

  useEffect(() => {
    cekSimpan();
  }, []);
  // tombol simpan
  async function simpanLowongan(e) {
    await supabase.from("lowongan_tersimpan").insert({
      id_pelamar: user.id_pelamar,
      id_lowongan: e,
    });
    window.location.reload();
  }

  //tombol hapus simpan
  async function hapusSimpanLowongan() {
    try {
      await supabase
        .from("lowongan_tersimpan")
        .delete()
        .eq("id_lowongan_tersimpan", idTersimpan);
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
          <>
            {dataLowongan.map((e) => (
              <div className="template" key={e.id_lowongan}>
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
                      <h4>{e.posisi}</h4>
                      <p>{e.data_perusahaan.nama}</p>
                    </div>
                    <div className="t-h-b-desc">
                      <span>
                        <p>
                          {e.data_perusahaan.lokasi},
                          {e.data_perusahaan.provinsi}
                        </p>
                        <img src="/dot1.svg" alt="dot gap" />
                        <p>
                          {moment(
                            e.created_at.split("T")[0],
                            "YYYYMMDD"
                          ).fromNow()}
                        </p>
                      </span>
                      <span>
                        {simpanButton ? (
                          <button
                            onClick={() => simpanLowongan(e.id_lowongan)}
                            className="button-second"
                          >
                            Simpan
                          </button>
                        ) : (
                          <button
                            onClick={() => hapusSimpanLowongan(e.id_lowongan)}
                            className="button-second"
                          >
                            Disimpan
                          </button>
                        )}
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
                          {JSON.parse(e.skill).map((e, i) => (
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
                          <p>{e.data_perusahaan.tentang}</p>
                        </div>
                        <div className="body-right">
                          <img
                            src={
                              e.data_perusahaan.picture
                                ? e.data_perusahaan.picture
                                : "/profil-perusahaan.svg"
                            }
                            alt="gambar profil perusahaan"
                          />
                          <h6>{e.data_perusahaan.nama}</h6>
                          <p>{e.data_perusahaan.bidang}</p>
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
                            Rp {Number(e.gaji_min).toLocaleString("id")}-
                            {Number(e.gaji_max).toLocaleString("id")}
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
                              <h6>{e.tingkatan}</h6>
                              <p>Tingkatan</p>
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="t-f-l-body">
                      <div className="lowongan-lain-wrap">
                        <h6>Lowongan lain</h6>
                        {otherLowongan
                          .sort(() => Math.random() - 0.5)
                          .slice(0, 7)
                          .filter(
                            (job) =>
                              job.kategori === e.kategori &&
                              job.id_lowongan != e.id_lowongan
                          )
                          .map((list) => (
                            <div
                              className="lowongan-lain"
                              onClick={() => {
                                window.scrollTo({ top: 0 });
                                nav(`/lowongan/${list.id_lowongan}`);
                              }}
                              key={list.id_lowongan}
                            >
                              <h6>{list.posisi}</h6>
                              <span>
                                <img
                                  src={
                                    list.data_perusahaan.picture
                                      ? list.data_perusahaan.picture
                                      : "/profil-perusahaan.svg"
                                  }
                                  alt="profil perusahaan"
                                />
                                <p>{list.data_perusahaan.nama}</p>
                                <img src="/dot1.svg" alt="dot" />
                                <p>{list.data_perusahaan.provinsi}</p>
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
