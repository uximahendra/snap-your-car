import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Camera as CameraIcon,
  Zap,
  ZapOff,
  Upload,
  Sparkles,
  Sun,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { exteriorAngles, interiorAngles } from "@/lib/mockData";
import { toast } from "sonner";
import { Camera } from '@capacitor/camera';
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
  const mode = location.state?.mode || 'exterior';
  const existingAngles = (location.state?.capturedAngles || []) as CapturedAngle[];
  const retakeAngleId = location.state?.retakeAngleId;

  const angles = mode === 'exterior' ? exteriorAngles : interiorAngles;
  
  const [selectedAngle, setSelectedAngle] = useState(retakeAngleId || angles[0].id);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedAngles, setCapturedAngles] = useState<CapturedAngle[]>(existingAngles);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera function (reusable)
  const initCamera = async () => {
    try {
      console.log("🎥 Initializing camera...");
      
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Lock to landscape orientation
      if (Capacitor.isNativePlatform()) {
        try {
          await ScreenOrientation.lock({ orientation: 'landscape' });
          console.log("✅ Screen locked to landscape");
        } catch (error) {
          console.warn("Could not lock orientation:", error);
        }
      }
      
      // Request camera permission on native platforms
      if (Capacitor.isNativePlatform()) {
        console.log("📱 Native platform detected, checking permissions...");
        
        const permissionResult = await Camera.checkPermissions();
        console.log("Permission status:", permissionResult);
        
        if (permissionResult.camera === 'denied') {
          console.log("Requesting camera permission...");
          const requestResult = await Camera.requestPermissions({ permissions: ['camera'] });
          console.log("Permission request result:", requestResult);
          
          if (requestResult.camera === 'denied') {
            setCameraError("Camera permission denied. Please enable camera access in your phone's settings.");
            toast.error("Camera access denied");
            return;
          }
        }
        
        console.log("✅ Camera permission granted");
      }

      console.log("Starting getUserMedia...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
      });

      console.log("✅ Camera stream obtained successfully");
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("✅ Video stream set to video element");
      }
      
      setCameraError(null);
    } catch (error: any) {
      console.error("❌ Camera error:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = "Unable to access camera. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Permission denied. Please allow camera access.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (error.name === 'NotReadableError') {
        errorMessage += "Camera is already in use by another app.";
      } else {
        errorMessage += error.message;
      }
      
      setCameraError(errorMessage);
      toast.error("Camera failed to start");
    }
  };

  // Initialize camera on mount
  useEffect(() => {
    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      
      // Unlock orientation on cleanup
      if (Capacitor.isNativePlatform()) {
        ScreenOrientation.unlock().catch(console.warn);
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      setCaptured(true);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast.success("Photo captured!");
    }
  };

  const handleNextAngle = () => {
    if (!capturedImage) return;

    const currentAngle = angles.find(a => a.id === selectedAngle);
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
    const nextAngle = angles.find(a => !capturedIds.has(a.id));

    if (nextAngle) {
      setSelectedAngle(nextAngle.id);
      setCaptured(false);
      setCapturedImage(null);
      initCamera();
      toast.success(`${updatedAngles.length} of ${angles.length} captured!`);
    } else {
      navigate('/angle-review', {
        state: {
          capturedAngles: updatedAngles,
          mode
        }
      });
    }
  };

  const handleReviewAll = () => {
    navigate('/angle-review', {
      state: {
        capturedAngles,
        mode
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
              {capturedAngles.length + 1 < angles.length ? 'Next Angle' : 'Review All'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setCaptured(false);
                  setCapturedImage(null);
                  initCamera();
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
    <div className="h-screen w-screen bg-black flex flex-row relative overflow-hidden">
      {/* Live camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Error state */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 z-30">
          <div className="text-white/50 text-center px-4">
            <CameraIcon size={64} className="mx-auto mb-4" />
            <p className="text-sm">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Left Sidebar - Angle Selector */}
      <div className="w-[20%] h-full bg-black/80 backdrop-blur-sm z-20 overflow-y-auto py-4">
        <div className="flex flex-col gap-3 px-2">
          {angles.map((angle) => {
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
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                  {angleData.previewImage && (
                    <img 
                      src={angleData.previewImage} 
                      alt={angle.label}
                      className="w-full h-full p-2 text-white"
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
              const selectedAngleData = angles.find(a => a.id === selectedAngle) as any;
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
        
        {/* Vertical Alignment Indicator - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative h-[60vh] w-1 bg-white/60 rounded-full">
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/80" />
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/80" />
            </div>
            
            {/* Tick marks */}
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 h-0.5 bg-white/60"
                style={{
                  top: `${i * 10}%`,
                  width: i === 5 ? '16px' : '8px',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Top Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full"
            onClick={() => navigate("/home")}
          >
            <X size={20} />
          </Button>
          
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span className="font-medium">{angles.find(a => a.id === selectedAngle)?.label}</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {capturedAngles.length}/{angles.length}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full"
            onClick={() => setFlash(!flash)}
          >
            {flash ? <Zap size={20} /> : <ZapOff size={20} />}
          </Button>
        </div>
        
        {/* Hint */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs z-20">
          <Sun size={14} className="inline mr-1" />
          Hold 2–3m away. Avoid direct sunlight
        </div>
        
        {/* Vertical Controls - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-20">
          {/* Upload Button - Top */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full w-14 h-14"
            onClick={() => toast.info("Upload from gallery")}
          >
            <Upload size={28} />
          </Button>
          
          {/* Capture Button - Middle */}
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-white" />
          </button>
          
          {/* Photo Count - Bottom */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full w-14 h-14"
            onClick={handleReviewAll}
            disabled={capturedAngles.length === 0}
          >
            <span className="text-lg font-bold">{capturedAngles.length}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Capture;
