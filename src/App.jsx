import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/home.jsx";
import Kerjadetail from "./pages/Kerjadetail.jsx";
import Perusahaan from "./pages/Perusahaan.jsx";
import Perusahaandetail from "./pages/Perusahaandetail.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
