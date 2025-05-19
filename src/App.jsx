import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/home.jsx";
import Kerjadetail from "./pages/Kerjadetail.jsx";
import Perusahaan from "./pages/Perusahaan.jsx";
import Perusahaandetail from "./pages/Perusahaandetail.jsx";
import Aboutus from "./pages/Aboutus.jsx";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
