import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, X, AlertCircle } from "lucide-react";
import { CarSession, CarImage } from "@/lib/mockData";
import { processImage, initializeBackgroundRemoval } from "@/lib/backgroundRemoval";
import { updateSession } from "@/lib/storage";
import { toast } from "sonner";

const BackgroundRemovalProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session as CarSession;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing...");
  const [processedImages, setProcessedImages] = useState<CarImage[]>([]);
  const [modelProgress, setModelProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate("/my-cars");
      return;
    }

    // Initialize model first
    const initModel = async () => {
      try {
        setCurrentStep("Loading AI model...");
        await initializeBackgroundRemoval((progress) => {
          setModelProgress(Math.round(progress * 100));
        });
        setIsInitializing(false);
        setModelProgress(100);
      } catch (error) {
        console.error("Error initializing model:", error);
        toast.error("Failed to load AI model");
      }
    };

    initModel();
  }, [session, navigate]);

  useEffect(() => {
    if (!session || isInitializing || currentIndex >= session.images.length) return;

    const processCurrentImage = async () => {
      const currentImage = session.images[currentIndex];
      
      try {
        setCurrentStep(`Processing ${currentImage.angle}...`);
        
        // Process the image
        const backgroundRemovedUrl = await processImage(
          currentImage.before,
          (step) => setCurrentStep(step)
        );

        // Update processed images
        const updatedImage: CarImage = {
          ...currentImage,
          backgroundRemoved: backgroundRemovedUrl
        };

        setProcessedImages(prev => [...prev, updatedImage]);
        
        // Update progress
        const newProgress = ((currentIndex + 1) / session.images.length) * 100;
        setProgress(newProgress);
        
        // Move to next image
        setCurrentIndex(prev => prev + 1);
        
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(`Failed to process ${currentImage.angle}`);
        
        // Skip failed image and continue
        setProcessedImages(prev => [...prev, currentImage]);
        setCurrentIndex(prev => prev + 1);
      }
    };

    processCurrentImage();
  }, [currentIndex, session, isInitializing]);

  useEffect(() => {
    if (!session) return;
    
    if (processedImages.length === session.images.length && processedImages.length > 0) {
      // All images processed, update session and navigate
      const updatedSession: CarSession = {
        ...session,
        images: processedImages,
        backgroundsRemoved: true
      };
      
      updateSession(updatedSession);
      
      setTimeout(() => {
        navigate("/showroom-selection", { 
          state: { session: updatedSession },
          replace: true 
        });
      }, 500);
    }
  }, [processedImages, session, navigate]);

  if (!session) return null;

  const totalImages = session.images.length;
  const completedImages = processedImages.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">Removing Backgrounds</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-cars")}
          >
            <X size={20} />
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Model Initialization Progress */}
        {isInitializing && (
          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={24} />
              <div>
                <p className="font-medium">Loading AI Model</p>
                <p className="text-sm text-muted-foreground">
                  First time setup - this may take a moment
                </p>
              </div>
            </div>
            <Progress value={modelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {modelProgress}% complete
            </p>
          </div>
        )}

        {/* Processing Progress */}
        {!isInitializing && (
          <>
            {/* Overall Progress */}
            <div className="card-elevated p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Processing Images</h2>
                <span className="text-sm text-muted-foreground">
                  {completedImages}/{totalImages}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-4 gap-3">
              {session.images.map((image, index) => {
                const isProcessed = index < completedImages;
                const isProcessing = index === currentIndex;
                const isPending = index > currentIndex;

                return (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    <img
                      src={image.before}
                      alt={image.angle}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      isProcessed ? 'bg-success/20' :
                      isProcessing ? 'bg-primary/20' :
                      'bg-black/40'
                    }`}>
                      {isProcessed && (
                        <CheckCircle2 className="text-success drop-shadow-lg" size={32} />
                      )}
                      {isProcessing && (
                        <Loader2 className="text-primary animate-spin drop-shadow-lg" size={32} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-center bg-black/70 text-white rounded py-0.5 backdrop-blur-sm">
                      {image.angle}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Processing Steps */}
            <div className="card-elevated p-4 space-y-3">
              <h3 className="text-sm font-semibold">Processing Steps</h3>
              <div className="space-y-2">
                {[
                  "Loading AI Model",
                  "Detecting Car Object",
                  "Creating Mask",
                  "Removing Background",
                  "Optimizing Quality"
                ].map((step, index) => {
                  const stepCompleted = currentStep.includes(step.toLowerCase()) || 
                                       completedImages > 0;
                  
                  return (
                    <div key={step} className="flex items-center gap-3">
                      {stepCompleted ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={`text-sm ${
                        stepCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <AlertCircle size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Processing locally</p>
                <p>Your images are processed on your device for privacy. This may take 10-15 seconds per image.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemovalProcessing;
