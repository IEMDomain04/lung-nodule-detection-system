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
    <Card>

      {/* Title Section of the Site */}
      <CardHeader>
        <CardTitle>Upload X-ray Image</CardTitle>
        <CardDescription>
          Select a chest X-ray image file to classify
        </CardDescription>
      </CardHeader>


      <CardContent className="space-y-4">

        {/* Button */}
        <div className="flex items-center gap-4">
          {/* hidden native input used for opening the file picker */}
          <input className="hidden" ref={fileInputRef} onChange={handleFileChange} type="file" accept=".jpg,.jpeg,.png" aria-label="Choose X-ray image" />
          <Button className="cursor-pointer" onClick={openFileDialog}>
            <Upload className="mr-2 h-4 w-4 cursor-pointer" />Upload
          </Button>
        </div>

        {/* Shows the selected file's name */}
        {selectedFile && (
          <p className="text-sm text-gray-600"><strong className='font-bold'>Selected:</strong> {selectedFile.name}</p>
        )}
        

        {/* Drag and Drop Area of the Image */}
        <div
          className={`choosefile-img border-2 border-dashed rounded-lg p-8 text-center bg-gray-100 cursor-pointer ${
            isDragging ? 'border-blue-400 bg-blue-50' : ''
          }`}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="mx-auto max-h-60 object-contain mb-4" />
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop your X-ray image here</p>
              <p className="text-xs text-gray-500">Supported formats: JPG, JPEG, PNG</p>
            </>
          )}
        </div>


        {/* Classify Image Button */}
        <div className="pt-4"><Button className="w-full cursor-pointer" size="lg">Classify Image</Button></div>
      </CardContent>
    </Card>
  );
}
