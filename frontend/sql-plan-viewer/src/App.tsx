import './App.css'
import { useState } from "react";
import { useNodesState, useEdgesState } from 'reactflow';
import PlanGraph from './components/PlanGraph';
import { transformPlanToGraph } from "./utils/PlanTransformer.ts";

function App() {
    const url: string = "http://localhost:8080/api/v1/plans/analyze";
    const [sql, setSql] = useState<string>("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res: Response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sql: sql }),
            });

            if (!res.ok) {
                const errorData: string = await res.text();
                alert(`Server error: ${res.status}. ${errorData}`);
                return;
            }

            const data: any = await res.json();
            setResult(data);

            const { nodes: newNodes, edges: newEdges } = transformPlanToGraph(data[0].Plan);

            setNodes(newNodes);
            setEdges(newEdges);

        } catch (error: any) {
            console.error("Connection failed: " + error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <h1>SQL Plan Analyzer</h1>

            <div className="input-area">
        <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Enter your SELECT query here..."
        />
                <button onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze SQL"}
                </button>
            </div>

            {nodes.length > 0 && (
                <PlanGraph
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                />
            )}

            <details>
                <summary>View Raw JSON</summary>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
        </div>
    )
}

export default App;