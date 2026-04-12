import type { Node, Edge } from 'reactflow';

interface PostgresPlan {
    "Node Type": string;
    "Total Cost": number;
    "Plan Rows": number; // Добавим для красоты
    "Plans"?: PostgresPlan[];
    [key: string]: any;
}

interface TransformedGraph {
    nodes: Node[];
    edges: Edge[];
}

export const transformPlanToGraph = (rootPlan: PostgresPlan): TransformedGraph => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeIdCounter = 0;

    const NODE_WIDTH = 160;
    const H_GAP = 60;
    const V_GAP = 150;

    const calcSubtreeWidth = (plan: PostgresPlan): number => {
        if (!plan.Plans || plan.Plans.length === 0) {
            return NODE_WIDTH;
        }
        const childrenWidth = plan.Plans.reduce(
            (sum, child) => sum + calcSubtreeWidth(child) + H_GAP, 0
        ) - H_GAP;
        return Math.max(NODE_WIDTH, childrenWidth);
    };

    const transform = (
        plan: PostgresPlan,
        parentId: string | null = null,
        depth: number = 0,
        left: number = 0
    ) => {
        const currentId = (++nodeIdCounter).toString();
        const subtreeWidth = calcSubtreeWidth(plan);

        const cost = plan["Total Cost"];
        let nodeColor = '#2d3748';

        if (cost > 100) nodeColor = '#d69e2e';
        if (cost > 500) nodeColor = '#e53e3e';

        const x = left + (subtreeWidth - NODE_WIDTH) / 2;
        const y = depth * V_GAP;

        const newNode: Node = {
            id: currentId,
            data: { label: `${plan["Node Type"]}\n(Rows: ${plan["Plan Rows"]})` },
            position: { x, y },
            style: {
                background: nodeColor,
                color: '#fff',
                borderRadius: '8px',
                padding: '12px',
                width: NODE_WIDTH,
                fontSize: '12px',
                textAlign: 'center' as const,
                border: cost > 100 ? '2px solid #fff' : '2px solid #48bb78',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                cursor: 'grab'
            }
        };
        nodes.push(newNode);

        if (parentId) {
            edges.push({
                id: `e${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                animated: cost > 100,
                label: `cost: ${cost}`,
                style: {
                    stroke: nodeColor,
                    strokeWidth: cost > 500 ? 3 : 2
                },
                labelStyle: { fill: '#fff', fontSize: '10px', fontWeight: 700 },
                labelBgStyle: { fill: '#2d3748', fillOpacity: 0.8 },
                labelBgPadding: [4, 2]
            });
        }

        if (plan.Plans && Array.isArray(plan.Plans)) {
            let childLeft = left;
            plan.Plans.forEach((subPlan) => {
                const childWidth = calcSubtreeWidth(subPlan);
                transform(subPlan, currentId, depth + 1, childLeft);
                childLeft += childWidth + H_GAP;
            });
        }
    };

    transform(rootPlan);
    return { nodes, edges };
};