import { X, Cloud, FileText, Activity } from "lucide-react";
import { simulationCases } from "../data/simulation_cases"; // <--- THIS MUST EXIST

export function CloudLibraryModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1F2937] border border-gray-700 w-full max-w-2xl max-h-[80vh] rounded-xl flex flex-col shadow-2xl overflow-hidden zoom-in-95">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#111827]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Cloud className="text-blue-400" size={20} /></div>
            <div><h2 className="text-lg font-bold text-white">Cloud Case Library</h2><p className="text-xs text-gray-400">Select a patient case to load from server</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-[#111827] space-y-3">
          {simulationCases.length > 0 ? (
            simulationCases.map((caseItem) => (
              <div key={caseItem.id} onClick={() => onSelect(caseItem)} className="group cursor-pointer bg-[#1F2937] p-4 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-[#1F2937]/80 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-500 border border-gray-700 group-hover:border-blue-500"><FileText size={24} /></div>
                <div className="flex-1"><h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{caseItem.title}</h3><div className="flex items-center gap-2 mt-1"><Activity size={12} className="text-gray-500" /><p className="text-xs text-gray-400 font-mono">{caseItem.serverFilename}</p></div></div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-xs font-medium uppercase tracking-wider">Select</div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500"><Cloud size={48} className="mx-auto mb-4 opacity-20" /><p>No cases found in library.</p></div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-700 bg-[#1F2937] flex justify-between items-center text-xs text-gray-500"><span>Secure Server Connection</span><span>{simulationCases.length} Cases Available</span></div>
      </div>
    </div>
  );
}