import { useState } from "react";
import Header from "../components/Header";
import { lowongan } from "../data/Data";

export default function Lowongan() {
  const [text, setText] = useState("");

  function kirim(e) {
    e.preventDefault();
    text.push({ id: 2, desc: text });
    console.log(lowongan);
  }

  console.log(lowongan);
  return (
    <>
      <div className="container">
        <Header />
        <br />
        <br />
        <br />
        <br />
        <form>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button onClick={kirim}>kirim</button>
        </form>
        {lowongan.map((e) => (
          <p>{e.desc}</p>
        ))}
      </div>
    </>
  );
}
