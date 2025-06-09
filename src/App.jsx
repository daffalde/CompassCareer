import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/Home.jsx";
import Kerjadetail from "./pages/Kerjadetail.jsx";
import Perusahaan from "./pages/Perusahaan.jsx";
import Perusahaandetail from "./pages/Perusahaandetail.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Profil from "./pages/Profil.jsx";
import Tersimpan from "./pages/Tersimpan.jsx";
import Status from "./pages/Status.jsx";
import Profilperusahaan from "./pages/Profilperusahaan.jsx";
import Lowonganlist from "./pages/Lowonganlist.jsx";
import Posting from "./pages/Posting.jsx";
import Editpost from "./pages/Editpost.jsx";
import DaftarPelamar from "./pages/Daftarpelamar.jsx";
import Admin from "./pages/Admin.jsx";
import Adminpelamar from "./pages/Adminpelamar.jsx";
import ProfilPelamar from "./pages/ProfilPelamar.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Adminperusahaan from "./pages/Adminperusahaan.jsx";
import AdminLowongan from "./pages/AdminLowongan.jsx";
import AdminPengaturan from "./pages/AdminPengaturan.jsx";
import Privasi from "./pages/Privasi.jsx";
import Syarat from "./pages/Syarat.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/lowongan" Component={Kerja} />
          <Route path="/lowongan/:id" Component={Kerjadetail} />
          <Route path="/perusahaan" Component={Perusahaan} />
          <Route path="/perusahaan/:id" Component={Perusahaandetail} />
          <Route path="/tentang" Component={Aboutus} />
          <Route path="/kebijakan-privasi" Component={Privasi} />
          <Route path="/syarat" Component={Syarat} />

          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Logout} />

          <Route path="/profil" Component={Profil} />
          <Route path="/tersimpan" Component={Tersimpan} />
          <Route path="/status-lamaran" Component={Status} />
          <Route path="/profil-perusahaan" Component={Profilperusahaan} />
          <Route path="/lowongan-post" Component={Lowonganlist} />
          <Route path="/posting" Component={Posting} />
          <Route path="/edit-lowongan/:id" Component={Editpost} />
          <Route path="/pelamar" Component={DaftarPelamar} />
          <Route path="/profil-pelamar/:id" Component={ProfilPelamar} />

          {/* admin */}
          <Route path="/admin-login" Component={AdminLogin} />
          <Route path="/dashboard" Component={Admin} />
          <Route path="/dashboard/pelamar" Component={Adminpelamar} />
          <Route path="/dashboard/perusahaan" Component={Adminperusahaan} />
          <Route path="/dashboard/lowongan" Component={AdminLowongan} />
          <Route path="/dashboard/pengaturan" Component={AdminPengaturan} />

          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
