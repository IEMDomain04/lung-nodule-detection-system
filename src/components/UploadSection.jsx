import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export function UploadSection() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

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

  return (
  <Card className="bg-gradient-to-b from-[#1E3A8A] via-[#1F2937] to-[#111827] text-[#F9FAFB] border-none shadow-lg">

    {/* Title Section */}
    <CardHeader>
      <CardTitle className="text-[#F9FAFB]">Upload X-ray Image</CardTitle>
      <CardDescription className="text-[#9CA3AF]">
        Select a chest X-ray image file to classify
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <input
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          type="file"
          accept=".jpg,.jpeg,.png"
          aria-label="Choose X-ray image"
        />
        <Button
          className="cursor-pointer bg-[#0EA5E9] hover:bg-[#38BDF8] text-white transition-colors"
          onClick={openFileDialog}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Selected File Name */}
      {selectedFile && (
        <p className="text-sm text-[#E5E7EB]">
          <strong className="font-bold text-[#38BDF8]">Selected:</strong> {selectedFile.name}
        </p>
      )}

      {/* Drag and Drop Area */}
      <div
        className={`choosefile-img border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
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
          <img
            src={previewUrl}
            alt="preview"
            className="mx-auto max-h-60 object-contain mb-4 rounded-lg shadow-md"
          />
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-[#38BDF8] mb-4" />
            <p className="text-sm text-[#E5E7EB] mb-2">
              Drag and drop your X-ray image here
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Supported formats: JPG, JPEG, PNG
            </p>
          </>
        )}
      </div>

      {/* Classify Button */}
      <div className="pt-4">
        <Button
          className="w-full cursor-pointer bg-[#14B8A6] hover:bg-[#10A39B] text-white font-medium text-lg transition-all"
          size="lg"
        >
          Classify Image
        </Button>
      </div>

    </CardContent>
  </Card>
);

}
