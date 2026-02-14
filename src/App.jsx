import { useState } from "react";
import { Header } from "./components/Header";
import { ClassificationOutput } from "./components/ClassificationOutput";
import { RatingPopup } from "./components/RatingPopup";
import { UploadSection } from "./components/UploadSection";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  // 🔥 SHARED ZOOM STATE
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleRatingSubmit = (ratings) => {
    console.log("User ratings:", ratings);
  };

  return (
    <div className="h-screen bg-[#111827] text-white flex flex-col font-sans overflow-hidden">
      <Header />

      <main className="flex-1 overflow-hidden px-4 py-3">
        <div className="mx-auto flex gap-4 h-full">

          <UploadSection
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            prediction={prediction}
            setPrediction={setPrediction}
            loading={loading}
            setLoading={setLoading}
            setShowRatingPopup={setShowRatingPopup}
            zoom={zoom}
            setZoom={setZoom}
            handleResetView={handleResetView}
          />

          <ClassificationOutput
            imageSrc={previewUrl}
            prediction={prediction}
            loading={loading}
            zoom={zoom}
            setZoom={setZoom}
            position={position}
            setPosition={setPosition}
          />

        </div>
      </main>

      <RatingPopup
        isOpen={showRatingPopup}
        onClose={() => setShowRatingPopup(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
