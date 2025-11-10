import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload } from 'lucide-react';

export function UploadSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload X-ray Image</CardTitle>
        <CardDescription>
          Select a chest X-ray image file to classify
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input 
            type="file" 
            accept=".jpg,.jpeg,.png" 
            className="flex-1"
          />
          <Button className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>  
        
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your X-ray image here
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, JPEG, PNG
          </p>
        </div>

        <div className="pt-4">
          <Button className="w-full cursor-pointer" size="lg">
            Classify Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
