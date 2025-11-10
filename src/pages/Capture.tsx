import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Camera as CameraIcon,
  Upload,
  Sparkles,
  Sun,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { allAngles } from "@/lib/mockData";
import { toast } from "sonner";
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface CapturedAngle {
  angleId: string;
  angleLabel: string;
  imageData: string;
  timestamp: number;
}

const Capture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingAngles = (location.state?.capturedAngles || []) as CapturedAngle[];
  const retakeAngleId = location.state?.retakeAngleId;
  
  const [selectedAngle, setSelectedAngle] = useState(retakeAngleId || allAngles[0].id);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedAngles, setCapturedAngles] = useState<CapturedAngle[]>(existingAngles);

  // Lock orientation to landscape on mount
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: 'landscape' }).catch(console.warn);
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        ScreenOrientation.unlock().catch(console.warn);
      }
    };
  }, []);

  const handleUploadFromGallery = async () => {
    try {
      const photo = await Camera.pickImages({
        quality: 90,
        limit: 1
      });
      
      if (photo.photos && photo.photos.length > 0) {
        const imageData = photo.photos[0].webPath;
        if (imageData) {
          setCapturedImage(imageData);
          setCaptured(true);
          
          if (Capacitor.isNativePlatform()) {
            await ScreenOrientation.lock({ orientation: 'portrait' });
          }
          
          toast.success("Photo loaded from gallery!");
        }
      }
    } catch (error) {
      console.error('Gallery error:', error);
      toast.error("Failed to load from gallery");
    }
  };

  const handleCapture = async () => {
    try {
      console.log("📸 Opening native camera...");
      
      const photo = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        direction: CameraDirection.Rear,
        allowEditing: false,
        saveToGallery: false,
        correctOrientation: true
      });
      
      if (photo.dataUrl) {
        console.log("✅ Photo captured successfully");
        setCapturedImage(photo.dataUrl);
        setCaptured(true);
        
        // Switch to portrait mode for preview
        if (Capacitor.isNativePlatform()) {
          await ScreenOrientation.lock({ orientation: 'portrait' });
        }
        
        toast.success("Photo captured!");
      }
    } catch (error: any) {
      console.error('❌ Camera error:', error);
      
      if (error.message !== 'User cancelled photos app') {
        toast.error("Camera failed. Please try again.");
      }
    }
  };

  const handleNextAngle = () => {
    if (!capturedImage) return;

    const currentAngle = allAngles.find(a => a.id === selectedAngle);
    if (!currentAngle) return;

    const newCapturedAngle: CapturedAngle = {
      angleId: selectedAngle,
      angleLabel: currentAngle.label,
      imageData: capturedImage,
      timestamp: Date.now()
    };

    const updatedAngles = retakeAngleId
      ? capturedAngles.map(a => a.angleId === retakeAngleId ? newCapturedAngle : a)
      : [...capturedAngles, newCapturedAngle];

    setCapturedAngles(updatedAngles);

    // Find next uncaptured angle
    const capturedIds = new Set(updatedAngles.map(a => a.angleId));
    const nextAngle = allAngles.find(a => !capturedIds.has(a.id));

    if (nextAngle) {
      setSelectedAngle(nextAngle.id);
      setCaptured(false);
      setCapturedImage(null);
      toast.success(`${updatedAngles.length} of ${allAngles.length} captured!`);
    } else {
      navigate('/angle-review', {
        state: {
          capturedAngles: updatedAngles
        }
      });
    }
  };

  const handleReviewAll = () => {
    navigate('/angle-review', {
      state: {
        capturedAngles
      }
    });
  };

  if (captured) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-card border-b border-border p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCaptured(false);
                setCapturedImage(null);
              }}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold">Preview</h1>
            <div className="w-8" />
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full aspect-[4/3] bg-muted rounded-2xl overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <Button
              size="lg"
              className="w-full"
              onClick={handleNextAngle}
            >
              <Sparkles className="mr-2" />
              {capturedAngles.length + 1 < allAngles.length ? 'Next Angle' : 'Review All'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setCaptured(false);
                  setCapturedImage(null);
                }}
              >
                Retake
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleReviewAll}
                disabled={capturedAngles.length === 0}
              >
                Review All {capturedAngles.length}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-row relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Left Sidebar - Angle Selector */}
      <div className="w-[20%] h-full bg-black/80 backdrop-blur-sm z-20 overflow-y-auto py-4">
        <div className="flex flex-col gap-3 px-2">
          {allAngles.map((angle) => {
            const isCaptured = capturedAngles.some(a => a.angleId === angle.id);
            const isSelected = selectedAngle === angle.id;
            const angleData = angle as any;
            
            return (
              <button
                key={angle.id}
                onClick={() => setSelectedAngle(angle.id)}
                className={`
                  relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all
                  ${isSelected ? 'border-primary scale-105 shadow-lg shadow-primary/50' : 'border-white/30'}
                  ${isCaptured ? 'ring-2 ring-green-500' : ''}
                `}
              >
                {/* SVG Preview Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                  {angleData.previewImage && (
                    <img 
                      src={angleData.previewImage} 
                      alt={angle.label}
                      className="w-full h-full p-2"
                      style={{
                        filter: 'invert(1) brightness(1.5)'
                      }}
                    />
                  )}
                </div>
                
                {/* Captured Checkmark */}
                {isCaptured && (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Angle Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2 text-center">
                  {angle.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Camera Area */}
      <div className="flex-1 h-full relative">
          {/* SVG Frame Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-[70%] h-[70%]">
            {/* Render actual SVG frame for selected angle */}
            {(() => {
              const selectedAngleData = allAngles.find(a => a.id === selectedAngle) as any;
              return selectedAngleData?.previewImage && (
                <img
                  src={selectedAngleData.previewImage}
                  alt="Guide frame"
                  className="w-full h-full animate-pulse"
                  style={{
                    opacity: 0.8,
                    filter: 'invert(1) brightness(2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
                  }}
                />
              );
            })()}
            
            {/* Corner guides */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white" />
          </div>
        </div>
        
        {/* Top Header */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/60 backdrop-blur-md text-white hover:bg-black/80 rounded-full w-12 h-12 shadow-[var(--elevation-3)]"
            onClick={() => navigate("/my-cars")}
          >
            <X size={24} strokeWidth={2.5} />
          </Button>
          
          <div className="bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-[var(--elevation-3)]">
            <span className="font-semibold text-sm">{allAngles.find(a => a.id === selectedAngle)?.label}</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 font-bold">
              {capturedAngles.length}/{allAngles.length}
            </Badge>
          </div>
          
          <div className="w-12 h-12" />
        </div>
        
        {/* Hint */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs z-20 shadow-[var(--elevation-2)]">
          <Sun size={16} className="inline mr-2" strokeWidth={2} />
          <span className="font-medium">Hold 2–3m away. Avoid direct sunlight</span>
        </div>
        
        {/* Vertical Controls - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-10 z-20">
          {/* Upload Button - Top */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-full w-16 h-16 shadow-[var(--elevation-3)]"
            onClick={handleUploadFromGallery}
          >
            <Upload size={28} strokeWidth={2} />
          </Button>
          
          {/* Capture Button - Middle */}
          <button
            onClick={handleCapture}
            className="w-24 h-24 rounded-full border-[6px] border-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all shadow-[var(--elevation-5)] active:scale-95 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-white" />
          </button>
          
          {/* Photo Count - Bottom */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-full w-16 h-16 shadow-[var(--elevation-3)]"
            onClick={handleReviewAll}
            disabled={capturedAngles.length === 0}
          >
            <span className="text-xl font-bold">{capturedAngles.length}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Capture;
