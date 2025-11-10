import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageIcon } from 'lucide-react';


export function ClassificationOutput({ type }) {
  const isOriginal = type === 'original';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isOriginal ? 'Original X-ray Image' : 'Grad-CAM Visualization'}
        </CardTitle>
        <CardDescription>
          {isOriginal 
            ? 'Uploaded chest X-ray for analysis' 
            : 'Heatmap showing model focus areas'}
        </CardDescription>
      </CardHeader>

      
      <CardContent>
        {/* Image Placeholder */}
        <div className="relative aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
          <div className="text-center">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isOriginal ? 'Original X-ray' : 'Grad-CAM Heatmap'}
            </p>
          </div>
          {!isOriginal && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">Heatmap</Badge>
            </div>
          )}
        </div>

        {/* Classification Results (only for original) */}
        {isOriginal && (
          <div className="space-y-3 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600 mb-1">Predicted Class:</p>
              <Badge variant="outline" className="text-base px-3 py-1">
                --
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Confidence Score:</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-gray-400 h-full rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="text-sm text-gray-500 min-w-12">--%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
