import { ImageIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function ClassificationOutput({
  imageSrc,
  prediction,
  loading,
  zoom,
  setZoom,
  position,
  setPosition,
  showHeatmap
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // We use a ref here to track the pinch distance without causing extra re-renders
  const pinchDistanceRef = useRef(null);
  const imageContainerRef = useRef(null);

  // --- FIXED DISPLAY LOGIC ---
  let displayImage = imageSrc;

  if (prediction) {
      if (showHeatmap && prediction.preview_image) {
          displayImage = prediction.preview_image;
      } else if (prediction.original_image) {
          displayImage = prediction.original_image;
      } else {
          displayImage = imageSrc;
      }
  }

  // Handle Mouse Wheel for Desktop Zooming
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 5));
    };
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [setZoom]);

  // --- MOUSE HANDLERS (For Desktop) ---
  const handleMouseDown = (e) => {
    if (!displayImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- TOUCH HANDLERS (For Tablets/Phones) ---
  const handleTouchStart = (e) => {
    if (!displayImage) return;

    if (e.touches.length === 2) {
      // 2 Fingers: Start Pinch-to-Zoom
      setIsDragging(false); // Stop panning to avoid jumping
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate initial distance between fingers using Pythagorean theorem
      pinchDistanceRef.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
    } else if (e.touches.length === 1) {
      // 1 Finger: Start Panning
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!displayImage) return;

    if (e.touches.length === 2 && pinchDistanceRef.current) {
      // 2 Fingers: Process Pinch-to-Zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      // Ratio of new distance to old distance dictates zoom change
      const distanceRatio = currentDistance / pinchDistanceRef.current;

      setZoom((prevZoom) => {
        const newZoom = prevZoom * distanceRatio;
        // Keep zoom limits between 0.5x and 5.0x
        return Math.min(Math.max(0.5, newZoom), 5); 
      });

      // Update baseline distance for continuous smooth zooming
      pinchDistanceRef.current = currentDistance;

    } else if (e.touches.length === 1 && isDragging) {
      // 1 Finger: Process Panning
      const touch = e.touches[0];
      setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    }
  };

  const handleTouchEnd = (e) => {
    // If we lift one finger from a pinch, stop zooming
    if (e.touches.length < 2) {
      pinchDistanceRef.current = null;
    }
    // If no fingers are touching, stop dragging
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div
        ref={imageContainerRef}
        className="relative w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ 
          cursor: isDragging ? "grabbing" : displayImage ? "grab" : "default",
          touchAction: "none" // CRITICAL: Stops browser from scrolling page while panning/pinching
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-contain select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: isDragging || pinchDistanceRef.current ? "none" : "transform 0.1s ease-out",
            }}
            draggable={false}
          />
        ) : (
          <div className="text-center text-gray-400">
            <ImageIcon size={80} className="mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-500">No image uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}