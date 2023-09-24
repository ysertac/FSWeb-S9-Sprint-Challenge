import axios from "axios";
import React, { useEffect, useState } from "react";

// önerilen başlangıç stateleri
//const initialMessage = ''
//const initialEmail = ''
//const initialSteps = 0
//const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const kareler = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const koordinatlar = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
  ];
  const [coordinate, setCoordinate] = useState({
    x: koordinatlar[4].x,
    y: koordinatlar[4].y,
  });
  const [index, setIndex] = useState(4);
  const [steps, setSteps] = useState(0);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    for (let i = 0; i < kareler.length; i++) {
      if (kareler[i] == index) {
        setCoordinate({
          ...coordinate,
          x: koordinatlar[i].x,
          y: koordinatlar[i].y,
        });
      }
    }
  }

  useEffect(() => {
    getXY();
  }, [index]);

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setIndex(4);
    setSteps(0);
    setMessage("");
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if (yon == "left") {
      if (index == 0 || index == 3 || index == 6) {
        setMessage(`You can't go ${yon}`);
      } else {
        setIndex(index - 1);
        setSteps(steps + 1);
        setMessage("");
      }
    } else if (yon == "right") {
      if (index == 2 || index == 5 || index == 8) {
        setMessage(`You can't go ${yon}`);
      } else {
        setIndex(index + 1);
        setSteps(steps + 1);
        setMessage("");
      }
    } else if (yon == "up") {
      if (index == 0 || index == 1 || index == 2) {
        setMessage(`You can't go ${yon}`);
      } else {
        setIndex(index - 3);
        setSteps(steps + 1);
        setMessage("");
      }
    } else if (yon == "down") {
      if (index == 6 || index == 7 || index == 8) {
        setMessage(`You can't go ${yon}`);
      } else {
        setIndex(index + 3);
        setSteps(steps + 1);
        setMessage("");
      }
    } else if (yon == "reset") {
      reset();
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    sonrakiIndex(evt.target.id);
  }

  function changeHandler(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function submitHandler(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const payLoad = {
      x: coordinate.x,
      y: coordinate.y,
      steps: steps,
      email: email,
    };
    axios
      .post("http://localhost:9000/api/result", payLoad)
      .then((res) => setMessage(res.data.message));

    setIndex(4);
    document.getElementById("email").value = "";
    setSteps(0);
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Koordinatlar {`(${coordinate.x}, ${coordinate.y})`}
        </h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {kareler.map((idx) => (
          <div
            key={idx}
            className={`square${idx === kareler[index] ? " active" : ""}`}
          >
            {idx === kareler[index] ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          SOL
        </button>
        <button id="up" onClick={ilerle}>
          YUKARI
        </button>
        <button id="right" onClick={ilerle}>
          SAĞ
        </button>
        <button id="down" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={ilerle}>
          reset
        </button>
      </div>
      <form onSubmit={submitHandler}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          onChange={changeHandler}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
