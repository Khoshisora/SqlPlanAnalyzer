import './App.css'
import {useEffect, useState} from "react";

function App() {

  const url : string = "http://localhost:8080/api/v1/plans/analyze";
  const [sql, setSql] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

    const handleAnalyze = async () => {
        setLoading(true);
        setResult("");

        try {
            const res : Response = await fetch(url, {
               method: "POST",
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify({sql: sql}),
            });

            if (!res.ok) {
                const errorData : string = await res.text();
                setResult(`Server error: ${res.status}. Details: ${errorData}`);
                return;
            }

            const data : any = await res.json();
            setResult(data);
        } catch (error : any) {
            console.error("Connection failed: " + error);
            setResult("Critical Error: Could not connect to the backend. Check if Docker is running.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
        />
        <button
            onClick={handleAnalyze}
            disabled={loading}
        >{loading ? "Analyzing..." : "Analyze SQL"}</button>
        <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  )
}

export default App
