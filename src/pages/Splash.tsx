import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate after animation (optional)
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/95 to-accent/90 flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 animate-slide-up">
        <Logo size="lg" showText={true} />
        
        <p className="text-accent-foreground/90 text-lg text-center mt-6 max-w-sm font-medium">
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
            variant="outline" 
            size="lg" 
            className="w-full border-white/30 text-white hover:bg-white/10"
            onClick={() => navigate("/home")}
          >
            Try Demo
          </Button>
        </div>
      </div>

      <p className="text-accent-foreground/60 text-xs text-center z-10">
        Professional AI enhancement • Lifetime access
      </p>
    </div>
  );
};

export default Splash;
