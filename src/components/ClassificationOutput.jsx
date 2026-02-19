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
  
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });
  
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

  // --- THE "CENTER-EDGE" CLAMPING LOGIC ---
  const getClampedPosition = (newX, newY, currentZoom) => {
    if (!imageContainerRef.current) return { x: newX, y: newY };
    const { clientWidth, clientHeight } = imageContainerRef.current;

    let displayedW = clientWidth;
    let displayedH = clientHeight;

    // 1. Calculate the exact pixel size of the image on the screen
    if (imgDims.w && imgDims.h) {
      const containerRatio = clientWidth / clientHeight;
      const imgRatio = imgDims.w / imgDims.h;

      if (imgRatio > containerRatio) {
        displayedW = clientWidth;
        displayedH = clientWidth / imgRatio;
      } else {
        displayedH = clientHeight;
        displayedW = clientHeight * imgRatio;
      }
    }

    // 2. Allow dragging so the edge of the image stops exactly at the center of the container.
    // This allows movement at 100% zoom, but prevents it from disappearing at 500% zoom!
    const maxX = (displayedW * currentZoom) / 2;
    const maxY = (displayedH * currentZoom) / 2;

    return {
      x: Math.min(Math.max(newX, -maxX), maxX),
      y: Math.min(Math.max(newY, -maxY), maxY),
    };
  };

  // Re-clamp position automatically if the user zooms out
  useEffect(() => {
    setPosition((prevPos) => getClampedPosition(prevPos.x, prevPos.y, zoom));
  }, [zoom, imgDims]);

  // Handle Mouse Wheel for Desktop Zooming
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(1, prev + delta), 5));
    };
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [setZoom]);

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
    if (!displayImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition(getClampedPosition(newX, newY, zoom));
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e) => {
    if (!displayImage) return;

    if (e.touches.length === 2) {
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      pinchDistanceRef.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!displayImage) return;

    if (e.touches.length === 2 && pinchDistanceRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      const distanceRatio = currentDistance / pinchDistanceRef.current;

      setZoom((prevZoom) => {
        const newZoom = prevZoom * distanceRatio;
        return Math.min(Math.max(1, newZoom), 5); 
      });

      pinchDistanceRef.current = currentDistance;

    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      setPosition(getClampedPosition(newX, newY, zoom));
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      pinchDistanceRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  const onImageLoad = (e) => {
    setImgDims({ w: e.target.naturalWidth, h: e.target.naturalHeight });
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
          touchAction: "none"
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            onLoad={onImageLoad}
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