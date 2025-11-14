import { Card } from './ui/card';
import { Activity, Upload } from 'lucide-react';
import { Button } from './ui/button';

export function Header({ 
  selectedFile, 
  setSelectedFile, 
  fileInputRef, 
  handleFileChange, 
  handleClassify, 
  loading 
}) {
  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div className="border-b px-6 py-4 bg-gradient-to-b from-[#1E3A8A] via-[#1F2937] to-[#111827] text-[#F9FAFB]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Left Side - Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
            <Activity className="h-6 w-6 text-[#38BDF8]" />
          </div>
          <div>
            <h1 className="text-[#F9FAFB] font-semibold text-lg">
              Lung Nodule Detection System
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              AI-powered chest X-ray analysis with attention visualization
            </p>
          </div>
        </div>

        {/* Right Side - Upload Controls */}
        <div className="flex items-center gap-3">
          <input
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            accept=".jpg,.jpeg,.png,.mha"
            aria-label="Choose X-ray image"
          />
          
          {selectedFile && (
            <div className="text-right max-w-xs hidden md:block">
              <p className="text-xs text-[#9CA3AF]">Selected:</p>
              <p className="text-sm text-[#E5E7EB] truncate font-medium">
                {selectedFile.name}
              </p>
            </div>
          )}
          
          <Button 
            className="bg-[#0EA5E9] text-white hover:bg-[#0d96d4] active:bg-[#0a74a3] cursor-pointer" 
            onClick={openFileDialog}
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          
          <Button
            className="bg-[#14B8A6] hover:bg-[#10A39B] active:bg-[#0c7d77] text-white font-medium cursor-pointer"
            onClick={handleClassify}
            disabled={!selectedFile || loading}
            size="sm"
          >
            {loading ? "Analyzing..." : "Classify"}
          </Button>
        </div>
      </div>
    </div>
  );
}
