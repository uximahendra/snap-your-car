import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { processingSteps } from "@/lib/mockData";
import { CarImage } from "@/lib/mockData";

interface CapturedAngle {
  angleId: string;
  angleLabel: string;
  imageData: string;
  timestamp: number;
}

interface EnhancedAngle extends CarImage {
  originalImage: string;
  enhancedImage: string;
}

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedAngles = (location.state?.capturedAngles || []) as CapturedAngle[];
  const mode = location.state?.mode || 'exterior';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [enhancedImages, setEnhancedImages] = useState<EnhancedAngle[]>([]);

  useEffect(() => {
    if (currentAngleIndex >= capturedAngles.length) {
      // All angles processed
      setTimeout(() => {
        navigate("/enhance-multi", {
          state: {
            enhancedImages,
            mode
          }
        });
      }, 500);
      return;
    }

    const stepDuration = processingSteps[currentStep]?.duration || 1000;
    const progressIncrement = 100 / (stepDuration / 100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          clearInterval(interval);
          if (currentStep < processingSteps.length - 1) {
            setTimeout(() => {
              setCurrentStep((prev) => prev + 1);
              setProgress(0);
            }, 200);
          } else {
            // Finished processing this angle
            const currentAngle = capturedAngles[currentAngleIndex];
            const enhanced: EnhancedAngle = {
              id: `enhanced_${currentAngle.angleId}`,
              angle: currentAngle.angleLabel,
              status: 'processed' as const,
              before: currentAngle.imageData,
              after: currentAngle.imageData,
              originalImage: currentAngle.imageData,
              enhancedImage: currentAngle.imageData
            };
            
            setEnhancedImages(prev => [...prev, enhanced]);
            
            setTimeout(() => {
              setCurrentAngleIndex(prev => prev + 1);
              setCurrentStep(0);
              setProgress(0);
            }, 300);
          }
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, currentAngleIndex, capturedAngles, navigate, enhancedImages, mode]);

  const angleProgress = capturedAngles.length > 0
    ? ((currentAngleIndex) / capturedAngles.length) * 100
    : 0;
  
  const overallProgress =
    ((currentStep + 1) / processingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-background to-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="z-10 w-full max-w-2xl space-y-8">
        {/* Current angle being processed */}
        {capturedAngles.length > 0 && (
          <div className="mb-6">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Processing {currentAngleIndex + 1} of {capturedAngles.length} angles
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
              {capturedAngles.map((angle, idx) => (
                <div
                  key={angle.angleId}
                  className={`aspect-square rounded-lg overflow-hidden border-2 relative ${
                    idx < currentAngleIndex
                      ? 'border-success'
                      : idx === currentAngleIndex
                      ? 'border-primary'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={angle.imageData}
                    alt={angle.angleLabel}
                    className="w-full h-full object-cover"
                  />
                  {idx < currentAngleIndex && (
                    <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-success" />
                    </div>
                  )}
                  {idx === currentAngleIndex && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Loader2 size={20} className="text-primary animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main processing icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles size={48} className="text-primary" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={96} className="text-primary/20 animate-spin" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">
          {capturedAngles.length > 0 && currentAngleIndex < capturedAngles.length
            ? `Enhancing ${capturedAngles[currentAngleIndex].angleLabel}`
            : 'Enhancing Your Photos'}
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          AI is working its magic...
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3 rounded-full" />
          <p className="text-center text-sm text-muted-foreground">
            {Math.round(overallProgress)}% Complete
          </p>
        </div>

        {/* Processing steps */}
        <div className="card-elevated p-6 space-y-3">
          {processingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index === currentStep
                  ? "bg-primary/10"
                  : index < currentStep
                  ? "bg-success/10"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index < currentStep
                    ? "bg-success text-success-foreground"
                    : index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 size={16} />
                ) : index === currentStep ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? "" : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cancel button */}
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Processing;
