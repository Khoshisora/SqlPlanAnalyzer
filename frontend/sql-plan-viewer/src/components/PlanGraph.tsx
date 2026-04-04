import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useReactFlow,
    ReactFlowProvider,
    Panel
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { useEffect } from 'react';

interface PlanGraphInnerProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
}

const PlanGraphInner = ({ nodes, edges, onNodesChange, onEdgesChange }: PlanGraphInnerProps) => {
    const { fitView } = useReactFlow();

    useEffect(() => {
        if (nodes.length > 0) {
            window.requestAnimationFrame(() => {
                fitView({ padding: 0.2, duration: 500 });
            });
        }
    }, [nodes, fitView]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            onInit={(instance) => {
                window.requestAnimationFrame(() => {
                    instance.fitView({ padding: 0.2 });
                });
            }}
        >
            <Background color="#444" gap={16} />
            <Controls />
            <MiniMap
                nodeColor="#48bb78"
                maskColor="rgba(0, 0, 0, 0.6)"
                style={{ background: '#2d3748' }}
            />
            <Panel position="top-left" style={{ background: '#2d3748', padding: '8px', borderRadius: '4px', color: '#fff' }}>
                <div style={{ fontSize: '12px' }}>
                    <div>🖱️ Drag to pan</div>
                    <div>🔍 Scroll to zoom</div>
                    <div>🎯 Click nodes to select</div>
                </div>
            </Panel>
        </ReactFlow>
    );
};

const PlanGraph = (props: PlanGraphInnerProps) => {
    return (
        <div style={{ width: '100%', height: '600px', border: '1px solid #444', borderRadius: '8px', overflow: 'hidden' }}>
            <ReactFlowProvider>
                <PlanGraphInner {...props} />
            </ReactFlowProvider>
        </div>
    );
};

export default PlanGraph;