import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export function UploadSection({ 
  selectedFile, 
  setSelectedFile, 
  previewUrl, 
  setPreviewUrl,
  prediction,
  setPrediction,
  loading,
  setLoading
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile, setPreviewUrl]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClassify = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setPrediction(result);
      
      // Update preview with backend-generated image if available
      if (result.preview_image) {
        setPreviewUrl(result.preview_image);
      }
    } catch (err) {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="bg-linear-to-b from-[#1E3A8A] via-[#1F2937] to-[#111827] text-[#F9FAFB] border-none shadow-lg">

      {/* Title Section */}
      <CardHeader className="pb-3">
        <CardTitle className="text-[#F9FAFB] text-lg">Upload X-ray Image</CardTitle>
        <CardDescription className="text-[#9CA3AF] text-sm">
          Select a chest X-ray or MHA file to analyze
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">

        {/* Upload Button and File Name - Single Row */}
        <div className="flex items-center gap-4">
          <input
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            accept=".jpg,.jpeg,.png,.mha"
            aria-label="Choose X-ray image"
          />
          <Button 
            className="cursor-pointer bg-[#0EA5E9] text-white transition-colors hover:bg-[#0d96d4] active:bg-[#0a74a3]" 
            onClick={openFileDialog}
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          
          {selectedFile && (
            <p className="text-sm text-[#E5E7EB] truncate flex-1">
              <strong className="font-bold text-[#38BDF8]">Selected:</strong> {selectedFile.name}
            </p>
          )}
        </div>

        {/* Compact Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors hover:border-[#38BDF8] hover:bg-[#0EA5E9]/10 ${isDragging
            ? 'border-[#38BDF8] bg-[#0EA5E9]/10'
            : 'border-[#374151] bg-[#1F2937]'
            } cursor-pointer`}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
        >
          {previewUrl ? (
            <div className="flex items-center justify-center gap-3">
              <img
                src={previewUrl}
                alt="preview"
                className="h-16 w-16 object-cover rounded border-2 border-[#38BDF8]"
              />
              <div className="text-left">
                <p className="text-sm text-[#E5E7EB] font-medium">Image uploaded</p>
                <p className="text-xs text-[#9CA3AF]">Click "Classify Image" to analyze</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Upload className="h-8 w-8 text-[#38BDF8]" />
              <div className="text-left">
                <p className="text-sm text-[#E5E7EB]">Drag & drop or click to upload</p>
                <p className="text-xs text-[#9CA3AF]">JPG, PNG, MHA formats</p>
              </div>
            </div>
          )}
        </div>

        {/* Classify Button */}
        <Button
          className="w-full cursor-pointer bg-[#14B8A6] hover:bg-[#10A39B] active:bg-[#0c7d77] text-white font-medium transition-all"
          onClick={handleClassify}
          disabled={!selectedFile || loading}
        >
          {loading ? "Analyzing..." : "Classify Image"}
        </Button>

      </CardContent>
    </Card>
  );

}
