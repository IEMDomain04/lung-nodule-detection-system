import { Card } from './ui/card';
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <Card className="rounded-none border-x-0 border-t-0 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-gray-900">X-ray Classification System</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload, classify, and visualize medical images with Grad-CAM
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
