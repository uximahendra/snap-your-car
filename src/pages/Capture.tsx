import { useState } from "react";
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

  const angles = mode === "exterior" ? exteriorAngles : interiorAngles;

  const handleCapture = () => {
    // Mock capture - in real app would use device camera
    setCapturedImage("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop");
    setCaptured(true);
    toast.success("Photo captured!");
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
                onClick={() => setCaptured(false)}
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
      <div className="flex-1 relative bg-muted">
        {/* Mock camera preview */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700">
          <div className="text-white/50 text-center">
            <CameraIcon size={64} className="mx-auto mb-4" />
            <p className="text-sm">Camera preview</p>
          </div>

          {/* Ghost overlay */}
          <div className="ghost-overlay opacity-30" />
        </div>

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
