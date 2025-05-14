import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kerja from "./pages/Kerja.jsx";
import Home from "./pages/home.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/lowongan" Component={Kerja} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
