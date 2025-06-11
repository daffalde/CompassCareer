import { useNavigate } from "react-router-dom";

export function NavBack({ title }) {
  const nav = useNavigate();
  return (
    <>
      <div className="navback-container">
        <img onClick={() => nav(-1)} src="/left-arrow.png" alt="back icon" />
        <h5>{title}</h5>
        <div className="empty"></div>
      </div>
      <div className="navback-container-void"></div>
    </>
  );
}

export function BottomButton({ title, style }) {
  return (
    <>
      <div className="bottombutton-container">
        <button className={style === "main" ? "button-main" : "button-second"}>
          {title}
        </button>
      </div>
    </>
  );
}
