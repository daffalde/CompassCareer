import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();
  return (
    <>
      <div className="notfound-container">
        <div className="notfound">
          <h1>404</h1>
          <h6>Halaman tidak ditemukan</h6>
          <button onClick={() => nav("/")} className="button-main">
            Kembali ke beranda
          </button>
        </div>
      </div>
    </>
  );
}
