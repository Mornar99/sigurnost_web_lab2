import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const postToDb = async (user, pass) => {
    try {
      await axios.post("http://localhost:5000/api/data", { user, pass });
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const logIn = async (user, pass) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        user,
        pass,
      });
      //console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dbrows");
      alert(JSON.stringify(response.data)); // log the fetched data to the console
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  return (
    <div className="App">
      <p>
        Upute: implementitano je SQL umetanje i Loša autentifikacija. SQL
        umetanje se može omoguciti po zelji klikom na checkbox. Podaci se
        spremaju u bazu. Baza je napravljena lokalno unutar PostgreSQL 16
        servera te je za testiranje potrebno lokalno stvoriti bazu na pgadminu
        te je nazvati "postgres" i staviti joj sifru "postgres", a unutar nje
        stvoriti tablicu "userdata" koja ima 2 stupca: user(text) i pasw(text).
        SQL ubacivanje koje brise cijelu tabluc je moguce izvesti naredbom
        <p>'); DROP TABLE userdata; --</p> Ako je ranjivost iskljucena onda je
        nemoguce unijeti ovu naredbu, tj button za spremanje u bazu ce biti
        onemogucen. Loša autentifikacija je izvedena na nacin da se prijaviti
        moze samo preko 3 kombinacije usernamea i lozinke koji su unaprijed
        navedeni u kodu, nalaze se u datoteci server.js{" "}
        <p>
          Aplikacija se pokrece iz 2 terminala: u prvi unijeti : "npm start",a u
          drugi: "node server.js", ali prije toga je potrebno povuci sa githuba
          i instalirati potrebne pakete pomocu: "npm install".
        </p>
      </p>
      <div className="flex-row">
        <input type="checkbox" onClick={(e) => setChecked(!checked)}></input>
        <h4>Ranjivost ukljucena</h4>
      </div>
      <div className="flex-row">
        <h4>Unesite vase korisnicko ime: </h4>
        <input
          type="text"
          onChange={(e) => setUser(e.target.value)}
          value={user}
        ></input>
        <h4>Unesite vasu sifru: </h4>
        <input
          type="text"
          onChange={(e) => setPass(e.target.value)}
          value={pass}
        ></input>
      </div>
      {checked && (
        <button onClick={() => postToDb(user, pass)}>
          Spremi podatke, ranjivost ukljucena
        </button>
      )}
      {!checked && (
        <button
          onClick={() => postToDb(user, pass)}
          disabled={
            user.match(
              "('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)"
            ) ||
            pass.match(
              "('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)"
            )
          }
        >
          Spremi podatke, ranjivost iskljucena
        </button>
      )}
      <br></br>
      <button
        onClick={() => logIn(user, pass)}
        disabled={user.length < 1 || pass.length < 1}
        className="bottomBtn"
      >
        Prijava, demonstrira losu autentifikaciju
      </button>
      <br></br>
      <button onClick={() => fetchData()} className="bottomBtn">
        Ispisi sadrzaj baze
      </button>
    </div>
  );
}

export default App;
