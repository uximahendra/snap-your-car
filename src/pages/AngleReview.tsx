import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Camera, Sparkles } from "lucide-react";

interface CapturedAngle {
  angleId: string;
  angleLabel: string;
  imageData: string;
  timestamp: number;
}

const AngleReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedAngles = (location.state?.capturedAngles || []) as CapturedAngle[];
  const mode = location.state?.mode || 'exterior';

  if (capturedAngles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No angles captured yet</p>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleRetake = (angleId: string) => {
    navigate('/capture', {
      state: {
        mode,
        capturedAngles,
        retakeAngleId: angleId
      }
    });
  };

  const handleEnhanceAll = () => {
    navigate('/processing', {
      state: {
        capturedAngles,
        mode
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/capture', { state: { mode, capturedAngles } })}
          >
            <ArrowLeft size={20} />
          </Button>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 size={14} className="mr-1" />
            {capturedAngles.length} of 7 captured
          </Badge>
          <div className="w-8" />
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Review Your Photos</h1>
          <p className="text-muted-foreground">
            Check each angle before enhancement
          </p>
        </div>

        {/* Angle Grid */}
        <div className="grid grid-cols-2 gap-4">
          {capturedAngles.map((angle, index) => (
            <div
              key={angle.angleId}
              className="relative group card-elevated overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative">
                <img
                  src={angle.imageData}
                  alt={angle.angleLabel}
                  className="w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRetake(angle.angleId)}
                  >
                    <Camera size={16} className="mr-2" />
                    Retake
                  </Button>
                </div>
              </div>

              {/* Angle Info */}
              <div className="p-3 bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1">
                      {index + 1}
                    </Badge>
                    <p className="text-sm font-medium">{angle.angleLabel}</p>
                  </div>
                  <CheckCircle2 size={20} className="text-success" />
                </div>
              </div>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 7 - capturedAngles.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-[4/3] relative rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center"
            >
              <Camera size={32} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Angle {capturedAngles.length + index + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleEnhanceAll}
            disabled={capturedAngles.length === 0}
          >
            <Sparkles className="mr-2" />
            Enhance All {capturedAngles.length} Photos
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/capture', { state: { mode, capturedAngles } })}
          >
            <Camera className="mr-2" />
            Continue Capturing
          </Button>
        </div>

        {/* Progress Info */}
        {capturedAngles.length < 7 && (
          <div className="text-center text-sm text-muted-foreground">
            {7 - capturedAngles.length} more {7 - capturedAngles.length === 1 ? 'angle' : 'angles'} remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default AngleReview;
