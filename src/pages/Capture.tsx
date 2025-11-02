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

  // Initialize camera - Use HTML5 camera for ALL platforms
  useEffect(() => {
    const initCamera = async () => {
      try {
        // Request camera permission on native platforms
        if (Capacitor.isNativePlatform()) {
          const permissionResult = await Camera.checkPermissions();
          
          if (permissionResult.camera === 'denied') {
            const requestResult = await Camera.requestPermissions({ permissions: ['camera'] });
            
            if (requestResult.camera === 'denied') {
              setCameraError("Camera permission denied. Please enable camera access in your phone's settings.");
              toast.error("Camera access denied");
              return;
            }
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera error:", error);
        setCameraError("Unable to access camera. Please grant camera permissions.");
        toast.error("Camera access denied");
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 z-20">
          <div className="text-white/50 text-center px-4">
            <CameraIcon size={64} className="mx-auto mb-4" />
            <p className="text-sm">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Camera UI Overlay */}
      <div className="absolute inset-0 z-10">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 rounded-full"
              onClick={() => navigate("/home")}
            >
              <X size={20} />
            </Button>
            <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              {angles.find((a) => a.id === selectedAngle)?.label}
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
        </header>

        {/* Center guide frame */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-full max-w-md aspect-[4/3] border-2 border-white/50 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl" />
          </div>
        </div>

        {/* Hint */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs">
          <Sun size={14} className="inline mr-1" />
          Hold 2–3m away. Avoid direct sunlight
        </div>

        {/* Angle selector */}
        <div className="absolute bottom-32 left-0 right-0 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {angles.map((angle) => {
              const isCaptured = capturedAngles.some(a => a.angleId === angle.id);
              return (
                <Button
                  key={angle.id}
                  variant={selectedAngle === angle.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedAngle(angle.id)}
                  className="flex-shrink-0 text-xs relative"
                >
                  {angle.label}
                  {isCaptured && (
                    <CheckCircle2 className="ml-1 text-success w-3 h-3" />
                  )}
                </Button>
              );
            })}
          </div>
          {capturedAngles.length > 0 && (
            <div className="text-center mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReviewAll}
                className="bg-white/90 hover:bg-white"
              >
                Review All {capturedAngles.length}
              </Button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-md mx-auto flex items-center justify-around px-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => toast.info("Upload from gallery")}
            >
              <Upload size={24} />
            </Button>

            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white/10 backdrop-blur-sm interactive-scale hover:bg-white/20 transition-all flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full"
              onClick={handleReviewAll}
              disabled={capturedAngles.length === 0}
            >
              <span className="text-sm font-bold">{capturedAngles.length}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capture;
