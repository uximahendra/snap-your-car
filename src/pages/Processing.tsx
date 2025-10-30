import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { processingSteps } from "@/lib/mockData";
import { Check, Loader2 } from "lucide-react";

const Processing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= processingSteps.length) {
      setTimeout(() => navigate("/preview"), 500);
      return;
    }

    const step = processingSteps[currentStep];
    const progressInterval = step.duration / 20;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((s) => s + 1);
          return 0;
        }
        return prev + 5;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [currentStep, navigate]);

  const overallProgress = ((currentStep * 100 + progress) / processingSteps.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/95 to-accent/90 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="z-10 w-full max-w-md space-y-8 text-center">
        {/* Main icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse-glow" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center">
              <Loader2 size={48} className="text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Enhancing Your Photo
          </h1>
          <p className="text-white/80">
            {currentStep < processingSteps.length
              ? processingSteps[currentStep].label
              : "Finalizing"}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <Progress value={overallProgress} className="h-2" />
          <p className="text-white/70 text-sm">
            {Math.round(overallProgress)}% complete • Est. {Math.max(1, 10 - Math.floor(overallProgress / 10))}s
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 space-y-2">
          {processingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index === currentStep
                  ? "bg-white/20"
                  : index < currentStep
                  ? "bg-success/20"
                  : "bg-transparent"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index < currentStep
                    ? "bg-success"
                    : index === currentStep
                    ? "bg-primary"
                    : "bg-white/20"
                }`}
              >
                {index < currentStep ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <span className="text-xs text-white font-bold">
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-white" : "text-white/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Cancel */}
        <Button
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10"
          onClick={() => navigate("/home")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Processing;
