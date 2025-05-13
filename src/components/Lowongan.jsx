import { useState } from "react";
import { provinsi } from "../data/Provinsi";

export default function Lowongan() {
  const [where, SetWhere] = useState("");
  return (
    <>
      <div className="lowongan">
        <h4>Temukan pekerjaan yang paling sesuai dengan keahlianmu!</h4>
        <form>
          <img src="./search1.svg" alt="pencarian" />
          <input type="text" placeholder="Pekerjaan apa?" />
          <div className="garis"></div>
          <input
            list="prov"
            type="text"
            placeholder="Dari mana?"
            value={where}
            onChange={(e) => SetWhere(e.target.value)}
          />
          <datalist id="prov">
            {where.length >= 2 &&
              provinsi.map((provinsi) => (
                <option key={provinsi.id} value={provinsi.name}></option>
              ))}
          </datalist>
          <img src="./arrow-down1.svg" alt="arrow down" />
          <button>Cari</button>
        </form>
        <div className="l-filter">
          <select>
            <option hidden value="" disabled selected>
              Tanggal diposting
            </option>
            <option value="">Hari ini</option>
            <option value="">Minggu ini</option>
            <option value="">Bulan ini</option>
            <option value="">Tahun ini</option>
          </select>
          <select>
            <option hidden value="" disabled selected>
              Jenis
            </option>
            <option value="">Full Time</option>
            <option value="">Magang</option>
            <option value="">Paruh Waktu</option>
            <option value="">Shift Work</option>
          </select>
          <select>
            <option hidden value="" disabled selected>
              Gaji
            </option>
            <option value="">Rp 1-5 juta</option>
            <option value="">Rp 6-10 juta</option>
            <option value="">Rp 11-50 juta</option>
            <option value="">{`Rp >50 juta`}</option>
          </select>
        </div>
      </div>
    </>
  );
}
