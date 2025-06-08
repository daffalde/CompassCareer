import { useEffect, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import "../styles/dashboard.css";
import { LoadingPage } from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { data } from "react-router-dom";

export default function Admin() {
  const token = Cookies.get("token");
  const userId = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pelamar, setPelamar] = useState(null);
  const [perusahaan, setPerusahaan] = useState(null);
  const [lowongan, setLowongan] = useState(null);
  const [app, setApp] = useState(null);

  async function getData() {
    try {
      const respPelamar = await axios.get(
        "https://careercompass-backend.vercel.app/auth/pelamar"
      );
      const respPerusahaan = await axios.get(
        "https://careercompass-backend.vercel.app/auth/perusahaan"
      );
      const respLowongan = await axios.get(
        "https://careercompass-backend.vercel.app/data/lowongan"
      );
      const respApp = await axios.get(
        "https://careercompass-backend.vercel.app/data/app",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPelamar(respPelamar.data);
      setPerusahaan(respPerusahaan.data);
      setLowongan(respLowongan.data);
      setApp(respApp.data);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const tanggal = new Date().getDate();
  const headPelamarLabel = [];
  for (let i = tanggal; i > tanggal - 5; i--) {
    headPelamarLabel.push(i);
  }

  const headPelamar = {
    labels: headPelamarLabel.reverse(),
    datasets: [
      {
        data: [
          pelamar?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 4
          ).length || 0,
          pelamar?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 3
          ).length || 0,
          pelamar?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 2
          ).length || 0,
          pelamar?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 1
          ).length || 0,
          pelamar?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate()
          ).length || 0,
        ],
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const headPerusahaan = {
    labels: headPelamarLabel.reverse(),
    datasets: [
      {
        data: [
          perusahaan?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 4
          ).length || 0,
          perusahaan?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 3
          ).length || 0,
          perusahaan?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 2
          ).length || 0,
          perusahaan?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate() - 1
          ).length || 0,
          perusahaan?.filter(
            (e) =>
              parseInt(e.created_at.split("-")[2].split("T")[0], 10) ===
              new Date().getDate()
          ).length || 0,
        ],
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const headLowongan = {
    labels: headPelamarLabel.reverse(),
    datasets: [
      {
        data: [
          lowongan?.filter(
            (e) =>
              parseInt(
                e.lowongan_created_at.split("-")[2].split("T")[0],
                10
              ) ===
              new Date().getDate() - 4
          ).length || 0,
          lowongan?.filter(
            (e) =>
              parseInt(
                e.lowongan_created_at.split("-")[2].split("T")[0],
                10
              ) ===
              new Date().getDate() - 3
          ).length || 0,
          lowongan?.filter(
            (e) =>
              parseInt(
                e.lowongan_created_at.split("-")[2].split("T")[0],
                10
              ) ===
              new Date().getDate() - 2
          ).length || 0,
          lowongan?.filter(
            (e) =>
              parseInt(
                e.lowongan_created_at.split("-")[2].split("T")[0],
                10
              ) ===
              new Date().getDate() - 1
          ).length || 0,
          lowongan?.filter(
            (e) =>
              parseInt(
                e.lowongan_created_at.split("-")[2].split("T")[0],
                10
              ) === new Date().getDate()
          ).length || 0,
        ],
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Menghilangkan label legend
      },
    },
    scales: {
      x: {
        display: false, // Menghilangkan sumbu X sepenuhnya
      },
      y: {
        display: false, // Menghilangkan sumbu Y sepenuhnya
      },
    },
  };

  const getRatio = (valueA, valueB) => {
    if (valueB === 0) return "N/A"; // Menghindari pembagian oleh nol

    // Mencari FPB (Faktor Persekutuan Terbesar) untuk menyederhanakan rasio
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

    const divisor = gcd(valueA, valueB);

    return `${valueA / divisor}:${valueB / divisor}`;
  };

  // data cart____________________________________________________________
  const [tipeBulanan, setTipeBulanan] = useState("pelamar");
  const [valueBulanan, setValueBulanan] = useState(pelamar);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (tipeBulanan === "pelamar") {
      setValueBulanan(pelamar);
    } else if (tipeBulanan === "perusahaan") {
      setValueBulanan(perusahaan);
    }
  }, [tipeBulanan]);

  const countByMonth = (data, month, year) => {
    return (
      data?.filter(
        (e) =>
          e.created_at.split("-")[1] === month &&
          e.created_at.split("-")[0] === year
      ).length || 0
    );
  };

  const bodyCart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: Array.from({ length: 12 }, (_, i) => {
          const month = String(i + 1).padStart(2, "0"); // Format bulan menjadi "01", "02", dst.
          return countByMonth(valueBulanan || pelamar, month, tahun);
        }),
        borderRadius: 5,
        backgroundColor: "#005df4",
        hoverBackgroundColor: "#1e96ff",
      },
    ],
  };

  const options2 = {
    plugins: {
      legend: {
        display: false, // Menghilangkan label legend
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false, // Menghilangkan garis sumbu Y
        },
        ticks: {
          display: true, // Tetap menampilkan angka indikator
        },
      },
    },
  };

  // pie cart
  const bodyPie1 = {
    labels: ["Diterima", "Ditolak", "Ditinjau"],
    datasets: [
      {
        data: [
          app?.filter((e) => e.status === "Diterima").length,
          app?.filter((e) => e.status === "Ditolak").length,
          app?.filter((e) => e.status === "Ditinjau").length,
        ],
        backgroundColor: ["#0e295d", "#005df4", "#48b9ff"],
        borderRadius: 7,
      },
    ],
  };

  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        {/* _________________________________________________________ */}

        <div className="dashboard-content">
          <HeaderDashboard content={"Dashboard"} />
          {loadingPage ? (
            <LoadingPage />
          ) : (
            <div className="dashboard-home">
              <p>{new Date().toString()}</p>
              <div className="d-h-head">
                <div className="d-h-h-item">
                  <h6>Jumlah Pelamar</h6>
                  <span>
                    <h1>{pelamar.length}</h1>
                    <div className="d-h-h-i-cart">
                      <Line data={headPelamar} options={options} />
                      <p>
                        +
                        {
                          pelamar.filter(
                            (e) =>
                              parseInt(
                                e.created_at.split("-")[2].split("T")[0],
                                10
                              ) === new Date().getDate()
                          ).length
                        }{" "}
                        Today
                      </p>
                    </div>
                  </span>
                </div>
                <div className="d-h-h-item">
                  <h6>Jumlah Perusahaan</h6>
                  <span>
                    <h1>{perusahaan.length}</h1>
                    <div className="d-h-h-i-cart">
                      <Line data={headPerusahaan} options={options} />
                      <p>
                        +
                        {
                          perusahaan.filter(
                            (e) =>
                              parseInt(
                                e.created_at.split("-")[2].split("T")[0],
                                10
                              ) === new Date().getDate()
                          ).length
                        }{" "}
                        Today
                      </p>
                    </div>
                  </span>
                </div>
                <div className="d-h-h-item">
                  <h6>Jumlah Lowongan</h6>
                  <span>
                    <h1>{lowongan.length}</h1>
                    <div className="d-h-h-i-cart">
                      <Line data={headLowongan} options={options} />
                      <p>
                        +
                        {
                          lowongan.filter(
                            (e) =>
                              parseInt(
                                e.lowongan_created_at
                                  .split("-")[2]
                                  .split("T")[0],
                                10
                              ) === new Date().getDate()
                          ).length
                        }{" "}
                        Today
                      </p>
                    </div>
                  </span>
                </div>
                <div className="d-h-h-item">
                  <h6>Pelamar : Lowongan</h6>
                  <span>
                    <h1>{getRatio(pelamar.length, lowongan.length)}</h1>
                  </span>
                </div>
              </div>
              <div className="d-h-body">
                <div className="d-h-b-cart">
                  <div className="d-h-b-c-wrap">
                    <span>
                      <h5>Data bulanan</h5>
                      <select
                        onChange={(e) => setTipeBulanan(e.target.value)}
                        className="cart-bulanan"
                      >
                        <option value="pelamar">Pelamar</option>
                        <option value="perusahaan">Perusahaan</option>
                      </select>
                    </span>
                    <select
                      onChange={(e) => setTahun(e.target.value)}
                      className="cart-bulanan"
                    >
                      {[
                        ...new Set(
                          pelamar.map((e) => e.created_at.split("-")[0])
                        ),
                      ].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-h-b-c-content">
                    <Bar data={bodyCart} options={options2} />
                  </div>
                </div>
                <div className="d-h-b-pie">
                  <h5>Application</h5>
                  <Doughnut data={bodyPie1} options={options3} />
                  <p style={{ color: "grey", fontSize: "14px" }}>
                    Data rasio status lamaran pelamar
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
