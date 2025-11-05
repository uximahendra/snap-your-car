import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Save, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { backgrounds } from "@/lib/mockData";
import { toast } from "sonner";
import {
  processImage,
  downloadImage,
  downloadAllAsZip,
  BackgroundConfig,
  ColorAdjustments
} from "@/lib/imageProcessing";
import { saveSessionToLocalStorage, generateSessionId } from "@/lib/storage";
import { CarImage } from "@/lib/mockData";

interface EnhancedAngle extends CarImage {
  originalImage: string;
  enhancedImage: string;
}

const EnhanceMulti = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const enhancedImages = (location.state?.enhancedImages || []) as EnhancedAngle[];
  const mode = location.state?.mode || 'exterior';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState([50]);
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [watermark, setWatermark] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Color adjustments
  const [saturation, setSaturation] = useState([100]);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([100]);
  const [warmth, setWarmth] = useState([0]);

  const [localEnhancedImages, setLocalEnhancedImages] = useState(enhancedImages);

  const currentImage = localEnhancedImages[currentIndex];

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

  // Apply enhancements when settings change
  useEffect(() => {
    if (!currentImage) return;

    const applyEnhancements = async () => {
      setProcessing(true);
      try {
        const bgConfig: BackgroundConfig = {
          type: selectedBg as any
        };

        const adjustments: ColorAdjustments = {
          saturation: saturation[0] / 100,
          brightness: brightness[0],
          contrast: contrast[0],
          warmth: warmth[0]
        };

        const enhanced = await processImage(
          currentImage.originalImage,
          bgConfig,
          adjustments,
          'Auto Studio',
          watermark
        );

        setLocalEnhancedImages(prev => {
          const updated = [...prev];
          updated[currentIndex] = {
            ...updated[currentIndex],
            enhancedImage: enhanced
          };
          return updated;
        });
      } catch (error) {
        console.error('Enhancement error:', error);
        toast.error('Failed to apply enhancements');
      } finally {
        setProcessing(false);
      }
    };

    const debounce = setTimeout(applyEnhancements, 300);
    return () => clearTimeout(debounce);
  }, [selectedBg, saturation, brightness, contrast, warmth, watermark, currentIndex]);

  const handleSave = () => {
    const sessionId = generateSessionId();
    const sessionTitle = `${mode === 'exterior' ? 'Exterior' : 'Interior'} - ${new Date().toLocaleDateString()}`;

    const carSession = {
      id: sessionId,
      title: sessionTitle,
      date: new Date().toISOString(),
      images: localEnhancedImages.map((img, idx) => ({
        ...img,
        id: `${sessionId}_img_${idx}`
      })),
      mode
    };

    saveSessionToLocalStorage(carSession);
    toast.success("Saved to Gallery!");
    setTimeout(() => navigate("/gallery"), 1000);
  };

  const handleDownloadCurrent = () => {
    if (currentImage) {
      downloadImage(
        currentImage.enhancedImage,
        `${currentImage.angle.toLowerCase().replace(/\s+/g, '-')}.jpg`
      );
      toast.success("Downloading image...");
    }
  };

  const handleDownloadAll = async () => {
    const images = localEnhancedImages.map(img => ({
      imageUrl: img.enhancedImage,
      angle: img.angle
    }));

    await downloadAllAsZip(images, `car-session-${Date.now()}`);
    toast.success("Downloading all images as ZIP...");
  };

  const handleApplyToAll = async () => {
    setProcessing(true);
    toast.info("Applying settings to all images...");

    try {
      const bgConfig: BackgroundConfig = {
        type: selectedBg as any
      };

      const adjustments: ColorAdjustments = {
        saturation: saturation[0] / 100,
        brightness: brightness[0],
        contrast: contrast[0],
        warmth: warmth[0]
      };

      const updated = await Promise.all(
        localEnhancedImages.map(async (img) => {
          const enhanced = await processImage(
            img.originalImage,
            bgConfig,
            adjustments,
            'Auto Studio',
            watermark
          );
          return {
            ...img,
            enhancedImage: enhanced
          };
        })
      );

      setLocalEnhancedImages(updated);
      toast.success("Settings applied to all images!");
    } catch (error) {
      toast.error("Failed to apply settings");
    } finally {
      setProcessing(false);
    }
  };

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No images to enhance</p>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </Button>
          <Badge variant="secondary">
            {currentIndex + 1} of {localEnhancedImages.length}
          </Badge>
          <div className="w-8" />
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Image Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </Button>
          <h2 className="text-lg font-semibold">{currentImage.angle}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(localEnhancedImages.length - 1, currentIndex + 1))}
            disabled={currentIndex === localEnhancedImages.length - 1}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Before/After Slider */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Before & After</h3>
          <div className="relative w-full aspect-[4/3] bg-muted rounded-2xl overflow-hidden">
            <img
              src={currentImage.enhancedImage}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}
            >
              <img
                src={currentImage.originalImage}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderValue[0]}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary rounded-full" />
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              After
            </div>
            {processing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-sm">Processing...</div>
              </div>
            )}
          </div>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Background picker */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Background</h3>
          <div className="grid grid-cols-4 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBg(bg.id)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedBg === bg.id
                    ? "border-primary shadow-md"
                    : "border-border"
                }`}
              >
                <div className={`w-full h-full ${bg.thumbnail}`} />
                <p className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-center bg-black/50 text-white rounded py-0.5 backdrop-blur-sm">
                  {bg.label.split(" ")[0]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Adjustments */}
        <div className="card-elevated p-4 space-y-4">
          <h3 className="text-lg font-semibold">Adjustments</h3>
          
          <div className="space-y-3">
            <div>
              <Label>Saturation: {saturation[0]}%</Label>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                min={0}
                max={200}
                step={1}
              />
            </div>

            <div>
              <Label>Brightness: {brightness[0]}</Label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                min={-50}
                max={50}
                step={1}
              />
            </div>

            <div>
              <Label>Contrast: {contrast[0]}%</Label>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                min={50}
                max={150}
                step={1}
              />
            </div>

            <div>
              <Label>Warmth: {warmth[0]}</Label>
              <Slider
                value={warmth}
                onValueChange={setWarmth}
                min={-30}
                max={30}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Label htmlFor="watermark">Watermark</Label>
              <Switch
                id="watermark"
                checked={watermark}
                onCheckedChange={setWatermark}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            size="lg"
            className="w-full"
            onClick={handleApplyToAll}
            variant="outline"
            disabled={processing}
          >
            <Copy className="mr-2" />
            Apply to All {localEnhancedImages.length} Images
          </Button>

          <Button size="lg" className="w-full" onClick={handleSave}>
            <Save className="mr-2" />
            Save All to Gallery
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={handleDownloadCurrent}>
              <Download className="mr-2" size={18} />
              This Image
            </Button>
            <Button variant="outline" size="lg" onClick={handleDownloadAll}>
              <Download className="mr-2" size={18} />
              All as ZIP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhanceMulti;
