import { HeaderDashboard, Sidebar } from "../components/Sidebar";
import "../styles/dashboard.css";

export default function Admin() {
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        {/* _________________________________________________________ */}

        <div className="dashboard-content">
          <HeaderDashboard content={"Dashboard"} />
        </div>
      </div>
    </>
  );
}
