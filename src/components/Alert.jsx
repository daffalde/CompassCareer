export function AlertSucceed({ message }) {
  return (
    <>
      <div className="alert-container">
        <div className="alert-succeed"></div>
        <span>
          <h6 className="alert-font-succeed">Berhasil</h6>
          <p>{message}</p>
        </span>
      </div>
    </>
  );
}

export function AlertFailed({ message }) {
  return (
    <>
      <div className="alert-container">
        <div className="alert-failed"></div>
        <span>
          <h6 className="alert-font-failed">Gagal</h6>
          <p>{message}</p>
        </span>
      </div>
    </>
  );
}
