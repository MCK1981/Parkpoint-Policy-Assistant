
import React, { useState, useRef, useEffect } from 'react';
import { queryProcedure } from './services/gemini';
import { ProceduralResponse } from './components/ProceduralResponse';
import { SOPViewer } from './components/SOPViewer';
import { Message, SOPResponse, SOP } from './types';
import { SOP_DATA, findSOPById } from './data/sopData';

// Fix: Redefine AIStudio interface to match global expectations and avoid Window conflict (line 12 fix)
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSOP, setActiveSOP] = useState<SOP | null>(null);
  const [showKeyWarning, setShowKeyWarning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Check if an API key is selected on mount as per guidelines
  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setShowKeyWarning(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success after triggering the selection dialog to avoid race conditions
      setShowKeyWarning(false);
    }
  };

  const processQuery = async (userQuery: string) => {
    if (!userQuery.trim() || loading) return;

    setActiveSOP(null);
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);

    try {
      const result = await queryProcedure(userQuery);
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify(result) }]);
      setShowKeyWarning(false);
    } catch (error: any) {
      console.error("Query Error:", error);
      
      const isQuotaError = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      // Fix: Handle specific error message for invalid/missing entities as per guidelines
      const isKeyNotFoundError = error?.message?.includes('Requested entity was not found.');
      
      if (isKeyNotFoundError) {
        setShowKeyWarning(true);
        // Prompt user to select a key again if it was not found
        handleOpenKeySelector();
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: "API Key selection required. The previous key could not be found. Please select a valid API key from a paid GCP project." 
        }]);
      } else if (isQuotaError) {
        setShowKeyWarning(true);
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: "Quota Limit Reached. The free API tier has strict limits. Please wait 60 seconds or switch to a paid project API key for uninterrupted access." 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: "I encountered an error retrieving that policy. Please try again or rephrase your question." 
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input;
    setInput('');
    processQuery(query);
  };

  const handleFaqClick = (faq: string) => {
    processQuery(faq);
  };

  const handleReferenceClick = (refString: string) => {
    const sop = findSOPById(refString);
    if (sop) {
      setActiveSOP(sop);
    } else {
      console.warn("SOP content not found for reference:", refString);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - All SOPs by Department */}
      <aside className="hidden lg:flex w-80 bg-[#1B2B48] flex-col text-white">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-parking text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ParkPoint</h1>
              <p className="text-xs text-blue-300/80">Policy Assistant</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
          {SOP_DATA.map((dept, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="px-4 text-[10px] font-bold text-blue-300/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <i className={`fas ${dept.icon}`}></i> {dept.name}
              </h2>
              <div className="space-y-1">
                {dept.sops.map((sop) => (
                  <button
                    key={sop.id}
                    onClick={() => setActiveSOP(sop)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all group flex items-center gap-2
                      ${activeSOP?.id === sop.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <i className="fas fa-file-alt opacity-30 group-hover:opacity-100 transition-opacity"></i>
                    <span className="truncate">{sop.id} - {sop.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 bg-black/20 space-y-4">
          <button 
            onClick={handleOpenKeySelector}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-key text-blue-400"></i> Change API Key
          </button>
          <div className="flex items-center gap-3 text-[10px] text-blue-200/60 font-medium">
            <i className="fas fa-shield-alt"></i>
            <span>V1.0.30 | Internal Index</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeSOP ? (
          <SOPViewer sop={activeSOP} onBack={() => setActiveSOP(null)} />
        ) : (
          <>
            {/* Chat Header */}
            <header className="h-16 glass-effect border-b border-gray-200 flex items-center justify-between px-8 z-10">
              <div className="flex items-center gap-4">
                <button className="lg:hidden text-gray-500">
                  <i className="fas fa-bars"></i>
                </button>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest text-[10px]">Knowledge Engine</span>
              </div>
              <div className="flex items-center gap-4">
                {showKeyWarning && (
                  <button 
                    onClick={handleOpenKeySelector}
                    className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 font-bold animate-pulse flex items-center gap-2"
                  >
                    <i className="fas fa-exclamation-triangle"></i> Key Selection Required - Click Here
                  </button>
                )}
                <span className="text-xs text-green-500 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </header>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                    <i className="fas fa-book-open text-3xl text-blue-600"></i>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">SOP Assistant</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      Access all ParkPoint policies and procedures. Ask questions to get summaries, roles, and visual workflows instantly.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    {[
                      "Procedure for lost valet tickets?",
                      "Employee recruitment request process?",
                      "Revenue reconciliation thresholds?",
                      "Petty cash local payment limits?"
                    ].map((q, idx) => (
                      <button key={idx} onClick={() => processQuery(q)} className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-gray-600 shadow-sm">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-4xl p-6 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-gray-200 shadow-sm'} w-full sm:w-auto`}>
                    {msg.role === 'user' ? (
                      <p className="font-medium text-sm">{msg.content}</p>
                    ) : (
                      (() => {
                        try {
                          const data = JSON.parse(msg.content);
                          return (
                            <ProceduralResponse 
                              data={data} 
                              onFaqClick={handleFaqClick} 
                              onReferenceClick={handleReferenceClick}
                            />
                          );
                        } catch {
                          return (
                            <div className={`leading-relaxed text-sm ${msg.content.includes('Quota') || msg.content.includes('Key') ? 'text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 font-medium' : 'text-gray-700'}`}>
                              {msg.content}
                              {(msg.content.includes('Quota') || msg.content.includes('Key')) && (
                                <button 
                                  onClick={handleOpenKeySelector}
                                  className="mt-3 block text-xs underline font-bold"
                                >
                                  Switch to a paid project key →
                                </button>
                              )}
                            </div>
                          );
                        }
                      })()
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Consulting Policy Manuals...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-gray-200 shadow-2xl z-20">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a policy question..."
                  className="flex-1 py-4 px-6 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all pr-16 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-200"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                </button>
              </form>
              <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                <i className="fas fa-lock text-[8px]"></i> Confidential Internal Document
              </p>
            </div>
          </>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
