import React, { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data, isConnectable }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('Initial Text'); // Replace 'Initial Text' with your default text

  const [selectedOption, setSelectedOption] = useState('');

  const onLabelDoubleClick = () => {
    setEditing(true);
  };

  const onLabelChange = (evt) => {
    setText(evt.target.value);
  };

  const onLabelBlur = () => {
    setEditing(false);
  };

  const { setNodes, setEdges } = useReactFlow();

  const handleOptionChange = (evt) => {
    setSelectedOption(evt.target.value);
    switch (evt.target.value) {
      case 'delete':
        deleteNode();
        break;
      // Add more cases for other actions if needed
      default:
        break;
    }
  };

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        {!editing ? (
          <label onDoubleClick={onLabelDoubleClick} style={{ color: 'black' }}>
            Text: {text}
          </label>
        ) : (
          <input
            id="text-input" // Unique ID for the input field
            name="text-input" // Unique name for the input field
            value={text}
            onChange={onLabelChange}
            onBlur={onLabelBlur}
            autoFocus
            className="nodrag"
          />
        )}
        <input id="another-input" name="another-input" />

        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select an action</option>
          <option value="delete">Delete</option>
          
        </select>
    
      </div>

      <Handle type="source" position={Position.Left} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="c" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;
