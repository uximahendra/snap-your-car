import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, RotateCw } from "lucide-react";

interface CapturedAngle {
  angleId: string;
  angleLabel: string;
  imageData: string;
  timestamp: number;
}

const View360 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedAngles = (location.state?.capturedAngles || []) as CapturedAngle[];
  const mode = location.state?.mode || 'exterior';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: 'portrait' }).catch(console.warn);
    }
    
    return () => {
      if (Capacitor.isNativePlatform()) {
        ScreenOrientation.unlock().catch(console.warn);
      }
    };
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort angles in logical order for 360 rotation
  const angleOrder = ['front', 'front-left', 'left', 'rear-left', 'rear', 'rear-right', 'front-right'];
  const sortedAngles = angleOrder
    .map(id => capturedAngles.find(a => a.angleId === id))
    .filter(Boolean) as CapturedAngle[];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev - 1 + sortedAngles.length) % sortedAngles.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % sortedAngles.length);
      }
      setStartX(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev - 1 + sortedAngles.length) % sortedAngles.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % sortedAngles.length);
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleEnhanceAll = () => {
    navigate('/processing', {
      state: {
        capturedAngles,
        mode
      }
    });
  };

  if (sortedAngles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No angles to display</p>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentAngle = sortedAngles[currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/angle-review', { state: { capturedAngles, mode } })}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <RotateCw size={16} className="text-primary" />
            <h1 className="text-lg font-semibold">360° View</h1>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4">
        {/* Instructions */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Swipe or drag left/right to rotate
          </p>
        </div>

        {/* 360 Viewer */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="w-full max-w-2xl aspect-[4/3] bg-muted rounded-2xl overflow-hidden relative">
            <img
              src={currentAngle.imageData}
              alt={currentAngle.angleLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Angle indicator overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white border-0">
                {currentAngle.angleLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Angle indicators */}
        <div className="flex justify-center gap-1.5 my-4">
          {sortedAngles.map((angle, index) => (
            <button
              key={angle.angleId}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleEnhanceAll}
          >
            <Sparkles className="mr-2" />
            Enhance All {capturedAngles.length} Photos
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/angle-review', { state: { capturedAngles, mode } })}
          >
            Back to Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default View360;
