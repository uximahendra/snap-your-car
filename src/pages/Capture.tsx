import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera as CameraIcon,
  Zap,
  ZapOff,
  Upload,
  Sparkles,
  Sun,
} from "lucide-react";
import { exteriorAngles, interiorAngles } from "@/lib/mockData";
import { toast } from "sonner";

const Capture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") as "exterior" | "interior" || "exterior";
  
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const angles = mode === "exterior" ? exteriorAngles : interiorAngles;

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment", // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
        setCameraError("Unable to access camera. Please grant camera permissions.");
        toast.error("Camera access denied");
      }
    };

    initCamera();

    // Cleanup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      setCaptured(true);
      
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast.success("Photo captured!");
    }
  };

  const handleEnhance = () => {
    navigate("/processing");
  };

  if (captured) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-card border-b border-border p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCaptured(false)}
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
              onClick={handleEnhance}
            >
              <Sparkles className="mr-2" />
              Enhance Now
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={async () => {
                  setCaptured(false);
                  // Restart camera
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: { 
                        facingMode: "environment",
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                      },
                      audio: false
                    });
                    
                    if (videoRef.current) {
                      videoRef.current.srcObject = stream;
                      streamRef.current = stream;
                    }
                  } catch (error) {
                    console.error("Camera access error:", error);
                    toast.error("Unable to restart camera");
                  }
                }}
              >
                Retake
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toast.success("Saved to drafts")}
              >
                Use Photo
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </Button>
          <Badge variant="secondary" className="capitalize">
            {mode}
          </Badge>
          <div className="w-8" />
        </div>
      </header>

      {/* Camera View */}
      <div className="flex-1 relative bg-muted overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700">
            <div className="text-white/50 text-center px-4">
              <CameraIcon size={64} className="mx-auto mb-4" />
              <p className="text-sm">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Angle rail */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-3">
          {angles.map((angle, index) => (
            <button
              key={angle.id}
              onClick={() => setSelectedAngle(index)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all interactive-scale ${
                selectedAngle === index
                  ? "bg-primary border-primary shadow-cta"
                  : "bg-card/80 border-white/30 backdrop-blur-sm"
              }`}
            >
              <span className={`text-xs font-bold ${
                selectedAngle === index ? "text-white" : "text-foreground"
              }`}>
                {index + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs">
          <Sun size={14} className="inline mr-1" />
          Hold 2–3m away. Avoid direct sunlight
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
              className="text-white"
              onClick={() => setFlash(!flash)}
            >
              {flash ? <Zap size={24} /> : <ZapOff size={24} />}
            </Button>
          </div>
        </div>

        {/* Angle label */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
          <p className="text-sm font-medium">{angles[selectedAngle].label}</p>
        </div>
      </div>
    </div>
  );
};

export default Capture;
