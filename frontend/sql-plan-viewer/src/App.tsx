import './App.css'
import {useEffect, useState} from "react";

function App() {

  const url : string = "http://localhost:8080/api/v1/plans/analyze";
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({sql: "SELECT * FROM query_plans;"})
    })
        .then(res => res.text())
        .then(data => {
          console.log(data);
          setResult(data);
        });
    }, []);

  return (
    <>
      <h1>Analyze</h1>
      <pre>{result}</pre>
    </>
  )
}

export default App
