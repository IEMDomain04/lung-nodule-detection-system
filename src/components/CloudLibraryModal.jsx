import { X, Cloud, FileText, Activity, Search } from "lucide-react";
import { useState } from "react";
import { simulationCases } from "../data/simulation_cases"; 

export function CloudLibraryModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter cases safely (prevents crashing if title/filename is missing)
  const filteredCases = simulationCases.filter((caseItem) => {
    const query = searchQuery.toLowerCase();
    const title = caseItem.title ? caseItem.title.toLowerCase() : "";
    const filename = caseItem.serverFilename ? caseItem.serverFilename.toLowerCase() : "";
    
    return title.includes(query) || filename.includes(query);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1F2937] border border-gray-700 w-[600px] max-w-full max-h-[80vh] rounded-xl flex flex-col shadow-2xl overflow-hidden zoom-in-95">
        
        {/* Header Section with Search */}
        <div className="p-4 border-b border-gray-700 bg-[#111827] space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Cloud className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Cloud: Nodule Cases</h2>
                <p className="text-xs text-gray-400">Select a patient case to load from server</p>
              </div>
            </div>
            <button onClick={onClose} className="btn p-2 cursor-pointer hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by case name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F2937] text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm placeholder-gray-500 transition-all"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#111827] space-y-3 custom-scrollbar">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <div key={caseItem.id} onClick={() => onSelect(caseItem)} className="cloud-file group cursor-pointer w-full bg-[#1F2937] p-4 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-[#1F2937]/80 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-500 border border-gray-700 group-hover:border-blue-500 shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors truncate">{caseItem.title || "Untitled Case"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity size={12} className="text-gray-500" />
                    <p className="text-xs text-gray-400 font-mono truncate">{caseItem.serverFilename || "No Filename"}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-xs font-medium uppercase tracking-wider shrink-0">Select</div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Cloud size={48} className="mx-auto mb-4 opacity-20" />
              <p>No matching cases found.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-gray-700 bg-[#1F2937] flex justify-between items-center text-xs text-gray-500">
          <span>Secure Server Connection</span>
          <span>{filteredCases.length} Results</span>
        </div>
      </div>
    </div>
  );
}