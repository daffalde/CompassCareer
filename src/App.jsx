import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Lowongan from "./pages/Lowongan.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/lowongan" Component={Lowongan} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
