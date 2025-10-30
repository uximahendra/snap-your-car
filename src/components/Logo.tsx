import { Camera } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse-glow" />
        <div className="relative bg-gradient-to-br from-primary to-secondary p-2 rounded-2xl">
          <Camera size={sizes[size].icon} className="text-white" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold text-accent leading-none`}>
            Snap Your Car
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">
            Showroom-ready photos
          </span>
        </div>
      )}
    </div>
  );
};
