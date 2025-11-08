import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { CarSession, CarImage } from "@/lib/mockData";
import { showroomBackgrounds } from "@/lib/showroomBackgrounds";
import { updateSession } from "@/lib/storage";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

const ShowroomSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session as CarSession;

  const [sameForAll, setSameForAll] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<Record<string, string>>({});
  const [globalBackground, setGlobalBackground] = useState(showroomBackgrounds[0].id);

  if (!session) {
    navigate("/my-cars");
    return null;
  }

  const currentImage = session.images[currentImageIndex];

  const handleBackgroundSelect = (backgroundId: string) => {
    if (sameForAll) {
      setGlobalBackground(backgroundId);
    } else {
      setSelectedBackgrounds(prev => ({
        ...prev,
        [currentImage.id]: backgroundId
      }));
    }
  };

  const getSelectedBackground = (imageId: string) => {
    if (sameForAll) return globalBackground;
    return selectedBackgrounds[imageId] || showroomBackgrounds[0].id;
  };

  const handleSave = () => {
    // Update all images with their selected backgrounds
    const updatedImages: CarImage[] = session.images.map(image => ({
      ...image,
      showroomId: getSelectedBackground(image.id),
      showroomBackground: showroomBackgrounds.find(
        bg => bg.id === getSelectedBackground(image.id)
      )?.backgroundImage || showroomBackgrounds[0].backgroundImage
    }));

    const updatedSession: CarSession = {
      ...session,
      images: updatedImages,
      showroomApplied: true
    };

    updateSession(updatedSession);
    toast.success("Showroom backgrounds applied!");
    
    setTimeout(() => {
      navigate(`/session/${session.id}`, { replace: true });
    }, 500);
  };

  const currentBackground = showroomBackgrounds.find(
    bg => bg.id === getSelectedBackground(currentImage.id)
  ) || showroomBackgrounds[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-28">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-6 sticky top-0 z-10 shadow-[var(--elevation-2)]">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/my-cars")}
              >
                <ArrowLeft size={22} />
              </Button>
              <h1 className="text-lg font-semibold">Showroom Backgrounds</h1>
              <div className="w-11" />
            </div>
            <p className="text-sm text-muted-foreground">
              Choose professional backgrounds for your car photos
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Preview Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preview</h2>
              {!sameForAll && (
                <span className="text-sm text-muted-foreground">
                  {currentImageIndex + 1} / {session.images.length}
                </span>
              )}
            </div>
            
            <div 
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${currentBackground.backgroundImage})` }}
            >
              {currentImage.backgroundRemoved ? (
                <img
                  src={currentImage.backgroundRemoved}
                  alt={currentImage.angle}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentImage.before}
                  alt={currentImage.angle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            {/* Image Navigation (Individual mode only) */}
            {!sameForAll && session.images.length > 1 && (
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <div className="flex-1 text-center">
                  <p className="text-sm font-medium">{currentImage.angle}</p>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentImageIndex(prev => Math.min(session.images.length - 1, prev + 1))}
                  disabled={currentImageIndex === session.images.length - 1}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>

          {/* Background Options */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Select Background</h2>
            <div className="grid grid-cols-3 gap-3">
              {showroomBackgrounds.map((bg) => {
                const isSelected = bg.id === getSelectedBackground(currentImage.id);
                
                return (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundSelect(bg.id)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all interactive-scale ${
                      isSelected
                        ? "border-primary shadow-md"
                        : "border-border"
                    }`}
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${bg.thumbnail})` }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-primary drop-shadow-lg" />
                      </div>
                    )}
                    <p className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-center bg-black/70 text-white rounded py-1 backdrop-blur-sm">
                      {bg.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Application Mode */}
          <div className="card-elevated p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="same-for-all" className="text-base font-semibold">
                  Same for All Images
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Apply one background to all photos
                </p>
              </div>
              <Switch
                id="same-for-all"
                checked={sameForAll}
                onCheckedChange={setSameForAll}
              />
            </div>

            {!sameForAll && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Individual mode: Choose different backgrounds for each angle
                </p>
              </div>
            )}
          </div>

          {/* Image Thumbnails (Individual mode) */}
          {!sameForAll && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">All Angles</h3>
              <div className="grid grid-cols-4 gap-2">
                {session.images.map((image, index) => {
                  const bgId = getSelectedBackground(image.id);
                  const bg = showroomBackgrounds.find(b => b.id === bgId);
                  const isActive = index === currentImageIndex;

                  return (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        isActive ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${bg?.thumbnail})` }}
                      />
                      <img
                        src={image.backgroundRemoved || image.before}
                        alt={image.angle}
                        className="relative w-full h-full object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-[9px] font-medium text-center bg-black/70 text-white py-0.5">
                        {image.angle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10 shadow-[var(--elevation-4)]">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleSave}
            >
              <Save size={20} />
              <span className="ml-2">Apply & Save</span>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ShowroomSelection;
