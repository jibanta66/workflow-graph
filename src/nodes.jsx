import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNode = ({ data }) => {
  return (
    <div>
      <Handle type="source" position="top" style={{ borderRadius: '50%' }} />
      <div>{data.label}</div>
      <Handle type="target" position="bottom" style={{ borderRadius: '50%' }} />
    </div>
  );
};

export default CustomNode;
