import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/home.jsx";
import Kerjadetail from "./pages/Kerjadetail.jsx";
import Perusahaan from "./pages/Perusahaan.jsx";
import Perusahaandetail from "./pages/Perusahaandetail.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Test from "./pages/Test.jsx";
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
          <Route path="/dashboard" Component={Admin} />
          <Route path="/dashboard/pelamar" Component={Adminpelamar} />

          <Route path="/test" Component={Test} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
