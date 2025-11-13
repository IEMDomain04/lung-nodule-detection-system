import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ClassificationOutput } from './components/ClassificationOutput';

export default function App() {
  return (
    <div className="min-h-screen [background-color:#1F2937] flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Upload X-ray Image */}
        <UploadSection />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original X-ray */}
          <ClassificationOutput type="original" />
          
          {/* Grad-CAM Visualization */}
          <ClassificationOutput type="gradcam" />
        </div>
      </main>

      <footer className="mt-16 py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Nodule System Classification - Enhancement of Resnet-50 with CBAM + ViT</p>
          <p className="mt-1 text-xs">For research and educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}
