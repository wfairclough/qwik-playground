/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";

import { nodes as initialNodes, edges as initialEdges } from "./init-elements";
// import CustomNode from './CustomNode';

// import 'reactflow/dist/style.css?inline';
// import styles from './overview.css?inline';

// const nodeTypes = {
//   custom: CustomNode,
// };

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   if (edge.sourceHandle) {
  //     const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
  //     if (edgeType) {
  //       edge.type = edgeType;
  //     }
  //   }

  //   return edge;
  // });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export const QOverviewFlow_ = qwikify$(OverviewFlow);
