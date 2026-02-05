
import React from 'react';
import { FlowNode, FlowEdge } from '../types';

interface FlowchartProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const FlowchartDisplay: React.FC<FlowchartProps> = ({ nodes, edges }) => {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl overflow-x-auto">
      <div className="flex flex-col items-center gap-4 min-w-[300px]">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div className={`
              px-6 py-3 rounded-lg border-2 text-sm font-medium text-center shadow-sm max-w-xs transition-all
              ${node.type === 'start' ? 'bg-blue-50 border-blue-200 rounded-full' : ''}
              ${node.type === 'process' ? 'bg-white border-gray-200' : ''}
              ${node.type === 'decision' ? 'bg-amber-50 border-amber-200 rotate-45 flex items-center justify-center h-24 w-24 p-2' : ''}
              ${node.type === 'end' ? 'bg-gray-50 border-gray-300 rounded-full' : ''}
            `}>
              <span className={node.type === 'decision' ? '-rotate-45 block w-full text-xs leading-tight' : ''}>
                {node.text}
              </span>
            </div>
            {index < nodes.length - 1 && (
              <div className="h-8 w-0.5 bg-gray-300 relative">
                <div className="absolute -bottom-1 -left-1 text-gray-300">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
