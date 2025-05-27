import "../styles/components/statusapp.css";

export function StatusApp({ variable }) {
  return (
    <>
      <div
        className={`status-application ${
          variable === "Ditinjau"
            ? "status-application-yellow"
            : variable === "Ditolak"
            ? "status-application-red"
            : "status-application-green"
        }`}
      >
        <h6>{variable}</h6>
      </div>
    </>
  );
}
