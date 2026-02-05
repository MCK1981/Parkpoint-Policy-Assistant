
import React from 'react';
import { SOP } from '../types';

interface SOPViewerProps {
  sop: SOP;
  onBack: () => void;
}

export const SOPViewer: React.FC<SOPViewerProps> = ({ sop, onBack }) => {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 print-container">
      {/* Document Toolbar - Hidden during print */}
      <div className="h-16 border-b border-gray-200 flex items-center px-8 justify-between bg-gray-50/50 no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
            title="Back to Chat"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{sop.department}</span>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{sop.id} - {sop.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 mr-2 italic">Standard ParkPoint Template v4.0</span>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <i className="fas fa-file-pdf"></i> Download as PDF
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 max-w-5xl mx-auto w-full">
        <div className="sop-card space-y-10">
          {/* Official Letterhead Simulation */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">P</div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">ParkPoint</h1>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Property & Management Solutions</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold text-gray-900">Standard Operating Procedure</h2>
              <p className="text-blue-600 font-mono text-xs font-bold">{sop.id}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Effective Date: 01-JAN-2025</p>
            </div>
          </div>

          <header className="space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-none">{sop.title}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg text-[11px] uppercase tracking-wider font-bold text-gray-500">
              <div>
                <p className="text-blue-600 mb-1">Department</p>
                <p className="text-gray-900">{sop.department}</p>
              </div>
              <div>
                <p className="text-blue-600 mb-1">Version</p>
                <p className="text-gray-900">2025.1.0</p>
              </div>
              <div>
                <p className="text-blue-600 mb-1">Status</p>
                <p className="text-green-600">Active / Approved</p>
              </div>
              <div>
                <p className="text-blue-600 mb-1">Classification</p>
                <p className="text-red-600">Confidential</p>
              </div>
            </div>
          </header>

          <div className="space-y-12">
            {sop.sections.map((section, idx) => (
              <section key={idx} className="space-y-4 break-inside-avoid">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-4">
                  <span className="flex-none w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {section.title}
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-12">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-12 text-center">
              <div>
                <div className="h-16 border-b border-gray-300 mb-2"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Authorized Signatory (HR/Operations)</p>
              </div>
              <div>
                <div className="h-16 border-b border-gray-300 mb-2"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Authorized Signatory (Finance/Audit)</p>
              </div>
            </div>
            <p className="text-center text-[9px] text-gray-300 font-medium tracking-[0.3em] uppercase mt-12">
              All Rights Reserved © 2025 ParkPoint. Unauthorized duplication is strictly prohibited.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
