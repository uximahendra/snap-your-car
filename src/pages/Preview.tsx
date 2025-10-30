import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Save, CheckCircle2 } from "lucide-react";
import { backgrounds } from "@/lib/mockData";
import { toast } from "sonner";

const Preview = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState([50]);
  const [selectedBg, setSelectedBg] = useState(backgrounds[0].id);
  const [watermark, setWatermark] = useState(true);

  const beforeImage = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop";
  const afterImage = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&sat=1.3&con=1.2&brightness=1.1";

  const handleSave = () => {
    toast.success("Saved to My Cars!");
    setTimeout(() => navigate("/gallery"), 1000);
  };

  const handleDownload = () => {
    toast.success("Downloading high-res image...");
  };

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
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 size={14} className="mr-1" />
            Enhanced
          </Badge>
          <div className="w-8" />
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Before/After Slider */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Before & After</h2>
          <div className="relative w-full aspect-[4/3] bg-muted rounded-2xl overflow-hidden">
            {/* After image (full) */}
            <img
              src={afterImage}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Before image (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderValue[0]}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary rounded-full" />
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              After
            </div>
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
          <h2 className="text-lg font-semibold">Background</h2>
          <div className="grid grid-cols-4 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBg(bg.id)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all interactive-scale ${
                  selectedBg === bg.id
                    ? "border-primary shadow-md"
                    : "border-border"
                }`}
              >
                <div className={`w-full h-full ${bg.thumbnail}`} />
                {selectedBg === bg.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-primary drop-shadow-lg" />
                  </div>
                )}
                <p className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-center bg-black/50 text-white rounded py-0.5 backdrop-blur-sm">
                  {bg.label.split(" ")[0]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="card-elevated p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark">Watermark</Label>
            <Switch
              id="watermark"
              checked={watermark}
              onCheckedChange={setWatermark}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Angle</p>
              <p className="text-sm font-medium">Front</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-sm font-medium">98%</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button size="lg" className="w-full" onClick={handleSave}>
            <Save className="mr-2" />
            Save to Gallery
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={handleDownload}>
              <Download className="mr-2" size={18} />
              Download
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toast.info("Applied to all angles")}
            >
              Apply to All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
