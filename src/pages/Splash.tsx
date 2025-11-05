import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 animate-slide-up">
        <Logo size="lg" showText={true} />
        
        <p className="text-muted-foreground text-lg text-center mt-6 max-w-sm font-medium">
          Make your car photos showroom-ready in one tap
        </p>

        <div className="mt-12 space-y-4 w-full max-w-sm">
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Try Demo
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground/60 text-xs text-center z-10">
        Professional AI enhancement • Lifetime access
      </p>
    </div>
  );
};

export default Splash;
