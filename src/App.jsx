import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/home.jsx";
import Kerjadetail from "./pages/Kerjadetail.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/lowongan" Component={Kerja} />
          <Route path="/lowongan/:id" Component={Kerjadetail} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
