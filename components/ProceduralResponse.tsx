
import React from 'react';
import { SOPResponse } from '../types';
import { FlowchartDisplay } from './FlowchartDisplay';

interface ProceduralResponseProps {
  data: SOPResponse;
  onFaqClick?: (question: string) => void;
  onReferenceClick?: (ref: string) => void;
}

export const ProceduralResponse: React.FC<ProceduralResponseProps> = ({ data, onFaqClick, onReferenceClick }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Summary with Bullet Points */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Procedure Summary</h3>
          <button 
            onClick={() => onReferenceClick?.(data.references[0])}
            className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            {data.references[0] || "Ref: Internal SOP"}
          </button>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {data.summary}
        </div>
      </section>

      {/* Roles & Responsibilities */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">Positions & Responsibilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.roles.map((role, idx) => (
            <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-md mr-4">
                <i className="fas fa-user-tie text-blue-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{role.position}</h4>
                <p className="text-sm text-gray-600 mt-1">{role.responsibility}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flowchart */}
      {data.flowchart && data.flowchart.nodes.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">Operational Workflow</h3>
          <FlowchartDisplay nodes={data.flowchart.nodes} edges={data.flowchart.edges} />
        </section>
      )}

      {/* Dynamic FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
            <i className="fas fa-lightbulb"></i> Related Questions
          </h3>
          <div className="flex flex-col gap-2">
            {data.faqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => onFaqClick?.(faq)}
                className="text-left p-3 rounded-lg bg-white border border-blue-100 hover:border-blue-400 hover:shadow-sm transition-all text-sm text-gray-700 font-medium group flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                {faq}
                <i className="fas fa-chevron-right ml-auto text-blue-200 group-hover:text-blue-400 text-xs"></i>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      <section className="pt-4 border-t border-gray-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Official SOP References</h3>
        <div className="flex flex-wrap gap-2">
          {data.references.map((ref, idx) => (
            <button 
              key={idx} 
              onClick={() => onReferenceClick?.(ref)}
              className="px-3 py-1 bg-gray-100 text-xs text-blue-700 font-medium rounded-md border border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-bookmark mr-2 text-blue-400"></i> {ref}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
