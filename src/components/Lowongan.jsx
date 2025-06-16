import { useEffect, useState } from "react";
import { provinsi } from "../data/Provinsi";
import { kategori } from "../data/Data";

export default function Lowongan({
  onSearch,
  onJenis,
  onTanggal,
  onGaji,
  onKategori,
  onLocation,
}) {
  const [where, SetWhere] = useState("");
  const [cari, setCari] = useState("");

  function sendCari(e) {
    e.preventDefault();
    onSearch({ pekerjaan: cari, lokasi: where });
  }

  function handleJenis(e) {
    onJenis(e.target.value);
  }

  function handleTanggal(e) {
    onTanggal(e.target.value);
  }

  function handleGaji(e) {
    onGaji(e.target.value);
  }

  function handleKategori(e) {
    onKategori(e.target.value);
  }

  function handleLocation(e) {
    onLocation(e.target.value);
  }

  return (
    <>
      <div className="lowongan">
        <h4>Temukan pekerjaan yang paling sesuai dengan keahlianmu!</h4>
        <form>
          <img src="./search1.svg" alt="pencarian" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            type="text"
            placeholder="Pekerjaan apa?"
          />
          <div className="garis"></div>
          <input
            id="lowongan-secondinput"
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
          <img id="arrow-down1" src="./arrow-down1.svg" alt="arrow down" />
          <button onClick={sendCari}>Cari</button>
        </form>
        <div className="l-filter">
          <select onChange={handleTanggal}>
            <option hidden>Tanggal diposting</option>
            <option value="hari">Hari ini</option>
            <option value="minggu">Minggu ini</option>
            <option value="bulan">Bulan ini</option>
            <option value="tahun">Tahun ini</option>
          </select>
          <select onChange={handleJenis}>
            <option hidden value="" disabled>
              Jenis
            </option>
            <option value="Full Time">Full Time</option>
            <option value="Magang">Magang</option>
            <option value="Paruh Waktu">Paruh Waktu</option>
            <option value="Shift Work">Shift Work</option>
          </select>
          <select onChange={handleGaji}>
            <option hidden value="" disabled>
              Gaji
            </option>
            <option value="1-5">Rp 1-5 juta</option>
            <option value="6-10">Rp 6-10 juta</option>
            <option value="11-50">Rp 11-50 juta</option>
            <option value="50">{`Rp >50 juta`}</option>
          </select>
          <select onChange={handleKategori}>
            <option hidden value="" disabled>
              Kategori
            </option>
            {kategori
              .sort((a, b) => a.nama.localeCompare(b.nama))
              .map((e) => (
                <option key={e.id}>{e.nama}</option>
              ))}
          </select>
          <select onChange={handleLocation} id="lowongan-filter">
            <option value="" hidden disabled>
              Lokasi
            </option>
            {provinsi
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((e) => (
                <option key={e.id}>{e.name}</option>
              ))}
          </select>
        </div>
      </div>
    </>
  );
}
