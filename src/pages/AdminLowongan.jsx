import { useEffect, useRef, useState } from "react";
import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import axios from "axios";
import { LoadingButton, LoadingPage } from "../components/Loading";
import { provinsi } from "../data/Provinsi";
import Cookies from "js-cookie";
import { kategori } from "../data/Data";

export default function AdminLowongan() {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("data") ? Cookies.get("data") : null);
  const [data, setData] = useState(null);
  const [perusahaan, setPerusahaan] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  async function getData() {
    try {
      const takeData = await axios.get(
        "https://careercompass-backend.vercel.app/data/all-lowongan"
      );
      const takePerusahaan = await axios.get(
        "https://careercompass-backend.vercel.app/auth/all-perusahaan"
      );
      setData(takeData.data);
      setPerusahaan(takePerusahaan.data.data);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalItem = 12;

  const totalPages = Math.ceil(data ? data.length / totalItem : null);
  const firstIndex = (currentPage - 1) * totalItem;
  const lastIndex = firstIndex + totalItem;
  const dataPagination = data ? data.slice(firstIndex, lastIndex) : null;

  // pop up
  const [popup, setPopup] = useState(false);

  // input
  const inputPosisi = useRef(null);
  const inputGajiMin = useRef(null);
  const inputGajiMax = useRef(null);
  const [inputKategori, setInputKategori] = useState(null);
  const inputJenis = useRef(null);
  const inputTingkatan = useRef(null);
  const inputTentang = useRef(null);
  const inputSyarat = useRef(null);
  const [inputPerusahaan, setInputPerusahaan] = useState(null);

  // skill
  const [inputSkill, setInputSkill] = useState("");
  const [skill, setSkill] = useState([]);

  function handleSkill(e) {
    e.preventDefault();
    setSkill((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }

  function handleSkillDelete(index) {
    setSkill((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  // input data
  async function handleTambah(e) {
    e.preventDefault();
    setLoadingButton(true);

    // Validation: Check if any required fields are empty
    if (
      !inputPosisi.current.value ||
      !inputGajiMin.current.value ||
      !inputGajiMax.current.value ||
      !inputKategori ||
      !inputJenis.current.value ||
      !inputTingkatan.current.value ||
      !inputTentang.current.value ||
      !inputSyarat.current.value ||
      !skill ||
      !inputPerusahaan
    ) {
      alert("Harap isi semua kolom sebelum melanjutkan!");
      setLoadingButton(false);
      return;
    }

    try {
      await axios.post(
        "https://careercompass-backend.vercel.app/data/lowongan",
        {
          posisi: inputPosisi.current.value,
          gajiMin: inputGajiMin.current.value,
          gajiMax: inputGajiMax.current.value,
          kategori: inputKategori,
          jenis: inputJenis.current.value,
          tingkatan: inputTingkatan.current.value,
          tentang: inputTentang.current.value,
          syarat: inputSyarat.current.value,
          skill: JSON.stringify(skill),
          perusahaan: inputPerusahaan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getData();
      setLoadingButton(false);
      setPopup(false);
    } catch (e) {
      console.error("Error while adding job listing:", e);
      setLoadingButton(false);
    }
  }

  // fungsi edit
  const [popupEdit, setPopupEdit] = useState(false);
  const [getId, setGetId] = useState(null);

  async function handleEdit(e) {
    setLoadingButton(true);
    try {
      const resp = await axios.get(
        `https://careercompass-backend.vercel.app/data/lowongan/${e}`
      );

      await axios.patch(
        `https://careercompass-backend.vercel.app/data/lowongan/${e}`,
        {
          posisi: inputPosisi.current.value
            ? inputPosisi.current.value
            : resp.data[0].posisi,
          gajiMin: inputGajiMin.current.value
            ? inputGajiMin.current.value
            : resp.data[0].gaji_min,
          gajiMax: inputGajiMax.current.value
            ? inputGajiMax.current.value
            : resp.data[0].gaji_max,
          kategori: inputKategori ? inputKategori : resp.data[0].kategori,
          jenis: inputJenis.current.value
            ? inputJenis.current.value
            : resp.data[0].jenis,
          tingkatan: inputTingkatan.current.value
            ? inputTingkatan.current.value
            : resp.data[0].tingkatan,
          tentang: inputTentang.current.value
            ? inputTentang.current.value
            : resp.data[0].tentang_lowongan,
          syarat: inputSyarat.current.value
            ? inputSyarat.current.value
            : resp.data[0].syarat,
          skill: JSON.stringify(skill),
          perusahaan: inputPerusahaan
            ? inputPerusahaan
            : resp.data[0].perusahaan_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadingButton(false);
      setPopupEdit(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  }

  // fungsi hapus
  async function handleDelete(e) {
    setLoadingPage(true);
    try {
      await axios.delete(
        `https://careercompass-backend.vercel.app/data/lowongan/${e}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getData();
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
      setLoadingPage(false);
    }
  }

  // filter & sort
  const [filterLokasi, setFilterLokasi] = useState(null);
  const [sortTanggal, setSortTanggal] = useState(false);
  const [pencarian, setPencarian] = useState("");
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <HeaderDashboard
            content={"Lowongan"}
            search={pencarian}
            setSearch={setPencarian}
          />
          {loadingPage ? (
            <LoadingPage />
          ) : (
            <>
              {/* popup_________________________________________________________ */}
              <div
                onClick={() => setPopup(false)}
                className={`popup-wrap ${popup ? "" : "popup-wrap-off"}`}
              >
                <div
                  className={`popup-content ${
                    popup ? "popup-content-off" : ""
                  }`}
                >
                  <div
                    onClick={() => setPopup(false)}
                    className="popup-navigation"
                  >
                    <img src="/left-arrow.png" alt="back icon" />
                    <h5>Tambah lowongan</h5>
                  </div>
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="dashboard-popup"
                  >
                    <div className="dashboard-popup-text">
                      <label htmlFor="dashboard-popup-posisi">Posisi</label>
                      <br />
                      <input
                        ref={inputPosisi}
                        type="text"
                        id="dashboard-popup-posisi"
                        placeholder="e.g. Software Engineer"
                      />
                      <br />

                      <label htmlFor="dashboard-popup-gaji-min">
                        Gaji Minimum
                      </label>
                      <br />
                      <input
                        ref={inputGajiMin}
                        type="number"
                        id="dashboard-popup-gaji-min"
                        placeholder="e.g. 4000000"
                      />
                      <br />

                      <label htmlFor="dashboard-popup-gaji-max">
                        Gaji Maksimum
                      </label>
                      <br />
                      <input
                        ref={inputGajiMax}
                        type="number"
                        id="dashboard-popup-gaji-max"
                        placeholder="e.g. 5000000"
                      />
                      <br />

                      <label htmlFor="dashboard-popup-kategori">Kategori</label>
                      <br />
                      <select
                        onChange={(e) => setInputKategori(e.target.value)}
                        id="dashboard-popup-kategori"
                      >
                        <option value="" selected hidden>
                          Pilih Kategori
                        </option>
                        {kategori.map((e) => (
                          <option key={e.id} value={e.nama}>
                            {e.nama}
                          </option>
                        ))}
                      </select>
                      <br />

                      <label htmlFor="posting-jenis">Jenis</label>
                      <select ref={inputJenis} id="posting-jenis">
                        <option value="" selected hidden>
                          Pilih
                        </option>
                        <option value="full time">Full Time</option>
                        <option value="magang">Magang</option>
                        <option value="paruh waktu">Paruh Waktu</option>
                        <option value="shift work">Shift Work</option>
                      </select>

                      <label htmlFor="posting-tingkat">Tingkatan</label>
                      <select ref={inputTingkatan} id="posting-tingkat">
                        <option value="" selected hidden>
                          Pilih
                        </option>
                        <option value="entry">Entry</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="eksekutif">Eksekutif</option>
                      </select>

                      <label htmlFor="dashboard-popup-tentang">
                        Tentang Pekerjaan
                      </label>
                      <br />
                      <textarea
                        ref={inputTentang}
                        id="dashboard-popup-tentang"
                        placeholder="Deskripsi pekerjaan..."
                      />
                      <br />

                      <label htmlFor="dashboard-popup-syarat">Syarat</label>
                      <br />
                      <textarea
                        ref={inputSyarat}
                        id="dashboard-popup-syarat"
                        placeholder="Persyaratan kerja..."
                      />
                      <br />

                      <label for="posting-keahlian">Keahlian</label>
                      <span>
                        <input
                          value={inputSkill}
                          onChange={(e) => setInputSkill(e.target.value)}
                          id="posting-keahlian"
                          type="text"
                          placeholder="Komputer,Manajemen,dll...."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSkill();
                            }
                          }}
                        />
                        <button onClick={handleSkill} className="button-main">
                          Tambah
                        </button>
                      </span>

                      <br />
                      <div className="p-b-skill-wrap">
                        {skill[0] ? (
                          skill.map((e, i) => (
                            <>
                              <h6 className="s-item" key={i}>
                                {e}
                                <img
                                  onClick={(remove) => {
                                    remove.stopPropagation();
                                    handleSkillDelete(i);
                                  }}
                                  src="/close.svg"
                                  alt="close icon"
                                />
                              </h6>
                            </>
                          ))
                        ) : (
                          <p style={{ color: "grey" }}>
                            Belum ada data keahlian.
                          </p>
                        )}
                      </div>
                      <br />

                      <label htmlFor="dashboard-popup-perusahaan">
                        Perusahaan
                      </label>
                      <select
                        onChange={(e) => setInputPerusahaan(e.target.value)}
                        id="dashboard-popup-perusahaan"
                      >
                        <option value="" selected hidden>
                          Pilih perusahaan
                        </option>
                        {perusahaan.map((e) => (
                          <option key={e.id_perusahaan} value={e.id_perusahaan}>
                            {e.nama_perusahaan}
                          </option>
                        ))}
                      </select>
                      <br />
                      <div className="dashboard-popup-action">
                        <button onClick={handleTambah} className="button-main">
                          Tambah {loadingButton ? <LoadingButton /> : null}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ________________ */}
              <div
                onClick={() => {
                  setPopupEdit(false);
                  setGetId(null);
                  getData();
                }}
                className={`popup-wrap ${
                  popupEdit && getId !== null ? "" : "popup-wrap-off"
                }`}
              >
                <div
                  className={`popup-content ${
                    popupEdit && getId !== null ? "popup-content-off" : ""
                  }`}
                >
                  {data
                    .filter((filter) => filter.id_lowongan === getId)
                    .map((e) => (
                      <>
                        <div
                          onClick={() => setPopupEdit(false)}
                          className="popup-navigation"
                        >
                          <img src="/left-arrow.png" alt="back icon" />
                          <h5>Edit perusahaan</h5>
                        </div>
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="dashboard-popup"
                        >
                          <div className="dashboard-popup-text">
                            <label htmlFor="dashboard-popup-posisi">
                              Posisi
                            </label>
                            <br />
                            <input
                              ref={inputPosisi}
                              type="text"
                              id="dashboard-popup-posisi"
                              placeholder={
                                e.posisi ? e.posisi : "e.g. Software Engineer"
                              }
                            />
                            <br />

                            <label htmlFor="dashboard-popup-gaji-min">
                              Gaji Minimum
                            </label>
                            <br />
                            <input
                              ref={inputGajiMin}
                              type="number"
                              id="dashboard-popup-gaji-min"
                              placeholder={
                                e.gaji_min ? e.gaji_min : "e.g. 4000000"
                              }
                            />
                            <br />

                            <label htmlFor="dashboard-popup-gaji-max">
                              Gaji Maksimum
                            </label>
                            <br />
                            <input
                              ref={inputGajiMax}
                              type="number"
                              id="dashboard-popup-gaji-max"
                              placeholder={
                                e.gaji_max ? e.gaji_max : "e.g. 5000000"
                              }
                            />
                            <br />

                            <label htmlFor="dashboard-popup-kategori">
                              Kategori
                            </label>
                            <br />
                            <select
                              onChange={(e) => setInputKategori(e.target.value)}
                              id="dashboard-popup-kategori"
                            >
                              <option value="" selected hidden>
                                {e.kategori ? e.kategori : "Pilih Kategori"}
                              </option>
                              {kategori.map((e) => (
                                <option key={e.id} value={e.nama}>
                                  {e.nama}
                                </option>
                              ))}
                            </select>
                            <br />

                            <label htmlFor="posting-jenis">Jenis</label>
                            <select ref={inputJenis} id="posting-jenis">
                              <option value="" selected hidden>
                                {e.jenis ? e.jenis : "Pilih"}
                              </option>
                              <option value="full time">Full Time</option>
                              <option value="magang">Magang</option>
                              <option value="paruh waktu">Paruh Waktu</option>
                              <option value="shift work">Shift Work</option>
                            </select>

                            <label htmlFor="posting-tingkat">Tingkatan</label>
                            <select ref={inputTingkatan} id="posting-tingkat">
                              <option value="" selected hidden>
                                {e.tingkatan ? e.tingkatan : "Pilih"}
                              </option>
                              <option value="entry">Entry</option>
                              <option value="mid">Mid</option>
                              <option value="senior">Senior</option>
                              <option value="eksekutif">Eksekutif</option>
                            </select>

                            <label htmlFor="dashboard-popup-tentang">
                              Tentang Pekerjaan
                            </label>
                            <br />
                            <textarea
                              ref={inputTentang}
                              id="dashboard-popup-tentang"
                              placeholder={
                                e.tentang ? e.tentang : "Deskripsi pekerjaan..."
                              }
                            />
                            <br />

                            <label htmlFor="dashboard-popup-syarat">
                              Syarat
                            </label>
                            <br />
                            <textarea
                              ref={inputSyarat}
                              id="dashboard-popup-syarat"
                              placeholder={
                                e.syarat ? e.syarat : "Persyaratan kerja..."
                              }
                            />
                            <br />

                            <label for="posting-keahlian">Keahlian</label>
                            <span>
                              <input
                                value={inputSkill}
                                onChange={(e) => setInputSkill(e.target.value)}
                                id="posting-keahlian"
                                type="text"
                                placeholder="Komputer,Manajemen,dll...."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSkill();
                                  }
                                }}
                              />
                              <button
                                onClick={handleSkill}
                                className="button-main"
                              >
                                Tambah
                              </button>
                            </span>

                            <br />
                            <div className="p-b-skill-wrap">
                              {skill[0] ? (
                                skill.map((e, i) => (
                                  <>
                                    <h6 className="s-item" key={i}>
                                      {e}
                                      <img
                                        onClick={(remove) => {
                                          remove.stopPropagation();
                                          handleSkillDelete(i);
                                        }}
                                        src="/close.svg"
                                        alt="close icon"
                                      />
                                    </h6>
                                  </>
                                ))
                              ) : (
                                <p style={{ color: "grey" }}>
                                  Belum ada data keahlian.
                                </p>
                              )}
                            </div>
                            <br />
                            <p>Skill saat ini:</p>
                            <div className="p-b-skill-wrap">
                              {e.skill
                                ? JSON.parse(e.skill).map((e, i) => (
                                    <h6 className="s-item" key={i}>
                                      {e}
                                    </h6>
                                  ))
                                : "Belum ada data"}
                            </div>
                            <br />

                            <label htmlFor="dashboard-popup-perusahaan">
                              Perusahaan
                            </label>
                            <select
                              onChange={(e) =>
                                setInputPerusahaan(e.target.value)
                              }
                              id="dashboard-popup-perusahaan"
                            >
                              <option value="" selected hidden>
                                Pilih perusahaan
                              </option>
                              {perusahaan.map((e) => (
                                <option
                                  key={e.id_perusahaan}
                                  value={e.id_perusahaan}
                                >
                                  {e.nama_perusahaan}
                                </option>
                              ))}
                            </select>
                            <br />
                            <div className="dashboard-popup-action">
                              <button
                                onClick={() => handleEdit(e.id_lowongan)}
                                className="button-main"
                              >
                                Edit {loadingButton ? <LoadingButton /> : null}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
              {/* ______________________________________________________________ */}
              <div className="dashboard-pelamar">
                <div className="dashboard-filter">
                  <div className="dashboard-filter-list">
                    <button onClick={() => setSortTanggal(!sortTanggal)}>
                      <img
                        src={sortTanggal ? "/down-sort.png" : "/up-sort.png"}
                        alt="sort icon"
                      />
                      {sortTanggal ? "Terlama" : "Terbaru"}
                    </button>
                    <select onChange={(e) => setFilterLokasi(e.target.value)}>
                      <option value="" selected hidden>
                        Lokasi
                      </option>
                      {provinsi.map((e) => (
                        <option value={e.name} key={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setPopup(true)}
                    className="button-main"
                  >
                    Tambah
                  </button>
                </div>
                <div className="dashboard-pelamar-header">
                  <h6>Posisi</h6>
                  <h6>Perusahaan</h6>
                  <h6>Kategori</h6>
                  <h6>Jenis</h6>
                  <h6>Action</h6>
                </div>
                <div className="dashboard-pelamar-wrap">
                  {dataPagination
                    .filter((filter) =>
                      filter.posisi
                        .toLowerCase()
                        .includes(pencarian.toLowerCase())
                    )
                    .sort((a, b) =>
                      sortTanggal
                        ? new Date(a.lowongan_created_at) -
                          new Date(b.lowongan_created_at)
                        : new Date(b.lowongan_created_at) -
                          new Date(a.lowongan_created_at)
                    )
                    .filter((filter) =>
                      (filter.provinsi?.toString() || "")
                        .toLowerCase()
                        .includes((filterLokasi || "").toLowerCase())
                    )
                    .map((e) => (
                      <div
                        key={e.id_lowongan}
                        className="dashboard-pelamar-w-item"
                      >
                        <div className="dashboard-pelamar-w-i-nama">
                          <img
                            src={
                              e?.picture ? e.picture : "/profil-perusahaan.svg"
                            }
                            alt="profil pelamar"
                          />
                          <h6>{e.posisi}</h6>
                        </div>
                        <div className="dashboard-pelamar-w-i-email">
                          <p>{e.nama_perusahaan}</p>
                        </div>
                        <div className="dashboard-pelamar-w-i-provinsi">
                          <p
                            style={{
                              color: e.kategori ? "black" : "grey",
                            }}
                          >
                            {e.kategori ? e.kategori : "Belum ada data."}
                          </p>
                        </div>
                        <div className="dashboard-pelamar-w-i-keahlian">
                          <p
                            style={{
                              color: e.jenis ? "black" : "grey",
                            }}
                          >
                            {e.jenis ? e.jenis : "Belum ada data."}
                          </p>
                        </div>
                        <div className="dashboard-w-i-action">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setPopupEdit(true);
                              setGetId(e.id_lowongan);
                            }}
                          >
                            <img src="/pencil2.svg" alt="edit icon" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(e.id_lowongan);
                            }}
                          >
                            <img src="/trash.svg" alt="delete icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {/* Pagination */}
                {dataPagination ? (
                  <div className="pagination">
                    <div
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="p-arrow"
                    >
                      <img
                        src="../pagig-arrow2.svg"
                        alt="tanda panah pagination"
                      />
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
                      <img
                        src="../pagig-arrow.svg"
                        alt="tanda panah pagination"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
