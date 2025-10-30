import logoIcon from "@/assets/logo-icon.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 48, text: "text-2xl" },
    lg: { icon: 64, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse-glow" />
        <div className="relative">
          <img 
            src={logoIcon} 
            alt="Snap Your Car" 
            width={sizes[size].icon}
            height={sizes[size].icon}
            className="drop-shadow-lg"
          />
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
