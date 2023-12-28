import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from './custom-node';
import './App.css';
import DownloadButton from './download-image';

const flowKey = 'example-flow';

const getNodeId = () => `randomnode_${+new Date()}`;
const nodeTypes = { textUpdater: TextUpdaterNode };
const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2',animated: true }]; 

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      animated: true,
      style: { stroke: '#000000' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Get the selected file
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const flow = JSON.parse(content); // Parse the JSON content
  
          if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
          }
        } catch (error) {
          // Handle parsing errors
          console.error('Error parsing JSON file:', error);
        }
      };
  
      if (file) {
        reader.readAsText(file); // Read the file as text
      }
    };
  
    // Create an input element to allow users to select a file
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.json';
    inputElement.addEventListener('change', handleFileChange);
  
    // Trigger click on the input element to open file picker
    inputElement.click();
  }, [setNodes, setEdges, setViewport]);
  

  const downloadJSONFile = () => {
    const flow = JSON.parse(localStorage.getItem(flowKey));
  
    if (flow) {
      const data = JSON.stringify(flow);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flow_data.json';
      document.body.appendChild(a);
      a.click();
  
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: 'textUpdater',
      data: { data: { value: 123 }  },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);



  return (
    
<div style={{ width: '100%', height: '601px', backgroundColor: '#9C8DFF' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      nodeTypes={nodeTypes}
    >
      <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button> 
        <button onClick={downloadJSONFile}>Download JSON</button>

       
      </Panel>

      <DownloadButton  />
    </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);


<div style={{ width: '100%', height: '600px' }}></div>